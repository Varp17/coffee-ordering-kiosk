import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

rects = re.finditer(r'<rect\b[^>]*>', content)
print("Rect elements:")
for idx, m in enumerate(rects):
    tag = m.group(0)
    fill_match = re.search(r'\bfill="([^"]+)"', tag)
    fill = fill_match.group(1) if fill_match else "none"
    y_match = re.search(r'\by="([^"]+)"', tag)
    y = y_match.group(1) if y_match else "none"
    height_match = re.search(r'\bheight="([^"]+)"', tag)
    height = height_match.group(1) if height_match else "none"
    width_match = re.search(r'\bwidth="([^"]+)"', tag)
    width = width_match.group(1) if width_match else "none"
    print(f"Rect {idx} | Y: {y} | Height: {height} | Width: {width} | Fill: {fill}")
