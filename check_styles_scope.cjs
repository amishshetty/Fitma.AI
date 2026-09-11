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
let errors = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Check if styles is used outside a React component.
  // We can do this roughly by finding 'styles.' and seeing if it occurs after `export default function` or similar.
  // More robust: count `{` and `}` to see if it's top-level, but simple way:
  // Is it before `export default`?
  const exportIndex = content.indexOf('export default');
  if (exportIndex > -1) {
    const beforeExport = content.substring(0, exportIndex);
    if (beforeExport.includes('styles.')) {
      errors.push(`${file} uses styles before export`);
    }
  }
});
console.log(errors.length ? errors.join('\n') : 'No styles outside components.');
