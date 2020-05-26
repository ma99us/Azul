import React from 'react';

import Tile, {Direction} from '../board/Tile';
import css from './OldTiles.css'

const OldTiles = (props) => {
  const sizeX = 66.2;
  const sizeY = 68;

  return (
    <div className={css.OldTiles}>
      {props.tiles.map((row, rowIdx) => {
        const top = 7 + sizeY * rowIdx;
        return (row || []).map((t, colIdx) => {
          const left = 5 + sizeX * colIdx;
          //return <Tile key={t + colIdx} left={left} top={top} translateFrom={{left: -90, top: top}} type={t}/>;
          return <Tile key={t + colIdx} left={left} top={top} type={t}/>;
        })
      })}
    </div>
  );
};

export default OldTiles;