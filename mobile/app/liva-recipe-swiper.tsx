import React, { useState } from 'react';
import { View, StyleSheet, Text as RNText, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import ScreenShell from '../components/layout/ScreenShell';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function LivaRecipeSwiperScreen() {
  const router = useRouter();

  const recipes = [
    {
      id: 1,
      title: 'High-Protein Lentil Wrap',
      kcal: 340,
      macro: '18g Protein',
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    },
    {
      id: 2,
      title: 'Lemon Herb Quinoa Salad',
      kcal: 290,
      macro: '11g Protein',
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    },
    {
      id: 3,
      title: 'Greek Yogurt Berry Bowl',
      kcal: 210,
      macro: '16g Protein',
      img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    },
  ];

  const [index, setIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  const handleSwipe = (like: boolean) => {
    if (like) setSavedCount((c) => c + 1);
    setIndex((i) => i + 1);
  };

  const isDeckEmpty = index >= recipes.length;

  return (
    <View style={styles.root}>
      <ScreenShell
        title="Recipe Swiper"
        subtitle="Discover healthy quick meals. Swipe left to skip, right to save."
        onBack={() => router.back()}
      >
        <View style={styles.contentContainer}>
          {!isDeckEmpty ? (
            <View style={styles.cardContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: recipes[index].img }}
                  style={styles.image}
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.recipeTitle}>{recipes[index].title}</Text>
                <View style={styles.macrosRow}>
                  <Text style={styles.macroText}>🔥 {recipes[index].kcal} kcal</Text>
                  <Text style={styles.macroText}>🥚 {recipes[index].macro}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.skipButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => handleSwipe(false)}
                  >
                    <Text style={styles.skipText}>Skip</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.saveButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => handleSwipe(true)}
                  >
                    <Text style={styles.saveText}>Save Recipe</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.checkIconContainer}>
                <Check size={36} color="#34C759" />
              </View>
              <View style={styles.emptyStateTextContainer}>
                <Text style={styles.emptyStateTitle}>Swipe Deck Complete</Text>
                <Text style={styles.emptyStateSubtitle}>
                  You saved{' '}
                  <Text style={styles.highlightText}>{savedCount} recipes</Text>{' '}
                  to your favorite vault!
                </Text>
              </View>
              <View style={styles.returnButtonWrapper}>
                <PrimaryButton onPress={() => router.push('/')}>
                  Return to Dashboard
                </PrimaryButton>
              </View>
            </View>
          )}
        </View>
      </ScreenShell>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    borderColor: 'rgba(52, 199, 89, 0.16)',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: 'rgba(16, 32, 26, 0.06)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 5,
  },
  imageWrapper: {
    height: 192,
    width: '100%',
    backgroundColor: '#f1f5f9',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  macrosRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  macroText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  actionRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 12,
  },
  skipButton: {
    height: 48,
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  skipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
  },
  saveButton: {
    height: 48,
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#34C759',
  },
  saveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    width: '100%',
  },
  checkIconContainer: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#ecfbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTextContainer: {
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  emptyStateSubtitle: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#34C759',
  },
  returnButtonWrapper: {
    marginTop: 24,
    width: '100%',
    maxWidth: 280,
  },
});
