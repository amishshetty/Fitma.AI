const fs = require('fs');

const files = [
  'mobile/app/(tabs)/home.tsx',
  'mobile/app/(tabs)/liva-home.tsx',
  'mobile/app/(tabs)/progress-dashboard.tsx',
  'mobile/app/(tabs)/profile-home.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add imports if missing
  if (!content.includes('useAppStore')) {
    content = content.replace("import React", "import { useAppStore } from '../../store/useAppStore';\nimport React");
  }
  if (!content.includes('useColorScheme')) {
    content = content.replace("import { View", "import { View, useColorScheme");
  }

  // 2. Change StyleSheet.create to getStyles(isDark)
  content = content.replace(/const styles = StyleSheet\.create\(\{/g, 'const getStyles = (isDark: boolean) => StyleSheet.create({');

  // 3. Inject the hook inside the component
  const componentMatch = content.match(/export default function \w+\([^)]*\) \{/);
  if (componentMatch) {
    const hookInjection = `\n  const appTheme = useAppStore(s => s.appTheme);\n  const colorScheme = useColorScheme();\n  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');\n  const styles = React.useMemo(() => getStyles(isDark), [isDark]);\n`;
    content = content.replace(componentMatch[0], componentMatch[0] + hookInjection);
  }

  // 4. Replace colors inside the getStyles function
  const parts = content.split('const getStyles = (isDark: boolean) => StyleSheet.create({');
  if (parts.length === 2) {
    let stylesStr = parts[1];
    
    // Backgrounds
    stylesStr = stylesStr.replace(/'#F4FAF6'/gi, "isDark ? '#0f172a' : '#F4FAF6'");
    stylesStr = stylesStr.replace(/'#EAF8F1'/gi, "isDark ? '#0f172a' : '#EAF8F1'");
    stylesStr = stylesStr.replace(/'#f8fafc'/gi, "isDark ? '#0f172a' : '#f8fafc'");
    
    // Cards
    stylesStr = stylesStr.replace(/'#fff'/gi, "isDark ? '#1e293b' : '#fff'");
    stylesStr = stylesStr.replace(/'#ffffff'/gi, "isDark ? '#1e293b' : '#ffffff'");
    
    // Texts
    stylesStr = stylesStr.replace(/'#000'/gi, "isDark ? '#f8fafc' : '#000'");
    stylesStr = stylesStr.replace(/'#10201a'/gi, "isDark ? '#f8fafc' : '#10201a'");
    stylesStr = stylesStr.replace(/'#0f172a'/gi, "isDark ? '#f8fafc' : '#0f172a'");
    
    // Subtexts
    stylesStr = stylesStr.replace(/'#64748b'/gi, "isDark ? '#94a3b8' : '#64748b'");
    
    // Borders
    stylesStr = stylesStr.replace(/'#f1f5f9'/gi, "isDark ? '#334155' : '#f1f5f9'");
    stylesStr = stylesStr.replace(/'#e2e8f0'/gi, "isDark ? '#334155' : '#e2e8f0'");
    
    content = parts[0] + 'const getStyles = (isDark: boolean) => StyleSheet.create({' + stylesStr;
  }

  fs.writeFileSync(file, content);
  console.log('Patched ' + file);
});
