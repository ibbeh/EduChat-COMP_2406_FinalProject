/*
COMP 2406 Final Term Project
By Ibraheem Refai
101259968
April 10, 2024
*/

function setupChatroomEventListeners() {
    const sendMsgButton = document.getElementById('sendMsgBtn')
    if (sendMsgButton) {
        sendMsgButton.addEventListener('click', sendMessage)
    } else {
        console.error('Send message button not found.')
    }
}


function displayMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages')
    const messageDiv = document.createElement('div')
    let isBot = false
    if(sender === 'Bot') {isBot = true}
    if (isBot) {
        //Applying the bot-message class for bot messages
        messageDiv.innerHTML = `<span class="bot-name">Bot:</span> ${message}`
    } else {
        //Applying the user-message class for user messages
        const userName = "Student"
        messageDiv.innerHTML = `<span class="user-name">${userName}:</span> ${message}`
    }
    chatMessages.appendChild(messageDiv)
}


async function sendMessage() {
    const message = document.getElementById('messageInput')
    const messageContent = message.value

    //Do nothing for empty messages
    if(messageContent.trim() === '') {return}

    //Otherwise displaying the user's message
    displayMessage('User', messageContent) 

    const response = await fetch('/chatWithBot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: messageContent }),
    })

    const data = await response.json();
    console.log(data.message.text)

    //Displaying the AI's message
    displayMessage('Bot', data.message.text)

    //Clear input after sending the message
    messageInput.value = ''
}


document.addEventListener('DOMContentLoaded', () => {
    setupChatroomEventListeners()
})