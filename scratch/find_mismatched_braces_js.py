with open('src/pages/HomePage/HomePage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We trace character by character
state_stack = ['CODE']
brace_stack = [] # Store tuple of (line, col)
in_escape = False

# We'll need line and column tracking
line_num = 1
col_num = 1

i = 0
n = len(content)

while i < n:
    char = content[i]
    
    # Track line/col
    next_line = line_num
    next_col = col_num + 1
    if char == '\n':
        next_line += 1
        next_col = 1
    
    current_state = state_stack[-1]
    
    if current_state == 'LINE_COMMENT':
        if char == '\n':
            state_stack.pop()
    elif current_state == 'BLOCK_COMMENT':
        if i + 1 < n and content[i:i+2] == '*/':
            state_stack.pop()
            i += 1 # Skip '/'
    elif current_state == 'STRING_SINGLE':
        if in_escape:
            in_escape = False
        elif char == '\\':
            in_escape = True
        elif char == "'":
            state_stack.pop()
    elif current_state == 'STRING_DOUBLE':
        if in_escape:
            in_escape = False
        elif char == '\\':
            in_escape = True
        elif char == '"':
            state_stack.pop()
    elif current_state == 'TEMPLATE_LITERAL':
        if in_escape:
            in_escape = False
        elif char == '\\':
            in_escape = True
        elif i + 1 < n and content[i:i+2] == '${':
            state_stack.append('CODE')
            brace_stack.append(('TEMPLATE_EXPR', line_num, col_num))
            i += 1 # Skip '{'
        elif char == '`':
            state_stack.pop()
    elif current_state == 'CODE':
        # Check comments
        if i + 1 < n and content[i:i+2] == '//':
            state_stack.append('LINE_COMMENT')
            i += 1
        elif i + 1 < n and content[i:i+2] == '/*':
            state_stack.append('BLOCK_COMMENT')
            i += 1
        # Check strings
        elif char == "'":
            state_stack.append('STRING_SINGLE')
            in_escape = False
        elif char == '"':
            state_stack.append('STRING_DOUBLE')
            in_escape = False
        elif char == '`':
            state_stack.append('TEMPLATE_LITERAL')
            in_escape = False
        # Check braces
        elif char == '{':
            brace_stack.append(('BRACE', line_num, col_num))
        elif char == '}':
            if not brace_stack:
                print(f"Error: Excess closing brace '}}' at line {line_num}, col {col_num}")
            else:
                top_type, top_line, top_col = brace_stack.pop()
                if top_type == 'TEMPLATE_EXPR':
                    # This closes the template expression code block, return to TEMPLATE_LITERAL state
                    state_stack.pop()
    
    i += 1
    line_num = next_line
    col_num = next_col

print(f"Parsing complete. State stack: {state_stack}")
print(f"Unclosed braces count: {len(brace_stack)}")
if brace_stack:
    print("Unclosed elements:")
    for btype, l, c in brace_stack:
        print(f"  {btype} opened at line {l}, col {c}")
