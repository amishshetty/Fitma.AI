const fs = require('fs');
const file = 'mobile/components/layout/LivaAvatar.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useColorScheme')) {
  content = content.replace("import { View", "import { View, useColorScheme");
}
if (!content.includes('useAppStore')) {
  content = content.replace("import React, { useEffect, useRef } from 'react';", "import React, { useEffect, useRef } from 'react';\nimport { useAppStore } from '../../store/useAppStore';");
}

if (!content.includes('const getStyles')) {
  content = content.replace(/const styles = StyleSheet\.create\(\{/g, 'const getStyles = (isDark: boolean) => StyleSheet.create({');
}

const componentMatch = content.match(/const translateY = useRef/);
if (componentMatch && !content.includes('const styles = React.useMemo')) {
  const hookInjection = `  const appTheme = useAppStore(s => s.appTheme);\n  const colorScheme = useColorScheme();\n  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');\n  const styles = React.useMemo(() => getStyles(isDark), [isDark]);\n\n  `;
  content = content.replace(componentMatch[0], hookInjection + componentMatch[0]);
}

const parts = content.split('const getStyles = (isDark: boolean) => StyleSheet.create({');
if (parts.length === 2) {
  let stylesStr = parts[1];
  stylesStr = stylesStr.replace(/backgroundColor: '#ffffff'/g, "backgroundColor: isDark ? '#1e293b' : '#ffffff'");
  content = parts[0] + 'const getStyles = (isDark: boolean) => StyleSheet.create({' + stylesStr;
}

fs.writeFileSync(file, content);
console.log('Fixed LivaAvatar.tsx');
