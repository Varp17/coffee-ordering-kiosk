import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

for word in ['Summer', 'Sale', 'Chilld', 'Home', 'Products', 'Recipes', 'About']:
    matches = list(re.finditer(re.escape(word), content, re.IGNORECASE))
    print(f"Occurrences of '{word}': {len(matches)}")
