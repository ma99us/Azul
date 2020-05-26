import React from 'react';

import Tile from '../board/Tile'
import css from './PenaltyTiles.css'

const PenaltyTiles = (props) => {
  const sizeX = 72;
  const top = 0;

  return (
    <div className={css.PenaltyTiles}>{
      props.tiles.map((t, colIdx) => {
        const left = sizeX * colIdx;
        return <Tile key={t + colIdx} left={left} top={top} type={t}/>})
    }
    </div>
  );
};

export default PenaltyTiles;