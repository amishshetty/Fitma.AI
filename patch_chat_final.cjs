const fs = require('fs');
let file = 'mobile/app/liva-chat.tsx';
let content = fs.readFileSync(file, 'utf8');

const search = "const handleSendText = (textToSend: string) => {";
const patch = `const handleSendText = (textToSend: string) => {
    if (isTyping) return;
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    }`;

content = content.replace(search, patch);
fs.writeFileSync(file, content);
console.log('Fully patched chat handleSendText');
