import xml.etree.ElementTree as ET

# Register SVG namespace
ET.register_namespace('', 'http://www.w3.org/2000/svg')
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')

tree = ET.parse('public/Homepage.svg')
root = tree.getroot()

# Namespace helper
ns = {'svg': 'http://www.w3.org/2000/svg', 'xlink': 'http://www.w3.org/1999/xlink'}

def get_y_coords(elem, current_transform_y=0):
    # Parse transform if present
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
    
    # Check y attribute
    y_attr = elem.get('y')
    elem_y = float(y_attr) if y_attr else None
    
    # We are interested in elements in the vertical range 3300 to 4300
    actual_y = elem_y if elem_y is not None else total_y
    
    # Check if this element is a leaf element (rect, path, image, use)
    tag = elem.tag.split('}')[-1]
    if tag in ['rect', 'path', 'image', 'use']:
        if 3200 <= actual_y <= 4300:
            attrs = {k: v[:50]+'...' if len(v)>50 else v for k, v in elem.attrib.items()}
            print(f"[{tag}] actual_y={actual_y} (transform_y={total_y}, y_attr={elem_y}) | Attrs: {attrs}")
            
    for child in elem:
        get_y_coords(child, total_y)

import re
print("Searching for elements in y-range 3200 to 4300...")
get_y_coords(root)
