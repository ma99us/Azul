import React from 'react';

import Tile from './Tile';
import css from './BagGroupTiles.css'

const BagGroupTiles = (props) => {

  return (
    <div className={css.BagGroupTiles}>
      <table className={css.BagGroupTilesTable}>
        <tbody>
        <tr>
          <td>
            <Tile marked={props.typeSelected === props.group[0]} clicked={() => props.bagGroupTileHandler(props.index, props.group[0])} type={props.group[0]}/>
          </td>
          <td>
            <Tile marked={props.typeSelected === props.group[1]} clicked={() => props.bagGroupTileHandler(props.index, props.group[1])} type={props.group[1]}/>
          </td>
        </tr>
        <tr>
          <td>
            <Tile marked={props.typeSelected === props.group[2]} clicked={() => props.bagGroupTileHandler(props.index, props.group[2])} type={props.group[2]}/>
          </td>
          <td>
            <Tile marked={props.typeSelected === props.group[3]} clicked={() => props.bagGroupTileHandler(props.index, props.group[3])} type={props.group[3]}/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BagGroupTiles;