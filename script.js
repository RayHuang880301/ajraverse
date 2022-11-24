var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var sealHeight = 75;
const frameBottomY = canvas.height - 30;
var x = canvas.width / 2;
var y = frameBottomY - sealHeight - 50;

let speed = 2;

var dx = speed;
var dy = -speed;

var ballRadius = 50;
var paddleHeight = 100;
var paddleWidth = 100;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 8;
var brickWidth = 100;
var brickHeight = 15;
var brickPadding = 7;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 1;
var modeColor = "row";

let failure = document.querySelector(".failure");
let failureBtn = document.querySelector("#failureBtn");
let success = document.querySelector(".success");
let successBtn = document.querySelector("#successBtn");

function reloadPage() {
  document.location.reload();
}
function resetValues(element) {
  ballRadius = 0;
  lives = 0;
  score = 0;
  paddleWidth = 0;
  element.style.top = "40%";
}

//reloads page OnClick
failureBtn.addEventListener("click", () => {
  reloadPage();
});

successBtn.addEventListener("click", () => {
  reloadPage();
});

// const speedSlider = document.querySelector("#speed-slider");

// speedSlider.addEventListener("input", () => {
//     speed = speedSlider.value;

// 	dx = speed;
// 	dy = -speed;
// })

// const sizeSlider = document.querySelector("#size-slider");

// sizeSlider.addEventListener("input", () => {
// 	ballRadius = sizeSlider.value;
// })

changeBrickColumnCountAndOffsetLeft();
let bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1,
      lives: getRandomArbitrary(1, 5, true),
    };
  }
}

/*
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
*/

function changeBrickColumnCountAndOffsetLeft() {
  let lengthBriks =
    brickColumnCount * (brickWidth + brickPadding) + brickOffsetLeft;
  while (lengthBriks >= canvas.width) {
    brickColumnCount = brickColumnCount - 1;
    lengthBriks =
      brickColumnCount * (brickWidth + brickPadding) + brickOffsetLeft;
  }
  brickOffsetLeft = (canvas.width - lengthBriks + brickOffsetLeft) / 2;
}

function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = utilsColor(c, r, modeColor);
        ctx.fill();

        // ddraw block lives
        ctx.font = `${brickHeight - 2}px Arial`;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(
          bricks[c][r].lives,
          brickX + brickWidth / 2,
          brickY + brickHeight - 2
        );

        ctx.closePath();
      }
    }
  }
}

// function drawImg() {
//   let img = new Image();
//   img.src = './assets/coinbase.png';
//   ctx.drawImage(img);
// }

function drawBall() {
  ctx.beginPath();
  let img = new Image();
  img.src = "./assets/coinbase.png";
  ctx.drawImage(img, x, y, ballRadius, ballRadius);
  // ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  // ctx.fillStyle = "#FFFF00";
  // ctx.fillStyle = utilsColor(c,r, "random"); // To make the ball random colours.
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  let img = new Image();
  img.src = "./assets/arjaverse.png";
  ctx.drawImage(
    img,
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
  );
  // ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  // ctx.fillStyle = "pink";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      console.log(b);
      if (b.status == 1) {
        sideCollision = false;
        if (
          x + ballRadius > b.x &&
          x - ballRadius < b.x + brickWidth &&
          y + ballRadius > b.y &&
          y - ballRadius < b.y + brickHeight
        ) {
          if (y > b.y && y < b.y + brickHeight) {
            if (x < b.x || x > b.x + brickWidth) {
              dx = -dx;
              sideCollision = true;
            }
          }

          if (!sideCollision) {
            dy = -dy;
          }

          b.lives -= 1;
          if (b.lives == 0) {
            b.status = 0;
            score++;
          }
          if (score == brickRowCount * brickColumnCount) {
            resetValues(success);
          }
          return;
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // drawBricks();
  drawBall();
  // drawImg();
  drawPaddle();
  drawScore();
  collisionDetection();
  const nextBallY = y + dy;
  const paddleHead = canvas.height - ballRadius - sealHeight;
  const paddleFoot = canvas.height - ballRadius - sealHeight + 10;
  const ispaddleCollision =
    nextBallY >= paddleHead &&
    nextBallY <= paddleFoot && // y 軸碰海豹
    x > paddleX &&
    x < paddleX + paddleWidth; // x 軸碰海豹

  const isBottomCollision = nextBallY >= frameBottomY;

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - sealHeight) {
    if (isBottomCollision && ballRadius > 10) {
      ballRadius = ballRadius * 0.8;
    }
    // TODO: detect x, y and paddleX, paddleY, paddleWidth, paddleHeight
    if (ispaddleCollision) {
      // new add
      if (dy > 10) {
        dy = -dy;
      } else {
        dy = -dy * 1.2;
      }
      score++;
    }

    if (isBottomCollision) {
      lives--;
      if (!lives) {
        resetValues(failure);
        drawLives();
        return;
      } else {
        // reset
        x = canvas.width / 2;
        y = frameBottomY;
        dx = speed;
        dy = -speed;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    dy += getRandomArbitrary(-0.4, 0.4);
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  // drawLives();
  requestAnimationFrame(draw);
}

document.addEventListener("mousemove", mouseMoveHandler);

// get a random value between two values
function getRandomArbitrary(min, max, toInt = false) {
  let value = Math.random() * (max - min) + min;
  if (toInt) {
    return Math.round(value);
  }
  return value;
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (
    relativeX > 0 + paddleWidth / 2 &&
    relativeX < canvas.width - paddleWidth / 2
  ) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

document.addEventListener("keypress", keyDownHandler);

function keyDownHandler(e) {
  // "D" for right and "A" for left movement
  if (e.code == "KeyD") {
    let relativeX = paddleX + 10;
    if (relativeX < canvas.width - 100) {
      paddleX = relativeX + 10;
    }
  }

  if (e.code == "KeyA") {
    let relativeX = paddleX - 10;
    if (relativeX > 0) {
      paddleX = relativeX - 10;
    }
  }
}

draw();
