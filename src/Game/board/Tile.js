import React from 'react';

import css from './Tile.css';

export const TileTypes = {WHITE: 'WHITE', RED: 'RED', ORANGE: 'ORANGE', BLUE: 'BLUE', BLACK: 'BLACK', ONE: 'ONE'};
export const BoardTiles = [TileTypes.BLUE, TileTypes.ORANGE,  TileTypes.RED, TileTypes.BLACK, TileTypes.WHITE];
export const Direction = {TOP: 'TOP', RIGHT: 'RIGHT', BOTTOM: 'BOTTOM', LEFT: 'LEFT'};

const Tile = (props) => {
  const tileClass = [css.Tile];
  if (props.type === TileTypes.WHITE) {
    tileClass.push(css.TileWhite);
  } else if (props.type === TileTypes.RED) {
    tileClass.push(css.TileRed);
  } else if (props.type === TileTypes.ORANGE) {
    tileClass.push(css.TileOrange);
  } else if (props.type === TileTypes.BLUE) {
    tileClass.push(css.TileBlue);
  } else if (props.type === TileTypes.BLACK) {
    tileClass.push(css.TileBlack);
  } else if (props.type === TileTypes.ONE) {
    tileClass.push(css.TileOne);
  } else {
    //throw new Error('Unexpected tile type: ' + props.type);
    return null;
  }

  if(props.marked){
    tileClass.push(css.marked);
  }

  let style = {};
  if (props.left != null && props.top != null) {
    const baseStyle = {position: 'absolute'};
    if(props.translateFrom){

      style = {...baseStyle,
        left: `${props.translateFrom.left}px`,
        top: `${props.translateFrom.top}px`,
        transform: `translate(${props.left-props.translateFrom.left}px, ${props.top-props.translateFrom.top}px) rotate(${props.rot || 0}deg)`}
    } else {
      style = {...baseStyle, left: `${props.left}px`, top: `${props.top}px`}
    }
  }

  return <div className={tileClass.join(' ')} style={style} onClick={props.clicked}/>;

};

export default Tile;