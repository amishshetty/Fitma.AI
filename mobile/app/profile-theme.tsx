import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenShell from '../components/layout/ScreenShell';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProfileThemeScreen() {
  const router = useRouter();
  const [theme, setTheme] = useState('system');

  const options = [
    { id: 'light', label: 'Light', desc: 'Always use light appearance' },
    { id: 'dark', label: 'Dark', desc: 'Always use dark appearance' },
    { id: 'system', label: 'System default', desc: 'Follow your device appearance' },
  ];

  return (
    <View style={styles.container}>
      <ScreenShell
        title="Appearance"
        subtitle="Choose how Fitma.ai looks"
        onBack={() => router.back()}
      >
        <View style={styles.content}>
          <View style={styles.card}>
            {options.map((option, index) => (
              <Pressable
                key={option.id}
                style={[
                  styles.optionRow,
                  index === options.length - 1 && styles.noBorderBottom
                ]}
                onPress={() => setTheme(option.id)}
              >
                <View style={styles.rowText}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDesc}>{option.desc}</Text>
                </View>
                <View style={[
                  styles.radio,
                  theme === option.id ? styles.radioSelected : styles.radioUnselected
                ]}>
                  {theme === option.id && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScreenShell>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: '#ffffff' },
  content: { paddingBottom: 32 },
  card: { borderRadius: 24, backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#10201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 18, elevation: 2 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(241, 245, 249, 0.5)', marginBottom: 12 },
  noBorderBottom: { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 },
  rowText: { flex: 1 },
  optionLabel: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  optionDesc: { fontSize: 9, color: '#64748b', marginTop: 2 },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: 'transparent', backgroundColor: '#34C759' },
  radioUnselected: { borderColor: 'rgba(241, 245, 249, 0.5)', backgroundColor: 'transparent' },
  radioInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
});
