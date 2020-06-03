import React from 'react';
import css from './Players.css'
import Hand from "../player/Hand";

const Players = (props) => {

  let players = props.game.state.players.map((p, idx) => {
    return <Hand key={idx} playerIndex={idx} game={props.game} rowSelectorType={props.rowSelectorType} rowSelectorSelected={props.rowSelectorSelected} rowSelectorHandler={props.rowSelectorHandler}/>
  });

  return (
    <div className={css.Players}>
      {players}
    </div>
  )
};

export default Players;
