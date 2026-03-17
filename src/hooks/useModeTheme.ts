import { useApp } from '../context/AppContext';
import { COLORS } from '../theme';

export function useModeTheme() {
  const { state } = useApp();
  const baseMode = COLORS.modes[state.mode as keyof typeof COLORS.modes];
  
  if (baseMode) {
    return baseMode;
  }
  
  const custom = state.customModes[state.mode];
  return {
    primary: custom?.color || COLORS.brand,
    secondary: custom?.color || COLORS.brandLight,
    accent: COLORS.modes.calm.accent,
    gradient: COLORS.modes.calm.gradient,
    headerBg: COLORS.background, // Fallback background
    pill: custom?.color || COLORS.brand,
    label: custom?.label || 'Custom',
    emoji: custom?.emoji || '✨',
  };
}
