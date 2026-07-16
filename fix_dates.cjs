const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

// Replace new Date().toISOString().split("T")[0]
code = code.replace(/new Date\(\)\.toISOString\(\)\.split\("T"\)\[0\]/g, "new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]");

// Replace d.toISOString().split("T")[0]
code = code.replace(/d\.toISOString\(\)\.split\("T"\)\[0\]/g, "new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0]");

// Replace new Date(parseInt(mealId)).toISOString().split("T")[0]
code = code.replace(/new Date\(parseInt\(mealId\)\)\.toISOString\(\)\.split\("T"\)\[0\]/g, "new Date(parseInt(mealId) - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]");

// Replace new Date(parseInt(mealToDelete.id)).toISOString().split("T")[0]
code = code.replace(/new Date\(parseInt\(mealToDelete\.id\)\)\.toISOString\(\)\.split\("T"\)\[0\]/g, "new Date(parseInt(mealToDelete.id) - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]");

fs.writeFileSync('src/app/App.tsx', code);
console.log('Replacements done');
