const fs = require('fs');
const file = 'mobile/app/(tabs)/my-plan.tsx';
let content = fs.readFileSync(file, 'utf8');

const newSections = `
          {/* Log Weight */}
          <Pressable style={[styles.logCard, { marginTop: 12 }]}>
            <View style={styles.logCardBody}>
              <View style={styles.logDot} />
              <Text style={styles.logCardTitle}>Log Weight</Text>
              <View style={styles.logCardSub}>
                <Target size={12} color="#94a3b8" />
                <Text style={styles.logCardSubText}>75.6 kg</Text>
              </View>
            </View>
            <View style={[styles.logCardImg, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                <Image source={require('../../assets/images/my_plan_weight.jpg')} style={styles.logCardImage} />
            </View>
          </Pressable>

          {/* Log Activities */}
          <Pressable style={[styles.logCard, { marginTop: 12 }]}>
            <View style={styles.logCardBody}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.logCardTitle}>Log Activities</Text>
                <View style={{ backgroundColor: isDark ? '#334155' : '#e2e8f0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#64748b' }}>COMING SOON</Text>
                </View>
              </View>
              <View style={styles.logCardSub}>
                <Activity size={12} color="#94a3b8" />
                <Text style={styles.logCardSubText}>Future Scope</Text>
              </View>
            </View>
            <View style={[styles.logCardImg, { backgroundColor: '#fde9eb', opacity: 0.6 }]}>
                <Image source={require('../../assets/images/my_plan_activities.jpg')} style={[styles.logCardImage, { opacity: 0.5 }]} />
            </View>
          </Pressable>
`;

if (!content.includes('Log Weight')) {
  content = content.replace(/<\/ScrollView>/, newSections + '\n        </ScrollView>');
}

fs.writeFileSync(file, content);
console.log('Added missing cards properly');
