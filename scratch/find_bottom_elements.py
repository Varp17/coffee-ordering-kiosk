import re

with open("public/Homepage.svg", "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(r'<([^ >]+)\b([^>]*)>')
matches = pattern.finditer(content)

print("First 15 elements in y=7100 to 7600 range:")
found_count = 0
for idx, match in enumerate(matches):
    tag = match.group(1)
    attrs_str = match.group(2)
    
    # Parse attributes
    fill_match = re.search(r'\bfill="([^"]+)"', attrs_str)
    fill = fill_match.group(1) if fill_match else ""
    
    d_match = re.search(r'\bd="([^"]+)"', attrs_str)
    d = d_match.group(1) if d_match else ""
    
    id_match = re.search(r'\bid="([^"]+)"', attrs_str)
    id_val = id_match.group(1) if id_match else ""
    
    numbers = [float(n) for n in re.findall(r'-?\d+\.?\d*', attrs_str + " " + d)]
    
    if any(7150 <= n <= 7580 for n in numbers):
        found_count += 1
        print(f"[{found_count}] Match Index: {idx} | Tag: <{tag}> | ID: '{id_val}' | Fill: '{fill}'")
        if d:
            print(f"  d starts with: {d[:100]}")
        else:
            print(f"  Attrs: {attrs_str[:100]}")
        if found_count >= 15:
            break
