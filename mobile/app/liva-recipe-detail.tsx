import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image, Text as RNText, SafeAreaView } from 'react-native';
import { ArrowLeft, Mic } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function LivaRecipeDetailScreen() {
  const router = useRouter();
  const [companionActive, setCompanionActive] = useState(false);
  const [cookingStep, setCookingStep] = useState(0);

  const ingredients = [
    '150g Organic Quinoa',
    '120g Chicken Breast (or Paneer)',
    'Half Avocado sliced',
    '1 Soft-boiled egg',
    'Handful of Cherry Tomatoes',
    'Tablespoon of Olive oil',
  ];

  const cookingSteps = [
    'Step 1: Thoroughly rinse 150g of organic quinoa in cold water to remove any bitter coating.',
    'Step 2: Boil the quinoa in 300ml of water for approximately 12 minutes until fluffy.',
    'Step 3: Grill the chicken breast on medium heat for 6 minutes each side with olive oil and spices.',
    'Step 4: Slice the avocado, tomatoes, and egg, then combine with warm quinoa in a serving bowl.',
  ];

  const handleNextStep = () => {
    if (cookingStep < cookingSteps.length - 1) {
      setCookingStep((s) => s + 1);
    } else {
      setCompanionActive(false);
      setCookingStep(0);
      router.back();
    }
  };

  const handleSave = () => {
    router.back();
  };

  if (companionActive) {
    return (
      <SafeAreaView style={styles.companionSafeArea}>
        <View style={styles.companionContainer}>
          <View style={styles.companionHeader}>
            <View style={styles.companionActiveBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.companionActiveText}>COOKING COMPANION ACTIVE</Text>
            </View>
            <Pressable onPress={() => setCompanionActive(false)}>
              <Text style={styles.exitText}>Exit</Text>
            </Pressable>
          </View>

          <View style={styles.companionContent}>
            <Text style={styles.stepIndicator}>
              STEP {cookingStep + 1} OF {cookingSteps.length}
            </Text>
            <Text style={styles.stepInstruction}>
              {cookingSteps[cookingStep]}
            </Text>

            <View style={styles.voiceControlCard}>
              <View style={styles.voiceControlTextContainer}>
                <Text style={styles.voiceControlLabel}>VOICE CONTROL</Text>
                <Text style={styles.voiceControlDesc}>
                  Say <Text style={styles.voiceControlHighlight}>"Next step"</Text> to advance hands-free.
                </Text>
              </View>
              <Pressable onPress={handleNextStep} style={styles.micButton}>
                <Mic size={16} color="#ffffff" />
              </Pressable>
            </View>
          </View>

          <View style={styles.companionFooter}>
            <PrimaryButton onPress={handleNextStep}>
              {cookingStep < cookingSteps.length - 1 ? 'Next Step' : 'Complete & Save Recipe'}
            </PrimaryButton>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' }} 
          style={styles.heroImage} 
        />
        <View style={styles.heroGradient} />

        <SafeAreaView style={styles.heroSafeArea}>
          <Pressable onPress={() => router.back()} style={styles.backButtonAbsolute}>
            <ArrowLeft size={19} color="#000" />
          </Pressable>
        </SafeAreaView>

        <View style={styles.heroContent}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>LIVA COMPANION PICK</Text>
          </View>
          <Text style={styles.heroTitle}>Gourmet Quinoa Bowl</Text>
        </View>
      </View>

      <ScrollView style={styles.detailsContainer} contentContainerStyle={styles.detailsContent}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statValue}>460</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Protein</Text>
            <Text style={[styles.statValue, { color: '#34C759' }]}>32g</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Carbs</Text>
            <Text style={styles.statValue}>45g</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Prep Time</Text>
            <Text style={styles.statValue}>20m</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients Needed</Text>
          <View style={styles.ingredientsList}>
            {ingredients.map((item, idx) => (
              <View key={idx} style={styles.ingredientItem}>
                <View style={styles.checkCircle}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <Text style={styles.ingredientText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.chefTipCard}>
          <Text style={styles.chefTipLabel}>LIVA'S CHEF TIP</Text>
          <Text style={styles.chefTipText}>
            Rinse quinoa in cold water before boiling to remove saponin coating. Grill the chicken with a pinch of black pepper and lemon zest.
          </Text>
        </View>
      </ScrollView>

      <SafeAreaView style={styles.footerSafeArea}>
        <View style={styles.footer}>
          <View style={{ marginBottom: 12 }}>
            <PrimaryButton onPress={() => setCompanionActive(true)}>
              Start Cooking Companion Mode
            </PrimaryButton>
          </View>
          <SecondaryButton onPress={handleSave}>
            Save to Cook Vault
          </SecondaryButton>
        </View>
      </SafeAreaView>
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
  heroContainer: {
    height: 240,
    width: '100%',
    position: 'relative',
    backgroundColor: '#e2e8f0',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', // Simplified gradient
  },
  heroSafeArea: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 0,
    zIndex: 10,
  },
  backButtonAbsolute: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    right: 24,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#34C759',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  heroTitle: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  detailsContainer: {
    flex: 1,
  },
  detailsContent: {
    padding: 24,
    gap: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#f2faf5',
    padding: 12,
    borderRadius: 16,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8e8e93',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {},
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 8,
    color: '#34C759',
    fontWeight: 'bold',
  },
  ingredientText: {
    fontSize: 12,
    color: '#8e8e93',
  },
  chefTipCard: {
    backgroundColor: '#eefaf2',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.16)',
  },
  chefTipLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#197a38',
    marginBottom: 4,
  },
  chefTipText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#8e8e93',
  },
  footerSafeArea: {
    backgroundColor: '#ffffff',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  // Companion Mode Styles
  companionSafeArea: {
    flex: 1,
    backgroundColor: '#10201a',
  },
  companionContainer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: '#10201a',
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  companionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 24,
  },
  companionActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34c759',
  },
  companionActiveText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6d8779',
    letterSpacing: 1,
  },
  exitText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f43f5e',
  },
  companionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 320,
    alignSelf: 'center',
    width: '100%',
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
    marginBottom: 16,
    letterSpacing: 1,
  },
  stepInstruction: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 30,
  },
  voiceControlCard: {
    marginTop: 44,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  voiceControlTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  voiceControlLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  voiceControlDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  voiceControlHighlight: {
    color: '#34C759',
    fontWeight: 'bold',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companionFooter: {
    paddingTop: 24,
  },
});
