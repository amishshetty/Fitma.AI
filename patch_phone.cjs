const fs = require('fs');

let file = 'mobile/app/profile-personal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /value=\{phone\}/,
  `value={phone} placeholder="Please add your phone number" placeholderTextColor="#64748b"`
);

fs.writeFileSync(file, content);
console.log('Added phone placeholder');
