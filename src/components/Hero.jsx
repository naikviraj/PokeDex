import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

const TYPING_WORDS = [
  'Discover Every Pokémon.',
  'Explore 1000+ Species.',
  'Battle. Train. Evolve.',
  'Your Journey Starts Here.',
];

const Hero = ({ onExplore, onRandom }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const silhouetteX = useTransform(springX, [-1, 1], [-18, 18]);
  const silhouetteY = useTransform(springY, [-1, 1], [-10, 10]);

  // Typing animation
  useEffect(() => {
    const word = TYPING_WORDS[textIndex];
    let i = typing ? displayed.length : displayed.length;
    let timeout;

    if (typing) {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
      } else {
        timeout = setTimeout(() => setTyping(false), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
      } else {
        setTextIndex((prev) => (prev + 1) % TYPING_WORDS.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, textIndex]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  * 2 - 1;
    const y = (e.clientY - rect.top)  / rect.height * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <section className="hero" onMouseMove={handleMouseMove}>
      {/* Background Layers */}
      <div className="hero-gradient" />
      <ParticleBackground count={80} color="rgba(124,58,237,0.35)" />

      {/* Giant Pokéball BG */}
      <motion.div
        className="pokeball-bg"
        style={{
          width: 'min(700px, 90vw)', height: 'min(700px, 90vw)',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      {/* Glowing orbs */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        top: '10%', left: '5%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)',
        bottom: '15%', right: '8%', pointerEvents: 'none',
      }} />

      {/* Floating Pokémon Silhouettes */}
      <motion.div
        style={{ position: 'absolute', right: '8%', top: '15%', x: silhouetteX, y: silhouetteY, pointerEvents: 'none' }}
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/6.svg"
            alt=""
            style={{ width: 200, height: 200, filter: 'brightness(0) invert(1) opacity(0.08)' }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ position: 'absolute', left: '6%', bottom: '20%', x: useTransform(springX, [-1,1],[10,-10]), pointerEvents: 'none' }}
      >
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg"
            alt=""
            style={{ width: 130, height: 130, filter: 'brightness(0) invert(1) opacity(0.07)' }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ position: 'absolute', right: '20%', bottom: '10%', pointerEvents: 'none' }}
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [2, -2, 2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/9.svg"
            alt=""
            style={{ width: 110, height: 110, filter: 'brightness(0) invert(1) opacity(0.07)' }}
          />
        </motion.div>
      </motion.div>

      {/* Main Hero Content */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '0 1.5rem', maxWidth: 900, width: '100%' }}>
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Badge */}
          <motion.div variants={item} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '100px', padding: '0.4rem 1.2rem',
              fontSize: '0.8rem', fontWeight: 600, color: '#A78BFA',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#A78BFA', animation: 'loadSpin 1s infinite' }} />
              1025+ Pokémon • All Regions • Live Data
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={item} style={{
            fontSize: 'clamp(2.8rem, 8vw, 6rem)', fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #ffffff 30%, rgba(255,255,255,0.5) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            The Ultimate
          </motion.h1>

          <motion.h1 variants={item} style={{
            fontSize: 'clamp(2.8rem, 8vw, 6rem)', fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 50%, #EF4444 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Pokédex
          </motion.h1>

          {/* Typing Text */}
          <motion.div variants={item} style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 400,
            color: 'rgba(240,240,255,0.65)', marginBottom: '2.5rem',
            minHeight: '2.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}>
            <span>{displayed}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
              style={{ marginLeft: 2, display: 'inline-block', width: 2, height: '1.2em', background: '#A78BFA', borderRadius: 1, verticalAlign: 'middle' }}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={item} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              className="btn-primary"
              onClick={onExplore}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              style={{ fontSize: '1rem', padding: '0.9rem 2.2rem' }}
            >
              ✦ Explore Pokédex
            </motion.button>
            <motion.button
              className="btn-secondary"
              onClick={onRandom}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              style={{ fontSize: '1rem', padding: '0.9rem 2.2rem' }}
            >
              🎲 Random Pokémon
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: 'absolute', bottom: '2.5rem', left: '50%',
          transform: 'translateX(-50%)', zIndex: 5,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
          color: 'rgba(240,240,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em',
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>SCROLL</span>
        <div className="bounce-ball" style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'conic-gradient(from 180deg, #FF3B3B 0deg 180deg, #fff 180deg 360deg)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1.5px', background: '#111', transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 6, height: 6, background: '#fff', border: '1px solid #111', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
