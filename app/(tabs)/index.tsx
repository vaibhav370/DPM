import React, { useMemo } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { MOCK_POSTS } from '../../src/data/posts';
import { COLORS } from '../../src/theme';
import PostCard from '../../src/components/PostCard';
import StoriesRow from '../../src/components/StoriesRow';
import IntentToggle from '../../src/components/IntentToggle';

export default function FeedScreen() {
  const { state } = useApp();

  // Mode & AI-based feed filtering
  const filteredPosts = useMemo(() => {
    let posts = [...MOCK_POSTS];
    
    // 1. Base Intent Mode filtering
    if (state.mode === 'calm') {
      posts = posts.filter((p) => p.arousal_level !== 'high');
    } else if (state.mode === 'focus') {
      posts = posts.filter((p) => p.arousal_level !== 'high' && !p.topics.includes('memes'));
    }

    // 2. Custom AI Mode Filtering (Sage Curation)
    // Custom modes use the `intent` string to define filters. Because we don't have a live semantic backend,
    // we will simulate filtering by doing a basic keyword match on the `intent` string against the post's `topics`.
    const customMode = state.customModes[state.mode];
    if (customMode && customMode.intent) {
      const intentLower = customMode.intent.toLowerCase();
      // Only keep posts where at least one of their topics is mentioned in the intent string.
      // This is a rough simulation of AI semantic matching.
      posts = posts.filter((p) => 
        p.topics.some(topic => intentLower.includes(topic.toLowerCase())) ||
        intentLower.includes('all') // fallback if the intent just says "show me all..."
      );
    }
    
    // Explicit tag filtering (from older implementation, kept for safety)
    if (state.feedFilters.excludeTags.length > 0) {
      posts = posts.filter((p) => !p.topics.some(t => state.feedFilters.excludeTags.includes(t.toLowerCase())));
    }
    
    if (state.feedFilters.includeTags.length > 0) {
      posts = posts.filter((p) => p.topics.some(t => state.feedFilters.includeTags.includes(t.toLowerCase())));
    }

    // Always ensure we have *some* content so the feed isn't completely empty and broken
    if (posts.length === 0) {
      return MOCK_POSTS.slice(0, 3);
    }

    return posts;
  }, [state.mode, state.feedFilters, state.customModes]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={() => (
          <View className="pb-2">
            <View className="pt-2 pb-1">
              <IntentToggle />
            </View>
            
            <View className="flex-row items-center justify-between px-4 pt-2 pb-2">
              <Text style={{ fontFamily: 'Lora_600SemiBold' }} className="text-xl text-textPrimary">Stories</Text>
            </View>
            <StoriesRow />
            
            {/* Soft Slow Scroll Banner (Toggleable) */}
            {state.showStatBar && (
              <View className="mx-4 my-3 bg-surfaceElevated border-1 border-borderLight rounded-2xl p-4 flex-row items-start gap-3">
                <Text className="text-xl">☕</Text>
                <Text style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="flex-1 text-textSecondary text-[13px] leading-5">
                  Slow scroll. You've been here {state.sessionStats.sessionMinutes} min — content is curated by interest, not engagement bait.
                </Text>
              </View>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 20,
  },
});
