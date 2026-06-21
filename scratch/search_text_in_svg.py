import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for text tags first just in case
text_tags = re.findall(r'<text[^>]*>.*?</text>', content)
print(f"Found {len(text_tags)} text tags.")

# Let's search for case-insensitive occurrences of 'saying', 'people', 'chilld', 'google', 'amazon'
for word in ['saying', 'people', 'chilld', 'google', 'amazon']:
    matches = list(re.finditer(re.escape(word), content, re.IGNORECASE))
    print(f"Occurrences of '{word}': {len(matches)}")
