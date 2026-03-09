import os
import json
import urllib.parse
from datetime import datetime

history_dir = r"C:\Users\AANU\AppData\Roaming\Code\User\History"
print(f"Scanning {history_dir} ...")

paths_found = []

for root, dirs, files in os.walk(history_dir):
    if "entries.json" in files:
        entries_path = os.path.join(root, "entries.json")
        try:
            with open(entries_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            resource = data.get("resource", "")
            if not resource: continue

            # Don't try to rely completely on unquote just in case
            if "page.tsx" in resource.lower() and "bloomncuddles" in resource.lower():
                paths_found.append((resource, data.get("entries", []), root))
        except Exception as e:
            print("ERROR parsing", entries_path, ":", e)

print(f"Found {len(paths_found)} matches for page.tsx.")
for resource, entries, root in paths_found:
    print(f"File: {urllib.parse.unquote(resource)}")
    if entries:
        entries.sort(key=lambda x: x.get("timestamp", 0))
        ts = entries[-1].get("timestamp", 0) / 1000
        ts_str = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
        print(f"  Latest backup: {ts_str}")
        print(f"  Root: {root}")
        print(f"  Total backups recorded: {len(entries)}")
    print("-" * 50)
