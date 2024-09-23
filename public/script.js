const messageButton = document.getElementById("message-button");
const messageInput = document.getElementById("message-input");
const chatbox = document.getElementById("chatbox");

messageButton.addEventListener("click", sendMessage);

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

function addMessageTo(box, message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    box.appendChild(messageElement);
}