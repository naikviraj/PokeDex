export const typeConfig = {
  normal:   { color: '#A8A878', glow: 'rgba(168,168,120,0.6)',  gradient: 'linear-gradient(135deg, #A8A878, #C6C6A7)', bg: '#2a2a1e', hex: '#A8A878' },
  fire:     { color: '#F08030', glow: 'rgba(240,128,48,0.7)',   gradient: 'linear-gradient(135deg, #F08030, #FF6B35)', bg: '#2a1a0a', hex: '#F08030' },
  water:    { color: '#6890F0', glow: 'rgba(104,144,240,0.7)',  gradient: 'linear-gradient(135deg, #6890F0, #3498DB)', bg: '#0a1a2e', hex: '#6890F0' },
  electric: { color: '#F8D030', glow: 'rgba(248,208,48,0.8)',   gradient: 'linear-gradient(135deg, #F8D030, #FFD700)', bg: '#2a240a', hex: '#F8D030' },
  grass:    { color: '#78C850', glow: 'rgba(120,200,80,0.7)',   gradient: 'linear-gradient(135deg, #78C850, #2ECC71)', bg: '#0f2a0a', hex: '#78C850' },
  ice:      { color: '#98D8D8', glow: 'rgba(152,216,216,0.7)',  gradient: 'linear-gradient(135deg, #98D8D8, #00CED1)', bg: '#0a2a2a', hex: '#98D8D8' },
  fighting: { color: '#C03028', glow: 'rgba(192,48,40,0.7)',    gradient: 'linear-gradient(135deg, #C03028, #E74C3C)', bg: '#2a0a0a', hex: '#C03028' },
  poison:   { color: '#A040A0', glow: 'rgba(160,64,160,0.7)',   gradient: 'linear-gradient(135deg, #A040A0, #9B59B6)', bg: '#1e0a2a', hex: '#A040A0' },
  ground:   { color: '#E0C068', glow: 'rgba(224,192,104,0.7)',  gradient: 'linear-gradient(135deg, #E0C068, #D4AC0D)', bg: '#2a200a', hex: '#E0C068' },
  flying:   { color: '#A890F0', glow: 'rgba(168,144,240,0.7)',  gradient: 'linear-gradient(135deg, #A890F0, #7FB3D3)', bg: '#12102a', hex: '#A890F0' },
  psychic:  { color: '#F85888', glow: 'rgba(248,88,136,0.7)',   gradient: 'linear-gradient(135deg, #F85888, #FF1493)', bg: '#2a0a18', hex: '#F85888' },
  bug:      { color: '#A8B820', glow: 'rgba(168,184,32,0.7)',   gradient: 'linear-gradient(135deg, #A8B820, #7CFC00)', bg: '#1a2a0a', hex: '#A8B820' },
  rock:     { color: '#B8A038', glow: 'rgba(184,160,56,0.6)',   gradient: 'linear-gradient(135deg, #B8A038, #8B7355)', bg: '#1e1a0a', hex: '#B8A038' },
  ghost:    { color: '#705898', glow: 'rgba(112,88,152,0.7)',   gradient: 'linear-gradient(135deg, #705898, #4B0082)', bg: '#12082a', hex: '#705898' },
  dark:     { color: '#705848', glow: 'rgba(112,88,72,0.6)',    gradient: 'linear-gradient(135deg, #705848, #2C2C2C)', bg: '#161616', hex: '#705848' },
  dragon:   { color: '#7038F8', glow: 'rgba(112,56,248,0.8)',   gradient: 'linear-gradient(135deg, #7038F8, #4B0082)', bg: '#12082e', hex: '#7038F8' },
  steel:    { color: '#B8B8D0', glow: 'rgba(184,184,208,0.6)',  gradient: 'linear-gradient(135deg, #B8B8D0, #708090)', bg: '#1a1a22', hex: '#B8B8D0' },
  fairy:    { color: '#EE99AC', glow: 'rgba(238,153,172,0.7)',  gradient: 'linear-gradient(135deg, #EE99AC, #FF69B4)', bg: '#2a0a18', hex: '#EE99AC' },
};

export const getTypeConfig = (type) => typeConfig[type] || typeConfig.normal;

export const statColors = {
  hp: '#FF6B6B',
  attack: '#FF8C42',
  defense: '#4ECDC4',
  'special-attack': '#A78BFA',
  'special-defense': '#34D399',
  speed: '#FBBF24',
};

export const regions = [
  { name: 'Kanto',  id: 1, range: [1,   151],  color: '#E74C3C', description: 'The original region — home to the first 151 Pokémon.' },
  { name: 'Johto',  id: 2, range: [152, 251],  color: '#3498DB', description: 'Rich in legend and ancient tradition.' },
  { name: 'Hoenn',  id: 3, range: [252, 386],  color: '#2ECC71', description: 'A tropical paradise full of water routes.' },
  { name: 'Sinnoh', id: 4, range: [387, 493],  color: '#9B59B6', description: 'Home to the mythical creation trio.' },
  { name: 'Unova',  id: 5, range: [494, 649],  color: '#1ABC9C', description: 'A modern, cosmopolitan region inspired by New York.' },
  { name: 'Kalos',  id: 6, range: [650, 721],  color: '#E91E63', description: 'Inspired by France, birthplace of Mega Evolution.' },
  { name: 'Alola',  id: 7, range: [722, 809],  color: '#FF9800', description: 'Tropical island region with a rich culture.' },
  { name: 'Galar',  id: 8, range: [810, 905],  color: '#607D8B', description: 'Industrial region with Dynamax phenomenon.' },
  { name: 'Paldea', id: 9, range: [906, 1025], color: '#F44336', description: 'Open-world region inspired by the Iberian Peninsula.' },
];
