window.onload = async function () {

  // Grabs the right-hand container
  const element = document.getElementById('ContentFrame').contentWindow.document.getElementById('ctl00_thingsICanDoMainDiv')

  await fetch(chrome.runtime.getURL('/index.html'))
    .then(response => response.text())
    .then(data => {

      const tempVar = document.createElement('div');
      const mainContainer = document.querySelector('#MainContainer');
      console.log(mainContainer);
      tempVar.className = "Testcase";
      tempVar.innerHTML = data;
      mainContainer.appendChild(tempVar);

    }).catch(err => {

      console.error(err);

    });

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

  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chatWrapper");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  const inputElement = document.getElementById('textInput');
  console.log(inputElement);
  inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && inputElement.value !== "") {
      event.preventDefault();
      addUserChat();
      scrollToBottom();
      inputElement.value = "";
    }
  });

  const showChatButton = document.getElementById('open-button');
  showChatButton.addEventListener('click', (event) => {
    console.log("hit");
    if (document.getElementById('chatWrapper').style.display === 'none')
      document.getElementById('chatWrapper').style.display = 'block';
      if (document.getElementById('chatWrapper').style.display === 'block')
      document.getElementById('chatWrapper').style.display = 'none';
  })
};