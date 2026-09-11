const fs = require('fs');

function patchHandleSend(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Find "const handleSendText = async"
  // And insert the check right after the trim return
  const search = "if (!textToSend.trim()) return;";
  if (content.includes(search)) {
    const patch = `
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    }`;
    // Replace only the FIRST occurrence inside handleSendText (which is usually the only one)
    content = content.replace(search, search + patch);
    fs.writeFileSync(file, content);
    console.log('Patched ' + file);
  } else {
      // In liva-chat.tsx maybe it doesn't take args?
      const search2 = "if (!inputText.trim()) return;";
      if (content.includes(search2)) {
          const patch2 = `
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    }`;
          content = content.replace(search2, search2 + patch2);
          fs.writeFileSync(file, content);
          console.log('Patched ' + file);
      } else {
        console.log('Could not find search in ' + file);
      }
  }
}

patchHandleSend('mobile/app/(tabs)/liva-home.tsx');
patchHandleSend('mobile/app/liva-chat.tsx');

