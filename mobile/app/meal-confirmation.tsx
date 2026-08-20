import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Text as RNText } from 'react-native';
import { Check, Trash2, Plus, ChevronLeft } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

const mealItems = [
  { name: 'Roti, Dal and Rice', serving: '1 serving', calories: 610, confidence: 'High' }
];

export default function MealConfirmationScreen({ onBack, onContinue }: any) {
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
          <Text style={styles.title}>Did I get this right?</Text>
          <Text style={styles.subtitle}>Review the foods Liva detected.</Text>

          <View style={styles.list}>
            {mealItems.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={styles.checkBadge}>
                    <Check size={16} color="#fff" />
                  </View>
                  <View style={styles.cardContent}>
                     <View style={styles.cardHeaderRow}>
                        <View>
                           <Text style={styles.foodName}>{item.name}</Text>
                           <Text style={styles.foodDetails}>{item.serving} - {item.calories} kcal</Text>
                        </View>
                        {/* Confidence Badge */}
                        <View style={styles.confidenceBadge}>
                          <Text style={styles.confidenceText}>{item.confidence} Match</Text>
                        </View>
                     </View>
                     <View style={styles.actionsRow}>
                       <Pressable style={styles.editButton}>
                         <Text style={styles.editButtonText}>Edit</Text>
                       </Pressable>
                       <Pressable style={styles.deleteButton}>
                         <Trash2 size={13} color="#e11d48" />
                         <Text style={styles.deleteButtonText}>Delete</Text>
                       </Pressable>
                     </View>
                  </View>
                </View>
              </View>
            ))}
            <Pressable style={styles.addMoreButton}>
               <Plus size={18} color="#34C759" />
               <Text style={styles.addMoreText}>Add another food</Text>
            </Pressable>
          </View>
        </ScrollView>
        <View style={styles.footer}>
           <Pressable style={styles.primaryButton} onPress={onContinue}>
             <Text style={styles.primaryButtonText}>Continue</Text>
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
  list: { gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, shadowColor: '#10201a', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.06, shadowRadius: 18, elevation: 3 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#34C759', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  cardContent: { flex: 1 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  foodName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  foodDetails: { fontSize: 12, color: '#666', marginTop: 2 },
  confidenceBadge: { backgroundColor: '#f2faf5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  confidenceText: { color: '#34C759', fontSize: 10, fontWeight: 'bold' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  editButton: { backgroundColor: '#f2faf5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  editButtonText: { color: '#000', fontSize: 12, fontWeight: 'bold' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff1f2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  deleteButtonText: { color: '#e11d48', fontSize: 12, fontWeight: 'bold' },
  addMoreButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', height: 56, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(52,199,89,0.35)', borderStyle: 'dashed' },
  addMoreText: { color: '#34C759', fontSize: 14, fontWeight: 'bold' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  primaryButton: { backgroundColor: '#34C759', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
