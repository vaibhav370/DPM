// Instagram Theme System
export type FeedMode = 'calm' | 'focus' | 'default' | 'study' | (string & {});

const currentHour = new Date().getHours();
const isNight = currentHour >= 18 || currentHour < 6;
// If it's not night, we'll consider it morning/day for the "Light Red" requirement.
// Alternatively, 6 AM to 18 PM is "Morning/Day" -> Light Red.
const isMorning = !isNight;

export const COLORS = {
  // Base palette — Instagram clean white
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceElevated: '#FAFAFA',
  border: '#DBDBDB',
  borderLight: '#EFEFEF',

  // Instagram brand gradient
  igGradientStart: '#833ab4',
  igGradientMid: '#fd1d1d',
  igGradientEnd: '#fcb045',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#4A5568',
  textMuted: '#718096',

  // Brand
  brand: '#275E4D', // Deep Sage
  brandLight: '#3D7A66',

  // Mode palettes
  modes: {
    calm: {
      primary: '#275E4D', // Deep Sage
      secondary: '#3D7A66',
      accent: '#86efac',
      gradient: ['#FFFFFF', '#EAF0EB'],
      headerBg: '#FFFFFF',
      pill: '#275E4D',
      label: 'Calm',
      emoji: '🌿',
    },
    focus: {
      primary: '#718096',
      secondary: '#A0AEC0',
      accent: '#CBD5E0',
      gradient: ['#F5F0E6', '#F8F9FA'],
      headerBg: '#F5F0E6',
      pill: '#718096',
      label: 'Focus',
      emoji: '🎯',
    },
    study: {
      primary: '#6B46C1', // Soft Purple
      secondary: '#9F7AEA',
      accent: '#E9D8FD',
      gradient: ['#F5F0E6', '#FAF5FF'],
      headerBg: '#F5F0E6',
      pill: '#6B46C1',
      label: 'Study',
      emoji: '📚',
    },
    default: {
      primary: isNight ? '#7DD3FC' : '#FCA5A5', // Light Blue at night, Light Red in morning/day
      secondary: isNight ? '#BAFAFE' : '#FECACA',
      accent: isNight ? '#38BDF8' : '#F87171',
      gradient: isNight ? ['#F5F0E6', '#F0F9FF'] : ['#F5F0E6', '#FEF2F2'],
      headerBg: '#F5F0E6',
      pill: isNight ? '#7DD3FC' : '#FCA5A5',
      label: 'Default',
      emoji: '✨',
    },
  },

  // Semantic
  success: '#275E4D',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',

  // Provenance types
  provenance: {
    organic: '#275E4D',
    amplified: '#D97706',
    ai_generated: '#7C3AED',
  },
};

export const TYPOGRAPHY = {
  display: { fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', fontSize: 28, letterSpacing: -0.5 },
  heading: { fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', fontSize: 20, letterSpacing: -0.3, fontWeight: '600' as const },
  subheading: { fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', fontSize: 17, fontWeight: '500' as const },
  body: { fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', fontSize: 13, lineHeight: 18 },
  micro: { fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', fontSize: 11, letterSpacing: 0.3 },
  username: { fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', fontSize: 14, fontWeight: '600' as const },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export const RADII = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
