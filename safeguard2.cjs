const fs = require('fs');

function safeguardAll(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    /let responseText = result\?\.response \|\| "I hear you!";\s*if \(typeof responseText !== 'string'\) \{\s*responseText = JSON\.stringify\(responseText\);\s*\}/,
    `let responseText = typeof result?.response === 'string' ? result.response : (result?.response ? JSON.stringify(result.response) : "I hear you!");
        let safeGreeting = typeof result?.greeting === 'string' ? result.greeting : (result?.greeting ? JSON.stringify(result.greeting) : undefined);
        let safeMotivation = typeof result?.motivation === 'string' ? result.motivation : (result?.motivation ? JSON.stringify(result.motivation) : undefined);`
  );
  
  content = content.replace(
    /greeting: result\?\.greeting,\n\s*motivation: result\?\.motivation,/,
    `greeting: safeGreeting,\n            motivation: safeMotivation,`
  );

  fs.writeFileSync(file, content);
  console.log('Safeguarded all in ' + file);
}

safeguardAll('mobile/app/(tabs)/liva-home.tsx');

