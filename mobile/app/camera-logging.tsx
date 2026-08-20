import React from 'react';
import { View, StyleSheet, Pressable, Text as RNText } from 'react-native';
import { ArrowLeft, Utensils, Flashlight, Image as ImageIcon } from 'lucide-react-native';
import IconButton from '../components/ui/IconButton';
import SecondaryButton from '../components/ui/SecondaryButton';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function CameraLoggingScreen({
  onBack,
  onCapture,
}: any) {
  return (
    <View style={[styles.container, { backgroundColor: '#10201a' }]}>
      <View style={styles.header}>
        <IconButton onClick={onBack} label="Back">
          <ArrowLeft size={19} color="#ffffff" />
        </IconButton>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Take a clear photo.</Text>
          <Text style={styles.subtitle}>Center the plate inside the guide.</Text>
        </View>
      </View>

      <View style={styles.cameraPreview}>
        <View style={styles.guideBox} />
        <View style={styles.guideCircle} />
        <Utensils size={76} color="rgba(255,255,255,0.62)" />
      </View>

      <View style={styles.footer}>
        <SecondaryButton icon={<ImageIcon size={18} color="#ffffff" />} onClick={() => {}}>
          Gallery
        </SecondaryButton>
        <View style={styles.captureButtonOuter}>
          <Pressable style={styles.captureButtonInner} onPress={() => onCapture?.('dummy-base64')} />
        </View>
        <SecondaryButton icon={<Flashlight size={18} color="#ffffff" />} onClick={() => {}}>
          Flash
        </SecondaryButton>
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
    backgroundColor: '#ffffff'
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10201a',
  },
  guideBox: {
    position: 'absolute',
    height: 288,
    width: 288,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.72)',
  },
  guideCircle: {
    position: 'absolute',
    height: 224,
    width: 224,
    borderRadius: 112,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(52,199,89,0.8)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  captureButtonOuter: {
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: '#10201a',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  captureButtonInner: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#34C759',
  }
});
