import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { useApp } from '../src/context/AppContext';
import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../src/theme';
import { useModeTheme } from '../src/hooks/useModeTheme';

const MOCK_USAGE_DATA = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 30 },
  { day: 'Wed', minutes: 65 },
  { day: 'Thu', minutes: 20 },
  { day: 'Fri', minutes: 80 },
  { day: 'Sat', minutes: 120 },
  { day: 'Sun', minutes: 50 },
];

const EMOTIONAL_TAGS = [
  { label: 'Inspired', count: 12, color: COLORS.modes.default.primary },
  { label: 'Calm', count: 8, color: COLORS.modes.calm.primary },
  { label: 'Indifferent', count: 5, color: COLORS.textMuted },
  { label: 'Anxious', count: 2, color: COLORS.modes.focus.primary },
];

export default function ImpactLedgerScreen() {
  const { state } = useApp();
  const router = useRouter();
  const modeTheme = useModeTheme();
  const modeColor = modeTheme.primary;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Impact Ledger',
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.textPrimary,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: Platform.OS === 'ios' ? 0 : 16 }}>
              <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Streak & Tree */}
        <View style={[styles.treeCard, { borderColor: COLORS.border }]}>
          <Text style={styles.sectionTitle}>Your Impact Tree 🌳</Text>
          <View style={styles.treeVisualization}>
            {/* Mocking the tree with emojis since drawing an SVG tree is complex */}
            <Text style={{ fontSize: 64 }}>🌿</Text>
            <View style={[styles.streakPill, { backgroundColor: modeColor + '20' }]}>
              <Text style={[styles.streakText, { color: modeColor }]}>
                {state.impactTreeStreak} Day Streak
              </Text>
            </View>
          </View>
          <Text style={styles.treeDesc}>
            Your tree grows when you maintain healthy session boundaries. 
            You're 3 days away from unlocking the next growth stage!
          </Text>
        </View>

        {/* This Week Usage Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Screen Time by Day</Text>
          <View style={styles.chartContainer}>
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={20}
              height={220}
              padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
            >
              <VictoryAxis
                style={{
                  axis: { stroke: COLORS.border },
                  tickLabels: { fill: COLORS.textSecondary, fontSize: 12 },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(x) => `${x}m`}
                style={{
                  axis: { stroke: 'transparent' },
                  tickLabels: { fill: COLORS.textMuted, fontSize: 10 },
                  grid: { stroke: COLORS.borderLight, strokeDasharray: '4,4' },
                }}
              />
              <VictoryBar
                data={MOCK_USAGE_DATA}
                x="day"
                y="minutes"
                style={{
                  data: {
                    fill: ({ datum }) => 
                      datum.minutes > 60 ? COLORS.textMuted : modeColor,
                    rx: 4,
                  },
                }}
                cornerRadius={{ top: 4 }}
              />
            </VictoryChart>
          </View>
        </View>

        {/* Emotional Outcomes */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Emotional Outcomes</Text>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.textMuted} />
          </View>
          <Text style={styles.sectionDesc}>Based on your buddy check-ins this week.</Text>
          
          <View style={styles.tagsRow}>
            {EMOTIONAL_TAGS.map((tag) => (
              <View key={tag.label} style={[styles.tagPill, { borderColor: tag.color + '40', backgroundColor: tag.color + '10' }]}>
                <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
                <Text style={[styles.tagText, { color: COLORS.textPrimary }]}>{tag.label}</Text>
                <Text style={styles.tagCount}>{tag.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Current Session Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Session</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxNum}>{state.sessionStats.sessionMinutes}</Text>
              <Text style={styles.statBoxLabel}>minutes active</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxNum}>{state.sessionStats.reelsWatched}</Text>
              <Text style={styles.statBoxLabel}>reels watched</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxNum}>{state.sessionStats.postsLiked}</Text>
              <Text style={styles.statBoxLabel}>posts liked</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    gap: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  sectionDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    marginTop: -8,
  },
  treeCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
  },
  treeVisualization: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
    height: 120,
  },
  streakPill: {
    position: 'absolute',
    bottom: -10,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADII.full,
    borderWidth: 1,
    borderColor: 'transparent', // Can inherit from mode
  },
  streakText: {
    ...TYPOGRAPHY.subheading,
    fontWeight: '700',
  },
  treeDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.lg,
    overflow: 'hidden',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADII.full,
    borderWidth: 1,
    gap: 6,
  },
  tagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tagText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  tagCount: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  statBoxNum: {
    ...TYPOGRAPHY.display,
    color: COLORS.textPrimary,
  },
  statBoxLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});
