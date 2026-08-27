import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text as RNText, ActivityIndicator, Alert, Image, ScrollView } from 'react-native';
import { ArrowLeft, Utensils, Flashlight, Image as ImageIcon, Camera as CameraIcon, Activity, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { parseImageLog } from '../utils/ai';
import { useAppStore } from '../store/useAppStore';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

export default function CameraLoggingScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [pendingInternalMeal, setPendingInternalMeal] = useState<any>(null);
  const logMeal = useAppStore(state => state.logMeal);

  const processImage = async (uri: string, base64: string) => {
    setImageUri(uri);
    setIsParsing(true);
    try {
      const parsed = await parseImageLog(base64, 'image/jpeg');
      setPendingInternalMeal(parsed);
    } catch (error) {
      Alert.alert("Oops", "Couldn't identify the meal in that photo.");
      setImageUri(null);
    } finally {
      setIsParsing(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true
    });

    if (!result.canceled && result.assets[0].base64) {
      processImage(result.assets[0].uri, result.assets[0].base64);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true
    });

    if (!result.canceled && result.assets[0].base64) {
      processImage(result.assets[0].uri, result.assets[0].base64);
    }
  };

  const handleSelectMealType = (type: string) => {
    if (pendingInternalMeal) {
      logMeal({
        name: pendingInternalMeal.name,
        calories: pendingInternalMeal.calories,
        protein: pendingInternalMeal.protein,
        mealType: type,
        imageUrl: imageUri
      });
    }
    setPendingInternalMeal(null);
    router.replace('/(tabs)/home');
  };

  if (imageUri || isParsing) {
    return (
      <View style={[styles.container, { backgroundColor: '#F3F4F6' }]}>
        <View style={styles.previewHeader}>
           <Pressable onPress={() => { setImageUri(null); setPendingInternalMeal(null); }} style={styles.backBtn}>
              <ArrowLeft size={24} color="#111827" />
           </Pressable>
           <Text style={styles.previewTitle}>Review Meal</Text>
           <View style={{ width: 24 }} />
        </View>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.capturedImage} />}
        
        <View style={styles.bottomDrawer}>
          {isParsing ? (
             <View style={styles.analyzingState}>
               <ActivityIndicator color="#34C759" size="large" />
               <Text style={styles.analyzingTitle}>AI is analyzing your meal...</Text>
               <Text style={styles.analyzingSub}>Looking for ingredients and estimating portions</Text>
             </View>
          ) : pendingInternalMeal ? (
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
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#10201a' }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft size={24} color="#ffffff" />
        </Pressable>
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
        <Pressable style={styles.footerBtn} onPress={pickImage}>
          <ImageIcon size={24} color="#ffffff" />
          <Text style={styles.footerBtnText}>Gallery</Text>
        </Pressable>
        <View style={styles.captureButtonOuter}>
          <Pressable style={styles.captureButtonInner} onPress={takePhoto} />
        </View>
        <View style={{ width: 60 }} />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 24,
    gap: 16,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 4,
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideBox: {
    position: 'absolute',
    width: '80%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 32,
    borderStyle: 'dashed',
  },
  guideCircle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 24,
  },
  footerBtn: {
    alignItems: 'center',
    gap: 8,
    width: 60,
  },
  footerBtnText: {
    color: '#fff',
    fontSize: 12,
  },
  captureButtonOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#34C759',
  }
});
