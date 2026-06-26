import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { useRandomPokemon } from '../hooks/usePokemon';
import PokemonCard from './PokemonCard';

const RandomPokemon = ({ onCardClick }) => {
  const [randomId, setRandomId] = useState(null);
  const [shaking, setShaking] = useState(false);
  const { data: pokemon, isLoading } = useRandomPokemon(randomId);

  const triggerRandom = () => {
    const id = Math.floor(Math.random() * 1025) + 1;
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setRandomId(id);
    }, 700);
  };

  return (
    <div className="section" style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
      >
        <h2 className="section-title gradient-text">Feeling Lucky?</h2>
        <p className="section-sub">Spin for a random Pokémon from 1025+ species.</p>
      </motion.div>

      {/* Big Pokéball Button */}
      <motion.button
        onClick={triggerRandom}
        animate={shaking ? {
          rotate: [-8, 8, -8, 8, -5, 5, 0],
          x: [-4, 4, -4, 4, 0],
        } : {}}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <motion.div
          animate={isLoading ? { rotate: 360 } : {}}
          transition={isLoading ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
          style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'conic-gradient(from 180deg, #FF3B3B 0deg 180deg, #fff 180deg 360deg)',
            position: 'relative',
            boxShadow: '0 0 60px rgba(255,59,59,0.5), 0 8px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '4px', background: '#222', transform: 'translateY(-50%)' }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 28, height: 28, background: '#fff', border: '4px solid #222',
            borderRadius: '50%', transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 12px rgba(255,255,255,0.5)',
          }} />
        </motion.div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          color: '#fff', borderRadius: '100px', padding: '0.7rem 1.8rem',
          fontSize: '0.95rem', fontWeight: 700,
          boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
        }}>
          <Shuffle size={16} />
          {isLoading ? 'Finding Pokémon…' : 'Random Pokémon'}
        </div>
      </motion.button>

      {/* Result Card */}
      <AnimatePresence mode="wait">
        {pokemon && !isLoading && (
          <motion.div
            key={pokemon.id}
            initial={{ opacity: 0, scale: 0.7, y: 60, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            style={{ maxWidth: 300, margin: '0 auto' }}
          >
            <PokemonCard data={pokemon} onClick={onCardClick} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RandomPokemon;
