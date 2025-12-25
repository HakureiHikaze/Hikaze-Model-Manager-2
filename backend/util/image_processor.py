import os
import io
import math
import logging
from PIL import Image
from . import config

logger = logging.getLogger(__name__)

MAX_PIXELS = 2_000_000  # 2MP limit
DEFAULT_QUALITY = 80

class ImageProcessor:
    @staticmethod
    def process_and_save(image_data: bytes, target_filename: str, is_pending: bool = False) -> str:
        """
        Resize image to 2MP, convert to WebP, and save.
        
        Args:
            image_data: Raw image bytes.
            target_filename: The name to save as (e.g. hash.webp or name.webp).
            is_pending: If True, save to pending directory.
            
        Returns:
            The absolute path to the saved image.
        """
        try:
            img = Image.open(io.BytesIO(image_data))
            
            # 1. Handle transparency/modes
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGBA')
            else:
                img = img.convert('RGB')

            # 2. Resize if necessary (2MP limit)
            width, height = img.size
            current_pixels = width * height
            
            if current_pixels > MAX_PIXELS:
                scale = math.sqrt(MAX_PIXELS / current_pixels)
                new_width = int(width * scale)
                new_height = int(height * scale)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                logger.info(f"Resized image from {width}x{height} to {new_width}x{new_height}")

            # 3. Determine save path
            # Ensure target has .webp extension
            if not target_filename.lower().endswith(".webp"):
                target_filename = f"{os.path.splitext(target_filename)[0]}.webp"
                
            base_dir = config.PENDING_IMAGES_DIR if is_pending else config.IMAGES_DIR
            save_path = os.path.join(base_dir, target_filename)
            
            # Ensure dir exists (though config.py handles it, safety first)
            os.makedirs(os.path.dirname(save_path), exist_ok=True)

            # 4. Save as WebP
            # We create a new image without metadata
            data = list(img.getdata())
            clean_img = Image.new(img.mode, img.size)
            clean_img.putdata(data)
            
            clean_img.save(save_path, "WEBP", quality=DEFAULT_QUALITY, method=6)
            
            logger.info(f"Saved optimized image to {save_path}")
            return save_path

        except Exception as e:
            logger.error(f"Image processing error: {e}")
            raise

    @staticmethod
    def get_image_path(identifier: str, is_pending: bool = False) -> str:
        """Resolve the full path for a given image identifier."""
        if not identifier.lower().endswith(".webp"):
            identifier = f"{identifier}.webp"
            
        base_dir = config.PENDING_IMAGES_DIR if is_pending else config.IMAGES_DIR
        return os.path.join(base_dir, identifier)
