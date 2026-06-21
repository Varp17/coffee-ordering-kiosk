import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

path_iter = re.finditer(r'<path\b[^>]*>', content)

print("Paths in range y = 900 to 1250:")
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
        
    # Check if y is in 900 to 1250
    # Specifically, check if the y-coordinates are inside this range.
    # We can approximate by looking for y coordinates (numbers that are not x, e.g. alternate or range check)
    # Let's check if the path has any number in [950, 1150]
    in_range = any(950 <= n <= 1150 for n in numbers)
    if in_range:
        fill_match = re.search(r'\bfill="([^"]+)"', tag)
        fill = fill_match.group(1) if fill_match else "none"
        stroke_match = re.search(r'\bstroke="([^"]+)"', tag)
        stroke = stroke_match.group(1) if stroke_match else "none"
        
        # Check coordinates count
        coord_count = len(numbers)
        
        print(f"Fill: {fill} | Stroke: {stroke} | Coords: {coord_count} | Tag: {tag[:150]}...")
