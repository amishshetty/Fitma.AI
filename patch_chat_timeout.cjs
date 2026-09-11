const fs = require('fs');
let file = 'mobile/app/liva-chat.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const handleSendText = async \(\) => \{\n\s*if \(isListening\) \{\n\s*if \(silenceTimeoutRef\.current\) clearTimeout\(silenceTimeoutRef\.current\);\n\s*if \(recognitionRef\.current\) \{/;

const patch = `const handleSendText = async () => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (isListening) {
      if (recognitionRef.current) {`;

content = content.replace(regex, patch);
fs.writeFileSync(file, content);
console.log('Patched chat');
