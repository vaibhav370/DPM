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
      posts = posts.filter((p) => p.arousal_level !== 'high' && !p.topics.includes('memes') && !p.topics.includes('humor'));
    } else if (state.mode === 'study') {
      posts = posts.filter((p) => 
        p.topics.some(t => ['study', 'education', 'science', 'math', 'philosophy', 'programming', 'tech'].includes(t.toLowerCase()))
      );
    }

    // 2. Custom AI Mode Filtering (Sage Curation)
    // Custom modes use the `intent` string to define filters. Because we don't have a live semantic backend,
    // we will simulate filtering by doing a basic keyword match on the `intent` string against the post's `topics`.
    const customMode = state.customModes[state.mode];
    if (customMode && customMode.intent) {
      const intentLower = customMode.intent.toLowerCase();
      // Extract keywords from intent (longer than 3 chars)
      const keywords = intentLower.split(/[\s,.]+/).filter(k => k.length > 3);

      posts = posts.filter((p) => {
        // If the intent mentions "all", show everything
        if (intentLower.includes('all')) return true;
        
        // Match against topics
        const topicMatch = p.topics.some(topic => 
          intentLower.includes(topic.toLowerCase()) || 
          keywords.some(k => topic.toLowerCase().includes(k))
        );
        
        // Match against caption
        const captionMatch = keywords.some(k => p.caption.toLowerCase().includes(k));
        
        return topicMatch || captionMatch;
      });
    }
    
    // Explicit tag filtering (from older implementation, kept for safety)
    if (state.feedFilters.excludeTags.length > 0) {
      posts = posts.filter((p) => !p.topics.some(t => state.feedFilters.excludeTags.includes(t.toLowerCase())));
    }
    
    if (state.feedFilters.includeTags.length > 0) {
      posts = posts.filter((p) => p.topics.some(t => state.feedFilters.includeTags.includes(t.toLowerCase())));
    }

    // Always ensure we have *some* content so the feed isn't completely empty and broken
    // but prioritize the filtered list if it has items.
    if (posts.length === 0) {
      // If we are in study mode and nothing matched, show some relevant study items as fallback
      if (state.mode === 'study') {
        const studyFallback = MOCK_POSTS.filter(p => p.topics.includes('science') || p.topics.includes('study')).slice(0, 3);
        return studyFallback.length > 0 ? studyFallback : MOCK_POSTS.slice(0, 3);
      }
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
