import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { VocabProvider } from './features/vocab/VocabContext';
import { GrammarProvider } from './features/grammar/GrammarContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Lessons from './components/Lessons';
import Practice from './components/Practice';
import { Phrases } from './pages/Phrases';
import { Hiragana } from './pages/Hiragana';
import { Katakana } from './pages/Katakana';
import { EmojiPage } from './pages/EmojiPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { VocabPage } from './pages/VocabPage';
import { GrammarPacksPage } from './pages/GrammarPacksPage';
import { GrammarPackDetailPage } from './pages/GrammarPackDetailPage';
import { GrammarSessionPage } from './pages/GrammarSessionPage';
import { useTheme } from './hooks/useTheme';

function AppContent() {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    console.log('Theme state changed, isDarkMode:', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-16 md:pb-0">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/phrases" element={<Phrases />} />
        <Route path="/hiragana" element={<Hiragana />} />
        <Route path="/katakana" element={<Katakana />} />
        <Route path="/emoji" element={<EmojiPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/vocab" element={<VocabPage />} />
        <Route path="/grammar" element={<GrammarPacksPage />} />
        <Route path="/grammar/:packId" element={<GrammarPackDetailPage />} />
        <Route path="/grammar/:packId/:mode" element={<GrammarSessionPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <VocabProvider>
        <GrammarProvider>
          <Router>
            <AppContent />
          </Router>
        </GrammarProvider>
      </VocabProvider>
    </AppProvider>
  );
}

export default App;
