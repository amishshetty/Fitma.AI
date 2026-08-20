import React, { useEffect, useRef } from "react";
import { View, Text as RNText, Pressable, StyleSheet, Animated, Easing } from "react-native";
import { router } from "expo-router";
import { Apple } from "lucide-react-native";
import Svg, { Circle, Path, Ellipse, Line } from "react-native-svg";

// Fix for Android squashed text
const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

function ProgressDots({ total = 5, current = 0 }) {
  return (
    <View style={styles.progressContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              width: index === current ? 22 : 7,
              backgroundColor: index === current ? '#34C759' : '#cfebd8',
            }
          ]}
        />
      ))}
    </View>
  );
}

function LivaAvatarFloating() {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -6,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateY]);

  const size = 52;
  const svgSize = Math.round(size * 0.62);

  return (
    <Animated.View style={[styles.avatarContainer, { transform: [{ translateY }] }]}>
      <Svg width={svgSize} height={svgSize} viewBox="0 0 80 80" fill="none">
        <Circle cx="40" cy="44" r="30" fill="#f0fdf4" />
        <Circle cx="40" cy="44" r="29" stroke="#d8f3df" strokeWidth="2" />
        <Circle cx="31" cy="40" r="5" fill="#0f1f1a" />
        <Circle cx="49" cy="40" r="5" fill="#0f1f1a" />
        <Circle cx="33" cy="38" r="2" fill="white" />
        <Circle cx="51" cy="38" r="2" fill="white" />
        <Path d="M32 51Q40 60 48 51" stroke="#0f1f1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <Ellipse cx="26" cy="52" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.48" />
        <Ellipse cx="54" cy="52" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.48" />
        <Line x1="40" y1="14" x2="40" y2="24" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" />
        <Circle cx="40" cy="11" r="5" fill="#34C759" />
        <Circle cx="40" cy="11" r="2.5" fill="#22c55e" />
      </Svg>
    </Animated.View>
  );
}

function MainAnimation() {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -8,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateY]);

  return (
    <View style={styles.imageContainer}>
      {/* Background circle */}
      <View style={styles.circleBg} />
      
      <Animated.View style={[styles.mainAnimatedContainer, { transform: [{ translateY }] }]}>
        <View style={styles.card}>
           <View style={styles.iconContainer}>
              <Apple size={64} color="#34C759" />
           </View>
        </View>
        
        {/* Floating Avatar overlay */}
        <View style={styles.avatarOverlay}>
          <LivaAvatarFloating />
        </View>
      </Animated.View>
    </View>
  );
}

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        
        <MainAnimation />
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Healthy eating should be effortless.
          </Text>
          <Text style={styles.subtitle}>
            Meet Liva, your AI companion that helps you log meals in seconds and
            understand your nutrition calmly.
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </Pressable>
          <Pressable 
            style={styles.secondaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
          </Pressable>
        </View>
        <ProgressDots total={5} current={0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 64,
    // Web constraints to simulate mobile screen
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
  },
  imageContainer: {
    alignItems: 'center',
    position: 'relative',
    height: 250,
    justifyContent: 'center',
  },
  circleBg: {
    position: 'absolute',
    top: 24,
    left: '50%',
    transform: [{ translateX: -112 }],
    height: 224,
    width: 224,
    borderRadius: 112,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  mainAnimatedContainer: {
    position: 'relative',
  },
  card: {
    height: 160,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    backgroundColor: '#ffffff',
    elevation: 12,
    shadowColor: 'rgba(16,32,26,0.5)',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
  },
  iconContainer: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#EEFAF2', // softGreen
    overflow: 'hidden',
  },
  avatarOverlay: {
    position: 'absolute',
    right: -12,
    top: -12,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    width: 52,
    height: 52,
    backgroundColor: '#ffffff',
    elevation: 8,
    shadowColor: 'rgba(52, 199, 89, 0.5)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 13,
  },
  textContainer: {
    marginTop: 32,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10201A',
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    color: '#6d8779',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 8,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#34C759',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(52,199,89,0.34)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.14)',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#6d8779',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
