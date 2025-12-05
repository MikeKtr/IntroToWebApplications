const MAX_PIPE_HEIGHT = 500;
const MIN_PIPE_HEIGHT = 200;

const bird = document.querySelector(".bird");
const game = document.querySelector(".game");
const gameRect = game.getBoundingClientRect();
const startPopup = document.querySelector(".start_popup");
const endPopup = document.querySelector(".end_popup");
let score = 0;
let scoredPipes = new Set();
let gameStarted = false;

function fly_down() {
  let topVal = parseInt(bird.style.top, 10);
  bird.style.top = (isNaN(topVal) ? 300 : topVal) + 4 + "px";
  tiltBirdDown();
}

function fly_up() {
  let topVal = parseInt(bird.style.top, 10);
  bird.style.top = (isNaN(topVal) ? 0 : topVal) - 4 + "px";
  tiltBirdUp();
}

function spinBird() {
  bird.style.transition = "transform 0.6s ease";
  bird.style.transform = "rotate(360deg)";

  setTimeout(() => {
    bird.style.transform = "rotate(0deg)";
  }, 600);
}

function addScore(pipe) {
  if (scoredPipes.has(pipe)) return;

  score++;
  scoredPipes.add(pipe);
  document.querySelector(".score").textContent = score;

  var pintAudio = new Audio("./assets/Sound Efects/point.ogg");
  pintAudio.play();

  const best = getBestScore();
  if (score > best) {
    spinBird();
  }
}

function jump() {
  clearInterval(flyDownInterval);
  flyDownInterval = null;

  flyUpInterval = setInterval(fly_up, 16);

  flyUpTimeout = setTimeout(() => {
    clearInterval(flyUpInterval);
    flyUpInterval = null;

    tiltBirdNeutral();

    flyDownInterval = setInterval(fly_down, 16);
  }, 350);

  var dieAudio = new Audio("./assets/Sound Efects/wing.ogg");
  dieAudio.play();
}

function movePipes() {
  document.querySelectorAll(".pipe").forEach((pipe) => {
    let right = parseInt(pipe.style.right, 10);
    pipe.style.right = (isNaN(right) ? 0 : right) + 2 + "px";

    let birdRect = bird.getBoundingClientRect();
    let pipeRect = pipe.getBoundingClientRect();

    if (pipeRect.right < birdRect.left && pipe.classList.contains("pipe_up")) {
      addScore(pipe);
    }
  });
}

function endScreen() {
  document.querySelectorAll(".pipe").forEach((pipe) => pipe.remove());

  var dieAudio = new Audio("./assets/Sound Efects/die.ogg");
  dieAudio.play();

  endPopup.classList.add("endPopupSlide");
  const top5 = saveHighScores(score);

  const best = getBestScore();

  document.querySelector(".best_score").innerHTML = "Best Score: " + best;
  document.querySelector(".your_score").innerHTML = "Your Score " + score;
  score = 0;
  document.querySelector(".score").textContent = "0";
  scoredPipes.clear();

  gameStarted = false;
}

function createPipes() {
  let gap = Math.random() * (300 - 100) + 100;
  let topHeight =
    Math.random() * (MAX_PIPE_HEIGHT - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;
  let bottomHeight = 700 - topHeight - gap;

  let baseRight = -80;

  const pipeUp = document.createElement("div");
  pipeUp.classList.add("pipe", "pipe_up");
  pipeUp.style.height = `${topHeight}px`;
  pipeUp.style.position = "absolute";
  pipeUp.style.right = `${baseRight}px`;
  pipeUp.style.top = "0px";

  const pipeDown = document.createElement("div");
  pipeDown.classList.add("pipe", "pipe_down");
  pipeDown.style.height = `${bottomHeight}px`;
  pipeDown.style.position = "absolute";
  pipeDown.style.right = `${baseRight}px`;
  pipeDown.style.bottom = "0px";

  game.appendChild(pipeUp);
  game.appendChild(pipeDown);
}

function gameOver() {
  console.log("GAME OVER");

  clearInterval(movePipesInterval);
  clearInterval(flyDownInterval);
  clearInterval(createPipeInterval);
  clearInterval(flyUpInterval);
  clearTimeout(flyUpTimeout);

  movePipesInterval = null;
  flyDownInterval = null;
  createPipeInterval = null;
  flyUpInterval = null;
  flyUpTimeout = null;

  var dieAudio = new Audio("./assets/Sound Efects/hit.ogg");
  dieAudio.play();

  flyDownInterval = setInterval(() => {
    let topVal = parseInt(bird.style.top, 10);
    bird.style.top = topVal + 6 + "px";
    bird.style.transform = "rotate(70deg)";

    if (topVal >= gameRect.bottom) {
      clearInterval(flyDownInterval);
      flyDownInterval = null;
      console.log(bird.style.top, gameRect.bottom);
      endScreen();
    }
  }, 16);
}

function tiltBirdDown() {
  bird.style.transition = "transform 0.3s ease-out";
  bird.style.transform = "rotate(45deg)";
}

function tiltBirdUp() {
  bird.style.transition = "transform 0.3s ease-out";
  bird.style.transform = "rotate(-30deg)";
}

function tiltBirdNeutral() {
  bird.style.transition = "transform 0.3s ease-out";
  bird.style.transform = "rotate(0deg)";
}

function checkCollision() {
  let birdRect = bird.getBoundingClientRect();

  let collision = false;
  document.querySelectorAll(".pipe").forEach((pipe) => {
    let rect = pipe.getBoundingClientRect();

    if (
      birdRect.right - 5 > rect.left &&
      birdRect.left + 5 < rect.right &&
      birdRect.bottom - 5 > rect.top &&
      birdRect.top + 5 < rect.bottom
    ) {
      collision = true;
    }

    if (birdRect.top > gameRect.bottom || birdRect.bottom < gameRect.top) {
      collision = true;
    }
  });

  if (collision) {
    gameOver();
  }
  return collision;
}

function loadHighScores() {
  const saved = localStorage.getItem("highscores");
  return saved ? JSON.parse(saved) : [];
}

function saveHighScores(best) {
  const scores = loadHighScores();
  scores.push(best);

  scores.sort((a, b) => b - a);

  const top5 = scores.slice(0, 5);

  localStorage.setItem("highscores", JSON.stringify(top5));

  return top5;
}

function getBestScore() {
  const scores = loadHighScores();
  return scores.length ? scores[0] : 0;
}

function startGame() {
  bird.classList.remove("birdDead");
  bird.style.top = "250px";
  bird.style.transform = "rotate(0deg)";

  gameStarted = true;
  movePipesInterval = setInterval(() => {
    movePipes();
    checkCollision();
  }, 16);

  flyDownInterval = setInterval(() => {
    fly_down();
    checkCollision();
  }, 16);

  createPipeInterval = setInterval(createPipes, 1500);

  for (let i = 0; i < 1; i++) createPipes();
  startPopup.classList.add("inv");
  endPopup.classList.remove("endPopupSlide");
}

document.addEventListener("keydown", (e) => {
  if (e.key == " " || e.code == "Space") {
    if (!gameStarted) {
      startGame();
    } else {
      if (flyDownInterval != null) {
        jump();
      } else {
        clearInterval(flyUpInterval);
        clearTimeout(flyUpTimeout);
        flyUpTimeout = null;
        jump();
      }
    }
  }
});

let flyUpInterval = null;
let flyUpTimeout = null;

let movePipesInterval = null;
let flyDownInterval = null;
let createPipeInterval = null;
