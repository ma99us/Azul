import React, {Component} from 'react';

import {BoardTiles, TileTypes} from './board/Tile';
import BagTiles from './board/BagTiles';
import CenterTiles from './board/CenterTiles';
import Hand from './player/Hand';
import GameActions from './actions/GameActions';

import boardController from './board/boardController';
import playerController from './player/playerController';

export const GameState = {DRAW_TILES: 'DRAW_TILES', PICK_TILES: 'PICK_TILES', SCORE_TILES: 'SCORE_TILES', FINAL_SCORE: 'FINAL_SCORE'};

class Game extends Component {
  boardController = boardController(this);
  playerController = playerController(this);

  state = {
    // player state
    score: 0,           // current player score
    newTiles: [],       // two dimensional array of tile types for current round
    oldTiles: [],       // two dimensional array of tile types for previous rounds
    penaltyTiles: [],   // one dimensional array of tile types on a penalty row
    // game state
    gameState: null,    // one of the GameState values
    // turn state
    bagTiles: [],       // two dimensional array of groups of 4 tiles to draw from this round
    centerTiles: [],     // two dimensional array of tile types bumped in the draw center area
    bagGroupTileSelected: null, // object {groupIdx, type}
    centerTileSelected: null, // TileTypes type selected in center area
    newTilesRowSelected: null  // number - New Tiles row index
  };

  componentDidMount() {
    this.processGameStateChange();
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.gameState !== prevState.gameState){
      this.processGameStateChange();
    }
  }

  // This has to run once ONLY after state.gameState just changed!
  processGameStateChange = () => {
    if(!this.state.gameState){
      // init game
      this.setState({newTiles: new Array(5).fill(null)});
      this.setState({gameState: GameState.DRAW_TILES});
    } else if(this.state.gameState === GameState.DRAW_TILES){
      // start game round: draw new tiles from the bag, reset player turn state
      this.playerController.resetPlayerState(); // just in case
      this.boardController.drawBagTiles(7);
      this.setState({gameState: GameState.PICK_TILES});
    } else if(this.state.gameState === GameState.PICK_TILES){
      // start player turn: wait for player input
    } else if(this.state.gameState === GameState.SCORE_TILES){
      // finish player turn: score player the round tiles, and start a new round
      this.playerController.resetPlayerState();
      this.playerController.promoteTileRows();
      //this.setState({gameState: GameState.DRAW_TILES});
    } else if(this.state.gameState === GameState.FINAL_SCORE){
      // finish game: calculate final score for each player
    }

  };

  bagGroupTileHandler = (groupIdx, type) => {
    if (this.state.gameState !== GameState.PICK_TILES) {
      return;
    }
    this.setState({bagGroupTileSelected: {groupIdx: groupIdx, type: type}});
    this.setState({centerTileSelected: null});
  };

  centerTileHandler = (type) => {
    if (this.state.gameState !== GameState.PICK_TILES) {
      return;
    }
    this.setState({centerTileSelected: type});
    this.setState({bagGroupTileSelected: null});
  };

  rowSelectorHandler = (rowIdx) => {
    if (this.state.gameState !== GameState.PICK_TILES) {
      return;
    }
    this.setState({newTilesRowSelected: rowIdx});

    if(this.state.bagGroupTileSelected && this.state.bagGroupTileSelected.type){
      this.playerController.pickBagGroupTiles(this.state.bagGroupTileSelected.groupIdx, this.state.bagGroupTileSelected.type, rowIdx);
    } else if(this.state.centerTileSelected){
      this.playerController.pickCenterTiles(this.state.centerTileSelected, rowIdx);
    }
  };

  scoreTurnHandler = () => {
    this.setState({gameState: GameState.SCORE_TILES});
  };

  endTurnHandler = () => {
    this.setState({gameState: GameState.DRAW_TILES});
  };

  render() {
    return (
      <div>
        {/*<h3>{this.props.name}</h3>*/}
        <p>Tiles to choose from:</p>
        <BagTiles game={this}
                  bagTiles={this.state.bagTiles}
                  bagGroupTileSelected={this.state.bagGroupTileSelected}
                  bagGroupTileHandler={this.bagGroupTileHandler}
        />
        <p>Center tiles:</p>
        <CenterTiles game={this}
                     centerTiles={this.state.centerTiles}
                     centerTileSelected={this.state.centerTileSelected}
                     centerTileHandler={this.centerTileHandler}
        />
        <p>Player's board:</p>
        <Hand game={this}
              rowSelectorType={(this.state.bagGroupTileSelected ? this.state.bagGroupTileSelected.type : null) || this.state.centerTileSelected}
              rowSelectorSelected={this.state.newTilesRowSelected}
              rowSelectorHandler={this.rowSelectorHandler}
        />
        <GameActions game={this} />
      </div>
    )
  }
}

export default Game;