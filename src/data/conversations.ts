export interface Conversation {
  id: string;
  user: { username: string; avatar: string; online: boolean };
  lastMessage: string;
  time: string;
  unread: number;
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    user: { username: 'gauravmishra_2.0', avatar: '🌊', online: true },
    lastMessage: 'That beach photo was 🔥',
    time: '2m',
    unread: 3,
  },
  {
    id: 'c2',
    user: { username: 'the.poetry.republic', avatar: '📖', online: false },
    lastMessage: 'Check out our latest collection!',
    time: '1h',
    unread: 0,
  },
  {
    id: 'c3',
    user: { username: 'sankarsan.studio', avatar: '🎨', online: true },
    lastMessage: 'Would love to collab sometime ✨',
    time: '3h',
    unread: 1,
  },
  {
    id: 'c4',
    user: { username: 'mindfulmornings', avatar: '🌅', online: false },
    lastMessage: 'Thanks for the kind words 🙏',
    time: '1d',
    unread: 0,
  },
  {
    id: 'c5',
    user: { username: 'clearfeed.ai', avatar: '💡', online: true },
    lastMessage: 'Your Buddy Sage has a new insight for you!',
    time: '2d',
    unread: 0,
  },
];
