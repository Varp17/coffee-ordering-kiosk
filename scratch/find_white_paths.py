import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

paths = re.findall(r'<path\b[^>]*>', content)
print(f"Total path elements: {len(paths)}")
print("Paths with white or light blue fills in 7000-8000 range:")

found = 0
for idx, path in enumerate(paths):
    fill_match = re.search(r'\bfill="([^"]+)"', path)
    fill = fill_match.group(1) if fill_match else "none"
    
    # We want to match #FFFFFF, white, #E6F4FF, or any variations of white/light blue
    is_white_like = fill.upper() in ["#FFFFFF", "WHITE", "#E6F4FF", "#B9E0FF"]
    
    d_match = re.search(r'\bd="([^"]+)"', path)
    if not d_match:
        continue
    d = d_match.group(1)
    
    numbers = [float(n) for n in re.findall(r'-?\d+\.?\d*', d)]
    
    if is_white_like and any(7000 <= n <= 8000 for n in numbers):
        found += 1
        print(f"[{found}] SVG Path Index: {idx} | Length: {len(d)} | Fill: {fill} | Min Coord: {min(numbers)} | Max Coord: {max(numbers)}")
        print(f"  Start: {d[:120]}")
