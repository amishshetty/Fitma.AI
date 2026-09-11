const fs = require('fs');
const file = 'mobile/app/liva-chat.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add ImagePicker
if (!content.includes('import * as ImagePicker')) {
  content = content.replace("import { useRouter } from 'expo-router';", "import { useRouter } from 'expo-router';\nimport * as ImagePicker from 'expo-image-picker';");
}

// Add handleCameraPress
const componentMatch = content.match(/export default function LivaChatScreen\(\) \{/);
if (componentMatch && !content.includes('const handleCameraPress = async () =>')) {
  const funcInjection = `\n  const handleCameraPress = async () => {\n    try { await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 }); } catch (e) { console.log(e); }\n  };\n`;
  content = content.replace(componentMatch[0], componentMatch[0] + funcInjection);
}

content = content.replace(
  /<Pressable style=\{styles\.actionButton\} onPress=\{.*?\/camera-logging.*?\}>\s*<Camera.*?\/Pressable>/s,
  `<Pressable style={styles.actionButton} onPress={handleCameraPress}>
                <Camera size={22} color="#8e8e93" />
              </Pressable>`
);

fs.writeFileSync(file, content);
console.log('Fixed Camera inline in liva-chat');
