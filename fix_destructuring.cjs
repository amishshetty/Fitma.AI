const fs = require('fs');

const files = [
  'mobile/app/progress-achievements.tsx',
  'mobile/app/progress-habits.tsx',
  'mobile/app/progress-monthly.tsx',
  'mobile/app/progress-nutrition.tsx',
  'mobile/app/progress-weekly.tsx',
  'mobile/app/progress-weight.tsx',
  'mobile/app/reminder-center.tsx',
  'mobile/app/reminder-hydration.tsx',
  'mobile/app/reminder-meal-flow.tsx',
  'mobile/app/reminder-preview.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove the badly injected code from parameters
  const badInjected = `\n  const appTheme = useAppStore((s: any) => s.appTheme);\n  const colorScheme = useColorScheme();\n  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');\n  const styles = React.useMemo(() => getStyles(isDark), [isDark]);\n`;
  content = content.replace(badInjected, '');
  
  // Find the actual start of the function body `) {`
  const properBodyStartMatch = content.match(/export default function \w+\([\s\S]*?\)\s*\{/);
  if (properBodyStartMatch) {
    content = content.replace(properBodyStartMatch[0], properBodyStartMatch[0] + badInjected);
  }
  
  fs.writeFileSync(file, content);
  console.log('Fixed syntax in ' + file);
});
