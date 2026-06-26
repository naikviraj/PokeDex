import React from 'react';
import { motion } from 'framer-motion';
import { regions } from '../utils/typeConfig';

const regionGradients = [
  'linear-gradient(135deg, #E74C3C, #C0392B)',
  'linear-gradient(135deg, #3498DB, #2980B9)',
  'linear-gradient(135deg, #2ECC71, #27AE60)',
  'linear-gradient(135deg, #9B59B6, #8E44AD)',
  'linear-gradient(135deg, #1ABC9C, #16A085)',
  'linear-gradient(135deg, #E91E63, #C2185B)',
  'linear-gradient(135deg, #FF9800, #F57C00)',
  'linear-gradient(135deg, #607D8B, #455A64)',
  'linear-gradient(135deg, #F44336, #B71C1C)',
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const RegionExplorer = ({ onSelectRegion }) => (
  <div className="section">
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}
    >
      <h2 className="section-title gradient-text">Explore Regions</h2>
      <p className="section-sub">9 unique worlds, each with their own Pokémon.</p>
    </motion.div>

    <motion.div
      variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}
    >
      {regions.map((region, i) => (
        <motion.div
          key={region.name}
          variants={item}
          whileHover={{ scale: 1.04, y: -6 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectRegion(region)}
          style={{
            background: `${regionGradients[i]}`,
            borderRadius: 20, padding: '1.5rem', cursor: 'pointer',
            position: 'relative', overflow: 'hidden', minHeight: 140,
            boxShadow: `0 8px 30px rgba(0,0,0,0.4)`,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* BG orb */}
          <div style={{
            position: 'absolute', right: -20, bottom: -20,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }} />
          <div style={{
            position: 'absolute', right: 10, top: 10,
            width: 60, height: 60, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.3rem' }}>
              {region.name}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.6rem', lineHeight: 1.4 }}>
              {region.description}
            </div>
            <div style={{
              display: 'inline-block', background: 'rgba(0,0,0,0.25)',
              borderRadius: '100px', padding: '0.2rem 0.7rem', fontSize: '0.7rem', fontWeight: 600,
            }}>
              #{region.range[0]} – #{region.range[1]}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

export default RegionExplorer;
