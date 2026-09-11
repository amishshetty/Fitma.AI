const fs = require('fs');

function addRobustLock(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add the ref
  const hookSearch = /const \[isTyping, setIsTyping\] = useState\(false\);/;
  if (content.includes('const [isTyping, setIsTyping] = useState(false);') && !content.includes('isProcessingRef')) {
    content = content.replace(hookSearch, hookSearch.source + '\n  const isProcessingRef = useRef(false);');
  }

  // Update handleSendText to use it
  if (content.includes('if (isTyping) return;')) {
    content = content.replace('if (isTyping) return;', 'if (isProcessingRef.current) return;\n    isProcessingRef.current = true;');
  }

  // Free the lock when done
  // In liva-home.tsx:
  // setMessages((prev) => [ ... ]);
  // } catch (e) {
  //   setMessages((prev) => [ ... ]);
  // }
  // }
  content = content.replace(/\}\s*catch\s*\(e\)\s*\{/g, '} catch (e) {');
  // It's easier to just find the end of handleSendText or right after setMessages.
  // Actually, we can just do:
  content = content.replace(/setIsTyping\(false\);/g, 'setIsTyping(false);\n      isProcessingRef.current = false;');

  fs.writeFileSync(file, content);
  console.log('Added robust lock to ' + file);
}

addRobustLock('mobile/app/(tabs)/liva-home.tsx');
addRobustLock('mobile/app/liva-chat.tsx');

