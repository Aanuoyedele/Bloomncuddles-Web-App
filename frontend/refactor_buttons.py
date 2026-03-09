import os
import re

# Tailwind structural classes to remove
classes_to_remove = [
    r'\bpx-\w+\b', r'\bpx-\[.*?\]\b', 
    r'\bpy-\w+\b', r'\bpy-\[.*?\]\b', 
    r'\bp-\w+\b', r'\bp-\[.*?\]\b',
    r'\brounded-\w+\b', r'\brounded-\[\w+\]\b',
]

# The new structure requested by the user, translated to Tailwind
NEW_CLASSES = "px-[15px] py-[15px] rounded-[6px]"

def refactor_class_string(class_str):
    # Determine if it's a primary button (has padding, colors, etc.)
    # Ignore simple icon buttons that might be `p-2 w-10 h-10`
    if 'bg-' not in class_str or 'w-' in class_str and 'h-' in class_str and 'px-' not in class_str:
        return class_str
        
    cleaned_str = class_str
    for pattern in classes_to_remove:
        cleaned_str = re.sub(pattern, '', cleaned_str)
    
    # Clean up multiple spaces
    cleaned_str = re.sub(r'\s+', ' ', cleaned_str).strip()
    
    # Append the new structure
    return f"{cleaned_str} {NEW_CLASSES}".strip()

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find className="something"
    def replacer(match):
        pre = match.group(1)
        classes = match.group(2)
        post = match.group(3)
        new_classes = refactor_class_string(classes)
        return f'{pre}"{new_classes}"{post}'
        
    # We only want to refactor className inside <button> or <Link>
    # This is a bit complex with regex alone, doing it broadly on button/Link lines
    lines = content.split('\n')
    modified = False
    new_lines = []
    
    in_button_link = False
    
    for line in lines:
        if '<button' in line or '<Link' in line:
            in_button_link = True
            
        if in_button_link and 'className="' in line:
            new_line = re.sub(r'(className=)"([^"]+)"()', replacer, line)
            if new_line != line: modified = True
            line = new_line
            
        if '>' in line: # simplistic end of tag
            in_button_link = False
            
        new_lines.append(line)

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        return True
    return False

if __name__ == '__main__':
    src_dir = r"c:\Users\AANU\Desktop\Bloomncuddles website\frontend\src"
    mod_count = 0
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                if process_file(filepath):
                    mod_count += 1
    print(f"Refactored buttons in {mod_count} files.")
