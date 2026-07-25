const fs = require('fs');
const path = require('path');
function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const reactImportMatch = content.match(/import\s+[^;]*from\s+[\"']react[\"']/g);
      if (reactImportMatch) {
        for (const match of reactImportMatch) {
           const badImports = ['Activity', 'Image', 'Text', 'Screen', 'Audio', 'Video', 'Mic'];
           for (const b of badImports) {
             if (match.includes(b)) {
               console.log('Misimported icon in ' + fullPath + ' -> ' + match);
             }
           }
        }
      }
    }
  }
}
processDir(path.join(__dirname, 'src'));
