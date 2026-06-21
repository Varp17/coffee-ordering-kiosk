import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect all <rect> elements inside y: 950 to 2250
rects = re.findall(r'<rect[^>]*>', content)
print("--- Rects at 950 <= y <= 2250 ---")
for rect in rects:
    y_match = re.search(r'y="([\d.]+)"', rect)
    if y_match:
        y = float(y_match.group(1))
        if 950 <= y <= 2250:
            print(rect)

# Let's inspect all <image> elements in the SVG
images = re.findall(r'<image[^>]*>', content)
print("--- All Images in SVG ---")
for img in images:
    y_match = re.search(r'y="([\d.]+)"', img)
    y = float(y_match.group(1)) if y_match else 0.0
    print(f"y={y}: {img[:150]}")
