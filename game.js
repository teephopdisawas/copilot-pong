const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 18;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 20;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 8;
const BALL_SPEED = 6;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);

// Mouse control
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  if (playerY < 0) playerY = 0;
  if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw paddles, ball, and center line
function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Center line
  ctx.strokeStyle = '#fff8';
  ctx.setLineDash([8, 12]);
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Player paddle
  ctx.fillStyle = '#fff';
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // AI paddle
  ctx.fillStyle = '#fd6e6a';
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Ball
  ctx.fillStyle = '#f6d365';
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Ball movement & collision
function update() {
  // Ball movement
  ballX += ballVelX;
  ballY += ballVelY;

  // Top/bottom wall collision
  if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
    ballVelY *= -1;
  }

  // Left paddle collision
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballVelX = Math.abs(ballVelX); // Bounce right
    // Add spin based on where ball hits the paddle
    let hitPos = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
    ballVelY += hitPos * 0.12;
  }

  // Right paddle collision (AI)
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballY + BALL_SIZE > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballVelX = -Math.abs(ballVelX); // Bounce left
    let hitPos = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
    ballVelY += hitPos * 0.12;
  }

  // Reset if ball goes off screen
  if (ballX + BALL_SIZE < 0 || ballX > canvas.width) {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVelY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  }

  // AI paddle movement — simple tracking
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 18) {
    aiY += PADDLE_SPEED;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 18) {
    aiY -= PADDLE_SPEED;
  }
  // Clamp AI paddle
  if (aiY < 0) aiY = 0;
  if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Start game
loop();