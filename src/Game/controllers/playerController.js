import {TileTypes, BoardTiles} from "../board/Tile";

import scoreController from './scoreController';
import {cloneSpliceArray, deepClone, findRowIndexIn2dTilesArrayByType} from "./utils";

const playerController = (game) => {

  const scoreCtrl = scoreController(game);

  const isRowFull = (row, rowIdx) => {
    return row && row.length === rowIdx + 1;
  };

  const checkTileRowHasType = (row, type) => {
    return row && row.indexOf(type) >= 0;
  };

  const canAddToRow = (row, rowIdx, type) => {
    let oldRowIdx = findRowIndexIn2dTilesArrayByType(game.state.newTiles[game.state.playerTurn], type);
    if (oldRowIdx >= 0 && oldRowIdx !== rowIdx) {
      return false;
    }
    if(checkTileRowHasType(game.state.oldTiles[game.state.playerTurn][rowIdx], type)){
      return false;
    }
    const rowType = (row && row.length > 0) ? row[0] : null;
    return (!rowType || rowType === type) && !isRowFull(row, rowIdx);
  };

  const addNewTiles = (newTiles, penaltyTiles, type, num, rowIdx) => {
    if (rowIdx < 0) {
      addPenaltyTiles(penaltyTiles, type, num);
      return;
    }
    let rowTiles = newTiles[rowIdx];
    if (!rowTiles) {
      rowTiles = [];
      newTiles[rowIdx] = rowTiles;
    }
    const rowType = rowTiles.length > 0 ? rowTiles[0] : null;
    if (rowType && rowType !== type) {
      console.log("Can't add tiles of type " + type + " to row with type " + rowType);
      return;
    }
    for (let i = 0; i < num; i++) {
      if (rowTiles.length < rowIdx + 1) {
        rowTiles.push(type);
      } else {
        addPenaltyTiles(penaltyTiles, type, num - i);
        break;
      }
    }
  };

  const addPenaltyTiles = (penaltyTiles, type, num) => {
    for (let i = 0; i < num; i++) {
      if (penaltyTiles.length < 7) {
        penaltyTiles.push(type);
      } else {
        console.log("Ouch! Penalty row is full! -14 points.");
        break;
      }
    }
  };

  const pickCenterTiles = (type, rowIdx) => {
    const centerTiles = deepClone(game.state.centerTiles);
    const newTiles = deepClone(game.state.newTiles[game.state.playerTurn]);
    const penaltyTiles = deepClone(game.state.penaltyTiles[game.state.playerTurn]);

    // move "One" marker if any
    const oneIdx = findRowIndexIn2dTilesArrayByType(centerTiles, TileTypes.ONE);
    if(oneIdx >= 0){
      addNewTiles(newTiles, penaltyTiles, TileTypes.ONE, 1, -1);
      centerTiles[oneIdx] = [];
    }
    // move group type tiles
    const grpIdx = findRowIndexIn2dTilesArrayByType(centerTiles, type);
    const groupTiles = centerTiles[grpIdx];
    groupTiles.forEach(gType => {
      addNewTiles(newTiles, penaltyTiles, gType, 1, rowIdx);
    });
    centerTiles[grpIdx] = [];

    game.setState({centerTiles: centerTiles});
    game.setState({newTiles: cloneSpliceArray(game.state.newTiles, game.state.playerTurn, newTiles)});
    game.setState({penaltyTiles: cloneSpliceArray(game.state.penaltyTiles, game.state.playerTurn, penaltyTiles)});
    resetPlayerState();

    // check for score the round condition first
    if (!game.controller.isDiceLeft(game.state.bagTiles, centerTiles)) {
      game.scoreRoundHandler();
    } else {
      game.endTurnHandler();
    }
  };

  // add picked tiles to New Tiles. finish player turn
  const pickBagGroupTiles = (groupIdx, type, rowIdx) => {
    const bagTiles = deepClone(game.state.bagTiles);
    const centerTiles = deepClone(game.state.centerTiles);
    const newTiles = deepClone(game.state.newTiles[game.state.playerTurn]);
    const penaltyTiles = deepClone(game.state.penaltyTiles[game.state.playerTurn]);

    const groupTiles = [...bagTiles[groupIdx]];
    groupTiles.forEach(gType => {
      if (gType === type) {
        addNewTiles(newTiles, penaltyTiles, gType, 1, rowIdx);
      } else {
        game.controller.dumpCenterTiles(centerTiles, gType, 1);
      }
    });
    bagTiles[groupIdx] = [];

    game.setState({bagTiles: bagTiles});
    game.setState({centerTiles: centerTiles});
    game.setState({newTiles: cloneSpliceArray(game.state.newTiles, game.state.playerTurn, newTiles)});
    game.setState({penaltyTiles: cloneSpliceArray(game.state.penaltyTiles, game.state.playerTurn, penaltyTiles)});
    resetPlayerState();

    // check for score the round condition first
    if (!game.controller.isDiceLeft(bagTiles, centerTiles)) {
      game.scoreRoundHandler();
    } else {
      game.endTurnHandler();
    }

  };

  const tileTypeToOldTilesColIdx = (type, rowIdx) => {
    let colIdx = BoardTiles.indexOf(type);
    return (colIdx + rowIdx) % 5;
  };

  const promoteTileRow = (oldTiles, row, rowIdx) => {
    const type = row[0];
    let colIdx = tileTypeToOldTilesColIdx(type, rowIdx);
    if (!oldTiles[rowIdx]) {
      oldTiles[rowIdx] = [];
    }
    oldTiles[rowIdx][colIdx] = type;
    return {rIdx: rowIdx, cIdx: colIdx};
  };

  const promoteTileRows = () => {
    let newTiles = deepClone(game.state.newTiles[game.state.playerTurn]);
    let oldTiles = deepClone(game.state.oldTiles[game.state.playerTurn]);
    let penaltyTiles = deepClone(game.state.penaltyTiles[game.state.playerTurn]);
    let score = 0;

    newTiles = newTiles.map((row, rowIdx) => {
      if(isRowFull(row, rowIdx)){
        const {rIdx, cIdx} = promoteTileRow(oldTiles, row, rowIdx);
        score += scoreCtrl.scorePromotedTile(oldTiles, rIdx, cIdx);
        return [];
      } else {
        return row;
      }
    });

    game.setState({newTiles: cloneSpliceArray(game.state.newTiles, game.state.playerTurn, newTiles)});
    game.setState({oldTiles: cloneSpliceArray(game.state.oldTiles, game.state.playerTurn, oldTiles)});

    score += scoreCtrl.scorePenaltyTiles(penaltyTiles);
    penaltyTiles = [];

    scoreCtrl.addScore(score);
    game.setState({penaltyTiles: cloneSpliceArray(game.state.penaltyTiles, game.state.playerTurn, penaltyTiles)});
  };

  const findNextPlayerTurn = () => {
    let nextPlayer = game.state.players.findIndex((p, idx) => game.state.penaltyTiles[idx].indexOf(TileTypes.ONE) >= 0);
    if (nextPlayer < 0) {
      nextPlayer = 0;
    }
    return nextPlayer;
  };

  const resetPlayerState = () => {
    game.setState({bagGroupTileSelected: null});
    game.setState({newTilesRowSelected: null});
    game.setState({centerTileSelected: null});
  };

  return {
    ...scoreCtrl,
    canAddToRow: canAddToRow,
    pickCenterTiles: pickCenterTiles,
    pickBagGroupTiles: pickBagGroupTiles,
    promoteTileRows: promoteTileRows,
    resetPlayerState: resetPlayerState,
    findNextPlayerTurn: findNextPlayerTurn
  };
};

export default playerController;