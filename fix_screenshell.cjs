const fs = require('fs');
const file = 'mobile/components/layout/ScreenShell.tsx';
let content = fs.readFileSync(file, 'utf8');

const injection = `
  const appTheme = useAppStore((s: any) => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);
`;

// It has:
//   scrollable = true,
//   noPadding = false,
// }: any) {
//   return (

content = content.replace(
  /\}: any\) \{\s*return \(/,
  `}: any) {${injection}\n  return (`
);

fs.writeFileSync(file, content);
console.log('Fixed ScreenShell');
