import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Text as RNText, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ArrowLeft, MicOff, Mic, Send, TrendingUp, Camera, Keyboard } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Custom Text to prevent Android clipping
const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

// We'll stub LivaAvatar and imported components if needed, or inline them
import LivaAvatar from '../components/layout/LivaAvatar';

export default function LivaChatScreen() {
  const router = useRouter();
  const userName = 'Amish'; // Defaulted

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const dynamicPrompts = useMemo(() => {
    return ['Log Lunch', 'Suggest Dinner', "Today's Summary", 'Log Water'];
  }, []);

  const handleSendText = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Mock response after timeout
    setTimeout(() => {
      const livaReply = "I'm here for you! Try asking me something about nutrition or log a meal.";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'liva',
          text: livaReply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Dummy logic
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={20} color="#000" />
            </Pressable>
            <View>
              <Text style={styles.headerTitle}>
                {getGreetingTime()}, {userName}! 👋
              </Text>
              <View style={styles.activeStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Liva Coach Mode is active</Text>
              </View>
            </View>
          </View>
          {/* Mock Avatar */}
          <View style={styles.avatarMock}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>L</Text>
          </View>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Coach Insight */}
          <View style={styles.insightCard}>
            <View style={styles.insightIconWrapper}>
              <TrendingUp size={20} color="#34C759" />
            </View>
            <View style={styles.insightTextWrapper}>
              <Text style={styles.insightTitle}>COACH INSIGHT</Text>
              <Text style={styles.insightDesc}>
                You have <Text style={styles.insightDescBold}>480</Text> calories remaining today. Would you like dinner suggestions?
              </Text>
            </View>
          </View>

          {messages.map((msg) => (
            <View key={msg.id} style={[
              styles.messageRow,
              msg.sender === 'user' ? styles.messageRowUser : styles.messageRowLiva
            ]}>
              {msg.sender === 'liva' && (
                <View style={styles.messageAvatarMock}>
                  <Text style={{color: '#fff', fontSize: 12}}>L</Text>
                </View>
              )}
              
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
              <View style={styles.messageAvatarMock}>
                <Text style={{color: '#fff', fontSize: 12}}>L</Text>
              </View>
              <View style={[styles.messageBubble, styles.messageBubbleLiva, { paddingVertical: 12, paddingHorizontal: 16 }]}>
                <ActivityIndicator size="small" color="#34C759" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Prompts */}
        <View style={styles.promptsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsContent}>
            {dynamicPrompts.map((promptText) => (
              <Pressable key={promptText} style={styles.promptButton} onPress={() => handleSendText(promptText)}>
                <Text style={styles.promptText}>{promptText}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder={isListening ? 'Listening...' : 'Ask Liva anything...'}
              placeholderTextColor="#8e8e93"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSendText(inputText)}
            />
            <Pressable 
              style={[styles.sendButton, !inputText.trim() && { opacity: 0.3 }]} 
              onPress={() => handleSendText(inputText)}
              disabled={!inputText.trim()}
            >
              <Send size={18} color="#34C759" />
            </Pressable>
          </View>
          <View style={styles.inputActions}>
            <Pressable onPress={toggleVoiceInput} style={styles.actionButton}>
              {isListening ? <MicOff size={22} color="#ff3b30" /> : <Mic size={22} color="#8e8e93" />}
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Camera size={22} color="#8e8e93" />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Keyboard size={22} color="#8e8e93" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52,199,89,0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  activeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8e8e93',
  },
  avatarMock: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingBottom: 16,
  },
  insightCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  insightIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2faf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTextWrapper: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#2a9d48',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    lineHeight: 20,
  },
  insightDescBold: {
    color: '#34C759',
    fontWeight: 'bold',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingHorizontal: 20,
    gap: 10,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowLiva: {
    justifyContent: 'flex-start',
  },
  messageAvatarMock: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#34C759',
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  messageBubbleLiva: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f2f2f7',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    width: '100%',
  },
  messageTextUser: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  messageGreeting: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  messageTextLiva: {
    color: '#000',
    fontSize: 15,
    lineHeight: 22,
  },
  messageMotivation: {
    color: '#000',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    marginTop: 8,
  },
  timestampWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 4,
    width: '100%',
  },
  timestamp: {
    fontSize: 9,
    fontWeight: '600',
    color: '#8e8e93',
  },
  checkmark: {
    fontSize: 10,
    color: '#34C759',
  },
  promptsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  promptsContent: {
    gap: 8,
  },
  promptButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f2f2f7',
  },
  promptText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faf8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#f2f2f7',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  actionButton: {
    padding: 4,
  },
});
