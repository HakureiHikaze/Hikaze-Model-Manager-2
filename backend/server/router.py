from aiohttp import web
import logging
import os

logger = logging.getLogger(__name__)

async def handle_hello(request):
    return web.json_response({
        "status": "ok"
    })

def setup_routes(app: web.Application):
    app.router.add_get("/api/hello", handle_hello)
    
    # Static files setup
    # Root is up 3 levels from here: backend/server/router.py -> backend/server -> backend -> root
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    static_path = os.path.join(root_dir, "web", "dist", "manager")
    
    if os.path.exists(static_path):
        async def index(request):
            return web.FileResponse(os.path.join(static_path, "index.html"))
            
        app.router.add_get("/", index)
        app.router.add_static("/", static_path, show_index=True)
    else:
        logger.warning(f"Static path not found: {static_path}")
