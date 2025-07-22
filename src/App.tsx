
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Lessons from './components/Lessons';
import Practice from './components/Practice';
import Phrases from './pages/Phrases';
import Hiragana from './pages/Hiragana';
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/phrases" element={<Phrases />} />
        <Route path="/hiragana" element={<Hiragana />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App
