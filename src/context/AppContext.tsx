import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FeedMode } from '../theme';
import { Post } from '../data/posts';

interface SessionStats {
  reelsWatched: number;
  sessionMinutes: number;
  postsLiked: number;
  lastCheckIn: Date | null;
}

interface AppState {
  mode: FeedMode;
  buddyOpen: boolean;
  impactTreeStreak: number;
  sessionStats: SessionStats;
  username: string;
  buddyName: string;
  onboardingDone: boolean;
  feedFilters: {
    includeTags: string[];
    excludeTags: string[];
  };
  isAuthenticated: boolean;
  activePostContext: Post | null;
  customModes: Record<string, { label: string; emoji: string; color: string; intent: string }>;
  showStatBar: boolean;
  attentionBudget: {
    type: 'count' | 'time';
    value: number;
  };
  sagePersona: string;
}

type AppAction =
  | { type: 'SET_MODE'; payload: FeedMode }
  | { type: 'TOGGLE_BUDDY' }
  | { type: 'CLOSE_BUDDY' }
  | { type: 'INCREMENT_REELS' }
  | { type: 'INCREMENT_SESSION_MINUTES' }
  | { type: 'LIKE_POST' }
  | { type: 'CHECK_IN_DONE' }
  | { type: 'COMPLETE_ONBOARDING' }
  | {
      type: 'SET_FEED_FILTERS';
      payload: { includeTags: string[]; excludeTags: string[] };
    }
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'OPEN_BUDDY_WITH_CONTEXT'; payload: Post }
  | { type: 'ADD_CUSTOM_MODE'; payload: { id: string; label: string; emoji: string; color: string; intent: string } }
  | { type: 'REMOVE_CUSTOM_MODE'; payload: string }
  | { type: 'TOGGLE_STAT_BAR' }
  | { type: 'SET_ATTENTION_BUDGET'; payload: { type: 'count' | 'time'; value: number } }
  | { type: 'SET_SAGE_PERSONA'; payload: string };

const initialState: AppState = {
  mode: 'default',
  buddyOpen: false,
  impactTreeStreak: 7,
  sessionStats: {
    reelsWatched: 0,
    sessionMinutes: 0,
    postsLiked: 0,
    lastCheckIn: null,
  },
  username: 'you',
  buddyName: 'Sage',
  onboardingDone: false,
  feedFilters: {
    includeTags: [],
    excludeTags: [],
  },
  isAuthenticated: false,
  activePostContext: null,
  customModes: {},
  showStatBar: false,
  attentionBudget: {
    type: 'count',
    value: 10,
  },
  sagePersona: '',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'TOGGLE_BUDDY':
      return { ...state, buddyOpen: !state.buddyOpen, activePostContext: null };
    case 'CLOSE_BUDDY':
      return { ...state, buddyOpen: false };
    case 'INCREMENT_REELS':
      return {
        ...state,
        sessionStats: {
          ...state.sessionStats,
          reelsWatched: state.sessionStats.reelsWatched + 1,
        },
      };
    case 'INCREMENT_SESSION_MINUTES':
      return {
        ...state,
        sessionStats: {
          ...state.sessionStats,
          sessionMinutes: state.sessionStats.sessionMinutes + 1,
        },
      };
    case 'LIKE_POST':
      return {
        ...state,
        sessionStats: {
          ...state.sessionStats,
          postsLiked: state.sessionStats.postsLiked + 1,
        },
      };
    case 'CHECK_IN_DONE':
      return {
        ...state,
        sessionStats: { ...state.sessionStats, lastCheckIn: new Date() },
      };
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingDone: true };
    case 'SET_FEED_FILTERS':
      return { 
        ...state, 
        feedFilters: {
          includeTags: action.payload.includeTags || [],
          excludeTags: action.payload.excludeTags || [],
        }
      };
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    case 'OPEN_BUDDY_WITH_CONTEXT':
      return { ...state, buddyOpen: true, activePostContext: action.payload };
    case 'CLOSE_BUDDY':
      return { ...state, buddyOpen: false, activePostContext: null };
    case 'ADD_CUSTOM_MODE':
      return {
        ...state,
        customModes: {
          ...state.customModes,
          [action.payload.id]: action.payload,
        },
      };
    case 'REMOVE_CUSTOM_MODE': {
      const newCustomModes = { ...state.customModes };
      delete newCustomModes[action.payload];
      const newMode = state.mode === action.payload ? 'default' : state.mode;
      return {
        ...state,
        customModes: newCustomModes,
        mode: newMode as FeedMode,
      };
    }
    case 'TOGGLE_STAT_BAR':
      return { ...state, showStatBar: !state.showStatBar };
    case 'SET_ATTENTION_BUDGET':
      return { ...state, attentionBudget: action.payload };
    case 'SET_SAGE_PERSONA':
      return { ...state, sagePersona: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
