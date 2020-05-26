import React from 'react';

import Tile from '../board/Tile';
import css from './NewTiles.css';

const NewTiles = (props) => {
  const sizeX = 66.6;
  const sizeY = 68;

  return (
    <div className={css.NewTiles}>
      {props.tiles.map((row, rowIdx) => {
        const top = 6 + sizeY * rowIdx;
        return (row || []).map((t, colIdx) => {
          const left = sizeX * (4 - rowIdx) + sizeX * colIdx;
          return <Tile key={t + colIdx} left={left} top={top} type={t}/>;
        })
      })}
    </div>
  );

};

export default NewTiles;