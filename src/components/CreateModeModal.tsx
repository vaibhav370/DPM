import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme';
import { buddyService } from '../services/buddyService';

interface CreateModeModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (mode: { id: string; label: string; emoji: string; color: string; intent: string }) => void;
  initialMode?: { id: string; label: string; emoji: string; color: string; intent: string } | null;
}

const COLOR_OPTIONS = [
  '#275E4D', // Deep Sage
  '#D97706', // Amber 
  '#718096', // Slate
  '#6B46C1', // Purple
  '#E53E3E', // Red
  '#3182CE', // Blue
  '#D53F8C', // Pink
];

export default function CreateModeModal({ visible, onClose, onCreate, initialMode }: CreateModeModalProps) {
  const [label, setLabel] = useState('');
  const [emoji, setEmoji] = useState('🌟');
  const [intent, setIntent] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialMode) {
        setLabel(initialMode.label);
        setEmoji(initialMode.emoji);
        setIntent(initialMode.intent);
        if (COLOR_OPTIONS.includes(initialMode.color)) {
          setSelectedColor(initialMode.color);
        } else {
          setSelectedColor(initialMode.color || COLOR_OPTIONS[0]);
        }
      } else {
        setLabel('');
        setEmoji('🌟');
        setIntent('');
        setSelectedColor(COLOR_OPTIONS[0]);
        setPrompt('');
      }
    }
  }, [visible, initialMode]);

  const handleCreate = () => {
    if (!label.trim()) return;

    const id = initialMode?.id || label.trim().toLowerCase().replace(/[\s\W-]+/g, '_');
    onCreate({
      id,
      label: label.trim(),
      emoji: emoji.trim() || '🌟',
      color: selectedColor,
      intent: intent.trim() || 'Custom intent',
    });

    // Reset
    setLabel('');
    setEmoji('🌟');
    setIntent('');
    setSelectedColor(COLOR_OPTIONS[0]);
    setPrompt('');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const config = await buddyService.generateModeConfig(prompt.trim());
    setIsGenerating(false);

    if (config) {
      setLabel(config.label);
      setEmoji(config.emoji);
      setIntent(config.intent);
      if (COLOR_OPTIONS.includes(config.color)) {
        setSelectedColor(config.color);
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <View className="absolute inset-0 bg-black/40" />
        <View className="bg-bone w-full rounded-t-3xl shadow-lg relative h-[85%]">
          
          <View className="flex-row justify-between items-center p-6 border-b-1 border-borderLight">
            <Text style={{ fontFamily: 'Lora_600SemiBold' }} className="text-2xl text-textPrimary">
              {initialMode ? 'Edit Mode' : 'Design Mode'}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-surfaceElevated rounded-full">
              <Text className="text-textSecondary">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="p-6" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Ask Sage AI Generator */}
            <View className="mb-6 bg-[#275E4D]/10 rounded-2xl p-4 border-1 border-[#275E4D]/20">
              <Text style={{ fontFamily: 'Lora_600SemiBold' }} className="text-[#275E4D] text-lg mb-2">✨ Ask Sage to Design</Text>
              <TextInput 
                className="bg-surface border-1 border-white rounded-xl px-4 py-3 text-ink text-sm min-h-[80px]"
                style={{ fontFamily: 'SpaceGrotesk_400Regular' }}
                placeholder="e.g. 'I want a feed that helps me focus on learning about AI architecture without any distractions'"
                multiline
                textAlignVertical="top"
                value={prompt}
                onChangeText={setPrompt}
                editable={!isGenerating}
              />
              <TouchableOpacity
                className="mt-3 py-3 rounded-xl items-center flex-row justify-center shadow-soft-sm"
                style={{ backgroundColor: isGenerating ? COLORS.textSecondary : COLORS.brand }}
                onPress={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                   <ActivityIndicator color={COLORS.surface} size="small" />
                ) : (
                  <>
                    <Text className="text-white mr-2">🪄</Text>
                    <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-white text-sm">Generate Mode</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-borderLight" />
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textMuted text-xs px-4 uppercase tracking-widest">Or fine-tune manually</Text>
              <View className="flex-1 h-px bg-borderLight" />
            </View>

            {/* Name */}
            <View className="mb-6">
              <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-xs text-textSecondary uppercase tracking-widest mb-2">Mode Name</Text>
              <TextInput 
                className="bg-surface border-1 border-borderLight rounded-2xl px-4 py-3.5 text-ink text-base"
                style={{ fontFamily: 'SpaceGrotesk_400Regular' }}
                placeholder="e.g. Creator Mode"
                value={label}
                onChangeText={setLabel}
              />
            </View>

            {/* Emoji */}
            <View className="mb-6">
              <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-xs text-textSecondary uppercase tracking-widest mb-2">Icon (Emoji)</Text>
              <TextInput 
                className="bg-surface border-1 border-borderLight rounded-2xl px-4 py-3.5 text-ink text-base"
                style={{ fontFamily: 'SpaceGrotesk_400Regular' }}
                placeholder="🎨"
                value={emoji}
                onChangeText={setEmoji}
                maxLength={2}
              />
            </View>

            {/* Color */}
            <View className="mb-6">
              <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-xs text-textSecondary uppercase tracking-widest mb-2">Brand Color</Text>
              <View className="flex-row flex-wrap gap-3">
                {COLOR_OPTIONS.map(color => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-12 h-12 rounded-full border-2 ${selectedColor === color ? 'border-textPrimary' : 'border-transparent'}`}
                  />
                ))}
              </View>
            </View>

            {/* Intent Hint */}
            <View className="mb-8">
              <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-xs text-textSecondary uppercase tracking-widest mb-2">Feed Instructions</Text>
              <TextInput 
                className="bg-surface border-1 border-borderLight rounded-2xl px-4 py-3.5 text-ink text-base h-24"
                style={{ fontFamily: 'SpaceGrotesk_400Regular' }}
                placeholder="Describe how Sage should filter the feed..."
                multiline
                textAlignVertical="top"
                value={intent}
                onChangeText={setIntent}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity 
              className="rounded-2xl py-4 items-center shadow-soft-sm"
              style={{ backgroundColor: COLORS.brand }}
              onPress={handleCreate}
              disabled={!label.trim()}
            >
              <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-white text-base tracking-wide">
                {initialMode ? 'Save Changes' : 'Create Mode'}
              </Text>
            </TouchableOpacity>
          </ScrollView>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
