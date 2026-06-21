import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

paths = re.findall(r'<path\b[^>]*>', content)
print(f"Total paths: {len(paths)}")

for idx, p in enumerate(paths):
    d_match = re.search(r'\bd="([^"]+)"', p)
    if not d_match:
        continue
    d = d_match.group(1)
    if d.startswith('M0 7396') or '7396' in d[:50]:
        fill_match = re.search(r'\bfill="([^"]+)"', p)
        fill = fill_match.group(1) if fill_match else "none"
        print(f"Found path {idx} | Fill: {fill}")
        print(f"  d start: {d[:200]}")
