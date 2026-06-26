import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Zap, Shield, Swords, ChevronRight } from 'lucide-react';
import { usePokemonDetail, usePokemonSpecies, useEvolutionChain } from '../hooks/usePokemon';
import { getTypeConfig } from '../utils/typeConfig';
import TypeBadge from './TypeBadge';

const cap = s => s?.charAt(0).toUpperCase() + s?.slice(1);

const statColors = {
  hp: '#FF6B6B', attack: '#FF8C42', defense: '#4ECDC4',
  'special-attack': '#A78BFA', 'special-defense': '#34D399', speed: '#FBBF24',
};
const statLabels = {
  hp: 'HP', attack: 'Attack', defense: 'Defense',
  'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', speed: 'Speed',
};

const extractChain = (link, arr = []) => {
  arr.push(link.species.name);
  if (link.evolves_to?.length) {
    extractChain(link.evolves_to[0], arr);
  }
  return arr;
};

const PokemonModal = ({ pokemonName, onClose }) => {
  const { data: pokemon } = usePokemonDetail(pokemonName);
  const { data: species } = usePokemonSpecies(pokemonName);
  const [evoUrl, setEvoUrl] = useState(null);
  const { data: evoChain } = useEvolutionChain(evoUrl);
  const [evoImages, setEvoImages] = useState({});
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (species?.evolution_chain?.url) setEvoUrl(species.evolution_chain.url);
  }, [species]);

  const evoNames = evoChain ? extractChain(evoChain.chain) : [];

  useEffect(() => {
    evoNames.forEach(async name => {
      if (evoImages[name]) return;
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const d = await res.json();
        setEvoImages(prev => ({ ...prev, [name]: d.sprites?.other?.['official-artwork']?.front_default || d.sprites?.front_default }));
      } catch {}
    });
  }, [evoNames.join(',')]);

  if (!pokemon) return null;

  const primaryType = pokemon.types?.[0]?.type?.name || 'normal';
  const cfg = getTypeConfig(primaryType);
  const artwork = pokemon.sprites?.other?.['official-artwork']?.front_default
    || pokemon.sprites?.other?.dream_world?.front_default;
  const description = species?.flavor_text_entries?.find(e => e.language.name === 'en')?.flavor_text?.replace(/\f/g, ' ') || '';

  const tabs = ['stats', 'moves', 'evolution', 'about'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 680, maxHeight: '92vh',
            background: `linear-gradient(145deg, ${cfg.bg}f0, #0d0d14f0)`,
            border: `1px solid ${cfg.color}33`,
            borderRadius: 28, overflow: 'hidden',
            boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 60px ${cfg.glow}`,
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.5rem 1.5rem 0',
            background: `linear-gradient(180deg, ${cfg.color}18 0%, transparent 100%)`,
            position: 'relative',
          }}>
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(240,240,255,0.6)',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <motion.img
                src={artwork}
                alt={pokemon.name}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 130, height: 130, objectFit: 'contain', filter: `drop-shadow(0 10px 30px ${cfg.glow})`, flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: cfg.color, letterSpacing: '0.1em' }}>
                  #{String(pokemon.id).padStart(4, '0')}
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                  {cap(pokemon.name)}
                </h2>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {pokemon.types?.map(t => <TypeBadge key={t.type.name} type={t.type.name} size="md" />)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { label: 'Height', val: `${(pokemon.height/10).toFixed(1)}m` },
                    { label: 'Weight', val: `${(pokemon.weight/10).toFixed(1)}kg` },
                    { label: 'Base XP', val: pokemon.base_experience || '—' },
                    { label: 'HP', val: pokemon.stats?.[0]?.base_stat },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '0.4rem 0.7rem' }}>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(240,240,255,0.4)' }}>{label}</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '1rem' }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? cfg.color : 'transparent',
                    color: activeTab === tab ? '#000' : 'rgba(240,240,255,0.5)',
                    border: 'none', borderRadius: '100px 100px 0 0',
                    padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 600,
                    cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
                    fontFamily: 'Space Grotesk',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem 1.5rem' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === 'stats' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pokemon.stats?.map((s, i) => (
                      <div key={s.stat.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(240,240,255,0.6)' }}>{statLabels[s.stat.name]}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: statColors[s.stat.name] || '#fff' }}>{s.base_stat}</span>
                        </div>
                        <div className="stat-bar-track">
                          <motion.div
                            className="stat-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${(s.base_stat / 255) * 100}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                            style={{ background: statColors[s.stat.name] || cfg.color }}
                          />
                        </div>
                      </div>
                    ))}
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '1rem', marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(240,240,255,0.4)', marginBottom: '0.6rem' }}>Abilities</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {pokemon.abilities?.map(a => (
                          <span key={a.ability.name} style={{
                            padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600,
                            background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}33`,
                          }}>
                            {cap(a.ability.name)}{a.is_hidden && <span style={{ opacity: 0.6, marginLeft: 4 }}>(Hidden)</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'moves' && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                      {pokemon.moves?.slice(0, 24).map(m => (
                        <div key={m.move.name} style={{
                          background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '0.5rem 0.75rem',
                          fontSize: '0.78rem', fontWeight: 500, color: 'rgba(240,240,255,0.7)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          {cap(m.move.name.replace('-', ' '))}
                        </div>
                      ))}
                    </div>
                    {pokemon.moves?.length > 24 && (
                      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(240,240,255,0.3)' }}>
                        +{pokemon.moves.length - 24} more moves
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'evolution' && (
                  <div>
                    {evoNames.length > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', padding: '0.5rem 0' }}>
                        {evoNames.map((name, i) => (
                          <React.Fragment key={name}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                              <div style={{
                                width: 80, height: 80, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)', border: `2px solid ${cfg.color}33`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                              }}>
                                {evoImages[name] && <img src={evoImages[name]} alt={name} style={{ width: 70, height: 70, objectFit: 'contain' }} />}
                              </div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{name}</span>
                            </div>
                            {i < evoNames.length - 1 && (
                              <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 30 }}>
                                <div className="evo-line" style={{ flex: 1 }} />
                                <ChevronRight size={14} style={{ color: cfg.color, flexShrink: 0 }} />
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'rgba(240,240,255,0.4)', padding: '2rem' }}>Loading evolution chain…</div>
                    )}
                  </div>
                )}

                {activeTab === 'about' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {description && (
                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '1rem', fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(240,240,255,0.75)' }}>
                        {description}
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      {[
                        { label: 'Habitat', val: cap(species?.habitat?.name) || '—' },
                        { label: 'Generation', val: cap(species?.generation?.name?.replace('generation-', 'Gen ')) || '—' },
                        { label: 'Growth Rate', val: cap(species?.growth_rate?.name) || '—' },
                        { label: 'Capture Rate', val: species?.capture_rate || '—' },
                        { label: 'Base Happiness', val: species?.base_happiness || '—' },
                        { label: 'Is Legendary', val: species?.is_legendary ? '✦ Yes' : 'No' },
                      ].map(({ label, val }) => (
                        <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '0.6rem 0.9rem' }}>
                          <div style={{ fontSize: '0.65rem', color: 'rgba(240,240,255,0.4)', marginBottom: 3 }}>{label}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '1rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(240,240,255,0.4)', marginBottom: '0.75rem' }}>Sprites Gallery</div>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[pokemon.sprites?.front_default, pokemon.sprites?.back_default, pokemon.sprites?.front_shiny, pokemon.sprites?.back_shiny].filter(Boolean).map((src, i) => (
                          <img key={i} src={src} alt="" style={{ width: 64, height: 64, imageRendering: 'pixelated' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PokemonModal;
