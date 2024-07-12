import React from 'react';
import { typeColors } from './Colour';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const Card = ({ data, isLoading }) => {
  return (
    <>
      {data && data.length > 0 ? (
        data.map((allPokemons) => {
          const type = allPokemons.types ? allPokemons.types[0].type.name : null;
          const bgColor = typeColors[type] || '#fff'; // keep colour white if tye not found
          return (
            <div className="card" key={allPokemons.id || allPokemons.name} style={{ backgroundColor: bgColor }}>
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <h5>#{allPokemons.id}</h5>
                  <img src={allPokemons.sprites.other.dream_world.front_default} alt="" />
                  <div className="title">
                    <h3>Name: {capitalizeFirstLetter(allPokemons.name)}</h3>
                    <h5>Type: {type}</h5>
                    <h5>Height: {allPokemons.height}</h5>
                    <h5>Weight: {allPokemons.weight}</h5>
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
