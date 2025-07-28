

let currentSubject = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionBank = {};

const subjectList = document.getElementById("subject-list");
const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const answerForm = document.getElementById("answer-form");
const submitBtn = document.getElementById("submit-btn");
const progressBar = document.getElementById("progress-bar");
const srFeedback = document.getElementById("sr-feedback");
const scoreNumber = document.getElementById("score-number");
const scoreLabel = document.getElementById("score-label");

const retrySubjectBtn = document.getElementById("retry-subject-btn");
const backHomeBtn = document.getElementById("back-home-btn");

const iconMap = {
  HTML: "🌐",
  CSS: "🎨",
  JS: "⚙️",
  SASS: "💅"
};

["html.json", "css.json", "js.json", "sass.json"].forEach((file) => {
  const subject = file.split(".")[0].toUpperCase();
  fetch(file)
    .then((res) => res.json())
    .then((data) => {
      questionBank[subject] = data;
      renderSubjects();
    })
    .catch((err) => {
      console.warn(`Failed to load ${file}`, err);
    });
});
function getRandomQuestions(allQuestions, count = 10) {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}


function renderSubjects() {
  subjectList.innerHTML = "";
  for (const subject in questionBank) {
    const button = document.createElement("button");
    button.className = "subject-btn";
    const icon = iconMap[subject] || "📘";
    button.innerHTML = `
      <span class="subject-btn-icon">${icon}</span>
      <span>${subject}</span>
    `;
    button.addEventListener("click", () => startQuiz(subject));
    subjectList.appendChild(button);
  }
}


function startQuiz(subject) {
  currentSubject = subject;
  currentQuestions = getRandomQuestions(questionBank[subject]);
  currentQuestionIndex = 0;
  score = 0;
  homeScreen.hidden = true;
  quizScreen.hidden = false;
  resultScreen.hidden = true;
  renderQuestion();
}


function renderQuestion() {
  const currentQuestion = currentQuestions[currentQuestionIndex];
  questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
  questionText.textContent = currentQuestion.question;

  answerForm.innerHTML = "";
  currentQuestion.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "answer-option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = index;
    input.addEventListener("change", () => {
      submitBtn.disabled = false;
    });

    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("span");
    text.textContent = option;

    label.appendChild(input);
    label.appendChild(letter);
    label.appendChild(text);
    answerForm.appendChild(label);
  });

  submitBtn.disabled = true;
  submitBtn.textContent = "Submit answer";
  submitBtn.onclick = submitAnswer;

  updateProgress();
  srFeedback.textContent = "";
}


function submitAnswer() {
  const selected = answerForm.querySelector("input[name='answer']:checked");
  if (!selected) return;

  const selectedIndex = Number(selected.value);
  const correctIndex = currentQuestions[currentQuestionIndex].answerIndex;

  const options = answerForm.querySelectorAll(".answer-option");
  options.forEach((opt, index) => {
    if (index === correctIndex) {
      opt.dataset.correct = "true";
    } else if (index === selectedIndex) {
      opt.dataset.incorrect = "true";
    }
    opt.querySelector("input").disabled = true;
  });

  if (selectedIndex === correctIndex) {
    score++;
    srFeedback.textContent = "Correct!";
  } else {
    srFeedback.textContent = "Wrong!";
  }

  submitBtn.textContent = "Next";
  submitBtn.onclick = nextQuestion;
}


function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= currentQuestions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function updateProgress() {
  const percent = ((currentQuestionIndex) / currentQuestions.length) * 100;
  progressBar.style.width = percent + "%";
}


function showResults() {
  quizScreen.hidden = true;
  resultScreen.hidden = false;
  scoreNumber.textContent = score;
  scoreLabel.textContent = `out of ${currentQuestions.length}`;
}

retrySubjectBtn.addEventListener("click", () => startQuiz(currentSubject));
backHomeBtn.addEventListener("click", () => {
  homeScreen.hidden = false;
  quizScreen.hidden = true;
  resultScreen.hidden = true;
});




//10. Theme Toggle (Dark/Light Mode)
const themeToggle = document.getElementById('theme-toggle');

// Load saved theme
function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.checked = savedTheme === 'dark';
}
applySavedTheme();

// On toggle change
themeToggle.addEventListener('change', function () {
  const theme = this.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
});
