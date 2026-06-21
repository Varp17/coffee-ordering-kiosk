import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find rects with y < 115
rects = re.findall(r'<rect[^>]*>', content)
print("--- Rects at y < 120 ---")
for rect in rects:
    y_match = re.search(r'y="([\d.]+)"', rect)
    if y_match:
        y = float(y_match.group(1))
        if y < 120:
            print(rect)

# Let's also look for text or other groups at the top
# Let's search for patterns or images at the top
g_tags = re.findall(r'<g[^>]*>', content)
print(f"Total <g> tags: {len(g_tags)}")
