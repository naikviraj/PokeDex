import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PokedexPage from './components/PokedexPage';
import RegionExplorer from './components/RegionExplorer';
import TypeExplorer from './components/TypeExplorer';
import FavoritesPage from './components/FavoritesPage';
import RandomPokemon from './components/RandomPokemon';
import PokemonModal from './components/PokemonModal';
import LoadingScreen from './components/LoadingScreen';
import { usePokemonStore } from './store/usePokemonStore';
import './assets/Components/style.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.25 } },
};

function AppInner() {
  const [currentPage, setCurrentPage] = useState('home');
  const [appReady, setAppReady] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setAppReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplore = () => {
    navigate('pokedex');
    setTimeout(() => {
      document.getElementById('pokedex-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleRandom = () => navigate('random');

  const handleSelectRegion = (region) => {
    setActiveRegion(region);
    setActiveType(null);
    navigate('pokedex');
  };

  const handleSelectType = (type) => {
    setActiveType(type);
    setActiveRegion(null);
    navigate('pokedex');
  };

  const handleCardClick = (pokemon) => {
    setSelectedPokemon(pokemon?.name || pokemon);
  };

  if (!appReady) return <LoadingScreen message="Booting Pokédex…" />;

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', position: 'relative' }}>
      <Navbar onNavigate={navigate} currentPage={currentPage} />

      {/* Hero is always at home page */}
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Hero onExplore={handleExplore} onRandom={handleRandom} />

            {/* Below hero — teaser sections */}
            <div style={{ paddingTop: '2rem' }}>
              <RegionExplorer onSelectRegion={handleSelectRegion} />
              <TypeExplorer activeType={null} onSelectType={handleSelectType} />
              <RandomPokemon onCardClick={handleCardClick} />
            </div>
          </motion.div>
        )}

        {currentPage === 'pokedex' && (
          <motion.div key="pokedex" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ paddingTop: '5rem' }}>
            <div id="pokedex-section">
              <PokedexPage
                activeType={activeType}
                onNavigateType={setActiveType}
                activeRegion={activeRegion}
                onCardClick={handleCardClick}
              />
            </div>
          </motion.div>
        )}

        {currentPage === 'regions' && (
          <motion.div key="regions" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ paddingTop: '5rem' }}>
            <RegionExplorer onSelectRegion={handleSelectRegion} />
          </motion.div>
        )}

        {currentPage === 'types' && (
          <motion.div key="types" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ paddingTop: '5rem' }}>
            <TypeExplorer activeType={activeType} onSelectType={handleSelectType} />
          </motion.div>
        )}

        {currentPage === 'favorites' && (
          <motion.div key="favorites" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ paddingTop: '5rem' }}>
            <FavoritesPage onCardClick={handleCardClick} />
          </motion.div>
        )}

        {currentPage === 'random' && (
          <motion.div key="random" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ paddingTop: '5rem' }}>
            <RandomPokemon onCardClick={handleCardClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Modal */}
      <AnimatePresence>
        {selectedPokemon && (
          <PokemonModal
            pokemonName={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem',
        textAlign: 'center',
        color: 'rgba(240,240,255,0.2)',
        fontSize: '0.8rem',
        fontFamily: 'Space Grotesk',
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          Powered by{' '}
          <a href="https://pokeapi.co" target="_blank" rel="noreferrer" style={{ color: 'rgba(167,139,250,0.6)', textDecoration: 'none' }}>
            PokéAPI
          </a>
          {' '}• Built with ♥ and Framer Motion
        </div>
        <div>Pokémon and all related names are trademarks of Nintendo/Game Freak.</div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}

export default App;
