import subprocess
import time

print("Parsing dangling.txt...")
try:
    with open("dangling.txt", "r") as f:
        lines = f.readlines()
        
    hashes = [line.split()[2] for line in lines if "blob" in line]
    print(f"Checking {len(hashes)} dangling blobs...")
    
    found_matches = []
    
    for i, h in enumerate(hashes):
        if i % 50 == 0:
            print(f"Processed {i}/{len(hashes)}")
            
        try:
            content = subprocess.check_output(["git", "cat-file", "-p", h], stderr=subprocess.DEVNULL)
            text = content.decode('utf-8', errors='ignore')
            
            # test/page.tsx check
            if "export default function TestPage()" in text and ("min-h-[92vh]" in text or "HERO SECTION" in text):
                print(f"\nFOUND POSSIBLE TEST PAGE MATCH IN BLOB: {h}")
                found_matches.append(h)
        except Exception:
            pass
            
    print(f"\nSearch complete. Found {len(found_matches)} possible matches.")
    for m in found_matches:
        print(f"Blob: {m}")
        
except Exception as e:
    print(f"Error: {e}")
