import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for elements with coordinates or groups with transforms
# that put them between y = 3000 and y = 4500.
# We'll search for y="..." and transform="translate(x, y)" values.

print("Elements with y coordinate between 3000 and 4500:")
# Find y="..."
for m in re.finditer(r'y=\"(\d+(\.\d+)?)\"', content):
    y_val = float(m.group(1))
    if 3000 <= y_val <= 4500:
        start = content.rfind('<', 0, m.start())
        end = content.find('>', m.end())
        tag = content[start:end+1]
        if 'base64' in tag:
            tag = re.sub(r'href=\"data:[^\"]+\"', 'href=\"data:image/...\"', tag)
        print(f"y={y_val}: {tag.strip()[:200]}")

# Find transform="translate(x y)" or translate(x, y) where y is between 3000 and 4500
for m in re.finditer(r'transform=\"translate\(([^)]+)\)\"', content):
    parts = m.group(1).split()
    if len(parts) == 2:
        y_val = float(parts[1])
    else:
        # Check comma separation
        parts = m.group(1).split(',')
        if len(parts) == 2:
            y_val = float(parts[1])
        else:
            continue
    if 3000 <= y_val <= 4500:
        start = content.rfind('<', 0, m.start())
        end = content.find('>', m.end())
        tag = content[start:end+1]
        print(f"transform-y={y_val}: {tag.strip()[:200]}")
