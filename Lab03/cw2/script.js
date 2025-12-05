const btn = document.querySelector(".generate");

const capitalArr = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const specialArr = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "+",
  "-",
  "=",
  "{",
  "}",
  "[",
  "]",
  ":",
  '"',
  ";",
  "'",
  "<",
  ">",
  "?",
  ",",
  ".",
  "/",
  "\\",
  "|",
  "~",
  "`",
];

btn.addEventListener("click", () => {
  const max = document.querySelector("#max").value;
  const min = document.querySelector("#min").value;
  const capital = document.querySelector("#captial").checked;
  const special = document.querySelector("#special").checked;

  var results = "";

  var resultArr = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  console.log(capital);
  console.log(special);
  if (capital) {
    resultArr = resultArr.concat(capitalArr);
  }
  if (special) {
    resultArr = resultArr.concat(specialArr);
  }
  console.log(resultArr);
  for (let i = 0; i < max; i++) {
    results += resultArr[Math.floor(Math.random() * resultArr.length)];
  }
  alert("Twoje haslo to: " + results);
});
