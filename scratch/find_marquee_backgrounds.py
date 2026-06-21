import re

# Read Homepage.svg
with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

# We can search for <path tags
# Since it is 14MB and possibly one line, re.finditer is very memory efficient
path_iter = re.finditer(r'<path\b[^>]*>', content)

top_marquee_waves = []
bottom_marquee_waves = []

for match in path_iter:
    tag = match.group(0)
    d_match = re.search(r'\bd="([^"]+)"', tag)
    if not d_match:
        continue
    d = d_match.group(1)
    
    # Parse numbers
    numbers = [float(n) for n in re.findall(r'-?\d+\.?\d*', d)]
    if not numbers:
        continue
        
    # Check y coordinates
    # We want closed wave paths (e.g. they usually have a large number of coordinates, 
    # and they span the entire width of 1512, so they'll have numbers near 1512, and y-coordinates near the range)
    has_0 = any(n == 0 for n in numbers)
    has_1512 = any(n == 1512 for n in numbers)
    
    # Top range y
    has_top_y = any(950 < n < 1200 for n in numbers)
    # Bottom range y
    has_bottom_y = any(7150 < n < 7480 for n in numbers)
    
    if has_top_y and (has_0 or has_1512):
        top_marquee_waves.append((tag, numbers))
    if has_bottom_y and (has_0 or has_1512):
        bottom_marquee_waves.append((tag, numbers))

print(f"Top wave candidates ({len(top_marquee_waves)}):")
for tag, nums in top_marquee_waves:
    print(tag[:300])

print(f"\nBottom wave candidates ({len(bottom_marquee_waves)}):")
for tag, nums in bottom_marquee_waves:
    print(tag[:300])
