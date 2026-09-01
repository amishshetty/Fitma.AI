import React, { useState, useEffect } from 'react';
import { View, Text as RNText, StyleSheet, Pressable, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Activity, Check } from 'lucide-react-native';
import { parseMealLog } from '../utils/ai';
import { useAppStore } from '../store/useAppStore';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function TextLoggingScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [pendingInternalMeal, setPendingInternalMeal] = useState<any>(null);
  
  const logMeal = useAppStore(state => state.logMeal);

  const suggestions = [
    'Add 2 roti 2 egg in breakfast',
    'Had chicken and rice for lunch',
    'Ate 1 apple for snack',
  ];

  const handleParseAndSave = async () => {
    if (!text.trim()) return;
    setIsParsing(true);
    
    try {
      const parsed = await parseMealLog(text);
      setPendingInternalMeal(parsed);
    } catch (e) {
      Alert.alert("Oops", "Couldn't understand that meal. Try again!");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSelectMealType = (type: string) => {
    if (pendingInternalMeal) {
      logMeal({
        name: pendingInternalMeal.name,
        calories: pendingInternalMeal.calories,
        protein: pendingInternalMeal.protein,
        mealType: type,
        originalText: text
      });
    }
    setPendingInternalMeal(null);
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.root}>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      {/* Drawer */}
      <View style={styles.drawer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Smart Meal Log</Text>
            <Text style={styles.subtitle}>Type naturally. We'll extract the details.</Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <X size={20} color="#6d8779" />
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={(val) => {
              setText(val);
              setPendingInternalMeal(null);
            }}
            placeholder='"I had 2 rotis and 2 eggs for breakfast"'
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
          />
          <View style={styles.aiBadge}>
            <Activity size={14} color="#34C759" />
            <Text style={styles.aiBadgeText}>AI Powered</Text>
          </View>
        </View>

        {pendingInternalMeal && (
          <View style={styles.pendingContainer}>
            <View style={styles.parsedDataContainer}>
              <Text style={styles.parsedMealName}>{pendingInternalMeal.name}</Text>
              <View style={styles.parsedStats}>
                <View style={styles.parsedStatBox}>
                  <Text style={styles.parsedStatVal}>{pendingInternalMeal.calories} kcal</Text>
                  <Text style={styles.parsedStatLbl}>Calories</Text>
                </View>
                <View style={styles.parsedStatBox}>
                  <Text style={styles.parsedStatVal}>{pendingInternalMeal.protein}g</Text>
                  <Text style={styles.parsedStatLbl}>Protein</Text>
                </View>
              </View>
            </View>
            <View style={styles.pendingLabel}>
              <Text style={styles.pendingLabelText}>Which meal is this?</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mealTypes}>
              {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((section) => (
                <Pressable
                  key={section}
                  onPress={() => handleSelectMealType(section)}
                  style={[
                    styles.mealTypeBtn, 
                    pendingInternalMeal.mealType === section && { backgroundColor: '#34C759', borderColor: '#34C759' }
                  ]}
                >
                  <Text style={[
                    styles.mealTypeText,
                    pendingInternalMeal.mealType === section && { color: '#fff' }
                  ]}>{section}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsLabel}>Try these examples</Text>
          {suggestions.map((suggestion, i) => (
            <Pressable
              key={i}
              onPress={() => setText(suggestion)}
              style={styles.suggestionBtn}
            >
              <Text style={styles.suggestionText}>"{suggestion}"</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[styles.primaryBtn, (isParsing || !text.trim()) && styles.primaryBtnDisabled]}
          onPress={handleParseAndSave}
          disabled={isParsing || !text.trim()}
        >
          {isParsing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Check size={18} color="#fff" />
          )}
          <Text style={styles.primaryBtnText}>
            {isParsing ? 'Analyzing & Saving...' : 'Save Smart Meal'}
          </Text>
        </Pressable>
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
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10201a',
  },
  subtitle: {
    fontSize: 14,
    color: '#6d8779',
    marginTop: 4,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    minHeight: 128,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    fontSize: 16,
    color: '#10201a',
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  aiBadge: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52,199,89,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34C759',
  },
  pendingContainer: {
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
  },
  parsedDataContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  parsedMealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  parsedStats: {
    flexDirection: 'row',
    gap: 12,
  },
  parsedStatBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  parsedStatVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34C759',
  },
  parsedStatLbl: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  pendingLabel: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  pendingLabelText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10201a',
  },
  mealTypes: {
    gap: 8,
  },
  mealTypeBtn: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34C759',
  },
  suggestionsContainer: {
    marginBottom: 24,
  },
  suggestionsLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#6d8779',
    marginBottom: 12,
  },
  suggestionBtn: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#6d8779',
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
