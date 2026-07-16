const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const commonIcons = ['Image', 'Text', 'Screen', 'Audio', 'Video'];
      for (const icon of commonIcons) {
         // Check if the icon is used as a component (e.g. <Image)
         if (content.match(new RegExp(`<${icon}\\b`))) {
            // Check if it's imported in this file
            if (!content.includes(`import `) || !content.match(new RegExp(`import\\s+.*${icon}.*\\s+from`))) {
               console.log(`Found unimported <${icon}> in ${fullPath}`);
            }
         }
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log("Done checking for unimported icons.");
