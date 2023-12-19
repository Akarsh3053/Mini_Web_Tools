const questions = [
  {
    question: "What is the outermost layer of the sun is called?",
    answers: [
      { text: "Orbit", correct: false },
      { text: "Aurora", correct: false },
      { text: "Corona", correct: true },
      { text: "Eclips", correct: false },
    ],
  },
  {
    question: "Which Gas is filled in Airplanes tires??",
    answers: [
      { text: "Nitrogen", correct: true },
      { text: "Helium", correct: false },
      { text: "Oxygen", correct: false },
      { text: "Hydrogen", correct: false },
    ],
  },
  {
    question: "Which cartoon character transforms into alien superheros?",
    answers: [
      { text: "Ben 10", correct: false },
      { text: "Generator Rex", correct: false },
      { text: "Ben 10", correct: false },
      { text: "Ben 10", correct: true },
    ],
  },
  {
    question: "Which Naruto character is the smartest?",
    answers: [
      { text: "Madara Uchiha", correct: false },
      { text: "Minato Namikaze", correct: false },
      { text: "Shikamaru Nara", correct: true },
      { text: "Kakashi Hatake", correct: false },
    ],
  },
  {
    question: "Which is the longest running Anime till date?",
    answers: [
      { text: "One Piece", correct: true },
      { text: "Naruto", correct: false },
      { text: "Dragon Ball Z", correct: false },
      { text: "Death Note", correct: false },
    ],
  },
  {
    question: "Which is not an API metho ?",
    answers: [
      { text: "REST", correct: false },
      { text: "GraphQL", correct: false },
      { text: "OpenAPI", correct: true },
      { text: "gRPC", correct: false },
    ],
  },
];

const questionElement = document.getElementById("question");
const answerButtons = document.querySelector(".answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestions();
}

function showQuestions() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
  } else {
    selectedBtn.classList.add("incorrect");
  }
}

startQuiz();
