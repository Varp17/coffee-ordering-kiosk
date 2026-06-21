import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Search for any text containing "handled" or "part" or "nitty-gritties"
for word in ['handled', 'hard part', 'nitty-gritties', 'sourcing', 'water', 'iced-water']:
    # Let's search for case-insensitive occurrences
    matches = list(re.finditer(re.escape(word), content, re.IGNORECASE))
    print(f"Occurrences of '{word}': {len(matches)}")
    for m in matches:
        # Print surrounding characters
        start = max(0, m.start() - 150)
        end = min(len(content), m.end() + 150)
        print(f"  Context: {content[start:end]}\n")
