import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

paths = re.findall(r'<path\b[^>]*>', content)
print(f"Total path elements: {len(paths)}")
print("Paths with Y coords in 900-1250 range:")

found = 0
for idx, path in enumerate(paths):
    d_match = re.search(r'\bd="([^"]+)"', path)
    if not d_match:
        continue
    d = d_match.group(1)
    
    # Parse numbers to check y coordinate range
    numbers = [float(n) for n in re.findall(r'-?\d+\.?\d*', d)]
    
    if any(900 <= n <= 1250 for n in numbers):
        found += 1
        fill_match = re.search(r'\bfill="([^"]+)"', path)
        fill = fill_match.group(1) if fill_match else "none"
        
        min_val = min(numbers) if numbers else 0
        max_val = max(numbers) if numbers else 0
        
        print(f"[{found}] SVG Path Index: {idx} | Length: {len(d)} | Fill: {fill} | Min Coord: {min_val} | Max Coord: {max_val}")
        if len(d) > 200:
            print(f"  Start: {d[:120]}")
