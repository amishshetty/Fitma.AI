const fs = require('fs');
const file = 'mobile/app/(tabs)/_layout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/backgroundColor: '#ffffff'/g, "backgroundColor: isDark ? '#1e293b' : '#ffffff'");
content = content.replace(/tabBarActiveTintColor: '#34C759'/g, "tabBarActiveTintColor: isDark ? '#4ade80' : '#34C759'");
content = content.replace(/tabBarInactiveTintColor: '#94a3b8'/g, "tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8'");
content = content.replace(/shadowColor: '#000'/g, "shadowColor: isDark ? '#000' : '#000'"); // shadow on dark might be #000 anyway, let's keep it

fs.writeFileSync(file, content);
console.log('Fixed TabsLayout colors');
