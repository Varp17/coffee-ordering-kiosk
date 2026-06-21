with open('src/pages/HomePage/HomePage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

stack = []
lines = content.split('\n')

in_string = False
string_char = ''
in_comment = False
in_block_comment = False

for idx, line in enumerate(lines):
    line_num = idx + 1
    
    i = 0
    while i < len(line):
        if in_block_comment:
            if i + 1 < len(line) and line[i:i+2] == '*/':
                in_block_comment = False
                i += 2
                continue
        elif in_comment:
            break
        elif in_string:
            if line[i] == string_char:
                if i - 1 >= 0 and line[i-1] == '\\':
                    # Escaped
                    pass
                else:
                    in_string = False
        else:
            if i + 1 < len(line) and line[i:i+2] == '//':
                break
            elif i + 1 < len(line) and line[i:i+2] == '/*':
                in_block_comment = True
                i += 2
                continue
            elif line[i] in ['"', "'", '`']:
                in_string = True
                string_char = line[i]
            elif line[i] == '{':
                stack.append(line_num)
            elif line[i] == '}':
                if stack:
                    stack.pop()
                else:
                    print(f"Error: Excess closing brace '}}' at line {line_num}")
        i += 1

print(f"File processed. Stack size: {len(stack)}")
if stack:
    print("Unclosed opening braces '{' opened at lines:")
    for line in stack:
        print(f"  Line {line}")
