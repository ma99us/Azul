import React from 'react';

import BagGroupTiles from './BagGroupTiles';
import css from './BagTiles.css';

const BagTiles = (props) => {

  return (
    <div className={css.BagTiles}>{
      props.bagTiles.map((gt, idx) => {
        const selType = (props.bagGroupTileSelected && props.bagGroupTileSelected.groupIdx === idx) ? props.bagGroupTileSelected.type : null;
        return <BagGroupTiles key={idx} index={idx} group={gt} typeSelected={selType} bagGroupTileHandler={props.bagGroupTileHandler} />;
      })
    }
    </div>
  );
};

export default BagTiles;