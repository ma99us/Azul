import React from 'react';

import Tile, {TileTypes} from './Tile'
import css from './CenterTiles.css'

const CenterTiles = (props) => {

  return (
    <div className={css.CenterTiles}>{
      props.centerTiles.filter(row => row.length > 0).map(row => row.map((t, idx) => {
        return <Tile key={t + idx} type={t}
                     marked={props.centerTileSelected === t || (props.centerTileSelected && t === TileTypes.ONE)}
                     clicked={() => props.centerTileHandler(t)} />
      }))
    }
    </div>
  );
};

export default CenterTiles;