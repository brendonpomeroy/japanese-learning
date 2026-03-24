import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import { UserMenu, UserMenuMobile } from './UserMenu';

type NavItem = {
  label: string;
  path: string;
  icon: string;
};

type NavGroup = {
  label: string;
  icon: string;
  items: NavItem[];
};

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return 'items' in entry;
}

const navConfig: NavEntry[] = [
  { label: 'Home', path: '/', icon: '🏠' },
  {
    label: 'Learn',
    icon: '📖',
    items: [
      { label: 'Hiragana', path: '/hiragana', icon: 'あ' },
      { label: 'Katakana', path: '/katakana', icon: 'カ' },
      { label: 'Grammar', path: '/grammar', icon: '📝' },
      { label: 'Phrases', path: '/phrases', icon: '💬' },
    ],
  },
  {
    label: 'Practice',
    icon: '✏️',
    items: [
      { label: 'Vocab', path: '/vocab', icon: '📚' },
      { label: 'Flashcards', path: '/flashcards', icon: '🗂️' },
      { label: 'Emoji Quiz', path: '/emoji', icon: '😄' },
      { label: 'Tracing', path: '/tracing', icon: '✍️' },
      { label: 'Kana Practice', path: '/practice', icon: '🎯' },
    ],
  },
];

function isPathActive(path: string, currentPath: string): boolean {
  if (path === '/') return currentPath === '/';
  return currentPath.startsWith(path);
}

function isGroupActive(group: NavGroup, currentPath: string): boolean {
  return group.items.some((item) => isPathActive(item.path, currentPath));
}

// Desktop dropdown component
function NavDropdown({
  group,
  currentPath,
}: {
  group: NavGroup;
  currentPath: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const open = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const close = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const groupActive = isGroupActive(group, currentPath);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={open}
      onMouseLeave={close}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 hover:text-inverse/70 transition-colors ${
          groupActive ? 'text-inverse/70 font-semibold' : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {group.label}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 bg-surface rounded-lg shadow-soft-lg py-2 min-w-48 z-50 border border-border"
          role="menu"
        >
          {group.items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              role="menuitem"
              className={`flex items-center gap-3 px-4 py-2.5 text-primary hover:bg-surface-alt transition-colors ${
                isPathActive(item.path, currentPath)
                  ? 'bg-surface-alt text-accent-blue font-semibold'
                  : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Mobile bottom sheet component
function BottomSheet({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState<'enter' | 'exit' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimating('enter');
    } else if (visible) {
      setAnimating('exit');
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnimationEnd = () => {
    if (animating === 'exit') {
      setVisible(false);
      setAnimating(null);
    } else {
      setAnimating(null);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!visible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-white/30 backdrop-blur-sm z-40 md:hidden dark:bg-black/30 ${
          animating === 'exit' ? 'bottom-sheet-backdrop-exit' : 'bottom-sheet-backdrop-enter'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed bottom-16 left-0 right-0 bg-surface rounded-t-2xl shadow-2xl z-40 md:hidden ${
          animating === 'exit' ? 'bottom-sheet-exit' : 'bottom-sheet-enter'
        }`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  const closeSheet = useCallback(() => setActiveSheet(null), []);

  // Close sheet on route change
  useEffect(() => {
    closeSheet();
  }, [location.pathname, closeSheet]);

  const toggleSheet = (name: string) => {
    setActiveSheet(activeSheet === name ? null : name);
  };

  const handleMobileNav = (path: string) => {
    navigate(path);
    closeSheet();
  };

  const learnGroup = navConfig.find(
    (e) => isGroup(e) && e.label === 'Learn',
  ) as NavGroup;
  const practiceGroup = navConfig.find(
    (e) => isGroup(e) && e.label === 'Practice',
  ) as NavGroup;

  return (
    <>
      {/* Top bar */}
      <nav className="relative z-50 bg-nav-bg text-inverse shadow-lg backdrop-blur-lg border-b border-nav-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-xl font-bold">
              Japanese Lessons
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navConfig.map((entry) =>
                isGroup(entry) ? (
                  <NavDropdown
                    key={entry.label}
                    group={entry}
                    currentPath={location.pathname}
                  />
                ) : (
                  <Link
                    key={entry.path}
                    to={entry.path}
                    className={`hover:text-inverse/70 transition-colors ${
                      isPathActive(entry.path, location.pathname)
                        ? 'text-inverse/70 font-semibold'
                        : ''
                    }`}
                  >
                    {entry.label}
                  </Link>
                ),
              )}
              <div className="ml-4">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50 md:hidden">
        <div className="flex justify-around items-center h-16 w-full">
          {/* Home tab */}
          <button
            onClick={() => handleMobileNav('/')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              location.pathname === '/'
                ? 'text-accent-blue'
                : 'text-secondary'
            }`}
            aria-label="Home"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs mt-0.5">Home</span>
          </button>

          {/* Learn tab */}
          <button
            onClick={() => toggleSheet('learn')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              activeSheet === 'learn' || isGroupActive(learnGroup, location.pathname)
                ? 'text-accent-blue'
                : 'text-secondary'
            }`}
            aria-label="Learn"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-xs mt-0.5">Learn</span>
          </button>

          {/* Practice tab */}
          <button
            onClick={() => toggleSheet('practice')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              activeSheet === 'practice' || isGroupActive(practiceGroup, location.pathname)
                ? 'text-accent-blue'
                : 'text-secondary'
            }`}
            aria-label="Practice"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span className="text-xs mt-0.5">Practice</span>
          </button>

          {/* More tab */}
          <button
            onClick={() => toggleSheet('more')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              activeSheet === 'more'
                ? 'text-accent-blue'
                : 'text-secondary'
            }`}
            aria-label="More"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
            <span className="text-xs mt-0.5">More</span>
          </button>
        </div>
      </div>

      {/* Bottom sheets */}
      <BottomSheet isOpen={activeSheet === 'learn'} onClose={closeSheet}>
        <div className="grid grid-cols-2 gap-3">
          {learnGroup.items.map((item) => (
            <button
              key={item.path}
              onClick={() => handleMobileNav(item.path)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                isPathActive(item.path, location.pathname)
                  ? 'bg-accent-blue/10 text-accent-blue font-semibold'
                  : 'bg-surface-alt text-primary hover:bg-border-light'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet isOpen={activeSheet === 'practice'} onClose={closeSheet}>
        <div className="grid grid-cols-2 gap-3">
          {practiceGroup.items.map((item) => (
            <button
              key={item.path}
              onClick={() => handleMobileNav(item.path)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                isPathActive(item.path, location.pathname)
                  ? 'bg-accent-blue/10 text-accent-blue font-semibold'
                  : 'bg-surface-alt text-primary hover:bg-border-light'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet isOpen={activeSheet === 'more'} onClose={closeSheet}>
        <div className="space-y-3">
          <UserMenuMobile />
        </div>
      </BottomSheet>
    </>
  );
}

export default Navigation;
