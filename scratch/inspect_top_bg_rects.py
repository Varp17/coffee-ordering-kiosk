import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

rects = re.findall(r'<rect[^>]*>', content)
for rect in rects:
    y_match = re.search(r'y="([\d.]+)"', rect)
    x_match = re.search(r'x="([\d.]+)"', rect)
    w_match = re.search(r'width="([\d.]+)"', rect)
    h_match = re.search(r'height="([\d.]+)"', rect)
    
    # If y is missing or 0, or y < 120
    y = float(y_match.group(1)) if y_match else 0.0
    x = float(x_match.group(1)) if x_match else 0.0
    w = float(w_match.group(1)) if w_match else 0.0
    h = float(h_match.group(1)) if h_match else 0.0
    
    if y < 120:
        print(f"y={y}, x={x}, w={w}, h={h}: {rect}")
