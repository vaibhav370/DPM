import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, FeedMode } from '../theme';
import CreateModeModal from './CreateModeModal';

const DEFAULT_MODE_DETAILS: Record<string, { emoji: string; label: string; color?: string; intent?: string }> = {
  default: { emoji: '✨', label: 'Default', intent: 'A lighthearted feed optimized for joy and entertainment. This is the default mode.' },
  calm: { emoji: '🌿', label: 'Calm', intent: 'Filters out high-arousal content for a peaceful experience.' },
  focus: { emoji: '🎯', label: 'Focus', intent: 'Removes distractions and surfaces only high-signal content.' },
  study: { emoji: '📚', label: 'Study', intent: 'Curated for learning, productivity, and academic topics.' },
};

export default function IntentToggle() {
  const { state, dispatch } = useApp();
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [modeToDelete, setModeToDelete] = useState<string | null>(null);
  const [modeToEdit, setModeToEdit] = useState<any>(null);

  const handleSelect = (mode: FeedMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  const handleAddMode = () => {
    setModeToEdit(null);
    setCreateModalVisible(true);
  };

  const handleEditMode = (modeId: string) => {
    const modeData = allModes[modeId];
    setModeToEdit({ ...modeData, id: modeId });
    setCreateModalVisible(true);
  };

  const handleCreateMode = (modeData: { id: string; label: string; emoji: string; color: string; intent: string }) => {
    dispatch({ type: 'ADD_CUSTOM_MODE', payload: modeData });
    dispatch({ type: 'SET_MODE', payload: modeData.id as FeedMode });
    setCreateModalVisible(false);
  };

  const confirmDelete = () => {
    if (modeToDelete) {
      dispatch({ type: 'REMOVE_CUSTOM_MODE', payload: modeToDelete } as any);
      setModeToDelete(null);
    }
  };

  const allModes = { ...DEFAULT_MODE_DETAILS, ...state.customModes };

  return (
    <>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 8 }}
      >
        {Object.keys(allModes).map((modeId) => {
          const modeData = allModes[modeId];
          const isActive = state.mode === modeId;
          const isDeletable = modeId !== 'default';
          
          let backgroundColor = COLORS.surfaceElevated;
          let textColor = COLORS.textSecondary;
          let borderColor = COLORS.borderLight;

          if (isActive) {
            borderColor = 'transparent';
            if (modeData.color) {
              backgroundColor = modeData.color;
              textColor = '#FFFFFF';
            } else if (modeId === 'calm') {
              backgroundColor = COLORS.brand;
              textColor = '#FFFFFF';
            } else if (modeId === 'focus') {
              backgroundColor = COLORS.modes.focus.primary;
              textColor = '#FFFFFF';
            } else if (modeId === 'study') {
              backgroundColor = COLORS.modes.study.primary;
              textColor = '#FFFFFF';
            } else if (modeId === 'default') {
              backgroundColor = COLORS.textPrimary;
              textColor = COLORS.surface;
            } else {
              backgroundColor = COLORS.brand;
              textColor = '#FFFFFF';
            }
          }

          const handleDelete = () => {
            setModeToDelete(modeId);
          };

          return (
            <View 
              key={modeId}
              className="flex-row items-center rounded-full border-1 shadow-soft-sm overflow-hidden"
              style={{ backgroundColor, borderColor }}
              {...({ title: modeData.intent || 'Feed Mode' } as any)}
            >
              <TouchableOpacity 
                activeOpacity={0.9} 
                onPress={() => handleSelect(modeId as FeedMode)}
                onLongPress={isDeletable ? handleDelete : undefined}
                className={`flex-row items-center gap-1.5 py-2 ${isActive && isDeletable ? 'pl-4 pr-1.5' : 'px-4'}`}
              >
                <Text className="text-sm">{modeData.emoji}</Text>
                <Text style={{ fontFamily: isActive ? 'SpaceGrotesk_600SemiBold' : 'SpaceGrotesk_400Regular', color: textColor }} className="text-[13px]">
                  {modeData.label}
                </Text>
              </TouchableOpacity>
              
              {isActive && isDeletable && (
                <View className="flex-row items-center ml-1">
                  <TouchableOpacity 
                    onPress={() => handleEditMode(modeId)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    className="py-2 px-1 justify-center"
                  >
                    <View 
                      className="w-5 h-5 rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
                    >
                      <Ionicons name="pencil" size={10} color={textColor} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={handleDelete}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    className="py-2 pr-2 pl-1 justify-center"
                  >
                    <View 
                      className="w-5 h-5 rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
                    >
                      <Ionicons name="close" size={12} color={textColor} />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
        
        {/* Add Mode Button */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={handleAddMode}
          className="flex-row items-center gap-1.5 px-4 py-2 rounded-full border-1 border-dashed border-borderLight bg-surface"
        >
          <Text className="text-sm">➕</Text>
          <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', color: COLORS.textSecondary }} className="text-[13px]">
            Design
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <CreateModeModal 
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreate={handleCreateMode}
        initialMode={modeToEdit}
      />

      <Modal
        visible={!!modeToDelete}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModeToDelete(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-surface w-[80%] max-w-[320px] rounded-3xl p-6 border-1 border-borderLight shadow-soft-sm">
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-xl text-textPrimary text-center mb-2">Delete Mode?</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_400Regular' }} className="text-textSecondary text-center mb-6">
              Are you sure you want to permanently remove this mode?
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 py-3 bg-surfaceElevated border-1 border-borderLight rounded-full items-center"
                onPress={() => setModeToDelete(null)}
              >
                <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-textPrimary">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 bg-ink rounded-full items-center"
                onPress={confirmDelete}
              >
                <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-surface">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
