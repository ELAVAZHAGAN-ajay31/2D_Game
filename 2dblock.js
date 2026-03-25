console.log("JS connected");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COLS = 10;
const ROWS = 20;
const SIZE = 30;

// Create grid
const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// Colors
const colors = [
  null,
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// Shapes
const shapes = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[1,0,0],[1,1,1]], // L
];

// Current piece
let piece = randomPiece();

function randomPiece() {
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  return {
    shape,
    x: Math.floor(COLS / 2) - 1,
    y: 0,
    color: Math.floor(Math.random() * (colors.length - 1)) + 1
  };
}

// Draw grid + piece
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw placed blocks
  grid.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val) {
        ctx.fillStyle = colors[val];
        ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
      }
    });
  });

  // Draw current piece
  piece.shape.forEach((row, dy) => {
    row.forEach((val, dx) => {
      if (val) {
        ctx.fillStyle = colors[piece.color];
        ctx.fillRect((piece.x + dx) * SIZE, (piece.y + dy) * SIZE, SIZE, SIZE);
      }
    });
  });
}

// Collision check
function collide() {
  return piece.shape.some((row, dy) =>
    row.some((val, dx) => {
      if (!val) return false;
      let x = piece.x + dx;
      let y = piece.y + dy;
      return (
        x < 0 || x >= COLS ||
        y >= ROWS ||
        (grid[y] && grid[y][x])
      );
    })
  );
}

// Merge piece into grid
function merge() {
  piece.shape.forEach((row, dy) => {
    row.forEach((val, dx) => {
      if (val) {
        grid[piece.y + dy][piece.x + dx] = piece.color;
      }
    });
  });
}

// Drop logic
function drop() {
  piece.y++;
  if (collide()) {
    piece.y--;
    merge();
    piece = randomPiece();
  }
}

// Controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") piece.x--;
  if (e.key === "ArrowRight") piece.x++;
  if (e.key === "ArrowDown") drop();

  if (collide()) {
    if (e.key === "ArrowLeft") piece.x++;
    if (e.key === "ArrowRight") piece.x--;
  }
});

// Game loop
function update() {
  drop();
  draw();
}

setInterval(update, 500);