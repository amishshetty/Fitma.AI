const fs = require('fs');
const file = 'mobile/app/(tabs)/my-plan.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<Text style=\{\{ fontSize: 10, fontWeight: 'bold', color: '#10b981' \}\}>COMING SOON<\/Text>/,
  "<Text style={{ fontSize: 10, fontWeight: 'bold', color: '#10b981', textAlign: 'center' }}>COMING\\nSOON</Text>");

fs.writeFileSync(file, content);
console.log('Fixed COMING SOON');
