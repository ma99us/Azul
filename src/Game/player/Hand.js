import React from 'react';

import Marker from './Marker';
import NewTiles from './NewTiles';
import RowSelector from './RowSelector';
import OldTiles from './OldTiles';
import PenaltyTiles from './PenaltyTiles'
import css from './Hand.css';

const Hand = (props) => {

  const isPlayerTurn = props.playerIndex === props.game.state.playerTurn;
  let classNames = [css.Hand];
  if(isPlayerTurn){
    classNames.push(css.marked);
  }

  return (
    <div className={classNames.join(' ')}>
      <Marker game={props.game} score={props.game.state.score[props.playerIndex]} />
      <NewTiles game={props.game} tiles={props.game.state.newTiles[props.playerIndex]} />
      <RowSelector game={props.game} tiles={props.game.state.newTiles[props.playerIndex]}
                   type={isPlayerTurn ? props.rowSelectorType : null}
                   selected={props.rowSelectorSelected}
                   clicked={props.rowSelectorHandler} />
      <OldTiles game={props.game} tiles={props.game.state.oldTiles[props.playerIndex]} />
      <PenaltyTiles game={props.game} tiles={props.game.state.penaltyTiles[props.playerIndex]} />
    </div>
  );
};

export default Hand;