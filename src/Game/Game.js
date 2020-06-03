import React, {Component} from 'react';

import BagTiles from './board/BagTiles';
import CenterTiles from './board/CenterTiles';
import GameActions from './actions/GameActions';

import boardController from './controllers/boardController';
import playerController from './controllers/playerController';
import Players from "./board/Players";

export const GameState = {
  DRAW_TILES: 'DRAW_TILES',
  PICK_TILES: 'PICK_TILES',
  SCORE_TILES: 'SCORE_TILES',
  FINAL_SCORE: 'FINAL_SCORE'
};

class Game extends Component {
  controller = {...boardController(this), ...playerController(this)};

  playersNum = 4;

  state = {
    // player state
    score: [],          // one dimensional array with player scores. [player index]
    newTiles: [],       // three dimensional array of tile types for current round; [player index][row index][tile index]
    oldTiles: [],       // three dimensional array of tile types for previous rounds; [player index][row index][tile index]
    penaltyTiles: [],   // two dimensional array of tile types on a penalty row  [player index][tile index]
    // game state
    gameState: null,    // one of the GameState values
    players: [],        // one dimensional array of player objects {id, name, color}
    playerTurn: 0,      // current turn player index
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.gameState !== prevState.gameState) {
      this.processGameStateChange();
    }
  }

  // This has to run once ONLY after state.gameState just changed!
  processGameStateChange = () => {
    if (!this.state.gameState) {
      // init game
      console.log("Init game");   // #DEBUG
      const players = new Array(this.playersNum).fill({});      //TODO: init dummy players
      this.setState({players: players});
      this.setState({score: new Array(players.length).fill(0)});
      this.setState({newTiles: players.map(p => new Array(5).fill([]))});
      this.setState({oldTiles: players.map(p => new Array(5).fill([]))});
      this.setState({penaltyTiles: players.map(p => []) });
      this.setState({gameState: GameState.DRAW_TILES});
    } else if (this.state.gameState === GameState.DRAW_TILES) {
      console.log("DRAW_TILES");   // #DEBUG
      // start game round: draw new tiles from the bag, reset player turn state
      this.controller.resetPlayerState(); // just in case
      this.controller.drawBagTiles(this.playersNum * 2 + 1);
      this.setState({gameState: GameState.PICK_TILES});
    } else if (this.state.gameState === GameState.PICK_TILES) {
      console.log("PICK_TILES");   // #DEBUG
      // start player turn: wait for player input
    } else if (this.state.gameState === GameState.SCORE_TILES) {
      console.log("SCORE_TILES");   // #DEBUG
      // finish player turn: score player the round tiles, and start a new round
      this.controller.resetPlayerState();
      //FIXME: do not score other players in real multiplayer game
      // this.controller.promoteTileRows();
      const nextPlayerTurn = this.controller.findNextPlayerTurn();
      this.state.players.forEach((p, idx) => {
        setTimeout(() => {
          this.setState({playerTurn: idx}, this.controller.promoteTileRows);
        }, 1500 * idx);
      });
      setTimeout(() => {
        // set next round starting player
        this.setState({playerTurn: nextPlayerTurn});
        // start next round
        this.endRoundHandler();
      }, 1500 * this.state.players.length);
      //this.setState({gameState: GameState.DRAW_TILES});
    } else if (this.state.gameState === GameState.FINAL_SCORE) {
      console.log("FINAL_SCORE");   // #DEBUG
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

    if (this.state.bagGroupTileSelected && this.state.bagGroupTileSelected.type) {
      this.controller.pickBagGroupTiles(this.state.bagGroupTileSelected.groupIdx, this.state.bagGroupTileSelected.type, rowIdx);
    } else if (this.state.centerTileSelected) {
      this.controller.pickCenterTiles(this.state.centerTileSelected, rowIdx);
    }
  };

  scoreRoundHandler = () => {
    this.setState({gameState: GameState.SCORE_TILES});
  };

  endRoundHandler = () => {
    this.setState({gameState: GameState.DRAW_TILES});
  };

  endTurnHandler = () => {
    let playerTurn = this.state.playerTurn;
    playerTurn = (++playerTurn) % this.playersNum;
    this.setState({playerTurn: playerTurn});
  };

  render() {
    return (
      <div style={{zoom: '80%'}}>
        {/*<h3>{this.props.name}</h3>*/}
        <BagTiles game={this}
                  bagTiles={this.state.bagTiles}
                  bagGroupTileSelected={this.state.bagGroupTileSelected}
                  bagGroupTileHandler={this.bagGroupTileHandler}
        />
        <CenterTiles game={this}
                     centerTiles={this.state.centerTiles}
                     centerTileSelected={this.state.centerTileSelected}
                     centerTileHandler={this.centerTileHandler}
        />
        <Players game={this}
                 rowSelectorType={(this.state.bagGroupTileSelected ? this.state.bagGroupTileSelected.type : null) || this.state.centerTileSelected}
                 rowSelectorSelected={this.state.newTilesRowSelected}
                 rowSelectorHandler={this.rowSelectorHandler}
                 playerTurn={this.state.playerTurn}
        />
        <GameActions game={this}/>
      </div>
    )
  }
}

export default Game;