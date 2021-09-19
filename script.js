const gridHTML = document.getElementsByClassName("grid")[0];
const buttons = document.getElementsByClassName("button");
const playButton = buttons[0];
const clearButton = buttons[1];
const icons = document.getElementsByClassName("material-icons");
const playIcon = icons[0];
const clearIcon = icons[1];
const buttonTexts = document.getElementsByClassName("button-text");
const playText = buttonTexts[0];
const clearText = buttonTexts[1];
const size = 36;
const aliveColor = "rgb(240, 240, 60)";
const deadColor = "rgb(30, 30, 90)";

var grid = createGrid();
var playOn = false;
var cleared = false;
var interval = null;

playButton.onclick = function() {playPause()};
clearButton.onclick = function() {clearRandom()};

function playPause() {
  if (playOn) {
    clearInterval(interval);
    playOn = false;
    playIcon.innerHTML = "play_circle_outline";
    playText.innerHTML = "Start";
    playButton.style.backgroundColor = "rgb(30, 120, 30)";
  } else {
    interval = setInterval(nextGeneration, 1000);
    playOn = true;
    playIcon.innerHTML = "pause_circle_outline";
    playText.innerHTML = "Pause";
    playButton.style.backgroundColor = "rgb(120, 30, 30)";
  }
}

function clearRandom() {
  if (cleared) {
    randomizeGrid(grid);
    cleared = false;
    clearIcon.innerHTML = "grid_off";
    clearText.innerHTML = "Clear";
    clearButton.style.backgroundColor = "rgb(120, 30, 120)";
  } else {
    clearGrid(grid);
    cleared = true;
    clearIcon.innerHTML = "grid_on";
    clearText.innerHTML = "Random";
    clearButton.style.backgroundColor = "rgb(30, 30, 120)";
  }
}

function choose(options) {
  var i = Math.floor(Math.random() * options.length);
  return options[i];
}

function isAlive(cell) {
  return cell.style.backgroundColor == aliveColor;
}

function kill(cell) {
  cell.style.backgroundColor = deadColor;
}

function clearRow(row) {
  row.map(kill);
}

function clearGrid(grid) {
  grid.map(clearRow)
}

function revive(cell) {
  cell.style.backgroundColor = aliveColor;
}

function randomize(cell) {
  cell.style.backgroundColor = choose([deadColor, deadColor, aliveColor]);
}

function randomizeRow(row) {
  row.map(randomize);
}

function randomizeGrid(grid) {
  grid.map(randomizeRow)
}

function reverse(cell) {
  if (isAlive(cell)) {
    kill(cell);
  } else {
    revive(cell);
  }
}

// The grid has two extra lines in every direction,
// which are not displayed. This is to avoid the strange behavior of cells on the edge.
function createGrid() {
  var grid = [];
  for (let y = 0; y < size+4; y++) {
    var row = [];
    for (let x = 0; x < size+4; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.onclick = function() {reverse(cell)};
      row.push(cell);
      if (2 <= y && y < size+2 &&
        2 <= x && x < size+2) {
        gridHTML.appendChild(cell);    
      } else {
        cell.style.display = "none"; 
      }
    }
    grid.push(row);
  } 
  randomizeGrid(grid);
  return grid;
}

function aliveNeighbors(grid, x, y) {
  var counter = 0;
  for (let yi = -1; yi < 2; yi++) {
    for (let xi = -1; xi < 2; xi++) {
      var yn = y + yi;
      var xn = x + xi;
      if (0 <= yn && yn < grid.length) {
        if (0 <= xn && xn < grid[0].length) {
          var cell = grid[yn][xn];
          if (isAlive(cell) && !(xi == 0 && yi == 0)) {
            counter += 1;
          }
        }
      }
    }
  }
  return counter;
}

function nextGeneration() {
  var toKill = [];
  var toRevive = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      var aNb = aliveNeighbors(grid, x, y);
      var cell = grid[y][x];
      if (isAlive(cell) && (aNb < 2 || 3 < aNb)) {
        toKill.push(cell);
      } else if (!isAlive(cell) && aNb == 3) {
        toRevive.push(cell);
      }
    }
  }
  toKill.map(kill);
  toRevive.map(revive);
}
