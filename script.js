const board = document.getElementById('chessboard');

// Initialize the chessboard with pieces
const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let boardState = JSON.parse(JSON.stringify(initialBoard));
let selectedSquare = null;
let turn = 'w'; // 'w' for white, 'b' for black

// Function to render the chessboard
function renderBoard() {
  board.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');
      if (boardState[row][col] !== '.') {
        const piece = document.createElement('img');
        const pieceCode = boardState[row][col];

        // Update to use 'pieces/' folder for images
        if (pieceCode === pieceCode.toUpperCase()) {
          piece.src = `./pieces/w${pieceCode.toLowerCase()}.svg`; // White pieces (e.g., pieces/wp.svg)
        } else {
          piece.src = `./pieces/b${pieceCode.toLowerCase()}.svg`; // Black pieces (e.g., pieces/bp.svg)
        }

        piece.classList.add('piece');
        square.appendChild(piece);
      }

      square.addEventListener('click', () => handleSquareClick(row, col));
      board.appendChild(square);
    }
  }
}

// Handle square click
function handleSquareClick(row, col) {
  if (selectedSquare === null) {
    // Select the square if it has a piece of the current player's turn
    if ((turn === 'w' && boardState[row][col].toUpperCase() === boardState[row][col]) ||
        (turn === 'b' && boardState[row][col].toLowerCase() === boardState[row][col])) {
      selectedSquare = { row, col };
      highlightSelectedSquare(row, col);
    }
  } else {
    // Move the selected piece
    if (isValidMove(selectedSquare.row, selectedSquare.col, row, col)) {
      boardState[row][col] = boardState[selectedSquare.row][selectedSquare.col];
      boardState[selectedSquare.row][selectedSquare.col] = '.';
      turn = turn === 'w' ? 'b' : 'w'; // Switch turns
    }
    selectedSquare = null; // Deselect
  }

  renderBoard();
}

// Highlight the selected square
function highlightSelectedSquare(row, col) {
  const squares = document.querySelectorAll('.square');
  squares.forEach(square => square.classList.remove('selected'));
  const selectedDiv = squares[row * 8 + col];
  selectedDiv.classList.add('selected');
}

// Simple validation for moving pieces
function isValidMove(fromRow, fromCol, toRow, toCol) {
  // Here we would add logic for each piece's movement rules
  // For simplicity, this just checks if the destination square is empty or contains an opponent's piece
  const piece = boardState[fromRow][fromCol];
  const targetPiece = boardState[toRow][toCol];
  return targetPiece === '.' || (piece.toUpperCase() !== targetPiece.toUpperCase());
}

// Initial render
renderBoard();
