const multiply = (a = 2, b = 2) => {
  return a * b;
};

console.log(multiply(6, 7));

function greeting(userName = "Guest") {
  return `Hello ${userName}!`;
}

let muuttuja = ``;

console.log(greeting());

// (" Javascript    ").trim() --> "Javascript"
const trimText = (str) => str.trim();
const makeItSmaller = (str) => str.toUpperCase();

const cleanText = (text) => {
  // Yhdistä funktiot
  return makeItSmaller(trimText(text));
};

const input = "    turHan Iso texti       ";
console.log(input);
console.log(cleanText(input));
