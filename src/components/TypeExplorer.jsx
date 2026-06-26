import React from 'react';
import { motion } from 'framer-motion';
import { typeConfig } from '../utils/typeConfig';

const typeEmojis = {
  fire:'🔥', water:'💧', grass:'🌿', electric:'⚡', ice:'❄️',
  fighting:'🥊', poison:'☠️', ground:'🌍', flying:'🌬️', psychic:'🔮',
  bug:'🐛', rock:'🪨', ghost:'👻', dark:'🌑', dragon:'🐉',
  steel:'⚙️', fairy:'🌸', normal:'⭐',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

const TypeExplorer = ({ activeType, onSelectType }) => (
  <div className="section">
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}
    >
      <h2 className="section-title gradient-text">Browse by Type</h2>
      <p className="section-sub">18 elemental types. Click any to filter the Pokédex.</p>
    </motion.div>

    <motion.div
      className="type-explorer-grid"
      variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
    >
      {Object.entries(typeConfig).map(([type, cfg]) => {
        const isActive = activeType === type;
        return (
          <motion.div
            key={type}
            variants={item}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onSelectType(isActive ? null : type)}
            className="type-explorer-badge"
            style={{
              background: isActive ? `${cfg.color}30` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isActive ? cfg.color : 'rgba(255,255,255,0.07)'}`,
              boxShadow: isActive ? `0 0 20px ${cfg.glow}, inset 0 1px 0 rgba(255,255,255,0.1)` : 'none',
            }}
          >
            {/* Glow bg */}
            {isActive && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 16,
                background: `radial-gradient(circle at center, ${cfg.glow} 0%, transparent 70%)`,
                opacity: 0.3, pointerEvents: 'none',
              }} />
            )}
            <span style={{ fontSize: '1.6rem', position: 'relative' }}>{typeEmojis[type]}</span>
            <span style={{
              fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize',
              color: isActive ? cfg.color : 'rgba(240,240,255,0.7)',
              position: 'relative',
            }}>
              {type}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  </div>
);

export default TypeExplorer;
