import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../theme';
import { STORIES as INITIAL_STORIES } from '../data/posts';
import { useApp } from '../context/AppContext';
import { useModeTheme } from '../hooks/useModeTheme';
import StoryViewer from './StoryViewer';

export default function StoriesRow() {
  const { state } = useApp();
  const modeTheme = useModeTheme();
  const modeColor = modeTheme.primary;
  const modeSecondary = modeTheme.accent;

  const [stories, setStories] = useState(INITIAL_STORIES);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const handleStoryPress = (index: number) => {
    setViewerIndex(index);
  };

  const markStoryAsSeen = (id: string) => {
    setStories((prev: typeof INITIAL_STORIES) => prev.map((s: typeof INITIAL_STORIES[0]) => s.id === id ? { ...s, unseen: false } : s));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {stories.map((story, index) => (
          <TouchableOpacity 
            key={story.id} 
            style={styles.storyItem} 
            activeOpacity={0.8}
            onPress={() => handleStoryPress(index)}
          >
            {story.unseen ? (
              <LinearGradient
                colors={['#FCAF45', '#E1306C', '#833AB4']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientRing}
              >
                <View style={styles.storyAvatarBg}>
                  {story.isYou ? (
                    <View style={[styles.addBtn, { backgroundColor: '#E1306C' }]}>
                      <Text style={styles.addBtnText}>+</Text>
                    </View>
                  ) : (
                    <Text style={styles.avatarEmoji}>{story.avatar}</Text>
                  )}
                </View>
              </LinearGradient>
            ) : (
              <View style={[styles.gradientRing, { backgroundColor: COLORS.surfaceElevated }]}>
                <View style={styles.storyAvatarBg}>
                  {story.isYou ? (
                    <View style={[styles.addBtn, { backgroundColor: modeColor }]}>
                      <Text style={styles.addBtnText}>+</Text>
                    </View>
                  ) : (
                    <Text style={styles.avatarEmoji}>{story.avatar}</Text>
                  )}
                </View>
              </View>
            )}
            <Text style={styles.storyUsername} numberOfLines={1}>
              {story.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Full Screen Story Modal */}
      <StoryViewer
        visible={viewerIndex !== null}
        stories={stories}
        initialIndex={viewerIndex || 0}
        onClose={() => setViewerIndex(null)}
        onStoryViewed={markStoryAsSeen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.md,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.lg,
  },
  storyItem: {
    alignItems: 'center',
    width: 68,
    gap: 6,
  },
  gradientRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2.5,
  },
  storyAvatarBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: -2,
  },
  storyUsername: {
    fontSize: 11,
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    color: COLORS.textSecondary,
    textAlign: 'center',
    width: 68,
  },
});
