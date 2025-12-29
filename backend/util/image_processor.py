import os
import io
import math
import logging
from typing import List
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
            logger.info(f"Processing image, original size: {original_img.size}, mode: {original_img.mode}")
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
                logger.info(f"Saved {q_name} quality image at {save_path} ({tier_width}x{tier_height})")
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
    def get_image_list(hash_str: str) -> List[str]:
        """Scan data/images for all sequence base names matching the hash."""
        # We look for <hash>_<seq>_high.webp
        import glob
        pattern = os.path.join(config.IMAGES_DIR, f"{hash_str}_*_high.webp")
        files = glob.glob(pattern)
        
        # Extract base names like "hash_0", "hash_1"
        bases = []
        for f in files:
            name = os.path.basename(f)
            # Remove _high.webp
            base = name.replace("_high.webp", "")
            bases.append(base)
            
        return sorted(bases)

    @staticmethod
    def get_image_count(hash_str: str) -> int:
        """Return the number of images associated with a hash."""
        return len(ImageProcessor.get_image_list(hash_str))

    @staticmethod
    def get_next_sequence_index(hash_str: str) -> int:
        """Find the next available sequence index for a hash."""
        seq = 0
        while True:
            filename = f"{hash_str}_{seq}_high.webp"
            path = os.path.join(config.IMAGES_DIR, filename)
            if not os.path.exists(path):
                return seq
            seq += 1

    @staticmethod
    def promote_pending_image(pending_id: str, sha256: str, seq: int = 0):
        """
        Move a pending image to active storage with 3-tier compression.
        """
        import glob
        # Find pending image by ID (could be any extension)
        pattern = os.path.join(config.PENDING_IMAGES_DIR, f"{pending_id}.*")
        matches = glob.glob(pattern)
        
        if not matches:
            logger.warning(f"No pending image found for ID {pending_id}")
            return
            
        src_path = matches[0]
        try:
            with open(src_path, "rb") as f:
                data = f.read()
            
            target_base = f"{sha256}_{seq}"
            ImageProcessor.process_and_save(data, target_base, is_pending=False)
            
            # Delete source
            os.remove(src_path)
        except Exception as e:
            logger.error(f"Failed to promote pending image {pending_id}: {e}")

    @staticmethod
    def get_image_path(identifier: str, quality: str = "high", is_pending: bool = False) -> str:
        """
        Resolve the full path for a given image identifier and quality.
        'identifier' can be a hash, a full base name like 'hash_0', or a model ID.
        """
        if quality not in QUALITIES:
            quality = "high"
            
        base_dir = config.PENDING_IMAGES_DIR if is_pending else config.IMAGES_DIR
        
        # If is_pending, identifier is the model_id. 
        # But wait, pending images are stored as original files (e.g. 123.png)
        if is_pending:
            import glob
            pattern = os.path.join(base_dir, f"{identifier}.*")
            matches = glob.glob(pattern)
            if matches:
                return matches[0]
            return os.path.join(base_dir, str(identifier))

        # Active images follow the <base>_<quality>.webp pattern
        clean_base = os.path.splitext(identifier)[0]
        # If it doesn't have an underscore, it might be just the hash. 
        # Default to seq 0 if it looks like just a hash.
        if "_" not in clean_base and len(clean_base) == 64:
            clean_base = f"{clean_base}_0"
            
        filename = f"{clean_base}_{quality}.webp"
        return os.path.join(base_dir, filename)
