// Aquí jugamos con lógica.
// - Duality ROSE
let speed = 7;
let frameCount = 0;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.game-container');
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;
const cellSize = 2;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);
let grid = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
}

function createGrid() {
  const cellWidth = canvas.width / cols;
  const cellHeight = canvas.height / rows;
  grid = Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => Math.random() < 0.25 ? 1 : 0)
  );
}

function drawGrid() {
  const cellWidth = canvas.width / cols;
  const cellHeight = canvas.height / rows;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x]) {
        const neighbors = countNeighbors(x, y);
        const alpha = neighbors <= 1 || neighbors >= 4 ? 0.75 : 1.0;
        ctx.fillStyle = `rgba(79, 79, 79, ${alpha})`;
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
}

function countNeighbors(x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const nx = x + j;
      const ny = y + i;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        count += grid[ny][nx];
      }
    }
  }
  return count;
}

function updateGrid() {
  const newGrid = grid.map(arr => [...arr]);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(x, y);
      if (grid[y][x]) {
        newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        newGrid[y][x] = neighbors === 3 ? 1 : 0;
      }
    }
  }
  grid = newGrid;
}

canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (canvas.width / cols));
    const y = Math.floor((e.clientY - rect.top) / (canvas.height / rows));
    const radius = 10;
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && Math.random() < 0.5) {
                grid[ny][nx] = 1;
            }
        }
    }
    drawGrid();
});

function loop() {
    requestAnimationFrame(loop);
    if (frameCount % speed === 0) {
        updateGrid();
        drawGrid();
    }
    frameCount++;
}

function reloadSimulation() {
    createGrid(); 
    drawGrid();
}

window.addEventListener('resize', () => {
  resizeCanvas();
  drawGrid();
});

resizeCanvas();
createGrid();
loop();