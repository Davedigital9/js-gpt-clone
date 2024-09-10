// Get references to the HTML elements
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");

let userText = null;
const API_KEY = "";

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className); 
    chatDiv.innerHTML = html;
    return chatDiv; //Return the created chat div
}

const getChatResponse = () => {
    const API_URL = "https://api.openai.com/v1/chat/completions";

    // Define the prop amd data fpr the API request 
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }
}

const showTypingAnimation = () =>{
    const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="./images/gpt_logo.jpg" alt="chatbot" class="image-icon">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay: 0.2s"></div>
                        <div class="typing-dot" style="--delay: 0.3s"></div>
                        <div class="typing-dot" style="--delay: 0.4s"></div>
                    </div>
                </div>
                <span class="material-symbols-rounded">content_copy</span>
                </div>` ;

// Create an outgoing chat div with typing animation and append it to chat container
const incomingChatDiv = createElement(html, "incoming");
chatContainer.appendChild(incomingChatDiv);
getChatResponse();
}

// const chatLog = document.querySelector('.chat-log');
// const userInput = document.getElementById('user-input');
// const sendBtn = document.getElementById('send-btn');
// const newChat = document.getElementById('new-chat');

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra space
    // console.log(userText);
    const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="./images/user.jpeg" alt="user-img" class="image-icon">
                    <p>${userText}</p>
                </div>
            </div>` ;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createElement(html, "outgoing");
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypingAnimation, 500);
}

sendButton.addEventListener("click", handleOutgoingChat);