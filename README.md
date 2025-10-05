# Japanese Learning Site

A modern, interactive web application for learning Japanese hiragana characters, essential phrases, and vocabulary through emoji recognition. Built with React, Vite, and Tailwind CSS with comprehensive progress tracking and gamification features.

> **⚡ Vibe Coded Disclaimer**: This app was built with an experimental "vibe coding" approach, prioritizing rapid development and creative solutions. While fully functional, you may encounter some quirky implementations and unconventional patterns. Consider it a delightful blend of pragmatic engineering and creative chaos! 🎨

## Features

### 🎯 Phrase Learning Module

- **Categorized Phrases**: Learn essential Japanese phrases organized by context
  - Learning Japanese (classroom/conversation helpers)
  - Asking Directions (navigation and location)
  - Meeting New People (social introductions)
- **Complete Information**: Each phrase includes:
  - English translation
  - Japanese text (kanji/kana)
  - Hiragana version
  - Romaji pronunciation
  - Contextual explanation
  - Word-by-word breakdown with meanings
- **Interactive Features**:
  - Collapsible word breakdowns
  - Text-to-speech pronunciation (browser TTS)
  - Search functionality across all phrase elements

### 🔤 Hiragana Memory Exercises

- **Complete Character Set**: All 104+ hiragana characters including:
  - 46 basic characters (あ, い, う, え, お...)
  - 20 dakuten modifiers (が, ぎ, ぐ, げ, ご...)
  - 5 handakuten modifiers (ぱ, ぴ, ぷ, ぺ, ぽ...)
  - 33 combination characters (きゃ, きゅ, きょ...)
- **Interactive Character Grid**:
  - Click-to-pronounce functionality
  - Category filtering (basic, dakuten, handakuten, combinations)
  - Visual progress indicators
- **Multiple Exercise Types**:
  - **Recognition Quiz**: Show hiragana → select romaji
  - **Production Quiz**: Show romaji → select hiragana
  - **Speed Challenge**: 30-second timed recognition exercises
  - **Mixed Practice**: Random combination of all exercise types
- **Category Selection**: Practice specific character groups

### � Emoji Vocabulary Quiz

- **Visual Learning**: Learn Japanese vocabulary through emoji recognition
- **Japanese-Focused**: Practice identifying Japanese words from visual cues
- **Multiple Writing Systems**: Toggle between three display modes:
  - **漢字/カナ**: Traditional Japanese characters (kanji/katakana)
  - **ひらがな**: Phonetic hiragana characters
  - **Romaji**: Romanized pronunciation
- **Immediate Feedback**: See complete translations when incorrect
- **Comprehensive Vocabulary**: Cover everyday objects, animals, emotions, and activities

### �📊 Progress Tracking & Gamification

- **Character Mastery**: Individual progress tracking (0-100%) for each character
- **Success Rates**: Track accuracy over time for each character
- **Exercise History**: Complete log of all practice sessions
- **Performance Analytics**: Recent success rates and improvement metrics
- **Streak Counter**: Daily practice streak tracking
- **Overall Progress**: Master percentage across all characters
- **Spaced Repetition**: Automatic focus on characters needing more practice

### 🎮 User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Japanese Font Support**: Proper CJK font rendering with fallbacks
- **Interactive Elements**: Smooth animations, hover effects, and transitions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Local Storage**: Persistent progress tracking across sessions
- **Real-time Updates**: Automatic mastery level adjustments

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 7.x
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS 4.x
- **State Management**: React Context API with useReducer
- **Audio**: Web Speech API (Text-to-Speech)
- **Persistence**: Local Storage for progress tracking
- **Package Manager**: npm

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Home.tsx         # Landing page with feature cards
│   ├── Navigation.tsx   # Navigation bar with theme toggle
│   ├── PhraseCard.tsx   # Individual phrase display
│   ├── HiraganaGrid.tsx # Character grid display
│   ├── ExerciseEngine.tsx # Hiragana quiz logic and UI
│   ├── EmojiQuiz.tsx    # Emoji vocabulary quiz component
│   ├── ProgressTracker.tsx # Progress visualization
│   ├── ThemeToggle.tsx  # Dark/light mode toggle
│   └── PhraseCategory.tsx # Category-based phrase view
├── pages/               # Page components
│   ├── Phrases.tsx      # Phrase learning page
│   ├── Hiragana.tsx     # Hiragana study page
│   └── EmojiPage.tsx    # Emoji quiz page
├── context/             # Global state management
│   └── AppContext.tsx   # Application context provider
├── hooks/               # Custom React hooks
│   ├── useApp.ts        # Context hook
│   └── useTheme.ts      # Theme management hook
├── data/               # Static data and utilities
│   ├── hiraganaData.ts  # Hiragana character data
│   ├── phrasesData.ts   # Japanese phrases data
│   └── emojiData.ts     # Emoji vocabulary data
├── assets/             # Static assets
│   ├── emojis.json      # Emoji vocabulary dataset
│   └── japanese_phrases_json.json # Phrases dataset
├── types/              # TypeScript type definitions
│   └── index.ts         # Application types
└── public/             # Public static assets
    └── vite.svg         # Vite logo
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/japanese-learning-site.git
cd japanese-learning-site
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Application Routes

- `/` - Home page with progress overview and feature cards
- `/phrases` - Phrase learning with categories and search
- `/hiragana` - Hiragana character study and interactive grid
- `/emoji` - Emoji vocabulary quiz with Japanese word recognition
- `/practice` - Exercise selection and hiragana quiz interface

## Data Structure

### Phrases Format (JSON)

```json
{
  "japanese_phrases": {
    "learning_japanese": [
      {
        "english": "Please repeat that",
        "japanese": "もう一度言ってください",
        "hiragana": "もういちどいってください",
        "romaji": "mou ichido itte kudasai",
        "explanation": "Polite request to have someone repeat what they just said",
        "word_breakdown": {
          "もう": "mou - already/again",
          "一度": "ichido - once/one time",
          "言って": "itte - to say (te-form)",
          "ください": "kudasai - please (polite request)"
        }
      }
    ],
    "asking_directions": [...],
    "meeting_new_people": [...]
  }
}
```

### Character Data Format (TypeScript)

```typescript
export const hiraganaData = {
  basic: {"あ": "a", "い": "i", "う": "u", ...},
  dakuten: {"が": "ga", "ぎ": "gi", "ぐ": "gu", ...},
  handakuten: {"ぱ": "pa", "ぴ": "pi", "ぷ": "pu", ...},
  combinations: {"きゃ": "kya", "きゅ": "kyu", "きょ": "kyo", ...}
};
```

### Progress Data Structure

```typescript
interface ProgressData {
  characterMastery: Record<string, number>; // 0-100 mastery level
  exerciseHistory: ExerciseResult[];
  timeSpent: Record<string, number>;
  successRates: Record<string, number>;
  streak: number;
  lastPracticeDate: string;
}
```

## Key Features Implemented

### Exercise Engine

- **Multiple Question Types**: Dynamic quiz generation with multiple choice answers
- **Scoring System**: Real-time scoring with immediate feedback
- **Timer Support**: 30-second speed challenges
- **Auto-advancement**: Automatic progression through questions
- **Result Tracking**: Comprehensive exercise result logging

### Progress System

- **Character Mastery Algorithm**: Automatic mastery level adjustment (+10 correct, -5 incorrect)
- **Success Rate Calculation**: Running accuracy percentage per character
- **Local Storage Persistence**: Progress saved across browser sessions
- **Visual Progress Indicators**: Color-coded progress bars and percentages

### User Interface

- **Responsive Grid Layout**: Adaptive character grid for different screen sizes
- **Interactive Elements**: Hover effects, click feedback, smooth transitions
- **Japanese Typography**: Custom font stack with proper CJK character support
- **Accessible Design**: Keyboard navigation and screen reader compatibility

## Exercise Types

### Hiragana Practice (`/practice`)

1. **Recognition Quiz** - Recognition
   - Shows hiragana character
   - Select correct romaji from 4 options
   - Focuses on character recognition skills

2. **Production Quiz** - Production
   - Shows romaji pronunciation
   - Select correct hiragana from 4 options
   - Focuses on character production skills

3. **Speed Challenge** - Speed
   - 30-second timed quiz
   - Mixed question types
   - Rapid-fire character recognition

4. **Mixed Practice** - Mixed
   - Random combination of recognition and production
   - Comprehensive skill testing

### Emoji Vocabulary Quiz (`/emoji`)

5. **Japanese Word Recognition**
   - Shows emoji visual cue
   - Select correct Japanese word from 4 options
   - Toggle between kanji/katakana, hiragana, or romaji display
   - Comprehensive vocabulary learning with immediate feedback

## Progress Tracking Features

- **Character Mastery Levels**: 0-100% progress for each character
- **Success Rate Monitoring**: Accuracy tracking over time
- **Exercise History**: Complete log of all practice sessions
- **Streak Tracking**: Daily practice streak counter
- **Performance Analytics**: Recent activity and improvement metrics

## Browser Features Used

- **Web Speech API**: Text-to-speech for Japanese pronunciation
- **Local Storage**: Persistent progress data
- **Responsive Design**: Mobile-first CSS with Tailwind
- **Modern JavaScript**: ES6+ features with TypeScript

## Currently Implemented

✅ **Complete hiragana character set** (104+ characters)  
✅ **Phrase learning system** with 5 categories  
✅ **Emoji vocabulary quiz** with Japanese word recognition  
✅ **Interactive exercise engine** with 5 quiz types  
✅ **Multiple writing system support** (kanji/katakana, hiragana, romaji)  
✅ **Progress tracking and persistence**  
✅ **Dark/light theme support**  
✅ **Responsive web design**  
✅ **Audio pronunciation support**  
✅ **Search and filtering**  
✅ **Real-time mastery calculation**

## Future Enhancements

- [ ] Audio pronunciation for phrases (native speaker recordings)
- [ ] Stroke order practice with interactive drawing
- [ ] Advanced spaced repetition algorithm
- [ ] Offline support with service workers
- [ ] User accounts and cloud synchronization
- [ ] Katakana character support
- [ ] Basic kanji introduction modules
- [ ] Writing practice with stroke recognition
- [ ] Achievement system and badges
- [ ] Social features and leaderboards

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Accessibility Features

This application includes comprehensive accessibility support:

- Full keyboard navigation support
- Screen reader compatibility with ARIA labels
- High contrast mode support
- Responsive design for all devices
- Semantic HTML structure
- Focus management and visual indicators

## Performance Optimizations

- **React Optimization**: useCallback, useMemo for expensive operations
- **Lazy Loading**: Components loaded on demand
- **Efficient State Management**: Context API with useReducer
- **Optimized Bundle**: Vite build optimization
- **Local Storage Caching**: Reduced API calls for static data

## Browser Support

- Chrome 80+ (recommended)
- Firefox 75+
- Safari 13+
- Edge 80+

**Note**: Text-to-speech features require modern browser support for Web Speech API.
