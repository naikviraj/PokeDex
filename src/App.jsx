import React, { useState, useEffect } from "react";
import { Card } from "./assets/Card/Card";
import { FaArrowDown } from "react-icons/fa";

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [loadMore, setLoadMore] = useState('https://pokeapi.co/api/v2/pokemon/?limit=1025');
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);
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
        pokemon.id.toString().includes(searchQuery)
      );
      setFilteredPokemons(filtered);
    } else {
      setFilteredPokemons(allPokemons);
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

  const getAllPokemons = async () => {
    const res = await fetch(loadMore);
    const data = await res.json();
    setLoadMore(data.next);

    async function createPokemonObject(result) {
      for (const pokemon of result) {
        if (!uniquePokemonNames.has(pokemon.name)) {
          uniquePokemonNames.add(pokemon.name);
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
          const data = await res.json();
          setAllPokemons(currentList => [...currentList, data]);
        }
      }
    }

    createPokemonObject(data.results);
  };

  return (
    <>
      <div className="header bg-black">
        <div className="bg">
          <video autoPlay muted loop className="bg-video" style={{ width: "100%" }}>

          <source src="https://www.desktophut.com/files/1683999977-1683999977-pokemon-ash-live-wallpaper.mp4" type="video/mp4" />
                     
            <source src="https://github.com/naikviraj/PokeDex/blob/main/Images/gokukid.mp4" type="video/mp4" />

          </video>
          <div className="overlay-text">
            <h1 className="text-9xl font-extrabold">POKEDEX</h1>
          </div>
          <button onClick={handleClick} className="overlay-button">
            <FaArrowDown />
          </button>
        </div>
        <div className="search-bar flex justify-between items-center p-1">
          <div className="flex-shrink-0 ml-5 p-1">

            <img src="https://pokedex-react-mui.netlify.app/static/media/pokedex.2800773d.png" alt="logo" className="h-20" />

            

          </div>
          <div className="mr-8">
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
      <div className="content">
        {filteredPokemons.length === 0 ? <p>Pokemon Not Found</p> : <Card data={filteredPokemons} />}
      </div>
      <div className="load-more-button">
        <button className="load-more" onClick={getAllPokemons}>Load More</button>
      </div>
    </>
  );
}

export default App;
