import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text as RNText, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Check } from 'lucide-react-native';
import PrimaryButton from '../components/ui/PrimaryButton';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function OnboardingSuccessScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 40,
    }).start();
  }, [scaleAnim]);

  const handleFinish = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Check size={62} color="white" />
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>You're all set.</Text>
          <Text style={styles.subtitle}>
            Liva is ready to help you log your first meal in under 15 seconds.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton onPress={handleFinish} icon={<ChevronRight size={19} color="white" />}>
          Go to Home
        </PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    gap: 32,
  },
  iconCircle: {
    height: 128,
    width: 128,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 64,
    backgroundColor: '#34C759',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#64748b',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 8,
  },
});
