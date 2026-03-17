import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useApp } from '../context/AppContext';
import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../theme';
import {
  BUDDY_GREETING,
  BUDDY_REPLIES,
  BUDDY_SESSION_SUMMARY,
  BUDDY_CHECKIN_PROMPTS,
  QUICK_REPLIES,
  BuddyMessage,
} from '../data/buddy_scripts';
import { buddyService, SessionContext } from '../services/buddyService';
import { useModeTheme } from '../hooks/useModeTheme';

export default function BuddyModal() {
  const { state, dispatch } = useApp();
  const modeTheme = useModeTheme();
  const [messages, setMessages] = useState<BuddyMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const modeColor = modeTheme.primary;

  // Initialize with greeting or clear for contextual message when opened
  useEffect(() => {
    if (state.buddyOpen) {
      if (state.activePostContext) {
        // Clear messages so the persona buttons show cleanly
        setMessages([]);
      } else if (messages.length === 0) {
        const greeting: BuddyMessage = {
          id: 'g1',
          from: 'buddy',
          text: BUDDY_GREETING[state.mode],
        };
        setMessages([greeting]);
      }
    }
  }, [state.buddyOpen, state.activePostContext]);

  // Update greeting on mode change
  useEffect(() => {
    if (state.buddyOpen && messages.length > 0) {
      const modeMsg: BuddyMessage = {
        id: `mode-${Date.now()}`,
        from: 'buddy',
        text: `Mode switched to ${state.mode.charAt(0).toUpperCase() + state.mode.slice(1)}! ${modeTheme.emoji} Your feed will update to match.`,
      };
      setMessages((prev) => [...prev, modeMsg]);
    }
  }, [state.mode]);

  const getContext = (): SessionContext => ({
    mode: state.mode,
    reelsWatched: state.sessionStats.reelsWatched,
    sessionMinutes: state.sessionStats.sessionMinutes,
    postsLiked: state.sessionStats.postsLiked,
    impactTreeStreak: state.impactTreeStreak,
  });

  const sendMessage = async (text: string) => {
    const userMsg: BuddyMessage = {
      id: `u-${Date.now()}`,
      from: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    // Call live AI service
    const aiResponse = await buddyService.sendMessage(text, getContext(), undefined, state.sagePersona);

    const buddyReply: BuddyMessage = {
      id: `b-${Date.now()}`,
      from: 'buddy',
      text: aiResponse.text,
      action: aiResponse.action,
    };
    setMessages((prev) => [...prev, buddyReply]);
    setIsTyping(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const handlePersonaAction = async (actionType: 'wellness' | 'glassbox' | 'factcheck') => {
    if (!state.activePostContext) return;
    
    const labels = {
      'wellness': 'How did this make me feel? (Show me less)',
      'glassbox': 'Why is this post in my feed?',
      'factcheck': 'Fact check the claims in this post.'
    };
    
    // Add user message
    const userMsg: BuddyMessage = { id: `u-${Date.now()}`, from: 'user', text: labels[actionType] };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);

    const postPayload = `Post by @${state.activePostContext.user.username}. Caption: "${state.activePostContext.caption}"`;
    const aiResponse = await buddyService.sendMessage(postPayload, getContext(), actionType);

    const buddyMsg: BuddyMessage = { 
      id: `b-${Date.now()}`, 
      from: 'buddy', 
      text: aiResponse.text,
      action: aiResponse.action, 
    };
    setMessages((prev) => [...prev, buddyMsg]);
    setIsTyping(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const handleQuickReply = async (key: string) => {
    const label = QUICK_REPLIES.find((q) => q.key === key)?.label || key;
    const userMsg: BuddyMessage = { id: `u-${Date.now()}`, from: 'user', text: label };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);

    // Generate response using live AI (passing label as prompt)
    const prompt = `[The user just tapped the quick reply: "${label}"]`;
    const aiResponse = await buddyService.sendMessage(prompt, getContext(), undefined, state.sagePersona);

    const buddyMsg: BuddyMessage = { 
      id: `b-${Date.now()}`, 
      from: 'buddy', 
      text: aiResponse.text,
      action: aiResponse.action, 
    };
    setMessages((prev) => [...prev, buddyMsg]);
    setIsTyping(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const handleApproveAction = (msgId: string, action: any) => {
    dispatch({
      type: 'SET_FEED_FILTERS',
      payload: {
        includeTags: action.includeTags,
        excludeTags: action.excludeTags,
      },
    });

    // Mark as resolved locally
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId && msg.action ? { ...msg, action: { ...msg.action, resolved: true } as any } : msg
      )
    );
  };

  const handleDeclineAction = (msgId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId && msg.action ? { ...msg, action: { ...msg.action, resolved: true } as any } : msg
      )
    );
  };

  return (
    <Modal
      visible={state.buddyOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => dispatch({ type: 'CLOSE_BUDDY' })}
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="light" />
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="h-[92%] bg-surface border-t-2 border-x-2 border-ink rounded-t-[32px] overflow-hidden shadow-brutal">
          {/* Header */}
          <View className="flex-row items-center justify-between p-5 pt-7 border-b-2 border-ink bg-surfaceElevated">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full border-2 border-ink items-center justify-center bg-surface relative">
                <Text className="text-2xl">🤖</Text>
                <View className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-ink bg-success" />
              </View>
              <View>
                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-ink text-lg">Sage</Text>
                <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textMuted text-xs mt-0.5">Your AI Wellness Buddy • Online</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => dispatch({ type: 'CLOSE_BUDDY' })} hitSlop={10} className="w-10 h-10 items-center justify-center rounded-full border-2 border-ink bg-surface shadow-brutal-sm">
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Mode badge */}
          <View className="flex-row items-center gap-2 m-4 px-4 py-2 rounded-full border-2 border-ink self-start shadow-brutal-sm" style={{ backgroundColor: modeColor + '40' }}>
            <Text className="text-sm">{modeTheme.emoji}</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', color: modeColor }} className="text-xs">
              {modeTheme.label} Mode Active
            </Text>
          </View>

        {/* Messages */}
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ padding: 16, gap: 12 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Contextual Post Snippet & Personas */}
          {state.activePostContext && messages.length === 0 && (
            <View className="mb-4">
               <View className="flex-row items-center gap-3 p-3 border-2 border-ink rounded-lg bg-surfaceElevated mb-4 shadow-brutal-sm">
                  <Image source={{ uri: state.activePostContext.image }} className="w-12 h-12 rounded-md border-1 border-ink" />
                  <View className="flex-1">
                    <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-ink text-sm">@{state.activePostContext.user.username}</Text>
                    <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textSecondary text-xs" numberOfLines={1}>{state.activePostContext.caption}</Text>
                  </View>
               </View>
               
               <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-ink text-sm mb-3 text-center">How can I help with this post?</Text>
               <View className="gap-3">
                 <TouchableOpacity 
                   className="py-3 px-4 border-2 border-ink rounded-xl bg-[#E6F4FE] flex-row items-center gap-3 shadow-brutal-sm"
                   onPress={() => handlePersonaAction('wellness')}
                 >
                   <Text className="text-2xl">🩺</Text>
                   <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-ink text-sm flex-1">Wellness Checkup (Show me less)</Text>
                 </TouchableOpacity>

                 <TouchableOpacity 
                   className="py-3 px-4 border-2 border-ink rounded-xl bg-[#F3E8FF] flex-row items-center gap-3 shadow-brutal-sm"
                   onPress={() => handlePersonaAction('glassbox')}
                 >
                   <Text className="text-2xl">🔍</Text>
                   <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-ink text-sm flex-1">Glassbox (Why is this here?)</Text>
                 </TouchableOpacity>

                 <TouchableOpacity 
                   className="py-3 px-4 border-2 border-ink rounded-xl bg-[#FEF3C7] flex-row items-center gap-3 shadow-brutal-sm"
                   onPress={() => handlePersonaAction('factcheck')}
                 >
                   <Text className="text-2xl">🔬</Text>
                   <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-ink text-sm flex-1">Fact Checker (Verify caption)</Text>
                 </TouchableOpacity>
               </View>
            </View>
          )}

          {messages.map((msg) => {
            const isUser = msg.from === 'user';
            return (
              <View
                key={msg.id}
                className={`max-w-[85%] p-3 px-4 border-2 border-ink shadow-brutal-sm ${
                  isUser
                    ? 'self-end rounded-t-brutal rounded-bl-brutal rounded-br-sm'
                    : 'self-start rounded-t-brutal rounded-br-brutal rounded-bl-sm bg-surface'
                }`}
                style={isUser ? { backgroundColor: modeColor } : undefined}
              >
                <Text
                  style={{ fontFamily: 'SpaceGrotesk_500Medium' }}
                  className={`text-base leading-6 ${isUser ? 'text-surface' : 'text-ink'}`}
                >
                  {msg.text}
                </Text>

                {/* Action Proposal Bubble */}
                {msg.action && !msg.action.resolved && (
                  <View className="mt-4 p-3 bg-surface border-2 border-ink rounded-lg shadow-brutal-sm">
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-ink text-sm mb-1">
                      ⚙️ Feed Update Proposal
                    </Text>
                    <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-textSecondary text-xs mb-2">
                      {msg.action.reason}
                    </Text>
                    {msg.action.includeTags.length > 0 && (
                      <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-ink text-xs mb-1">
                        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>Adding:</Text> {msg.action.includeTags.join(', ')}
                      </Text>
                    )}
                    {msg.action.excludeTags.length > 0 && (
                      <Text style={{ fontFamily: 'SpaceGrotesk_500Medium' }} className="text-ink text-xs mb-2">
                        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }}>Hiding:</Text> {msg.action.excludeTags.join(', ')}
                      </Text>
                    )}
                    <View className="flex-row gap-2 mt-2">
                      <TouchableOpacity
                        className="flex-1 py-2 items-center rounded-lg border-2 border-ink shadow-brutal-sm"
                        style={{ backgroundColor: modeColor }}
                        onPress={() => handleApproveAction(msg.id, msg.action)}
                      >
                        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-surface text-xs">Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 py-2 items-center rounded-lg border-2 border-ink bg-surface shadow-brutal-sm"
                        onPress={() => handleDeclineAction(msg.id)}
                      >
                        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold' }} className="text-ink text-xs">Decline</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
          {isTyping && (
            <View className="self-start rounded-t-brutal rounded-br-brutal rounded-bl-sm p-3 px-4 border-2 border-ink bg-surface shadow-brutal-sm">
              <Text style={{ fontFamily: 'SpaceGrotesk_600SemiBold' }} className="text-textMuted text-base animate-pulse">Sage is typing...</Text>
            </View>
          )}
        </ScrollView>



        {/* Input */}
        <View className="flex-row items-end gap-3 p-4 pt-2 border-t-2 border-ink bg-surfaceElevated relative">
          <TextInput
            className="flex-1 rounded-[24px] px-5 py-3.5 bg-surface border-2 border-ink text-ink max-h-[100px]"
            style={{ fontFamily: 'SpaceGrotesk_500Medium' }}
            placeholder="Talk to Sage..."
            placeholderTextColor={COLORS.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={300}
          />
          <TouchableOpacity
            className="w-12 h-12 rounded-full items-center justify-center border-2 border-ink shadow-brutal-sm"
            style={{ backgroundColor: inputText.trim() ? modeColor : COLORS.surfaceElevated }}
            onPress={() => inputText.trim() && sendMessage(inputText.trim())}
            disabled={!inputText.trim()}
          >
            <Ionicons name="arrow-up" size={24} color={inputText.trim() ? '#fff' : COLORS.textMuted} />
          </TouchableOpacity>
        </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({});
