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
];

const questionElement = document.getElementById("question");
const answerButton = document.querySelector(".answer-buttons");
const nextButton = document.getElementById("next-btn");

let curretQuestionIndex = 0;
