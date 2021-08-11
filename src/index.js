module.exports = function solveSudoku(matrix) {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let solution = [], values = [], tmpGrids = [[[], [], []], [[], [], []], [[], [], []]];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      tmpGrids[indexToGrid(i)][indexToGrid(j)].push(matrix[i][j]);
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    let row = [], rowValues = [];
    for (let j = 0; j < matrix.length; j++) {
      let tmpRow = [...matrix[i]], tmpCol = [];
      for (let k = 0; k < matrix.length; k++) {
        tmpCol.push(matrix[k][j]);
      }
      let value, tmp = [];
      if (!matrix[i][j]) {
        digits.map(x => {
          if (!tmpRow.includes(x) && !tmpCol.includes(x)
            && !tmpGrids[indexToGrid(i)][indexToGrid(j)].includes(x)) {
            tmp.push(x);
          }
        });
        value = tmp[0];
      } else {
        value = matrix[i][j];
      }
      row.push(value);
      rowValues.push(tmp);
    }
    solution.push(row);
    values.push(rowValues);
  }

  let hasChanges;
  do {
    hasChanges = false;

    tmpGrids = [[[], [], []], [[], [], []], [[], [], []]];
    for (let i = 0; i < solution.length; i++) {
      for (let j = 0; j < solution.length; j++) {
        tmpGrids[indexToGrid(i)][indexToGrid(j)].push(solution[i][j]);
      }
    }

    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values.length; j++) {
        if (values[i][j].length == 1) {
          let value = values[i][j][0];
          values[i][j].splice(0, 1);
          for (let k = 0; k < values.length; k++) {
            if (k != i && values[k][j].length > 1) {
              let index = values[k][j].indexOf(value);
              if (index > -1) {
                hasChanges = true;
                values[k][j].splice(index, 1);
                solution[k][j] = values[k][j][0];
                if (values[k][j].length > 1) {
                  tmpGrids[indexToGrid(k)][indexToGrid(j)].map(x => {
                    let index = values[k][j].indexOf(x);
                    if (index > -1) {
                      values[k][j].splice(index, 1);
                      solution[k][j] = values[k][j][0];
                    }
                  })
                }
              }
            }
            for (let l = 0; l < values.length; l++) {
              if (l != j && values[i][l].length > 1) {
                let index = values[i][l].indexOf(value);
                if (index > -1) {
                  hasChanges = true;
                  values[i][l].splice(index, 1);
                  solution[i][l] = values[i][l][0];
                  if (values[i][l].length > 1) {
                    tmpGrids[indexToGrid(i)][indexToGrid(l)].map(x => {
                      let index = values[i][l].indexOf(x);
                      if (index > -1) {
                        values[i][l].splice(index, 1);
                        solution[i][l] = values[i][l][0];
                      }
                    })
                  }
                }
              }
            }
          }
        }
      }
    }
  } while (hasChanges)

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
            let tmp = values[k][l];
            if (tmp.length > 1) {
              let index = tmp.indexOf(solution[k][l]);
              if (index == tmp.length - 1) {
                solution[k][l] = tmp[0];
              } else {
                solution[k][l] = tmp[index + 1];
                k = solution.length;
                break;
              }
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

function valueRemove(value, values,) {

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
  if (maxOfArray(rows) != minOfArray(rows))
    return false;
  if (maxOfArray(cols) != minOfArray(cols))
    return false;
  if (maxOfArray(grids.flat()) != minOfArray(grids.flat()))
    return false;
  return true;
}
