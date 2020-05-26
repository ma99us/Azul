import {TileTypes, BoardTiles, Direction} from "../board/Tile";

const Penalties = [-1, -1, -2, -2, -2, -3, -3];

const scoreController = (game) => {

  const addScore = (delta) => {
    let score = game.state.score + delta;
    if (score < 0) {
      score = 0;
    }
    game.setState({score: score});
  };

  const getSafeTileFrom2dArray = (tiles, rIdx, cIdx) => {
    if (cIdx < 0 || rIdx < 0 || rIdx >= tiles.length) {
      return null;
    }
    const row = tiles[rIdx];
    if (!row || cIdx >= row.length) {
      return null;
    }
    return row[cIdx];
  };

  const countMatchingTiles = (tiles, rIdx, cIdx, dir) => {
    const type = getSafeTileFrom2dArray(tiles, rIdx, cIdx);
    let rowIdx = rIdx;
    let colIdx = cIdx;
    let len = 0;
    do {
      if (dir === Direction.TOP) {
        rowIdx--;
      } else if (dir === Direction.RIGHT) {
        colIdx++;
      } else if (dir === Direction.BOTTOM) {
        rowIdx++;
      } else if (dir === Direction.LEFT) {
        colIdx--;
      } else {
        throw new Error('Direction must be specified');
      }
      len++;
    } while (type && getSafeTileFrom2dArray(tiles, rowIdx, colIdx));
    return len - 1;
  };

  const scorePromotedTile = (tiles, rIdx, cIdx) => {
    let totalLen = 1;
    totalLen += countMatchingTiles(tiles, rIdx, cIdx, Direction.TOP);
    totalLen += countMatchingTiles(tiles, rIdx, cIdx, Direction.RIGHT);
    totalLen += countMatchingTiles(tiles, rIdx, cIdx, Direction.BOTTOM);
    totalLen += countMatchingTiles(tiles, rIdx, cIdx, Direction.LEFT);
    console.log(`scorePromotedTile; ${rIdx}, ${cIdx} => ${totalLen}`);    // #DEBUG
    return totalLen;
  };

  const scorePenaltyTiles = (tiles) => {
    const length = tiles ? tiles.length : 0;
    const score = Penalties.reduce((score, p, idx) => (idx < length ? score + p : score), 0);
    console.log(`scorePenaltyTiles; ${score}`);    // #DEBUG
    return score;
  };

  return {
    addScore: addScore,
    scorePromotedTile: scorePromotedTile,
    scorePenaltyTiles: scorePenaltyTiles
  };
};

export default scoreController;