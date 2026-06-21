with open('src/pages/HomePage/HomePage.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'hard-part-parallax-clip' in l:
        print(f"Line {i+1}: {l.strip()}")
