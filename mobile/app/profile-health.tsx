import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Text as RNText } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
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

export default function ProfileHealthScreen() {
  const router = useRouter();
  
  const [activity, setActivity] = useState('moderate');
  const [preferences, setPreferences] = useState({ veg: false, egg: false, nonveg: true, vegan: false, jain: false });
  const [allergies, setAllergies] = useState({ peanuts: false, gluten: false, dairy: false, shellfish: false, custom: [] as string[] });
  const [customAllergyInput, setCustomAllergyInput] = useState('');
  const [bloodReportUploaded, setBloodReportUploaded] = useState(false);
  const [success, setSuccess] = useState(false);

  const togglePref = (key: string) => {
    setPreferences({ ...preferences, [key]: !(preferences as any)[key] });
  };

  const toggleAllergy = (key: string) => {
    setAllergies({ ...allergies, [key]: !(allergies as any)[key] });
  };

  const handleAddCustomAllergy = () => {
    if (!customAllergyInput.trim()) return;
    setAllergies({
      ...allergies,
      custom: [...allergies.custom, customAllergyInput.trim()]
    });
    setCustomAllergyInput('');
  };

  const handleRemoveCustomAllergy = (allergyToRemove: string) => {
    setAllergies({
      ...allergies,
      custom: allergies.custom.filter(a => a !== allergyToRemove)
    });
  };

  const handleUpload = () => {
    setBloodReportUploaded(true);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };

  const handleSave = () => {
    router.back();
  };

  return (
    <View style={styles.root}>
      <ScreenShell title="Health Profile" subtitle="Medical markers and activity details used by Liva." onBack={() => router.back()}>
        <View style={styles.content}>
          {success && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>✓ Success: Blood report uploaded and synchronized.</Text>
            </View>
          )}

          {/* Activity Level pills */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>LIFESTYLE ACTIVITY</Text>
            <View style={styles.grid2}>
              {[
                { key: 'sedentary', label: 'Sedentary', desc: 'Desk job, low movement' },
                { key: 'light', label: 'Lightly Active', desc: 'Occasional walking' },
                { key: 'moderate', label: 'Moderately Active', desc: 'Daily workouts' },
                { key: 'athlete', label: 'Athlete Mode', desc: 'Extreme sports focus' },
              ].map((item) => {
                const active = activity === item.key;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setActivity(item.key)}
                    style={[
                      styles.activityCard,
                      active ? styles.activityCardActive : {}
                    ]}
                  >
                    <Text style={[styles.activityLabel, active ? styles.activityLabelActive : {}]}>{item.label}</Text>
                    <Text style={[styles.activityDesc, active ? styles.activityDescActive : {}]}>{item.desc}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Food Preferences tags */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>DIETARY PREFERENCES</Text>
            <View style={styles.tagsContainer}>
              {[
                { key: 'veg', label: 'Vegetarian' },
                { key: 'egg', label: 'Eggetarian' },
                { key: 'nonveg', label: 'Non-Vegetarian' },
                { key: 'vegan', label: 'Vegan' },
                { key: 'jain', label: 'Jain Food' },
              ].map((diet) => {
                const active = (preferences as any)[diet.key];
                return (
                  <Pressable
                    key={diet.key}
                    onPress={() => togglePref(diet.key)}
                    style={[styles.tag, active ? styles.tagActive : {}]}
                  >
                    <Text style={[styles.tagText, active ? styles.tagTextActive : {}]}>{diet.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Food Allergies */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ALLERGIES</Text>
            <View style={styles.tagsContainer}>
              {[
                { key: 'peanuts', label: '🥜 Peanuts' },
                { key: 'gluten', label: '🌾 Gluten' },
                { key: 'dairy', label: '🥛 Dairy Lactose' },
                { key: 'shellfish', label: '🦐 Shellfish' },
              ].map((allergy) => {
                const active = (allergies as any)[allergy.key];
                return (
                  <Pressable
                    key={allergy.key}
                    onPress={() => toggleAllergy(allergy.key)}
                    style={[styles.tag, active ? styles.allergyActive : {}]}
                  >
                    <Text style={[styles.tagText, active ? styles.tagTextActive : {}]}>{allergy.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Custom Allergies Input */}
            <View style={styles.customAllergyContainer}>
              <Text style={styles.customAllergyLabel}>OTHER ALLERGIES</Text>
              <View style={styles.customAllergyRow}>
                <TextInput
                  style={styles.customAllergyInput}
                  value={customAllergyInput}
                  onChangeText={setCustomAllergyInput}
                  placeholder="e.g. Soy, Tree Nuts..."
                  onSubmitEditing={handleAddCustomAllergy}
                />
                <Pressable
                  onPress={handleAddCustomAllergy}
                  disabled={!customAllergyInput.trim()}
                  style={[styles.addButton, !customAllergyInput.trim() && styles.addButtonDisabled]}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
              </View>
              {allergies.custom.length > 0 && (
                <View style={[styles.tagsContainer, { marginTop: 12 }]}>
                  {allergies.custom.map((item, idx) => (
                    <View key={idx} style={styles.customAllergyTag}>
                      <Text style={styles.customAllergyTagText}>{item}</Text>
                      <Pressable onPress={() => handleRemoveCustomAllergy(item)}>
                        <Text style={styles.customAllergyTagClose}>×</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Blood report upload */}
          <View style={[styles.card, { opacity: 0.4 }]}>
            <Text style={styles.cardTitle}>REPORT SYNCHRONIZER (COMING SOON)</Text>
            <View style={styles.uploadArea}>
              <Text style={{ fontSize: 30, marginBottom: 12 }}>📄</Text>
              {bloodReportUploaded ? (
                <Text style={styles.uploadSuccessText}>Report_July_2026.pdf synced</Text>
              ) : (
                <>
                  <Text style={styles.uploadTitle}>Upload Blood Report</Text>
                  <Text style={styles.uploadSubtitle}>Let Liva adjust micronutrient goals automatically</Text>
                  <Pressable onPress={handleUpload} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Upload File</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>

          <View style={{ paddingTop: 8 }}>
            <PrimaryButton onPress={handleSave}>Save preferences</PrimaryButton>
          </View>
        </View>
      </ScreenShell>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: '#ffffff' },
  content: { gap: 20 },
  successBox: { backgroundColor: '#f2faf5', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(52, 199, 89, 0.2)' },
  successText: { fontSize: 12, fontWeight: '700', color: '#197a38' },
  
  card: { borderRadius: 24, backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#10201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 18, elevation: 2 },
  cardTitle: { fontSize: 12, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 },
  
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  activityCard: { width: '48%', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#f1f5f9', backgroundColor: '#fff' },
  activityCardActive: { backgroundColor: '#f2faf5', borderColor: '#34C759' },
  activityLabel: { fontSize: 12, fontWeight: '700', color: '#000' },
  activityLabelActive: { color: '#34C759' },
  activityDesc: { fontSize: 9, fontWeight: '500', color: '#64748b', marginTop: 2 },
  activityDescActive: { color: '#34C759' },

  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#e2eae6', backgroundColor: '#f8fdfb' },
  tagActive: { backgroundColor: '#34C759', borderColor: '#34C759' },
  allergyActive: { backgroundColor: '#f43f5e', borderColor: '#f43f5e' },
  tagText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  tagTextActive: { color: '#fff' },

  customAllergyContainer: { marginTop: 16 },
  customAllergyLabel: { fontSize: 10, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  customAllergyRow: { flexDirection: 'row', gap: 8 },
  customAllergyInput: { flex: 1, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: '#000' },
  addButton: { backgroundColor: '#f2faf5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, justifyContent: 'center' },
  addButtonDisabled: { opacity: 0.5 },
  addButtonText: { color: '#34C759', fontSize: 14, fontWeight: '700' },
  customAllergyTag: { backgroundColor: '#fbf8f9', borderWidth: 1, borderColor: '#e2eae6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  customAllergyTagText: { fontSize: 12, color: '#000' },
  customAllergyTagClose: { fontSize: 16, color: '#64748b', lineHeight: 18 },

  uploadArea: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#f1f5f9', borderRadius: 16, padding: 24, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  uploadSuccessText: { fontSize: 12, fontWeight: '700', color: '#197a38' },
  uploadTitle: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  uploadSubtitle: { fontSize: 9, color: '#64748b', marginTop: 2, marginBottom: 12 },
  uploadButton: { borderRadius: 999, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: '#34C759' },
  uploadButtonText: { fontSize: 10, fontWeight: '700', color: '#34C759' }
});
