import re
import sys

with open('src/pages/HomePage/HomePage.css', 'r', encoding='utf-8') as f:
    content = f.read()

blocks = re.findall(r'([^{]+)\{([^}]+)\}', content)

print("Heights found in bento card related selectors:")
for selector, body in blocks:
    selector = selector.strip()
    if 'bento' in selector or 'card' in selector:
        height_match = re.search(r'height\s*:\s*([^;]+);', body)
        if height_match:
            try:
                print(f"{selector} => height: {height_match.group(1).strip()}")
            except Exception:
                safe_selector = selector.encode('ascii', errors='replace').decode('ascii')
                print(f"{safe_selector} => height: {height_match.group(1).strip()}")
