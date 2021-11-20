const boardCells = document.getElementsByClassName('cell');

const GameBoard = (() => {
  //store gameboard as an array in here
  var boardArray = [
    ['x', 'x', 'x'],
    ['o', 'x', 'o'],
    ['o', 'o', 'x']
  ]

  //turn variable to know whose turn right now. 0: play first, 1: play second
  var turn = 0;

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
          return boardArray[i][0];
        }
      }

      if (boardArray[0][i] != '') {
        if (boardArray[0][i] == boardArray[1][i] && boardArray[0][i] == boardArray[2][i]) {
          console.log('game over, column match!');
          return boardArray[0][i];
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
      return 'draw';
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

const Player = (_name, _mark) => {

  return {_name, _mark};
};

const DisplayController = (() => {

  const announceWinner = (playerA, playerB) => {
    var winMark = GameBoard.gameOver();

    if (winMark == 'draw') {
      console.log('draw!');
    } else if (winMark == 'x' || winMark == 'o') {
      winMark == playerA._mark ? console.log(playerA._name + ' wins') : console.log(playerB._name +' wins');
    } else {
      console.log('game is not finished');
    }
  };

  return {announceWinner};
})();

//boardCells are not strictly Array but a HTMLCollection.
// We need to cast it in Array to use map
Array.from(boardCells).map((cell) => {
  cell.addEventListener("click", function() {
    console.log('cell is clicked');
  })
})

const user = Player('user', 'x');
const ai = Player('AI', 'o');

GameBoard.writeToBoard(0,0,'x');
GameBoard.writeToBoard(1,0,'o');
GameBoard.displayBoard();
GameBoard.gameOver();
DisplayController.announceWinner(user, ai);