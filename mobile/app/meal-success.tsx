import React from 'react';
import { View, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Text as RNText } from 'react-native';
import { Check } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function MealSuccessScreen({ onDashboard, onLogAnother }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <View style={styles.content}>
           <View style={styles.ringContainer}>
             <View style={styles.ring}>
                <View style={styles.checkCircle}>
                   <Check size={42} color="#fff" />
                </View>
             </View>
           </View>
           <Text style={styles.title}>Meal Logged</Text>
           <Text style={styles.subtitle}>Great job! You're 40% closer to today's nutrition goal.</Text>
        </View>

        <View style={styles.footer}>
           <Pressable style={styles.primaryButton} onPress={onDashboard}>
             <Text style={styles.primaryButtonText}>View Dashboard</Text>
           </Pressable>
           <Pressable style={styles.secondaryButton} onPress={onLogAnother}>
             <Text style={styles.secondaryButtonText}>Log Another Meal</Text>
           </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  root: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: '#ffffff', flexDirection: 'column' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  ringContainer: { position: 'relative', width: 154, height: 154, justifyContent: 'center', alignItems: 'center', marginBottom: 28 },
  ring: { width: 154, height: 154, borderRadius: 77, borderWidth: 8, borderColor: '#34C759', justifyContent: 'center', alignItems: 'center' },
  checkCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#34C759', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 30, fontWeight: 'bold', color: '#000', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  footer: { padding: 20, gap: 12 },
  primaryButton: { backgroundColor: '#34C759', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: '#f2faf5', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  secondaryButtonText: { color: '#34C759', fontSize: 16, fontWeight: 'bold' },
});
