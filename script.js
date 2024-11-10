let currentQuestionIndex = 0;
let score = 0;
let questions = [];


async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=5&category=18&type=multiple'); // Example URL from Open Trivia Database
        const data = await response.json();

        questions = data.results.map(q => ({
            question: q.question,
            options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5), // Shuffle options
            correctAnswer: q.correct_answer
        }));

        displayQuestion(currentQuestionIndex);
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function displayQuestion(index) {
    const questionElement = document.getElementById("question");
    const optionsForm = document.getElementById("options-form");

    optionsForm.innerHTML = "";
    let questionNo=currentQuestionIndex + 1;

    questionElement.innerHTML = questionNo + '. ' + questions[index].question;

    questions[index].options.forEach((option, i) => {
        const optionLabel = document.createElement("label");
        const optionInput = document.createElement("input");
        
        optionInput.type = "radio";
        optionInput.name = "option";
        optionInput.value = option;
        optionInput.id = `option${i}`;
        
        optionLabel.htmlFor = `option${i}`;
        optionLabel.innerText = option;
        
        optionsForm.appendChild(optionInput);
        optionsForm.appendChild(optionLabel);
        optionsForm.appendChild(document.createElement("br"));
    });
}

function submitAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');

    if (!selectedOption) {
        document.getElementById("feedback").innerText = "Please select an answer!";
        return;
    }

    const userAnswer = selectedOption.value;

    if (userAnswer === questions[currentQuestionIndex].correctAnswer) {
        score++;
        document.getElementById("feedback").innerText = "Correct!";
    } else {
        document.getElementById("feedback").innerText = "Incorrect!";
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion(currentQuestionIndex);
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById("quiz-container").innerHTML = `<h3>Your score is: ${score} out of ${questions.length}</h3>`;
}


fetchQuestions();
