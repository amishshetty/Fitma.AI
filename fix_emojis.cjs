const fs = require('fs');
const file = 'mobile/app/profile-home.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\{.*?map\(\(badge, idx\)/, "{['🔥', '💧', '🎯', '🏆'].map((badge, idx)");
content = content.replace(/\{getGreeting\(\)\}, \{userName\} dY`<</g, "{getGreeting()}, {userName} 👋");

fs.writeFileSync(file, content);
console.log('Fixed syntax errors');
