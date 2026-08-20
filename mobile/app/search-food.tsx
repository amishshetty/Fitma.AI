import React from 'react';
import { View, StyleSheet, TextInput, ScrollView, Text as RNText } from 'react-native';
import { Search } from 'lucide-react-native';
import FoodCard from '../components/ui/FoodCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import TagChip from '../components/ui/TagChip';
import ScreenShell from '../components/layout/ScreenShell';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function SearchFoodScreen({
  onBack,
  onContinue,
}: any) {
  return (
    <View style={styles.container}>
      <ScreenShell
        title="Search Food"
        subtitle="Add foods manually or pick from suggestions."
        onBack={onBack}
        footer={<PrimaryButton onClick={onContinue}>Continue</PrimaryButton>}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search paneer, rice, eggs..."
              placeholderTextColor="#94a3b8"
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.tagsContainer}>
              {['Paneer Paratha', 'Chicken', 'Dal Rice'].map((item) => (
                <TagChip key={item}>{item}</TagChip>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Foods</Text>
            <View style={styles.cardsContainer}>
              <FoodCard
                name="Paneer Paratha"
                calories={310}
                protein={12}
                serving="1 paratha"
              />
              <FoodCard
                name="Chicken Biryani"
                calories={520}
                protein={28}
                serving="1 plate"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Foods</Text>
            <View style={styles.cardsContainer}>
              <FoodCard
                name="Dal Rice"
                calories={390}
                protein={14}
                serving="1 bowl"
              />
              <FoodCard
                name="Oats Breakfast"
                calories={360}
                protein={16}
                serving="1 bowl"
              />
            </View>
          </View>
        </ScrollView>
      </ScreenShell>
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
  content: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#10201a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    padding: 0,
    fontFamily: 'sans-serif',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardsContainer: {
    gap: 12,
  }
});
