import socket
import logging
import asyncio
import threading
import time
import os
from aiohttp import web
from typing import Optional

from backend.database import DatabaseManager
from .router import setup_routes

logger = logging.getLogger(__name__)


@web.middleware
async def cors_middleware(request: web.Request, handler):
    if request.method == "OPTIONS":
        response = web.Response()
    else:
        response = await handler(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, PUT, PATCH, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

class PortFinder:
    @staticmethod
    def find_free_port(base_port: int, max_tries: int = 10) -> int:
        """
        Find a free port starting from base_port.
        """
        if base_port == 0:
            # Let the OS pick a free port
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(("127.0.0.1", 0))
                return s.getsockname()[1]

        for port in range(base_port, base_port + max_tries):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try:
                    s.bind(("127.0.0.1", port))
                    return port
                except OSError:
                    logger.debug(f"Port {port} is occupied, trying next...")
                    continue
        
        raise RuntimeError(f"Could not find a free port in range {base_port} to {base_port + max_tries - 1}")

class HikazeServer(threading.Thread):
    def __init__(self, host: str = "127.0.0.1", port: int = 8189):
        super().__init__(daemon=True)
        self.host = host
        self.base_port = port
        self.port: Optional[int] = None
        self.running = False
        self.loop: Optional[asyncio.AbstractEventLoop] = None
        self.runner: Optional[web.AppRunner] = None

    def create_app(self) -> web.Application:
        app = web.Application(middlewares=[cors_middleware])
        setup_routes(app)
        return app

    def run(self):
        """Thread entry point."""
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        
        # Initialize database within the thread
        try:
            db = DatabaseManager()
            db.init_db()
            logger.info("Database initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            return
        
        # Find port
        try:
            self.port = PortFinder.find_free_port(self.base_port)
        except RuntimeError as e:
            logger.error(f"Server failed to start: {e}")
            return

        app = self.create_app()
        self.runner = web.AppRunner(app)
        
        self.loop.run_until_complete(self.runner.setup())
        site = web.TCPSite(self.runner, self.host, self.port)
        
        self.loop.run_until_complete(site.start())
        self.running = True
        logger.info(f"Hikaze Server started at http://{self.host}:{self.port}")
        
        self.loop.run_forever()

    def stop(self):
        """Signal the server to stop."""
        if self.loop and self.loop.is_running():
            self.loop.call_soon_threadsafe(self.loop.stop)
        
        self.running = False

def main():
    """Standalone entrypoint for development."""
    logging.basicConfig(level=logging.INFO)
    server = HikazeServer(port=8189)
    server.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        server.stop()
        server.join()

if __name__ == "__main__":
    main()
