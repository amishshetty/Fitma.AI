import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text as RNText, TextInput } from 'react-native';
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
  const router = useRouter();
  
  const [name, setName] = useState('User');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [units, setUnits] = useState('Metric (kg, cm)');
  
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
              <TextInput style={styles.input} value={name} onChangeText={setName} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>GENDER</Text>
              <TextInput style={styles.input} value={gender} onChangeText={setGender} placeholder="Select gender" placeholderTextColor="#64748b" />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>HEIGHT</Text>
              <TextInput style={styles.input} value={height} onChangeText={setHeight} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Please add your phone number" placeholderTextColor="#64748b" />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>PREFERRED UNITS</Text>
              <TextInput style={[styles.input, styles.readOnlyInput]} value={units} editable={false} />
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

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: '#ffffff' },
  formContainer: { paddingBottom: 32 },
  successMessage: { backgroundColor: '#f2faf5', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(52, 199, 89, 0.2)' },
  successText: { color: '#197a38', fontSize: 12, fontWeight: 'bold' },
  errorMessage: { backgroundColor: '#fef2f2', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
  errorText: { color: '#b91c1c', fontSize: 12, fontWeight: 'bold' },
  card: { borderRadius: 24, backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#10201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 18, elevation: 2, gap: 16 },
  photoSection: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(241, 245, 249, 0.5)' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '900', color: '#64748b' },
  plusBadge: { position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  photoTitle: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  photoSubtitle: { fontSize: 9, fontWeight: '600', color: '#64748b', marginTop: 2 },
  field: { gap: 4 },
  label: { fontSize: 10, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { width: '100%', backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, fontSize: 12, fontWeight: 'bold', color: '#000' },
  readOnlyInput: { opacity: 0.7 },
  actions: { paddingTop: 8, marginTop: 16 },
});
