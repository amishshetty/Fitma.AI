const fs = require('fs');
function fixHandleSend(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /if \(recognitionRef\.current\) \{/g,
    `if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);\n      if (recognitionRef.current) {`
  );
  fs.writeFileSync(file, content);
  console.log('Fixed handleSend in ' + file);
}
fixHandleSend('mobile/app/(tabs)/liva-home.tsx');
fixHandleSend('mobile/app/liva-chat.tsx');
