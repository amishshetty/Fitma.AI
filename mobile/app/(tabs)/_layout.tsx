import { Tabs } from 'expo-router';
import { Home, Calendar, Sparkles, Target, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#34C759',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="my-plan"
        options={{
          title: 'My Plan',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="liva-home"
        options={{
          title: 'Liva',
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="progress-dashboard"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => <Target color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="profile-home"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={20} />,
        }}
      />
    </Tabs>
  );
}
