const fs = require('fs');

function removeBackslashes(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const \\\[isTyping, setIsTyping\\\] = useState\\\(false\\\);/g, 'const [isTyping, setIsTyping] = useState(false);');
  fs.writeFileSync(file, content);
  console.log('Fixed syntax error in ' + file);
}

removeBackslashes('mobile/app/(tabs)/liva-home.tsx');
removeBackslashes('mobile/app/liva-chat.tsx');
