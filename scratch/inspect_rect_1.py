with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

import re
# Find <rect fill="url(#pattern1_366_1172)" ...> or similar
m = re.search(r'<rect[^>]*pattern1_366_1172[^>]*>', content)
if m:
    print("Found Rect for pattern1:")
    print(m.group(0))
else:
    print("Pattern1 rect not found!")
