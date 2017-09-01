
/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/
*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  

  var rowArray = [];
  var colArray = [];
  // create new board
  var board = new Board({n: n});

  var initializeArray = function(arr) {
    for (var i = 0; i < n; i++) {
      arr.push(i);
    }
  };
  
  var pruneArray = function(arr, val) {
    arr.splice(arr.indexOf(val), 1);
  };
  
  initializeArray(rowArray);
  initializeArray(colArray);
  // toggle first space
  board.togglePiece(0, 0);
  pruneArray(rowArray, 0);
  pruneArray(colArray, 0);
  // for loop
  var findNextSpot = function() {
    // toggle a space inside the loop
    // check for rook conflict
    // if conflict
      // remove toggle
    // else continue
      // modify our iteration arrays
      // break out of current for loops
      // recurse to start new for loops on a smaller sample set
    for (var i of rowArray) {
      for (var j of colArray) {
        board.togglePiece(i, j);
        if (board.hasAnyRooksConflicts()) {
          board.togglePiece(i, j);
          continue;
        } else {
          pruneArray(rowArray, i);
          pruneArray(colArray, j);
          return;
        }
      }
    }
  };
  
  while (rowArray.length > 0 && colArray.length > 0) {
    findNextSpot();
  }
  
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(board));
  return board.rows(); // return array with first solution
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  //debugger
  var solutionCount = 0;
  var depth = 0;  

  var rookCount = function(round, rookSet) {
    
    if (round === n) {
      if (rookSet.size === n) {
        solutionCount++;
      }
      return;
    }

    for (var i = 0; i < n; i++) {
      var newSet = new Set([...rookSet]);
      newSet.add(i);
      rookCount(round + 1, newSet);
    }
  };

  //iterate n times
  var emptySet = new Set();
  rookCount(0, emptySet);


  return solutionCount;
  
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {

  var solution = new Board({n: n});
  if (n === 0 || n === 2 || n === 3) {
    return solution.rows();
  }

  var randomBoard = function() {
    var colTrack = {};
    // make a board
    var board = new Board({n: n});
    for (var i = 0; i < n; i++) {
      let index = Math.floor(Math.random() * n);
      while (colTrack[index] !== undefined ) {
        index = Math.floor(Math.random() * n);
      }
      colTrack[index] = index;
      board.togglePiece(i, index);
    }
    return board;
  };

  solution = new Board(randomBoard().rows());

  while (solution.hasAnyQueensConflicts()) {
    solution = new Board(randomBoard().rows());
  }

  //console.log('solution',solution.rows());
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var board = new Board({n: n});
  if (n === 2 || n === 3) {
    return 0;
  }
  if (n === 0) {
    return 1;
  }
  var solutionCount = 0;
  //debugger;
  var findSpots = function(row, col) {
    //if col === n, check to see if board it viable - return board if so
    if (col === n) {
      if (!board.hasAnyQueensConflicts()) {
        solutionCount++;
      }
      return;
    }

    //logic to eliminate positions that need to be checked
    




    for (var i = 0; i < n; i++) {

      if (i === row || i === row + 1 || i === row - 1) {
        continue;
      }

      // if (badArr.indexOf(i) !== -1) {
      //   continue;
      // }
    //iterate through column to find viable spot
      board.togglePiece(col, i);
      //if spot returns false, toggle off and continue
      if (board.hasAnyQueenConflictsOn(col, i)) {
        board.togglePiece(col, i);
        //badArr.push(i);
      } else {
        //if spot is viable pass on to next iteration
        findSpots(i, col + 1);
        board.togglePiece(col, i);
        //badArr.pop();
      }
    }
  };
  
  //iterate through starting positions
  for (var i = 0; i < n; i++) {
    //clear board
    board = new Board({n: n});
    //toggle starting position on board
    board.togglePiece(0, i);

    var badCol = [i];
    //pass column number into findSpots function 
    findSpots(i, 1);
  }
  return solutionCount;
};