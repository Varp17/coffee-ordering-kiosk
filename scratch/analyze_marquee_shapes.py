import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

path_iter = re.finditer(r'<path\b[^>]*>', content)

for idx, match in enumerate(path_iter):
    tag = match.group(0)
    d_match = re.search(r'\bd="([^"]+)"', tag)
    if not d_match:
        continue
    d = d_match.group(1)
    
    # Parse numbers
    numbers = [float(n) for n in re.findall(r'-?\d+\.?\d*', d)]
    if not numbers:
        continue
        
    # Check if this is the top marquee candidate
    if any(950 <= n <= 1150 for n in numbers) and any(n == 1512 for n in numbers) and any(n == 110.065 for n in numbers):
        fill_match = re.search(r'\bfill="([^"]+)"', tag)
        fill = fill_match.group(1) if fill_match else "none"
        
        # Calculate min and max y coordinates (assuming numbers alternate x, y)
        # We can extract all numbers, and separate them into x and y.
        # Since x is in 0..1512 and y is in 0..8329.
        y_coords = [n for n in numbers if n > 1512 or (110 <= n <= 1120)]
        print(f"Candidate {idx} | Fill: {fill} | Y-coords count: {len(y_coords)} | Min Y: {min(numbers)} | Max Y: {max(numbers)}")
        # Print first few numbers in path
        print(f"Path start: {d[:200]}")
