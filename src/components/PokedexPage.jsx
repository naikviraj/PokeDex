import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter } from 'lucide-react';
import SearchBar from './SearchBar';
import PokemonCard from './PokemonCard';
import PokemonModal from './PokemonModal';
import { usePokemonByType } from '../hooks/usePokemon';

const LIMIT = 20;

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const SkeletonCard = () => (
  <div className="skeleton" style={{ height: 380, borderRadius: 24 }} />
);

const PokedexPage = ({ activeType, onNavigateType }) => {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const { data: typePokemons, isLoading: typeLoading } = usePokemonByType(activeType);

  const loadPokemons = useCallback(async (currentOffset) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=${LIMIT}`);
      const data = await res.json();
      if (!data.next) setHasMore(false);
      const details = await Promise.all(
        data.results.map(p => fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`).then(r => r.json()))
      );
      setPokemons(prev => {
        const ids = new Set(prev.map(p => p.id));
        return [...prev, ...details.filter(p => !ids.has(p.id))];
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPokemons(0);
  }, []);

  useEffect(() => {
    if (!searchQuery) { setSearchResults([]); return; }
    const controller = new AbortController();
    const doSearch = async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          setSearchResults([data]);
        } else {
          // Try name search from list
          const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1302`, { signal: controller.signal });
          const listData = await listRes.json();
          const matches = listData.results.filter(p => p.name.includes(searchQuery.toLowerCase())).slice(0, 12);
          const details = await Promise.all(matches.map(p => fetch(p.url, { signal: controller.signal }).then(r => r.json())));
          setSearchResults(details);
        }
      } catch (e) {
        if (e.name !== 'AbortError') setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };
    const timer = setTimeout(doSearch, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [searchQuery]);

  const handleLoadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    loadPokemons(newOffset);
  };

  const displayPokemons = activeType ? (typePokemons || [])
    : searchQuery ? searchResults
    : pokemons;

  const loading = activeType ? typeLoading : isLoading || searchLoading;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 24 } },
  };

  return (
    <div className="section">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '2.5rem' }}
      >
        <h2 className="section-title gradient-text">
          {activeType ? `${cap(activeType)} Type` : 'All Pokémon'}
        </h2>
        <p className="section-sub">
          {activeType ? `Showing all ${cap(activeType)}-type Pokémon` : `Explore the complete Pokédex`}
        </p>

        <SearchBar
          onSearch={setSearchQuery}
          onClear={() => setSearchQuery('')}
          searchQuery={searchQuery}
        />

        {activeType && (
          <motion.button
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => onNavigateType(null)}
            className="btn-secondary"
            style={{ marginTop: '1rem', fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}
          >
            × Clear type filter
          </motion.button>
        )}
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="pokemon-grid">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : displayPokemons.length > 0 ? (
        <motion.div
          className="pokemon-grid"
          variants={container} initial="hidden" animate="show" layout
        >
          <AnimatePresence>
            {displayPokemons.map(pokemon => (
              <motion.div key={pokemon.id} variants={item} layout>
                <PokemonCard
                  data={pokemon}
                  onClick={(p) => setSelectedPokemon(p.name)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,240,255,0.35)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <div style={{ fontSize: '1.1rem' }}>No Pokémon found for "{searchQuery}"</div>
        </div>
      )}

      {/* Load More */}
      {!searchQuery && !activeType && hasMore && (
        <motion.div
          style={{ textAlign: 'center', marginTop: '3rem' }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        >
          <motion.button
            className="btn-secondary"
            onClick={handleLoadMore}
            disabled={isLoading}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{ gap: '0.5rem', fontSize: '0.95rem', padding: '0.9rem 2.5rem' }}
          >
            {isLoading ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                ◌
              </motion.span>
            ) : <ChevronDown size={16} />}
            {isLoading ? 'Loading…' : 'Load More Pokémon'}
          </motion.button>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedPokemon && (
          <PokemonModal
            pokemonName={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PokedexPage;
