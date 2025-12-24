"""
Hikaze Model Manager 2 - custom ComfyUI node scaffold.

This module registers a ComfyExtension entrypoint so the project is discoverable.
Node implementations should live in this package and be returned from
HikazeModelManagerExtension.get_node_list().
"""

import logging
import atexit
import threading
import os
import sys
from typing import Optional

# Add the current directory to sys.path to allow absolute imports of internal packages (like 'backend')
# This is necessary because ComfyUI's dynamic loader doesn't add custom node roots to sys.path.
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

from comfy_api.latest import ComfyExtension, io

from .checkpoint_loader import HikazeCheckpointLoader
from .lora_power_loader import HikazeLoraPowerLoader

from backend.database import DatabaseManager
from backend.migration.manager import MigrationManager
from backend.server import HikazeServer

LOGGER = logging.getLogger(__name__)

# Global reference to server instance for shutdown
_hikaze_server: Optional[HikazeServer] = None


class HikazeModelManagerExtension(ComfyExtension):
    async def on_load(self) -> None:
        """
        Place any one-time initialization here (e.g., scanning models, warming caches).
        """
        LOGGER.info("HikazeModelManagerExtension.on_load from %s", __file__)

    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        """
        Return a list of io.ComfyNode subclasses to expose to ComfyUI.
        """
        node_list = [
            HikazeCheckpointLoader,
            HikazeLoraPowerLoader,
        ]
        LOGGER.info(
            "HikazeModelManagerExtension.get_node_list from %s -> %s",
            __file__,
            [getattr(n, "__name__", str(n)) for n in node_list],
        )
        return node_list


def init_services():
    """Initialize Database, Migration Manager, and Web Server."""
    global _hikaze_server
    
    # 1. Determine Port
    base_port = 8188
    try:
        from comfy.cli_args import args
        if hasattr(args, "port"):
            base_port = args.port
    except ImportError:
        LOGGER.warning("Could not import comfy.cli_args, defaulting base port to 8188")
    
    # 2. Initialize Database
    try:
        LOGGER.info("Initializing Hikaze Database...")
        db_mgr = DatabaseManager()
        db_mgr.init_db()
    except Exception as e:
        LOGGER.error(f"Failed to initialize database: {e}")
        # We might want to halt or continue with reduced functionality
        # For now, we continue but server might fail to serve data
    
    # 3. Check/Resume Migrations
    try:
        LOGGER.info("Checking for pending migrations...")
        migration_mgr = MigrationManager()
        # This starts the worker thread if there are pending items in the DB
        migration_mgr.resume_processing()
    except Exception as e:
        LOGGER.error(f"Failed to initialize migration manager: {e}")

    # 4. Start Web Server
    # We attempt to start on ComfyUI port + 1
    server_port = base_port + 1
    LOGGER.info(f"Starting Hikaze Server (base port: {server_port})...")
    
    _hikaze_server = HikazeServer(port=server_port)
    _hikaze_server.start()
    
    # Register shutdown handler
    atexit.register(stop_services)


def stop_services():
    """Stop all background services."""
    global _hikaze_server
    
    LOGGER.info("Stopping Hikaze services...")
    
    # Stop Server
    if _hikaze_server:
        LOGGER.info("Stopping Web Server...")
        _hikaze_server.stop()
        # Use a timeout for join to prevent hanging
        _hikaze_server.join(timeout=5.0)
        _hikaze_server = None
        
    # Stop Migration Worker
    try:
        migration_mgr = MigrationManager()
        if migration_mgr.is_processing():
            LOGGER.info("Stopping Migration Worker...")
            migration_mgr.pause_processing()
    except Exception as e:
        LOGGER.error(f"Error stopping migration manager: {e}")
        
    LOGGER.info("Hikaze services stopped.")


async def comfy_entrypoint() -> ComfyExtension:
    """
    Entry point called by ComfyUI when loading custom nodes.
    """
    LOGGER.info("comfy_entrypoint called from %s", __file__)
    
    # Initialize our services
    init_services()
    
    return HikazeModelManagerExtension()
