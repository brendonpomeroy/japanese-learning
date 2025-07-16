# Japanese Learning Site - Project Goals

## Overview
Create a React Vite web application for learning Japanese phrases and practicing hiragana characters, including all modifiers (dakuten, handakuten, and combination characters).

## Core Features

### 1. Phrase Learning Module
- **Data Source**: JSON file containing categorized Japanese phrases
- **Categories**: 
  - Learning Japanese (classroom/conversation helpers)
  - Asking Directions (navigation and location)
  - Meeting New People (social introductions)
- **Display Elements**:
  - English phrase
  - Japanese text (kanji/kana)
  - Hiragana version
  - Romaji pronunciation
  - Contextual explanation
  - Word-by-word breakdown with meanings

### 2. Hiragana Memory Exercises
- **Complete Character Set**: All 46 basic hiragana + modifiers
- **Basic Characters**: あ, い, う, え, お, か, き, く, け, こ, etc.
- **Dakuten Modifiers**: が, ぎ, ぐ, げ, ご, ざ, じ, ず, ぜ, ぞ, だ, ぢ, づ, で, ど, ば, び, ぶ, べ, ぼ
- **Handakuten Modifiers**: ぱ, ぴ, ぷ, ぺ, ぽ
- **Combination Characters**: きゃ, きゅ, きょ, しゃ, しゅ, しょ, ちゃ, ちゅ, ちょ, にゃ, にゅ, にょ, ひゃ, ひゅ, ひょ, みゃ, みゅ, みょ, りゃ, りゅ, りょ, ぎゃ, ぎゅ, ぎょ, じゃ, じゅ, じょ, びゃ, びゅ, びょ, ぴゃ, ぴゅ, ぴょ

### 3. Exercise Types
- **Recognition Quiz**: Show hiragana → select romaji
- **Production Quiz**: Show romaji → select hiragana
- **Audio Practice**: Play pronunciation → identify character
- **Stroke Order**: Interactive drawing practice
- **Speed Challenge**: Timed recognition exercises
- **Mixed Practice**: Random combination of all character types

## Technical Requirements

### Frontend Stack
- **Framework**: React with Vite
- **Styling**: Modern CSS/Tailwind for responsive design
- **State Management**: React hooks (useState, useEffect, useContext)
- **Audio**: Web Audio API for pronunciation playback
- **Persistence**: Local storage for progress tracking

### Key Components
- **PhraseCard**: Display individual phrases with all information
- **PhraseCategory**: Organize phrases by category with filtering
- **HiraganaGrid**: Visual grid of all characters for reference
- **ExerciseEngine**: Quiz logic and scoring system
- **ProgressTracker**: User statistics and learning progress
- **AudioPlayer**: Pronunciation playback functionality
- **StrokeOrderCanvas**: Interactive character drawing

## User Experience Goals

### Learning Flow
1. **Character Introduction**: Visual introduction to hiragana with stroke order
2. **Recognition Practice**: Build familiarity with character shapes
3. **Production Practice**: Test ability to identify characters from sound
4. **Phrase Integration**: Use learned characters in real phrases
5. **Progressive Difficulty**: Gradually introduce modifiers and combinations

### Gamification Elements
- **Progress Tracking**: Visual progress bars for each character set
- **Achievement System**: Unlock badges for milestones
- **Streak Counter**: Daily practice streak tracking
- **Performance Analytics**: Success rates and improvement metrics
- **Spaced Repetition**: Focus on characters that need more practice

## Data Structure Requirements

### Character Database
```json
{
  "basic": {"あ": "a", "い": "i", ...},
  "dakuten": {"が": "ga", "ぎ": "gi", ...},
  "handakuten": {"ぱ": "pa", "ぴ": "pi", ...},
  "combinations": {"きゃ": "kya", "きゅ": "kyu", ...}
}
```

### Progress Tracking
- Individual character mastery levels
- Time spent on each exercise type
- Success rates over time
- Difficult characters identification

## Accessibility Features
- **Keyboard Navigation**: Full keyboard support for all exercises
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **High Contrast Mode**: Alternative color schemes
- **Font Size Control**: Adjustable text sizes
- **Audio Alternatives**: Visual feedback for audio elements

## Performance Considerations
- **Lazy Loading**: Load exercise data as needed
- **Caching**: Cache audio files and character images
- **Responsive Design**: Mobile-first approach
- **Offline Support**: Service worker for basic functionality

## Future Enhancements
- **Katakana Support**: Extend to katakana characters
- **Kanji Integration**: Basic kanji learning modules
- **Phrase Audio**: Native speaker recordings for phrases
- **Social Features**: Share progress with friends
- **Advanced Grammar**: Particle and grammar exercises

## Success Metrics
- **Engagement**: Daily active users and session duration
- **Learning Effectiveness**: Character recognition accuracy improvement
- **Retention**: User return rates and long-term usage
- **Completion**: Percentage of users completing character sets

## Technical Implementation Notes
- Use React Router for navigation between exercise types
- Implement context API for global state management
- Create reusable components for different exercise formats
- Ensure mobile responsiveness for touch-based character drawing
- Optimize for performance with React.memo and useMemo
- Implement proper error boundaries for robust user experience

This application should provide a comprehensive, engaging, and effective way to learn Japanese hiragana and essential phrases through interactive exercises and spaced repetition learning techniques.