module.exports = function solveSudoku(matrix) {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let solution = [], variants = [];
  let attempt = [];
  for (let i = 0; i < matrix.length; i++) {
    let solutionRow = [], variant = [];
    for (let j = 0; j < matrix.length; j++) {
      solutionRow.push(matrix[i][j]);
      if (matrix[i][j] > 0) {
        variant.push([]);
      } else {
        variant.push([...digits]);
      }
    }
    solution.push(solutionRow);
    variants.push(variant);
  }

  let hasChanges;
  do {
    hasChanges = false;

    for (let i = 0; i < variants.length; i++) {
      for (let j = 0; j < variants.length; j++) {
        if (variants[i][j].length) {
          let row = [], col = [];
          for (let k = 0; k < variants.length; k++) {
            if (k != i && variants[k][j].length <= 1) {
              col.push(solution[k][j]);
            }
          };

          for (let l = 0; l < variants.length; l++) {
            if (l != j && variants[i][l].length <= 1) {
              row.push(solution[i][l]);
            }
          };

          col.map(x => {
            let index = variants[i][j].indexOf(x);
            if (index > -1) {
              hasChanges = true;
              variants[i][j].splice(index, 1);
            }
          });

          row.map(x => {
            let index = variants[i][j].indexOf(x);
            if (index > -1) {
              hasChanges = true;
              variants[i][j].splice(index, 1);
            }
          });
        }

      }
    }

    tmpGrids = [[[], [], []], [[], [], []], [[], [], []]];
    for (let i = 0; i < solution.length; i++) {
      for (let j = 0; j < solution.length; j++) {
        if (variants[i][j].length <= 1) {
          tmpGrids[indexToGrid(i)][indexToGrid(j)].push(solution[i][j]);
        }
      }
    }

    for (let i = 0; i < variants.length; i++) {
      for (let j = 0; j < variants.length; j++) {
        if (variants[i][j].length) {
          tmpGrids[indexToGrid(i)][indexToGrid(j)].map(x => {
            let index = variants[i][j].indexOf(x);
            if (index > -1) {
              hasChanges = true;
              variants[i][j].splice(index, 1);
            }
          })
        }
      }
    }

    for (let i = 0; i < variants.length; i++) {
      for (let j = 0; j < variants.length; j++) {
        if (variants[i][j].length > 1) {
          let row = [], col = [];
          for (let k = 0; k < variants.length; k++) {
            if (k != i && variants[k][j].length >= 1) {
              col.push(variants[k][j]);
            }
          };

          for (let l = 0; l < variants.length; l++) {
            if (l != j && variants[i][l].length >= 1) {
              row.push(variants[i][l]);
            }
          }

          let variantNew;
          let colAll = col.flat();
          variantNew = variants[i][j].filter(x => !colAll.includes(x));
          if (variantNew.length && variantNew.join('') != variants[i][j].join("")) {
            hasChanges = true;
            variants[i][j] = variantNew;
          }

          let rowAll = row.flat();
          variantNew = variants[i][j].filter(x => !rowAll.includes(x));
          if (variantNew.length && variantNew.join('') != variants[i][j].join("")) {
            hasChanges = true;
            variants[i][j] = variantNew;
          }
        }
      }
    }

    if (!hasChanges) {
      for (let i = 0; i < solution.length; i++) {
        for (let j = 0; j < solution.length; j++) {
          if (variants[i][j].length == 1) {
            hasChanges = true;
            solution[i][j] = variants[i][j].pop();
          }
        }
      }
    }

    if (!hasChanges) {
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
        let countVariant = 0, maxLength = 0;
        let attemptCount = 0;
        variants.map( x => { x.map(xx => {
          if (xx.length) {
            countVariant++;
            maxLength =  Math.max(maxLength, xx.length);
          }
        })});

        if (!attempt.length) {
          attemptCount = 0;
          attempt.push([JSON.parse(JSON.stringify(solution)), JSON.parse(JSON.stringify(variants)), attemptCount]);
        } else if (countVariant == 0 || countVariant / maxLength != maxLength) {
          let oldAttempt = attempt[attempt.length - 1];
          attemptCount = ++oldAttempt[2];
          solution = JSON.parse(JSON.stringify(oldAttempt[0]));
          variants = JSON.parse(JSON.stringify(oldAttempt[1]));
        }

        let k = 0;
        while (k < solution.length) {
          let l = 0;
          while (l < solution.length) {
            if (!matrix[k][l] && variants[k][l].length) {
                if (attemptCount >= variants[k][l].length) {
                  attemptCount -= variants[k][l].length;
                  l++;
                  continue;
                } else {
                  hasChanges = true;
                  solution[k][l] = variants[k][l][attemptCount];
                  variants[k][l] = [solution[k][l]];
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

  } while (hasChanges)

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
  if (maxOfArray(rows) != minOfArray(rows))
    return false;
  if (maxOfArray(cols) != minOfArray(cols))
    return false;
  if (maxOfArray(grids.flat()) != minOfArray(grids.flat()))
    return false;
  return true;
}
