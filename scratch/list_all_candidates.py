import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

path_iter = re.finditer(r'<path\b[^>]*>', content)

print("ALL Paths in range y = 900 to 1250:")
count = 0
for match in path_iter:
    tag = match.group(0)
    d_match = re.search(r'\bd="([^"]+)"', tag)
    if not d_match:
        continue
    d = d_match.group(1)
    
    # Parse numbers
    numbers = [float(n) for n in re.findall(r'-?\d+\.?\d*', d)]
    if not numbers:
        continue
        
    # Check if this is a path in the top marquee y range
    # Let's filter: y coordinates in [950, 1150]
    in_range = any(950 <= n <= 1150 for n in numbers)
    if in_range:
        fill_match = re.search(r'\bfill="([^"]+)"', tag)
        fill = fill_match.group(1) if fill_match else "none"
        stroke_match = re.search(r'\bstroke="([^"]+)"', tag)
        stroke = stroke_match.group(1) if stroke_match else "none"
        
        # If it spans the entire width (has 0 and 1512)
        has_0 = any(abs(n) < 1e-3 for n in numbers)
        has_1512 = any(abs(n - 1512) < 1e-3 for n in numbers)
        
        if has_0 or has_1512:
            count += 1
            print(f"[{count}] Fill: {fill} | Stroke: {stroke} | Coords: {len(numbers)}")
            print(f"Tag: {tag[:200]}...")
