import xml.etree.ElementTree as ET

tree = ET.parse('public/Homepage.svg')
root = tree.getroot()

ns = {'svg': 'http://www.w3.org/2000/svg'}

print("All rects in Homepage.svg with y=502 or using pattern/paint fills near the top:")
for rect in root.findall('.//svg:rect', ns):
    y_attr = rect.get('y')
    fill = rect.get('fill', '')
    if y_attr and float(y_attr) < 3000:
        if 'pattern' in fill or 'paint' in fill:
            print(f"Rect: y={y_attr}, w={rect.get('width')}, h={rect.get('height')}, fill={fill}")
