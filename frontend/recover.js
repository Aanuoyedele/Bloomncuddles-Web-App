const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
const targetStr = 'Bloomncuddles website'.toLowerCase();

try {
  const folders = fs.readdirSync(historyDir);
  console.log(`Checking ${folders.length} folders in Local History.`);
  
  for (const folder of folders) {
    const folderPath = path.join(historyDir, folder);
    const entriesPath = path.join(folderPath, 'entries.json');
    if (fs.existsSync(entriesPath)) {
      const data = fs.readFileSync(entriesPath, 'utf8');
      const entriesData = JSON.parse(data);
      
      const fileUri = entriesData.resource;
      if (fileUri) {
        const decodedUri = decodeURIComponent(fileUri).toLowerCase();
        if (decodedUri.includes(targetStr) && !decodedUri.includes('package.json') && !decodedUri.includes('package-lock.json')) {
          const entries = entriesData.entries || [];
          if (entries.length > 0) {
            // Get the latest backup ID before the `git checkout .` wipe
            const latestEntry = entries[entries.length - 1]; 
            const backupPath = path.join(folderPath, latestEntry.id);
            
            if (fs.existsSync(backupPath)) {
              let realPath = decodeURIComponent(fileUri.replace('vscode-remote://', '').replace(/^file:\/\/\//i, ''));
              if (realPath.match(/^[a-zA-Z]:\//)) {
                realPath = realPath.charAt(0).toUpperCase() + realPath.slice(1);
              }
              realPath = realPath.replace(/\//g, '\\');
              
              console.log(`Restoring: ${realPath}`);
              const backupContent = fs.readFileSync(backupPath);
              fs.writeFileSync(realPath, backupContent);
            }
          }
        }
      }
    }
  }
} catch (err) {
  console.error(err);
}
console.log('Restore attempt finished.');
