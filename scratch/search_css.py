with open('src/pages/HomePage/HomePage.css', 'r', encoding='utf-8') as f:
    content = f.read()

import re
matches = re.finditer(r'\.scroll-video[^{]*\{[^}]*\}', content)
print("Scroll video rules:")
for m in matches:
    print(m.group(0))

print("\nRules containing video or background:")
# Let's search for any selector with video or bg/image properties
for m in re.finditer(r'[^}]*video[^}]*\{[^}]*\}|[^}]*background[^}]*\{[^}]*\}', content):
    clean_rule = m.group(0).strip()
    if len(clean_rule) < 400:
        print(clean_rule)
