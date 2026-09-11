const fs = require('fs');
const file = 'mobile/app/(tabs)/home.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the View with LinearGradient
content = content.replace(/<View style=\{styles\.quickLogContainer\}>/, `
        <LinearGradient 
          colors={['#34C759', '#00C4B0']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.quickLogContainer}
        >`);
content = content.replace(/<\/View>\s*\{\/\* Daily Nutrition \*\/\}/, `
        </LinearGradient>\n\n        {/* Daily Nutrition */}`);

// Fix the text colors inside the green block
content = content.replace(/quickLogTitle: \{\s*fontSize: 18,\s*fontWeight: 'bold',\s*color: isDark \? '#1e293b' : '#fff',/g, `quickLogTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff',`);
      
content = content.replace(/logActionLabel: \{\s*color: isDark \? '#1e293b' : '#fff',/g, `logActionLabel: {
      color: '#ffffff',`);

// Remove backgroundColor: '#10b981' from quickLogContainer
content = content.replace(/backgroundColor: '#10b981',/g, '');

fs.writeFileSync(file, content);
console.log('Fixed QuickLog card in home.tsx');
