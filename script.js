const introScreen = document.getElementById('intro-screen');
const gameContainer = document.getElementById('game-container');
const victoryOverlay = document.getElementById('victory-overlay');
const startBtn = document.getElementById('start-btn');
const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');
const restartBtn = document.getElementById('restart-btn');
const timeDisplay = document.getElementById('time');
const movesDisplay = document.getElementById('moves');
const finalTime = document.getElementById('final-time');
const finalMoves = document.getElementById('final-moves');
const leaderboardList = document.getElementById('leaderboard-list');
const gameGrid = document.getElementById('game-grid');

let difficulty = 'easy';
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let time = 0;
let timer;
let totalPairs;

const emojis = ['🚀', '🌟', '🔥', '⚡', '💎', '🌀', '🌈', '🎯', '🛸', '💥', '🌌', '🦄', '🎮', '🔮', '🕹️', '🎲'];

function setDifficulty(diff) {
    difficulty = diff;
    totalPairs = diff === 'easy' ? 6 : diff === 'medium' ? 8 : 10;
    cards = [];
    for (let i = 0; i < totalPairs; i++) {
        cards.push(emojis[i], emojis[i]);
    }
    shuffle(cards);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createGrid() {
    gameGrid.innerHTML = '';
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${emoji}</div>
            </div>
        `;
        card.addEventListener('click', flipCard);
        gameGrid.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
        this.classList.add('flipped');
        flippedCards.push(this);
        playFlipSound();
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = `Moves: ${moves.toString().padStart(2, '0')}`;
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.querySelector('.card-back').textContent === card2.querySelector('.card-back').textContent) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        playMatchSound();
        flippedCards = [];
        if (matchedPairs === totalPairs) {
            endGame(true);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timeDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function endGame(won) {
    clearInterval(timer);
    finalTime.textContent = timeDisplay.textContent.split(': ')[1];
    finalMoves.textContent = moves;
    updateLeaderboard();
    victoryOverlay.classList.remove('hidden');
    playWinSound();
}

function updateLeaderboard() {
    const key = `leaderboard-${difficulty}`;
    let leaderboard = JSON.parse(localStorage.getItem(key)) || [];
    leaderboard.push(time);
    leaderboard.sort((a, b) => a - b);
    leaderboard = leaderboard.slice(0, 3);
    localStorage.setItem(key, JSON.stringify(leaderboard));
    leaderboardList.innerHTML = leaderboard.map((t, i) => {
        const min = Math.floor(t / 60);
        const sec = t % 60;
        return `<li>${i + 1}. ${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}</li>`;
    }).join('');
}

function resetGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    time = 0;
    movesDisplay.textContent = 'Moves: 00';
    timeDisplay.textContent = 'Time: 00:00';
    victoryOverlay.classList.add('hidden');
    introScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    setDifficulty(difficulty);
    createGrid();
    startTimer();
}

startBtn.addEventListener('click', () => {
    resetGame();
});

easyBtn.addEventListener('click', () => setDifficulty('easy'));
mediumBtn.addEventListener('click', () => setDifficulty('medium'));
hardBtn.addEventListener('click', () => setDifficulty('hard'));

restartBtn.addEventListener('click', resetGame);


function playFlipSound() {
   
    console.log('Flip sound');
}

function playMatchSound() {
    
    console.log('Match sound');
}

function playWinSound() {
   
    console.log('Win sound');
}