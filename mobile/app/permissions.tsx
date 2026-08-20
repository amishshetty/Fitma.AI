import React, { useState } from 'react';
import { View, StyleSheet, Text as RNText, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Mic, Bell, Check } from 'lucide-react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import ProgressDots from '../components/ui/ProgressDots';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function PermissionsScreen() {
  const router = useRouter();
  const [granted, setGranted] = useState<Set<number>>(new Set());

  const permissions = [
    {
      title: 'Camera',
      description: 'Snap your meal and Liva identifies nutrition instantly.',
      icon: Camera,
      color: '#6366f1',
    },
    {
      title: 'Microphone',
      description: 'Voice logging takes just a few seconds.',
      icon: Mic,
      color: '#0ea5e9',
    },
    {
      title: 'Notifications',
      description: 'Meal reminders, hydration prompts, and weekly insights.',
      icon: Bell,
      color: '#f59e0b',
    },
  ];

  const handleToggle = (index: number) => {
    setGranted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleNext = () => {
    router.push('/onboarding-success');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Make Liva smarter for you</Text>
          <Text style={styles.headerSubtitle}>
            These permissions unlock the fastest experience.
          </Text>
        </View>

        <View style={styles.list}>
          {permissions.map((permission, index) => {
            const Icon = permission.icon;
            const active = granted.has(index);
            return (
              <Pressable
                key={permission.title}
                onPress={() => handleToggle(index)}
                style={[
                  styles.permissionItem,
                  {
                    borderColor: active ? permission.color : 'rgba(16,32,26,0.06)',
                  }
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${permission.color}16` }]}>
                  <Icon size={22} color={permission.color} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{permission.title}</Text>
                  <Text style={styles.description}>{permission.description}</Text>
                </View>
                <View style={[styles.checkbox, { backgroundColor: active ? permission.color : '#eef4f0' }]}>
                  {active && <Check size={15} color="white" />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton onPress={handleNext}>Continue</PrimaryButton>
        <SecondaryButton onPress={handleNext}>Skip</SecondaryButton>
        <ProgressDots total={5} current={4} />
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 32,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#64748b',
  },
  list: {
    gap: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    padding: 16,
  },
  iconContainer: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
  },
  checkbox: {
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 8,
    gap: 12,
  },
});
