import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Search for 'Code Your Own' case-insensitive
pattern = re.compile(r'Code Your Own', re.IGNORECASE)
matches = list(pattern.finditer(content))
print(f"Found {len(matches)} occurrences.")

for i, match in enumerate(matches):
    start = max(0, match.start() - 1000)
    end = min(len(content), match.end() + 1000)
    print(f"\n--- Occurrence {i+1} ---")
    print(content[start:end])
