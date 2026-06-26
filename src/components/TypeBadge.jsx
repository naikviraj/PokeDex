import React from 'react';
import { getTypeConfig } from '../utils/typeConfig';

const typeEmojis = {
  fire:'🔥', water:'💧', grass:'🌿', electric:'⚡', ice:'❄️',
  fighting:'🥊', poison:'☠️', ground:'🌍', flying:'🌬️', psychic:'🔮',
  bug:'🐛', rock:'🪨', ghost:'👻', dark:'🌑', dragon:'🐉',
  steel:'⚙️', fairy:'🌸', normal:'⭐',
};

const TypeBadge = ({ type, size = 'sm' }) => {
  const config = getTypeConfig(type);
  const padding = size === 'sm' ? '0.2rem 0.65rem' : '0.35rem 1rem';
  const fontSize = size === 'sm' ? '0.68rem' : '0.82rem';

  return (
    <span
      className="type-badge"
      style={{
        background: `${config.color}22`,
        border: `1px solid ${config.color}44`,
        color: config.color,
        padding,
        fontSize,
      }}
    >
      <span style={{ fontSize: size === 'sm' ? '0.75em' : '0.9em' }}>{typeEmojis[type] || '⭐'}</span>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

export default TypeBadge;
