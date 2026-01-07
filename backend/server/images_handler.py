import logging
import os
from aiohttp import web
from backend.database.db import DatabaseManager
from backend.util import config
from backend.util.image_processor import ImageProcessor

logger = logging.getLogger(__name__)

async def handle_get_image(request):
    """
    Serve an active image by hash.
    URL: /api/images/{hash}.webp?quality=high|medium|low
    """
    img_hash = request.match_info.get("hash", "")
    quality = request.query.get("quality", "high")
    
    path = ImageProcessor.get_image_path(img_hash, quality=quality, is_pending=False)
    if os.path.exists(path):
        return web.FileResponse(path)
    return web.Response(status=404, text="Image not found")

async def handle_get_image_count(request):
    """
    GET /api/images/get_img_count?sha256=...
    Return count of images for a model.
    """
    sha256 = request.query.get("sha256")
    if not sha256:
        return web.json_response({"error": "sha256 is required"}, status=400)
    
    count = ImageProcessor.get_image_count(sha256)
    return web.json_response({"count": count})

async def handle_get_pending_image(request):
    """
    Serve a pending image by name.
    URL: /api/images/pending/{name}.webp?quality=high|medium|low
    """
    name = request.match_info.get("name", "")
    quality = request.query.get("quality", "high")
    
    path = ImageProcessor.get_image_path(name, quality=quality, is_pending=True)
    if os.path.exists(path):
        return web.FileResponse(path)
    return web.Response(status=404, text="Pending image not found")

async def handle_get_pending_image_by_id(request):
    """
    Serve a pending image by model ID (original size).
    URL: /api/images/pending/{id}
    """
    raw_id = request.match_info.get("id", "")
    try:
        item_id = int(raw_id)
    except ValueError:
        return web.json_response({"error": "id must be an integer"}, status=400)

    db = DatabaseManager()
    record = db.get_pending_model_by_id(item_id)
    if not record or not record.meta_json or not record.meta_json.images:
        return web.Response(status=404, text="Pending image not found")

    filename = os.path.basename(str(record.meta_json.images[0]))
    path = os.path.join(config.PENDING_IMAGES_DIR, filename)
    if os.path.exists(path):
        return web.FileResponse(path)
    return web.Response(status=404, text="Pending image not found")

async def handle_upload_image(request):
    """
    Upload and process an image.
    Fields: 'image' (file), 'sha256' (text).
    """
    if not request.content_type.startswith("multipart/"):
        return web.json_response({"error": "Content-Type must be multipart/form-data"}, status=400)

    try:
        reader = await request.multipart()
    except ValueError:
        return web.json_response({"error": "Invalid multipart request"}, status=400)

    image_data = None
    sha256 = ""

    while True:
        part = await reader.next()
        if part is None:
            break
        
        if part.name == "sha256":
            sha256 = await part.text()
        elif part.name == "image":
            image_data = await part.read()
    
    if not image_data or not sha256:
        return web.json_response({"error": "Missing image or sha256"}, status=400)

    try:
        # Save as active image (not pending) with next sequence index.
        seq = ImageProcessor.get_next_sequence_index(sha256)
        base_name = f"{sha256}_{seq}"
        ImageProcessor.process_and_save(image_data, base_name, is_pending=False)
        return web.json_response({"status": "success", "base_name": base_name})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)

async def handle_delete_image(request):
    """
    DELETE /api/images/delete?sha256=...&seq=...
    """
    sha256 = request.query.get("sha256")
    seq_str = request.query.get("seq")
    
    if not sha256 or seq_str is None:
        return web.json_response({"error": "sha256 and seq are required"}, status=400)
    
    try:
        seq = int(seq_str)
    except ValueError:
        return web.json_response({"error": "seq must be an integer"}, status=400)

    try:
        ImageProcessor.delete_image_sequence(sha256, seq)
        return web.json_response({"status": "success"})
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=404)
    except Exception as e:
        logger.exception(f"Error deleting image {sha256}_{seq}")
        return web.json_response({"error": str(e)}, status=500)
