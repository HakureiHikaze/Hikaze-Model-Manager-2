import os
import io
import math
import logging
from PIL import Image
from . import config

logger = logging.getLogger(__name__)

MAX_PIXELS = 2_000_000  # 2MP limit for High quality

# Quality Settings
# Scale is relative to the "Max 2MP" baseline
QUALITIES = {
    "high":   {"scale": 1.0,  "quality": 80},
    "medium": {"scale": 0.66, "quality": 60},
    "low":    {"scale": 0.33, "quality": 45}
}

class ImageProcessor:
    @staticmethod
    def process_and_save(image_data: bytes, target_filename_base: str, is_pending: bool = False) -> str:
        """
        Process image into 3 quality tiers (High/Medium/Low) and save.
        """
        try:
            original_img = Image.open(io.BytesIO(image_data))
            
            # 1. Handle transparency/modes
            if original_img.mode in ('RGBA', 'P'):
                original_img = original_img.convert('RGBA')
            else:
                original_img = original_img.convert('RGB')

            # 2. Calculate Base Dimensions (Max 2MP)
            width, height = original_img.size
            current_pixels = width * height
            
            base_width, base_height = width, height
            
            if current_pixels > MAX_PIXELS:
                scale = math.sqrt(MAX_PIXELS / current_pixels)
                base_width = int(width * scale)
                base_height = int(height * scale)

            # 3. Process Each Quality Tier
            base_dir = config.PENDING_IMAGES_DIR if is_pending else config.IMAGES_DIR
            
            clean_base = os.path.splitext(target_filename_base)[0]
            
            for q_name, settings in QUALITIES.items():
                tier_scale = settings["scale"]
                tier_width = int(base_width * tier_scale)
                tier_height = int(base_height * tier_scale)
                
                img_tier = original_img.resize((tier_width, tier_height), Image.Resampling.LANCZOS)
                
                filename = f"{clean_base}_{q_name}.webp"
                save_path = os.path.join(base_dir, filename)
                
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                
                data = list(img_tier.getdata())
                clean_img = Image.new(img_tier.mode, img_tier.size)
                clean_img.putdata(data)
                
                clean_img.save(save_path, "WEBP", quality=settings["quality"], method=6)

            return clean_base

        except Exception as e:
            logger.error(f"Image processing error: {e}")
            raise

    @staticmethod
    def save_legacy_active_image(image_data: bytes, hash_str: str) -> str:
        """
        Save active image with sequence conflict resolution.
        Naming: <hash>_<seq>_<quality>.webp
        """
        seq = 0
        while True:
            # Check collision on "high" quality file
            # If high exists, assume the set exists.
            filename = f"{hash_str}_{seq}_high.webp"
            path = os.path.join(config.IMAGES_DIR, filename)
            if not os.path.exists(path):
                break
            seq += 1
            
        target_base = f"{hash_str}_{seq}"
        return ImageProcessor.process_and_save(image_data, target_base, is_pending=False)

    @staticmethod
    def save_pending_image_original(image_data: bytes, model_id: str) -> str:
        """
        Save original image to pending dir.
        Filename: <model_id> (no extension, or detect?)
        User requirement: "save original image".
        We will attempt to detect extension to be nice, but save primarily by ID.
        """
        try:
            img = Image.open(io.BytesIO(image_data))
            ext = (img.format or "bin").lower()
            filename = f"{model_id}.{ext}"
            
            path = os.path.join(config.PENDING_IMAGES_DIR, filename)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            
            with open(path, "wb") as f:
                f.write(image_data)
            
            return filename
        except Exception as e:
            logger.error(f"Failed to save pending original: {e}")
            # Fallback
            path = os.path.join(config.PENDING_IMAGES_DIR, str(model_id))
            with open(path, "wb") as f:
                f.write(image_data)
            return str(model_id)

    @staticmethod
    def delete_images(identifier: str, is_pending: bool = False):
        """Helper to delete all quality variants."""
        base_dir = config.PENDING_IMAGES_DIR if is_pending else config.IMAGES_DIR
        clean_base = os.path.splitext(identifier)[0]
        
        for q_name in QUALITIES.keys():
            path = os.path.join(base_dir, f"{clean_base}_{q_name}.webp")
            if os.path.exists(path):
                try:
                    os.remove(path)
                except OSError:
                    pass

    @staticmethod
    def get_image_path(identifier: str, quality: str = "high", is_pending: bool = False) -> str:
        """
        Resolve the full path for a given image identifier and quality.
        """
        if quality not in QUALITIES:
            quality = "high"
            
        clean_base = os.path.splitext(identifier)[0]
        filename = f"{clean_base}_{quality}.webp"
            
        base_dir = config.PENDING_IMAGES_DIR if is_pending else config.IMAGES_DIR
        return os.path.join(base_dir, filename)
