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
  var board = new Board({n: n}); // fixme??

  
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

  var solutionCount = 0;
  var board = new Board({n: n});
  
  var rookPermutations = function(board, row) {
    //iterate through n positions for row 1 (make internal function) -- pass board state and/or row number??
    for (var i = 0; i < n; i++) {
      board.togglePiece(row, i);
      //check to see if base state is reached by checking if row number = n-1
      if (row === n - 1) {
        //once at base case, check the board for conflicts-- any board without conflicts adds 1 to solutionCount
        if (!board.hasAnyRooksConflicts()) {
          solutionCount++;
        }
        return;
      }
      
      var newBoard = new Board(board.rows());
      //call itself with board state and row number
      rookPermutations(newBoard, row + 1);
    }
  };
  rookPermutations(board, 0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount; // returns integer with number of possible solutions
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
