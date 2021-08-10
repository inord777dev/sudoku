module.exports = function solveSudoku(matrix) {
  let solution = [];
  for (let i = 0; i < matrix.length; i++) {
    let row = [];
    for (let j = 0; j < matrix.length; j++) {
      row.push(matrix[i][j] ? matrix[i][j] : 1);
    }
    solution.push(row);
  }

  let isSolved = false;
  while (!isSolved) {

    let rows = [0, 0, 0, 0, 0, 0, 0, 0, 0],
    cols = [0, 0, 0, 0, 0, 0, 0, 0, 0],
    grids = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  
    for (let i = 0; i < solution.length; i++) {
      for (let j = 0; j < solution.length; j++) {
        rows[i] += solution[i][j];
        cols[j] += solution[i][j];
        grids[indexToGrid(i)][indexToGrid(j)] += solution[i][j];
      }
    }

    isSolved = solutionSolved(rows, cols, grids);

    if (!isSolved) {
      let k = 0;
      while (k < solution.length) {
        let l = 0;
        while (l < solution.length) {
          if (!matrix[k][l]) {
            if (solution[k][l] == 9) {
              solution[k][l] = 1;
            } else {
              solution[k][l]++;
              k = solution.length;
              break;
            }
          }
          l++;
        }
        k++;
      }

    }
  }

  return solution;

}

function indexToGrid(index) {
  return Math.floor(index / 3);
}

function maxOfArray(arr) {
  return Math.max.apply(null, arr)
}

function minOfArray(arr) {
  return Math.min.apply(null, arr)
}

function solutionSolved(rows, cols, grids) {
  const rowsSolved = maxOfArray(rows) == minOfArray(rows),
  colsSolved = maxOfArray(cols) == minOfArray(cols),
  gridsSolved = maxOfArray(grids.flat()) == minOfArray(grids.flat());
  return rowsSolved && colsSolved && gridsSolved;
}
