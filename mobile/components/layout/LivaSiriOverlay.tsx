import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Animated, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import LivaAvatar from './LivaAvatar';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';

export default function LivaSiriOverlay({
  text,
  notification,
  onClose,
  cueCard,
}: {
  text: string;
  notification?: string | null;
  onClose: () => void;
  cueCard?: React.ReactNode;
}) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const notifFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(rotateAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
      Animated.timing(rotateAnim, { toValue: 0, duration: 2500, useNativeDriver: true })
    ])).start();
  }, []);

  useEffect(() => {
    if (notification) {
      Animated.timing(notifFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      notifFade.setValue(0);
    }
  }, [notification]);

  const handleClose = () => {
    Animated.timing(slideAnim, { toValue: 400, duration: 200, useNativeDriver: true }).start(() => onClose());
  };

  const rotation = rotateAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '5deg', '-5deg'] });

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        {Platform.OS === 'web' ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.16)', backdropFilter: 'blur(2px)' } as any]} />
        ) : (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        )}
      </Pressable>

      {cueCard && (
        <Animated.View style={[styles.cueCardWrapper, { transform: [{ translateY: slideAnim }] }]}>
          {cueCard}
        </Animated.View>
      )}

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <LivaAvatar size={74} floating={true} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>LIVA ASSISTANT</Text>
          <Text style={styles.text}>{text}</Text>
        </View>

        <View style={styles.waveContainer}>
          <Animated.View style={[styles.waveOuter, { transform: [{ scale: pulseAnim }, { rotate: rotation }] }]}>
             <LinearGradient colors={['#2dd4bf', '#a855f7', '#f472b6', '#34C759']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          </Animated.View>
          <Animated.View style={[styles.waveInner, { transform: [{ scale: pulseAnim }] }]}>
             <LinearGradient colors={['#38bdf8', '#34C759', '#fcd34d']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          </Animated.View>
          
          {notification && (
            <Animated.View style={[styles.notificationPill, { opacity: notifFade }]}>
              <Check size={14} color="#34C759" />
              <Text style={styles.notificationText}>{notification}</Text>
            </Animated.View>
          )}
        </View>

        <Pressable style={styles.dismissBtn} onPress={handleClose}>
          <Text style={styles.dismissText}>DISMISS LIVA</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 999, justifyContent: 'flex-end', elevation: 10 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: Platform.OS === 'web' ? 'transparent' : 'rgba(0,0,0,0.16)' },
  sheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  textContainer: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  title: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 4 },
  text: { fontSize: 14, fontWeight: 'bold', color: '#10201a', textAlign: 'center' },
  waveContainer: { width: '100%', height: 48, alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 20 },
  waveOuter: { width: 224, height: 48, borderRadius: 24, position: 'absolute', opacity: 0.85, ...(Platform.OS === 'web' ? { filter: 'blur(16px)' } : {}) as any },
  waveInner: { width: 192, height: 32, borderRadius: 16, position: 'absolute', opacity: 0.6, ...(Platform.OS === 'web' ? { filter: 'blur(8px)' } : {}) as any },
  notificationPill: { position: 'absolute', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10201a', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, zIndex: 10 },
  notificationText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
  dismissBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  dismissText: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5 },
  cueCardWrapper: { width: '100%', paddingHorizontal: 16, paddingBottom: 16, zIndex: 10 },
});
