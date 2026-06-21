import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

# Let's find all path elements
paths = re.findall(r'<path\b[^>]*>', content)
print(f"Total paths: {len(paths)}")

for idx, p in enumerate(paths):
    d_match = re.search(r'\bd="([^"]+)"', p)
    if not d_match:
        continue
    d = d_match.group(1)
    
    # Extract all numbers
    nums = [float(n) for n in re.findall(r'-?\d+\.?\d*', d)]
    if not nums:
        continue
        
    # We are interested in Y-coordinates between 7000 and 8329
    # Usually in path commands, commands look like M x y or L x y, so we check numbers.
    # Let's see if any number is in range [7100, 8329]
    large_y = [n for n in nums if 7100 <= n <= 8329]
    if large_y:
        fill_match = re.search(r'\bfill="([^"]+)"', p)
        fill = fill_match.group(1) if fill_match else "none"
        id_match = re.search(r'\bid="([^"]+)"', p)
        pid = id_match.group(1) if id_match else "none"
        print(f"Path {idx} | ID: {pid} | Fill: {fill} | Min: {min(nums)} | Max: {max(nums)}")
        print(f"  Start: {d[:150]}")
        print(f"  Length of d: {len(d)}")
