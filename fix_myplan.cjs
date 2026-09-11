const fs = require('fs');
const file = 'mobile/app/(tabs)/my-plan.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { Image }')) {
  content = content.replace("import { Text as RNText } from 'react-native';", "import { Text as RNText, Image } from 'react-native';");
}

// 1. Remove the conditional Check mark rendering (make it just an empty circle)
// Change:
// <View style={[styles.logDot, displayCalories > 0 && styles.logDotDone]}>
//   {displayCalories > 0 && <Check size={12} color="#fff" />}
// </View>
// To:
// <View style={styles.logDot} />

content = content.replace(/<View style=\{\[styles\.logDot, displayCalories > 0 && styles\.logDotDone\]\}>\s*\{displayCalories > 0 && <Check size=\{12\} color="#fff" \/>\}\s*<\/View>/g, '<View style={styles.logDot} />');

content = content.replace(/<View style=\{\[styles\.logDot, displayWater > 0 && styles\.logDotDone\]\}>\s*\{displayWater > 0 && <Check size=\{12\} color="#fff" \/>\}\s*<\/View>/g, '<View style={styles.logDot} />');

// 2. Add Images to the cards

// Food
content = content.replace(/<View style=\{\[styles\.logCardImg, \{ backgroundColor: '#f9ebd6' \}\]\} \/>/, `<View style={[styles.logCardImg, { backgroundColor: '#f9ebd6' }]}>
                <Image source={require('../../assets/images/my_plan_food.jpg')} style={styles.logCardImage} />
              </View>`);

// Water
content = content.replace(/<View style=\{\[styles\.logCardImg, \{ backgroundColor: '#dcf2fe' \}\]\} \/>/, `<View style={[styles.logCardImg, { backgroundColor: '#dcf2fe' }]}>
                <Image source={require('../../assets/images/my_plan_water.jpg')} style={styles.logCardImage} />
              </View>`);

// Weight
content = content.replace(/<View style=\{\[styles\.logCardImg, \{ backgroundColor: '#fee2e2' \}\]\} \/>/, `<View style={[styles.logCardImg, { backgroundColor: '#fee2e2' }]}>
                <Image source={require('../../assets/images/my_plan_weight.jpg')} style={styles.logCardImage} />
              </View>`);

// Activities (Wait, Activities doesn't have an image in the Web App? Let's check web app)
// Web App for Activities:
// <div className="mb-2 h-6 w-6 rounded-full border-[2px] border-slate-100 dark:border-border bg-slate-50 dark:bg-muted" />
// In mobile, it might be an empty card. 

// 3. Add styles.logCardImage
if (!content.includes('logCardImage: {')) {
  content = content.replace(/logCardImg: \{/g, `logCardImage: {
      width: 112,
      height: 112,
      borderRadius: 56,
      position: 'absolute',
      left: -16,
      top: 0,
      opacity: 0.9,
    },
    logCardImg: {`);
}

// Ensure logDot isn't green anymore if it had logDotDone
// Actually logDotDone is no longer used in JSX, but we can leave the style or remove it.

fs.writeFileSync(file, content);
console.log('Fixed MyPlan images and dots');
