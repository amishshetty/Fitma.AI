const fs = require('fs');

function addFocusStates(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add state
  const hookSearch = /const \[units, setUnits\] = useState\('Metric \(kg, cm\)'\);/;
  if (content.includes('const [units, setUnits] = useState') && !content.includes('focusedField')) {
    content = content.replace(hookSearch, hookSearch.source + '\n    const [focusedField, setFocusedField] = useState<string | null>(null);');
  }

  // Update styles for inputFocused
  const styleSearch = /readOnlyInput: \{ opacity: 0\.7 \},/;
  if (content.includes('readOnlyInput: { opacity: 0.7 },') && !content.includes('inputFocused')) {
    content = content.replace(styleSearch, styleSearch.source + `
    inputFocused: {
      borderWidth: 2,
      borderColor: isDark ? '#f8fafc' : '#000',
      backgroundColor: isDark ? '#0f172a' : '#fff',
    },`);
  }

  // Now replace all TextInputs to use the array style with focusedField
  const fields = ['name', 'gender', 'height', 'email', 'phone', 'units'];
  
  fields.forEach(f => {
    // We need to carefully replace the style={styles.input} for each field
    // It's currently: <TextInput style={styles.input} value={name} onChangeText={setName} />
    const regex = new RegExp(`<TextInput style=\\{styles\\.input\\} value=\\{${f}\\}`);
    if (content.match(regex)) {
      content = content.replace(
        regex,
        `<TextInput 
                  style={[styles.input, focusedField === '${f}' && styles.inputFocused]}
                  onFocus={() => setFocusedField('${f}')}
                  onBlur={() => setFocusedField(null)}
                  value={${f}}`
      );
    } else {
        // sometimes there's readOnlyInput too
        const regexRO = new RegExp(`<TextInput style=\\{\\[styles\\.input, styles\\.readOnlyInput\\]\\} value=\\{${f}\\}`);
        if (content.match(regexRO)) {
            content = content.replace(
                regexRO,
                `<TextInput 
                  style={[styles.input, styles.readOnlyInput, focusedField === '${f}' && styles.inputFocused]}
                  onFocus={() => setFocusedField('${f}')}
                  onBlur={() => setFocusedField(null)}
                  value={${f}}`
            );
        }
    }
  });

  fs.writeFileSync(file, content);
  console.log('Fixed focus states in ' + file);
}

addFocusStates('mobile/app/profile-personal.tsx');
