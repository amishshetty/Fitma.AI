const fs = require('fs');

function buildMobileDropdown(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add the dropdown state
  const stateSearch = /const \[focusedField, setFocusedField\] = useState<string \| null>\(null\);/;
  if (content.match(stateSearch) && !content.includes('isGenderDropdownOpen')) {
    content = content.replace(stateSearch, `const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);`);
  }

  // Replace the gender TextInput with our custom dropdown
  const genderRegex = /<TextInput[\s\S]*?value=\{gender\}[\s\S]*?\/>/;
  
  if (content.match(genderRegex)) {
    const dropdownJSX = `
                <View style={{position: 'relative', zIndex: isGenderDropdownOpen ? 100 : 1}}>
                  <Pressable
                    style={[
                      styles.input,
                      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                      isGenderDropdownOpen && styles.inputFocused
                    ]}
                    onPress={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                  >
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: gender ? (isDark ? '#f8fafc' : '#000') : '#64748b' }}>
                      {gender || 'Select gender'}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#64748b', transform: [{ rotate: isGenderDropdownOpen ? '180deg' : '0deg' }] }}>▼</Text>
                  </Pressable>
                  
                  {isGenderDropdownOpen && (
                    <View style={styles.dropdownMenu}>
                      {['Male', 'Female', 'Other', 'Prefer not to say'].map((opt) => (
                        <Pressable 
                          key={opt}
                          style={[styles.dropdownItem, gender === opt && styles.dropdownItemSelected]}
                          onPress={() => {
                            setGender(opt);
                            setIsGenderDropdownOpen(false);
                          }}
                        >
                          <Text style={[styles.dropdownItemText, gender === opt && styles.dropdownItemTextSelected]}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>`;
                
    content = content.replace(genderRegex, dropdownJSX);
  }

  // Add dropdown styles
  const styleSearch = /inputFocused: \{/;
  if (content.match(styleSearch) && !content.includes('dropdownMenu: {')) {
    content = content.replace(styleSearch, `
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: 8,
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      paddingVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      zIndex: 999,
    },
    dropdownItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    dropdownItemSelected: {
      backgroundColor: isDark ? 'rgba(52, 199, 89, 0.1)' : '#f2faf5',
    },
    dropdownItemText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: isDark ? '#f8fafc' : '#000',
    },
    dropdownItemTextSelected: {
      color: '#34c759',
    },
    inputFocused: {`);
  }

  fs.writeFileSync(file, content);
  console.log('Added Mobile Dropdown to ' + file);
}

buildMobileDropdown('mobile/app/profile-personal.tsx');
