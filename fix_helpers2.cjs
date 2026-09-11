const fs = require('fs');

function moveHelpersInside(file, helperName) {
  let content = fs.readFileSync(file, 'utf8');
  // Match `function Name(...) { ... }` or `const Name = (...) => { ... }` up to the closing brace on a new line
  const helperRegex = new RegExp(`(function ${helperName}\\([^)]*\\)[\\s\\S]*?^\\})|(const ${helperName} = [\\s\\S]*?^\\};?)`, 'm');
  const match = content.match(helperRegex);
  if (match) {
    const helperBody = match[0];
    content = content.replace(helperBody, '');
    const mainRegex = /export default function \w+\([^)]*\) \{/;
    content = content.replace(mainRegex, (m) => m + `\n${helperBody}\n`);
    fs.writeFileSync(file, content);
    console.log(`Moved ${helperName} in ${file}`);
  } else {
    console.log(`Could not find ${helperName} in ${file}`);
  }
}

moveHelpersInside('mobile/app/index.tsx', 'ProgressDots');
moveHelpersInside('mobile/app/login.tsx', 'LivaAvatarSmall');
moveHelpersInside('mobile/app/liva-response.tsx', 'SimpleSlider');

