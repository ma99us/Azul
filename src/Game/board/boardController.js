import {TileTypes} from "../board/Tile";
import {BoardTiles} from "./Tile";

const boardController = (game) => {

  const findRowIndexIn2dTilesArrayByType = (tiles2dArray, type) => {
    if(!tiles2dArray){
      return -1;
    }
    return tiles2dArray.findIndex(row => row && row.length > 0 && row[0] === type);
  };

  const clone2dArray = (arr) => {
    const cArr = arr instanceof Array ? [...arr] : [];
    cArr.map((r, i) => arr[i] instanceof Array ? [...arr[i]] : Object.assign({}, arr[i]));
    return cArr;
  };

  const dumpCenterTiles = (centerTiles, type, num) => {
    const idx = findRowIndexIn2dTilesArrayByType(centerTiles, type);
    let tileRow = [];
    if (idx >= 0) {
      tileRow = centerTiles[idx];
    } else {
      centerTiles.push(tileRow);
    }
    for (let i = 0; i < num; i++) {
      tileRow.push(type);
    }
  };

  const drawBagTiles = (groups) => {
    let bagTiles = [];
    for (let i = 0; i < groups; i++) {
      let groupTiles = [];
      for (let g = 0; g < 4; g++) {
        let tileType = BoardTiles[Math.floor(Math.random() * BoardTiles.length)];   // FIXME: this should not be just random, total tiles amounts should be considered
        groupTiles.push(tileType);
      }
      bagTiles.push(groupTiles);
    }
    game.setState({bagTiles: bagTiles});

    // reset center tiles
    const centerTiles = [];
    dumpCenterTiles(centerTiles, TileTypes.ONE, 1);
    game.setState({centerTiles: centerTiles});
  };

  return {
    dumpCenterTiles: dumpCenterTiles,
    drawBagTiles: drawBagTiles
  };
};

export default boardController;