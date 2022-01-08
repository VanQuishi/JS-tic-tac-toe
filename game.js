const boardCells = document.getElementsByClassName('cell');
const optionPanel = document.getElementById('optionPanel');
var user = '';
var ai = '';

const GameBoard = (() => {
  //store gameboard as an array in here
  // var boardArray = [
  //   ['x', 'x', 'x'],
  //   ['o', 'x', 'o'],
  //   ['o', 'o', 'x']
  // ]
  var boardArray = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
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

    if ((boardArray[0][0] == boardArray[1][1] && boardArray[1][1] == boardArray[2][2]) || 
    (boardArray[0][2] == boardArray[1][1] && boardArray[1][1] == boardArray[2][0])) {
      console.log('game over, diagonal match!');
      return boardArray[1][1];
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
      return 'continue';
    }

  }

  const randomizeNextMove = () =>{
    var emptyPositions = [];

    boardArray.map((row, rowIndex) => {
      row.map((cellMark, cellIndex) => {
        var position = [];
        if (cellMark == '') {
          position.push(rowIndex);
          position.push(cellIndex);
          emptyPositions.push(position);
        }
      });
    });

    var randomIndex = Math.floor(Math.random() * (emptyPositions.length - 0) + 0);
    return emptyPositions[randomIndex];
  }

  return {
    displayBoard,
    writeToBoard,
    gameOver,
    randomizeNextMove
  };
})();

const Player = (_name, _mark) => {

  return {_name, _mark};
};

const DisplayController = (() => {
  var turn = 0;

  const announceWinner = (playerA, playerB) => {
    var winMark = GameBoard.gameOver();

    if (winMark == 'draw') {
      console.log('draw!');
      return true;
    } else if (winMark == 'x' || winMark == 'o') {
      winMark == playerA._mark ? console.log(playerA._name + ' wins') : console.log(playerB._name +' wins');
      var winner = winMark == playerA._mark ? playerA._name : playerB._name;
      return true;
    } else {
      console.log('game is not finished');
      return false;
    }
  };

  const displayMarkOnClick = (x, y, player) => {
    GameBoard.writeToBoard(x, y, player._mark);
    var markedCell = document.getElementById("c" + x + y);
    markedCell.innerHTML = player._mark;
  }

  const playGame = (cell, playerA, playerB) => {
    var coordinate = cell.id.split('');

    if (turn % 2 == 0) {
      if (playerA._mark == 'x') {
        displayMarkOnClick(coordinate[1], coordinate[2], playerA);
      } else {
        
        displayMarkOnClick(AINextMove[0], AINextMove[1], playerB);
      }
    } else {
      if (playerA._mark == 'o') {
        displayMarkOnClick(coordinate[1], coordinate[2], playerA);
      } else {
        var AINextMove = GameBoard.randomizeNextMove();
        displayMarkOnClick(AINextMove[0], AINextMove[1], playerB);
      }
    }

    DisplayController.announceWinner(playerA, playerB);

    turn++;
    console.log({turn});
  }

  return {
    announceWinner,
    displayMarkOnClick,
    playGame
  };
})();

function initializePlayer(mark) {
  if (mark == 'x') {
    user = Player('user', 'x');
    ai = Player('AI', 'o');
  } else {
    user = Player('user', 'o');
    ai = Player('AI', 'x');
    console.log(ai._mark);
  }

  optionPanel.style.display = 'none';
}

GameBoard.displayBoard();

//boardCells are not strictly Array but a HTMLCollection.
// We need to cast it in Array to use map
Array.from(boardCells).map((cell) => {
  cell.addEventListener("click", function() {
    //first call of function is for player move
    DisplayController.playGame(this, user, ai);

    //second call of function is for AI move
    DisplayController.playGame(this, user, ai);
  })
});


//To-Do:
/*
- Make random move for easy mode and use Minimax for advanced mode
- Disable click event for all board cells before user chooses a mark
- Add a time delay before AI move for a natural experience
- Code Minimax decision rule for AI
*/