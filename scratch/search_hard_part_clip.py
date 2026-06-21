with open('src/pages/HomePage/HomePage.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

with open('src/pages/HomePage/HomePage.jsx', 'r', encoding='utf-8') as f:
    jsx_content = f.read()

import re
matches = re.finditer(r'\.hard-part-parallax-clip[^{]*\{[^}]*\}', css_content)
print("CSS rules for hard-part-parallax-clip:")
for m in matches:
    print(m.group(0))

print("\nOccurrences in JSX:")
for m in re.finditer(r'.{0,50}hard-part-parallax-clip.{0,50}', jsx_content):
    print(m.group(0).strip())
