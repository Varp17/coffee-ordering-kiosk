with open('src/pages/HomePage/HomePage.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

balance = 0
for idx, line in enumerate(lines):
    line_num = idx + 1
    
    # Strip string literals and comments to avoid counting braces inside them
    # Simple regex or parser would be better, but we can do a basic character loop
    # ignoring comments and strings.
    in_string = False
    string_char = ''
    in_comment = False
    
    i = 0
    while i < len(line):
        char = line[i]
        
        if in_comment:
            if i + 1 < len(line) and line[i:i+2] == '*/':
                in_comment = False
                i += 2
                continue
        elif in_string:
            if char == string_char:
                # Check escape
                if i - 1 >= 0 and line[i-1] == '\\':
                    pass
                else:
                    in_string = False
        else:
            if i + 1 < len(line) and line[i:i+2] == '//':
                break # Rest of the line is a comment
            elif i + 1 < len(line) and line[i:i+2] == '/*':
                in_comment = True
                i += 2
                continue
            elif char in ['"', "'", '`']:
                in_string = True
                string_char = char
            elif char == '{':
                balance += 1
                # print(f"Open at line {line_num}: balance={balance}")
            elif char == '}':
                balance -= 1
                # print(f"Close at line {line_num}: balance={balance}")
                if balance < 0:
                    print(f"Error: balance went below 0 at line {line_num}")
                    break
        i += 1
    
    if balance < 0:
        break

print(f"Final brace balance: {balance}")
