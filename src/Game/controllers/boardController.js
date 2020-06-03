import {TileTypes} from "../board/Tile";
import {BoardTiles} from "../board/Tile";
import {findRowIndexIn2dTilesArrayByType} from "./utils";

const boardController = (game) => {

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

  const isDiceLeft = (bagTiles, centerTiles) => {
    const bagTilesLeft = bagTiles.reduce((total, grp) => grp ? total + grp.length : total, 0);
    const centerTilesLeft = centerTiles.reduce((total, grp) => grp ? total + grp.length : total, 0);
    console.log("isDiceLeft; bagTilesLeft=" + bagTilesLeft + ", centerTilesLeft=" + centerTilesLeft); // #DEBUG
    return bagTilesLeft + centerTilesLeft;
  };

  return {
    dumpCenterTiles: dumpCenterTiles,
    drawBagTiles: drawBagTiles,
    isDiceLeft: isDiceLeft
  };
};

export default boardController;