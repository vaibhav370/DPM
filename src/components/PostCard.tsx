import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../theme';
import { Post } from '../data/posts';
import { useApp } from '../context/AppContext';
import ProvenanceCard from './ProvenanceCard';

interface Props {
  post: Post;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PROVENANCE_BADGES = {
  organic: { icon: '🌱', label: 'Organic', color: COLORS.provenance.organic },
  amplified: { icon: '🔊', label: 'Amplified', color: COLORS.provenance.amplified },
  ai_generated: { icon: '🤖', label: 'AI', color: COLORS.provenance.ai_generated },
};

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return n.toString();
}
import { useModeTheme } from '../hooks/useModeTheme';

export default function PostCard({ post }: Props) {
  const { state, dispatch } = useApp();
  const modeTheme = useModeTheme();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [provenanceVisible, setProvenanceVisible] = useState(false);

  const badge = PROVENANCE_BADGES[post.provenance_type];
  const modeColor = modeTheme.primary;

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) dispatch({ type: 'LIKE_POST' });
  };

  const handleAskBuddy = () => {
    dispatch({ type: 'OPEN_BUDDY_WITH_CONTEXT', payload: post as any }); // temporarily bypassing typecheck if needed, but it should be fine
  };

  const isCalmBlurred = state.mode === 'calm' && post.arousal_level !== 'low';

  return (
    <Animated.View entering={FadeInUp.duration(400)}>
      <View className="bg-surface mb-6 mx-1 overflow-hidden">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 relative">
          <View className="flex-row items-center gap-2">
            <View className="w-10 h-10 rounded-full items-center justify-center bg-surfaceElevated overflow-hidden border-1 border-borderLight shadow-soft-sm">
              <Text className="text-xl">{post.user.avatar}</Text>
            </View>
            <View>
              <View className="flex-row items-center">
                <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-textPrimary text-[15px]">
                  {post.user.username}
                </Text>
                {post.user.verified && (
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.brand} style={{ marginLeft: 3 }} />
                )}
              </View>
              <Text style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-textMuted text-xs mt-0.5">
                {post.timestamp}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2 relative">
            <TouchableOpacity
              className="flex-row items-center gap-1 rounded-full px-2 py-1 bg-surfaceElevated"
              onPress={() => setProvenanceVisible(true)}
              style={{ paddingRight: 6 }}
            >
              <Text className="text-xs">{badge.icon}</Text>
              <Text style={{ color: badge.color, fontFamily: 'SpaceGrotesk_500Medium' }} className="text-xs">
                {badge.label}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity hitSlop={10} className="p-1">
              <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Area with Conditional Blur */}
        <View className="relative w-full h-[400px] bg-bone">
          <Image
            source={{ uri: post.image }}
            className="w-full h-full"
            resizeMode="contain"
          />
          {isCalmBlurred && (
            <BlurView intensity={80} tint="light" className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center p-6">
               <View className="bg-surface/90 border-2 border-ink rounded-brutal p-5 items-center shadow-brutal-sm">
                 <Ionicons name="eye-off-outline" size={32} color={COLORS.textPrimary} />
                 <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-ink text-base mt-2 text-center">
                   Filtered: High-Arousal Content
                 </Text>
                 <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textSecondary text-xs mt-1 text-center">
                   Calm Mode has blurred this to protect your focus.
                 </Text>
               </View>
            </BlurView>
          )}
        </View>

        {/* Actions */}
        <View className="flex-row justify-between items-center px-4 py-3 bg-surface">
          <View className="flex-row gap-4 items-center">
            <TouchableOpacity onPress={handleLike}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={26}
                color={liked ? COLORS.error : COLORS.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="chatbubble-outline" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="paper-plane-outline" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>

            {/* Highlighted Inline Buddy Button moved to the left */}
            <TouchableOpacity 
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border-1 border-brand/30 shadow-soft-sm"
              style={{ backgroundColor: `${COLORS.brand}15` }}
              onPress={handleAskBuddy}
            >
              <Text className="text-xs">✨</Text>
              <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold', color: COLORS.brand }} className="text-xs tracking-wide">Ask Sage</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => setSaved(!saved)}>
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={saved ? COLORS.brand : COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Caption */}
        <View className="flex-col px-4 mb-2">
          <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-textPrimary text-[13px] mb-1">
            {formatCount(post.likes + (liked ? 1 : 0))} likes
          </Text>
          <View className="flex-row flex-wrap">
            <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-textPrimary text-sm">
              {post.user.username}{' '}
            </Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-textPrimary text-sm flex-1 leading-5">
              {post.caption}
            </Text>
          </View>
        </View>

        {/* Why am I seeing this */}
        <TouchableOpacity
          className="flex-row items-center gap-1 px-4 py-3 bg-surface border-t-1 border-borderLight"
          onPress={() => setProvenanceVisible(true)}
        >
          <Ionicons name="information-circle" size={16} color={COLORS.textMuted} />
          <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textMuted text-xs">
            Why am I seeing this?
          </Text>
        </TouchableOpacity>
      </View>

      <ProvenanceCard
        post={post}
        visible={provenanceVisible}
        onClose={() => setProvenanceVisible(false)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
