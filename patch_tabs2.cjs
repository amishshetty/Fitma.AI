const fs = require('fs');

const file = 'mobile/app/(tabs)/_layout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/tabBarShowLabel: true,/g, "tabBarShowLabel: true,\n            tabBarActiveTintColor: isDark ? '#4ade80' : '#34c759',\n            tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',");

fs.writeFileSync(file, content);
console.log('Patched layout again');
