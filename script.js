
const board = document.getElementById("gameBoard");
const statusText = document.getElementById("statusText");
const winLine = document.getElementById("winLine");
const modalGameCode = document.getElementById("modalGameCode");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");
const xScore = document.getElementById("xScore");
const oScore = document.getElementById("oScore");
const drawScore = document.getElementById("drawScore");

let cells = [];
let currentPlayer = "x";
let gameActive = false;
let gameMode = null;
let boardState = Array(9).fill("");
let scores = { x: 0, o: 0, draw: 0 };

let gameCode = null;
let isHost = false;

// --------------------- CORE FUNCTIONS ---------------------

function setMode(mode) {
  gameMode = mode;
  resetGame();
  gameActive = true;
  statusText.textContent = `Mode: ${mode.replace('_', ' ').toUpperCase()}`;
  if (gameMode === "pvp_online" && gameCode) setupFirebaseListeners();
}

function resetGame() {
  board.innerHTML = "";
  boardState = Array(9).fill("");
  winLine.style.opacity = 0;
  winLine.style.transform = "none";
  winLine.classList.remove("animate-line");
  currentPlayer = "x";
  statusText.textContent = "";
  createBoard();
  gameActive = true;

  if (gameMode === "pvp_online" && gameCode) {
    db.ref("games/" + gameCode).set({
      board: boardState,
      currentPlayer: currentPlayer,
      reset: true
    });
  }
}

function createBoard() {
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => handleMove(i));
    board.appendChild(cell);
    cells[i] = cell;
  }
}

function handleMove(index) {
  if (!gameActive || boardState[index] !== "" || (gameMode === 'pvp_online' && !isMyTurn())) return;

  boardState[index] = currentPlayer;
  cells[index].classList.add(currentPlayer);

  const winCombo = checkWinner();
  if (winCombo) {
    gameActive = false;
    drawWinLine(...winCombo);
    statusText.textContent = `${currentPlayer.toUpperCase()} Wins!`;
    scores[currentPlayer]++;
    updateScore();
  } else if (!boardState.includes("")) {
    gameActive = false;
    statusText.textContent = "It's a Draw!";
    scores.draw++;
    updateScore();
  } else {
    currentPlayer = currentPlayer === "x" ? "o" : "x";
    if (gameMode === "pvc" && currentPlayer === "o") {
      setTimeout(() => {
        const bestMove = findBestMove([...boardState]);
        handleMove(bestMove);
      }, 300);
    }
  }

  if (gameMode === "pvp_online" && gameCode) {
    db.ref("games/" + gameCode).set({
      board: boardState,
      currentPlayer: currentPlayer
    });
  }
}

function updateScore() {
  xScore.textContent = scores.x;
  oScore.textContent = scores.o;
  drawScore.textContent = scores.draw;
}

function checkWinner() {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let combo of wins) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return combo;
    }
  }
  return null;
}

// ---------------------- AI (Minimax with Alpha-Beta) -----------------------

function findBestMove(boardCopy) {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (boardCopy[i] === "") {
      boardCopy[i] = "o";
      let moveVal = minimax(boardCopy, 0, false, -Infinity, Infinity);
      boardCopy[i] = "";
      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function minimax(board, depth, isMax, alpha, beta) {
  const winner = checkWinnerMinimax(board);
  if (winner === "o") return 10 - depth;
  if (winner === "x") return depth - 10;
  if (!board.includes("")) return 0;

  if (isMax) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "o";
        let eval = minimax(board, depth + 1, false, alpha, beta);
        board[i] = "";
        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "x";
        let eval = minimax(board, depth + 1, true, alpha, beta);
        board[i] = "";
        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}

function checkWinnerMinimax(boardArr) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let combo of wins) {
    const [a, b, c] = combo;
    if (boardArr[a] && boardArr[a] === boardArr[b] && boardArr[a] === boardArr[c]) {
      return boardArr[a];
    }
  }
  return null;
}

// --------------------- WIN LINE -----------------------

function drawWinLine(a, b, c) {
  const cellA = cells[a].getBoundingClientRect();
  const cellC = cells[c].getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  const x1 = cellA.left + cellA.width / 2 - boardRect.left;
  const y1 = cellA.top + cellA.height / 2 - boardRect.top;
  const x2 = cellC.left + cellC.width / 2 - boardRect.left;
  const y2 = cellC.top + cellC.height / 2 - boardRect.top;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  winLine.style.top = `${y1}px`;
  winLine.style.left = `${x1}px`;
  winLine.style.width = `0px`;
  winLine.style.transform = `rotate(${angle}deg)`;
  winLine.style.opacity = 1;

  winLine.classList.remove("animate-line");
  void winLine.offsetWidth;
  winLine.classList.add("animate-line");

  setTimeout(() => {
    winLine.style.width = `${length}px`;
  }, 10);
}

// ------------------ ONLINE MULTIPLAYER ------------------

function generateCode() {
  gameCode = Math.random().toString(36).substring(2, 7).toUpperCase();
  modalGameCode.textContent = gameCode;
  gameCodeDisplay.textContent = gameCode;
  isHost = true;

  db.ref("games/" + gameCode).set({
    board: Array(9).fill(""),
    currentPlayer: "x"
  });

  setMode("pvp_online");
  setupFirebaseListeners();
}

function joinGame() {
  const code = document.getElementById("gameCodeInput").value.trim();
  if (!code) return;

  gameCode = code;
  isHost = false;
  gameCodeDisplay.textContent = code;
  statusText.textContent = `Joined game: ${code}`;
  bootstrap.Modal.getInstance(document.getElementById("enterModal")).hide();

  setupFirebaseListeners();
  setMode("pvp_online");
}

function setupFirebaseListeners() {
  const gameRef = db.ref("games/" + gameCode);
  gameRef.on("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;

    boardState = data.board;
    currentPlayer = data.currentPlayer;

    updateBoardFromFirebase(boardState);

    if (data.reset) {
      winLine.style.opacity = 0;
      winLine.style.transform = "none";
      winLine.classList.remove("animate-line");
      db.ref("games/" + gameCode + "/reset").remove();
    }
  });
}

function updateBoardFromFirebase(latestBoard) {
  for (let i = 0; i < 9; i++) {
    cells[i].classList.remove("x", "o");
    if (latestBoard[i]) {
      cells[i].classList.add(latestBoard[i]);
    }
  }

  boardState = latestBoard;

  const winCombo = checkWinner();
  if (winCombo) {
    gameActive = false;
    statusText.textContent = `${currentPlayer === "x" ? "O" : "X"} Wins!`;
    drawWinLine(...winCombo);
    return;
  }

  if (!latestBoard.includes("")) {
    gameActive = false;
    statusText.textContent = "It's a Draw!";
    return;
  }

  gameActive = true;
  statusText.textContent = `Your Turn: ${currentPlayer.toUpperCase()}`;
}

function isMyTurn() {
  return (isHost && currentPlayer === "x") || (!isHost && currentPlayer === "o");
}



createBoard();
