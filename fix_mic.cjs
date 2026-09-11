const fs = require('fs');
const file = 'mobile/app/(tabs)/liva-home.tsx';
let content = fs.readFileSync(file, 'utf8');

// The buttons look like:
// <Pressable style={styles.actionButton}>
//   <Mic size={22} color="#8e8e93" />
// </Pressable>
// <Pressable style={styles.actionButton}>
//   <Camera size={22} color="#8e8e93" />
// </Pressable>

content = content.replace(
  /<Pressable style=\{styles\.actionButton\}>\s*<Mic size=\{22\} color="#8e8e93" \/>\s*<\/Pressable>/,
  '<Pressable style={styles.actionButton} onPress={() => router.push("/voice-logging")}>\n                  <Mic size={22} color="#8e8e93" />\n                </Pressable>'
);

content = content.replace(
  /<Pressable style=\{styles\.actionButton\}>\s*<Camera size=\{22\} color="#8e8e93" \/>\s*<\/Pressable>/,
  '<Pressable style={styles.actionButton} onPress={() => router.push("/camera-logging")}>\n                  <Camera size={22} color="#8e8e93" />\n                </Pressable>'
);

fs.writeFileSync(file, content);
console.log('Fixed Mic and Camera buttons in liva-home');
