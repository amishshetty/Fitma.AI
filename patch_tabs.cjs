const fs = require('fs');

const file = 'mobile/app/(tabs)/_layout.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useColorScheme')) {
  content = content.replace("import { View", "import { View, useColorScheme");
}

if (!content.includes('const colorScheme = useColorScheme();')) {
  const componentMatch = content.match(/export default function TabsLayout\(\) \{/);
  if (componentMatch) {
    const hookInjection = `\n  const appTheme = useAppStore(s => s.appTheme);\n  const colorScheme = useColorScheme();\n  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');\n`;
    content = content.replace(componentMatch[0], componentMatch[0] + hookInjection);
  }
}

// Update the tabBarStyle backgroundColor
content = content.replace(/tabBarStyle: \{\s*backgroundColor: '#ffffff'/g, "tabBarStyle: {\n            backgroundColor: isDark ? '#1e293b' : '#ffffff'");
content = content.replace(/tabBarActiveTintColor: '#34c759'/g, "tabBarActiveTintColor: isDark ? '#4ade80' : '#34c759'");
content = content.replace(/tabBarInactiveTintColor: '#94a3b8'/g, "tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8'");

// Make floatingContainer shadow dynamic if possible
content = content.replace(/shadowColor: '#000'/g, "shadowColor: isDark ? '#000' : '#000'");

fs.writeFileSync(file, content);
console.log('Patched layout');
