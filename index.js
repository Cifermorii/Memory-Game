const board = document.getElementById("game-board");
const difficultySelect = document.getElementById("difficulty");
const restartBtn = document.getElementById("restart");
const movesSpan = document.getElementById("moves");
const timeSpan = document.getElementById("time");
const winModal = document.getElementById("win-modal");
const playAgainBtn = document.getElementById("play-again");
const closeModalBtn = document.getElementById("close-modal");

let gridSize, totalPairs;
let cards = [];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let time = 0;
let timer;

function startGame() {
  resetGame();

  let difficulty = difficultySelect.value;
  if (difficulty === "easy") gridSize = 4;
  else if (difficulty === "medium") gridSize = 6;
  else gridSize = 8;

  totalPairs = (gridSize * gridSize) / 2;

  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  // Pick images
  let images = [];
  for (let i = 1; i <= totalPairs; i++) {
    images.push(`assets/${difficulty}/${i}.png`);
  }
  let cardImages = [...images, ...images]; // duplicate for pairs
  cardImages.sort(() => Math.random() - 0.5);

  // Generate cards
  cardImages.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = src;

    card.appendChild(img);
    board.appendChild(card);

    card.addEventListener("click", () => flipCard(card, img.src));
  });

  startTimer();
}

function flipCard(card, src) {
  if (flippedCards.length === 2 || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  card.querySelector("img").style.display = "block";
  flippedCards.push({ card, src });

  if (flippedCards.length === 2) {
    moves++;
    movesSpan.textContent = `Moves: ${moves}`;
    checkMatch();
  }
}

function checkMatch() {
  let [first, second] = flippedCards;
  if (first.src === second.src) {
    matchedCards.push(first, second);
    flippedCards = [];

    if (matchedCards.length === totalPairs * 2) {
      endGame();
    }
  } else {
    setTimeout(() => {
      first.card.classList.remove("flipped");
      second.card.classList.remove("flipped");
      first.card.querySelector("img").style.display = "none";
      second.card.querySelector("img").style.display = "none";
      flippedCards = [];
    }, 1000);
  }
}

function resetGame() {
  clearInterval(timer);
  moves = 0;
  time = 0;
  movesSpan.textContent = "Moves: 0";
  timeSpan.textContent = "Time: 0s";
  flippedCards = [];
  matchedCards = [];
  board.innerHTML = "";
  winModal.classList.add("hidden");
}

function startTimer() {
  timer = setInterval(() => {
    time++;
    timeSpan.textContent = `Time: ${time}s`;
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  winModal.classList.remove("hidden");
}

restartBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);
closeModalBtn.addEventListener("click", () => winModal.classList.add("hidden"));
difficultySelect.addEventListener("change", startGame);

// Start first game
startGame();
