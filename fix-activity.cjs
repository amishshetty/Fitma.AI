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
      
      // Check if Activity is imported from react
      if (content.match(/import\s+React.*?\,\s*Activity\s*\}/)) {
        console.log("Fixing: " + fullPath);
        // Remove Activity from react import
        content = content.replace(/(\,\s*Activity)(?=\s*\} from ['"]react['"])/g, '');
        
        // Add Activity to lucide-react import
        if (content.includes('from "lucide-react"')) {
            content = content.replace(/import\s+\{([^}]+)\}\s+from\s+["']lucide-react["']/, (match, p1) => {
                if (!p1.includes('Activity')) {
                    return `import {${p1}, Activity} from "lucide-react"`;
                }
                return match;
            });
        } else {
            content = `import { Activity } from "lucide-react";\n` + content;
        }

        fs.writeFileSync(fullPath, content);
      }
      
      // Also check other common icons that might have been misimported
      const commonIcons = ['Image', 'Text', 'Screen', 'Audio', 'Video'];
      for (const icon of commonIcons) {
         if (content.match(new RegExp(`import\\s+React.*?\\,\\s*${icon}\\s*\\}`))) {
            console.log("Fixing " + icon + ": " + fullPath);
            content = content.replace(new RegExp(`(\\,\\s*${icon})(?=\\s*\\} from ['"]react['"])`, 'g'), '');
            
            if (content.includes('from "lucide-react"')) {
                content = content.replace(/import\s+\{([^}]+)\}\s+from\s+["']lucide-react["']/, (match, p1) => {
                    if (!p1.includes(icon)) {
                        return `import {${p1}, ${icon}} from "lucide-react"`;
                    }
                    return match;
                });
            } else {
                content = `import { ${icon} } from "lucide-react";\n` + content;
            }
            fs.writeFileSync(fullPath, content);
         }
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log("Done checking for misimported icons.");
