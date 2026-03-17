import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../theme';
import { Post } from '../data/posts';

interface Props {
  post: Post;
  visible: boolean;
  onClose: () => void;
}

const PROVENANCE_CONFIG = {
  organic: {
    label: 'Organic',
    color: COLORS.provenance.organic,
    icon: '🌱',
    description: 'This post was shared naturally by accounts you follow or interact with.',
  },
  amplified: {
    label: 'AI Amplified',
    color: COLORS.provenance.amplified,
    icon: '🔊',
    description: 'This post was algorithmically promoted due to high engagement signals. Instagram applied Calm Mode filters before showing it to you.',
  },
  ai_generated: {
    label: 'AI Generated',
    color: COLORS.provenance.ai_generated,
    icon: '🤖',
    description: 'This content was created with AI assistance. Instagram verifies AI labels for transparency.',
  },
};

export default function ProvenanceCard({ post, visible, onClose }: Props) {
  const pConfig = PROVENANCE_CONFIG[post.provenance_type];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Why am I seeing this?</Text>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Provenance badge */}
          <View style={[styles.provenanceBadge, { borderColor: pConfig.color }]}>
            <Text style={styles.provenanceEmoji}>{pConfig.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.provenanceLabel, { color: pConfig.color }]}>
                {pConfig.label}
              </Text>
              <Text style={styles.provenanceDesc}>{pConfig.description}</Text>
            </View>
          </View>

          {/* Algorithm reasons */}
          <Text style={styles.sectionTitle}>Algorithm Signals</Text>
          {post.algorithmReasons.map((reason, i) => (
            <View key={i} style={styles.reasonRow}>
              <View style={[styles.reasonDot, { backgroundColor: COLORS.brand }]} />
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}

          {/* Topics */}
          <Text style={styles.sectionTitle}>Content Topics</Text>
          <View style={styles.topicsRow}>
            {post.topics.map((topic, i) => (
              <View key={i} style={styles.topicChip}>
                <Text style={styles.topicText}>#{topic}</Text>
              </View>
            ))}
          </View>

          {/* DIA compliance note */}
          <View style={styles.diaNote}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.success} />
            <Text style={styles.diaNoteText}>
              This disclosure is provided in compliance with the Digital India Act transparency requirements.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
              <Ionicons name="thumbs-down-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.actionText}>Not interested</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.brand + '20', borderColor: COLORS.brand }]} onPress={onClose}>
              <Ionicons name="chatbubble-outline" size={16} color={COLORS.brand} />
              <Text style={[styles.actionText, { color: COLORS.brand }]}>Ask Buddy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: COLORS.surfaceElevated,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    padding: SPACING.xl,
    paddingTop: SPACING.md,
    maxHeight: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: RADII.full,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textPrimary,
  },
  provenanceBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    padding: SPACING.md,
    borderWidth: 1,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  provenanceEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  provenanceLabel: {
    ...TYPOGRAPHY.subheading,
    marginBottom: 4,
  },
  provenanceDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  reasonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  reasonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  topicChip: {
    backgroundColor: COLORS.brand + '20',
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  topicText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.brandLight,
    fontWeight: '600',
  },
  diaNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.success + '15',
    borderRadius: RADII.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  diaNoteText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.success,
    flex: 1,
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    padding: SPACING.md,
    gap: 6,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  actionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
