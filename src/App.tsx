import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { VocabProvider } from './features/vocab/VocabContext';
import { GrammarProvider } from './features/grammar/GrammarContext';
import { CloudSyncModal } from './components/CloudSyncModal';
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
import { TracingPage } from './pages/TracingPage';
import { useTheme } from './hooks/useTheme';

function AppContent() {
  const { isDarkMode, theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [isDarkMode, theme]);

  return (
    <div className="min-h-screen bg-page pb-16 md:pb-0">
      <Navigation />
      <CloudSyncModal />
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
        <Route path="/tracing" element={<TracingPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <VocabProvider>
          <GrammarProvider>
            <Router>
              <AppContent />
            </Router>
          </GrammarProvider>
        </VocabProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
