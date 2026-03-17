import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { COLORS } from '../../src/theme';
import { MOCK_POSTS } from '../../src/data/posts';
import { useModeTheme } from '../../src/hooks/useModeTheme';

const { width } = Dimensions.get('window');
const SPACING = 16;
const ITEM_WIDTH = (width - SPACING * 3) / 2;

const CATEGORIES = ["All", "Mindfulness", "Art & Craft", "Deep Work", "Nature"];

export default function ExploreScreen() {
  const { state } = useApp();
  const modeTheme = useModeTheme();
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 pb-0 gap-3">
        {/* Search Bar */}
        <View className="flex-row items-center bg-surfaceElevated rounded-2xl px-4 h-11 gap-2 border-1 border-borderLight mt-2">
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            placeholder={`Search in ${modeTheme.label} Mode...`}
            placeholderTextColor={COLORS.textMuted}
            className="flex-1 text-textPrimary text-base"
            style={{ fontFamily: 'SpaceGrotesk_400Regular' }}
          />
        </View>

        {/* Categories Pill Scroll */}
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          className="mt-1 mb-2"
          contentContainerStyle={{ gap: 8, paddingRight: 16 }}
          renderItem={({ item }) => {
            const isActive = activeCategory === item;
            return (
              <TouchableOpacity
                onPress={() => setActiveCategory(item)}
                className={`px-4 py-2 rounded-full border-1 ${
                  isActive 
                    ? 'bg-brand border-brand' 
                    : 'bg-surfaceElevated border-borderLight'
                }`}
              >
                <Text 
                  style={{ fontFamily: isActive ? 'SpaceGrotesk_600SemiBold' : 'SpaceGrotesk_500Medium' }}
                  className={`text-[13px] ${isActive ? 'text-white' : 'text-textSecondary'}`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: SPACING, paddingBottom: 100, gap: SPACING }}
        columnWrapperStyle={{ gap: SPACING }}
        renderItem={({ item }) => (
          <TouchableOpacity className="relative bg-bone rounded-2xl overflow-hidden shadow-soft-sm" activeOpacity={0.9}>
            <Image 
              source={{ uri: item.image }} 
              style={{ width: ITEM_WIDTH, height: ITEM_WIDTH * 1.3 }} 
              resizeMode="cover"
            />
            {/* Soft overlay gradient */}
            <View className="absolute inset-0 bg-black/10 justify-end p-3">
              <View className="w-6 h-6 rounded-full bg-white/20 items-center justify-center backdrop-blur-md">
                <Ionicons name="sparkles" size={12} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
