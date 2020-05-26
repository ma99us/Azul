import React from 'react';

import Marker from './Marker';
import NewTiles from './NewTiles';
import RowSelector from './RowSelector';
import OldTiles from './OldTiles';
import PenaltyTiles from './PenaltyTiles'
import css from './Hand.css';

const Hand = (props) => {

  return (
    <div className={css.Hand}>
      <Marker game={props.game} score={props.game.state.score} />
      <NewTiles game={props.game} tiles={props.game.state.newTiles} />
      <RowSelector game={props.game} tiles={props.game.state.newTiles} type={props.rowSelectorType} selected={props.rowSelectorSelected} clicked={props.rowSelectorHandler} />
      <OldTiles game={props.game} tiles={props.game.state.oldTiles} />
      <PenaltyTiles game={props.game} tiles={props.game.state.penaltyTiles} />
    </div>
  );
};

export default Hand;