const messageButton = document.getElementById("message-button");
const messageInput = document.getElementById("message-input");
const chatbox = document.getElementById("chatbox");

messageButton.addEventListener("click", sendMessage);

async function sendMessage() {
    const userMessage = messageInput.value;
    messageInput.value = "";
    addMessageTo(chatbox, userMessage);
    const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ message: userMessage })
    });
    console.log(response);
}

function addMessageTo(box, message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    box.appendChild(messageElement);
}