const fs = require('fs');

const files = [
  'mobile/app/(tabs)/home.tsx',
  'mobile/app/(tabs)/liva-home.tsx',
  'mobile/app/(tabs)/progress-dashboard.tsx',
  'mobile/app/(tabs)/profile-home.tsx',
  'mobile/app/profile-settings.tsx',
  'mobile/app/profile-personal.tsx',
  'mobile/app/profile-liva.tsx',
  'mobile/app/profile-help.tsx',
  'mobile/app/profile-legal.tsx',
  'mobile/app/profile-privacy-policy.tsx',
  'mobile/app/profile-licenses.tsx',
  'mobile/app/profile-privacy.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');

  // If this file already has a broken injection from previous scripts, we should try to clean it up for the untracked files
  // For tracked files, we reverted them to original state, so they are clean.
  // Actually, let's just do a clean regex replacement on the clean files.
  
  if (content.includes("isDark ? isDark ?")) {
    console.log("File " + file + " is broken, you need to manually fix it!");
    return;
  }

  if (!content.includes('useColorScheme')) {
    content = content.replace("import { View", "import { View, useColorScheme");
  }
  if (!content.includes('useAppStore')) {
    content = content.replace("import React", "import { useAppStore } from '../../store/useAppStore';\nimport React");
    // Handle the depth for profile-settings vs home
    content = content.replace("'../../store/useAppStore'", file.includes('(tabs)') ? "'../../store/useAppStore'" : "'../store/useAppStore'");
  }

  // Change StyleSheet.create to getStyles(isDark)
  if (!content.includes('const getStyles = (isDark: boolean) => StyleSheet.create({')) {
    content = content.replace(/const styles = StyleSheet\.create\(\{/g, 'const getStyles = (isDark: boolean) => StyleSheet.create({');
  }

  // Inject the hook inside the component
  const componentMatch = content.match(/export default function \w+\([^)]*\) \{/);
  if (componentMatch && !content.includes('const styles = React.useMemo')) {
    const hookInjection = `\n  const appTheme = useAppStore(s => s.appTheme);\n  const colorScheme = useColorScheme();\n  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');\n  const styles = React.useMemo(() => getStyles(isDark), [isDark]);\n`;
    content = content.replace(componentMatch[0], componentMatch[0] + hookInjection);
  }
  
  // Replace profile-settings.tsx specific things
  if (file.includes('profile-settings.tsx') && !content.includes('handleThemeChange')) {
    content = content.replace(/const \[theme, setTheme\] = useState\('System'\);/g, "const setAppTheme = useAppStore(s => s.setAppTheme);\n  const displayTheme = appTheme.charAt(0).toUpperCase() + appTheme.slice(1);\n  const handleThemeChange = (opt: string) => {\n    setAppTheme(opt.toLowerCase() as 'light' | 'dark' | 'system');\n  };");
    content = content.replace(/value=\{theme\}/g, "value={displayTheme}");
    content = content.replace(/onChange=\{setTheme\}/g, "onChange={handleThemeChange}");
    content = content.replace(/onLogout = \(\) => \{/g, "onLogout = () => {\n    useAppStore.getState().logout();");
  }

  // For color replacing, instead of string replaces that overlap, we do it in a single pass using a regex replacer function
  const parts = content.split('const getStyles = (isDark: boolean) => StyleSheet.create({');
  if (parts.length === 2) {
    let stylesStr = parts[1];
    
    stylesStr = stylesStr.replace(/'#(F4FAF6|EAF8F1|f8fafc|fff|ffffff|000|10201a|0f172a|64748b|f1f5f9|e2e8f0|cbd5e1|34C759|f43f5e|ef4444)'/gi, (match) => {
      const hex = match.replace(/'/g, '').toLowerCase();
      if (hex === '#f4faf6' || hex === '#eaf8f1' || hex === '#f8fafc') return "isDark ? '#0f172a' : '" + match.replace(/'/g, '') + "'";
      if (hex === '#fff' || hex === '#ffffff') return "isDark ? '#1e293b' : '" + match.replace(/'/g, '') + "'";
      if (hex === '#000' || hex === '#10201a' || hex === '#0f172a') return "isDark ? '#f8fafc' : '" + match.replace(/'/g, '') + "'";
      if (hex === '#64748b') return "isDark ? '#94a3b8' : '#64748b'";
      if (hex === '#f1f5f9' || hex === '#e2e8f0' || hex === '#cbd5e1') return "isDark ? '#334155' : '" + match.replace(/'/g, '') + "'";
      if (hex === '#34c759') return "isDark ? '#4ade80' : '#34C759'";
      if (hex === '#f43f5e' || hex === '#ef4444') return "isDark ? '#fb7185' : '" + match.replace(/'/g, '') + "'";
      return match;
    });
    
    content = parts[0] + 'const getStyles = (isDark: boolean) => StyleSheet.create({' + stylesStr;
  }

  // For untracked files that already have the broken injection:
  if (content.includes("isDark ? isDark ?")) {
    content = content.replace(/isDark \? isDark \? '[^']+' : '[^']+' : '[^']+'/g, (match) => {
      // just try to extract the original color or clean it
      return match.split(' : ')[2]; // rough fix, we will just regenerate them manually
    });
  }

  fs.writeFileSync(file, content);
  console.log('Patched ' + file);
});
