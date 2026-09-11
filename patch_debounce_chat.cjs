const fs = require('fs');

function addDebounceGuardChat(file) {
  let content = fs.readFileSync(file, 'utf8');

  // In liva-chat.tsx
  const match = content.match(/const handleSendText = async \(\) => \{\n\s*if \(silenceTimeoutRef\.current\) clearTimeout\(silenceTimeoutRef\.current\);/);
  
  if (match) {
    const patch = `const handleSendText = async () => {
    if (isTyping) return;
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);`;
    content = content.replace(match[0], patch);
    fs.writeFileSync(file, content);
    console.log('Fixed debounce in ' + file);
  }
}

addDebounceGuardChat('mobile/app/liva-chat.tsx');

