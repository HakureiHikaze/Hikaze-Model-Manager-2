from __future__ import annotations

import argparse
import os
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif", ".tif", ".tiff"}


def find_font_path() -> str | None:
    candidates = [
        "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\tahoma.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/Library/Fonts/Arial.ttf",
        "DejaVuSans.ttf",
        "arial.ttf",
        "segoeui.ttf",
    ]
    for candidate in candidates:
        if os.path.isabs(candidate) and not os.path.exists(candidate):
            continue
        try:
            ImageFont.truetype(candidate, size=12)
            return candidate
        except Exception:
            continue
    return None


def measure_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> tuple[int, int]:
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def wrap_text(text: str, font: ImageFont.ImageFont, max_width: int, draw: ImageDraw.ImageDraw) -> list[str]:
    if not text:
        return [""]
    if measure_text(draw, text, font)[0] <= max_width:
        return [text]
    lines: list[str] = []
    current = ""
    for ch in text:
        candidate = current + ch
        if measure_text(draw, candidate, font)[0] <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = ch
    if current:
        lines.append(current)
    return lines


def choose_font_and_lines(
    text: str,
    width: int,
    height: int,
    font_path: str | None,
    draw: ImageDraw.ImageDraw,
) -> tuple[ImageFont.ImageFont, list[str]]:
    padding = max(8, int(min(width, height) * 0.05))
    max_width = max(1, width - padding * 2)
    max_height = max(1, height - padding * 2)

    if not font_path:
        font = ImageFont.load_default()
        lines = wrap_text(text, font, max_width, draw)
        return font, lines

    max_size = max(12, int(min(width, height) * 0.2))
    min_size = 10
    for size in range(max_size, min_size - 1, -1):
        font = ImageFont.truetype(font_path, size=size)
        lines = wrap_text(text, font, max_width, draw)
        line_spacing = max(2, int(size * 0.2))
        total_height = 0
        max_line_width = 0
        for line in lines:
            line_width, line_height = measure_text(draw, line, font)
            max_line_width = max(max_line_width, line_width)
            total_height += line_height
        total_height += line_spacing * (len(lines) - 1)
        if max_line_width <= max_width and total_height <= max_height:
            return font, lines

    font = ImageFont.truetype(font_path, size=min_size)
    lines = wrap_text(text, font, max_width, draw)
    return font, lines


def replace_image(path: Path, font_path: str | None) -> None:
    try:
        with Image.open(path) as img:
            width, height = img.size
            image_format = img.format
    except Exception as exc:
        print(f"Skip {path}: {exc}")
        return

    placeholder = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(placeholder)
    text = path.name

    font, lines = choose_font_and_lines(text, width, height, font_path, draw)
    line_spacing = max(2, int(getattr(font, "size", 12) * 0.2))

    line_sizes = [measure_text(draw, line, font) for line in lines]
    total_height = sum(h for _, h in line_sizes) + line_spacing * (len(lines) - 1)
    start_y = (height - total_height) / 2

    current_y = start_y
    for line, (line_width, line_height) in zip(lines, line_sizes):
        x = (width - line_width) / 2
        draw.text((x, current_y), line, fill="black", font=font)
        current_y += line_height + line_spacing

    save_kwargs = {}
    if image_format:
        save_kwargs["format"] = image_format
    try:
        placeholder.save(path, **save_kwargs)
    except Exception:
        placeholder.save(path)


def iter_images(root: Path) -> list[Path]:
    return [p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS]


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Replace images with white placeholders labeled by filename."
    )
    parser.add_argument(
        "--images-dir",
        type=Path,
        default=None,
        help="Override images directory (default: data/images under project root).",
    )
    args = parser.parse_args()

    script_root = Path(__file__).resolve().parents[1]
    images_dir = args.images_dir or (script_root / "data" / "images")
    if not images_dir.exists():
        print(f"Images directory not found: {images_dir}")
        return 1

    font_path = find_font_path()
    images = iter_images(images_dir)
    if not images:
        print(f"No images found under: {images_dir}")
        return 0

    for path in images:
        replace_image(path, font_path)
    print(f"Replaced {len(images)} image(s) under: {images_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
