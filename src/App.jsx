import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "./assets/Components/Card";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const [loadMore, setLoadMore] = useState('https://pokeapi.co/api/v2/pokemon?offset=0&limit=10');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const scrollPositionRef = useRef(0);

  useEffect(() => {
    getAllPokemonNames();
    getPokemons();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = allPokemonNames.filter(name => 
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filtered.length > 0) {
        fetchFilteredPokemons(filtered);
      } else {
        fetchSearchedPokemon(searchQuery);
      }
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const getAllPokemonNames = async () => {
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const data = await res.json();
      setAllPokemonNames(data.results.map(pokemon => pokemon.name));
    } catch (error) {
      console.error("Failed to fetch all Pokemon names:", error);
    }
  };

  const getPokemons = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(loadMore);
      const data = await res.json();
      setLoadMore(data.next);

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
          return res.json();
        })
      );

      setPokemons(currentList => {
        const newPokemons = pokemonDetails.filter(pokemon => 
          !currentList.some(existingPokemon => existingPokemon.id === pokemon.id)
        );
        return [...currentList, ...newPokemons];
      });
    } catch (error) {
      console.error("Failed to fetch Pokemons:", error);
    }
    setIsLoading(false);
  }, [loadMore]);

  const loadMorePokemons = () => {
    scrollPositionRef.current = window.pageYOffset;
    getPokemons().then(() => {
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 100);
    });
  };

  const fetchFilteredPokemons = async (filteredNames) => {
    setIsLoading(true);
    try {
      const pokemonDetails = await Promise.all(
        filteredNames.slice(0, 10).map(async (name) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          return res.json();
        })
      );
      setSearchResults(pokemonDetails);
    } catch (error) {
      console.error("Failed to fetch filtered Pokemons:", error);
    }
    setIsLoading(false);
  };

  const fetchSearchedPokemon = async (query) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults([data]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Failed to fetch searched Pokemon:", error);
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <div className="header bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h3 className="text-4xl md:text-5xl lg:text-6xl">POKEDEX</h3>
          <div className="search-bar text-black">
            <input
              type="search"
              placeholder="Search Here"
              className="search p-2"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      <div className="content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : searchQuery ? (
          searchResults.length > 0 ? (
            searchResults.map(pokemon => (
              <Card key={pokemon.id} data={pokemon} isLoading={false} />
            ))
          ) : (
            <p>Pokemon Not Found</p>
          )
        ) : (
          pokemons.map(pokemon => (
            <Card key={pokemon.id} data={pokemon} isLoading={false} />
          ))
        )}
      </div>
      {!searchQuery && (
        <div className="load-more-button">
          <button className="load-more" onClick={loadMorePokemons}>Load More</button>
        </div>
      )}
    </>
  );
}

export default App;