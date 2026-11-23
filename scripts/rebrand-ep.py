"""Replace EasyPeeze Technologies branding with EasyPeeze Technologies across the site."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SKIP_DIRS = {".git", "node_modules", "dist", "dist-ssr", "brand"}
SKIP_SUFFIX = {".png", ".jpg", ".jpeg", ".webp", ".ico", ".woff2", ".woff", ".pdf", ".lock"}

# Order matters: longer / more specific first.
PAIRS = [
    ("EasyPeeze Technologies", "EasyPeeze Technologies"),
    ("EasyPeeze", "EasyPeeze"),
    ("easypeezetech.com", "easypeezetech.com"),
    ("easypeezetech", "easypeezetech"),
    ("info@easypeezetech.com", "info@easypeezetech.com"),
    ("https://calendly.com/easypeeze/30min", "https://calendly.com/easypeeze/30min"),
    ("https://www.linkedin.com/company/easypeezetech", "https://www.linkedin.com/company/easypeezetech"),
    ("https://instagram.com/easypeezetech", "https://instagram.com/easypeezetech"),
    ("ep-theme", "ep-theme"),
    ("__epRecaptcha", "__epRecaptcha"),
    ("easypeezetech-website", "easypeezetech-website"),
    ("EasyPeeze Technologies production site", "EasyPeeze Technologies production site"),
]


def should_skip(path: Path) -> bool:
    if any(p in SKIP_DIRS for p in path.parts):
        return True
    if path.suffix.lower() in SKIP_SUFFIX:
        return True
    return False


changed = 0
for path in ROOT.rglob("*"):
    if not path.is_file() or should_skip(path):
        continue
    try:
        text = path.read_bytes().decode("utf-8")
    except UnicodeDecodeError:
        continue
    original = text
    for old, new in PAIRS:
        text = text.replace(old, new)
    if text != original:
        path.write_bytes(text.encode("utf-8"))
        changed += 1
        print(path.relative_to(ROOT))

print(f"updated {changed} files")
