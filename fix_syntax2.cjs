const fs = require('fs');

function removeBackslashes(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const \\\[units, setUnits\\\] = useState\\\('Metric \\\(kg, cm\\\)'\\\);/g, "const [units, setUnits] = useState('Metric (kg, cm)');");
  fs.writeFileSync(file, content);
  console.log('Fixed syntax error in ' + file);
}

removeBackslashes('mobile/app/profile-personal.tsx');
