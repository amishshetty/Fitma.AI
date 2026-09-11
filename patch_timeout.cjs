const fs = require('fs');

function patchClearTimeout(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Find handleSendText
  const match = content.match(/const handleSendText = async \(.*?\) => \{\n\s*if \(isListening\) \{\n\s*if \(silenceTimeoutRef\.current\) clearTimeout\(silenceTimeoutRef\.current\);/);
  
  if (match) {
    const patch = `const handleSendText = async (textToSend: string) => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (isListening) {
      if (recognitionRef.current) {`;
      
    content = content.replace(/const handleSendText = async \(.*?\) => \{\n\s*if \(isListening\) \{\n\s*if \(silenceTimeoutRef\.current\) clearTimeout\(silenceTimeoutRef\.current\);\n\s*if \(recognitionRef\.current\) \{/, patch);
    
    fs.writeFileSync(file, content);
    console.log('Patched ' + file);
  } else {
    // maybe parameter name differs
    const match2 = content.match(/const handleSendText = async \(.*?\) => \{\n\s*if \(silenceTimeoutRef\.current\)/);
    if (match2) {
      console.log('Already patched ' + file);
    } else {
      console.log('Regex failed in ' + file);
    }
  }
}

patchClearTimeout('mobile/app/(tabs)/liva-home.tsx');
patchClearTimeout('mobile/app/liva-chat.tsx');

