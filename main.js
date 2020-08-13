const cvs = document.getElementById("canvas-main");
const ctx = cvs.getContext("2d");

const player = new Image();
const bg = new Image();
const obstacle_top = new Image();
const obstacle_bottom = new Image();

player.src = "art/ball.png";
player.zIndex = "100";

bg.src = "art/bg.png";

obstacle_top.src = "art/obstacle_top.png";
obstacle_bottom.src = "art/obstacle_bottom.png";

let gap;
let player_x = 30;
let player_y = cvs.height / 2 - player.height / 2
let player_velocity = 2;
let game_speed = 0.5;
let obstacles = new Array();
let ticks = 1;
let score = 0;

const jump = () => {
  player_velocity -= 5;
  if (player_velocity < -4) {
    player_velocity = -4;
  }
}

const makeObstacles = () => {
  const y_offset = Math.floor(Math.random() * (obstacle_top.height / 2) * -1);
  
  obstacles.push({
    img: obstacle_top,
    x: cvs.width,
    y: y_offset
  }, {
    img: obstacle_bottom,
    x: cvs.width,
    y: y_offset + gap
  })
}

const checkCollisions = () => {
  // border collision

  if (player_y < 0 || player_y > cvs.height - player.height) {
    restart();
  }

  // obstacle collision

  obstacles.forEach((obs, i) => {
    // it just works trust me

    // minor number adjustments to make detection more forgiving
    if (player_x + player.width - 4 >= obs.x &&
      player_x + 4 <= obs.x + obstacle_top.width &&
      ((player_y + 3 >= obs.y && player_y + 3 <= obs.y + obstacle_top.height) ||
      (player_y + player.height - 3 >= obs.y && player_y + player.height - 3 <= obs.y + obstacle_top.height)) ) {
      restart();
    }
  })
}

const restart = () => {
  obstacles = [];
  player_x = 30;
  player_y = cvs.height / 2 - player.height / 2
  player_velocity = 2;
  score = 0;
  ticks = 0;

  makeObstacles();
}

const tick = () => {
  ctx.drawImage(bg, 0, 0)
  ctx.drawImage(player, player_x, player_y);

  // move obstacles to the left

  let lock_score = false;

  obstacles.forEach((obs, i) => {
    ctx.drawImage(obs.img, obs.x, obs.y);
    obs.x -= game_speed;

    if (!lock_score && obs.x + obstacle_top.width === 30) {
      score++;
      lock_score = true;
    }
  })

  // remove obstacles too far left

  if (ticks % 1000 === 0) {
    obstacles = obstacles.filter(obs => {
      return obs.x > obstacle_top.width * -1;
    })
  }
  
  // apply gravity

  if (player_velocity < 2) {
    player_velocity += 0.1;
  }

  player_y += player_velocity;

  // add new obstacles

  if (ticks % 250 === 0) {
    makeObstacles();
  }

  checkCollisions();

  if (score === 10) {
    player.src = "art/secret/ball-victory.png";
    ctx.fillStyle = "#ffd541";

    const prize = new Image();
    const prize_container = document.getElementById("prize");

    prize.src = "art/secret/prize.jpg";
    prize.width = 400;
    prize.height = 400;

    if (!prize_container.hasChildNodes()) {
      prize_container.appendChild(prize);
    }
  }

  ctx.fillText(score, cvs.width - 40, cvs.height - 20);

  ticks++;
  requestAnimationFrame(tick);
}

obstacle_top.onload = () => {
  gap = obstacle_top.height + 100
  makeObstacles();
}

document.addEventListener("click", jump);

ctx.font = "30px Verdana";
ctx.fillStyle = "#b4202a";

tick();