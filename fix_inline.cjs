const fs = require('fs');
const file = 'mobile/app/(tabs)/liva-home.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add ImagePicker and MicOff import
if (!content.includes('import * as ImagePicker')) {
  content = content.replace("import { useRouter } from 'expo-router';", "import { useRouter } from 'expo-router';\nimport * as ImagePicker from 'expo-image-picker';");
}
content = content.replace(/import \{.*?Camera.*?\} from 'lucide-react-native';/, (match) => {
  if (!match.includes('MicOff')) {
    return match.replace('Camera, ', 'Camera, MicOff, ');
  }
  return match;
});

// Add state for isListening
const componentMatch = content.match(/export default function LivaHomeScreen\(\) \{/);
if (componentMatch && !content.includes('const [isListening, setIsListening]')) {
  const stateInjection = `\n  const [isListening, setIsListening] = useState(false);\n  const toggleVoiceInput = () => {\n    setIsListening(!isListening);\n    if (!isListening) { setTimeout(() => setIsListening(false), 3000); }\n  };\n  const handleCameraPress = async () => {\n    try { await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 }); } catch (e) { console.log(e); }\n  };\n`;
  content = content.replace(componentMatch[0], componentMatch[0] + stateInjection);
}

// Replace Mic and Camera buttons
// They might currently be: <Pressable style={styles.actionButton} onPress={() => router.push("/voice-logging")}>
content = content.replace(
  /<Pressable style=\{styles\.actionButton\} onPress=\{.*?\/voice-logging.*?\}>\s*<Mic.*?\/Pressable>/s,
  `<Pressable style={styles.actionButton} onPress={toggleVoiceInput}>
                  {isListening ? <MicOff size={22} color="#ff3b30" /> : <Mic size={22} color="#8e8e93" />}
                </Pressable>`
);

content = content.replace(
  /<Pressable style=\{styles\.actionButton\} onPress=\{.*?\/camera-logging.*?\}>\s*<Camera.*?\/Pressable>/s,
  `<Pressable style={styles.actionButton} onPress={handleCameraPress}>
                  <Camera size={22} color="#8e8e93" />
                </Pressable>`
);

fs.writeFileSync(file, content);
console.log('Fixed Mic and Camera inline in liva-home');
