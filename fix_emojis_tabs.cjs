const fs = require('fs');
const file = 'mobile/app/(tabs)/profile-home.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\{.*?map\(\(badge, idx\)/, "{['🏆', '🔥', '💧', '🎯'].map((badge, idx)");
content = content.replace(/\{userName\} dY`<</g, "{userName} 👋");

fs.writeFileSync(file, content);
console.log('Fixed syntax errors in tabs');
