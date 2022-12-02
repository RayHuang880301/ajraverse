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

// function drawImg() {
//   let img = new Image();
//   img.src = './assets/coinbase.png';
//   ctx.drawImage(img);
// }

function drawBall() {
  ctx.beginPath();
  let img = new Image();
  img.src = "http://139.162.88.46/assets/Ball/Penguin.png";
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

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 8, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  // drawImg();
  drawPaddle();
  drawScore();
  const nextBallY = y + dy;
  const paddleHead = canvas.height - ballRadius - sealHeight;
  const paddleFoot = canvas.height - ballRadius;
  const ispaddleCollision =
    nextBallY >= paddleHead &&
    nextBallY <= paddleFoot && // y 軸碰海豹
    x > paddleX &&
    x < paddleX + paddleWidth; // x 軸碰海豹

  const isBottomCollision = nextBallY >= frameBottomY;

  if (y + dy < 0) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - sealHeight) {
    if (isBottomCollision && ballRadius > 10) {
      ballRadius = ballRadius * 0.8;
    }
    // TODO: detect x, y and paddleX, paddleY, paddleWidth, paddleHeight
    if (ispaddleCollision) {
      // highest speed
      if (dy > 8) {
        dy = -dy;
      } else {
        dy = -dy * 1.1;
      }
      score++;
      document.getElementById('win').textContent = score;
    }

    //over
    if (isBottomCollision) {
      lives--;
      if (!lives) {
        if(score==0){
          resetValues(failure);
        }
        else resetValues(success);
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
  if (x + dx > canvas.width - ballRadius || x + dx < 0) {
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
