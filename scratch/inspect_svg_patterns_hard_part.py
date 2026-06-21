import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find pattern tags in SVG
patterns = re.findall(r'<pattern[^>]*>.*?</pattern>', content, re.DOTALL)
print(f"Total patterns: {len(patterns)}")

# Find and print patterns used in y: 950 to 2250
# Let's first search for all rects that have fill="url(#...)"
rects_with_patterns = re.findall(r'<rect[^>]*fill="url\(#([^"]+)\)"[^>]*>', content)
print("\n--- Rects with patterns ---")
for rect in re.finditer(r'<rect[^>]*fill="url\(#([^"]+)\)"[^>]*>', content):
    rect_str = rect.group(0)
    pat_id = rect.group(1)
    # Check if there is y coordinate
    y_match = re.search(r'y="([\d.]+)"', rect_str)
    y = float(y_match.group(1)) if y_match else 0.0
    # Also check transform
    trans = re.search(r'transform="([^"]+)"', rect_str)
    trans_str = trans.group(1) if trans else ""
    print(f"Rect: y={y}, pat={pat_id}, trans={trans_str}, full={rect_str}")

# Inspect pattern0 and pattern10 detail
for pat in patterns:
    pat_id_match = re.search(r'id="([^"]+)"', pat)
    if pat_id_match:
        pat_id = pat_id_match.group(1)
        if pat_id in ['pattern0_366_1172', 'pattern10_366_1172', 'pattern0', 'pattern10']:
            print(f"\nPattern ID: {pat_id}")
            print(pat[:1000])
