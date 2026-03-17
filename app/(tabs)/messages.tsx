import React from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { COLORS } from '../../src/theme';
import { MOCK_CONVERSATIONS } from '../../src/data/conversations';
import { useModeTheme } from '../../src/hooks/useModeTheme';

export default function MessagesScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const modeTheme = useModeTheme();
  const modeColor = modeTheme.primary;

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 pb-2 gap-3">
        {/* Sage Insight Banner */}
        <TouchableOpacity 
          className="bg-brand/10 border-1 border-brand/20 p-4 rounded-3xl flex-row items-center justify-between"
          activeOpacity={0.8}
          onPress={() => {
            router.push('/(tabs)/profile');
            setTimeout(() => dispatch({ type: 'OPEN_BUDDY_WITH_CONTEXT', payload: 'I have a new insight based on the article you sent earlier today. Ready to discuss?' }), 300);
          }}
        >
          <View className="flex-row items-center gap-3 flex-1">
            <Text className="text-xl">💡</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-brand flex-1 leading-5">
              Sage has a new insight for you based on that article you sent.
            </Text>
          </View>
          <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-brand">View →</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="flex-row items-center bg-surfaceElevated rounded-2xl px-4 h-11 gap-2 border-1 border-borderLight mt-2">
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={COLORS.textMuted}
            className="flex-1 text-textPrimary text-base"
            style={{ fontFamily: 'SpaceGrotesk_400Regular' }}
          />
        </View>
      </View>

      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-row items-center px-4 py-3" activeOpacity={0.7}>
            <View className="relative">
              <View 
                className="w-14 h-14 rounded-full bg-surfaceElevated border-1 border-borderLight items-center justify-center overflow-hidden"
              >
                <Text className="text-3xl">{item.user.avatar}</Text>
              </View>
              {item.user.online && (
                <View className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success border-2 border-background" />
              )}
            </View>
            <View className="flex-1 ml-4 border-b-1 border-borderLight pb-3 relative top-1.5">
              <View className="flex-row justify-between items-center mb-1">
                <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-textPrimary text-[15px]">
                  {item.user.username}
                </Text>
                <Text style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-textMuted text-xs">
                  {item.time}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text
                  style={{ 
                    fontFamily: item.unread > 0 ? 'SpaceGrotesk_600SemiBold' : 'SpaceGrotesk_400Regular',
                    color: item.unread > 0 ? COLORS.textPrimary : COLORS.textSecondary
                  }}
                  className="flex-1 text-[13px] mr-4"
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
                {item.unread > 0 ? (
                  <View className="w-5 h-5 rounded-full bg-brand items-center justify-center">
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-white text-[10px]">
                      {item.unread}
                    </Text>
                  </View>
                ) : (
                  <Ionicons name="camera-outline" size={20} color={COLORS.textMuted} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
