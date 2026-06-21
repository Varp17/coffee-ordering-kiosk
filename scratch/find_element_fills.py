import re

with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find '<g [^>]*transform="translate\(0 3360\)">' and extract its content
start_idx = content.find('transform="translate(0 3360)"')
if start_idx != -1:
    # Find the tag opening before this attribute
    g_start = content.rfind('<g', 0, start_idx)
    # Let's extract the next 5000 characters
    chunk = content[g_start:g_start+8000]
    
    # Let's clean up base64
    chunk_clean = re.sub(r'href=\"data:[^\"]+\"', 'href="data:image/png;base64,...[TRUNCATED]..."', chunk)
    chunk_clean = re.sub(r'xlink:href=\"data:[^\"]+\"', 'xlink:href="data:image/png;base64,...[TRUNCATED]..."', chunk_clean)
    
    print("Found Group at 3360:")
    print(chunk_clean[:3000])
else:
    print("Group translate(0 3360) not found!")
