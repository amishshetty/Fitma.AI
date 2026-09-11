const fs = require('fs');

function addKeyboard(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add inputRef
  const match = content.match(/const \[inputText, setInputText\] = useState\(''\);/);
  if (match && !content.includes('const inputRef = useRef')) {
    content = content.replace(match[0], match[0] + '\n  const inputRef = useRef<any>(null);');
  } else if (!content.includes('const inputRef = useRef')) {
    // In liva-home.tsx it might be `useState("")`
    const match2 = content.match(/const \[inputText, setInputText\] = useState\(""\);/);
    if (match2) {
      content = content.replace(match2[0], match2[0] + '\n  const inputRef = useRef<any>(null);');
    }
  }

  // Bind to TextInput
  content = content.replace(/<TextInput\s*style=\{styles\.textInput\}/g, '<TextInput\n                    ref={inputRef}\n                    style={styles.textInput}');

  // Add onPress to Keyboard pill
  content = content.replace(/<Pressable style=\{styles\.pillButton\}>\s*<View style=\{styles\.pillIconWrapGray\}>\s*<Keyboard size=\{15\} color="#8e8e93" \/>/g, 
  '<Pressable style={styles.pillButton} onPress={() => inputRef.current?.focus()}>\n                    <View style={styles.pillIconWrapGray}>\n                      <Keyboard size={15} color="#8e8e93" />');

  fs.writeFileSync(file, content);
  console.log('Fixed Keyboard in ' + file);
}

addKeyboard('mobile/app/(tabs)/liva-home.tsx');
addKeyboard('mobile/app/liva-chat.tsx');

