const fs = require('fs');
const file = 'mobile/app/(tabs)/_layout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Convert global StyleSheet to a function
content = content.replace(/const styles = StyleSheet\.create\(\{/g, 'const getStyles = (isDark: boolean) => StyleSheet.create({');

// Inject the useMemo hook inside TabsLayout
const componentMatch = content.match(/const isDark = appTheme === 'dark' \|\| \(appTheme === 'system' && colorScheme === 'dark'\);/);
if (componentMatch && !content.includes('const styles = React.useMemo')) {
  content = content.replace(componentMatch[0], componentMatch[0] + "\n  const styles = React.useMemo(() => getStyles(isDark), [isDark]);");
}

fs.writeFileSync(file, content);
console.log('Fixed TabsLayout global isDark error');
