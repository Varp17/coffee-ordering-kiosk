import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect all rects, paths, and check their y coordinates between 110 and 200
rects = re.findall(r'<rect[^>]*>', content)
print("--- Rects at 110 <= y <= 200 ---")
for rect in rects:
    y_match = re.search(r'y="([\d.]+)"', rect)
    if y_match:
        y = float(y_match.group(1))
        if 110 <= y <= 200:
            print(rect)

paths = re.findall(r'<path[^>]*>', content)
print("--- Paths with starting y between 110 and 200 ---")
for p in paths:
    d_match = re.search(r'd="M\s*([\d.-]+)\s+([\d.-]+)', p)
    if d_match:
        x = float(d_match.group(1))
        y = float(d_match.group(2))
        if 110 <= y <= 200:
            print(f"x={x}, y={y}: {p[:120]}...")
