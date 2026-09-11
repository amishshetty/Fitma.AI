const fs = require('fs');

function moveHelpersInside(file, helperNames, mainComponent) {
  let content = fs.readFileSync(file, 'utf8');
  for (const helper of helperNames) {
    const helperRegex = new RegExp(`(function ${helper}\\([^)]*\\)[\\s\\S]*?^\\})|((?:const|let|var) ${helper} = \\([^)]*\\) =>[\\s\\S]*?^\\};?)`, 'm');
    const match = content.match(helperRegex);
    if (match) {
      const helperBody = match[0];
      content = content.replace(helperBody, '');
      const mainRegex = new RegExp(`export default function ${mainComponent}\\([^)]*\\) \\{`);
      content = content.replace(mainRegex, `export default function ${mainComponent}() {\n${helperBody}\n`);
    }
  }
  // Wait, in liva-response, SimpleSlider is `const SimpleSlider = ({ value... }: any) => { ... }`
  fs.writeFileSync(file, content);
}

moveHelpersInside('mobile/app/index.tsx', ['ProgressDots'], 'Index');
moveHelpersInside('mobile/app/login.tsx', ['LivaAvatarSmall'], 'LoginScreen');
// SimpleSlider uses `styles`
moveHelpersInside('mobile/app/liva-response.tsx', ['SimpleSlider'], 'LivaResponseScreen');

console.log('Fixed helper scope');
