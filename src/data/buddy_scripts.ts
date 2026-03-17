import { FeedMode } from '../theme';

export interface FeedAction {
  type: 'proposeFeedUpdate';
  includeTags: string[];
  excludeTags: string[];
  reason: string;
  resolved?: boolean;
}

export interface BuddyMessage {
  id: string;
  from: 'buddy' | 'user';
  text: string;
  action?: FeedAction;
}

export const BUDDY_GREETING: Record<FeedMode, string> = {
  calm: "Hi there. 🌿 I'm Sage, your companion. You're in Calm Mode right now. How are you feeling? I'm here to listen or just sit with you in the quiet.",
  focus: "Hey! 🎯 Flow state engaged. What are we working on today? I'll keep the noise out so you can focus.",
  study: "Ready to hit the books? 📚 Let me know if you need to bounce any ideas around or take a breather.",
  default: "Hey! ✨ Looking to discover something new or just vibe for a bit? Tell me what's on your mind.",
};

export const BUDDY_SESSION_SUMMARY = (stats: {
  reels: number;
  minutes: number;
  posts: number;
  mode: FeedMode;
}) =>
  `Here's your session so far 📊\n\n• Mode: ${stats.mode.charAt(0).toUpperCase() + stats.mode.slice(1)}\n• Time active: ~${stats.minutes} min\n• Reels watched: ${stats.reels}\n• Posts liked: ${stats.posts}\n\nYou're doing great! Your Impact Tree streak is at 7 days 🌳`;

export const BUDDY_CHECKIN_PROMPTS = [
  "You've been scrolling Reels for a bit — how are you feeling? 💙",
  "Quick check-in 🌿 Is the content serving you, or are you just passing time?",
  "You've watched quite a few Reels. Want to switch to Calm Mode for a while?",
  "Hey! Just wanted to check in. Sometimes a 2-minute pause can reset everything. Ready? 🧘",
];

export const BUDDY_REPLIES: Record<string, string> = {
  default: "Tell me more — I'm here to listen and support you 💙",
  stressed: "I hear you 🌿 Let's switch to Calm Mode and bring your feed down a notch. Deep breath — you've got this.",
  good: "Love to hear that! ✨ Your positive energy shows up in your session stats too. Keep it up!",
  bored: "Boredom is actually creative fuel 🎯 Want me to recommend some hidden-gem accounts based on your interests?",
  why: "Great question! Every post is shown based on:\n1. What you've liked before\n2. What your network engages with\n3. The current mode you're in (${mode})\n\nYou can always tap 'Why am I seeing this?' on any post for details.",
  stats: "Here are your session stats:\n• Active: ~12 min\n• Reels: 4 watched\n• Posts liked: 2\n\nYour Impact Tree is at streak day 7 🌳 Keep it going!",
  recommend: "Based on your Calm Mode preferences, I'd recommend:\n\n• @stillmind.journal — Mindful journaling prompts\n• @the.slow.club — Slow living aesthetic\n• @neuroscience.daily — Science explained gently\n\nWant me to add these to your feed?",
  tree: "Your Impact Tree 🌳\n\nCurrent streak: 7 days\nHealthy sessions: 23 total\nXP earned this week: 340\n\nYou're growing steadily! 5 more healthy sessions unlock the 'Flourish' badge 🏅",
};

export const QUICK_REPLIES = [
  { label: '📊 My stats', key: 'stats' },
  { label: "🌿 I'm stressed", key: 'stressed' },
  { label: '🌳 My Impact Tree', key: 'tree' },
  { label: '💡 Recommend accounts', key: 'recommend' },
];
