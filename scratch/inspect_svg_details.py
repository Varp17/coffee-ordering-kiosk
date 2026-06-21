import xml.etree.ElementTree as ET
import re

ET.register_namespace('', 'http://www.w3.org/2000/svg')
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')

tree = ET.parse('public/Homepage.svg')
root = tree.getroot()

# Let's search for elements with coordinates that overlap the video position:
# x in [80, 1432], y in [3460, 4160]
print("Leaf elements in the video range (x: 80-1432, y: 3460-4160):")

def check_overlap(elem, current_transform_x=0, current_transform_y=0):
    transform = elem.get('transform', '')
    tx = 0
    ty = 0
    if transform:
        m = re.search(r'translate\(([^,)]+)[, ]([^)]+)\)', transform)
        if m:
            tx = float(m.group(1))
            ty = float(m.group(2))
        else:
            m = re.search(r'translate\(([^)]+)\)', transform)
            if m:
                parts = m.group(1).split()
                if len(parts) == 2:
                    tx = float(parts[0])
                    ty = float(parts[1])
                elif len(parts) == 1:
                    tx = float(parts[0])
                    
    total_x = current_transform_x + tx
    total_y = current_transform_y + ty
    
    x_attr = elem.get('x')
    y_attr = elem.get('y')
    
    elem_x = float(x_attr) if x_attr else None
    elem_y = float(y_attr) if y_attr else None
    
    actual_x = elem_x if elem_x is not None else total_x
    actual_y = elem_y if elem_y is not None else total_y
    
    tag = elem.tag.split('}')[-1]
    if tag in ['rect', 'path', 'image', 'use']:
        # If it's a path, it might not have x/y but let's approximate or just print
        # For rect/image/use, they have x/y
        overlap_y = (actual_y is not None) and (3400 <= actual_y <= 4200)
        if overlap_y:
            attrs = {k: v[:50]+'...' if len(v)>50 else v for k, v in elem.attrib.items()}
            print(f"[{tag}] x={actual_x}, y={actual_y} | Attrs: {attrs}")
            
    for child in elem:
        check_overlap(child, total_x, total_y)

check_overlap(root)
