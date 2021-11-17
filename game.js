const GameBoard = (() => {
  //store gameboard as an array in here
  var boardArray = [
    ['x', 'x', 'x'],
    ['o', 'x', 'o'],
    ['o', 'o', 'x']
  ]

  // function displayBoard() {
  //   boardArray.map( function(row, rowIndex) {
  //     row.map( function(cellMark, cellIndex) {
  //       var cell = document.getElementById('c' + rowIndex + cellIndex);
  //       cell.innerHTML = cellMark;
  //     });
  //   });
  // }

  //diffrent syntax that also works
  const displayBoard = () => {
    boardArray.map((row, rowIndex) => {
      row.map((cellMark, cellIndex) => {
        var cell = document.getElementById('c' + rowIndex + cellIndex);
        cell.innerHTML = cellMark;
      });
    });
  }

  const writeToBoard = (x, y, mark) => {
    boardArray[x][y] = mark;
  }

  const gameOver = () => {

    for (let i = 0; i < 3; i++) {
      if (boardArray[i][0] != '') {
        if (boardArray[i][0] == boardArray[i][1] && boardArray[i][0] == boardArray[i][2]) {
          console.log('game over, row match!');
          return;
        }
      }

      if (boardArray[0][i] != '') {
        if (boardArray[0][i] == boardArray[1][i] && boardArray[0][i] == boardArray[2][i]) {
          console.log('game over, column match!');
          return;
        }
      }
    }

    //no match is found. check if the board is filled => draw
    var filledBoardFlag = true;

    for (let row = 0; row < 3; row++) {
      if (boardArray[row][0] == '' || boardArray[row][1] == '' || boardArray[row][2] == '') {
        filledBoardFlag = false;
        break;
      }
    }

    if (filledBoardFlag) {
      console.log('draw!');
    } else {
      console.log('game can continue');
    }

  }

  return {
    displayBoard,
    writeToBoard,
    gameOver
  };
})();

const Player = (playerName, playerMark) => {
  return {playerName, playerMark};
};

const DisplayController = (() => {
  //const assignPlayerMark = (playerName, playerMark) =>
  //const announceWinner = () =>
})();

// GameBoard.displayBoard();
GameBoard.writeToBoard(0,0,'x');
GameBoard.writeToBoard(1,0,'o');
GameBoard.displayBoard();
GameBoard.gameOver();