const boardCells = document.getElementsByClassName('cell');
const optionPanel = document.getElementById('optionPanel');
var user = '';
var ai = '';

const GameBoard = (() => {
  
  var boardArray = [
    ['x', '', 'o'],
    ['', 'o', ''],
    ['x', 'x', 'o']
  ]

  // var emptyPositions = [
  //   [0,0], [0,1], [0,2],
  //   [1,0], [1,1], [1,2],
  //   [2,0], [2,1], [2,2]
  // ]

  var emptyPositions = [
    [0,1], 
    [1,0], [1,2],
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
        return 0 - depth;
      } 
      else if (result == AImark) {
        return -1 - depth;
      }
      else {
        return 1 - depth;
      }
    }

    if (isAImove) {
      //current move is AImove so next move will be player's move
      var bestScore = Infinity;
      var playerMark = AImark == 'o' ? 'x' : 'o';

      for (var i = 0; i < emptyPositions.length; i++) {
        var x = emptyPositions[i][0];
        var y = emptyPositions[i][1];
        if (boardArray[x][y] == '') {
          boardArray[x][y] = playerMark;

          var score = calculateScore(AImark, depth + 1, false);
          boardArray[x][y] = '';
          bestScore = Math.min(score, bestScore);
          // if (score < bestScore) {
          //   bestScore = score;
          // }
        }       
      }

      return bestScore;
    }
    else {
      //current move is player's move so next move will be AImove
      var bestScore = -Infinity;

      for (var i = 0; i < emptyPositions.length; i++) {
        var x = emptyPositions[i][0];
        var y = emptyPositions[i][1];
        if (boardArray[x][y] == '') {
          boardArray[x][y] = AImark;

          var score = calculateScore(AImark, depth + 1, true);
          boardArray[x][y] = '';
          bestScore = Math.max(score, bestScore);
          // if (score > bestScore) {
          //   bestScore = score;
          // }
        }       
      }

      return bestScore;
    }
  }

  const GetAINextMove = (AImark) => {
    var bestScore = -Infinity;
    var move;

    for (var i = 0; i < emptyPositions.length; i++) {
      var x = emptyPositions[i][0];
      var y = emptyPositions[i][1];
      boardArray[x][y] = AImark;

      var score = calculateScore(AImark, 0, true);
      boardArray[x][y] = '';
      if (score > bestScore) {
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
    var AINextMove = [];

    console.log({turn});
    if (turn % 2 == 0) {
      if (playerA._mark == 'x') {
        displayMarkOnClick(coordinate[1], coordinate[2], playerA);
      } else {
        console.log({difficulty});
        if (difficulty == 'easy') {
          AINextMove = GameBoard.randomizeNextMove();
        } else {
          AINextMove = GameBoard.GetAINextMove('o');
          console.log({AINextMove});
        }      
        displayMarkOnClick(AINextMove[0], AINextMove[1], playerB);
      }
    } else {
      if (playerA._mark == 'o') {
        displayMarkOnClick(coordinate[1], coordinate[2], playerA);
      } else {
        console.log({difficulty});
        if (difficulty == 'easy') {
          AINextMove = GameBoard.randomizeNextMove();
        } else {
          AINextMove = GameBoard.GetAINextMove('x');
          console.log({AINextMove});
        } 
        displayMarkOnClick(AINextMove[0], AINextMove[1], playerB);
      }
    }

    DisplayController.announceWinner(playerA, playerB);

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

DisplayController.setDifficulty('difficult');
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
x Make random move for easy mode 
- Use Minimax for advanced mode
- Disable click event for all board cells before user chooses a mark
- Add a time delay before AI move for a natural experience
- Code Minimax decision rule for AI
*/