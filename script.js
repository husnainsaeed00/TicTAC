const $winningPlayer = document.querySelector(".winning-player");
const $heading = document.querySelector(".player-header");
const $humanBtn = document.querySelector("#human");
const $aIBtn = document.querySelector("#ai");
const $startBtn = document.querySelector("#start");
let $cells; // Declare $cells variable

// Initialize board state
let boardState = ["", "", "", "", "", "", "", "", ""];

// Function to handle player selection
const handlePlayerSelection = (selectedPlayer) => {
  $cells = document.querySelectorAll(".cell");
  if (selectedPlayer === "ai") {
    $aIBtn.classList.add("clicked");
  } else {
    $humanBtn.classList.add("clicked");
  }
};

// Function to check for a winning condition
const checkWin = (board, player) => {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winCombinations.some(combination => {
    return combination.every(index => board[index] === player);
  });
};

// Function to display winning message
const displayWinner = (player) => {
  $winningPlayer.textContent = `${player} wins!`;
  $startBtn.classList.toggle("hidden")
};

// Function to reset the game
const resetGame = () => {
  $cells.forEach(cell => {
    cell.innerHTML = "";
  });
  //$startBtn.classList.add("hidden");
  //$winningPlayer.classList.add("hidden");
};

// Function to handle a player's move
const handlePlayerMove = (cellIndex) => {
  if (boardState[cellIndex] === "") {
    let currentPlayerSymbol = "";
    if ($aIBtn.classList.contains("clicked")) {
      currentPlayerSymbol = "X"; // AI is X
    } else {
      currentPlayerSymbol = "O"; // Human is O
    }

    boardState[cellIndex] = currentPlayerSymbol;

    if ($cells && $cells.length > cellIndex && $cells[cellIndex]) {
      $cells[cellIndex].textContent = currentPlayerSymbol;

      if (checkWin(boardState, currentPlayerSymbol)) {
        displayWinner($aIBtn.classList.contains("clicked") ? "AI" : "Human");
        $startBtn.classList.remove("hidden");
        return; // End the game when there's a winner
      }

      let isBoardFull = true;
      for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === "") {
          isBoardFull = false;
          break;
        }
      }

      if (isBoardFull) {
        // Handle a tie/draw scenario
        displayWinner("It's a tie!");
        $startBtn.classList.remove("hidden");
        return; // End the game when it's a tie
      }
    } else {
      console.error("Cell element is undefined or does not exist.");
    }
  }
};

// Function to calculate AI's move (Random move)
const getAIMove = () => {
  const availableCells = boardState.reduce((acc, curr, index) => {
    if (curr === "") {
      acc.push(index);
    }
    return acc;
  }, []);

  if (availableCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIndex];
  }

  return -1;
};

// Function to toggle elements
const toggleElements = () => {
  const $board = document.querySelector(".board");
  $board.classList.toggle("hidden");
  $winningPlayer.classList.toggle("hidden");
  $heading.classList.toggle("hidden");
  $startBtn.classList.toggle("hidden");
};

// Function to reset the game and start
const startGame = () => {
  resetGame();
  if ($cells && $cells.length > 0) {
    $cells.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        if (!$startBtn.classList.contains("hidden")) return; // Prevent clicks after the game is won
        handlePlayerMove(index);
        const aiMove = getAIMove();
        if (aiMove !== -1 && !$startBtn.classList.contains("hidden")) {
          handlePlayerMove(aiMove);
        }
      });
    });
    toggleElements();
  } else {
    console.error("Cell elements are not selected or do not exist.");
  }
};

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  $startBtn.addEventListener("click", () => {
    startGame();
    toggleElements();
  });
  $aIBtn.addEventListener("click", () => {
    handlePlayerSelection("ai");
    startGame(); // Ensure game starts upon AI selection
  });
  $humanBtn.addEventListener("click", () => {
    handlePlayerSelection("human");
    startGame(); // Ensure game starts upon Human selection
  });
});