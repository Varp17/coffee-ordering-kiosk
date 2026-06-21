import xml.etree.ElementTree as ET

tree = ET.parse('public/Homepage.svg')
root = tree.getroot()

ns = {'svg': 'http://www.w3.org/2000/svg'}

for rect in root.findall('.//svg:rect', ns):
    y = rect.get('y')
    if y == '502':
        print(f"Rect at y=502: fill='{rect.get('fill')}', attributes={rect.attrib}")
