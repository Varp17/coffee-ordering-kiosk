import xml.etree.ElementTree as ET
import re

ET.register_namespace('', 'http://www.w3.org/2000/svg')
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')

tree = ET.parse('public/Homepage.svg')
root = tree.getroot()

print("Listing all elements using pattern fills:")

def get_pattern_fills(elem, current_transform_y=0):
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
    
    fill = elem.get('fill', '')
    if fill.startswith('url(#pattern'):
        tag = elem.tag.split('}')[-1]
        print(f"[{tag}] actual_y={actual_y} | fill={fill} | id={elem.get('id', 'None')}")
        
    for child in elem:
        get_pattern_fills(child, total_y)

get_pattern_fills(root)
