const start = document.querySelector(".start");
const reset = document.querySelector(".reset");
const Timer = document.querySelector(".timer");

let timer = false;
let seconds = 0;
let minutes = 0;

const timerStart = () => {
  if (timer) {
    seconds++;
    if (seconds == 60) {
      minutes++;
      seconds = 0;
    }

    let secString = seconds;
    let minString = minutes;

    if (secString < 10) {
      secString = "0" + secString;
    }
    if (minString < 10) {
      minString = "0" + minString;
    }
    console.log(minString + " : " + secString);
    document.querySelector(".minutes").innerHTML = minString;
    document.querySelector(".seconds").innerHTML = secString;
    setTimeout(timerStart, 1000);
  }
};

start.addEventListener("click", () => {
  if (start.classList.contains("start")) {
    console.log("start");
    start.classList.remove("start");
    start.classList.add("stop");
    start.innerHTML = "Stop";
    timer = true;
    timerStart();
  } else {
    timer = false;
    console.log("stop");
    start.classList.add("start");
    start.classList.remove("stop");
    start.innerHTML = "Start";
  }
});
