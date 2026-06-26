import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getTypeConfig } from '../utils/typeConfig';
import { usePokemonStore } from '../store/usePokemonStore';
import TypeBadge from './TypeBadge';

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const statLabels = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  'special-attack': 'SpA', 'special-defense': 'SpD', speed: 'SPD',
};

const statColors = {
  hp: '#FF6B6B', attack: '#FF8C42', defense: '#4ECDC4',
  'special-attack': '#A78BFA', 'special-defense': '#34D399', speed: '#FBBF24',
};

const PokemonCard = ({ data, onClick }) => {
  const cardRef = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const { toggleFavorite, isFavorite } = usePokemonStore();
  const fav = isFavorite(data.id);

  const primaryType = data.types?.[0]?.type?.name || 'normal';
  const cfg = getTypeConfig(primaryType);
  const artwork = data.sprites?.other?.['official-artwork']?.front_default
    || data.sprites?.other?.dream_world?.front_default
    || data.sprites?.front_default;

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 20;
    const sx = ((e.clientX - rect.left) / rect.width) * 100;
    const sy = ((e.clientY - rect.top) / rect.height) * 100;
    setTilt({ x, y });
    setShinePos({ x: sx, y: sy });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleClick = (e) => {
    if (e.target.closest('.fav-btn')) return;
    setFlipped(f => !f);
    if (onClick) onClick(data);
  };

  const maxStat = 255;

  return (
    <div
      ref={cardRef}
      className="pokemon-card-wrapper"
      style={{ width: '100%', height: 380, perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className="pokemon-card-inner"
        animate={{
          rotateY: flipped ? 180 : 0,
          rotateX: flipped ? 0 : tilt.y,
          rotateZ: flipped ? 0 : tilt.x * 0.3,
        }}
        transition={flipped
          ? { type: 'spring', stiffness: 160, damping: 22 }
          : { type: 'spring', stiffness: 300, damping: 30 }
        }
        style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
      >
        {/* ─── FRONT ─────────────────────────── */}
        <motion.div
          className="card-face"
          style={{
            background: `linear-gradient(145deg, ${cfg.bg}ee, #0d0d14ee)`,
            border: `1px solid ${cfg.color}33`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
            padding: '1.4rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
            backfaceVisibility: 'hidden', position: 'absolute', inset: 0,
            borderRadius: 24, overflow: 'hidden',
          }}
          whileHover={{ boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 40px ${cfg.glow}` }}
        >
          {/* Shine overlay */}
          <div
            className="shine-sweep"
            style={{
              background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
              borderRadius: 24,
            }}
          />

          {/* Glow orb */}
          <div style={{
            position: 'absolute', width: 200, height: 200, borderRadius: '50%',
            background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)`,
            top: -40, right: -40, pointerEvents: 'none', opacity: 0.4,
          }} />

          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: cfg.color, letterSpacing: '0.1em', opacity: 0.8 }}>
                #{String(data.id).padStart(4, '0')}
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f0f0ff', lineHeight: 1.2 }}>
                {cap(data.name)}
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                {data.types?.map(t => <TypeBadge key={t.type.name} type={t.type.name} size="sm" />)}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
              <motion.button
                className="fav-btn"
                onClick={(e) => { e.stopPropagation(); toggleFavorite(data); }}
                whileTap={{ scale: 1.4 }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <motion.div
                  animate={{ scale: fav ? [1, 1.4, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    size={20}
                    fill={fav ? '#EF4444' : 'none'}
                    color={fav ? '#EF4444' : 'rgba(240,240,255,0.3)'}
                  />
                </motion.div>
              </motion.button>
              <span style={{ fontSize: '0.7rem', color: 'rgba(240,240,255,0.35)' }}>HP</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FF6B6B' }}>
                {data.stats?.find(s => s.stat.name === 'hp')?.base_stat || '—'}
              </span>
            </div>
          </div>

          {/* Artwork */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {artwork ? (
                <img
                  src={artwork}
                  alt={data.name}
                  loading="lazy"
                  style={{ width: 150, height: 150, objectFit: 'contain', filter: 'drop-shadow(0 10px 30px ' + cfg.glow + ')' }}
                />
              ) : (
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>?</div>
              )}
            </motion.div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', position: 'relative', zIndex: 2 }}>
            {[
              { label: 'Height', value: `${(data.height / 10).toFixed(1)}m` },
              { label: 'Weight', value: `${(data.weight / 10).toFixed(1)}kg` },
              { label: 'Exp', value: data.base_experience || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '0.5rem',
                textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ fontSize: '0.62rem', color: 'rgba(240,240,255,0.4)', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f0f0ff' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Tap hint */}
          <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(240,240,255,0.2)', letterSpacing: '0.1em' }}>
            TAP FOR STATS
          </div>
        </motion.div>

        {/* ─── BACK ──────────────────────────── */}
        <div
          className="card-face card-back"
          style={{
            background: `linear-gradient(145deg, ${cfg.bg}ee, #0a0a12ee)`,
            border: `1px solid ${cfg.color}33`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
            padding: '1.2rem',
            display: 'flex', flexDirection: 'column', gap: '0.6rem',
            backfaceVisibility: 'hidden', position: 'absolute', inset: 0,
            borderRadius: 24, overflow: 'hidden', overflowY: 'auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '0.3rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: cfg.color, letterSpacing: '0.1em' }}>#{String(data.id).padStart(4,'0')}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cap(data.name)} — Stats</div>
          </div>

          {/* Base Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {data.stats?.map(s => (
              <div key={s.stat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(240,240,255,0.5)', fontWeight: 600 }}>{statLabels[s.stat.name] || s.stat.name}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: statColors[s.stat.name] || '#fff' }}>{s.base_stat}</span>
                </div>
                <div className="stat-bar-track">
                  <motion.div
                    className="stat-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.base_stat / maxStat) * 100}%` }}
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                    style={{ background: statColors[s.stat.name] || cfg.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Abilities */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '0.6rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(240,240,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Abilities</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {data.abilities?.map(a => (
                <span key={a.ability.name} style={{
                  fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '100px',
                  background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}33`,
                  fontWeight: 600,
                }}>
                  {cap(a.ability.name)}{a.is_hidden ? ' ✦' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div style={{ textAlign: 'center', fontSize: '0.62rem', color: 'rgba(240,240,255,0.18)', letterSpacing: '0.1em', marginTop: 'auto' }}>
            TAP TO FLIP BACK
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PokemonCard;
