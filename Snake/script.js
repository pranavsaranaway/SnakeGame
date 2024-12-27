// script.js
const CANVAS_BORDER_COLOUR = "black";
const CANVAS_BACKGROUND_COLOUR = "white";
const SNAKE_COLOUR = "lightgreen";
const SNAKE_BORDER_COLOUR = "darkgreen";
const FOOD_COLOUR = "red";
const FOOD_BORDER_COLOUR = "darkred";

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
];

// The user's score
let score = 0;

// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

// Get the canvas element
var gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
var ctx = gameCanvas.getContext("2d");
//  Select the colour to fill the canvas
ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
//  Select the colour for the border of the canvas
ctx.strokestyle = CANVAS_BORDER_COLOUR;
// Draw a "filled" rectangle to cover the entire canvas
ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
// Draw a "border" around the entire canvas
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);

// Load high scores on pageload
window.onload = function () {
  loadHighScores();
};
// Start game
main();
// Create the first food location
createFood();
// Call changeDirection whenever a key is pressed
document.addEventListener("keydown", changeDirection);

// Main function to start the game
function main() {
  if (didGameEnd()) {
    updateHighScore();
    if (
      confirm(
        "Game Over! Your score is " + score + ". Do you want to play again?"
      )
    ) {
      playAgain();
    } else {
      return;
    }
  }

  setTimeout(function onTick() {
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();

    // Call main again
    main();
  }, 100);
}

// Function to clear the canvas
function clearCanvas() {
  ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
  ctx.strokestyle = CANVAS_BORDER_COLOUR;

  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// Function to draw the snake
function drawSnake() {
  snake.forEach(drawSnakePart);
}

// Function to draw a part of the snake
function drawSnakePart(snakePart) {
  ctx.fillStyle = SNAKE_COLOUR;
  ctx.strokestyle = SNAKE_BORDER_COLOUR;

  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// Function to advance the snake
function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    score += 10;
    document.getElementById("score").innerHTML = score;
    createFood();
  } else {
    snake.pop();
  }
}

// Function to change the direction of the snake
function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

// Function to check if the game ended
function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (didCollide) return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > gameCanvas.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > gameCanvas.height - 10;

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

// Function to create food
function createFood() {
  foodX = randomTen(0, gameCanvas.width - 10);
  foodY = randomTen(0, gameCanvas.height - 10);

  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x === foodX && part.y === foodY;
    if (foodIsOnSnake) createFood();
  });
}

// Function to generate a random number
function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

// Function to draw food
function drawFood() {
  ctx.fillStyle = FOOD_COLOUR;
  ctx.strokestyle = FOOD_BORDER_COLOUR;
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

// Function for replayability
function playAgain() {
  window.location.reload();
}

// Function to update session high score
window.onload = function () {
  // Load the high score from localStorage
  const highScore = localStorage.getItem("highScore") || 0;
  document.getElementById("highScore").innerHTML = `High Score: ${highScore}`;
};

function updateHighScore() {
  // Get the current high score from localStorage
  const highScore = localStorage.getItem("highScore") || 0;

  // Compare with the current score
  if (score > highScore) {
    // Save the new high score
    localStorage.setItem("highScore", score);
    document.getElementById("highScore").innerHTML = `High Score: ${score}`;
  }
}
