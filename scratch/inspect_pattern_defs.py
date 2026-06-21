import xml.etree.ElementTree as ET

tree = ET.parse('public/Homepage.svg')
root = tree.getroot()

ns = {'svg': 'http://www.w3.org/2000/svg', 'xlink': 'http://www.w3.org/1999/xlink'}

print("Pattern definitions:")
for pat in root.findall('.//svg:pattern', ns):
    pat_id = pat.get('id')
    use_el = pat.find('.//svg:use', ns)
    image_el = pat.find('.//svg:image', ns)
    ref = ""
    if use_el is not None:
        ref = use_el.get('{http://www.w3.org/1999/xlink}href') or use_el.get('href')
    elif image_el is not None:
        ref = image_el.get('{http://www.w3.org/1999/xlink}href') or image_el.get('href')
        if ref.startswith('data:'):
            ref = ref[:40] + "..."
    print(f"Pattern id={pat_id} uses ref={ref} | width={pat.get('width')}, height={pat.get('height')}")
