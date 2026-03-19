//for going to start playing
function GoingBackToPlay(){
    return location.href = "../HTML-FILE/start.html"
}

// game var and state
let playerScore = 0;
let computerScore = 0;
let isAnimating = false;
let battleHistory = [];
let roundNumber = 0;

//game choice
const choices = ['rock', 'paper', 'scissors'];

//path ng img
const playerImages = {
    rock: '../IMG/rock-hand.png',
    paper: '../IMG/paper-hand.png',
    scissors: '../IMG/scissors-hand.png',
    default: '../IMG/default-hand.png'
};

const computerImages = {
    rock: '../IMG/rock-hand-computer.png',
    paper: '../IMG/paper-hand-computer.png',
    scissors: '../IMG/scissors-hand-computer.png',
    default: '../IMG/default-hand.png'
};

// dom element
const playerHandElement = document.getElementById('player-hand');
const computerHandElement = document.getElementById('computer-hand');
const resultMessageElement = document.getElementById('result-message');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const gameButtons = document.querySelectorAll('.game-btn');
const historyListElement = document.getElementById('history-list');

// get random computer choice
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// determine the winner of the game
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    }
    
    return 'lose';
}

// get result message based on outcome
function getResultMessage(result, playerChoice, computerChoice) {
    const choiceEmojis = {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    };
    
    const playerEmoji = choiceEmojis[playerChoice];
    const computerEmoji = choiceEmojis[computerChoice];
    
    switch (result) {
        case 'win':
            return `You Win! ${playerEmoji} beats ${computerEmoji}`;
        case 'lose':
            return `You Lose! ${computerEmoji} beats ${playerEmoji}`;
        case 'draw':
            return `It's a Draw! ${playerEmoji} = ${computerEmoji}`;
        default:
            return 'Make your move!';
    }
}

//update score na nadisplay
function updateScore() {
    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
    
    // add animation to score
    playerScoreElement.style.animation = 'none';
    computerScoreElement.style.animation = 'none';
    
    setTimeout(() => {
        playerScoreElement.style.animation = '';
        computerScoreElement.style.animation = '';
    }, 10);
}

//add a battle to the history
function addToHistory(playerChoice, computerChoice, result) {
    roundNumber++;
    const battle = {
        round: roundNumber,
        playerChoice: playerChoice,
        computerChoice: computerChoice,
        result: result
    };
    
    battleHistory.unshift(battle); // add to beginning of array
    displayHistory();
}

// display the battle history
function displayHistory() {
    if (battleHistory.length === 0) {
        historyListElement.innerHTML = '<p class="history-empty">No battles yet. Start playing!</p>';
        return;
    }
    
    const choiceEmojis = {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    };
    
    const resultLabels = {
        win: 'WIN',
        lose: 'LOSE',
        draw: 'DRAW'
    };
    
    let historyHTML = '';
    battleHistory.forEach(battle => {
        historyHTML += `
            <div class="history-item">
                <span class="history-round">Round ${battle.round}</span>
                <div class="history-choices">
                    <span class="history-player">
                        <span class="history-emoji">${choiceEmojis[battle.playerChoice]}</span>
                        <span>Player</span>
                    </span>
                    <span class="history-vs">VS</span>
                    <span class="history-computer">
                        <span>Computer</span>
                        <span class="history-emoji">${choiceEmojis[battle.computerChoice]}</span>
                    </span>
                </div>
                <span class="history-result ${battle.result}">${resultLabels[battle.result]}</span>
            </div>
        `;
    });
    
    historyListElement.innerHTML = historyHTML;
}

//for clear battle history
function clearHistory() {
    battleHistory = [];
    roundNumber = 0;
    displayHistory();
}

// disable/Enable game buttons
function setButtonsDisabled(disabled) {
    gameButtons.forEach(button => {
        button.disabled = disabled;
    });
}

// play the shake animation before revealing result
function playShakeAnimation() {
    return new Promise(resolve => {
        // add shake animation class
        playerHandElement.classList.add('hand-shake');
        computerHandElement.classList.add('hand-shake');
        
        // show default hands during shake
        playerHandElement.src = playerImages.rock;
        computerHandElement.src = computerImages.rock;
        
        // remove animation class after completion
        setTimeout(() => {
            playerHandElement.classList.remove('hand-shake');
            computerHandElement.classList.remove('hand-shake');
            resolve();
        }, 1000);
    });
}

// show result animation
function showResultAnimation(result) {
    // remove previous result classes
    resultMessageElement.classList.remove('win', 'lose', 'draw');
    playerHandElement.classList.remove('hand-win', 'hand-lose');
    computerHandElement.classList.remove('hand-win', 'hand-lose');
    
    // add appropriate animation classes
    setTimeout(() => {
        resultMessageElement.classList.add(result);
        
        if (result === 'win') {
            playerHandElement.classList.add('hand-win');
            computerHandElement.classList.add('hand-lose');
        } else if (result === 'lose') {
            playerHandElement.classList.add('hand-lose');
            computerHandElement.classList.add('hand-win');
        }
    }, 50);
}

//  main game function - called when player clicks a button
async function playGame(playerChoice) {
    // prevent clicking during animation
    if (isAnimating) return;
    isAnimating = true;
    
    // disable buttons during animation
    setButtonsDisabled(true);
    
    // reset result message
    resultMessageElement.classList.remove('win', 'lose', 'draw');
    resultMessageElement.textContent = 'Rock... Paper... Scissors...';
    
    // play shake animation
    await playShakeAnimation();
    
    // get computer choice
    const computerChoice = getComputerChoice();
    
    // update hand images
    playerHandElement.src = playerImages[playerChoice];
    computerHandElement.src = computerImages[computerChoice];
    
    // determine winner
    const result = determineWinner(playerChoice, computerChoice);
    
    // update scores
    if (result === 'win') {
        playerScore++;
    } else if (result === 'lose') {
        computerScore++;
    }
    
    updateScore();
    
    // add to battle history
    addToHistory(playerChoice, computerChoice, result);
    
    // show result message and animation
    resultMessageElement.textContent = getResultMessage(result, playerChoice, computerChoice);
    showResultAnimation(result);
    
    // re-enable buttons
    setButtonsDisabled(false);
    isAnimating = false;
}

//Reset the game to initial state
function resetGame() {
    // reset scores
    playerScore = 0;
    computerScore = 0;
    updateScore();
    
    // reset hand images
    playerHandElement.src = playerImages.default;
    computerHandElement.src = computerImages.default;
    
    // reset result message
    resultMessageElement.classList.remove('win', 'lose', 'draw');
    resultMessageElement.textContent = 'Make your move!';
    
    // remove animation classes
    playerHandElement.classList.remove('hand-win', 'hand-lose');
    computerHandElement.classList.remove('hand-win', 'hand-lose');
    
    // clear battle history
    clearHistory();
    
    // reset animation flag
    isAnimating = false;
    setButtonsDisabled(false);
}

// initialize game on page load
document.addEventListener('DOMContentLoaded', () => {
    // set initial hand images
    playerHandElement.src = playerImages.default;
    computerHandElement.src = computerImages.default;
    
    console.log('Rock Paper Scissors game loaded!');
    console.log('Click a button to play:');
    console.log('- Rock beats Scissors');
    console.log('- Paper beats Rock');
    console.log('- Scissors beats Paper');
});