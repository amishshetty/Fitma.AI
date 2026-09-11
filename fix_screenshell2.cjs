const fs = require('fs');
const file = 'mobile/components/layout/ScreenShell.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const isDark = appTheme === 'dark' \|\| \(appTheme === 'system' && colorScheme === 'dark'\);/,
  "const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');\n  const styles = React.useMemo(() => getStyles(isDark), [isDark]);"
);

fs.writeFileSync(file, content);
console.log('Fixed ScreenShell styles');
