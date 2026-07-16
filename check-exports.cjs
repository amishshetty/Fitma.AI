const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const defaultImports = [...content.matchAll(/import\s+([a-zA-Z0-9_]+)\s+from\s+["'](\.[^"']+)["']/g)];
      
      for (const match of defaultImports) {
         const importName = match[1];
         const importPath = match[2];
         
         if (importName === 'React') continue;
         
         const absolutePath = path.resolve(path.dirname(fullPath), importPath);
         
         let targetPath = absolutePath;
         if (fs.existsSync(absolutePath + '.tsx')) targetPath += '.tsx';
         else if (fs.existsSync(absolutePath + '.ts')) targetPath += '.ts';
         else if (fs.existsSync(absolutePath + '/index.tsx')) targetPath += '/index.tsx';
         else if (fs.existsSync(absolutePath + '/index.ts')) targetPath += '/index.ts';
         else continue;
         
         const targetContent = fs.readFileSync(targetPath, 'utf8');
         if (!targetContent.includes('export default')) {
             console.log(`Bad default import in ${fullPath}: import ${importName} from ${importPath}`);
             console.log(`But ${targetPath} has no default export!`);
         }
      }
    }
  }
}
processDir(path.join(__dirname, 'src'));
console.log("Done checking default imports.");
