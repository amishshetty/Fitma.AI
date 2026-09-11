const fs = require('fs');
const file = 'mobile/app/(tabs)/my-plan.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix Log Weight background
content = content.replace(/backgroundColor: '#fee2e2'/g, "backgroundColor: isDark ? '#1e293b' : '#f1f5f9'");

// Fix Log Activities title and Coming Soon
content = content.replace(/<Text style=\{styles\.logCardTitle\}>Log Activities<\/Text>\s*<View style=\{styles\.logCardSub\}>\s*<Sparkles size=\{12\} color="#94a3b8" \/>\s*<Text style=\{styles\.logCardSubText\}>Future Scope<\/Text>\s*<\/View>\s*<View style=\{\{ position: 'absolute', right: -20, top: 40, backgroundColor: 'rgba\\(52, 199, 89, 0\.15\\)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, zIndex: 10 \}\}>\s*<Text style=\{\{ fontSize: 10, fontWeight: 'bold', color: '#10b981', textAlign: 'center' \}\}>COMING\\nSOON<\/Text>\s*<\/View>/m,
`<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.logCardTitle}>Log Activities</Text>
                  <View style={{ backgroundColor: isDark ? '#334155' : '#e2e8f0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#64748b' }}>COMING SOON</Text>
                  </View>
                </View>
                <View style={styles.logCardSub}>
                  <Activity size={12} color="#94a3b8" />
                  <Text style={styles.logCardSubText}>Future Scope</Text>
                </View>`);

// Fix Log Activities background
content = content.replace(/backgroundColor: '#fce7f3'/g, "backgroundColor: '#fde9eb', opacity: 0.6");
content = content.replace(/<Image source=\{require\('\.\.\/\.\.\/assets\/images\/my_plan_activities\.jpg'\)\} style=\{styles\.logCardImage\} \/>/g, 
  "<Image source={require('../../assets/images/my_plan_activities.jpg')} style={[styles.logCardImage, { opacity: 0.5 }]} />");

fs.writeFileSync(file, content);
console.log('Fixed Web parity');
