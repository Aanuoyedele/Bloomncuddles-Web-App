import os
import json
import urllib.parse
from datetime import datetime

history_dir = r"C:\Users\AANU\AppData\Roaming\Code\User\History"

print(f"Scanning {history_dir}...")

for root, dirs, files in os.walk(history_dir):
    if "entries.json" in files:
        entries_path = os.path.join(root, "entries.json")
        try:
            with open(entries_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            resource = data.get("resource", "")
            decoded = urllib.parse.unquote(resource).replace("\\", "/")
            
            if "(marketing)" in decoded.lower():
                print(f"Found match: {decoded}")
                entries = data.get("entries", [])
                if entries:
                    entries.sort(key=lambda x: x.get("timestamp", 0))
                    for entry in entries[-3:]:
                        backup_file = os.path.join(root, entry["id"])
                        ts = entry.get("timestamp", 0) / 1000
                        ts_str = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
                        print(f"  [{entry['id']}] {ts_str} -> {backup_file}")
                print("-" * 50)
        except Exception as e:
            pass
print("Scan complete.")
