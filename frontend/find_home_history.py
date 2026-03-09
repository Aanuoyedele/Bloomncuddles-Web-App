import os
import json
import urllib.parse
from datetime import datetime
import shutil

history_dir = r"C:\Users\AANU\AppData\Roaming\Code\User\History"
target_str = "(marketing)/page.tsx"

print(f"Scanning {history_dir} for {target_str}...")

for root, dirs, files in os.walk(history_dir):
    if "entries.json" in files:
        entries_path = os.path.join(root, "entries.json")
        try:
            with open(entries_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            resource = data.get("resource", "")
            if not resource:
                continue

            decoded = urllib.parse.unquote(resource).replace("\\", "/")
            
            if target_str in decoded.lower():
                print(f"Found match: {decoded}")
                entries = data.get("entries", [])
                if entries:
                    entries.sort(key=lambda x: x.get("timestamp", 0))
                    for entry in entries[-5:]: # Last 5 backups
                        backup_file = os.path.join(root, entry["id"])
                        ts = entry.get("timestamp", 0) / 1000
                        ts_str = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
                        print(f"  [{entry['id']}] {ts_str} -> {backup_file}")
                print("-" * 50)
        except Exception as e:
            pass
print("Scan complete.")
