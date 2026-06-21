import re

# Read Homepage.svg
with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

# Find all paths
paths = re.findall(r'<path[^>]*>', content)
print(f"Total paths found: {len(paths)}")

# Check paths in top marquee y-range: y between 900 and 1250
# We can parse the 'd' attribute and find min/max y coordinates
top_marquee_paths = []
bottom_marquee_paths = []

for p in paths:
    d_match = re.search(r'd="([^"]+)"', p)
    if not d_match:
        continue
    d = d_match.group(1)
    
    # Extract all numbers in d
    numbers = [float(n) for n in re.findall(r'-?\d+\.?\d*', d)]
    if not numbers:
        continue
        
    # Standard figma path coordinates alternate x, y or are grouped
    # Let's check if any coordinate is in y ranges:
    # top: 900 to 1250
    # bottom: 7100 to 7500
    
    # We can check if all coordinates that could be 'y' fall into these ranges.
    # Alternatively, just see if the average y-value falls in the range.
    # Since x usually spans 0 to 1512, and y spans 0 to 8329.
    # Any number > 1512 is definitely a y coordinate!
    # Let's check:
    has_top_y = any(900 < n < 1250 for n in numbers)
    has_bottom_y = any(7100 < n < 7500 for n in numbers)
    
    if has_top_y:
        top_marquee_paths.append(p)
    if has_bottom_y:
        bottom_marquee_paths.append(p)

print(f"Paths in top marquee y-range (900-1250): {len(top_marquee_paths)}")
print("Sample top marquee paths:")
for p in top_marquee_paths[:10]:
    print(p[:200])

print(f"\nPaths in bottom marquee y-range (7100-7500): {len(bottom_marquee_paths)}")
print("Sample bottom marquee paths:")
for p in bottom_marquee_paths[:10]:
    print(p[:200])
