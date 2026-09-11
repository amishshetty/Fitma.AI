import { useAppStore } from '../store/useAppStore';
import React, { useState } from 'react';
import { View, useColorScheme, StyleSheet, Pressable, Text as RNText, TextInput } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ScreenShell from '../components/layout/ScreenShell';
import PrimaryButton from '../components/ui/PrimaryButton';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProfilePersonalScreen() {
  const appTheme = useAppStore(s => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);

  const router = useRouter();
  
  const [name, setName] = useState('User');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const \[units, setUnits\] = useState\('Metric \(kg, cm\)'\);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!phone || phone.trim() === '') {
      setError('Please add your phone number to continue.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };

  return (
    <View style={styles.container}>
      <ScreenShell
        title="Personal Information"
        subtitle="Edit your contact and body metrics. Auto-saved."
        onBack={() => router.back()}
      >
        <View style={styles.formContainer}>
          {success && (
            <View style={styles.successMessage}>
              <Text style={styles.successText}>✓ Success: Profile information updated successfully.</Text>
            </View>
          )}
          {error !== '' && (
            <View style={styles.errorMessage}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          <View style={styles.card}>
            <Pressable style={styles.photoSection}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : 'A'}</Text>
                </View>
                <View style={styles.plusBadge}>
                  <Plus size={10} color="#fff" strokeWidth={4} />
                </View>
              </View>
              <View>
                <Text style={styles.photoTitle}>Change profile photo</Text>
                <Text style={styles.photoSubtitle}>JPG or PNG. Max 2MB</Text>
              </View>
            </Pressable>

            {/* Fields */}
            <View style={styles.field}>
              <Text style={styles.label}>FULL NAME</Text>
              
                <View style={{position: 'relative', zIndex: isGenderDropdownOpen ? 100 : 1}}>
                  <Pressable
                    style={[
                      styles.input,
                      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                      isGenderDropdownOpen && styles.inputFocused
                    ]}
                    onPress={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                  >
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: gender ? (isDark ? '#f8fafc' : '#000') : '#64748b' }}>
                      {gender || 'Select gender'}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#64748b', transform: [{ rotate: isGenderDropdownOpen ? '180deg' : '0deg' }] }}>▼</Text>
                  </Pressable>
                  
                  {isGenderDropdownOpen && (
                    <View style={styles.dropdownMenu}>
                      {['Male', 'Female', 'Other', 'Prefer not to say'].map((opt) => (
                        <Pressable 
                          key={opt}
                          style={[styles.dropdownItem, gender === opt && styles.dropdownItemSelected]}
                          onPress={() => {
                            setGender(opt);
                            setIsGenderDropdownOpen(false);
                          }}
                        >
                          <Text style={[styles.dropdownItemText, gender === opt && styles.dropdownItemTextSelected]}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>HEIGHT</Text>
              <TextInput 
                  style={[styles.input, focusedField === 'height' && styles.inputFocused]}
                  onFocus={() => setFocusedField('height')}
                  onBlur={() => setFocusedField(null)}
                  value={height} onChangeText={setHeight} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput 
                  style={[styles.input, focusedField === 'email' && styles.inputFocused]}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  value={email} onChangeText={setEmail} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <TextInput 
                  style={[styles.input, focusedField === 'phone' && styles.inputFocused]}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  value={phone} placeholder="Please add your phone number" placeholderTextColor="#64748b" onChangeText={setPhone} placeholder="Please add your phone number" placeholderTextColor="#64748b" />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>PREFERRED UNITS</Text>
              <TextInput 
                  style={[styles.input, styles.readOnlyInput, focusedField === 'units' && styles.inputFocused]}
                  onFocus={() => setFocusedField('units')}
                  onBlur={() => setFocusedField(null)}
                  value={units} editable={false} />
            </View>
          </View>

          <View style={styles.actions}>
            <PrimaryButton onPress={handleSave}>Save Personal Data</PrimaryButton>
          </View>
        </View>
      </ScreenShell>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#ffffff' },
  formContainer: { paddingBottom: 32 },
  successMessage: { backgroundColor: '#f2faf5', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(52, 199, 89, 0.2)' },
  successText: { color: '#197a38', fontSize: 12, fontWeight: 'bold' },
  errorMessage: { backgroundColor: '#fef2f2', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
  errorText: { color: '#b91c1c', fontSize: 12, fontWeight: 'bold' },
  card: { borderRadius: 24, backgroundColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#fff', padding: 20, borderWidth: 1, borderColor: isDark ? '#334155' : isDark ? '#334155' : '#f1f5f9', shadowColor: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#10201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 18, elevation: 2, gap: 16 },
  photoSection: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(241, 245, 249, 0.5)' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: isDark ? isDark ? '#f8fafc' : '#0f172a' : isDark ? '#0f172a' : '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '900', color: isDark ? '#94a3b8' : isDark ? '#94a3b8' : '#64748b' },
  plusBadge: { position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#fff' },
  photoTitle: { fontSize: 12, fontWeight: 'bold', color: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#000' },
  photoSubtitle: { fontSize: 9, fontWeight: '600', color: isDark ? '#94a3b8' : isDark ? '#94a3b8' : '#64748b', marginTop: 2 },
  field: { gap: 4 },
  label: { fontSize: 10, fontWeight: 'bold', color: isDark ? '#94a3b8' : isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { width: '100%', backgroundColor: isDark ? isDark ? '#f8fafc' : '#0f172a' : isDark ? '#0f172a' : '#f8fafc', padding: 12, borderRadius: 12, fontSize: 12, fontWeight: 'bold', color: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#000' },
  readOnlyInput: \{ opacity: 0\.7 \},
    
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: 8,
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      paddingVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      zIndex: 999,
    },
    dropdownItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    dropdownItemSelected: {
      backgroundColor: isDark ? 'rgba(52, 199, 89, 0.1)' : '#f2faf5',
    },
    dropdownItemText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: isDark ? '#f8fafc' : '#000',
    },
    dropdownItemTextSelected: {
      color: '#34c759',
    },
    inputFocused: {
      borderWidth: 2,
      borderColor: isDark ? '#f8fafc' : '#000',
      backgroundColor: isDark ? '#0f172a' : '#fff',
    },
  actions: { paddingTop: 8, marginTop: 16 },
});
