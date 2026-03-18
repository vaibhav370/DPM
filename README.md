# Instagram: Agentic Wellness Reimagined 🌿

[![Built with Expo](https://img.shields.io/badge/Built_with-Expo-000.svg?style=flat&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Powered by Gemini](https://img.shields.io/badge/Powered_by-Gemini-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![Styled with NativeWind](https://img.shields.io/badge/Styled_with-NativeWind-38BDF8?style=flat)](https://www.nativewind.dev/)

A conceptual reimagining of Instagram—transformed from a passive consumption algorithm into a **user-first, intent-driven agentic ecosystem**. Built specifically to alleviate cognitive overload and empower users to define *how* and *why* they use social media.

This project uses Google's **Gemini 2.0 Flash** to bring an AI Wellness Buddy natively into the UI, dynamically altering the entire app experience on the fly based on conversational instructions.

---

## ✨ Core Features & Paradigm Shifts

### 🤖 Meet Sage: The Global AI Wellness Buddy
Forget hidden algorithms. **Sage** is a conversational AI companion natively integrated across the entire app. Sage holds context on everything you do—how many reels you've watched, which posts you've engaged with, and what Feed Mode is active.
- **Dynamic Control:** Tell Sage you are "feeling anxious" or "want to see UI/UX inspiration," and Sage will proactively update your feed filters via background tool calling.
- **Always Accessible:** Available via a floating action button (FAB) that tracks scrolling state globally.

### 🎭 Custom Feed Intents (Modes)
You shouldn't have to battle the algorithm to curate your feed. Tell Sage exactly what you want the app to be, and it reshapes itself using Gemini's structured JSON Generation:
- **Default Mode:** Standard following feed.
- **Learn Mode:** Strips out engaging Reels and focuses the feed purely on intellectual content.
- **Calm Mode:** Dampens the UI colors, slows down interactions, and prioritizes serene imagery.
- **Create Your Own:** "Vibe check mode," "Workout mode," or "Architecture study mode." Just ask Sage.

### 🔍 "Glassbox" Explainability & Provenance
Instead of a "Black Box" feed, every post has a **Provenance Card**. Tap the `✨` next to a post to summon a contextual AI overlay that gives you three powerful tools:
1. **Wellness Checkup:** "Does this creator drain my energy? Hide them."
2. **Glassbox Auditor:** "Why did the algorithm put this exact post in my current feed?"
3. **Fact Checker:** "Is this reel spreading misinformation? Verify these claims right now."

### 🌳 The Impact Tree (Anti-Doomscrolling)
Gamified mindfulness. Your profile isn't just a grid of photos; it features a dynamic **Impact Tree**.
- If your screen time is low and your intent is high, the tree flourishes.
- If you doomscroll Reels for an hour straight, the tree visibly wilts, gently nudging you to close the app.

---

## 🛠️ Technology Stack

This app is built for a production-grade developer experience across **iOS**, **Android**, and the **Web** using a single codebase.

- **Framework:** [Expo](https://expo.dev/) (React Native) with **Expo Router** (File-based routing)
- **AI Integration:** `@google/genai` (Gemini 1.5/2.0 Flash with advanced tool calling)
- **Styling:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native, heavily optimized using Metro)
- **State Management:** React Context API for cross-view state hydration.
- **Animations:** React Native Reanimated.
- **Data Viz:** Victory Native (for the Impact Tree & analytical graphs).
- **Deployment:** Zero-config Vercel SPA build (`npx expo export`).

---

## 🚀 Getting Started

To run this application locally across any device:

### 1. Clone the Repository
```bash
git clone https://github.com/[your-username]/dpm.git
cd dpm
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure the AI (Gemini)
This app requires a valid Google Gemini API Key.
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and generate a free API Key.
2. In the root directory of the project, create a file named `.env`.
3. Add your key exactly like this:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_copied_api_key_here
   ```
*(Note: As a security best practice, `.env` is intentionally excluded from Git. Never commit your API key!)*

### 4. Start the Application

**For Web (Recommended for instant testing):**
```bash
npm run web
```
This will start the Expo bundler and automatically open the application in your browser.

**For iOS (Mac required):**
```bash
npm run ios
```

**For Android:**
```bash
npm run android
```

---

## 🚢 Deploying to Production (Vercel)

This project has been pre-configured to easily deploy to Vercel as an offline-capable Progressive Web App (PWA) / Single Page Application (SPA).

1. Commit and push your code to a public or private **GitHub Repository**.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New -> Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section.
   - Name: `EXPO_PUBLIC_GEMINI_API_KEY`
   - Value: `[Your API Key]`
5. Click **Deploy**.

Because a `vercel.json` rewrite file is included in the project root, Vercel will automatically handle all Expo Router fallback rules flawlessly.
