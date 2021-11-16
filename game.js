const GameBoard = (() => {
  //store gameboard as an array in here
  var boardArray = [
    ['x', 'x', 'x'],
    ['o', 'x', 'o'],
    ['o', 'o', 'x']
  ]

  // function displayBoard() {
  //   //console.log({boardArray});
  //   boardArray.map( function(row, rowIndex) {
  //     //console.log({row});
  //     row.map( function(cellMark, cellIndex) {
  //       //console.log({cellMark});
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
  //const gameOver = () =>

  return {
    displayBoard,
    writeToBoard
  };
})();

const Player = (playerName, playerMark) => {
  return {playerName, playerMark};
};

const DisplayController = (() => {
  //const assignPlayerMark = (playerName, playerMark) =>
  //const announceWinner = () =>
})();

GameBoard.displayBoard();
GameBoard.writeToBoard(0,0,'o');
GameBoard.displayBoard();