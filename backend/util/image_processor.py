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
        
        Args:
            image_data: Raw image bytes.
            target_filename_base: Base name (e.g. 'hash' or 'filename'). 
                                  Suffixes (_high, _medium, _low) will be appended.
            is_pending: If True, save to pending directory.
            
        Returns:
            The base filename used (e.g. 'hash').
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
                logger.info(f"Base resolution scaled to {base_width}x{base_height} (from {width}x{height})")

            # 3. Process Each Quality Tier
            base_dir = config.PENDING_IMAGES_DIR if is_pending else config.IMAGES_DIR
            
            # Clean filename base (remove extension if present)
            clean_base = os.path.splitext(target_filename_base)[0]
            
            for q_name, settings in QUALITIES.items():
                # Calculate tier dimensions
                tier_scale = settings["scale"]
                tier_width = int(base_width * tier_scale)
                tier_height = int(base_height * tier_scale)
                
                # Resize
                # Only resize if different from original, but here we always resize 
                # if original > 2MP OR if tier_scale < 1.0.
                # If original < 2MP and High tier (scale 1.0), we keep original size.
                
                # Logic:
                # If tier_scale < 1.0 or (original was huge): resize.
                # Actually, resize() returns a copy, so safe to do always or conditionally.
                # Lanczos for downsampling.
                img_tier = original_img.resize((tier_width, tier_height), Image.Resampling.LANCZOS)
                
                # Prepare save path
                filename = f"{clean_base}_{q_name}.webp"
                save_path = os.path.join(base_dir, filename)
                
                # Ensure dir exists
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                
                # Save without metadata
                data = list(img_tier.getdata())
                clean_img = Image.new(img_tier.mode, img_tier.size)
                clean_img.putdata(data)
                
                clean_img.save(save_path, "WEBP", quality=settings["quality"], method=6)
                logger.debug(f"Saved {q_name} image: {save_path}")

            return clean_base

        except Exception as e:
            logger.error(f"Image processing error: {e}")
            raise

    @staticmethod
    def get_image_path(identifier: str, quality: str = "high", is_pending: bool = False) -> str:
        """
        Resolve the full path for a given image identifier and quality.
        
        Args:
            identifier: filename base (e.g. hash).
            quality: 'high', 'medium', or 'low'.
            is_pending: look in pending dir.
        """
        # Validate quality
        if quality not in QUALITIES:
            quality = "high"
            
        # Clean identifier
        clean_base = os.path.splitext(identifier)[0]
        
        # Suffix format
        filename = f"{clean_base}_{quality}.webp"
            
        base_dir = config.PENDING_IMAGES_DIR if is_pending else config.IMAGES_DIR
        return os.path.join(base_dir, filename)