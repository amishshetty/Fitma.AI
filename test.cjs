const fs = require('fs');
const file = 'mobile/app/(tabs)/home.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the <View style={styles.quickLogContainer}> with LinearGradient
content = content.replace(/<View style=\{styles\.quickLogContainer\}>/, `
        <LinearGradient 
          colors={['#34C759', '#00C4B0']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.quickLogContainer}
        >`);

content = content.replace(/<\/View>\s*<\!-- Today's Nutrition -->/, `
        </LinearGradient>\n\n        {/* Today's Nutrition */}`);

// We need to just replace the closing tag of the quickLogContainer.
// Wait, the regex above `</View>\s*<\!-- Today's Nutrition -->` won't work in JSX.
// JSX comment is {/* Today's Nutrition */}
