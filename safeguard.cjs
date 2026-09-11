const fs = require('fs');

function safeguardText(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Find setMessages in handleSendText
  // Replace responseText assignment to stringify if needed
  content = content.replace(
    /let responseText = result\?\.response \|\| "I hear you!";/,
    `let responseText = result?.response || "I hear you!";
        if (typeof responseText !== 'string') {
          responseText = JSON.stringify(responseText);
        }`
  );
  
  // Add greeting and motivation to the message
  content = content.replace(
    /text: responseText,\s*timestamp: new Date/g,
    `text: responseText,\n            greeting: result?.greeting,\n            motivation: result?.motivation,\n            timestamp: new Date`
  );

  fs.writeFileSync(file, content);
  console.log('Safeguarded ' + file);
}

safeguardText('mobile/app/(tabs)/liva-home.tsx');

