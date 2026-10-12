import { useAppStore } from '../store/useAppStore';
import React, { useState } from 'react';
import { View, useColorScheme, StyleSheet, Pressable, Text as RNText, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenShell from '../components/layout/ScreenShell';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function ProfileHelpScreen() {
  const appTheme = useAppStore(s => s.appTheme);
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark' || (appTheme === 'system' && colorScheme === 'dark');
  const styles = React.useMemo(() => getStyles(isDark), [isDark]);

  const router = useRouter();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How accurate is Liva's meal recognition?",
      a: 'Liva uses state-of-the-art vision networks trained on millions of dietary elements, averaging 94-96% macro estimation accuracy.',
    },
    {
      q: 'Can I connect my Apple Watch?',
      a: 'Yes, go to Connected Devices under your Profile to sync calorie forecasts with workout stats.',
    },
  ];

  return (
    <View style={styles.container}>
      <ScreenShell
        title="Help & Support FAQs"
        subtitle="Find quick fixes or contact the developers."
        onBack={() => router.back()}
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
            
            {faqs.map((faq, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.faqItem, 
                  idx === faqs.length - 1 && styles.faqItemLast
                ]}
              >
                <Pressable
                  onPress={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  style={styles.faqHeader}
                >
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  <Text style={styles.faqIcon}>
                    {expandedFaq === idx ? '−' : '+'}
                  </Text>
                </Pressable>
                
                {expandedFaq === idx && (
                  <Text style={styles.faqAnswer}>
                    {faq.a}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>REPORT BUG OR SUGGEST FEATURE</Text>
            
            <TextInput
              style={styles.textArea}
              placeholder="Type your feedback details..."
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              multiline
              textAlignVertical="top"
            />
            
            <Pressable style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit Support Request</Text>
            </Pressable>
          </View>
        </View>
      </ScreenShell>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: { 
    width: '100%', 
    maxWidth: 480, 
    alignSelf: 'center', 
    height: '100%', 
    flex: 1, 
    backgroundColor: isDark ? '#0f172a' : '#ffffff' 
  },
  content: { 
    paddingBottom: 32, 
    gap: 16 
  },
  card: { 
    borderRadius: 24, 
    backgroundColor: isDark ? '#1e293b' : '#fff', 
    padding: 20, 
    borderWidth: 1, 
    borderColor: isDark ? '#334155' : '#f1f5f9', 
    shadowColor: isDark ? '#000' : '#10201a', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.03, 
    shadowRadius: 18, 
    elevation: 2 
  },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: isDark ? '#94a3b8' : '#64748b', 
    textTransform: 'uppercase', 
    letterSpacing: 0.5, 
    marginBottom: 12 
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#334155' : '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 12,
  },
  faqItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 12,
    fontWeight: 'bold',
    color: isDark ? '#f8fafc' : '#0f172a',
    flex: 1,
    paddingRight: 16,
  },
  faqIcon: {
    fontSize: 14,
    color: isDark ? '#94a3b8' : '#64748b',
    fontWeight: 'bold',
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: isDark ? '#94a3b8' : '#64748b',
    fontWeight: '600',
  },
  textArea: {
    width: '100%',
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    padding: 14,
    borderRadius: 12,
    fontSize: 12,
    color: isDark ? '#f8fafc' : '#0f172a',
    minHeight: 80,
    marginBottom: 12,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#34c759',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
