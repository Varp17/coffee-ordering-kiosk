import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read(1000)

svg_tag = re.search(r'<svg\b[^>]*>', content)
if svg_tag:
    print(svg_tag.group(0))
else:
    print("No <svg> tag found in first 1000 chars")
