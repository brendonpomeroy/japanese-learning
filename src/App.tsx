
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Lessons from './components/Lessons';
import Practice from './components/Practice';
import Phrases from './pages/Phrases';
import Hiragana from './pages/Hiragana';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/phrases" element={<Phrases />} />
            <Route path="/hiragana" element={<Hiragana />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App
