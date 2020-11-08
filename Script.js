
var start = document.querySelector("#button");
var quiz = document.querySelector("#quiz");
var next = document.querySelector("#next");
var viewScoreBtn = document.querySelector("#viewScoreBtn");
var submitBtn = document.querySelector("#submitBtn");
var quizContainer = document.querySelector("#quiz-container");
var displayScores = document.querySelector("#display-scores");
var nameContainer = document.querySelector("#nameContainer");
var questionCounter = 0; // Track question number
var selections = []; // Array containing user's selectionss
var scores = window.localStorage.getItem('scores') || '[]'; 
var timer = 60;
var numbCorectAns= 0;

// set score in local storage onload
window.localStorage.setItem('scores', scores);

function myTimer() {
    var span = document.querySelector('#time');
    if(timer > -1) {
        span.textContent = timer--;
    } 
    else {
        span.textContent = 0;
        quizContainer.innerHTML = '<div class="timeOver">Time is up!!!</div>';
    }
    
}

function setTimer () {
    setInterval(myTimer, 1000);
}

// Clear interval
if(timer < 0) {
    clearInterval(myTimer);
}


//Create function to display questions
function createQuestion(index) {
    var list = createRadios(index);
    var question = `<div id="question">
                        <h2>Question ${index + 1}</h2>
                        <p>${questions[index].question}</p>
                        <ul>
                        ${list}
                        </ul>
                 </div>`;
    return question;
}

//display next question
function displayNext() {
    if(questionCounter < questions.length) {
        start.classList.add('hide');
        quiz.innerHTML = createQuestion(questionCounter);
    } else {
        quizContainer.innerHTML =displayScore();
        nameContainer.classList.remove('hide');
        start.classList.remove('hide');
    }
  
}


//create radio buttons
function createRadios(index) {
    var radioList = '';
    for(var i = 0 ; i < questions[0].choices.length; i++) {
       radioList += `<li>
                        <input type="radio" name="answer" value=${i} />
                       ${questions[index].choices[i]}
                     </li>`;
    }
    return radioList;
}

//get user's selection
function choose() {
  selections[questionCounter] = document.querySelector('input[name="answer"]:checked').value;
}

//display user's score 
function displayScore() {
    
    for(var i = 0; i < selections.length; i++ ) {
    
       if (parseInt(selections[i]) === questions[i].correctAnswer) {
           numbCorectAns++;
       }
    }
   
    return `<div>you got ${numbCorectAns} answers right out of ${questions.length} questions </div>`;
}


//display high scores
function displayHighScores() {
    var highscores = JSON.parse(scores);
    
  displayScores.innerHTML = `<h1>High scores: </h1>`;

    if(highscores.length > 0){
        for(var i = 0; i < highscores.length; i++) {
            displayScores.innerHTML  += `<p>${highscores[i].name} <span class="testScore">${highscores[i].score}</span></p>`;
        }
    }  
}



//click events

start.addEventListener("click", function(e) {
    e.preventDefault();

    setTimer();
    displayNext();
});

next.addEventListener("click", function(e) {
    e.preventDefault();
    choose();
  
    questionCounter++;
    displayNext();

    for(var i = 0; i < selections.length; i++ ) {
        if(parseInt(selections[i]) !== questions[i].correctAnswer) {
            timer = timer - 5;
        }
    }
});

viewScoreBtn.addEventListener("click", function(e) {
    e.preventDefault();
    displayScores.classList.toggle('hide');
    quizContainer .classList.toggle('hide');
    nameContainer.classList.add('hide');
    displayHighScores();
});

submitBtn.addEventListener("click", function(e) {
    e.preventDefault();
    var nameInput = document.querySelector('#name').value;
    var parsedScore = JSON.parse(scores);

    if(numbCorectAns > 0) {
        var newScores = {
            name: nameInput,
            score: numbCorectAns,
        };
        parsedScore.push(newScores);
        window.localStorage.setItem('scores', JSON.stringify(parsedScore));
    }
})
