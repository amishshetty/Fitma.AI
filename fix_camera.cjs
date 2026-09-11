const fs = require('fs');
const file = 'mobile/app/liva-chat.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<Pressable style=\{styles\.actionButton\}>\s*<Camera size=\{22\} color="#8e8e93" \/>\s*<\/Pressable>/,
  '<Pressable style={styles.actionButton} onPress={() => router.push("/camera-logging")}>\n                <Camera size={22} color="#8e8e93" />\n              </Pressable>'
);

fs.writeFileSync(file, content);
console.log('Fixed Camera button in liva-chat');
