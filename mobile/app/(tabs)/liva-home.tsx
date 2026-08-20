import React, { useState, useEffect, useRef } from 'react';
import { green, muted, softGreen, ink } from '../../constants';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Text as RNText, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ArrowRight, BarChart2, PieChart, Sparkles, UtensilsCrossed, Soup, Droplets, Trash2, ChevronLeft, Send, Camera, Keyboard, Mic } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import LivaAvatar from '../../components/layout/LivaAvatar';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

const green = '#34C759';

export default function LivaHomeScreen() {
  const router = useRouter();
  const userName = 'Amish'; // Defaulted
  const remainingCalories = 1800;
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  const handleSendText = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'liva',
          text: "I'm here for you! Try asking me something about nutrition or log a meal.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1500);
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
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Message Liva..."
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
                <Send size={18} color="#ffffff" />
              </Pressable>
            </View>
            <View style={styles.inputActions}>
              <Pressable style={styles.actionButton}>
                <Mic size={22} color="#8e8e93" />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Camera size={22} color="#8e8e93" />
              </Pressable>
            </View>
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
  root: {
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
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
    backgroundColor: '#f8fafc',
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
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
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
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  insightBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  chatTimeBadgeWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chatTimeBadge: {
    backgroundColor: '#f8fafc',
    color: '#64748b',
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
    backgroundColor: '#34C759',
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  messageBubbleLiva: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  messageTextLiva: {
    color: '#0f172a',
    fontSize: 14,
    lineHeight: 20,
  },
  messageMotivation: {
    color: '#0f172a',
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
    color: '#34C759',
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  inputContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    fontSize: 15,
    fontWeight: '500',
    color: '#0f172a',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
    paddingHorizontal: 8,
  },
  actionButton: {
    padding: 4,
  },
});

