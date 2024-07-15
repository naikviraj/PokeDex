import React from 'react';
import { typeColors } from './Colour';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const Card = ({ data, isLoading }) => {
  // Ensure data is an array, if it's a single object wrap it in an array
  const pokemons = Array.isArray(data) ? data : [data];

  return (
    <>
      {pokemons && pokemons.length > 0 ? (
        pokemons.map((pokemon) => {
          const type = pokemon.types ? pokemon.types[0].type.name : null;
          const bgColor = typeColors[type] || '#fff'; // Default to white if type not found
          const imageUrl = pokemon.sprites?.other?.dream_world?.front_default;

          return (
            <div className="card" key={pokemon.id || pokemon.name} style={{ backgroundColor: bgColor }}>
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <h5>#{pokemon.id}</h5>
                  {imageUrl ? (
                    <img src={imageUrl} alt={pokemon.name} />
                  ) : (
                    <div className="image-placeholder">Image not available</div>
                  )}
                  <div className="title">
                    <h3>Name: {capitalizeFirstLetter(pokemon.name)}</h3>
                    <h5>Type: {type}</h5>
                    <h5>Height: {pokemon.height}</h5>
                    <h5>Weight: {pokemon.weight}</h5>
                  </div>
                </>
              )}
            </div>
          );
        })
      ) : (
        <p>No Pokémon found</p>
      )}
    </>
  );
};
