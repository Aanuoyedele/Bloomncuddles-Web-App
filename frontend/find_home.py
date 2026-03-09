import os
import json
import urllib.parse
from datetime import datetime
import shutil

history_dir = r"C:\Users\AANU\AppData\Roaming\Code\User\History"
target_str = "app/(marketing)/page.tsx"
output_file = "restored_home_page.tsx"

print(f"Scanning {history_dir} for {target_str}...")

selected_backup = None

for root, dirs, files in os.walk(history_dir):
    if "entries.json" in files:
        entries_path = os.path.join(root, "entries.json")
        try:
            with open(entries_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            resource = data.get("resource", "")
            if not resource: continue

            decoded = urllib.parse.unquote(resource).replace("\\", "/")
            
            # Look for the home page
            if "bloomncuddles" in decoded.lower() and target_str in decoded.lower():
                print(f"Found match: {decoded}")
                entries = data.get("entries", [])
                
                # Filter entries from Mar 8th between 10 PM and 12:45 AM (Mar 9th)
                # Actually, wait... the user said 10 PM to 12:45 AM.
                # Let's just find the absolute latest entry before 1 AM Mar 9th 
                # or before the button refactor wiped everything.
                if entries:
                    entries.sort(key=lambda x: x.get("timestamp", 0))
                    
                    # Log the last 5 for context
                    print("Last 5 backups:")
                    for entry in entries[-5:]:
                        ts = entry.get("timestamp", 0) / 1000
                        ts_str = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
                        print(f"  [{entry['id']}] {ts_str}")
                    
                    # The latest available entry period is likely the one we want.
                    latest_entry = entries[-1]
                    selected_backup = os.path.join(root, latest_entry["id"])
                    
                print("-" * 50)
        except Exception as e:
            pass

if selected_backup and os.path.exists(selected_backup):
    shutil.copy(selected_backup, output_file)
    print(f"✅ Extracted latest home page backup to {output_file}")
    
    # Let's ALSO check if there are any other file paths that might be the home page explicitly
else:
    print("❌ Could not find a backup for the home page.")
