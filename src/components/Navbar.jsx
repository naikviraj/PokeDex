import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Heart, Globe, Layers, Home, Shuffle } from 'lucide-react';
import { usePokemonStore } from '../store/usePokemonStore';

const navItems = [
  { label: 'Pokédex',   page: 'pokedex',   icon: Home },
  { label: 'Regions',   page: 'regions',   icon: Globe },
  { label: 'Types',     page: 'types',     icon: Layers },
  { label: 'Favorites', page: 'favorites', icon: Heart },
  { label: 'Random',    page: 'random',    icon: Shuffle },
];

const Navbar = ({ onNavigate, currentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const favorites = usePokemonStore(s => s.favorites);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
          whileHover={{ scale: 1.03 }}
          onClick={() => onNavigate('home')}
        >
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'conic-gradient(from 180deg, #FF3B3B 0deg 180deg, #fff 180deg 360deg)',
            position: 'relative', boxShadow: '0 0 16px rgba(255,59,59,0.4)',
            flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0, height: '2px',
              background: '#111', transform: 'translateY(-50%)',
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 10, height: 10, background: '#fff', border: '2px solid #111',
              borderRadius: '50%', transform: 'translate(-50%, -50%)',
            }} />
          </div>
          <span style={{
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.2rem',
            background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            PokéDex
          </span>
          <div style={{
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
            color: '#fff', fontSize: '0.6rem', fontWeight: 700,
            padding: '0.1rem 0.45rem', borderRadius: '100px', letterSpacing: '0.05em',
          }}>
            PRO
          </div>
        </motion.div>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {navItems.map(({ label, page, icon: Icon }) => (
            <motion.button
              key={page}
              className={`nav-link ${currentPage === page ? 'active' : ''}`}
              onClick={() => onNavigate(page)}
              style={{
                background: 'none', border: 'none',
                padding: '0.5rem 0.9rem',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                borderRadius: '100px',
                position: 'relative',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon size={14} />
              <span style={{ fontSize: '0.88rem' }}>{label}</span>
              {page === 'favorites' && favorites.length > 0 && (
                <motion.span
                  style={{
                    position: 'absolute', top: 2, right: 2,
                    background: '#EF4444', color: '#fff',
                    fontSize: '0.6rem', fontWeight: 700,
                    width: 16, height: 16, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {favorites.length}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Catchphrase */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.4, fontSize: '0.75rem' }}>
          <Zap size={12} />
          <span>Gotta catch 'em all</span>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
