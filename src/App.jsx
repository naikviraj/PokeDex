import React, { useState, useEffect } from "react";
import { Card } from "./assets/Components/Card";
import { FaArrowDown } from "react-icons/fa";

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [loadMore, setLoadMore] = useState('https://pokeapi.co/api/v2/pokemon/?limit=1027');
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [pokemonLoadingStates, setPokemonLoadingStates] = useState({});
  const [searchedPokemon, setSearchedPokemon] = useState(null);
  const uniquePokemonNames = new Set();

  useEffect(() => {
    getAllPokemons();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', !scrollEnabled);
  }, [scrollEnabled]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = allPokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        pokemon.id.toString().includes(searchQuery) ||
        pokemon.types.some(typeInfo => typeInfo.type.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pokemon.height.toString().includes(searchQuery) ||
        pokemon.weight.toString().includes(searchQuery)
      );

      setFilteredPokemons(filtered);

      if (filtered.length === 0) {
        fetchSearchedPokemon(searchQuery);
      } else {
        setSearchedPokemon(null);
      }
    } else {
      setFilteredPokemons(allPokemons);
      setSearchedPokemon(null);
    }
  }, [searchQuery, allPokemons]);

  const handleScroll = () => {
    const contentSection = document.querySelector('.search-bar');
    contentSection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClick = () => {
    setScrollEnabled(true);
    handleScroll();
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchSearchedPokemon = async (query) => {
    setGlobalLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (res.ok) {
        const data = await res.json();
        setSearchedPokemon(data);
      } else {
        setSearchedPokemon(null);
      }
    } catch (error) {
      setSearchedPokemon(null);
    }
    setGlobalLoading(false);
  };

  const getAllPokemons = async () => {
    setGlobalLoading(true);
    const res = await fetch(loadMore);
    const data = await res.json();
    setLoadMore(data.next);

    async function createPokemonObject(result) {
      for (const pokemon of result) {
        if (!uniquePokemonNames.has(pokemon.name)) {
          uniquePokemonNames.add(pokemon.name);
          setPokemonLoadingStates(prevState => ({ ...prevState, [pokemon.name]: true }));
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
          const data = await res.json();
          setAllPokemons(currentList => [...currentList, data]);
          setPokemonLoadingStates(prevState => ({ ...prevState, [pokemon.name]: false }));
        }
      }
    }

    await createPokemonObject(data.results);
    setGlobalLoading(false);
  };

  return (
    <>
      <div className="header bg-black">
        <div className="bg">
          <img src="https://images8.alphacoders.com/114/thumb-1920-1140434.jpg" alt="" />
          <div className="overlay-text">
            <h1 className="text-9xl font-extrabold">POKEDEX</h1>
          </div>
          <button onClick={handleClick} className="overlay-button">
            <FaArrowDown />
          </button>
        </div>
        <div className="search-bar flex flex-col md:flex-row justify-between items-center p-1">
          <div className="flex-shrink-0 ml-5 p-1">
            <img src="https://pokedex-react-mui.netlify.app/static/media/pokedex.2800773d.png" alt="logo" className="h-20" />
          </div>
          <div className="mt-2 md:mt-0 mr-8">
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
        {filteredPokemons.length === 0 && !searchedPokemon ? (
          globalLoading ? (
            <p>Loading...</p>
          ) : (
            <p>Pokemon Not Found</p>
          )
        ) : (
          filteredPokemons.map(pokemon => (
            <Card key={pokemon.id} data={pokemon} isLoading={pokemonLoadingStates[pokemon.name] || false} />
          ))
        )}
        {searchedPokemon && <Card key={searchedPokemon.id} data={searchedPokemon} isLoading={globalLoading} />}
      </div>
      <div className="load-more-button">
        <button className="load-more" onClick={getAllPokemons}>Load More</button>
      </div>
    </>
  );
}

export default App;
