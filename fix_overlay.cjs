const fs = require('fs');
const file = 'mobile/components/layout/LivaSiriOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

const injection = `
  const appTheme = useAppStore((s: any) => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);
`;

// It's currently:
// }) {
//   const slideAnim = useRef(new Animated.Value(300)).current;

content = content.replace(
  /\}\) \{\s*const slideAnim/,
  `}) {${injection}\n  const slideAnim`
);

fs.writeFileSync(file, content);
console.log('Fixed LivaSiriOverlay');
