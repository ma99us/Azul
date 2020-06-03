import React from 'react';

import {BoardTiles} from '../board/Tile';

import css from './RowSelector.css';
import arrowLeft from '../../images/arrow_left.png';

const RowSelector = (props) => {
  const sizeY = 70;

  let goodRowsNum = 0;
  const arrows = Array(5).fill(null).map((row, rowIdx) => {
    const left = 0;
    const top = 5 + sizeY * rowIdx;
    const goodRow = props.game.controller.canAddToRow(props.tiles[rowIdx], rowIdx, props.type);
    goodRowsNum += goodRow ? 1 : 0;
    const style = goodRow
      ? {display: 'block', left: `${left}px`, top: `${top}px`}
      : {display: 'none'};
    return <img src={arrowLeft} alt={'select row'} style={style} key={rowIdx} onClick={() => props.clicked(rowIdx)} />;
  });
  if(goodRowsNum === 0){
    const style = {display: 'block', left: `200px`, top: `400px`};
    arrows.push(<img src={arrowLeft} alt={'select penalty row'} style={style} key='penalty row' onClick={() => props.clicked(-1)} />)
  }

  return (
    <div className={css.RowSelector} style={BoardTiles.indexOf(props.type) >= 0 ? {display: 'inline-block'} : {display: 'none'}}>
      {arrows}
    </div>
  );

};

export default RowSelector;