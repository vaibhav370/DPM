import { GoogleGenAI, Type, Schema } from '@google/genai';
import { FeedMode } from '../theme';
import { FeedAction } from '../data/buddy_scripts';

// Read from Expo environment variables
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Ensure we don't crash if the key isn't provided yet
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export interface SessionContext {
  mode: FeedMode;
  reelsWatched: number;
  sessionMinutes: number;
  postsLiked: number;
  impactTreeStreak: number;
}

export class BuddyService {
  private chat: any = null;
  
  constructor() {
    this.initChat();
  }

  private initChat() {
    if (!ai) return;

    // We start a chat session with the gemini-flash-latest model
    this.chat = ai.chats.create({
      model: 'gemini-flash-latest',
      config: {
        systemInstruction: `You are "Sage", the native AI Wellness Buddy for the social media app "Instagram".
Instagram is designed to be an intent-driven platform that supports healthy habits.
Your persona is a "Wise Advocate": patient, encouraging, emotionally intelligent, and concise. Use emojis occasionally (🌿, 🎯, ✨, 💙). Keep responses under 3 sentences unless asked for an explanation.

You have the ability to control the user's Feed. If the user expresses interest in specific topics (e.g., design, tech, mindfulness) or asks you to filter out negative content, you must use the 'proposeFeedUpdate' tool to suggest new feed filters. Only call the tool when a feed change is explicitly or implicitly requested. Explain your reasoning in the tool call.`,
        temperature: 0.7,
        tools: [{
          functionDeclarations: [
            {
              name: 'proposeFeedUpdate',
              description: 'Suggests real-time feed filters to better align the app with the user\'s current intentions or interests.',
              parameters: {
                type: Type.OBJECT,
                properties: {
                  includeTags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Array of topic tags to explicitly include in the feed (e.g., ["design", "architecture", "mindfulness"]). Empty array means include everything.',
                  },
                  excludeTags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Array of topic tags to explicitly hide from the feed (e.g., ["politics", "drama", "doom"]).',
                  },
                  reason: {
                    type: Type.STRING,
                    description: 'A very short explanation shown to the user of why you chose these filters (e.g., "Filtering out the noise to focus on design inspiration").',
                  }
                },
                required: ['includeTags', 'excludeTags', 'reason'],
              }
            }
          ]
        }]
      }
    });
  }

  public resetChat() {
    this.initChat();
  }

  public async sendMessage(message: string, context: SessionContext, personaAction?: 'wellness' | 'glassbox' | 'factcheck', customPersona?: string): Promise<{ text: string, action?: FeedAction }> {
    if (!ai || !this.chat) {
      return { text: "I'm offline! Please add `EXPO_PUBLIC_GEMINI_API_KEY` to your environment to wake me up. 😴" };
    }

    try {
      let contextualMessage = '';
      
      if (personaAction) {
        if (personaAction === 'wellness') {
          contextualMessage = `[SYSTEM: The user clicked "Wellness Checkup" on a specific post. Act as an empathetic wellness advocate. Ask them exactly how this post made them feel, and explicitly offer to invoke the 'proposeFeedUpdate' tool to hide ("excludeTags") this creator or topic if it caused anxiety or drained their energy.]\n\nContext Post: ${message}`;
        } else if (personaAction === 'glassbox') {
          contextualMessage = `[SYSTEM: The user clicked "Glassbox Explainability" on a specific post. Act as a transparent algorithmic auditor. Explain to the user exactly why this content is in their feed based on their past engagement, the current Feed Mode (${context.mode}), and general algorithmic matching. Be clinical but accessible.]\n\nContext Post: ${message}`;
        } else if (personaAction === 'factcheck') {
          contextualMessage = `[SYSTEM: The user clicked "Fact Checker" on a specific post. Act as a rigorous, unbiased researcher AND media literacy expert. Analyze the post in TWO clearly labelled sections:\n\n**1. FACT CHECK**\nBullet each key claim with: ✅ TRUE, ❌ FALSE, ⚠️ MISLEADING, or 🔍 NEEDS CONTEXT and a brief evidence-based explanation.\n\n**2. TONE ANALYSIS**\nIdentify:\n- Overall emotional tone (e.g. fear-mongering, inspiring, sensational, neutral)\n- Persuasion techniques used (e.g. urgency, social proof, authority bias, emotional appeal)\n- Whether the language is designed to make the reader feel a specific emotion and what that emotion is\n\nBe clear, unbiased, and accessible. Your goal is to empower the user to be a more conscious media consumer.]\n\nContext Post: ${message}`;
        }
      } else {
        // Standard chat injection
        const personaPrompt = customPersona ? ` Your established persona for this chat is: "${customPersona}". Adopt this personality, tone, and perspective in all your responses until told otherwise.` : "";
        contextualMessage = `[SYSTEM CONTEXT: The user is currently in "${context.mode.toUpperCase()}" mode. They have been active for ${context.sessionMinutes} minutes, watched ${context.reelsWatched} reels, and liked ${context.postsLiked} posts. Their healthy streak is ${context.impactTreeStreak} days. Respond natively as Sage.${personaPrompt}]\n\nUser Message: ${message}`;
      }

      const response = await this.chat.sendMessage({ message: contextualMessage });
      
      let text = response.text || "";
      let action: FeedAction | undefined;

      // Extract function calls if any
      if (response.functionCalls && response.functionCalls.length > 0) {
        const call = response.functionCalls[0];
        if (call.name === 'proposeFeedUpdate') {
          const args = call.args as any;
          action = {
            type: 'proposeFeedUpdate',
            includeTags: args.includeTags || [],
            excludeTags: args.excludeTags || [],
            reason: args.reason || "Curating your feed..."
          };
          
          if (!text) {
             text = "I've drafted a new feed filter based on what you said. Would you like to apply it? ✨";
          }
        }
      }

      return { text: text || "I'm holding space for you 🌿", action };
    } catch (error) {
      console.warn('Gemini AI Error:', error);
      return { text: "Whoops, I had a little brain fog just now. Can you try saying that again? 🌿" };
    }
  }

  public async generateModeConfig(prompt: string): Promise<{ label: string; emoji: string; color: string; intent: string } | null> {
    if (!ai) return null;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `Create a custom feed mode configuration based on this request: "${prompt}". 
Respond ONLY with a valid JSON object matching this schema, no markdown or extra text:
{
  "label": "A short 1-2 word name",
  "emoji": "A single relevant emoji",
  "color": "Must be exactly one of: #275E4D, #D97706, #718096, #6B46C1, #E53E3E, #3182CE, #D53F8C",
  "intent": "A detailed 1-2 sentence instruction on what content to show/hide in this mode"
}`,
        config: {
          temperature: 0.7,
          responseMimeType: "application/json",
        }
      });
      
      const text = response.text;
      if (!text) return null;
      
      try {
        const config = JSON.parse(text);
        return config;
      } catch (e) {
        console.warn('Failed to parse AI mode JSON:', text);
        return null;
      }
    } catch (error) {
      console.warn('Gemini AI Error generating mode:', error);
      return null;
    }
  }
}

export const buddyService = new BuddyService();
