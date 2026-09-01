import React from 'react';
import { View, Text as RNText, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function CameraMealSelectionScreen() {
  const router = useRouter();

  const meals = [
    { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { id: 'lunch', label: 'Lunch', icon: '🍱' },
    { id: 'snack', label: 'Snack', icon: '🍎' },
    { id: 'dinner', label: 'Dinner', icon: '🍲' },
  ];

  const handleSelect = (id: string) => {
    // In real app, proceed to the next step
    router.back();
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft size={20} color="#10201a" />
        </Pressable>
        <Text style={styles.title}>Select Meal</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' }}
            style={styles.image}
          />
        </View>

        <Text style={styles.heading}>Which meal is this?</Text>
        <Text style={styles.subheading}>Select a category for accurate tracking.</Text>

        <View style={styles.grid}>
          {meals.map((m) => (
            <Pressable
              key={m.id}
              style={({ pressed }) => [
                styles.mealBtn,
                pressed && styles.mealBtnPressed,
              ]}
              onPress={() => handleSelect(m.id)}
            >
              <Text style={styles.mealIcon}>{m.icon}</Text>
              <Text style={styles.mealLabel}>{m.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10201a',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  imageContainer: {
    width: 208,
    height: 208,
    borderRadius: 28,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10201a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6d8779',
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
  },
  mealBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  mealBtnPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#f8fafc',
  },
  mealIcon: {
    fontSize: 32,
  },
  mealLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#10201a',
  },
});
