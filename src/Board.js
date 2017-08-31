// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      
      var board = this.rows();
      var row = board[rowIndex];
      var sum = 0;

      for (let i = 0; i < row.length; i++) {
        sum = sum + row[i];
      }

      if (sum > 1) {
        return true;
      }

      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      
      var board = this.rows();
      for (let i = 0; i < board.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var board = this.rows();
      var sum = 0;
      var col = [];

      for (let i = 0; i < board.length; i++) {
        col.push(board[i][colIndex]);
      }

      for (let i = 0; i < col.length; i++) {
        sum = sum + col[i];
      }

      if (sum > 1) {
        return true;
      }

      return false;

    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var board = this.rows();
      for (let i = 0; i < board.length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var board = this.rows();
      var targetIndex = majorDiagonalColumnIndexAtFirstRow;
      var sum = 0;

      if (targetIndex === 0) {
        for (let i = 0; i < board.length; i++) {
          sum += board[i][i];
        }
      }

      if (targetIndex > 0) {
        for (let j = targetIndex; j < board.length; j++) {
          let x = j - targetIndex;
          sum += board[x][j];
        }
      }

      if (targetIndex < 0) {
        for (let k = Math.abs(targetIndex); k < board.length; k++) {
          let x = k - Math.abs(targetIndex);
          sum += board[k][x];
        }
      }

      return (sum > 1);

    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var board = this.rows();
      var index = board.length;
      var diagIndex = index / 2;
     //debugger;
      for (let i = -Math.abs(diagIndex); i < diagIndex; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;

    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var board = this.rows();
      var targetIndex = minorDiagonalColumnIndexAtFirstRow;
      var sum = 0;
      var n = board.length;
      var middleIndex = Math.ceil((n * 2 - 3) / 2);

      if (targetIndex === middleIndex) {
        let j = n - 1;
        for (let i = 0; i < n; i++) {
          sum += board[i][j];
          j--;
        }
      }

      if (targetIndex > middleIndex) {
        let x = targetIndex - middleIndex;
        let y = n - 1;
        for (let j = x; j < n; j++) {
          sum += board[y][y];
          y--;
        }
      }

      if (targetIndex < middleIndex) {
        let x = targetIndex;
        for (let k = 0; k < targetIndex + 1; k++) {
          sum += board[k][x];
          x--;
        }
      }

      return (sum > 1);
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      //debugger;
      var board = this.rows();
      var index = board.length;
      var diagIndex = board.length * 2 - 3;
      for (let i = 1; i < diagIndex + 1; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
