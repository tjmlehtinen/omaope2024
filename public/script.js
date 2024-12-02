const messageButton = document.getElementById("message-button");
const messageInput = document.getElementById("message-input");
const chatbox = document.getElementById("chatbox");
const imageButton = document.getElementById("image-button");
const imageInput = document.getElementById("image-input");
const questionbox = document.getElementById("questionbox");
const answerButton = document.getElementById("answer-button");
const answerInput = document.getElementById("answer-input");

messageButton.addEventListener("click", sendMessage);
imageButton.addEventListener("click", sendImages);
answerButton.addEventListener("click", sendAnswer);

async function sendMessage() {
    const userMessage = messageInput.value;
    messageInput.value = "";
    if (userMessage.trim() === "") return;
    addMessageTo(chatbox, userMessage);
    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });
        const data = await response.json();
        console.log(data);
        addMessageTo(chatbox, data.message);
    } catch(error) {
        console.error("Virhe:", error.message);
        addMessageTo(chatbox, "Tapahtui virhe.");
    }
}

async function sendImages() {
    console.log("kuvia yritetään lisätä");
    const images = imageInput.files;
    if (images.length === 0) {
        alert("Ei ole yhtään kuvaa!!!");
        return;
    }
    const formData = new FormData();
    for (const image of images) {
        formData.append("images", image);
    }
    console.log(formData.getAll("images"));
    try {
        const response = await fetch("/upload-images", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        addMessageTo(questionbox, data.question);
    } catch (error) {
        console.error("Virhe:", error.message);
        addMessageTo(questionbox, "Tapahtui virhe.");
    }
}

async function sendAnswer() {
    const userAnswer = answerInput.value;
    answerInput.value = "";
    if (userAnswer.trim() === "") return;
    addMessageTo(questionbox, userAnswer);
    try {
        const response = await fetch("/check-answer", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ message: userAnswer })
        });
        const data = await response.json();
        console.log(data);
        addMessageTo(questionbox, data.message);
    } catch(error) {
        console.error("Virhe:", error.message);
        addMessageTo(questionbox, "Tapahtui virhe.");
    }
}

function addMessageTo(box, message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    box.appendChild(messageElement);
}