const fs = require('fs');
const file = 'mobile/app/(tabs)/home.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix ProgressRing
content = content.replace(/const ProgressRing = \(\{ value, size, color \}: any\) => \{/, 'const ProgressRing = ({ value, size, color, isDark }: any) => {');
content = content.replace(/stroke="#e2e8f0"/g, 'stroke={isDark ? "#334155" : "#e2e8f0"}');

// Pass isDark to ProgressRings
content = content.replace(/<ProgressRing value=\{/g, '<ProgressRing isDark={isDark} value={');

// Fix waterBtnAddText
content = content.replace(/waterBtnAddText: \{\s*color: isDark \? '#1e293b' : '#fff',/g, `waterBtnAddText: {
      color: '#ffffff',`);

// What about floating button icon size or color? 
// The user said "the buttons are not the same". Maybe they meant the tab bar icons or something else.
// I will also double check `logActionButton`.
// Earlier I restored `logActionLabel` to `#ffffff`.

fs.writeFileSync(file, content);
console.log('Fixed home buttons and progress ring');
