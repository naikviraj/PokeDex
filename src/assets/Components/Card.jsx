import React, { useState } from 'react';
import { typeColors } from './Colour';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getNameClass = (name) => {
  if (name.length > 12) {
    return 'text-sm';
  } else if (name.length > 8) {
    return 'text-base';
  }
  return 'text-lg';
};

export const Card = ({ data, isLoading }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [chartType, setChartType] = useState('progressBars');
  const pokemons = Array.isArray(data) ? data : [data];

  const fetchAdditionalDetails = async (name) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const details = await res.json();
      setPokemonDetails(details);
    } catch (error) {
      console.error("Failed to fetch additional Pokemon details:", error);
    }
  };

  const handleMoreDetailsClick = (name) => {
    fetchAdditionalDetails(name);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPokemonDetails(null);
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  return (
    <>
      {pokemons && pokemons.length > 0 ? (
        pokemons.map((pokemon) => {
          const type = pokemon.types ? pokemon.types[0].type.name : null;
          const bgColor = typeColors[type] || '#fff';
          const imageUrl = pokemon.sprites?.other?.dream_world?.front_default;

          return (
            <div className="card" key={pokemon.id || pokemon.name} style={{ backgroundColor: bgColor }}>
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <h5>#{pokemon.id}</h5>
                  {imageUrl ? (
                    <img src={imageUrl} alt={pokemon.name} className="w-full h-32 object-contain" />
                  ) : (
                    <div className="image-placeholder">Image not available</div>
                  )}
                  <div className="title">
                    <h3 className={`${getNameClass(pokemon.name)} font-bold mt-2 break-words`}>
                      Name: {capitalizeFirstLetter(pokemon.name)}
                    </h3>
                    <h5>Type: {type}</h5>
                    <h5>Height: {pokemon.height}</h5>
                    <h5>Weight: {pokemon.weight}</h5>
                    <button className="more-details-button" onClick={() => handleMoreDetailsClick(pokemon.name)}>
                      More Details
                    </button>
                  </div>
                </>
              )}
              {showPopup && pokemonDetails && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                  <div className="popup-card" onClick={(e) => e.stopPropagation()}>
                    <h3>{capitalizeFirstLetter(pokemonDetails.name)} Details</h3>
                    <div className="chart-type-selection">
                      <label>
                        <input
                          type="radio"
                          name="chartType"
                          value="radar"
                          checked={chartType === 'radar'}
                          onChange={handleChartTypeChange}
                        />
                        Radar Chart
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="chartType"
                          value="progressBars"
                          checked={chartType === 'progressBars'}
                          onChange={handleChartTypeChange}
                        />
                        Progress Bars
                      </label>
                    </div>
                    {chartType === 'radar' ? (
                      <Radar
                        data={{
                          labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
                          datasets: [
                            {
                              label: `${capitalizeFirstLetter(pokemonDetails.name)} Stats`,
                              data: pokemonDetails.stats.map(stat => stat.base_stat),
                              backgroundColor: 'rgba(34, 202, 236, 0.2)',
                              borderColor: 'rgba(34, 202, 236, 1)',
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          scales: {
                            r: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="progress-bars">
                        {pokemonDetails.stats.map(stat => (
                          <div key={stat.stat.name} className="progress-bar">
                            <span className="stat-name">{capitalizeFirstLetter(stat.stat.name)}</span>
                            <div className="progress-bar-background">
                              <div
                                className="progress-bar-fill"
                                style={{ width: `${stat.base_stat}%` }}
                              >
                                {stat.base_stat}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="close-button" onClick={handleClosePopup}>
                      Close
                    </button>
                  </div>
                </div>
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
