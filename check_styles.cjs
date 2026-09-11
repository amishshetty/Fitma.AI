const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.expo') {
        getFiles(fullPath, files);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = getFiles('mobile/app');
let found = false;

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('styles.') && !content.includes('const styles') && !content.includes('let styles') && !content.includes('var styles') && !content.includes('styles =')) {
    console.log('MISSING STYLES IN: ' + file);
    found = true;
  }
});
if (!found) console.log('All files seem fine.');
