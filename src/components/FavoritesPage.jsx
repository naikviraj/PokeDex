import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { usePokemonStore } from '../store/usePokemonStore';
import PokemonCard from './PokemonCard';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

const FavoritesPage = ({ onCardClick }) => {
  const favorites = usePokemonStore(s => s.favorites);

  if (favorites.length === 0) {
    return (
      <div className="section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ y: [0, -16, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '5rem', marginBottom: '1.5rem' }}
        >
          💔
        </motion.div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>No Favorites Yet</h2>
        <p style={{ color: 'rgba(240,240,255,0.5)', fontSize: '1rem', maxWidth: 360 }}>
          Tap the heart ❤️ on any Pokémon card to add it to your collection.
        </p>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ marginTop: '2rem' }}
        >
          <Heart size={48} color="rgba(239,68,68,0.3)" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title gradient-text">My Favorites</h2>
        <p className="section-sub">{favorites.length} Pokémon in your collection</p>
      </motion.div>

      <motion.div
        className="pokemon-grid"
        variants={container} initial="hidden" animate="show"
        layout
      >
        <AnimatePresence>
          {favorites.map(pokemon => (
            <motion.div key={pokemon.id} variants={item} layout exit={{ opacity: 0, scale: 0.8 }}>
              <PokemonCard data={pokemon} onClick={onCardClick} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FavoritesPage;
