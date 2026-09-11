const fs = require('fs');

const files = [
  'mobile/app/profile-personal.tsx',
  'mobile/app/profile-liva.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes('useAppStore')) {
    content = content.replace("import React", "import { useAppStore } from '../store/useAppStore';\nimport React");
  }

  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
});
