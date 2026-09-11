const fs = require('fs');

function addDebounceGuardChat(file) {
  let content = fs.readFileSync(file, 'utf8');

  // In liva-chat.tsx
  const search = "if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);";
  if (content.includes(search)) {
    content = content.replace(search, "if (isTyping) return;\n    " + search);
    fs.writeFileSync(file, content);
    console.log('Fixed debounce in ' + file);
  }
}

addDebounceGuardChat('mobile/app/liva-chat.tsx');

