const messageButton = document.getElementById("message-button");
const messageInput = document.getElementById("message-input");
const chatbox = document.getElementById("chatbox");

messageButton.addEventListener("click", sendMessage);

function sendMessage() {
    const userMessage = messageInput.value;
    messageInput.value = "";
    addMessageTo(chatbox, userMessage);
}

function addMessageTo(box, message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    box.appendChild(messageElement);
}