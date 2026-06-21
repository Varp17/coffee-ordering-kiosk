import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

paths = re.finditer(r'<path\b[^>]*>', content)

for idx, match in enumerate(paths):
    tag = match.group(0)
    fill_match = re.search(r'\bfill="([^"]+)"', tag)
    fill = fill_match.group(1) if fill_match else ""
    if fill.upper() == "#1F2A44":
        d_match = re.search(r'\bd="([^"]+)"', tag)
        if d_match:
            d = d_match.group(1)
            nums = [float(n) for n in re.findall(r'-?\d+\.?\d*', d)]
            print(f"Path {idx} | Fill: {fill} | Min Y: {min(nums) if nums else None} | Max Y: {max(nums) if nums else None}")
            print(f"  Start: {d[:120]}")
