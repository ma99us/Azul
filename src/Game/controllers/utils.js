/**
 * Clones arrays and objects deeply/recursively.
 * @param obj
 * @returns {*}
 */
export const deepClone = (obj) => {
  if (obj instanceof Array) {
    return obj.map((r, i) => deepClone(r));
  } else if (obj != null && obj instanceof Object) {
    const cArr = Object.assign({}, obj);
    Object.keys(obj).forEach(key => {
      cArr[key] = deepClone(obj[key]);
    });
    return cArr;
  } else {
    return obj;
  }
};

/**
 * Deep clones "arr" and replaces it's element with key "rowIdx" with "rowArr".
 * @param arr
 * @param rowIdx
 * @param rowArr
 * @returns {*}
 */
export const cloneSpliceArray = (arr, rowIdx, rowArr) => {
  const cArr = deepClone(arr);
  cArr[rowIdx] = rowArr;
  return cArr;
};

/**
 * Finds index of the first array row containing a given element.
 * @param tiles2dArray
 * @param type
 * @returns {*}
 */
export const findRowIndexIn2dTilesArrayByType = (tiles2dArray, type) => {
  if(!tiles2dArray){
    return -1;
  }
  return tiles2dArray.findIndex(row => row && row.length > 0 && row[0] === type);
};