console.log('This is a popup!');


const getTime = () => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0'); // Retrieve hours and pad with leading zero if necessary
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Retrieve minutes and pad with leading zero if necessary

    return `${hours}:${minutes}`;
}

const addUserChat = () => {
    const value = document.getElementById('textInput').value;
    addUserChatBubble(value);
};

const addUserChatBubble = (chatText) => {
    const chatElement = document.getElementById('chatBox');
    const newBubble = document.createElement('div');
    newBubble.innerHTML = `<div class="bubbleWrapper">\n      <div class="inlineContainer own">\n        <img class="inlineIcon" src="https://www.pinclipart.com/picdir/middle/205-2059398_blinkk-en-mac-app-store-ninja-icon-transparent.png">\n        <div class="ownBubble own">\n          ${chatText}\n        </div>\n      </div><span class="own">${getTime()}</span>\n    </div>`;
    chatElement.appendChild(newBubble);
};

const addResponseChatBubble = (chatText) => {
    const chatElement = document.getElementById('chatBox');
    const newBubble = document.createElement('div');
    newBubble.innerHTML = `<div class="bubbleWrapper">\n      <div class="inlineContainer">\n        <img class="inlineIcon" src="https://www.pinclipart.com/picdir/middle/205-2059398_blinkk-en-mac-app-store-ninja-icon-transparent.png">\n        <div class="otherBubble other">\n          ${chatText}\n        </div>\n      </div><span class="other">${getTime()}</span>\n    </div>`;
    chatElement.appendChild(newBubble);
};

window.addEventListener("DOMContentLoaded", (event) => {
    const el = document.getElementById('textInput');
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addUserChat();
            el.value = "";
        }
      });

});
element = hello.html

