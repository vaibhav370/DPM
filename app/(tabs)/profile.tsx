import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/context/AppContext';
import { COLORS } from '../../src/theme';
import { useModeTheme } from '../../src/hooks/useModeTheme';

export default function ProfileScreen() {
  const { state, dispatch } = useApp();
  const insets = useSafeAreaInsets();
  const modeTheme = useModeTheme();
  const modeColor = modeTheme.primary;
  const [inputText, setInputText] = useState('');
  const [quickPanel, setQuickPanel] = useState<'stats' | 'stressed' | 'impact' | null>(null);

  // Mock chat messages for the embedded Sage interface
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'sage',
      text: "I noticed you're spending more time in Focus Mode this week. How is your energy holding up?",
      time: '10:24 AM'
    },
    {
      id: '2',
      sender: 'user',
      text: "Pretty good! The content is much less overwhelming.",
      time: '10:28 AM'
    },
    {
      id: '3',
      sender: 'sage',
      text: "That's wonderful. I've tuned your feed to prioritize long-form reading and art to keep that calm momentum going. Is there anything specific you'd like to dive into today?",
      time: '10:29 AM'
    }
  ]);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-background">
        <Text style={{ fontFamily: 'Lora_600SemiBold' }} className="text-3xl text-textPrimary">The Mirror</Text>
        <View className="flex-row items-center gap-2">
          <View className="px-3 py-1.5 bg-surfaceElevated border-1 border-borderLight rounded-full flex-row items-center gap-1.5" style={{ backgroundColor: modeColor + '10', borderColor: modeColor + '30' }}>
            <Text className="text-xs">{modeTheme.emoji}</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold', color: modeColor }} className="text-xs">{modeTheme.label} Mode Active</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-surfaceElevated border-1 border-borderLight">
            <Ionicons name="settings-outline" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, paddingBottom: 100 }}>
        
        {/* Settings / Stat Bar Toggle */}
        <View className="px-5 mb-5 flex-row items-center justify-between">
          <View>
            <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textPrimary text-sm">Dashboard Bar</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-textMuted text-xs">Show the slow scroll stat bar on the home feed</Text>
          </View>
          <Switch 
            value={state.showStatBar} 
            onValueChange={() => dispatch({ type: 'TOGGLE_STAT_BAR' })}
            trackColor={{ false: COLORS.borderLight, true: modeColor }}
            thumbColor={COLORS.surface}
          />
        </View>

        {/* Attention Budget Settings */}
        <View className="px-5 mb-5">
          <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textPrimary text-sm mb-2">Attention Budget</Text>
          <Text style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-textMuted text-xs mb-3">Set your mindful scrolling limit for Reels</Text>
          
          {/* Outer card */}
          <View style={{ backgroundColor: '#F8F7F4', borderRadius: 20, borderWidth: 1, borderColor: '#E8E5DF', padding: 16, gap: 12 }}>
            
            {/* Segmented toggle — both options always visible */}
            <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E8E5DF', padding: 4 }}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => dispatch({ type: 'SET_ATTENTION_BUDGET', payload: { type: 'count', value: state.attentionBudget.type === 'count' ? state.attentionBudget.value : 10 } })}
                style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: state.attentionBudget.type === 'count' ? '#1A1A1A' : 'transparent' }}
              >
                <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold', fontSize: 13, color: state.attentionBudget.type === 'count' ? '#FFFFFF' : '#1A1A1A' }}>Reels Count</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => dispatch({ type: 'SET_ATTENTION_BUDGET', payload: { type: 'time', value: state.attentionBudget.type === 'time' ? state.attentionBudget.value : 60 } })}
                style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: state.attentionBudget.type === 'time' ? '#1A1A1A' : 'transparent' }}
              >
                <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold', fontSize: 13, color: state.attentionBudget.type === 'time' ? '#FFFFFF' : '#1A1A1A' }}>Minutes</Text>
              </TouchableOpacity>
            </View>

            {/* Numeric input row */}
            <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E8E5DF', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', fontSize: 13, color: '#888', flex: 1 }}>
                {state.attentionBudget.type === 'time' ? 'Minutes to watch' : 'Reels to watch'}
              </Text>
              <TextInput
                value={state.attentionBudget.value.toString()}
                onChangeText={(text) => {
                  const val = parseInt(text) || 0;
                  dispatch({ type: 'SET_ATTENTION_BUDGET', payload: { ...state.attentionBudget, value: val } });
                }}
                keyboardType="numeric"
                style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: '#1A1A1A', textAlign: 'right', width: 60 }}
              />
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', fontSize: 13, color: '#888', marginLeft: 6, width: 36 }}>
                {state.attentionBudget.type === 'time' ? 'min' : 'reels'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Sage Persona Settings */}
        <View className="px-5 mb-5">
          <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textPrimary text-sm mb-2">Sage Persona</Text>
          <Text style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-textMuted text-xs mb-3">Define how Sage should interact with you</Text>
          
          <View style={{ backgroundColor: '#F8F7F4', borderRadius: 20, borderWidth: 1, borderColor: '#E8E5DF', padding: 16 }}>
            <TextInput
              value={state.sagePersona}
              onChangeText={(text) => dispatch({ type: 'SET_SAGE_PERSONA', payload: text })}
              placeholder="e.g. Be my supportive friend and always encourage me."
              placeholderTextColor="#A0AEC0"
              multiline
              style={{ 
                fontFamily: 'SpaceGrotesk_400Regular', 
                fontSize: 14, 
                color: '#1A1A1A',
                minHeight: 80,
                textAlignVertical: 'top'
              }}
            />
          </View>
        </View>
        {state.mode === 'focus' && (
          <View className="flex-row px-4 gap-3 mb-6">
            <View className="flex-1 bg-surfaceElevated border-1 border-borderLight p-4 rounded-3xl">
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textMuted text-xs mb-1">Time on app</Text>
              <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-textPrimary text-xl mb-1">
                {state.sessionStats.sessionMinutes} min
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="arrow-down" size={12} color={COLORS.success} />
                <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-success text-[11px] ml-0.5">22% vs last week</Text>
              </View>
            </View>

            <View className="flex-1 bg-surfaceElevated border-1 border-borderLight p-4 rounded-3xl">
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textMuted text-xs mb-1">Interactions</Text>
              <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-textPrimary text-xl mb-1">
                {state.sessionStats.postsLiked} liked
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={12} color={COLORS.textSecondary} />
                <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textSecondary text-[11px] ml-1">Intentional</Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 10 }}
        >
          <TouchableOpacity 
            className={`flex-row items-center gap-2 px-4 py-2 rounded-full shadow-soft-sm border-1 ${quickPanel === 'stats' ? 'bg-textPrimary border-textPrimary' : 'bg-surface border-borderLight'}`}
            onPress={() => setQuickPanel(p => p === 'stats' ? null : 'stats')}
          >
            <Text className="text-base">📊</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className={`text-xs ${quickPanel === 'stats' ? 'text-white' : 'text-ink'}`}>My stats</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-row items-center gap-2 px-4 py-2 rounded-full shadow-soft-sm border-1 ${quickPanel === 'stressed' ? 'bg-brand border-brand' : 'bg-brand/10 border-brand/20'}`}
            onPress={() => {
              setQuickPanel(null);
              dispatch({ type: 'OPEN_BUDDY_WITH_CONTEXT', payload: { user: { username: 'you' }, caption: 'I am feeling stressed and overwhelmed. Please help me.', image: '' } as any });
            }}
          >
            <Text className="text-base">🌿</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className={`text-xs ${quickPanel === 'stressed' ? 'text-white' : 'text-brand'}`}>I am stressed</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-row items-center gap-2 px-4 py-2 rounded-full shadow-soft-sm border-1 ${quickPanel === 'impact' ? 'bg-textPrimary border-textPrimary' : 'bg-surface border-borderLight'}`}
            onPress={() => setQuickPanel(p => p === 'impact' ? null : 'impact')}
          >
            <Text className="text-base">🌳</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className={`text-xs ${quickPanel === 'impact' ? 'text-white' : 'text-ink'}`}>My impact</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Inline Quick Panel */}
        {quickPanel === 'stats' && (
          <View className="mx-4 mb-4 bg-surfaceElevated border-1 border-borderLight rounded-3xl p-5 gap-4">
            <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-textPrimary text-base">📊 Today's Stats</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-2xl p-4 border-1 border-borderLight items-center">
                <Text className="text-3xl mb-1">⏱️</Text>
                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-textPrimary text-xl">{state.sessionStats.sessionMinutes}</Text>
                <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textMuted text-xs">min on app</Text>
              </View>
              <View className="flex-1 bg-surface rounded-2xl p-4 border-1 border-borderLight items-center">
                <Text className="text-3xl mb-1">🎬</Text>
                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-textPrimary text-xl">{state.sessionStats.reelsWatched}</Text>
                <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textMuted text-xs">reels watched</Text>
              </View>
              <View className="flex-1 bg-surface rounded-2xl p-4 border-1 border-borderLight items-center">
                <Text className="text-3xl mb-1">❤️</Text>
                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-textPrimary text-xl">{state.sessionStats.postsLiked}</Text>
                <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textMuted text-xs">posts liked</Text>
              </View>
            </View>
          </View>
        )}

        {quickPanel === 'impact' && (
          <View className="mx-4 mb-4 bg-surfaceElevated border-1 border-borderLight rounded-3xl p-5">
            <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-textPrimary text-base mb-4">🌳 Your Mindful Impact</Text>
            <View className="items-center py-4">
              <Text className="text-7xl mb-3">🌳</Text>
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-textPrimary text-3xl">{state.impactTreeStreak} days</Text>
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textMuted text-sm mt-1">mindful scrolling streak</Text>
            </View>
            <View className="bg-brand/10 border-1 border-brand/20 rounded-2xl p-4 mt-2">
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-brand text-xs text-center">
                🌿 Every day you scroll mindfully, you conserve mental bandwidth and grow this tree. Keep it alive!
              </Text>
            </View>
          </View>
        )}

        {/* Embedded Sage Chat */}
        <View className="px-4 mb-2 flex-row items-center gap-2">
          <Text className="text-xl">✨</Text>
          <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-textPrimary text-[15px]">Check in with Sage</Text>
        </View>

        <View className="mx-4 bg-surfaceElevated border-1 border-borderLight rounded-[32px] overflow-hidden flex-1 min-h-[400px]">
          <ScrollView className="flex-1 p-4 mb-16" showsVerticalScrollIndicator={false}>
            {messages.map((msg) => {
              const isSage = msg.sender === 'sage';
              return (
                <View 
                  key={msg.id} 
                  className={`mb-4 w-[85%] ${isSage ? 'self-start' : 'self-end'}`}
                >
                  <View 
                    className={`px-4 py-3 rounded-2xl ${
                      isSage 
                        ? 'bg-brand/10 border-1 border-brand/20 rounded-tl-sm' 
                        : 'bg-white border-1 border-borderLight rounded-tr-sm shadow-soft-sm'
                    }`}
                  >
                    <Text 
                      style={{ fontFamily: 'SpaceGrotesk_400Regular' }} 
                      className={`text-[15px] leading-6 ${isSage ? 'text-brand' : 'text-textPrimary'}`}
                    >
                      {msg.text}
                    </Text>
                  </View>
                  <Text 
                    style={{ fontFamily: 'SpaceGrotesk_500Medium' }} 
                    className={`text-textMuted text-[10px] mt-1.5 mx-1 ${isSage ? 'text-left' : 'text-right'}`}
                  >
                    {msg.time}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Input Area */}
          <View className="absolute bottom-0 left-0 right-0 bg-surfaceElevated border-t-1 border-borderLight p-3 pb-4">
            <View className="flex-row items-center bg-white border-1 border-borderLight rounded-full px-4 h-12 shadow-soft-sm">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Message Sage..."
                placeholderTextColor={COLORS.textMuted}
                className="flex-1 text-textPrimary text-[15px]"
                style={{ fontFamily: 'SpaceGrotesk_400Regular' }}
              />
              <TouchableOpacity className="w-8 h-8 rounded-full bg-brand items-center justify-center -mr-1">
                <Ionicons name="arrow-up" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
