import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ message = 'Loading Pokédex...' }) => (
  <motion.div
    className="loading-screen"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="loading-ball"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
    <motion.p
      style={{ marginTop: '2rem', color: 'rgba(240,240,255,0.6)', fontFamily: 'Space Grotesk', fontSize: '1rem', letterSpacing: '0.05em' }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {message}
    </motion.p>
    <motion.div
      style={{
        marginTop: '1rem',
        display: 'flex',
        gap: '0.4rem',
      }}
    >
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.div>
  </motion.div>
);

export default LoadingScreen;
