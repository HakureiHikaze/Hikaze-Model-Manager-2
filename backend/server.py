import socket
import logging
import asyncio
import threading
import time
import os
from aiohttp import web
from typing import Optional

logger = logging.getLogger(__name__)

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
        app = web.Application()
        app.router.add_get("/api/hello", self.handle_hello)
        
        # Serve static files
        # backend/server.py -> ../web/dist/manager
        static_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "web", "dist", "manager")
        
        if os.path.exists(static_path):
             # Serve index.html for root
             async def index(request):
                 return web.FileResponse(os.path.join(static_path, "index.html"))
             
             app.router.add_get("/", index)
             app.router.add_static("/", static_path, show_index=True)
        else:
            logger.warning(f"Static path not found: {static_path}")

        return app

    async def handle_hello(self, request):
        return web.json_response({
            "status": "ok",
            "port": self.port
        })

    def run(self):
        """Thread entry point."""
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        
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
        
        # Also cleanup runner
        if self.loop:
             # This part is a bit tricky from outside thread, 
             # usually we'd run a cleanup task in the loop.
             pass
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
