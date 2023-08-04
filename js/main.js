// select element
let quizApp = document.querySelector('.quiz-app');
let quizInfo = document.querySelector('.quiz-info');
let countSpan = document.querySelector(" .count span");
let bulletsSpan = document.querySelector('.spans');
let quizArea = document.querySelector('.quiz-area');
let answerArea = document.querySelector('.answer-area');
let submit = document.querySelector('.submit-button');
let pullets = document.querySelector('.bullets');
let result = document.querySelector('.result');
let countDownSpan = document.querySelector('.count-down');
let darkBTN = document.querySelector('.dark');
let lightBTN = document.querySelector('.light');
// set option
let current = 0;
let rightAnswers = 0;
let countDownInterval;
let time = 2 * 60;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObj = JSON.parse(this.responseText);
      let questionCount = questionObj.length;
      createBullets(questionCount);
      // add question data
      addQuestionData(questionObj[current], questionCount);
      // count down 
      countDown(time, questionCount);
      // click on submit
      submit.onclick = function () {
        // get right answer 
        let rightAnswer = questionObj[current].right_answer;
        // increase  index
        current++;
        // cheek answer
        checkAnswer(rightAnswer, questionCount);
        // remove previous question
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        // add question
        addQuestionData(questionObj[current], questionCount);
        // handel bullets class
        handelBullets();
        // clear interval of count down 
        clearInterval(countDownInterval);
        // count down
        countDown(time, questionCount);
        // show result
        showResult(questionCount);
      };
    };
  };
  myRequest.open("GET" , 'html_questions.json', true);
  myRequest.send();
};



getQuestions();

//  function to create bullets spans  
function createBullets(num) {
  countSpan.innerHTML = num;
  // create spans
  for (let i = 0; i < num; i++){
    let span = document.createElement('span');
    if (i === 0) { span.className = 'on'; };
    bulletsSpan.appendChild(span);
  };
};

function addQuestionData(opj, qCount) {
  if (current < qCount) {
     //create h2 question title
  let qTitle = document.createElement('h2');
  //create text to h2 
    let qText = document.createTextNode(opj['title']);
  // append text to title 
  qTitle.appendChild(qText);
  // append h2 to quiz area
  quizArea.appendChild(qTitle);
  // loop for set question
  for (let i = 1; i <=4; i++){
    let mainDiv = document.createElement('div');
    mainDiv.className = 'answer';
    let radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'question';
    radio.id = `answer_${i}`;
    radio.dataset.answer = opj[`answer_${i}`];
    // make first option selected
    if (i === 1) {
      radio.checked= true
    };
    let label = document.createElement('label');
    let labelText = document.createTextNode(opj[`answer_${i}`]);
    label.appendChild(labelText);
    label.htmlFor = `answer_${i}`;
    mainDiv.appendChild(radio);
    mainDiv.appendChild(label);
    answerArea.appendChild(mainDiv);
    };
    
  };
};


function checkAnswer(rightAnswer, count) {
  let answers = document.getElementsByName('question');
  let theChosenAnswer;
  for (let i = 0; i < answers.length; i++){
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    };
  };
      if (theChosenAnswer === rightAnswer) {
      rightAnswers++
  };
};
function handelBullets() {
  let bulletsSpan = Array.from(document.querySelectorAll('.spans span'));
  bulletsSpan.forEach((span, index) => {
    if (index === current) {
      span.className = 'on';
    };
  });
};

function showResult(count) {
  let theResult;
  if (current === count) {
    quizArea.remove();
    answerArea.remove();
    submit.remove();
    pullets.remove();
    if (rightAnswers > (count / 2) && rightAnswers < count) {
      theResult = `<span class="good">good</span>, you answer ${rightAnswers} from ${count}`
    } else if (rightAnswers === count) {
      theResult = `<span class="prefect">prefect</span>, you answer ${rightAnswers} from ${count}`
    } else (theResult = `<span class="bad">bad</span>, you answer ${rightAnswers} from ${count}`);
    result.innerHTML = theResult
  };
};


function countDown(duration, count) {
  if (current < count) {
    let minutes, secondes;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      secondes = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      secondes = secondes < 10 ? `0${secondes}` : secondes;
      countDownSpan.innerHTML = `${minutes} : ${secondes}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submit.click();
      };
    }, 1000);
  };
};


//dark mood 
darkBTN.onclick = function () {
  darkBTN.classList.add("none");
  lightBTN.classList.remove("none");
  document.body.classList.add("main-dark-them");
  quizApp.classList.add("second-dark-them");
  quizInfo.classList.add("main-dark-them");
  quizArea.classList.add("main-dark-them");
  answerArea.classList.add("main-dark-them");
  pullets.classList.add("main-dark-them");
};
// light mood
lightBTN.onclick = function () {
  lightBTN.classList.add("none");
  darkBTN.classList.remove("none");
  document.body.classList.remove("main-dark-them");
  quizApp.classList.remove("second-dark-them");
  quizInfo.classList.remove("main-dark-them");
  quizArea.classList.remove("main-dark-them");
  answerArea.classList.remove("main-dark-them");
  pullets.classList.remove("main-dark-them");
};

