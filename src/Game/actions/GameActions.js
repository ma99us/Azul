import React from 'react';

import {GameState} from "../Game";

import css from './GameActions.css';

const GameActions = (props) => {

  let button = null;
  if(props.game.state.gameState === GameState.PICK_TILES){
    button = <button onClick={props.game.scoreRoundHandler}>End Turn</button>;
  } else if(props.game.state.gameState === GameState.SCORE_TILES){
    button = <button onClick={props.game.endRoundHandler}>New Round</button>;
  }

  return (
    <div className={css.GameActions}>
      <span>Game State: {props.game.state.gameState}</span>
      {button}
    </div>
  );
};

export default GameActions;