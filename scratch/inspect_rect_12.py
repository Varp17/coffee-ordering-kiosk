import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

rects = re.finditer(r'<rect\b[^>]*>', content)
for idx, m in enumerate(rects):
    tag = m.group(0)
    if 'height="799"' in tag or 'fill="#1F2A44"' in tag:
        print(f"Rect {idx}: {tag}")
