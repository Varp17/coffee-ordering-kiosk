with open('public/Homepage.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find occurrences of "3460"
idx = 0
while True:
    idx = content.find('3460', idx)
    if idx == -1:
        break
    print(f"\nOccurrance of '3460' at index {idx}:")
    # Print 200 characters before and 400 characters after
    start_pos = max(0, idx - 200)
    end_pos = min(len(content), idx + 400)
    print(content[start_pos:end_pos].strip())
    idx += 4
