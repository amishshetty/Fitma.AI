const fs = require('fs');
const path = require('path');
const icons = new Set();
function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const match = content.match(/import\s+\{([^}]+)\}\s+from\s+["']lucide-react["']/);
      if (match) {
         const parts = match[1].split(',').map(s => s.trim()).filter(s => s);
         parts.forEach(p => icons.add(p));
      }
    }
  }
}
processDir(path.join(__dirname, 'src'));
console.log(Array.from(icons).join(', '));
