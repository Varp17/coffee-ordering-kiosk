import xml.etree.ElementTree as ET
import re

ET.register_namespace('', 'http://www.w3.org/2000/svg')
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')

tree = ET.parse('public/Homepage.svg')
root = tree.getroot()

def inspect_title_range(elem, current_transform_y=0):
    transform = elem.get('transform', '')
    ty = 0
    if transform:
        m = re.search(r'translate\(([^,)]+)[, ]([^)]+)\)', transform)
        if m:
            ty = float(m.group(2))
        else:
            m = re.search(r'translate\(([^)]+)\)', transform)
            if m:
                parts = m.group(1).split()
                if len(parts) == 2:
                    ty = float(parts[1])
    
    total_y = current_transform_y + ty
    y_attr = elem.get('y')
    elem_y = float(y_attr) if y_attr else None
    actual_y = elem_y if elem_y is not None else total_y
    
    tag = elem.tag.split('}')[-1]
    
    if tag in ['rect', 'path', 'text', 'image', 'g']:
        if 4260 <= actual_y < 4478:
            attrs = {k: v[:80]+'...' if len(v)>80 else v for k, v in elem.attrib.items()}
            print(f"[{tag}] actual_y={actual_y:.2f} (trans_y={total_y:.2f}, y_attr={elem_y}) | Attrs: {attrs}")
            if tag == 'path' and 'd' in elem.attrib:
                print(f"  d: {elem.attrib['d'][:100]}...")
            
    for child in elem:
        inspect_title_range(child, total_y)

print("Inspecting SVG elements in y-range 4260 to 4478:")
inspect_title_range(root)
