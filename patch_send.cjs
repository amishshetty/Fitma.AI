const fs = require('fs');

function patchHandleSend(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Find handleSendText
  const match = content.match(/const handleSendText = async \(.*?\) => \{\n\s*if \(!.*?.trim\(\)\) return;/);
  if (match) {
    const patch = `
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    }`;
    content = content.replace(match[0], match[0] + patch);
    fs.writeFileSync(file, content);
    console.log('Patched ' + file);
  }
}

patchHandleSend('mobile/app/(tabs)/liva-home.tsx');
patchHandleSend('mobile/app/liva-chat.tsx');

