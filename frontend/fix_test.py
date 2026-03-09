import re

target_file = r"C:\Users\AANU\Desktop\Bloomncuddles website\frontend\src\app\(marketing)\test\page.tsx"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

button_classes_to_remove = [
    r'\bpx-\d+\]?', r'\bpy-\d+\]?', 
    r'\brounded-(?:sm|md|lg|xl|2xl|3xl|full|none|\[.*?\])\b', 
    r'\bp-\d+\]?'
]

def update_class_string(class_str):
    for pattern in button_classes_to_remove:
        class_str = re.sub(pattern, '', class_str)
    
    class_str = " ".join(class_str.split())
    
    if "px-[15px]" not in class_str:
        class_str += " px-[15px] py-[15px] rounded-[6px]"
    return class_str

# We want to match any JSX tag that looks like a button or <Link href>
# and has className="..."
def process_content(content):
    # Regex to find className="([^"]*)"
    # We only want to apply this selectively.
    # What's easiest is finding <button className="..."> or <Link ... className="...">
    # Here's a naive approach: replace all classNames that contain hover:, bg-primary, etc?
    # Actually, a simple state machine to find specific button-like links:
    pass

# A simpler way is to find <button ... className="..."> and <Link ... className="...">
button_pattern = r'(<button[^>]*?className=["\'])(.*?)(["\'])'
link_pattern = r'(<Link[^>]*?className=["\'][^"\']*?(?:hover|bg-|button|btn|px-|py-)[^"\']*?)(["\'])'

def button_replace(match):
    before = match.group(1)
    cls = match.group(2)
    after = match.group(3)
    return before + update_class_string(cls) + after

content = re.sub(button_pattern, button_replace, content)

def link_replace(match):
    # This is trickier because we match the whole beginning text in group 1 if we are not careful
    pass

# Alternative: just find all className="..." that look like buttons
# Usually buttons have: px-, py-, rounded-, hover:, etc.
def generic_replace(match):
    before = match.group(1)
    cls = match.group(2)
    after = match.group(3)
    
    # Heuristic: if it has padding classes AND Background or text colors, likely a button
    # but let's be careful not to format section containers
    if 'bg-' in cls and ('hover:' in cls or 'transition' in cls) and 'px-' in cls and 'py-' in cls:
        return before + update_class_string(cls) + after
    return match.group(0)

class_pattern = r'(className=["\'])(.*?)(["\'])'
content = re.sub(class_pattern, generic_replace, content)

with open(target_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated test/page.tsx with button classes.")
