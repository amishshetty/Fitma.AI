const fs = require('fs');

let file = 'mobile/app/profile-personal.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/readOnlyInput: \\\{ opacity: 0\\.7 \\\},/g, "readOnlyInput: { opacity: 0.7 },");
fs.writeFileSync(file, content);
console.log('Fixed readOnlyInput syntax error');
