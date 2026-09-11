const fs = require('fs');

function fixHandleSend(file, argName) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Revert the previous patch
  content = content.replace(`
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    }`, '');
    
  // Inject before the trim check
  const search = `const handleSendText = async (${argName}) => {`;
  const patch = `
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    }`;
  content = content.replace(search, search + patch);
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
}

fixHandleSend('mobile/app/(tabs)/liva-home.tsx', 'textToSend: string');
fixHandleSend('mobile/app/liva-chat.tsx', ''); // It's just `const handleSendText = async () => {`

