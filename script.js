const questions = [
  {
    text: "Jaké je hlavní město České republiky?",
    answers: ["Praha", "Brno", "Ostrava", "Plzeň"],
    correct: "Praha",
  },
  {
    text: "Kdo je prezidentem České republiky?",
    answers: ["Miloš Zeman", "Václav Havel", "Petr Pavel", "Andrej Babiš"],
    correct: "Petr Pavel",
  },
  {
    text: "Jaký je nejvyšší vrchol České republiky?",
    answers: ["Sněžka", "Lysá hora", "Praděd", "Kleť"],
    correct: "Sněžka",
  },
  {
    text: "Která řeka protéká Prahou?",
    answers: ["Labe", "Vltava", "Morava", "Odra"],
    correct: "Vltava",
  },
  {
    text: "Které město je známé výrobou automobilů Škoda?",
    answers: ["Mladá Boleslav", "Liberec", "Pardubice", "Kolín"],
    correct: "Mladá Boleslav",
  },
  {
    text: "Jak se jmenuje česká měna?",
    answers: ["Euro", "Dolar", "Koruna česká", "Zlotý"],
    correct: "Koruna česká",
  },
  {
    text: "Který kraj je největší rozlohou?",
    answers: ["Středočeský", "Jihočeský", "Plzeňský", "Jihomoravský"],
    correct: "Středočeský",
  },
  {
    text: "Kolik barev má česká vlajka?",
    answers: ["2", "3", "4", "5"],
    correct: "3",
  },
  {
    text: "Kdo napsal operu Prodaná nevěsta?",
    answers: [
      "Antonín Dvořák",
      "Bedřich Smetana",
      "Leoš Janáček",
      "Bohuslav Martinů",
    ],
    correct: "Bedřich Smetana",
  },
  {
    text: "Jaký je mezinárodní kód pro Českou republiku?",
    answers: [".pl", ".sk", ".de", ".cz"],
    correct: ".cz",
  },
];

let answers = JSON.parse(sessionStorage.getItem("userAnswers")) || [];
let currentQuestion =
  parseInt(sessionStorage.getItem("currentQuestionIndex")) || 1;
let isFinished = sessionStorage.getItem("isFinished") == "true";

if (isFinished) send();
else loadQuestion();

function loadQuestion() {
  const qIndex = currentQuestion - 1;
  document.getElementById("question").textContent =
    `${currentQuestion}. ${questions[qIndex].text}`;

  const answersDiv = document.getElementById("answers");
  answersDiv.replaceChildren();

  questions[qIndex].answers.forEach((answer) => {
    const label = document.createElement("label");
    label.className = "answer-row";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "q-opt";
    radio.checked = answers[qIndex] == answer;
    radio.onclick = () => {
      answers[qIndex] = answer;
      sessionStorage.setItem("userAnswers", JSON.stringify(answers));
    };

    const textNode = document.createTextNode(answer);
    label.append(radio, textNode);
    answersDiv.appendChild(label);
  });
}

function nextQuestion() {
  if (isFinished || currentQuestion >= questions.length) return;
  sessionStorage.setItem("currentQuestionIndex", ++currentQuestion);
  loadQuestion();
}

function previousQuestion() {
  if (isFinished || currentQuestion <= 1) return;
  sessionStorage.setItem("currentQuestionIndex", --currentQuestion);
  loadQuestion();
}

function send() {
  isFinished = true;
  sessionStorage.setItem("isFinished", "true");

  document.getElementById("quiz").style.display = "none";
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.replaceChildren();

  let correctCount = 0;

  questions.forEach((q, i) => {
    const userAns = answers[i];
    const isCorrect = userAns == q.correct;
    if (isCorrect) correctCount++;

    const itemDiv = document.createElement("div");
    itemDiv.className = "result-item";

    const qTitle = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${i + 1}. ${q.text}`;
    qTitle.appendChild(strong);

    const userAnsP = document.createElement("p");
    userAnsP.textContent = "Vaše odpověď: ";

    const userSpan = document.createElement("span");
    userSpan.className = isCorrect ? "correct" : "wrong";
    userSpan.textContent = userAns ? userAns : "Nezodpovězeno";
    userAnsP.appendChild(userSpan);

    itemDiv.append(qTitle, userAnsP);

    if (!isCorrect) {
      const correctP = document.createElement("p");
      correctP.textContent = "Správná odpověď: ";

      const correctSpan = document.createElement("span");
      correctSpan.className = "correct";
      correctSpan.textContent = q.correct;

      correctP.appendChild(correctSpan);
      itemDiv.appendChild(correctP);
    }

    resultDiv.appendChild(itemDiv);
  });

  const scoreDiv = document.createElement("div");
  const scoreH2 = document.createElement("h2");
  scoreH2.id = "score";
  scoreH2.textContent = `Výsledek: ${correctCount} z ${questions.length}`;

  scoreDiv.appendChild(scoreH2);
  resultDiv.prepend(scoreDiv);
}
