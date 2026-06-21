import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find all path tags
paths = re.findall(r'<path[^>]*>', content)
print(f"Total paths: {len(paths)}")

top_paths = []
# Find paths whose d attribute has starting y coordinate < 120
for p in paths:
    d_match = re.search(r'd="M\s*([\d.-]+)\s+([\d.-]+)', p)
    if d_match:
        x = float(d_match.group(1))
        y = float(d_match.group(2))
        if y < 120:
            top_paths.append((x, y, p))

print(f"Found {len(top_paths)} paths with starting y < 120:")
for x, y, p in top_paths[:30]:
    print(f"x={x}, y={y}: {p[:120]}...")
