import re
import xml.etree.ElementTree as ET

# Read the SVG file
print("Parsing SVG...")
# SVG can be huge, let's use a simple regex search or parse
# Let's search for rect tags with y around 750 to 850
with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# We can find all <rect> elements
rects = re.findall(r'<rect[^>]*>', content)
print(f"Total rects found: {len(rects)}")

for rect in rects:
    # Extract attributes: x, y, width, height, fill
    x_match = re.search(r'x="([\d.]+)"', rect)
    y_match = re.search(r'y="([\d.]+)"', rect)
    w_match = re.search(r'width="([\d.]+)"', rect)
    h_match = re.search(r'height="([\d.]+)"', rect)
    fill_match = re.search(r'fill="([^"]+)"', rect)
    
    if x_match and y_match:
        x = float(x_match.group(1))
        y = float(y_match.group(1))
        w = float(w_match.group(1)) if w_match else 0
        h = float(h_match.group(1)) if h_match else 0
        
        # Check if y is near 790-810 and x is near 600-640
        if 750 <= y <= 850 and 550 <= x <= 700:
            print(f"Candidate rect: x={x}, y={y}, w={w}, h={h}, tag={rect}")
