import config from './config.js';

// Get references to the HTML elements
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

// const chatLog = document.querySelector('.chat-log');
// const userInput = document.getElementById('user-input');
// const sendBtn = document.getElementById('send-btn');
// const newChat = document.getElementById('new-chat');

let userText = null;
const API_KEY = config.apiKey;
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalStorage = () =>{
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class = "default-text">
                            <h1> ChatGPT Clone </h1>
                            <p> Start a conversation and explore the power of AI. <br> Your chat history will be displayed here. </p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
}

loadDataFromLocalStorage();

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className); 
    chatDiv.innerHTML = html;
    return chatDiv; //Return the created chat div
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");

    // Define the prop and data fpr the API request 
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

    // send pOST request to API, get response and set the response as paragraph element text
    try {
        const response = await (await fetch (API_URL, requestOptions)).JSON();
        // console.log(response);
        pElement.textContent = response.choices[0].text.trim();
    } catch (error) {
        // console.log(error)
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retreiving the response. Please try again. ";
    }

    // Remove the typing animation, append the paragraph element and save the chats to local storage.
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);

}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard 
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
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
                <span onclick = "copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>` ;

// Create an outgoing chat div with typing animation and append it to chat container
const incomingChatDiv = createElement(html, "incoming");
chatContainer.appendChild(incomingChatDiv);
chatContainer.scrollTo(0,chatContainer.scrollHeight);
getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra space
    // console.log(userText);
    if(!userText) return; // If chatInput is emptry, return from here

    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;

    const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="./images/user.jpeg" alt="user-img" class="image-icon">
                    <p></p>
                </div>
            </div>` ;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromStorage function
    if(confirm("Are you sure you want to delete all the chats?")){
        localStorage.removeItem("all-chats");
        loadDataFromLocalStorage();
    }
})

chatInput.addEventListener("input", () => {
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", () => {
    // If the enter keyis presses without shift and the window is larger
    // than 800 pixels, handle the outgoing chat

    if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800){
        e.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat);