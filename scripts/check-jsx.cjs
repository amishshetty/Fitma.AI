const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const tags = [...content.matchAll(/<([A-Z][a-zA-Z0-9_]*)/g)].map(m => m[1]);
      
      for (const tag of [...new Set(tags)]) {
          const isImported = new RegExp(`import\\s+.*?\\b${tag}\\b.*?\\s+from`).test(content);
          const isDeclaredFunction = new RegExp(`function\\s+${tag}\\b`).test(content);
          const isDeclaredConst = new RegExp(`const\\s+${tag}\\b`).test(content);
          const isDeclaredClass = new RegExp(`class\\s+${tag}\\b`).test(content);
          
          if (!isImported && !isDeclaredFunction && !isDeclaredConst && !isDeclaredClass) {
             console.log(`Unresolved component <${tag}> in ${fullPath}`);
          }
      }
    }
  }
}
processDir(path.join(__dirname, 'src'));
console.log("Done checking JSX tags.");
