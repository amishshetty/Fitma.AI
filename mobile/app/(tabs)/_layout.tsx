import { Tabs, useRouter, usePathname } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Pressable, Text, Animated, ScrollView } from 'react-native';
import { Home, Calendar, Sparkles, Target, User } from 'lucide-react-native';
import LivaAvatar from '../../components/layout/LivaAvatar';
import LivaSiriOverlay from '../../components/layout/LivaSiriOverlay';
import { useAppStore } from '../../store/useAppStore';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  
  const showFloatingLiva = !pathname.includes('liva-home');

  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  
  // Siri Overlay State
  const [siriActive, setSiriActive] = useState(false);
  const [siriText, setSiriText] = useState('Listening...');
  const [siriNotification, setSiriNotification] = useState<string | null>(null);
  const [pendingMealData, setPendingMealData] = useState<any>(null);
  const activeSiriRecRef = useRef<any>(null);

  const logMeal = useAppStore((state) => state.logMeal);
  const logWater = useAppStore((state) => state.logWater);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const runCycle = (delay: number) => {
      timeoutId = setTimeout(() => {
        Animated.timing(tooltipOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        setTimeout(() => {
          Animated.timing(tooltipOpacity, { toValue: 0, duration: 800, useNativeDriver: true }).start();
        }, 3500);
        runCycle(15000 + Math.random() * 15000);
      }, delay);
    };
    runCycle(5000);
    return () => clearTimeout(timeoutId);
  }, []);

  const wakeWordRecRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition || !showFloatingLiva) return;

    if (!wakeWordRecRef.current) {
      const wakeWordRecognition = new SpeechRecognition();
      wakeWordRecognition.continuous = true;
      wakeWordRecognition.interimResults = true;
      wakeWordRecognition.lang = 'en-US';
      wakeWordRecRef.current = wakeWordRecognition;
    }

    const wakeWordRecognition = wakeWordRecRef.current;

    wakeWordRecognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('')
        .toLowerCase();

      if (transcript.includes('hey') && (transcript.includes('liva') || transcript.includes('oliva'))) {
        wakeWordRecognition.abort();
        triggerSiri();
      }
    };

    wakeWordRecognition.onerror = (e: any) => {
      // Ignore errors in background
    };

    wakeWordRecognition.onend = () => {
      if (showFloatingLiva && !siriActive) {
        setTimeout(() => {
          try { wakeWordRecognition.start(); } catch (e) {}
        }, 250);
      }
    };

    if (showFloatingLiva && !siriActive) {
      try { wakeWordRecognition.start(); } catch (e) {}
    }

    return () => {
      wakeWordRecognition.onend = null;
      wakeWordRecognition.abort();
    };
  }, [showFloatingLiva, siriActive]);

  const triggerSiri = () => {
    if (siriActive) return;
    if (wakeWordRecRef.current) {
      try { wakeWordRecRef.current.abort(); } catch (e) {}
    }
    setSiriText('Listening...');
    setSiriNotification(null);
    setSiriActive(true);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSiriText('Voice not supported on this browser. Try Chrome/Safari.');
        setTimeout(() => setSiriActive(false), 3000);
        return;
      }

      const recognition = new SpeechRecognition();
      activeSiriRecRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;

      let finalTranscript = '';
      let isProcessing = false;
      let silenceTimeout: any = null;

      const finishListening = async () => {
        if (isProcessing || !finalTranscript) return;
        try { recognition.stop(); } catch (e) {}
        isProcessing = true;
        if (silenceTimeout) clearTimeout(silenceTimeout);

        setSiriText(`"${finalTranscript}"\n\nThinking...`);

        try {
          // Dynamic import to avoid eager loading AI lib everywhere
          const { processVoiceCommand } = await import('../../utils/ai');
          const result = await processVoiceCommand(finalTranscript);
          
          if (result.type === 'water') {
            logWater(result.waterAmountMl || 250);
            setSiriText(result.response || `Got it! I logged ${result.waterAmountMl || 250}ml of water.`);
            setSiriNotification('Water logged successfully!');
            setTimeout(() => setSiriActive(false), 3500);
          } else if (result.type === 'meal' && result.mealData) {
            if (result.mealData.mealType === 'unknown') {
              setPendingMealData(result.mealData);
              setSiriText("Which meal is this for?");
            } else {
              await logMeal(result.mealData);
              setSiriText(result.response || `Got it! I logged ${result.mealData.calories} kcal for your ${result.mealData.mealType || 'snack'}.`);
              const mealTypeFormatted = result.mealData.mealType ? result.mealData.mealType.charAt(0).toUpperCase() + result.mealData.mealType.slice(1) : 'Snack';
              setSiriNotification(`Meal saved in ${mealTypeFormatted}!`);
              setTimeout(() => setSiriActive(false), 3500);
            }
          } else {
            // It's a chat
            setSiriText(result.response || "I hear you! Let's talk more in the chat.");
            setTimeout(() => {
              setSiriActive(false);
              router.push('/(tabs)/liva-home');
            }, 2500);
          }
        } catch (error) {
          setSiriText("I couldn't quite understand that. Let's talk in the chat!");
          setTimeout(() => {
            setSiriActive(false);
            router.push('/(tabs)/liva-home');
          }, 2500);
        }
      };

      recognition.onresult = (event: any) => {
        if (isProcessing) return;
        let transcript = '';
        const isAndroid = /Android/i.test(navigator.userAgent);
        if (isAndroid) {
          transcript = event.results[event.results.length - 1][0].transcript;
        } else {
          transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
        }

        setSiriText(transcript || 'Listening...');
        finalTranscript = transcript;

        if (silenceTimeout) clearTimeout(silenceTimeout);
        silenceTimeout = setTimeout(() => {
          if (finalTranscript.trim()) {
            finishListening();
          } else {
            setSiriText("I didn't catch that. Tap me again.");
            try { recognition.stop(); } catch (e) {}
            setTimeout(() => setSiriActive(false), 2500);
          }
        }, 1500);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'aborted') return;
        setSiriText(event.error === 'not-allowed' ? 'Microphone access denied.' : "I didn't catch that.");
        setTimeout(() => setSiriActive(false), 2500);
      };

      try {
        recognition.start();
      } catch (e) {
        console.warn(e);
      }
    } else {
      setSiriText('Siri overlay is currently optimized for Web.');
      setTimeout(() => setSiriActive(false), 3000);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 72,
            paddingBottom: Platform.OS === 'web' ? 8 : 20,
            paddingTop: 10,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            ...Platform.select({
              web: {
                boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
              } as any,
              default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.04,
                shadowRadius: 20,
              },
            }),
          },
          tabBarActiveTintColor: '#34C759',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            marginTop: 2,
          },
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? styles.activeIcon : undefined}>
                <Home color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="my-plan"
          options={{
            title: 'My Plan',
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? styles.activeIcon : undefined}>
                <Calendar color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="liva-home"
          options={{
            title: 'Liva',
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? styles.activeIcon : undefined}>
                <Sparkles color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="progress-dashboard"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? styles.activeIcon : undefined}>
                <Target color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile-home"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? styles.activeIcon : undefined}>
                <User color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
      </Tabs>
      
      {showFloatingLiva && !siriActive && (
        <View style={styles.floatingContainer}>
          <Animated.View style={[styles.tooltipContainer, { opacity: tooltipOpacity }]}>
            <Text style={styles.tooltipText}>Say "Hey Liva"</Text>
            <View style={styles.tooltipArrow} />
          </Animated.View>
          <Pressable 
            style={styles.floatingButton} 
            onPress={triggerSiri}
          >
            <LivaAvatar size={44} floating={true} />
          </Pressable>
        </View>
      )}

      {siriActive && (
        <LivaSiriOverlay 
          text={siriText} 
          notification={siriNotification}
          onClose={() => {
            if (activeSiriRecRef.current) {
              try { activeSiriRecRef.current.abort(); } catch (e) {}
            }
            setSiriActive(false);
            setPendingMealData(null);
          }} 
          cueCard={
            pendingMealData ? (
              <View style={styles.cueCardContainer}>
                <View style={styles.cueCardBubble}>
                  <Text style={styles.cueCardTitle}>Which meal is this?</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cueCardChips}>
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((section) => (
                    <Pressable
                      key={section}
                      onPress={async () => {
                        await logMeal({
                          ...pendingMealData,
                          mealType: section.toLowerCase(),
                        });
                        setPendingMealData(null);
                        setSiriNotification(`Meal saved in ${section}!`);
                        setTimeout(() => {
                          setSiriActive(false);
                          setSiriNotification(null);
                        }, 2500);
                      }}
                      style={styles.cueCardChip}
                    >
                      <Text style={styles.cueCardChipText}>{section}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : undefined
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  activeIcon: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 12,
    padding: 6,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 90, // Above the tab bar
    right: 16,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tooltipContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8, // Space between tooltip and avatar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10201a',
  },
  tooltipArrow: {
    position: 'absolute',
    right: -4,
    top: '50%',
    marginTop: -4,
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#ffffff',
  },
  floatingButton: {
    // shadow handled in LivaAvatar
  },
  cueCardContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  cueCardBubble: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 8,
  },
  cueCardTitle: {
    fontWeight: '800',
    fontSize: 13,
    color: '#0f172a',
  },
  cueCardChips: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    paddingBottom: 4,
  },
  cueCardChip: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cueCardChipText: {
    color: '#34C759',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
