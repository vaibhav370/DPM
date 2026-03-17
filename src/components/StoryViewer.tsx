import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions, Animated, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useModeTheme } from '../hooks/useModeTheme';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000;

interface Story {
  id: string;
  username: string;
  avatar: string;
  unseen: boolean;
  isYou: boolean;
  contentUrl?: string; // Full screen image
  caption?: string;
}

interface StoryViewerProps {
  visible: boolean;
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onStoryViewed: (id: string) => void;
}

export default function StoryViewer({ visible, stories, initialIndex, onClose, onStoryViewed }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const modeTheme = useModeTheme();

  useEffect(() => {
    if (visible && stories.length > 0) {
      setCurrentIndex(initialIndex);
      startProgress();
    } else {
      progressAnim.setValue(0);
    }
  }, [visible, initialIndex]);

  useEffect(() => {
    if (visible && stories[currentIndex]) {
      progressAnim.setValue(0);
      startProgress();
      onStoryViewed(stories[currentIndex].id);
    }
  }, [currentIndex, visible]);

  const startProgress = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        goToNext();
      }
    });
  };

  const handlePress = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    if (x < width / 3) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Re-start current if it's the first one
      progressAnim.setValue(0);
      startProgress();
    }
  };

  if (!visible || !stories[currentIndex]) return null;

  const currentStory = stories[currentIndex];
  // Fallback beautiful gradient if no image is provided
  const fallbackBg = currentStory.isYou ? ['#275E4D', '#1A4034'] : ['#8B5CF6', '#6D28D9'];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Background Content */}
        {currentStory.contentUrl ? (
          <Image source={{ uri: currentStory.contentUrl }} style={styles.backgroundImage} resizeMode="cover" />
        ) : (
          <View style={[styles.backgroundImage, { backgroundColor: currentStory.isYou ? COLORS.brand : COLORS.modes.study.primary }]} />
        )}
        
        {/* Dark Overlay for readability */}
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea}>
          {/* Progress Bars */}
          <View style={styles.progressContainer}>
            {stories.map((s, idx) => (
              <View key={s.id} style={styles.progressBarBg}>
                <Animated.View
                  style={[
                    styles.progressBarActive,
                    {
                      width: idx === currentIndex
                        ? progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          })
                        : idx < currentIndex
                        ? '100%'
                        : '0%',
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{currentStory.avatar}</Text>
              </View>
              <Text style={styles.username}>{currentStory.username}</Text>
              <Text style={styles.timeText}>Just now</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Tap Zones */}
          <View style={styles.tapZonesContainer} onTouchEnd={handlePress}>
             {currentStory.caption && (
               <View style={styles.captionContainer}>
                 <Text style={styles.captionText}>{currentStory.caption}</Text>
               </View>
             )}
          </View>

          {/* Reply Input (Mock) */}
          <View style={styles.footer}>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>Send message...</Text>
            </View>
            <TouchableOpacity style={styles.heartBtn}>
              <Ionicons name="heart-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Ionicons name="paper-plane-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Subtle darkening to make text pop
  },
  safeArea: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 4,
  },
  progressBarBg: {
    flex: 1,
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarActive: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: 18,
  },
  username: {
    ...TYPOGRAPHY.subheading,
    color: '#fff',
    fontWeight: '600',
  },
  timeText: {
    ...TYPOGRAPHY.micro,
    color: 'rgba(255,255,255,0.7)',
  },
  closeBtn: {
    padding: 4,
  },
  tapZonesContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SPACING.lg,
  },
  captionContainer: {
    marginBottom: SPACING.xl,
  },
  captionText: {
    ...TYPOGRAPHY.body,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  inputBox: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  inputText: {
    color: '#fff',
    fontSize: 15,
  },
  heartBtn: {
    padding: 4,
  },
  shareBtn: {
    padding: 4,
  },
});
