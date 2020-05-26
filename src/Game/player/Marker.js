import React from 'react';

import css from './Marker.css';

const Marker = (props) => {
  let left = 0;
  let top = 0;
  let rot = 0;
  const size = 30;
  const score = props.score || 0;
  let row = Math.floor((score-1) / 20);
  let col = score - row * 20 - 1;
  if (score > 100) {
    rot = 45;
    row = Math.floor(((score - 100) - 1) / 20);
    col = (score - 100) - row * 20 - 1;
  }
  if (score > 0) {
    left += col * (size + 4.4);
    top += (row + 1) * (size + 11.8);
  }

  return (
    <div className={css.Marker} style={{transform: `translate(${left}px, ${top}px) rotate(${rot}deg)`}} /*onClick={() => props.game.addScore(1)}*/ />
  );
};

export default Marker;