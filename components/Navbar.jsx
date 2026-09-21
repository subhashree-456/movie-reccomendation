'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Film, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search Debounce Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const res = await fetch(`/api/movies/search/${encodeURIComponent(searchQuery)}`);
          if (res.ok) {
            const data = await res.json();
            setSearchResults(data);
            setIsDropdownOpen(true);
          }
        } catch (error) {
          console.error('Failed to search movies', error);
        }
      } else {
        setSearchResults([]);
        setIsDropdownOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const onLogout = () => {
    logout();
    router.push('/');
  };

  const handleSelectMovie = (id) => {
    setSearchQuery('');
    setIsDropdownOpen(false);
    router.push(`/movie/${id}`);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-foxBg border-b border-foxBorder' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="px-4 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-foxAccent text-2xl font-bold uppercase tracking-wider shrink-0"
          >
            <Film className="w-6 h-6" /> FILMFOX
          </Link>

          {/* Search Bar */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setIsDropdownOpen(true);
                }}
                className="w-64 bg-slate-900 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-foxAccent focus:ring-1 focus:ring-foxAccent transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>

            {/* Dropdown Suggestions */}
            {isDropdownOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto z-50">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleSelectMovie(result.id)}
                    className="px-4 py-2 hover:bg-slate-800 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors border-b border-slate-800 last:border-b-0"
                  >
                    {result.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                <div className="w-8 h-8 rounded bg-foxPanel border border-foxBorder flex items-center justify-center">
                  <span className="text-foxAccent font-bold">{user.name?.charAt(0)}</span>
                </div>
              </Link>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary flex items-center gap-2 py-1.5 px-4 text-sm">
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
