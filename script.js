let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Fetch questions from an API
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=5&category=18&type=multiple'); // Example URL from Open Trivia Database
        const data = await response.json();

        // Map API data to your question format
        questions = data.results.map(q => ({
            question: q.question,
            options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5), // Shuffle options
            correctAnswer: q.correct_answer
        }));

        // Start quiz by displaying the first question
        displayQuestion(currentQuestionIndex);
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// Display the current question and options
function displayQuestion(index) {
    const questionElement = document.getElementById("question");
    const optionsForm = document.getElementById("options-form");

    // Clear previous options
    optionsForm.innerHTML = "";
    let questionNo=currentQuestionIndex + 1;
    // Set the question text
    questionElement.innerHTML = questionNo + '. ' + questions[index].question;

    // Create radio inputs for each option
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

// Handle answer submission
function submitAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');

    // Check if an option is selected
    if (!selectedOption) {
        document.getElementById("feedback").innerText = "Please select an answer!";
        return;
    }

    const userAnswer = selectedOption.value;

    // Check if the selected answer is correct
    if (userAnswer === questions[currentQuestionIndex].correctAnswer) {
        score++;
        document.getElementById("feedback").innerText = "Correct!";
    } else {
        document.getElementById("feedback").innerText = "Incorrect!";
    }

    // Move to the next question
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion(currentQuestionIndex);
    } else {
        showResults();
    }
}

// Display the final score
function showResults() {
    document.getElementById("quiz-container").innerHTML = `<h3>Your score is: ${score} out of ${questions.length}</h3>`;
}

// Start fetching questions when the page loads
fetchQuestions();
