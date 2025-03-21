const board = document.getElementById('chessboard');
const status = document.getElementById('status');

// Initial chessboard setup
const initialBoard = [
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
];

let boardState = JSON.parse(JSON.stringify(initialBoard));
let selectedSquare = null;
let turn = 'w'; // 'w' for white, 'b' for black

// Piece movement rules
const movePatterns = {
  'p': [[-1, 0]], 'bp': [[1, 0]], // Pawns
  'r': 'line', 'b': 'diagonal', 'q': 'both', 'k': 'king', 'n': 'knight'
};

// Renders the board
function renderBoard() {
  board.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');

      if (boardState[row][col] !== '.') {
        const piece = document.createElement('img');
        piece.src = `./pieces/${boardState[row][col]}.svg`;
        piece.classList.add('piece');
        square.appendChild(piece);
      }

      square.addEventListener('click', () => handleSquareClick(row, col));
      board.appendChild(square);
    }
  }
}

// Handles piece selection and movement
function handleSquareClick(row, col) {
  const piece = boardState[row][col];

  if (selectedSquare === null) {
    // Select piece if it's the current player's turn
    if (piece.startsWith(turn)) {
      selectedSquare = { row, col };
      highlightSelectedSquare(row, col);
      highlightValidMoves(row, col);
    }
  } else {
    // Move the piece
    if (isValidMove(selectedSquare.row, selectedSquare.col, row, col)) {
      boardState[row][col] = boardState[selectedSquare.row][selectedSquare.col];
      boardState[selectedSquare.row][selectedSquare.col] = '.';
      
      // Check if the king was captured
      if (boardState[row][col] === 'bk') {
        alert("White wins!");
        resetGame();
        return;
      }
      if (boardState[row][col] === 'wk') {
        alert("Black wins!");
        resetGame();
        return;
      }

      turn = turn === 'w' ? 'b' : 'w';
      status.innerText = turn === 'w' ? "White's Turn" : "Black's Turn";
    }

    selectedSquare = null;
  }

  renderBoard();
}

// Highlights the selected square
function highlightSelectedSquare(row, col) {
  document.querySelectorAll('.square').forEach(square => square.classList.remove('selected'));
  document.querySelectorAll('.square')[row * 8 + col].classList.add('selected');
}

// Highlights valid moves
function highlightValidMoves(row, col) {
  document.querySelectorAll('.square').forEach(square => square.classList.remove('valid-move'));

  let piece = boardState[row][col].substring(1);
  let directions = movePatterns[piece];

  if (directions) {
    if (Array.isArray(directions)) {
      directions.forEach(([dr, dc]) => {
        let newRow = row + dr;
        let newCol = col + dc;
        if (isValidMove(row, col, newRow, newCol)) {
          document.querySelectorAll('.square')[newRow * 8 + newCol].classList.add('valid-move');
        }
      });
    }
  }
}

// Validates moves
function isValidMove(fromRow, fromCol, toRow, toCol) {
  if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
  
  const piece = boardState[fromRow][fromCol];
  const target = boardState[toRow][toCol];

  if (target.startsWith(turn)) return false;

  return true;
}

// Resets the game
function resetGame() {
  boardState = JSON.parse(JSON.stringify(initialBoard));
  turn = 'w';
  status.innerText = "White's Turn";
  renderBoard();
}

renderBoard();
