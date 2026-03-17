import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useApp } from '../../src/context/AppContext';
import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../../src/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useModeTheme } from '../../src/hooks/useModeTheme';


const REELS_DATA = [
  { id: 'r1', videoType: 'Nature & Mindfulness', color: '#1B2A22', user: { username: 'nature_lover' }, caption: 'A mindful moment in the woods. 🌲' },
  { id: 'r2', videoType: 'Tech Deep Dive', color: '#1A1A24', user: { username: 'tech_guru' }, caption: 'How AI is changing the world.' },
  { id: 'r3', videoType: 'Studio Art Process', color: '#2A1A1A', user: { username: 'art_studio' }, caption: 'Painting a masterpiece from scratch. Wait for the end result! 🎨' },
  { id: 'r4', videoType: 'Standup Comedy snippet', color: '#2A2A1A', user: { username: 'comedy_club' }, caption: 'Hilarious standup routine about daily life.' },
  { id: 'r5', videoType: 'Cinematic Travel Vlog', color: '#1A2A2A', user: { username: 'traveler' }, caption: 'Exploring the hidden gems of the city. 🌆' },
  { id: 'r6', videoType: 'Study Ambient Beats', color: '#1E1A2A', user: { username: 'lofi_beats' }, caption: 'Chill beats to study to. 🎧' },
  { id: 'r7', videoType: 'Science Explained in 60s', color: '#1A202A', user: { username: 'science_guy' }, caption: 'Quantum physics explained simply.' },
  { id: 'r8', videoType: 'Baking ASMR', color: '#2A201A', user: { username: 'baker' }, caption: 'Satisfying baking sounds. The crunch is real.' },
  { id: 'r9', videoType: 'Workout Motivation', color: '#2A1A1A', user: { username: 'fitness_freak' }, caption: 'Get up and grind. No excuses today.' },
  { id: 'r10', videoType: 'Stoic Quotes Visualized', color: '#1A2A25', user: { username: 'stoic_mind' }, caption: 'Meditations by Marcus Aurelius.' },
];

export default function ReelsScreen() {
  const { state, dispatch } = useApp();
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [reelsSeconds, setReelsSeconds] = useState(0);

  // Tab bar height estimate for snapping
  const REEL_HEIGHT = SCREEN_HEIGHT - (60 + insets.bottom);
  const REEL_WIDTH = Math.min(SCREEN_WIDTH, 480);
  const modeTheme = useModeTheme();

  useEffect(() => {
    let interval: any;
    if (state.attentionBudget.type === 'time') {
      interval = setInterval(() => setReelsSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [state.attentionBudget.type]);

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / REEL_HEIGHT);
    if (index !== activeReelIndex) {
      setActiveReelIndex(index);
      dispatch({ type: 'INCREMENT_REELS' });
    }
  };

  const currentReel = REELS_DATA[activeReelIndex];

  // Budget logic
  const progress = state.attentionBudget.type === 'count' 
    ? (activeReelIndex + 1) / state.attentionBudget.value
    : (reelsSeconds / 60) / state.attentionBudget.value;
  
  const progressPercent = Math.min(progress * 100, 100);
  
  let barColor = COLORS.success;
  if (progressPercent > 80) barColor = COLORS.error;
  else if (progressPercent > 50) barColor = '#EAB308'; // Yellow

  const handleAskBuddy = (reel: any) => {
    const mockPostContext = {
      user: reel.user,
      caption: reel.caption,
      image: 'https://via.placeholder.com/150/' + reel.color.replace('#', '') + '/ffffff'
    };
    dispatch({ type: 'OPEN_BUDDY_WITH_CONTEXT', payload: mockPostContext as any });
  };

  const renderReel = ({ item }: any) => {
    return (
      <View style={[styles.reelContainer, { height: REEL_HEIGHT, width: REEL_WIDTH }]}>
        {/* Full-screen Deep Gradient */}
        <LinearGradient
          colors={[item.color, '#000000']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Glassmorphic Play Button Overlay */}
        <View style={StyleSheet.absoluteFillObject} className="items-center justify-center pointer-events-none">
          <BlurView intensity={20} tint="light" className="w-20 h-20 rounded-full items-center justify-center overflow-hidden border-1 border-white/20">
            <Ionicons name="play" size={36} color="rgba(255,255,255,0.8)" style={{ marginLeft: 4 }} />
          </BlurView>
        </View>

        {/* Top Floating Elements */}
        <View className="absolute top-0 left-0 right-0 z-10" style={{ paddingTop: insets.top }}>
          <View className="flex-row justify-between items-center px-4 mt-4">
            <Text style={{ fontFamily: 'Lora_600SemiBold', fontSize: 24, color: '#FFFFFF' }}>Reels</Text>
            
            {/* Category Pill */}
            <View className="px-3 py-1.5 bg-black/40 rounded-full border-1 border-white/10 flex-row items-center hidden sm:flex">
              <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-white text-[11px] tracking-wide uppercase">
                {item.videoType}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Section: Creator Info & Action Rail */}
        <View className="absolute bottom-6 left-0 right-0 px-4 z-10 flex-col">
          
          <View className="flex-row justify-between items-end mb-6">
            {/* Left: Creator Info Layered */}
            <View className="flex-1 pr-10 pb-2">
              <View className="flex-row items-center gap-2.5 mb-2.5">
                <View className="w-10 h-10 rounded-full border-2 border-white/30 bg-black/50 overflow-hidden items-center justify-center">
                  <Text className="text-lg">🎭</Text>
                </View>
                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-white text-[15px] shadow-sm">@{item.user.username}</Text>
                <TouchableOpacity className="border-1 border-white/50 px-2.5 py-1 rounded-full bg-black/20">
                  <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-white text-[10px]">Follow</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-white text-sm leading-5 shadow-sm" numberOfLines={3}>
                {item.caption} ✨ #reels #mindful
              </Text>
            </View>

            {/* Right: Vertical Action Rail */}
            <View className="items-center gap-5">
              <TouchableOpacity className="items-center flex-col justify-center w-12 h-12 bg-black/30 rounded-full border-1 border-white/10">
                <Ionicons name="heart" size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity className="items-center flex-col justify-center w-12 h-12 bg-black/30 rounded-full border-1 border-white/10">
                <Ionicons name="chatbubble" size={22} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity className="items-center flex-col justify-center w-12 h-12 bg-black/30 rounded-full border-1 border-white/10">
                <Ionicons name="paper-plane" size={22} color="#fff" />
              </TouchableOpacity>
              
              {/* Buddy FAB */}
              <TouchableOpacity 
                className="items-center flex-col justify-center w-14 h-14 bg-[#FFAEAA] rounded-full border-1 border-white/20 shadow-soft"
                onPress={() => handleAskBuddy(item)}
              >
                <Text className="text-2xl pt-1 pr-1">✨</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Attention Budget Bar */}
          <View className="w-full">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="time-outline" size={14} color="#FBBF24" />
                <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-white/70 text-xs text-center">Attention budget</Text>
              </View>
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-white/70 text-xs">
                {state.attentionBudget.type === 'count' ? `${activeReelIndex + 1} of ${state.attentionBudget.value} reels` : `${Math.floor(reelsSeconds/60)} of ${state.attentionBudget.value} min`}
              </Text>
            </View>

            <View className="h-1.5 w-full bg-white/20 rounded-full mb-3 overflow-hidden">
              <View className="h-full rounded-full" style={{ width: `${progressPercent}%`, backgroundColor: barColor || '#F97316' }} />
            </View>

            <Text style={{ fontFamily: 'Lora_400Regular_Italic' }} className="text-white/50 text-center text-[11px]">
              Reels are timed to protect your attention — scroll with intention.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={REELS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderReel}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={REEL_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        style={{ width: '100%', maxWidth: 480 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  reelContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
});
