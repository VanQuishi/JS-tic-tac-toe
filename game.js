const boardCells = document.getElementsByClassName('cell');
const markOptionPanel = document.getElementById('markOptionPanel');
const difficultyOptionPanel = document.getElementById('difficultyOptionPanel');
const infoPanel = document.getElementById('infoPanel');
const userWinBanner = document.getElementById('userWinBanner');
const aiWinBanner = document.getElementById('aiWinBanner');
const drawBanner = document.getElementById('drawBanner');
const listOfTryAgainBtn = document.getElementsByClassName('tryAgainBtn');
const userMark = document.getElementById('userMark');
const AImark = document.getElementById('AImark');
var controller = new AbortController();
var user = '';
var ai = '';

const GameBoard = (() => {

  var boardArray = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]

  var emptyPositions = [
    [0,0], [0,1], [0,2],
    [1,0], [1,1], [1,2],
    [2,0], [2,1], [2,2]
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
    updateEmptyPostions(x, y);
  }

  const removeFromBoard = (x, y) => {
    boardArray[x][y] = '';
  }

  const gameOver = () => {

    for (let i = 0; i < 3; i++) {
      if (boardArray[i][0] != '') {
        if (boardArray[i][0] == boardArray[i][1] && boardArray[i][0] == boardArray[i][2]) {
          //console.log('game over, row match!');
          return boardArray[i][0];
        }
      }

      if (boardArray[0][i] != '') {
        if (boardArray[0][i] == boardArray[1][i] && boardArray[0][i] == boardArray[2][i]) {
          //console.log('game over, column match!');
          return boardArray[0][i];
        }
      }
    }

    if ((boardArray[0][0] == boardArray[1][1] && boardArray[1][1] == boardArray[2][2]) || 
    (boardArray[0][2] == boardArray[1][1] && boardArray[1][1] == boardArray[2][0])) {
      //console.log('game over, diagonal match!');
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
      //console.log('draw!');
      return 'draw';
    } else {
      return 'continue';
    }

  }

  const getAllEmptyPositions = () => {

    return emptyPositions;
  }

  const updateEmptyPostions = (x, y) => {
    var removedIdx = -1;

    for (var i = 0; i < emptyPositions.length; i++) {
      if (emptyPositions[i][0] == x && emptyPositions[i][1] == y) {
        removedIdx = i;
        break;
      }
    }

    emptyPositions.splice(removedIdx, 1);
  }

  const randomizeNextMove = () => {
    var emptyPositions = getAllEmptyPositions();

    var randomIndex = Math.floor(Math.random() * (emptyPositions.length - 0) + 0);
    return emptyPositions[randomIndex];
  }

  const calculateScore = (AImark, depth, isAImove) => {
    var result = gameOver();

    if (result != 'continue') {
      if (result == 'draw') {
        return 0;
      } 
      else if (result == AImark) {
        return -1 - depth;
      }
      else {
        return 1 + depth;
      }
    }

    if (isAImove) {
      //current move is AImove so next move will be player's move
      var bestScore = -Infinity;
      var playerMark = AImark == 'O' ? 'X' : 'O';
      for (var i = 0; i < emptyPositions.length; i++) {
        var x = emptyPositions[i][0];
        var y = emptyPositions[i][1];
        if (boardArray[x][y] == '') {
          boardArray[x][y] = playerMark;

          var score = calculateScore(AImark, depth + 1, false);
          boardArray[x][y] = '';
          bestScore = Math.max(score, bestScore);
        }       
      }

      return bestScore;
    }
    else {
      //current move is player's move so next move will be AImove
      var bestScore = Infinity;

      for (var i = 0; i < emptyPositions.length; i++) {
        var x = emptyPositions[i][0];
        var y = emptyPositions[i][1];
        if (boardArray[x][y] == '') {
          boardArray[x][y] = AImark;

          var score = calculateScore(AImark, depth + 1, true);
          boardArray[x][y] = '';
          bestScore = Math.min(score, bestScore);
        }       
      }

      return bestScore;
    }
  }

  const GetAINextMove = (AImark) => {
    var bestScore = Infinity;
    var move;
    for (var i = 0; i < emptyPositions.length; i++) {
      var x = emptyPositions[i][0];
      var y = emptyPositions[i][1];
      boardArray[x][y] = AImark;

      var score = calculateScore(AImark, 0, true);
      boardArray[x][y] = '';
      if (score < bestScore) {
        bestScore = score;
        move = [x, y];
      }
    }

    return move;
  }

  return {
    displayBoard,
    writeToBoard,
    gameOver,
    randomizeNextMove, 
    GetAINextMove,
    getAllEmptyPositions
  };
})();

const Player = (_name, _mark) => {

  return {_name, _mark};
};

const DisplayController = (() => {
  var difficulty = 'easy';
  var turn = 0;

  const announceWinner = (playerA, playerB) => {
    var winMark = GameBoard.gameOver();

    if (winMark == 'draw') {
      drawBanner.style.display = '';
      return true;

    } else if (winMark == 'X' || winMark == 'O') {
      if (winMark == playerA._mark) {
        userWinBanner.style.display = '';
      } else {
        aiWinBanner.style.display = '';
      }
      return true;

    } else {
      return false;
    }
  };

  const displayMarkOnClick = (x, y, player) => {
    GameBoard.writeToBoard(x, y, player._mark);
    var markedCell = document.getElementById("c" + x + y);
    markedCell.innerHTML = player._mark;
  }

  const playGame = (cellID, playerA, playerB) => {
    var coordinate;
    if (cellID != '') {
      coordinate = cellID.split('');
    }

    if (turn % 2 == 0) {
      if (playerA._mark == 'X') {
        displayMarkOnClick(coordinate[1], coordinate[2], playerA);
      } else {
        if (difficulty == 'easy') {
          coordinate = GameBoard.randomizeNextMove();
        } else {
          coordinate = GameBoard.GetAINextMove('X');
        }      
        displayMarkOnClick(coordinate[0], coordinate[1], playerB);
      }
    } else {
      if (playerA._mark == 'O') {
        displayMarkOnClick(coordinate[1], coordinate[2], playerA);
      } else {
        if (difficulty == 'easy') {
          coordinate = GameBoard.randomizeNextMove();
        } else {
          coordinate = GameBoard.GetAINextMove('O');
        } 
        displayMarkOnClick(coordinate[0], coordinate[1], playerB);
      }
    }

    var isOver = DisplayController.announceWinner(playerA, playerB);

    //if game is over, remove all eventListeners on the cells
    if (isOver == true) {
      Array.from(boardCells).map((cell) => {
        cell.replaceWith(cell.cloneNode(true));
      });
      return;
    }

    turn++;
    
  }

  const setDifficulty = (option) => {
    difficulty = option;
  }

  return {
    announceWinner,
    displayMarkOnClick,
    playGame,
    setDifficulty
  };
})();

function enableGameBoard() {
  //boardCells are not strictly Array but a HTMLCollection.
  // We need to cast it in Array to use map
  Array.from(boardCells).map((cell) => {
    cell.addEventListener("click", function playGameOnClick() {
      //first call of function is for player move
      DisplayController.playGame(this.id, user, ai);

      //second call of function is for AI move
      DisplayController.playGame(this.id, user, ai);
    })
  });
}

function initializePlayer(mark) {
  if (mark == 'X') {
    user = Player('user', 'X');
    ai = Player('AI', 'O');

    userMark.innerHTML = 'X';
    AImark.innerHTML = 'O';
  } else {
    user = Player('user', 'O');
    ai = Player('AI', 'X');

    userMark.innerHTML = 'O';
    AImark.innerHTML = 'X';

    DisplayController.playGame('', user, ai);
  }

  markOptionPanel.style.display = 'none';
  infoPanel.style.display = 'flex';
  enableGameBoard();
}

function setDifficulty(option) {
  DisplayController.setDifficulty(option);
  difficultyOptionPanel.style.display = 'none';
  markOptionPanel.style.display = 'flex';
}

Array.from(listOfTryAgainBtn).map((button) => {
  button.addEventListener("click", function refresh() {
    window.location.reload();
  })
});

GameBoard.displayBoard();