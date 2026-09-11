const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (file.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = getFiles('mobile/app');

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('const getStyles = (isDark: boolean)') && !content.includes('const styles = React.useMemo(')) {
    // Inject styles
    // Find where the component body starts. Usually `export default function Name(...) {`
    const compMatch = content.match(/export default function \w+[\s\S]*?\{/);
    if (compMatch) {
      const hookInjection = `\n  const appTheme = useAppStore((s: any) => s.appTheme);\n  const colorScheme = useColorScheme();\n  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');\n  const styles = React.useMemo(() => getStyles(isDark), [isDark]);\n`;
      content = content.replace(compMatch[0], compMatch[0] + hookInjection);
      fs.writeFileSync(file, content);
      console.log('Fixed styles injection in ' + file);
    } else {
      console.log('Could not find component in ' + file);
    }
  }
});
