const fs = require('fs');
const file = 'mobile/app/(tabs)/my-plan.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Daily Goals Header to match web
content = content.replace(/<Text style=\{styles\.sectionCount\}>\s*\{\(displayCalories > 0 \? 1 : 0\) \+ \(displayWater > 0 \? 1 : 0\)\} \/ 5\s*<\/Text>/, 
`<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.sectionCount}>0 / 5</Text>
                <Check size={14} color="#94a3b8" style={{ marginLeft: 4 }} />
              </View>`);

// 2. Add Log Weight and Log Activities
const logWaterSection = `            {/* Log Water */}
            <Pressable style={[styles.logCard, { marginTop: 12 }]}>
              <View style={styles.logCardBody}>
                <View style={styles.logDot} />
                <Text style={styles.logCardTitle}>Log Water</Text>
                <View style={styles.logCardSub}>
                  <Droplets size={12} color="#94a3b8" />
                  <Text style={styles.logCardSubText}>{displayWater} / {dailyGoalWater}ml</Text>
                </View>
              </View>
              <View style={[styles.logCardImg, { backgroundColor: '#dcf2fe' }]}>
                  <Image source={require('../../assets/images/my_plan_water.jpg')} style={styles.logCardImage} />
                </View>
            </Pressable>`;

const newSections = `            {/* Log Weight */}
            <Pressable style={[styles.logCard, { marginTop: 12 }]}>
              <View style={styles.logCardBody}>
                <View style={styles.logDot} />
                <Text style={styles.logCardTitle}>Log Weight</Text>
                <View style={styles.logCardSub}>
                  <Target size={12} color="#94a3b8" />
                  <Text style={styles.logCardSubText}>75.6 kg</Text>
                </View>
              </View>
              <View style={[styles.logCardImg, { backgroundColor: '#fee2e2' }]}>
                  <Image source={require('../../assets/images/my_plan_weight.jpg')} style={styles.logCardImage} />
              </View>
            </Pressable>

            {/* Log Activities */}
            <Pressable style={[styles.logCard, { marginTop: 12 }]}>
              <View style={styles.logCardBody}>
                <View style={styles.logDot} />
                <Text style={styles.logCardTitle}>Log Activities</Text>
                <View style={styles.logCardSub}>
                  <Sparkles size={12} color="#94a3b8" />
                  <Text style={styles.logCardSubText}>Future Scope</Text>
                </View>
                <View style={{ position: 'absolute', right: -20, top: 40, backgroundColor: 'rgba(52, 199, 89, 0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, zIndex: 10 }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#10b981' }}>COMING SOON</Text>
                </View>
              </View>
              <View style={[styles.logCardImg, { backgroundColor: '#fce7f3' }]}>
                  <Image source={require('../../assets/images/my_plan_activities.jpg')} style={styles.logCardImage} />
              </View>
            </Pressable>`;

content = content.replace(logWaterSection, logWaterSection + '\n\n' + newSections);

// Make sure Target and Sparkles are imported in my-plan.tsx
if (!content.includes('Target')) {
  content = content.replace("import { \n  ChevronLeft, ChevronDown, ChevronRight, \n  Sunrise, Sun, Moon, Coffee, Check, Flame, \n  Droplets, Activity\n} from 'lucide-react-native';", 
  "import { \n  ChevronLeft, ChevronDown, ChevronRight, \n  Sunrise, Sun, Moon, Coffee, Check, Flame, \n  Droplets, Activity, Target, Sparkles\n} from 'lucide-react-native';");
}

fs.writeFileSync(file, content);
console.log('Added missing cards');
