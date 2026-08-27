import { useEffect } from 'react';
import { useColorScheme, View, StyleSheet, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, db } from '../firebase';
import { useAppStore } from '../store/useAppStore';

export default function RootLayout() {
  const router = useRouter();
  const setProfile = useAppStore(s => s.setProfile);
  const login = useAppStore(s => s.login);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bg = isDark ? '#0f172a' : '#EAF8F1';

  // Inject viewport meta on web so mobile browsers render at correct scale
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      let meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        (meta as any).name = 'viewport';
        document.head.appendChild(meta);
      }
      (meta as any).content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';

      // Center the app body and set background
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.backgroundColor = bg;
      document.body.style.display = 'flex';
      document.body.style.justifyContent = 'center';
      document.body.style.minHeight = '100vh';

      // Inject global font override for web
      const styleId = 'fitma-fonts';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap");
          * {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [bg]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from RTDB
        const snapshot = await get(ref(db, `users/${user.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          
          let parsedMeals = data.meals || [];
          if (parsedMeals && !Array.isArray(parsedMeals)) {
            parsedMeals = Object.values(parsedMeals);
          }

          login(data.name || data.username || 'User');
          setProfile({
            name: data.name || data.username,
            goals: data.goals,
            calories: data.calories || 0,
            protein: data.protein || 0,
            water: data.water || 0,
            meals: parsedMeals,
            history: data.history || {}
          });
        } else {
          login('User');
        }
        router.replace('/(tabs)/home');
      } else {
        router.replace('/login');
      }
    });
    return unsub;
  }, []);

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View style={[styles.mobileShell, { backgroundColor: bg }]}>
        <Stack screenOptions={{ 
          headerShown: false, 
          contentStyle: { backgroundColor: 'transparent' } 
        }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="meet-liva" />
          <Stack.Screen name="goals" />
          <Stack.Screen name="permissions" />
          <Stack.Screen name="onboarding-success" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  mobileShell: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    overflow: 'hidden',
    // On web, add a subtle phone shadow so it looks like a device frame
    ...Platform.select({
      web: {
        boxShadow: '0 0 60px rgba(0,0,0,0.08)',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
      } as any,
      default: {},
    }),
  },
});
