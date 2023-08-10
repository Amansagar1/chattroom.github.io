const socket = io();

const clientsTotal = document.getElementById("client-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

const messageTone = new Audio("./Baby Giggle.mp3");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clients-total", (data) => {
  // Corrected event name
  clientsTotal.innerText = `Total Clients: ${data}`;
});

function sendMessage() {
  if (messageInput.value === "") return;

  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date().toISOString(), // Converted date to ISO format
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

socket.on("Chat-message", (data) => {
  // Corrected event name
  messageTone.play();
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
        <p class="message">
            ${data.message}
            <span>${data.name} ${moment(data.dateTime).fromNow()}</span>
        </p>
    </li>
    `;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

function clearFeedback() {
  const feedbackElements = document.querySelectorAll("li.message-feedback");
  feedbackElements.forEach((element) => {
    element.parentNode.removeChild(element);
  });
}

messageInput.addEventListener("input", (e) => {
 
    
  if (messageInput.value.trim() !== "") {
    socket.emit("feedback", {
      feedback: `${nameInput.value} is typing a message`,
    });
  } else {
    socket.emit("feedback", {
      feedback: "",
    });
  }
});

socket.on("feedback", (data) => {
  clearFeedback();
  if (data.feedback !== "") {
    const element = `<li class="message-feedback">
            <p class="feedback" id="feedback"> ${data.feedback}</p>
        </li>`;
    messageContainer.innerHTML += element;
  }
});
