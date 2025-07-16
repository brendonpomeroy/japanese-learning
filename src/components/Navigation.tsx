import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 dark:bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold" onClick={closeMobileMenu}>
            Japanese Lessons
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-blue-200 dark:hover:text-blue-300 transition-colors ${
                isActive('/') ? 'text-blue-200 dark:text-blue-300 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/phrases" 
              className={`hover:text-blue-200 dark:hover:text-blue-300 transition-colors ${
                isActive('/phrases') ? 'text-blue-200 dark:text-blue-300 font-semibold' : ''
              }`}
            >
              Phrases
            </Link>
            <Link 
              to="/hiragana" 
              className={`hover:text-blue-200 dark:hover:text-blue-300 transition-colors ${
                isActive('/hiragana') ? 'text-blue-200 dark:text-blue-300 font-semibold' : ''
              }`}
            >
              Hiragana
            </Link>
            <Link 
              to="/practice" 
              className={`hover:text-blue-200 dark:hover:text-blue-300 transition-colors ${
                isActive('/practice') ? 'text-blue-200 dark:text-blue-300 font-semibold' : ''
              }`}
            >
              Practice
            </Link>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`block w-6 h-0.5 bg-white dark:bg-gray-300 transition-transform duration-300 ${
              isMobileMenuOpen ? 'transform rotate-45 translate-y-2' : ''
            }`}></span>
            <span className={`block w-6 h-0.5 bg-white dark:bg-gray-300 transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}></span>
            <span className={`block w-6 h-0.5 bg-white dark:bg-gray-300 transition-transform duration-300 ${
              isMobileMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''
            }`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="py-4 space-y-2 border-t border-blue-500 dark:border-blue-400">
            <Link 
              to="/" 
              className={`block py-2 px-4 hover:bg-blue-700 dark:hover:bg-blue-700 rounded transition-colors ${
                isActive('/') ? 'bg-blue-700 dark:bg-blue-700 font-semibold' : ''
              }`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              to="/phrases" 
              className={`block py-2 px-4 hover:bg-blue-700 dark:hover:bg-blue-700 rounded transition-colors ${
                isActive('/phrases') ? 'bg-blue-700 dark:bg-blue-700 font-semibold' : ''
              }`}
              onClick={closeMobileMenu}
            >
              Phrases
            </Link>
            <Link 
              to="/hiragana" 
              className={`block py-2 px-4 hover:bg-blue-700 dark:hover:bg-blue-700 rounded transition-colors ${
                isActive('/hiragana') ? 'bg-blue-700 dark:bg-blue-700 font-semibold' : ''
              }`}
              onClick={closeMobileMenu}
            >
              Hiragana
            </Link>
            <Link 
              to="/practice" 
              className={`block py-2 px-4 hover:bg-blue-700 dark:hover:bg-blue-700 rounded transition-colors ${
                isActive('/practice') ? 'bg-blue-700 dark:bg-blue-700 font-semibold' : ''
              }`}
              onClick={closeMobileMenu}
            >
              Practice
            </Link>
            <div className="py-2 px-4 border-t border-blue-500 dark:border-blue-400 mt-2 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-white dark:text-gray-300 text-sm">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
