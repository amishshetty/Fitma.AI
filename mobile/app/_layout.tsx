import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#ffffff' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="meet-liva" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="onboarding-success" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
