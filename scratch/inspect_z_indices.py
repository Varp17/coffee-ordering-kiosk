with open('src/pages/HomePage/HomePage.css', 'r', encoding='utf-8') as f:
    content = f.read()

import re
matches = re.finditer(r'([^\n{}]+)\{[^}]*?z-index\s*:\s*([^;}]+)', content)
print("z-index findings in HomePage.css:")
for m in matches:
    print(f"Selector: {m.group(1).strip()} -> z-index: {m.group(2).strip()}")
