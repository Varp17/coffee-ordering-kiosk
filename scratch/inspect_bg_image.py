import xml.etree.ElementTree as ET

tree = ET.parse('public/Homepage.svg')
root = tree.getroot()

ns = {'svg': 'http://www.w3.org/2000/svg'}

for rect in root.findall('.//svg:rect', ns):
    fill = rect.get('fill', '')
    if 'pattern1_366_1172' in fill or 'pattern0_366_1172' in fill:
        print(f"Rect: fill={fill}, x={rect.get('x')}, y={rect.get('y')}, w={rect.get('width')}, h={rect.get('height')}, transform={rect.get('transform')}")
