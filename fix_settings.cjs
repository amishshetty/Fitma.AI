const fs = require('fs');
const file = 'mobile/app/profile-settings.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace {theme} with displayTheme inside the APPEARANCE section, and put the dropdown back
content = content.replace(/<Text style=\{styles\.itemSubtitle\}>\{theme\}<\/Text>/, `
              <CustomDropdown
                value={displayTheme}
                options={['Light', 'Dark', 'System']}
                onChange={handleThemeChange}
              />
`);

// Check if CustomDropdown exists, if not, inject it before the return statement
if (!content.includes('const CustomDropdown')) {
  const componentMatch = content.match(/return \(/);
  if (componentMatch) {
    const customDropdownCode = `
  const CustomDropdown = ({ value, options, onChange }: { value: string; options: string[]; onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <View style={{ zIndex: 10 }}>
        <Pressable
          style={styles.dropdownBtn}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={styles.dropdownBtnText}>{value}</Text>
          <Text style={[styles.dropdownIcon, isOpen && { transform: [{ rotate: '180deg' }] }]}>▼</Text>
        </Pressable>
        {isOpen && (
          <View style={styles.dropdownMenu}>
            {options.map((opt) => (
              <Pressable
                key={opt}
                style={styles.dropdownItem}
                onPress={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{opt}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  };
\n  `;
    content = content.replace(componentMatch[0], customDropdownCode + componentMatch[0]);
  }
}

// Ensure dropdown styles are added to getStyles if they are missing
if (!content.includes('dropdownBtn:')) {
  content = content.replace(/cardTitle: \{/g, `dropdownBtn: { backgroundColor: isDark ? '#334155' : '#f8fafc', padding: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  dropdownBtnText: { fontSize: 12, fontWeight: 'bold', color: isDark ? '#f8fafc' : '#0f172a' },
  dropdownIcon: { fontSize: 10, color: isDark ? '#94a3b8' : '#64748b' },
  dropdownMenu: { backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: 12, borderWidth: 1, borderColor: isDark ? '#334155' : '#f1f5f9', marginTop: 4, overflow: 'hidden' },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : '#f1f5f9' },
  dropdownItemText: { fontSize: 12, color: isDark ? '#f8fafc' : '#000' },
  cardTitle: {`);
}

fs.writeFileSync(file, content);
console.log('Fixed profile-settings.tsx');
