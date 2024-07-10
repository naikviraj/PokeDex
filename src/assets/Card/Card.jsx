import React from 'react';
import { typeColors } from './Colour'; // Adjust the import path accordingly

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const Card = ({ data }) => {
  return (
    <>
      {data ? (
        data.map((allPokemons) => {
          const type = allPokemons.types[0].type.name;
          const bgColor = typeColors[type] || '#fff'; // Fallback to white if type not found
          return (
            <div className="card" key={allPokemons.id} style={{ backgroundColor: bgColor }}>
              <h5>#{allPokemons.id}</h5>
              <img src={allPokemons.sprites.other.dream_world.front_default} alt="" />
              <div className="title">
                <h3>Name: {capitalizeFirstLetter(allPokemons.name)}</h3>
                <h5>Type: {type}</h5>
                <h5>Height: {allPokemons.height}</h5>
                <h5>Weight: {allPokemons.weight}</h5>
              </div>
            </div>
          );
        })
      ) : (
        ""
      )}
    </>
  );
};
