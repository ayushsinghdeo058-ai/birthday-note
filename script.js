// script.js

// ====================================================================
// A. Define Game Data (8 Questions)
// ====================================================================

const questions = [
    // IMPORTANT: CHANGE THE ANSWERS (answer: "X") TO BE CORRECT FOR SOHAM
    { q: "Which country's cuisine do you enjoy the most?", options: ["A. Italian", "B. Indian", "C. Mexican"], answer: "B", },
    { q: "What is your preferred way to relax after a long week?", options: ["A. Reading a book", "B. Playing video games", "C. Watching a movie"], answer: "B", },
    { q: "If you could travel anywhere tomorrow, where would you want to go?", options: ["A. Japan", "B. Switzerland", "C. New York"], answer: "A", },
    { q: "Which sport do you like the most?", options: ["A. Cricket", "B. Football (Soccer)", "C. Basketball"], answer: "A", },
    { q: "What kind of movie genre is your all-time favorite?", options: ["A. Sci-Fi", "B. Thriller", "C. Comedy"], answer: "C", },
    { q: "What is your favorite time of day?", options: ["A. Morning", "B. Afternoon", "C. Night"], answer: "C", },
    { q: "Which animal are you secretly obsessed with?", options: ["A. Dog", "B. Cat", "C. Bunny"], answer: "C", },
    { q: "Which valorant character you look alike? HINT: 1. when you wear glasses 2. search the character names", options: ["A. Savo", "B. Chamber", "C. Omen"], answer: "B", } 
];

const customMessages = {
    wrong: [
        "Oops! That's not right. Maybe a quick re-think😕?",
        "Incorrect! Are you even trying silly🤨",
        "Almost! Keep going, you got this!🫤"
    ],
    // The specific sad/dominant message for the last chance screen
    sadTone: "Are you serious right now? That secret is so good, you HAVE to hear it! I'm giving you ONE last chance. Don't waste it! 😠",
    rickrollUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
};

let currentQuestionIndex = 0;
let score = 0;
const TOTAL_QUESTIONS = questions.length;

// ====================================================================
// B. Core Functions & Setup 
// ====================================================================

const gameMusic = document.getElementById('gameMusic');
const secretMusic = document.getElementById('secretMusic');

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function generateBackgroundEmojis() {
    const container = document.getElementById('backgroundFloaters');
    const emojiTypes = ['🥳', '✨', '🎈', '🎁', '💖', '⭐', '🎂', '💙', '🥳', '🤩'];
    
    for (let i = 0; i < 20; i++) {
        const randomEmoji = emojiTypes[Math.floor(Math.random() * emojiTypes.length)];
        const topPos = Math.floor(Math.random() * 100);
        const leftPos = Math.floor(Math.random() * 100);
        
        const emojiElement = document.createElement('div');
        emojiElement.className = 'floating-emoji';
        emojiElement.style.top = `${topPos}%`;
        emojiElement.style.left = `${leftPos}%`;
        emojiElement.style.animationDelay = `${Math.random() * 2}s`;
        emojiElement.textContent = randomEmoji;
        container.appendChild(emojiElement);
    }
}

document.getElementById('startGameBtn').addEventListener('click', () => {
    generateBackgroundEmojis(); 
    switchScreen('gameScreen');
    gameMusic.play().catch(e => console.warn("Music playback failed."));
    loadQuestion();
});


// ====================================================================
// C. Question Loading and Display Logic 
// ====================================================================

function loadQuestion() {
    if (currentQuestionIndex >= TOTAL_QUESTIONS) {
        showScoreScreen();
        return;
    }

    const qData = questions[currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    
    container.innerHTML = `
        <div class="question-box">
            <div class="question-text">
                <p>Question ${currentQuestionIndex + 1}/${TOTAL_QUESTIONS}:</p>
                <h3>${qData.q}</h3>
            </div>
            <div class="options">
                ${qData.options.map((option, index) => `
                    <button class="answer-btn fun-button" data-answer="${String.fromCharCode(65 + index)}">${option}</button>
                `).join('')}
            </div>
        </div>
    `;

    document.querySelectorAll('.answer-btn').forEach(button => {
        button.addEventListener('click', handleAnswer);
    });
}


function handleAnswer(event) {
    document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
    
    const userAnswer = event.target.dataset.answer;
    const correct = questions[currentQuestionIndex].answer;
    const feedback = document.getElementById('answerFeedback');

    if (userAnswer === correct) {
        score++;
        feedback.textContent = "Correct! Great job! 🎉";
        event.target.style.backgroundColor = 'lightgreen'; 
    } else {
        const msg = customMessages.wrong[Math.floor(Math.random() * customMessages.wrong.length)];
        feedback.textContent = msg;
        event.target.style.backgroundColor = 'salmon';
        document.querySelector(`.answer-btn[data-answer="${correct}"]`).style.backgroundColor = '#62d162';
    }

    setTimeout(() => {
        currentQuestionIndex++;
        feedback.textContent = '';
        loadQuestion(); 
    }, 2000); 
}


// ====================================================================
// D. Final Screens Logic (FULL RICKROLL SEQUENCE)
// ====================================================================

function showScoreScreen() {
    switchScreen('scoreScreen');
    document.getElementById('finalScore').textContent = score;
    document.querySelector('.score-display').innerHTML = `Your Score: <span id="finalScore">${score}</span>/${TOTAL_QUESTIONS}`;
    const resultArea = document.getElementById('scoreResultArea');
    
    gameMusic.pause(); 
    gameMusic.currentTime = 0;

    // Logic to set the introductory text based on score
    let message = (score > 4) ? 
        `<h3>Amazing! You scored ${score} out of ${TOTAL_QUESTIONS}! You know me so well!</h3>` :
        `<h3>Better luck next time! You scored only ${score} out of ${TOTAL_QUESTIONS}.</h3>`;
    
    // RENDER BOTH messages with the Secret Button attached
    resultArea.innerHTML = `
        ${message}
        <button id="showSecretBtn" class="fun-button">Wanna hear top a secret 🤫</button>
    `;
    
    // Crucial: The button event listener is attached here to always work
    document.getElementById('showSecretBtn').addEventListener('click', showSecretMessage);
}

function showSecretMessage() {
    switchScreen('secretScreen');
    secretMusic.play().catch(e => console.warn("Secret Music playback failed."));

    document.getElementById('secretMessage').innerHTML = 
        "Soham, you are one of the most incredible people I know for real🤌. Every year with you is a gift. I cherish our bond and hope you have the most spectacular birthday!🙌 Remember to always chase your dreams.<br><br>Your friend, Ayush(King) 🫶<br><br>Hope you like my little surprise";

    // FIX: Click Wanna Hear More -> Rickroll
    document.getElementById('hearMoreBtn').addEventListener('click', () => {
        window.location.href = customMessages.rickrollUrl; 
    });

    // FIX: Click No -> Sad/Dominant Tone Screen
    document.getElementById('noMoreBtn').addEventListener('click', showLastChanceScreen);
}

function showLastChanceScreen() {
    switchScreen('lastChanceScreen');
    secretMusic.pause(); 
    secretMusic.currentTime = 0;
    
    // FIX: Insert the specific sad/dominant tone message
    document.getElementById('sadMessage').innerHTML = `<p class="sad-tone">${customMessages.sadTone}</p>`;
    
    // FIX: Click Last Chance -> Rickroll
    document.getElementById('lastChanceBtn').addEventListener('click', () => {
        window.location.href = customMessages.rickrollUrl; 
    });
}