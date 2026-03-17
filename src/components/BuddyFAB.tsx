import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme';
import { useModeTheme } from '../hooks/useModeTheme';

export default function BuddyFAB() {
  const { state, dispatch } = useApp();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const modeTheme = useModeTheme();
  const modeColor = modeTheme.primary;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <View className="absolute bottom-24 right-5 items-center justify-center z-50" pointerEvents="box-none">
      <Animated.View
        className="absolute w-16 h-16 rounded-full border-2 border-ink"
        style={[
          { backgroundColor: modeColor, opacity: 0.4, transform: [{ scale: pulseAnim }] },
        ]}
      />
      <TouchableOpacity
        className="w-14 h-14 rounded-full items-center justify-center border-2 border-ink shadow-brutal bg-surface"
        style={{ backgroundColor: modeColor }}
        onPress={() => dispatch({ type: 'TOGGLE_BUDDY' })}
        activeOpacity={0.85}
      >
        <Ionicons name="sparkles" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}
