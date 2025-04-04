// Step 1:
const summa = (x, y) => x + y;

let arvo = summa(5, 6);

console.log(arvo);

// Step 2:
let num1 = 5;
let num2 = 6;

// Tapa 1
console.log("Arvojen", num1, " + ", num2, " summa on ", arvo);
// Tapa 2
console.log(`Arvojen ${num1} + ${num2} = ${num1 + num2}`);

function greeting(name = "Guest", name2) {
  return `Hello ${name} and ${name2}`;
}

const greeting2 = (name) => {
  if (name) {
    return `Hello ${name}!`;
  } else {
    return "Something went wrong";
  }
};

console.log(greeting2());
