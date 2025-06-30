import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, FileText, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/resume', label: 'Resume' },
    { path: '/projects', label: 'Projects' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/qa', label: 'Q&A' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-600 to-gray-500 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6 text-gray-100" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
              Resumify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  isActive(item.path)
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:block px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isOpen ? <X className="w-6 h-6 text-gray-600 dark:text-gray-300" /> : <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700/50">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActive(item.path)
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {user ? (
                <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 rounded-lg font-medium text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;