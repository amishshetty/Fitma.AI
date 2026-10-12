import { useAppStore } from '../store/useAppStore';
import React, { useState } from 'react';
import { View, useColorScheme, StyleSheet, Pressable, Text as RNText, ScrollView } from 'react-native';
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
  const appTheme = useAppStore(s => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);

  const router = useRouter();
  
  const [offlineMode, setOfflineMode] = useState(false);
  const setAppTheme = useAppStore(s => s.setAppTheme);
  const displayTheme = appTheme.charAt(0).toUpperCase() + appTheme.slice(1);
  const handleThemeChange = (opt: string) => {
    setAppTheme(opt.toLowerCase() as 'light' | 'dark' | 'system');
  };
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const onLogout = () => {
    useAppStore.getState().logout();
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

  
  const CustomDropdown = ({ value, options, onChange }: { value: string; options: string[]; onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <View style={{ zIndex: 10 }}>
        <Pressable
          style={styles.dropdownBtn}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={styles.dropdownBtnText}>{value}</Text>
          <Text style={[styles.dropdownIcon, isOpen && { transform: [{ rotate: '180deg' }] }]}>▼</Text>
        </Pressable>
        {isOpen && (
          <View style={styles.dropdownMenu}>
            {options.map((opt) => (
              <Pressable
                key={opt}
                style={styles.dropdownItem}
                onPress={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{opt}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  };

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
              
              <CustomDropdown
                value={displayTheme}
                options={['Light', 'Dark', 'System']}
                onChange={handleThemeChange}
              />

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
            
            <Pressable style={styles.navRow} onPress={() => router.push('/profile-legal')}>
              <Text style={styles.navText}>Terms of Service</Text>
              <ChevronRight size={16} color="#64748b" />
            </Pressable>
            
            <Pressable style={styles.navRow} onPress={() => router.push('/profile-privacy')}>
              <Text style={styles.navText}>Privacy Policy</Text>
              <ChevronRight size={16} color="#64748b" />
            </Pressable>
            
            <Pressable style={[styles.navRow, styles.noBorderBottom, { paddingBottom: 0 }]} onPress={() => router.push('/profile-licenses')}>
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

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#ffffff' },
  content: { paddingBottom: 32, gap: 16 },
  card: { borderRadius: 24, backgroundColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#fff', padding: 20, borderWidth: 1, borderColor: isDark ? '#334155' : isDark ? '#334155' : '#f1f5f9', shadowColor: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#10201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 18, elevation: 2 },
  dropdownBtn: { backgroundColor: isDark ? '#334155' : isDark ? '#0f172a' : '#f8fafc', padding: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  dropdownBtnText: { fontSize: 12, fontWeight: 'bold', color: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#0f172a' },
  dropdownIcon: { fontSize: 10, color: isDark ? '#94a3b8' : isDark ? '#94a3b8' : '#64748b' },
  dropdownMenu: { backgroundColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#fff', borderRadius: 12, borderWidth: 1, borderColor: isDark ? '#334155' : isDark ? '#334155' : '#f1f5f9', marginTop: 4, overflow: 'hidden' },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: isDark ? '#334155' : isDark ? '#334155' : '#f1f5f9' },
  dropdownItemText: { fontSize: 12, color: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#000' },
  cardTitle: { fontSize: 12, fontWeight: 'bold', color: isDark ? '#94a3b8' : isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  field: { gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(241, 245, 249, 0.5)', marginBottom: 8 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(241, 245, 249, 0.5)', marginBottom: 12 },
  noBorderBottom: { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 },
  rowText: { flex: 1 },
  itemTitle: { fontSize: 12, fontWeight: 'bold', color: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#000' },
  itemSubtitle: { fontSize: 9, color: isDark ? '#94a3b8' : isDark ? '#94a3b8' : '#64748b', marginTop: 2 },
  navText: { fontSize: 12, fontWeight: 'bold', color: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#000' },
  versionText: { fontSize: 10, fontWeight: '500', color: isDark ? '#94a3b8' : isDark ? '#94a3b8' : '#64748b' },
  switch: { width: 40, height: 22, borderRadius: 11, padding: 2, flexDirection: 'row', alignItems: 'center' },
  switchThumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#fff', shadowColor: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1, elevation: 2 },
  actions: { paddingTop: 8 },
  logoutBtn: { width: '100%', backgroundColor: '#fff1f2', paddingVertical: 12, borderRadius: 16, alignItems: 'center', shadowColor: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  logoutText: { color: isDark ? '#fb7185' : isDark ? '#fb7185' : '#f43f5e', fontSize: 14, fontWeight: 'bold' },
  footer: { paddingTop: 16, alignItems: 'center' },
  footerText: { fontSize: 10, color: isDark ? '#94a3b8' : isDark ? '#94a3b8' : '#64748b', fontWeight: '600' },
});
