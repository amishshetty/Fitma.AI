import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Text as RNText } from 'react-native';
import { Target, Activity, Flame, Droplet, Leaf, Wheat, Sparkles, Search, Ruler, Scale, Info, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import LivaAvatar from '../components/layout/LivaAvatar';
import PrimaryButton from '../components/ui/PrimaryButton';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

const ScreenShell = ({ title, subtitle, onBack, children, footer }: any) => (
  <View style={shellStyles.container}>
    <View style={shellStyles.header}>
      <Pressable onPress={onBack} style={shellStyles.backButton}>
        <ArrowLeft size={24} color="#000" />
      </Pressable>
      <View>
        <Text style={shellStyles.title}>{title}</Text>
        <Text style={shellStyles.subtitle}>{subtitle}</Text>
      </View>
    </View>
    <ScrollView style={shellStyles.scroll} contentContainerStyle={shellStyles.scrollContent}>
      {children}
    </ScrollView>
    {footer && <View style={shellStyles.footer}>{footer}</View>}
  </View>
);

const shellStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  header: { paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#000' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 48 },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#f1f5f9', backgroundColor: '#fff' }
});

const ModernSlider = ({ value, min, max, onChange, color, label, icon: Icon, unit }: any) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <View style={sliderStyles.sliderCard}>
      <View style={sliderStyles.sliderHeader}>
        <View style={sliderStyles.sliderLabelRow}>
          <View style={[sliderStyles.sliderIconBox, { backgroundColor: `${color}15` }]}>
            <Icon size={16} color={color} />
          </View>
          <Text style={sliderStyles.sliderLabel}>{label}</Text>
        </View>
        <View style={[sliderStyles.sliderInputBox, { borderColor: '#e2e8f0' }]}>
          <TextInput
            style={[sliderStyles.sliderInput, { color }]}
            value={value.toString()}
            keyboardType="numeric"
            onChangeText={(val) => {
              const num = Number(val);
              if (!isNaN(num)) onChange(num);
            }}
          />
          <Text style={sliderStyles.sliderUnit}>{unit}</Text>
        </View>
      </View>
      <View style={sliderStyles.sliderTrack}>
        <View style={[sliderStyles.sliderFill, { width: `${percentage}%`, backgroundColor: color }]} />
        <View style={[sliderStyles.sliderThumb, { left: `${percentage}%`, borderColor: color }]} />
      </View>
    </View>
  );
};

const sliderStyles = StyleSheet.create({
  sliderCard: { padding: 16, backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 16 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sliderLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sliderIconBox: { padding: 6, borderRadius: 8 },
  sliderLabel: { fontSize: 14, fontWeight: '700', color: '#000' },
  sliderInputBox: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  sliderInput: { fontSize: 18, fontWeight: '900', padding: 0, margin: 0, minWidth: 40, textAlign: 'right' },
  sliderUnit: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  sliderTrack: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, position: 'relative', justifyContent: 'center' },
  sliderFill: { position: 'absolute', left: 0, height: '100%', borderRadius: 4 },
  sliderThumb: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', borderWidth: 2, marginLeft: -10 }
});

const TargetCard = ({ icon: Icon, color, label, value, unit }: any) => (
  <View style={targetStyles.card}>
    <View style={targetStyles.left}>
      <View style={[targetStyles.iconBox, { backgroundColor: `${color}15` }]}>
        <Icon size={18} color={color} />
      </View>
      <Text style={targetStyles.label}>{label}</Text>
    </View>
    <View style={targetStyles.right}>
      <Text style={[targetStyles.value, { color }]}>{value}</Text>
      <Text style={targetStyles.unit}> {unit}</Text>
    </View>
  </View>
);

const targetStyles = StyleSheet.create({
  card: { backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { padding: 8, borderRadius: 12 },
  label: { fontSize: 14, fontWeight: '700', color: '#000' },
  right: { flexDirection: 'row', alignItems: 'baseline' },
  value: { fontSize: 18, fontWeight: '900' },
  unit: { fontSize: 12, fontWeight: '600', color: '#64748b' },
});

export default function ProfileGoalsScreen() {
  const router = useRouter();
  
  // Mock data
  const [goals, setGoals] = useState({ weight: 70, height: 175, calories: 2000, protein: 150, water: 2500 });
  const [primaryGoal, setPrimaryGoal] = useState('Lose Weight');
  const [success, setSuccess] = useState(false);

  const applyRecommendation = () => {
    setGoals({ ...goals, protein: goals.protein + 10 });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };
  
  const primaryGoalsList = [
    { label: 'Lose Weight', icon: Flame, color: '#fb923c' },
    { label: 'Gain Muscle', icon: Target, color: '#6366f1' },
    { label: 'Eat Healthier', icon: Leaf, color: '#34c759' },
    { label: 'Maintain Weight', icon: Wheat, color: '#06b6d4' },
    { label: 'Improve Energy', icon: Sparkles, color: '#f59e0b' },
    { label: 'Just Exploring', icon: Search, color: '#94a3b8' },
  ];

  const height = goals.height || 170;
  const weight = goals.weight;
  const heightInM = height / 100;
  const bmi = parseFloat((weight / (heightInM * heightInM)).toFixed(1));
  let bmiCategory = 'Normal';
  let bmiColor = '#34c759';
  let bmiMessage = "Great job! You're in a healthy range.";

  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = '#f59e0b';
    bmiMessage = 'You may need more calories to build strength.';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = '#f59e0b';
    bmiMessage = primaryGoal === 'Maintain Weight' ? 'Liva Tip: A slight deficit could help you get to a Normal range over time!' : 'A perfect time to build healthy habits.';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = '#ef4444';
    bmiMessage = 'Focus on small, sustainable changes every day.';
  }

  return (
    <View style={styles.root}>
      <ScreenShell title="Goals Manager" subtitle="Modify daily nutrition budgets and workout limits." onBack={() => router.back()}>
        {success && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>✓ Success: Liva protein recommendation applied (+10g).</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Journey</Text>
          <View style={styles.grid2}>
            {primaryGoalsList.map((g) => {
              const Icon = g.icon;
              const active = primaryGoal === g.label;
              return (
                <Pressable
                  key={g.label}
                  onPress={() => setPrimaryGoal(g.label)}
                  style={[
                    styles.goalCard,
                    active ? { borderColor: g.color, shadowColor: g.color, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 } : {}
                  ]}
                >
                  <View style={[styles.goalIconBox, { backgroundColor: `${g.color}15` }]}>
                    <Icon size={20} color={g.color} />
                  </View>
                  <Text style={[styles.goalLabel, active && { color: g.color }]}>{g.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Body Metrics (BMI Calculator)</Text>
        
        <ModernSlider label="Height" icon={Ruler} color="#3b82f6" unit="cm" min={140} max={220} value={height} onChange={(v: number) => setGoals({...goals, height: v})} />
        <ModernSlider label="Weight" icon={Scale} color="#a855f7" unit="kg" min={40} max={150} value={weight} onChange={(v: number) => setGoals({...goals, weight: v})} />

        {/* BMI Card */}
        <View style={styles.bmiCard}>
          <View style={styles.bmiHeader}>
            <View style={styles.bmiTitleRow}>
              <View style={styles.bmiInfoIcon}>
                <Info size={16} color="#64748b" />
              </View>
              <Text style={styles.bmiTitle}>Your BMI</Text>
            </View>
            <View style={styles.bmiRight}>
              <Text style={[styles.bmiValue, { color: bmiColor }]}>{bmi}</Text>
              <Text style={styles.bmiCategory}>{bmiCategory}</Text>
            </View>
          </View>

          <View style={styles.bmiBar}>
            <View style={[styles.bmiSegment, { width: '20%', backgroundColor: '#3b82f6' }]} />
            <View style={[styles.bmiSegment, { width: '40%', backgroundColor: '#34c759' }]} />
            <View style={[styles.bmiSegment, { width: '20%', backgroundColor: '#f59e0b' }]} />
            <View style={[styles.bmiSegment, { width: '20%', backgroundColor: '#ef4444' }]} />
            <View 
              style={[
                styles.bmiIndicator, 
                { borderColor: bmiColor, left: `${Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 96)}%` }
              ]} 
            />
          </View>
          <Text style={[styles.bmiMessage, primaryGoal === 'Maintain Weight' && bmi >= 25 ? { color: '#f59e0b' } : {}]}>{bmiMessage}</Text>
        </View>

        <Text style={styles.sectionTitle}>Daily Targets (Calculated)</Text>
        <View style={styles.targetsList}>
          <TargetCard icon={Flame} color="#f97316" label="Calorie Budget" value={goals.calories} unit="kcal" />
          <TargetCard icon={Activity} color="#0ea5e9" label="Protein Intake" value={goals.protein} unit="g" />
          <TargetCard icon={Droplet} color="#14b8a6" label="Water Target" value={goals.water} unit="ml" />
        </View>

        {/* Liva Coach Recommendation */}
        <View style={styles.livaCard}>
          <View style={styles.livaHeader}>
            <LivaAvatar size={42} floating />
            <View style={styles.livaTextContainer}>
              <Text style={styles.livaSubtitle}>LIVA GOAL AUDIT</Text>
              <Text style={styles.livaMessage}>
                Based on your daily activity levels and moderate workouts, I recommend increasing protein to <Text style={styles.livaHighlight}>{goals.protein + 10}g</Text> to recover muscle fibers faster.
              </Text>
            </View>
          </View>
          <Pressable onPress={applyRecommendation} style={styles.livaButton}>
            <Text style={styles.livaButtonText}>Apply Goal Recommendation</Text>
          </Pressable>
        </View>
      </ScreenShell>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: '#ffffff' },
  successBox: { backgroundColor: '#f2faf5', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(52, 199, 89, 0.2)', marginBottom: 16 },
  successText: { fontSize: 12, fontWeight: '700', color: '#197a38' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#000', marginBottom: 12, marginTop: 8, marginLeft: 4 },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  goalCard: { width: '47%', minHeight: 100, borderRadius: 16, backgroundColor: '#fff', padding: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#f1f5f9', gap: 8 },
  goalIconBox: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  goalLabel: { fontSize: 11, fontWeight: '700', color: '#000', textAlign: 'center' },
  
  bmiCard: { backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', padding: 20, marginTop: 8, marginBottom: 24 },
  bmiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  bmiTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bmiInfoIcon: { padding: 6, backgroundColor: '#e2e8f0', borderRadius: 8 },
  bmiTitle: { fontSize: 14, fontWeight: '700', color: '#000' },
  bmiRight: { alignItems: 'flex-end' },
  bmiValue: { fontSize: 24, fontWeight: '900' },
  bmiCategory: { fontSize: 10, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  bmiBar: { height: 10, backgroundColor: '#e2e8f0', borderRadius: 5, flexDirection: 'row', overflow: 'hidden', marginBottom: 12, position: 'relative' },
  bmiSegment: { height: '100%' },
  bmiIndicator: { position: 'absolute', top: -2, width: 12, height: 14, borderRadius: 6, backgroundColor: '#fff', borderWidth: 2, marginTop: 0 },
  bmiMessage: { fontSize: 12, fontWeight: '600', color: '#64748b', lineHeight: 18 },

  targetsList: { gap: 12 },
  
  livaCard: { borderRadius: 24, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', padding: 20, marginTop: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  livaHeader: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  livaTextContainer: { flex: 1 },
  livaSubtitle: { fontSize: 11, fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: 1 },
  livaMessage: { fontSize: 13, fontWeight: '500', color: '#000', marginTop: 6, lineHeight: 20 },
  livaHighlight: { fontWeight: '700', color: '#047857' },
  livaButton: { width: '100%', backgroundColor: '#fff', paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#d1fae5', alignItems: 'center', marginTop: 16 },
  livaButtonText: { fontSize: 13, fontWeight: '700', color: '#047857' },
});
