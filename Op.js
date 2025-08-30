// =====================
// CONFIG
// =====================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let gameSpeed = 5;
let gravity = 0.6;

// =====================
// PLAYER (Sonic Character)
// =====================
const player = {
  x: 100,
  y: 250,
  width: 60,
  height: 60,
  dy: 0,
  jumping: false,
  sprite: new Image()
};

player.sprite.src = "sonic.png"; // replace with Sonic's image

// =====================
// OBSTACLES + COINS
// =====================
class Obstacle {
  constructor(x, y, size, type = "box") {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
  }

  draw() {
    ctx.fillStyle = this.type === "coin" ? "gold" : "red";
    ctx.beginPath();

    if (this.type === "coin") {
      ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    } else {
      ctx.rect(this.x, this.y, this.size, this.size);
    }

    ctx.fill();
  }

  update() {
    this.x -= gameSpeed;
    this.draw();
  }
}

let obstacles = [];
let score = 0;

// =====================
// GAME LOOP
// =====================
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = "#228B22";
  ctx.fillRect(0, 310, canvas.width, 90);

  // Draw player
  ctx.drawImage(player.sprite, player.x, player.y, player.width, player.height);

  // Gravity
  if (player.jumping || player.y < 250) {
    player.dy += gravity;
    player.y += player.dy;
  }
  if (player.y >= 250) {
    player.y = 250;
    player.dy = 0;
    player.jumping = false;
  }

  // Generate obstacles and coins
  if (Math.random() < 0.02) {
    let type = Math.random() > 0.5 ? "coin" : "box";
    obstacles.push(new Obstacle(canvas.width, 270, 40, type));
  }

  // Draw/Update obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.update();

    // Collision check
    if (
      player.x < obs.x + obs.size &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.size &&
      player.y + player.height > obs.y
    ) {
      if (obs.type === "coin") {
        score++;
        obstacles.splice(i, 1); // collect coin
      } else {
        alert("Game Over! Score: " + score);
        document.location.reload();
      }
    }

    // Remove off-screen obstacles
    if (obs.x + obs.size < 0) {
      obstacles.splice(i, 1);
    }
  }

  // Score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  requestAnimationFrame(update);
}

// =====================
// CONTROLS
// =====================
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping) {
    player.dy = -12;
    player.jumping = true;
  }
});

// Start game
update();
