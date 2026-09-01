import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text as RNText, ScrollView } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ScreenShell from '../components/layout/ScreenShell';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProfileSettingsScreen() {
  const router = useRouter();
  
  const [offlineMode, setOfflineMode] = useState(false);
  const [theme, setTheme] = useState('System');
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const onLogout = () => {
    router.replace('/login');
  };

  const ToggleSwitch = ({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) => (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[
        styles.switch,
        {
          backgroundColor: value ? '#34C759' : '#cbd5e1',
          justifyContent: value ? 'flex-end' : 'flex-start',
        }
      ]}
    >
      <View style={styles.switchThumb} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScreenShell
        title="General Settings"
        subtitle="Granular accessibility and database configuration."
        onBack={() => router.back()}
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>APPEARANCE</Text>
            <View style={styles.field}>
              <Text style={styles.itemTitle}>Theme</Text>
              <Text style={styles.itemSubtitle}>{theme}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>ACCESSIBILITY FEATURES</Text>
            
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Large Text Size</Text>
                <Text style={styles.itemSubtitle}>Scale interface typography for visibility</Text>
              </View>
              <ToggleSwitch value={largeText} onValueChange={setLargeText} />
            </View>
            
            <View style={[styles.row, styles.noBorderBottom]}>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>High Contrast Mode</Text>
                <Text style={styles.itemSubtitle}>Deep darks and high ratio alerts</Text>
              </View>
              <ToggleSwitch value={highContrast} onValueChange={setHighContrast} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>OFFLINE SYNCHRONIZER</Text>
            
            <View style={[styles.row, styles.noBorderBottom]}>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Offline Mode</Text>
                <Text style={styles.itemSubtitle}>Save meals locally when internet drops</Text>
              </View>
              <ToggleSwitch value={offlineMode} onValueChange={setOfflineMode} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>ABOUT</Text>
            
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>App Version</Text>
              </View>
              <Text style={styles.versionText}>0.9.4 Prototype</Text>
            </View>
            
            <Pressable style={styles.navRow} onPress={() => {}}>
              <Text style={styles.navText}>Terms of Service</Text>
              <ChevronRight size={16} color="#64748b" />
            </Pressable>
            
            <Pressable style={styles.navRow} onPress={() => {}}>
              <Text style={styles.navText}>Privacy Policy</Text>
              <ChevronRight size={16} color="#64748b" />
            </Pressable>
            
            <Pressable style={[styles.navRow, styles.noBorderBottom, { paddingBottom: 0 }]} onPress={() => {}}>
              <Text style={styles.navText}>Open-source Licenses</Text>
              <ChevronRight size={16} color="#64748b" />
            </Pressable>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.logoutBtn} onPress={onLogout}>
              <Text style={styles.logoutText}>Logout Account</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 Fitma Technologies Inc. All rights reserved.</Text>
          </View>
        </View>
      </ScreenShell>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: '#ffffff' },
  content: { paddingBottom: 32, gap: 16 },
  card: { borderRadius: 24, backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#10201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 18, elevation: 2 },
  cardTitle: { fontSize: 12, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  field: { gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(241, 245, 249, 0.5)', marginBottom: 8 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(241, 245, 249, 0.5)', marginBottom: 12 },
  noBorderBottom: { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 },
  rowText: { flex: 1 },
  itemTitle: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  itemSubtitle: { fontSize: 9, color: '#64748b', marginTop: 2 },
  navText: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  versionText: { fontSize: 10, fontWeight: '500', color: '#64748b' },
  switch: { width: 40, height: 22, borderRadius: 11, padding: 2, flexDirection: 'row', alignItems: 'center' },
  switchThumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1, elevation: 2 },
  actions: { paddingTop: 8 },
  logoutBtn: { width: '100%', backgroundColor: '#fff1f2', paddingVertical: 12, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  logoutText: { color: '#f43f5e', fontSize: 14, fontWeight: 'bold' },
  footer: { paddingTop: 16, alignItems: 'center' },
  footerText: { fontSize: 10, color: '#64748b', fontWeight: '600' },
});
