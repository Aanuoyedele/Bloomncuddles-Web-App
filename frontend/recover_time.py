import os
import json
import urllib.parse
from datetime import datetime
import shutil

history_dir = r"C:\Users\AANU\AppData\Roaming\Code\User\History"
target_str = "bloomncuddles website/frontend"

# Define time boundaries in local time based on user request
# User: "everything I have done from 10pm up until 12:45am"
# Current time: 2026-03-09T01:13:16+01:00
start_time_str = "2026-03-08 22:00:00"
end_time_str = "2026-03-09 00:45:00"

format_str = "%Y-%m-%d %H:%M:%S"
start_dt = datetime.strptime(start_time_str, format_str)
end_dt = datetime.strptime(end_time_str, format_str)

start_ts = start_dt.timestamp() * 1000
end_ts = end_dt.timestamp() * 1000

print(f"Scanning {history_dir} for backups between {start_time_str} and {end_time_str}...")

restored_count = 0

for root, dirs, files in os.walk(history_dir):
    if "entries.json" in files:
        entries_path = os.path.join(root, "entries.json")
        try:
            with open(entries_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            resource = data.get("resource", "")
            if not resource:
                continue

            decoded = urllib.parse.unquote(resource).replace("\\", "/") # normalize slashes
            
            if target_str in decoded.lower() and "package" not in decoded.lower() and ".py" not in decoded.lower():
                entries = data.get("entries", [])
                if not entries:
                    continue
                
                # Filter entries within the time range
                valid_entries = [e for e in entries if start_ts <= e.get("timestamp", 0) <= end_ts]
                
                if valid_entries:
                    # Sort chronologically to get the latest one within the range
                    valid_entries.sort(key=lambda x: x.get("timestamp", 0))
                    target_entry = valid_entries[-1]
                    
                    backup_file = os.path.join(root, target_entry["id"])
                    
                    if os.path.exists(backup_file):
                        # Construct real path
                        real_path = decoded.replace('vscode-remote://', '').replace('file:///', '')
                        if len(real_path) > 2 and (real_path[1] == ':' or real_path[2] == ':'):
                            if real_path.startswith('/'):
                                real_path = real_path[1:]
                            real_path = real_path[0].upper() + real_path[1:]
                            
                        real_path = real_path.replace('/', '\\')
                        
                        ts_str = datetime.fromtimestamp(target_entry.get('timestamp', 0) / 1000).strftime(format_str)
                        print(f"Restoring {real_path}")
                        print(f"  -> from backup at {ts_str}")
                        
                        shutil.copy2(backup_file, real_path)
                        restored_count += 1
                        
        except Exception as e:
            pass

print(f"Restore complete. Restored {restored_count} files.")
