import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { Text as RNText } from 'react-native';
import { Clock3, ChevronLeft } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function SaveMealScreen({ onBack, onSave }: any) {
  const [mealType, setMealType] = useState('Lunch');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSave?.();
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
           <Pressable onPress={onBack} style={styles.backButton}>
              <ChevronLeft size={24} color="#000" />
           </Pressable>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>Save Meal</Text>
          <Text style={styles.subtitle}>One last check before your dashboard updates.</Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Roti, Dal and Rice</Text>
              <Text style={styles.summaryCalories}>610</Text>
            </View>
            <View style={styles.macrosRow}>
              {['22g Protein', '115g Carbs', '8g Fat'].map(item => (
                <View key={item} style={styles.macroBadge}>
                  <Text style={styles.macroText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meal Type</Text>
            <View style={styles.mealTypeGrid}>
              {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => (
                <Pressable 
                  key={type}
                  onPress={() => setMealType(type)}
                  style={[styles.mealTypeButton, mealType === type && styles.mealTypeButtonActive]}
                >
                  <Text style={[styles.mealTypeText, mealType === type && styles.mealTypeTextActive]}>
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Time</Text>
            <Pressable style={styles.timeButton}>
               <Clock3 size={19} color="#34C759" />
               <Text style={styles.timeText}>Today, 1:20 PM</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput 
              style={styles.notesInput}
              placeholder="Add notes..."
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
            />
          </View>

        </ScrollView>

        <View style={styles.footer}>
           <Pressable style={styles.primaryButton} onPress={handleSave}>
             <Text style={styles.primaryButtonText}>{isSaving ? 'Saving...' : 'Save Meal'}</Text>
           </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  root: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: '#ffffff', flexDirection: 'column' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  
  summaryCard: { backgroundColor: '#fff', borderRadius: 28, padding: 20, shadowColor: '#10201a', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.07, shadowRadius: 26, elevation: 4, marginBottom: 24 },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  summaryCalories: { fontSize: 18, fontWeight: 'bold', color: '#34C759' },
  macrosRow: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  macroBadge: { flex: 1, backgroundColor: '#f2faf5', borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  macroText: { fontSize: 12, fontWeight: 'bold', color: '#000' },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 12 },
  mealTypeGrid: { flexDirection: 'row', gap: 8 },
  mealTypeButton: { flex: 1, backgroundColor: '#fff', paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
  mealTypeButtonActive: { backgroundColor: '#34C759' },
  mealTypeText: { fontSize: 12, fontWeight: 'bold', color: '#666' },
  mealTypeTextActive: { color: '#fff' },

  timeButton: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 16, borderRadius: 16 },
  timeText: { fontSize: 14, fontWeight: '600', color: '#000' },

  notesInput: { backgroundColor: '#fff', borderRadius: 16, padding: 16, minHeight: 96, fontSize: 14, color: '#000' },

  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  primaryButton: { backgroundColor: '#34C759', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
