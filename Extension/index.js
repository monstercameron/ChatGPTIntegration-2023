window.onload = function () {

  const urlParams = new URLSearchParams(window.location.search);
  // console.log(window.location.search);

  const eeid = urlParams.get('eeid');
  // console.log(eeid);

  // Grabs the right-hand container
  const element = document.getElementById('ContentFrame').contentWindow.document.getElementById('ctl00_thingsICanDoMainDiv')
  console.log(element);
  // if (element == null) 
  // return;

  // Creates a test element
  const injectElement = document.createElement('div');
  injectElement.className = 'Test-Div';
  injectElement.innerHTML = 'EXAMPLE TEST';

  fetch(chrome.runtime.getURL('/index.html'))
    .then(response => response.text())
    .then(data => {
      const tempVar = document.createElement('div');
      tempVar.className = "Testcase";
      tempVar.innerHTML = data;
      document.body.appendChild(tempVar);
      console.log(tempVar);
      // other code
      // eg update injected elements,
      // add event listeners or logic to connect to other parts of the app
    }).catch(err => {
      console.error(err);
      // handle error
    });

  element.appendChild(injectElement);

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

  const el = document.getElementById('textInput');
  console.log(el);
  el.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addUserChat();
      el.value = "";
    }
  });
};