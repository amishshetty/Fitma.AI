import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text as RNText, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenShell from '../components/layout/ScreenShell';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProfilePrivacyScreen() {
  const router = useRouter();

  const [faceId, setFaceId] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [livaContext, setLivaContext] = useState(true);
  const [aiTraining, setAiTraining] = useState(false);
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showClearMemory, setShowClearMemory] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setShowConfirmDelete(false);
      router.replace('/login');
    }, 1500);
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
        title="Privacy & Security"
        subtitle="Configure data permissions and cryptographic encryption keys."
        onBack={() => router.back()}
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Biometric Login</Text>
                <Text style={styles.itemSubtitle}>Use Face ID to lock critical health files</Text>
              </View>
              <ToggleSwitch value={faceId} onValueChange={setFaceId} />
            </View>

            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Two-Factor Auth</Text>
                <Text style={styles.itemSubtitle}>Require a code for new logins</Text>
              </View>
              <ToggleSwitch value={twoFactor} onValueChange={setTwoFactor} />
            </View>

            <View style={[styles.row, { paddingBottom: 8 }]}>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>End-to-End Encryption</Text>
                <Text style={styles.itemSubtitle}>Strict database storage protection</Text>
              </View>
              <Text style={styles.activeText}>Active</Text>
            </View>

            <View style={styles.exportSection}>
              <Text style={styles.exportTitle}>HEALTH DATA EXPORTS</Text>
              <View style={styles.exportGrid}>
                <Pressable style={styles.exportBtn}>
                  <Text style={styles.exportBtnText}>Download JSON Data</Text>
                </Pressable>
                <Pressable style={styles.exportBtn}>
                  <Text style={styles.exportBtnText}>Export PDF Audit</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Liva Context Access</Text>
                <Text style={styles.itemSubtitle}>Allow Liva to read past logs and custom memories for personalization</Text>
              </View>
              <ToggleSwitch value={livaContext} onValueChange={setLivaContext} />
            </View>

            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>AI Model Training</Text>
                <Text style={styles.itemSubtitle}>Opt-in to use anonymized data to improve Fitma.ai models</Text>
              </View>
              <ToggleSwitch value={aiTraining} onValueChange={setAiTraining} />
            </View>

            <View>
              <Pressable style={styles.clearBtn} onPress={() => setShowClearMemory(true)}>
                <Text style={styles.clearBtnText}>Clear Liva's Memory</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.dangerCard}>
            <Text style={styles.dangerTitle}>DANGER ZONE</Text>
            <Text style={styles.dangerItemTitle}>Delete Your Account</Text>
            <Text style={styles.dangerItemSubtitle}>Permanently erase all your data. This cannot be undone.</Text>
            
            <Pressable style={styles.deleteBtn} onPress={() => setShowConfirmDelete(true)}>
              <Text style={styles.deleteBtnText}>Delete Account</Text>
            </Pressable>
          </View>
        </View>
      </ScreenShell>

      {/* Delete Confirmation */}
      {showConfirmDelete && (
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowConfirmDelete(false)} />
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>⚠</Text>
            <Text style={styles.modalTitle}>Are you absolutely sure?</Text>
            <Text style={styles.modalSubtitle}>To verify your identity, please enter your password below to confirm deletion.</Text>
            
            <TextInput
              secureTextEntry
              placeholder="Enter Password"
              placeholderTextColor="#64748b"
              style={styles.modalInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancelBtn} onPress={() => setShowConfirmDelete(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalActionBtnRed} onPress={handleDelete} disabled={deleting}>
                {deleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalActionText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Clear Memory Confirmation */}
      {showClearMemory && (
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowClearMemory(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalIconBg}>
              <Text style={styles.modalIcon}>🧠</Text>
            </View>
            <Text style={styles.modalTitle}>Clear AI Memory?</Text>
            <Text style={styles.modalSubtitle}>Liva will forget all personalized facts you've taught it. This cannot be undone.</Text>
            
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancelBtn} onPress={() => setShowClearMemory(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalActionBtnBlack} onPress={() => setShowClearMemory(false)}>
                <Text style={styles.modalActionText}>Clear Memory</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 480, alignSelf: 'center', height: '100%', flex: 1, backgroundColor: '#ffffff' },
  content: { paddingBottom: 32, gap: 16 },
  card: { borderRadius: 24, backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#10201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 18, elevation: 2 },
  dangerCard: { borderRadius: 24, backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: 'rgba(220,38,38,0.1)', shadowColor: 'rgba(220,38,38,0.04)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 18, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(241, 245, 249, 0.5)', marginBottom: 12 },
  rowText: { flex: 1, paddingRight: 16 },
  itemTitle: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  itemSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  activeText: { fontSize: 14, fontWeight: 'bold', color: '#34C759' },
  switch: { width: 48, height: 24, borderRadius: 12, padding: 2, flexDirection: 'row', alignItems: 'center' },
  switchThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1, elevation: 2 },
  
  exportSection: { paddingTop: 8 },
  exportTitle: { fontSize: 11, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  exportGrid: { flexDirection: 'row', gap: 8 },
  exportBtn: { flex: 1, backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, alignItems: 'center' },
  exportBtnText: { fontSize: 11, fontWeight: 'bold', color: '#64748b' },
  
  clearBtn: { width: '100%', backgroundColor: '#f8fafc', paddingVertical: 12, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  clearBtnText: { color: '#000', fontSize: 14, fontWeight: 'bold' },
  
  dangerTitle: { fontSize: 11, fontWeight: 'bold', color: '#ef4444', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  dangerItemTitle: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  dangerItemSubtitle: { fontSize: 12, color: '#64748b', marginTop: 4, marginBottom: 16 },
  deleteBtn: { width: '100%', backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 16, alignItems: 'center', shadowColor: 'rgba(239, 68, 68, 0.2)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2 },
  deleteBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24, zIndex: 100 },
  modalContent: { backgroundColor: '#fff', borderRadius: 28, padding: 24, width: '100%', maxWidth: 290, alignItems: 'center', shadowColor: '#10201a', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.16, shadowRadius: 48, elevation: 10 },
  modalIcon: { fontSize: 32, marginBottom: 12 },
  modalIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: '900', color: '#000', textAlign: 'center' },
  modalSubtitle: { fontSize: 10, color: '#64748b', textAlign: 'center', marginTop: 4, marginBottom: 16, lineHeight: 14 },
  modalInput: { width: '100%', backgroundColor: '#f8fafc', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9', fontSize: 12, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 8, width: '100%' },
  modalCancelBtn: { flex: 1, backgroundColor: '#f8fafc', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  modalCancelText: { fontSize: 10, fontWeight: 'bold', color: '#64748b' },
  modalActionBtnRed: { flex: 1, backgroundColor: '#dc2626', paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modalActionBtnBlack: { flex: 1, backgroundColor: '#000', paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modalActionText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
});
