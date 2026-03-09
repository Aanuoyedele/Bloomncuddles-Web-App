import os
import json

history_dir = r"C:\Users\AANU\AppData\Roaming\Code\User\History"
print(f"Scanning {history_dir} for any page.tsx ...")

count = 0

for root, dirs, files in os.walk(history_dir):
    if "entries.json" in files:
        entries_path = os.path.join(root, "entries.json")
        try:
            with open(entries_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            resource = data.get("resource", "")
            if "page.tsx" in resource.lower():
                print(f"Match {count+1}: {resource}")
                count += 1
                if count >= 30:
                    break
        except Exception as e:
            pass

print(f"Done. Found {count} items.")
