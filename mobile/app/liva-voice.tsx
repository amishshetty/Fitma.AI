import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Animated, Text as RNText, SafeAreaView } from 'react-native';
import { ArrowLeft, MicOff, Mic } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function LivaVoiceScreen() {
  const router = useRouter();
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing' | 'error'>('idle');
  const [transcript, setTranscript] = useState('');

  // Dummy animation for mic pulse
  const [scaleAnim] = useState(new Animated.Value(1));
  const [waveAnims] = useState([...Array(7)].map(() => new Animated.Value(8)));

  useEffect(() => {
    if (voiceStatus === 'listening') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      ).start();

      waveAnims.forEach((anim, index) => {
        const height = [28, 48, 34, 60, 42, 50, 32][index];
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: height, duration: 425, delay: index * 80, useNativeDriver: false }),
            Animated.timing(anim, { toValue: 16, duration: 425, useNativeDriver: false }),
          ])
        ).start();
      });
    } else {
      scaleAnim.setValue(1);
      waveAnims.forEach(anim => anim.setValue(8));
    }
  }, [voiceStatus]);

  const startListening = () => {
    setVoiceStatus('listening');
    setTranscript('');
    // Dummy speech recognition
    setTimeout(() => {
      setTranscript('I had two rotis and dal');
      setVoiceStatus('idle');
    }, 3000);
  };

  const handleSend = () => {
    if (transcript.trim()) {
      setVoiceStatus('processing');
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleCancel} style={styles.iconButton}>
            <ArrowLeft size={19} color="#10201a" />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Voice Conversation</Text>
            <Text style={styles.headerSubtitle}>Speak to Liva</Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.micContainer}>
            {voiceStatus === 'listening' && (
              <View style={[styles.pingCircle, StyleSheet.absoluteFillObject]} />
            )}
            <Pressable 
              onPress={voiceStatus === 'idle' || voiceStatus === 'error' ? startListening : undefined}
            >
              <Animated.View style={[
                styles.micButton,
                { transform: [{ scale: scaleAnim }] },
                voiceStatus === 'error' ? styles.micError : (voiceStatus === 'idle' ? styles.micIdle : styles.micActive)
              ]}>
                {voiceStatus === 'error' ? <MicOff size={64} color="#fff" /> : <Mic size={64} color="#fff" />}
              </Animated.View>
            </Pressable>
          </View>

          <Text style={styles.statusText}>
            {voiceStatus === 'error'
              ? 'Mic not available'
              : voiceStatus === 'processing'
                ? 'Sending to Liva...'
                : voiceStatus === 'idle'
                  ? 'Tap Mic to Start'
                  : 'Listening...'}
          </Text>

          {transcript ? (
            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptText}>"{transcript}"</Text>
            </View>
          ) : voiceStatus === 'listening' ? (
            <Text style={styles.suggestionText}>
              Try saying: <Text style={styles.suggestionHighlight}>"I had two rotis and dal"</Text>
            </Text>
          ) : null}

          {/* Waveforms */}
          <View style={styles.waveforms}>
            {waveAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.waveBar,
                  { height: anim, backgroundColor: index % 2 ? '#00C4B0' : '#34C759' }
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          {transcript ? (
            <View style={{ marginBottom: 12 }}>
              <PrimaryButton onPress={handleSend}>Send to Liva</PrimaryButton>
            </View>
          ) : null}
          <SecondaryButton onPress={handleCancel}>
            Cancel
          </SecondaryButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#10201a',
  },
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: '#10201a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 44,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6d8779',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  micContainer: {
    position: 'relative',
    marginBottom: 48,
  },
  pingCircle: {
    backgroundColor: 'rgba(52,199,89,0.1)',
    borderRadius: 72,
    transform: [{ scale: 1.3 }],
  },
  micButton: {
    width: 144,
    height: 144,
    borderRadius: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micError: {
    backgroundColor: '#ef4444',
  },
  micIdle: {
    backgroundColor: '#9bb2a5',
  },
  micActive: {
    backgroundColor: '#34C759',
  },
  statusText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  transcriptBox: {
    marginTop: 16,
    maxWidth: 300,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  transcriptText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#b0d4be',
    textAlign: 'center',
  },
  suggestionText: {
    marginTop: 14,
    maxWidth: 260,
    fontSize: 14,
    lineHeight: 22,
    color: '#9bb2a5',
    textAlign: 'center',
  },
  suggestionHighlight: {
    color: '#34C759',
    fontWeight: '600',
  },
  waveforms: {
    marginTop: 44,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    gap: 10,
  },
  waveBar: {
    width: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 20,
  },
});
