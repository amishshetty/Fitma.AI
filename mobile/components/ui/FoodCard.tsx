import React from 'react';
import { View, Pressable, Text as RNText, StyleSheet } from 'react-native';
import { Utensils, Plus } from 'lucide-react-native';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function FoodCard({
  name,
  calories,
  protein,
  serving,
  onAdd,
}: {
  name: string;
  calories: number;
  protein: number;
  serving: string;
  onAdd?: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Utensils size={24} color="#34C759" />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.details}>{calories} kcal - {protein}g protein</Text>
        <Text style={styles.serving}>{serving}</Text>
      </View>
      
      <Pressable
        onPress={onAdd}
        style={styles.addButton}
        accessibilityLabel={`Add ${name}`}
      >
        <Plus size={19} color="#ffffff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: 'rgba(0,0,0,0.02)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  iconContainer: {
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10201A',
  },
  details: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
  },
  serving: {
    fontSize: 12,
    color: '#64748b',
  },
  addButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#34C759',
  },
});
