window.addEventListener("DOMContentLoaded", () => {
  // === Hacker Font ===
  const letters = "ABCDEFGHIJKLMNOPQRSTUWXYZV";
  const title = document.querySelector(".title");
  window.addEventListener("load", () => {
    let i = 0;
    const interval = setInterval(() => {
      title.innerText = title.innerText
        .split("")
        .map((letter, index) => {
          if (index < i) {
            return title.dataset.value[index];
          }

          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      i += 1 / 3;

      if (i >= title.dataset.value.length + 1) {
        clearInterval(interval);
      }
    }, 50);
  });

  // === Tic Tac Toe ===
  const tiles = document.querySelectorAll("#tile");
  const turn = document.querySelector(".display-turn");
  const resetBtn = document.querySelector("#reset");

  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let isGameActive = true;

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function resultValidation() {
    let roundWon = false;

    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      turn.innerHTML = `Player ${currentPlayer} Won!`;
      isGameActive = false;
      return;
    }

    if (!board.includes("")) {
      turn.innerHTML = `TIE!`;
      isGameActive = false;
    }
  }

  function isValidAction(tile) {
    return !(tile.innerText === "X" || tile.innerText === "O");
  }

  function updateBoard(index) {
    board[index] = currentPlayer;
  }

  function changePlayer() {
    turn.classList.remove(`player${currentPlayer}`);
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    turn.innerHTML = `${currentPlayer}'s turn`;
    turn.classList.add(`player${currentPlayer}`);
  }

  function userAction(tile, index) {
    if (isValidAction(tile) && isGameActive) {
      tile.innerText = currentPlayer;
      tile.classList.add(currentPlayer);

      updateBoard(index);
      resultValidation();
      if (isGameActive) changePlayer();
    }
  }

  function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    turn.innerHTML = `${currentPlayer}'s turn`;

    tiles.forEach((tile) => {
      tile.innerText = "";
      tile.classList.remove("X", "O");
    });
  }

  tiles.forEach((tile, index) => {
    tile.addEventListener("click", () => userAction(tile, index));
  });

  resetBtn.addEventListener("click", resetBoard);

  // === Counter ===
  const counter = document.querySelector(".counter");
  const counterBtn = document.querySelector(".counterBtn");

  function countClick() {
    counter.innerHTML = parseInt(counter.innerHTML) + 1;
  }

  counterBtn.addEventListener("click", countClick);

  // === Screen Resolution ===
  const resX = document.querySelector(".resX");
  const resY = document.querySelector(".resY");

  function updateResolution() {
    resX.innerText = window.screen.width;
    resY.innerText = window.screen.height;
  }

  updateResolution();
  window.addEventListener("resize", updateResolution);

  // === Burger Menu ==
  const burgerIcon = document.querySelector(".icon");
  const slider = document.querySelector(".slider");

  burgerIcon.addEventListener("click", () => {
    if (burgerIcon.classList.contains("fa-bars")) {
      burgerIcon.classList.remove("fa-bars");
      burgerIcon.classList.add("fa-xmark");
      slider.classList.remove("hide");
    } else {
      burgerIcon.classList.remove("fa-xmark");
      burgerIcon.classList.add("fa-bars");
      slider.classList.add("hide");
    }
  });
});

// === Clock
Number.prototype.pad = function (n) {
  return this.toString().padStart(n, "0");
};

function updateClock() {
  const now = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const data = {
    mon: months[now.getMonth()],
    d: now.getDate(),
    y: now.getFullYear(),
    h: now.getHours().pad(2),
    m: now.getMinutes().pad(2),
    s: now.getSeconds().pad(2),
    mi: now.getMilliseconds(),
  };

  for (let key in data) {
    const el = document.getElementById(key);
    if (el && el.firstChild) {
      el.firstChild.nodeValue = data[key];
    }
  }
}

function clock() {
  updateClock();
  setInterval(updateClock, 1);
}
