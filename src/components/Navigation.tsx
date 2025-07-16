import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            Japanese Lessons
          </Link>
          <div className="space-x-6">
            <Link 
              to="/" 
              className={`hover:text-blue-200 transition-colors ${
                isActive('/') ? 'text-blue-200 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/phrases" 
              className={`hover:text-blue-200 transition-colors ${
                isActive('/phrases') ? 'text-blue-200 font-semibold' : ''
              }`}
            >
              Phrases
            </Link>
            <Link 
              to="/hiragana" 
              className={`hover:text-blue-200 transition-colors ${
                isActive('/hiragana') ? 'text-blue-200 font-semibold' : ''
              }`}
            >
              Hiragana
            </Link>
            <Link 
              to="/practice" 
              className={`hover:text-blue-200 transition-colors ${
                isActive('/practice') ? 'text-blue-200 font-semibold' : ''
              }`}
            >
              Practice
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
