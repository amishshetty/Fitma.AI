import React, { useEffect, useRef, useState } from 'react';
import { View, Text as RNText, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Mic, Check } from 'lucide-react-native';
import { parseMealLog } from '../utils/ai';
import { useAppStore } from '../store/useAppStore';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function VoiceLoggingScreen() {
  const router = useRouter();
  const logMeal = useAppStore((state) => state.logMeal);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();

    startListening();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onend = async () => {
          setIsRecording(false);
          // Wait for final state flush
          setTimeout(async () => {
            await processTranscript();
          }, 100);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          setErrorMsg("Could not hear you properly. Try again.");
        };

        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {}
      } else {
        setErrorMsg("Voice recognition not supported on this browser.");
      }
    } else {
      // Stub for native if tested via Expo Go (since expo-av/speech requires more setup)
      setErrorMsg("Voice logging is currently optimized for Web.");
    }
  };

  const processTranscript = async () => {
    const finalTranscript = transcript || (recognitionRef.current && recognitionRef.current.finalTranscript);
    if (!transcript) {
      if (!errorMsg) setErrorMsg("Didn't catch that. Tap below to cancel or try again.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const mealData = await parseMealLog(transcript);
      await logMeal(mealData);
      router.back();
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setErrorMsg("AI could not understand the food. Try again.");
    }
  };

  const onStop = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <Animated.View style={[styles.micContainer, { transform: [{ scale: scaleAnim }], backgroundColor: '#0EA5E9', shadowColor: '#0EA5E9' }]}>
              <Check size={62} color="#ffffff" />
            </Animated.View>
            <Text style={styles.title}>Processing with AI...</Text>
            <Text style={styles.subtitle}>Calculating calories and protein for: "{transcript}"</Text>
          </View>
        ) : (
          <>
            <Animated.View style={[styles.micContainer, { transform: [{ scale: scaleAnim }] }]}>
              <Mic size={62} color="#ffffff" />
            </Animated.View>
            <Text style={styles.title}>{isRecording ? "Listening..." : "Tap to speak"}</Text>
            <Text style={styles.subtitle}>
              {transcript || errorMsg || 'Try saying: "I had two rotis, dal and rice."'}
            </Text>

            <View style={[styles.barsContainer, { opacity: isRecording ? 1 : 0.3 }]}>
              {[24, 42, 30, 52, 36, 46, 26].map((height, i) => (
                <View
                  key={i}
                  style={[
                    styles.bar,
                    { height: isRecording ? height : 12, backgroundColor: i % 2 ? '#00C4B0' : '#34C759' }
                  ]}
                />
              ))}
            </View>
          </>
        )}
      </View>
      <View style={styles.footer}>
        {!isProcessing && isRecording ? (
          <Pressable style={styles.doneBtn} onPress={onStop}>
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        ) : null}
        <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  micContainer: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: '#34C759', // fallback
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10201a',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6d8779',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 260,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 56,
    gap: 8,
    marginTop: 40,
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  doneBtn: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#10201a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
