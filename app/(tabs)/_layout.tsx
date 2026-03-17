import { Tabs, useRouter, Redirect } from 'expo-router';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { COLORS } from '../../src/theme';
import BuddyFAB from '../../src/components/BuddyFAB';
import BuddyModal from '../../src/components/BuddyModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useModeTheme } from '../../src/hooks/useModeTheme';

function TabBarIcon({ name, focused }: { name: any; focused: boolean }) {
  const { state } = useApp();
  const modeTheme = useModeTheme();
  const modeColor = modeTheme.primary;
  return (
    <Ionicons
      name={name}
      size={26}
      color={focused ? modeColor : COLORS.textMuted}
    />
  );
}

export default function TabLayout() {
  const { state } = useApp();
  const insets = useSafeAreaInsets();
  const modeConfig = useModeTheme();

  if (!state.isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: modeConfig.headerBg,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontFamily: 'Lora_600SemiBold',
            color: COLORS.textPrimary,
            fontSize: 24,
            letterSpacing: -0.5,
          },
          headerTitle: 'Instagram',
          headerRight: () => (
            <TouchableOpacity className="mr-4 w-10 h-10 rounded-full bg-surfaceElevated border-1 border-borderLight items-center justify-center">
              <Ionicons name="notifications-outline" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.borderLight,
            borderTopWidth: 1,
            height: 65 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: modeConfig.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: {
            fontFamily: 'SpaceGrotesk_500Medium',
            fontSize: 10,
            marginTop: 4,
          },
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="reels"
          options={{
            title: 'Reels',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name={focused ? 'play' : 'play-outline'} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name={focused ? 'chatbox' : 'chatbox-outline'} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name={focused ? 'search' : 'search-outline'} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Sage',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} focused={focused} />
            ),
          }}
        />
      </Tabs>
      <BuddyFAB />
      <BuddyModal />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 12,
  },
});
