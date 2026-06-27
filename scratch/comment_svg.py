import os

svg_path = os.path.abspath("public/Homepage.svg")

with open(svg_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Verify that the lines match what we expect
if "fill=\"#1F2A44\"" in lines[4] and "</g>" in lines[10]:
    lines[4] = "<!--\n" + lines[4]
    lines[10] = lines[10] + "-->\n"

    with open(svg_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Successfully commented out announcement bar in Homepage.svg")
else:
    print("Error: Lines do not match expected SVG tags. No changes made.")
