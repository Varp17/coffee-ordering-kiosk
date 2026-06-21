with open('src/pages/HomePage/HomePage.css', 'r', encoding='utf-8') as f:
    content = f.read()

import re
matches = re.finditer(r'\.hard-part-[^{]*\{[^}]*\}', content)
print("CSS rules for hard-part:")
for m in matches:
    print(m.group(0))
