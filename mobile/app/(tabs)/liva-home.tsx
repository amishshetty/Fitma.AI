import React, { useState, useEffect, useRef } from 'react';
import { green, muted, softGreen, ink } from '../../constants';
import { View, useColorScheme, StyleSheet, ScrollView, Pressable, TextInput, Text as RNText, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ArrowRight, BarChart2, PieChart, Sparkles, UtensilsCrossed, Soup, Droplets, Trash2, ChevronLeft, Send, Camera, MicOff, Keyboard, Mic } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import LivaAvatar from '../../components/layout/LivaAvatar';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

import { useAppStore } from '../../store/useAppStore';

export default function LivaHomeScreen() {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<any>(null);

  const toggleVoiceInput = () => {
    if (isListening) {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      // Wait, let the send button trigger handleSendText if clicked, 
      // but here we just manually stop it. If they click Voice again, it just stops.
      if (inputText.trim()) {
        // Auto send if they tap the voice button to stop
        setTimeout(() => handleSendText(inputText), 10);
      }
      return;
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setInputText('');
        };

        recognition.onresult = (event: any) => {
          let transcript = '';
          const isAndroid = /Android/i.test(navigator.userAgent);
          if (isAndroid) {
            transcript = event.results[event.results.length - 1][0].transcript;
          } else {
            transcript = Array.from(event.results as any)
              .map((result: any) => result[0].transcript)
              .join('');
          }
          setInputText(transcript);

          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

          silenceTimeoutRef.current = setTimeout(() => {
            if (transcript.trim()) {
              try { recognition.stop(); } catch (e) {}
              setIsListening(false);
              handleSendText(transcript);
            } else {
              try { recognition.stop(); } catch (e) {}
              setIsListening(false);
            }
          }, 1500);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      }
    }

    // Mock fallback
    setIsListening(true);
    setInputText('I had a grilled chicken salad with olive oil for lunch...');
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      setIsListening(false);
      handleSendText('I had a grilled chicken salad with olive oil for lunch');
    }, 2500);
  };
  const handleCameraPress = async () => {
    try { await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 }); } catch (e) { console.log(e); }
  };

  const appTheme = useAppStore(s => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);

  const router = useRouter();
  const userName = useAppStore(s => s.userName) || 'User';
  const caloriesLogged = useAppStore(s => s.caloriesLogged);
  const goals = useAppStore(s => s.goals);
  const remainingCalories = Math.max(0, (goals?.calories || 2000) - caloriesLogged);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const isProcessingRef = useRef(false);
  const [coachInsight, setCoachInsight] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const suggestionsScrollRef = useRef<ScrollView>(null);

  const quickSuggestions = [
    { label: 'Suggest Lunch', icon: Sparkles, action: () => handleSendText('Suggest a healthy lunch') },
    { label: 'Log Lunch', icon: UtensilsCrossed, action: () => handleSendText('Log my lunch') },
    { label: "Today's Summary", icon: BarChart2, action: () => handleSendText("What's my summary for today?") },
    { label: "Yesterday's Summary", icon: PieChart, action: () => handleSendText("Yesterday's summary") },
    { label: 'Log Water', icon: Droplets, action: () => handleSendText('Log a glass of water') },
  ];

  const handleSendText = async (textToSend: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    }
    if (!textToSend.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const { generateCoachResponse } = await import('../../utils/ai');
      const { useAppStore } = await import('../../store/useAppStore');
      const state = useAppStore.getState();
      
      const result = await generateCoachResponse(updatedMessages, textToSend, state);
      
      let responseText = typeof result?.response === 'string' ? result.response : (result?.response ? JSON.stringify(result.response) : "I hear you!");
        let safeGreeting = typeof result?.greeting === 'string' ? result.greeting : (result?.greeting ? JSON.stringify(result.greeting) : undefined);
        let safeMotivation = typeof result?.motivation === 'string' ? result.motivation : (result?.motivation ? JSON.stringify(result.motivation) : undefined);
      
      if (result?.type === 'water') {
        state.logWater(result.waterAmountMl || 250);
        responseText = result.response || `Got it! I logged ${result.waterAmountMl || 250}ml of water.`;
      } else if (result?.type === 'meal' && result.mealData) {
        await state.logMeal(result.mealData);
        responseText = result.response || `Got it! I logged ${result.mealData.calories} kcal for your ${result.mealData.mealType || 'snack'}.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'liva',
          text: responseText,
            greeting: safeGreeting,
            motivation: safeMotivation,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'liva',
          text: "I'm having trouble connecting right now. Try again?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
      isProcessingRef.current = false;
    }
  };

  const scrollSuggestions = () => {
    suggestionsScrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.root} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Hi {userName} 👋</Text>
            <Text style={styles.headerSubtitle}>Liva Coach Mode is active</Text>
          </View>
          <View style={styles.headerRight}>
            {messages.length > 0 && (
              <Pressable onPress={() => setMessages([])} style={styles.clearBtn}>
                <Trash2 size={20} color="#64748b" />
              </Pressable>
            )}
            <LivaAvatar size={54} floating />
          </View>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.mainScroll}
          contentContainerStyle={styles.mainContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Coach Insight */}
          <View style={styles.insightCard}>
            <View style={styles.insightIconWrapper}>
              <BarChart2 size={16} color={green} />
            </View>
            <Text style={styles.insightTag}>COACH INSIGHT</Text>
            
            <Text style={styles.insightDesc}>
              {coachInsight ? coachInsight : (
                <Text>
                  You have <Text style={{color: green}}>{remainingCalories} calories</Text> remaining today.{"\n"}
                  Would you like lunch suggestions?
                </Text>
              )}
            </Text>
            
            <Pressable 
              style={styles.insightBtn} 
              onPress={() => handleSendText("Suggest a healthy lunch")}
            >
              <Text style={styles.insightBtnText}>Get Suggestions</Text>
              <ArrowRight size={16} color="#ffffff" style={{marginLeft: 4}} />
            </Pressable>
          </View>

          {/* Chat Area */}
          {messages.length > 0 && (
            <View style={styles.chatTimeBadgeWrapper}>
              <Text style={styles.chatTimeBadge}>
                TODAY {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}

          {messages.map((msg) => (
            <View key={msg.id} style={[
              styles.messageRow,
              msg.sender === 'user' ? styles.messageRowUser : styles.messageRowLiva
            ]}>
              {msg.sender === 'liva' && <LivaAvatar size={32} />}
              
              <View style={[
                styles.messageBubbleWrapper,
                msg.sender === 'user' ? styles.messageBubbleWrapperUser : styles.messageBubbleWrapperLiva
              ]}>
                <View style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.messageBubbleUser : styles.messageBubbleLiva
                ]}>
                  {msg.greeting ? <Text style={styles.messageGreeting}>{msg.greeting}</Text> : null}
                  <Text style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.messageTextUser : styles.messageTextLiva
                  ]}>{msg.text}</Text>
                  {msg.motivation ? <Text style={styles.messageMotivation}>{msg.motivation}</Text> : null}
                </View>
                
                <View style={[styles.timestampWrapper, msg.sender === 'user' ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
                  <Text style={styles.timestamp}>{msg.timestamp}</Text>
                  {msg.sender === 'user' && <Text style={styles.checkmark}> ✓</Text>}
                </View>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageRow, styles.messageRowLiva]}>
              <LivaAvatar size={32} />
              <View style={[styles.messageBubble, styles.messageBubbleLiva, { paddingVertical: 12, paddingHorizontal: 16 }]}>
                <ActivityIndicator size="small" color={green} />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomArea}>
          {/* Quick Suggestions */}
          <View style={styles.suggestionsWrapper}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              ref={suggestionsScrollRef}
              contentContainerStyle={styles.suggestionsScrollContent}
            >
              {quickSuggestions.map((sug, idx) => {
                const Icon = sug.icon;
                return (
                  <Pressable key={idx} style={styles.suggestionCard} onPress={sug.action}>
                    <Icon size={24} color={green} />
                    <Text style={styles.suggestionText}>{sug.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Input Area */}
          
            {/* Input Area */}
            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <View style={styles.inputTop}>
                  <TextInput
                    ref={inputRef}
                    style={styles.textInput}
                    placeholder={isListening ? "Listening..." : "Message Liva..."}
                    placeholderTextColor="#8e8e93"
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={() => handleSendText(inputText)}
                  />
                  <Pressable 
                    style={[
                      styles.sendButton,
                      isListening ? styles.sendButtonListening : (!inputText.trim() && { opacity: 0.4 })
                    ]} 
                    onPress={() => handleSendText(inputText)}
                    disabled={!inputText.trim() && !isListening}
                  >
                    {isListening ? (
                      <Mic size={20} color="#ff3b30" />
                    ) : (
                      <Send size={18} color="#34C759" />
                    )}
                  </Pressable>
                </View>
                
                <View style={styles.inputBottom}>
                  <Pressable style={styles.pillButton} onPress={toggleVoiceInput}>
                    <View style={[styles.pillIconWrap, isListening ? styles.pillIconRed : styles.pillIconGreen]}>
                      <Mic size={15} color={isListening ? "#fff" : "#34C759"} />
                    </View>
                    <Text style={styles.pillText}>Voice</Text>
                  </Pressable>

                  <Pressable style={styles.pillButton} onPress={handleCameraPress}>
                    <View style={styles.pillIconWrapGray}>
                      <Camera size={15} color="#8e8e93" />
                    </View>
                    <Text style={styles.pillText}>Camera</Text>
                  </Pressable>

                  <Pressable style={styles.pillButton} onPress={() => inputRef.current?.focus()}>
                    <View style={styles.pillIconWrapGray}>
                      <Keyboard size={15} color="#8e8e93" />
                    </View>
                    <Text style={styles.pillText}>Keyboard</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#ffffff',
  },
  root: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#0f172a',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#94a3b8' : isDark ? '#94a3b8' : '#64748b',
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? isDark ? '#f8fafc' : '#0f172a' : isDark ? '#0f172a' : '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainScroll: {
    flex: 1,
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  insightCard: {
    backgroundColor: '#f1fcf5',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d1f2db',
    marginBottom: 24,
  },
  insightIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  insightTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0e793c',
    letterSpacing: 1,
    marginBottom: 8,
  },
  insightDesc: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 22,
    marginBottom: 16,
  },
  insightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#4ade80' : isDark ? '#4ade80' : '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  insightBtnText: {
    color: isDark ? '#1e293b' : isDark ? '#1e293b' : '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  chatTimeBadgeWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chatTimeBadge: {
    backgroundColor: isDark ? isDark ? '#f8fafc' : '#0f172a' : isDark ? '#0f172a' : '#f8fafc',
    color: isDark ? '#94a3b8' : isDark ? '#94a3b8' : '#64748b',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 10,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowLiva: {
    justifyContent: 'flex-start',
  },
  messageBubbleWrapper: {
    flexDirection: 'column',
    gap: 4,
  },
  messageBubbleWrapperUser: {
    maxWidth: '76%',
    alignItems: 'flex-end',
  },
  messageBubbleWrapperLiva: {
    maxWidth: '85%',
    alignItems: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubbleUser: {
    backgroundColor: isDark ? '#4ade80' : isDark ? '#4ade80' : '#34C759',
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  messageBubbleLiva: {
    backgroundColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#ffffff',
    borderWidth: 1,
    borderColor: isDark ? '#334155' : isDark ? '#334155' : '#f1f5f9',
    borderRadius: 24,
    shadowColor: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    width: '100%',
  },
  messageTextUser: {
    color: isDark ? '#1e293b' : isDark ? '#1e293b' : '#fff',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  messageGreeting: {
    fontSize: 15,
    fontWeight: 'bold',
    color: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#0f172a',
    marginBottom: 6,
  },
  messageTextLiva: {
    color: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#0f172a',
    fontSize: 14,
    lineHeight: 20,
  },
  messageMotivation: {
    color: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#0f172a',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    marginTop: 6,
  },
  timestampWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 2,
    width: '100%',
  },
  timestamp: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94a3b8',
  },
  checkmark: {
    fontSize: 10,
    color: isDark ? '#4ade80' : isDark ? '#4ade80' : '#34C759',
  },
  bottomArea: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingTop: 12,
  },
  suggestionsWrapper: {
    marginBottom: 12,
  },
  suggestionsScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  suggestionCard: {
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: isDark ? '#1e293b' : isDark ? '#1e293b' : '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: isDark ? isDark ? '#0f172a' : '#f8fafc' : isDark ? '#f8fafc' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 10,
    fontWeight: '700',
    color: isDark ? '#94a3b8' : isDark ? '#94a3b8' : '#64748b',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  inputContainer: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    inputBox: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderRadius: 24,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#f1f5f9',
      shadowColor: isDark ? '#f8fafc' : '#10201a',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 32,
      elevation: 4,
    },
    inputTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    textInput: {
      flex: 1,
      minHeight: 40,
      fontSize: 15,
      fontWeight: '500',
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    sendButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    sendButtonListening: {
      // Optional: Add pulsing animation via Animated if needed
    },
    inputBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    pillButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1e293b' : '#fff',
      paddingVertical: 4,
      paddingHorizontal: 4,
      borderRadius: 24,
    },
    pillIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    pillIconGreen: {
      backgroundColor: isDark ? 'rgba(52, 199, 89, 0.1)' : '#ecfbf1',
    },
    pillIconRed: {
      backgroundColor: '#ff3b30',
      shadowColor: '#ff3b30',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    pillIconWrapGray: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#334155' : '#f8fafc',
      borderWidth: 1,
      borderColor: isDark ? '#475569' : '#f1f5f9',
      marginRight: 8,
    },
    pillText: {
      fontSize: 11,
      fontWeight: '700',
      color: isDark ? '#94a3b8' : '#8e8e93',
      paddingRight: 8,
    },
});


