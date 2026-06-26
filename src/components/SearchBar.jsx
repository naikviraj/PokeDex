import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, Mic } from 'lucide-react';
import { usePokemonStore } from '../store/usePokemonStore';
import { useAllPokemonNames } from '../hooks/usePokemon';

const SearchBar = ({ onSearch, onClear, searchQuery }) => {
  const [focused, setFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const { recentSearches, addRecentSearch, clearRecentSearches } = usePokemonStore();
  const { data: allNames } = useAllPokemonNames();

  useEffect(() => { setLocalQuery(searchQuery || ''); }, [searchQuery]);

  useEffect(() => {
    if (!localQuery || !allNames) {
      setSuggestions([]);
      return;
    }
    const q = localQuery.toLowerCase();
    const matches = allNames
      .filter(p => p.name.includes(q))
      .slice(0, 8)
      .map(p => p.name);
    setSuggestions(matches);
  }, [localQuery, allNames]);

  const handleChange = (e) => {
    setLocalQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleSelect = (name) => {
    setLocalQuery(name);
    onSearch(name);
    addRecentSearch(name);
    setFocused(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setLocalQuery('');
    onClear();
    inputRef.current?.focus();
  };

  const showDropdown = focused && (localQuery ? suggestions.length > 0 : recentSearches.length > 0);

  return (
    <div className="search-container" style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <motion.div
        animate={{ scale: focused ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
        style={{ position: 'relative' }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <motion.div
            animate={{ rotate: focused ? 15 : 0, scale: focused ? 1.1 : 1 }}
            style={{ position: 'absolute', left: '1.2rem', color: focused ? '#A78BFA' : 'rgba(240,240,255,0.35)', zIndex: 1, pointerEvents: 'none' }}
          >
            <Search size={18} />
          </motion.div>

          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search Pokémon by name or number..."
            value={localQuery}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            style={{
              width: '100%', padding: '0.95rem 3.5rem 0.95rem 3.2rem',
              borderRadius: '100px',
            }}
          />

          <div style={{ position: 'absolute', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AnimatePresence>
              {localQuery && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={handleClear}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(240,240,255,0.6)' }}
                >
                  <X size={12} />
                </motion.button>
              )}
            </AnimatePresence>
            <div style={{ color: 'rgba(240,240,255,0.25)', cursor: 'pointer' }}>
              <Mic size={16} />
            </div>
          </div>
        </div>

        {/* Loading pulse */}
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: -1, borderRadius: '100px',
                boxShadow: '0 0 0 3px rgba(124,58,237,0.2)',
                pointerEvents: 'none', zIndex: -1,
              }}
            />
          )}
        </AnimatePresence>

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              className="search-dropdown"
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {!localQuery && recentSearches.length > 0 && (
                <>
                  <div style={{ padding: '0.75rem 1rem 0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(240,240,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent</span>
                    <button onClick={clearRecentSearches} style={{ background: 'none', border: 'none', color: 'rgba(240,240,255,0.3)', fontSize: '0.75rem', cursor: 'pointer' }}>Clear</button>
                  </div>
                  {recentSearches.map(s => (
                    <DropdownItem key={s} icon={<Clock size={14} />} label={s} onClick={() => handleSelect(s)} />
                  ))}
                </>
              )}
              {localQuery && suggestions.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <DropdownItem icon={<Search size={14} />} label={name} onClick={() => handleSelect(name)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const DropdownItem = ({ icon, label, onClick }) => (
  <button
    onMouseDown={onClick}
    style={{
      width: '100%', background: 'none', border: 'none', cursor: 'pointer',
      padding: '0.7rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
      color: 'rgba(240,240,255,0.7)', fontSize: '0.9rem', textAlign: 'left',
      transition: 'background 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
    onMouseLeave={e => e.currentTarget.style.background = 'none'}
  >
    <span style={{ color: 'rgba(240,240,255,0.3)' }}>{icon}</span>
    <span style={{ textTransform: 'capitalize' }}>{label}</span>
  </button>
);

export default SearchBar;
