import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Construction } from 'lucide-react-native';

export default function MissingScreen() {
  const router = useRouter();
  const { missing } = useLocalSearchParams();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#10201a" />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Construction size={48} color="#34C759" />
        </View>
        <Text style={styles.title}>Under Construction</Text>
        <Text style={styles.subtitle}>
          The screen <Text style={styles.path}>/{Array.isArray(missing) ? missing.join('/') : missing}</Text> is currently being developed and will be available in the next deployment.
        </Text>
        
        <Pressable onPress={() => router.push('/(tabs)/home')} style={styles.button}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f2faf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10201a',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  path: {
    fontWeight: 'bold',
    color: '#10201a',
  },
  button: {
    backgroundColor: '#34C759',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: 'rgba(52, 199, 89, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
