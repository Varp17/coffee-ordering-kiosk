import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect all <path> elements inside y: 950 to 2000
paths = re.findall(r'<path[^>]*>', content)
print("--- Paths in 950 <= y <= 2000 ---")
count = 0
for p in paths:
    d_match = re.search(r'd="M\s*([\d.-]+)\s+([\d.-]+)', p)
    if d_match:
        x = float(d_match.group(1))
        y = float(d_match.group(2))
        if 950 <= y <= 2000:
            count += 1
            print(f"x={x}, y={y}: {p[:120]}...")

print(f"Total paths in this range: {count}")
