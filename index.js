var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var ROWS = 20;
var COLS = 10;
var BLOCK_SIZE = 30;

var board = [];
for (var r = 0; r < ROWS; r++) {
  board[r] = [];
  for (var c = 0; c < COLS; c++) {
    board[r][c] = 0;
  }
}

var currentBlock = getRandomBlock();
var currentRow = 0;
var currentCol = Math.floor(COLS / 2);

setInterval(function () {
  if (canMoveDown()) {
    currentRow++;
  } else {
    placeBlock();
    currentBlock = getRandomBlock();
    currentRow = 0;
    currentCol = Math.floor(COLS / 2);
  }

  draw();
}, 500);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      if (board[r][c]) {
        drawBlock(c, r);
      }
    }
  }

  drawBlock(currentCol, currentRow, currentBlock);
}

function drawBlock(x, y, type) {
  var colors = [
    "#00ffff",
    "#ff00ff",
    "#ffff00",
    "#00ff00",
    "#0000ff",
    "#ff0000",
    "#000000",
  ];
  var color = colors[type - 1];

  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

  ctx.strokeStyle = "black";
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function canMoveDown() {
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 4; c++) {
      if (!currentBlock[r][c]) {
        continue;
      }

      var newRow = currentRow + r + 1;
      if (newRow >= ROWS || board[newRow][currentCol + c]) {
        return false;
      }
    }
  }

  return true;
}

function placeBlock() {
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 4; c++) {
      if (!currentBlock[r][c]) {
        continue;
      }

      var newRow = currentRow + r;
      var newCol = currentCol + c;
      board[newRow][newCol] = currentBlock[r][c];
    }
  }

  checkRows();
}

function checkRows() {
  var fullRows = [];

  for (var r = 0; r < ROWS; r++) {
    if (
      board[r].every(function (cell) {
        return cell !== 0;
      })
    ) {
      fullRows.push(r);
    }
  }
  fullRows.forEach(function (row) {
    board.splice(row, 1);
    board.unshift(new Array(COLS).fill(0));
  });
}

function getRandomBlock() {
  var blocks = [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
    [[1, 1, 1, 1]],
  ];

  var index = Math.floor(Math.random() * blocks.length);
  return blocks[index];
}

document.addEventListener("keydown", function (event) {
  if (event.keyCode === 37 && canMoveLeft()) {
    // left
    currentCol--;
  } else if (event.keyCode === 39 && canMoveRight()) {
    // right
    currentCol++;
  } else if (event.keyCode === 40 && canMoveDown()) {
    // down
    currentRow++;
  } else if (event.keyCode === 38) {
    // up (rotate)
    currentBlock = rotateBlock(currentBlock);
  }
  draw();
});

function canMoveLeft() {
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 4; c++) {
      if (!currentBlock[r][c]) {
        continue;
      }
      var newCol = currentCol + c - 1;
      if (newCol < 0 || board[currentRow + r][newCol]) {
        return false;
      }
    }
  }

  return true;
}

function canMoveRight() {
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 4; c++) {
      if (!currentBlock[r][c]) {
        continue;
      }
      var newCol = currentCol + c + 1;
      if (newCol >= COLS || board[currentRow + r][newCol]) {
        return false;
      }
    }
  }

  return true;
}

function rotateBlock(block) {
  var rotated = [];
  for (var c = 0; c < block[0].length; c++) {
    var newRow = [];
    for (var r = block.length - 1; r >= 0; r--) {
      newRow.push(block[r][c]);
    }
    rotated.push(newRow);
  }

  return rotated;
}
