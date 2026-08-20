import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image, Text as RNText, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function LivaRecommendationsScreen() {
  const router = useRouter();

  const recommendations = [
    {
      id: 1,
      title: 'Gourmet Quinoa Bowl',
      calories: 460,
      protein: '32g',
      prepTime: '20 min',
      score: 95,
      // Use a dummy image source for now
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      description: 'Quinoa loaded with grilled chicken breast, avocado, and spinach.',
    },
    {
      id: 2,
      title: 'Herb Grilled Salmon',
      calories: 520,
      protein: '38g',
      prepTime: '15 min',
      score: 92,
      image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400',
      description: 'Rich salmon fillet served with lemon broccoli slices.',
    },
    {
      id: 3,
      title: 'Sautéed Paneer Salad',
      calories: 390,
      protein: '18g',
      prepTime: '12 min',
      score: 89,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      description: 'Low-carb warm paneer tossed with bell peppers and microgreens.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header / ScreenShell equivalent */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={20} color="#000" />
          </Pressable>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Dinner Suggestions</Text>
            <Text style={styles.subtitle}>Personalized dinner ideas matching your protein target.</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {recommendations.map((rec) => (
            <View key={rec.id} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: rec.image }} style={styles.image} />
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>★ {rec.score} Score</Text>
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{rec.title}</Text>
                <Text style={styles.cardDesc}>{rec.description}</Text>

                <View style={styles.statsRow}>
                  <Text style={styles.statText}>🔥 {rec.calories} kcal</Text>
                  <Text style={styles.statText}>💪 {rec.protein} Prot</Text>
                  <Text style={styles.statText}>⏱ {rec.prepTime}</Text>
                </View>

                <Pressable 
                  style={styles.viewButton}
                  onPress={() => router.push('/liva-recipe-detail')}
                >
                  <Text style={styles.viewButtonText}>View Recipe</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTextContainer: {},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8e8e93',
    lineHeight: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    borderRadius: 26,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.1)',
    overflow: 'hidden',
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 16,
  },
  imageContainer: {
    height: 128,
    width: '100%',
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scoreBadge: {
    position: 'absolute',
    right: 14,
    top: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#197a38',
  },
  cardContent: {
    padding: 18,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  cardDesc: {
    marginTop: 4,
    fontSize: 12,
    color: '#8e8e93',
    lineHeight: 18,
  },
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(52,199,89,0.06)',
    paddingTop: 14,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8e8e93',
  },
  viewButton: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#ecfbf1',
    paddingVertical: 10,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34C759',
  },
});
