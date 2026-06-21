import xml.etree.ElementTree as ET
import re

ET.register_namespace('', 'http://www.w3.org/2000/svg')
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')

tree = ET.parse('public/Homepage.svg')
root = tree.getroot()

ns = {'svg': 'http://www.w3.org/2000/svg'}

def get_elements(elem, current_transform_y=0):
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
    if 3000 <= actual_y <= 4500 and tag not in ['g', 'defs', 'clipPath', 'mask']:
        # Let's print this element in full (truncating base64)
        elem_str = ET.tostring(elem, encoding='utf-8').decode('utf-8')
        elem_str_clean = re.sub(r'href=\"data:[^\"]+\"', 'href="data:image/png;base64,...[TRUNCATED]..."', elem_str)
        elem_str_clean = re.sub(r'xlink:href=\"data:[^\"]+\"', 'xlink:href="data:image/png;base64,...[TRUNCATED]..."', elem_str_clean)
        print(f"y={actual_y} | tag={tag} | XML: {elem_str_clean[:300]}")
        
    for child in elem:
        get_elements(child, total_y)

get_elements(root)
