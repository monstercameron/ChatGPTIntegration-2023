window.onload = async function () {

  // Grab EEID
  const urlSearch = window.location.search.toString();
  const arr = urlSearch.split("!");
  var eeid = 0;
  var flag = 0;

  for (var i = 0; i < arr.length; i++) 
  {
    if (arr[i].includes('eeid')) 
    {
      const split = arr[i].split("=");
      eeid = split[1];
      flag = 1;
      break;
    }
  }

  // Exit program if EEID wasn't found
  if (flag == 0) return;

  // Grabs the right-hand container
  const element = document.getElementById('ContentFrame').contentWindow.document.getElementById('ctl00_thingsICanDoMainDiv');

  await fetch(chrome.runtime.getURL('/index.html'))
    .then(response => response.text())
    .then(data => {
      const tempVar = document.createElement('div');
      const mainContainer = document.querySelector('#MainContainer');
      console.log(mainContainer);
      tempVar.className = "chatbox-parent";
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
    newBubble.innerHTML = `<div class="bubbleWrapper">\n      <div class="inlineContainer own">\n        <img class="inlineIcon" src="https://i.imgur.com/r3TyRAR.png">\n        <div class="ownBubble own">\n          ${chatText}\n        </div>\n      </div><span class="own">${getTime()}</span>\n    </div>`;
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
  const chatWrapperElement = document.getElementById('chatWrapper');
  chatWrapperElement.style.visibility = 'hidden';
  showChatButton.addEventListener('click', (event) => {
    console.log("hit");
    console.log(chatWrapperElement.style.visibility);
    if (chatWrapperElement.style.visibility === 'visible')
      chatWrapperElement.style.visibility = 'hidden';
    else if (chatWrapperElement.style.visibility === 'hidden')
      chatWrapperElement.style.visibility = 'visible';
  })
};