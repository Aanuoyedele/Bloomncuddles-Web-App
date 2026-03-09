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

            decoded = urllib.parse.unquote(resource).replace("\\", "/")
            
            if "bloomncuddles" in decoded.lower():
                paths_found.append((decoded, data.get("entries", []), root))
        except Exception as e:
            pass

print(f"Found {len(paths_found)} files in history.")
for p, entries, root in paths_found:
    print(f"File: {p}")
    if entries:
        entries.sort(key=lambda x: x.get("timestamp", 0))
        ts = entries[-1].get("timestamp", 0) / 1000
        ts_str = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
        print(f"  Latest backup: {ts_str}")
        
    print("-" * 50)
