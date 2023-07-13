window.onload = async function () {

  const OPENAI_API_KEY = 'OOPS';
  class UI {
    constructor(chatAssistant) {
      this.chatAssistant = chatAssistant;
      this.chatAssistant.parent = this;
      this.eeid = 0;
      this.flag = 0;
      this.inWorkflow = false;
    }

    async init() {
      const urlSearch = window.location.search.toString();
      const arr = urlSearch.split("!");

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes('eeid')) {
          const split = arr[i].split("=");
          this.eeid = split[1];
          this.flag = 1;
          break;
        }
      }

      if (this.flag === 0) return;

      const element = document
        .getElementById('ContentFrame')
        .contentWindow.document.getElementById('ctl00_thingsICanDoMainDiv');

      await fetch(chrome.runtime.getURL('/index.html'))
        .then(response => response.text())
        .then(data => {
          const tempVar = document.createElement('div');
          const mainContainer = document.querySelector('#MainContainer');
          console.log(mainContainer);
          tempVar.className = "chatbox-parent";
          tempVar.innerHTML = data;
          mainContainer.appendChild(tempVar);
        })
        .catch(err => {
          console.error(err);
        });

      const inputElement = document.getElementById('textInput');
      console.log(inputElement);
      inputElement.addEventListener('keydown', async event => {
        if (event.key === 'Enter' && inputElement.value !== "") {
          if (!this.inWorkflow) {
            console.log("Workflow in progress", this.inWorkflow);
            this.chatAssistant.doWork(inputElement.value);
            inputElement.value = "";
          }
          console.log("Workflow in progress two!", this.inWorkflow);
          this.scrollToBottom();
        }
      });

      const showChatButton = document.getElementById('open-button');
      const chatWrapperElement = document.getElementById('chatWrapper');
      chatWrapperElement.style.visibility = 'hidden';
      showChatButton.addEventListener('click', event => {
        console.log(chatWrapperElement.style.visibility);
        if (chatWrapperElement.style.visibility === 'visible')
          chatWrapperElement.style.visibility = 'hidden';
        else if (chatWrapperElement.style.visibility === 'hidden')
          chatWrapperElement.style.visibility = 'visible';
      });
    }

    getTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    addUserChat(value) {
      this.addUserChatBubble(value);
    }

    addUserChatBubble(chatText) {
      const chatElement = document.getElementById('chatBox');
      const newBubble = document.createElement('div');
      newBubble.innerHTML = `<div class="bubbleWrapper">\n      <div class="inlineContainer own">\n        <img class="inlineIcon" src="https://i.imgur.com/r3TyRAR.png">\n        <div class="ownBubble own">\n          ${chatText}\n        </div>\n      </div><span class="own">${this.getTime()}</span>\n    </div>`;
      chatElement.appendChild(newBubble);
    }

    scrollToBottom() {
      const chatContainer = document.getElementById("chatWrapper");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    addResponseChatBubble(chatText) {
      const chatElement = document.getElementById('chatBox');
      const newBubble = document.createElement('div');
      newBubble.innerHTML = `<div class="bubbleWrapper">\n      <div class="inlineContainer">\n        <img class="inlineIcon" src="https://i.imgur.com/pdepBdX.png">\n        <div class="otherBubble other">\n          ${chatText}\n        </div>\n      </div><span class="other">${this.getTime()}</span>\n    </div>`;
      chatElement.appendChild(newBubble);
    }

    clearChat() {
      const chatElement = document.getElementById('chatBox');
      chatElement.innerHTML = '';
    }
  }


  class ChatAssistant {
    constructor() {
      this.chats = [
        { role: 'system', content: 'you are a helpful assistant that can make API calls' },
        { role: 'assistant', content: 'How may I help you' }
      ];
    }

    async promptToHTTPVerb(prompt) {
      const response = await this.chatCompletionFetch({
        model: 'gpt-3.5-turbo-0613',
        messages: [
          { role: 'system', content: 'Only respond with the following HTTP methods: get, post, put, or delete based on the user response' },
          { role: 'user', content: prompt }
        ],
        functions: [
          {
            name: 'extractHttpMethod',
            description: 'Only return get, post, put, or delete',
            parameters: {
              title: 'HTTP Method Response',
              type: 'object',
              properties: { method: { title: 'method', type: 'string' } },
              required: ['method']
            }
          }
        ],
        function_call: { name: 'extractHttpMethod' }
      });

      return JSON.parse(response.choices[0].message.function_call.arguments).method

    }

    async checkUserConfirmation(prompt) {
      const response = await this.chatCompletionFetch({
        model: 'gpt-3.5-turbo-0613',
        messages: [
          {
            role: 'system',
            content: `Only respond with 'true' or 'false' given a user message.
                    If the user response is 'nope', then respond 'false'. If the user response is 'no', then respond 'false'.`
          },
          { role: 'user', content: prompt }
        ],
        functions: [
          {
            name: 'trueOrFalse',
            description: "Return 'true' if the response is positive or affirmative, return 'false' if the response is not positive or affirmative",
            parameters: {
              title: 'true/false response',
              type: 'object',
              properties: { boolean: { title: 'boolean', type: 'boolean' } },
              required: ['boolean']
            }
          }
        ],
        function_call: { name: 'trueOrFalse' }
      });
      return JSON.parse(response.choices[0].message.function_call.arguments).boolean;
    }

    async askToProceed(prompt) {
      const response = await this.chatCompletionFetch({
        model: 'gpt-3.5-turbo-0613',
        messages: [
          {
            role: 'assistant',
            content: 'summarize the user response and ask them if they would like to proceed or continue in a friendly way'
          },
          { role: 'user', content: prompt }
        ],
        functions: [
          {
            name: 'summarize',
            description: 'Summarize the user response and ask if they would like to proceed or continue',
            parameters: {
              title: 'AI response',
              type: 'object',
              properties: { summary: { title: 'summary', type: 'string' } },
              required: ['summary']
            }
          }
        ],
        function_call: { name: 'summarize' }
      });
      return JSON.parse(response.choices[0].message.function_call.arguments).summary;
    }

    async generateVariant(prompt) {
      const response = await this.chatCompletionFetch({
        model: 'gpt-3.5-turbo-0613',
        messages: [
          { role: 'assistant', content: 'generate a variation of the users response by rephrasing the response' },
          { role: 'user', content: prompt }
        ],
        functions: [
          {
            name: 'variations',
            description: 'generate a frienly variation of the users response',
            parameters: {
              title: 'variation of response',
              type: 'object',
              properties: { variation: { title: 'variation', type: 'string' } },
              required: ['variation']
            }
          }
        ],
        function_call: { name: 'variations' }
      });
      return JSON.parse(response.choices[0].message.function_call.arguments).variation;
    }

    async promptUser() {
      return new Promise((resolve) => {
        const inputField = document.getElementById('textInput');

        inputField.addEventListener('keydown', async event => {
          // console.log("second e listner hit!", inputField.value);
          // console.log("second e listner hit!", event.key);
          if (event.key === 'Enter' && inputField.value !== "") {
            console.log("RESOLVING SECOND E");
            const returnValue = inputField.value;
            inputField.value = "";
            return resolve(returnValue);
          }

        });
    
        // inputField.addEventListener('change', () => {
        //   resolve(inputField.value);
        // });
      });
    }

    promptUserOld(prompt = 'user input: ') {
      // const readline = require('readline').createInterface({
      //     input: process.stdin,
      //     output: process.stdout
      // });

      return new Promise((resolve) => {
        console.log(prompt, "Change Jon Snow's last name to Ramsey")
        resolve("Change Jon Snow's last name to Ramsey")

      });
    }

    generateParams(prompt) {
      return { results: 'test' };
    }

    async updateEmpName(params) {
      await util.promisify(setTimeout)(1000);
      return { results: 'test' };
    }

    async summarizeResponse(initialPrompt, response) {
      const completion = await this.completionFetch({
        model: 'text-davinci-003',
        prompt: `write a verbose, cute and very friendly summary for the following prompt and response: '${initialPrompt}' and the results '${JSON.stringify(
          response
        )}' that were used to send an API call, also analyze the results compared to the prompt, if there are no fields that say success then the api call failed, no inside baseball`,
        max_tokens: 100,
        stop: null,
        temperature: 0.2,
        n: 1
      });
      return completion.choices[0].text.trim();
    }

    async extractDetails(details) {
      const response = await this.chatCompletionFetch({
        model: 'gpt-3.5-turbo-0613',
        messages: [
          {
            role: 'system',
            content: 'Extract key details from user input such as First name, Last name, Employee Number, Address'
          },
          { role: 'user', content: `This is the employee's detail page that is currently being looked at: ${JSON.stringify(details)}` }
        ],
        functions: [
          {
            name: 'employeeDetailExtraction',
            description: 'Extract all employee details from the user response',
            parameters: {
              title: 'Employee details',
              type: 'object',
              properties: { 
                Name: { title: 'field', type: 'string' },
                employeeNumber: { title: 'field', type: 'string' },
                Address: { title: 'field', type: 'string' },
             },
              required: ['key', 'value']
            }
          }
        ],
        function_call: { name: 'employeeDetailExtraction' }
      });
      return JSON.parse(response.choices[0].message.function_call.arguments).field;
    }

    async fieldToUpdate(prompt) {
      const response = await this.chatCompletionFetch({
        model: 'gpt-3.5-turbo-0613',
        messages: [
          {
            role: 'assistant',
            content: 'User the users response and extract only one pythonic field name that the user would like to change '
          },
          { role: 'user', content: prompt }
        ],
        functions: [
          {
            name: 'field_extractor',
            description: 'extract the most lifely pythonic field name that the user would like to modify',
            parameters: {
              title: 'user field snake case',
              type: 'object',
              properties: { field: { title: 'field', type: 'string' } },
              required: ['field']
            }
          }
        ],
        function_call: { name: 'field_extractor' }
      });
      return JSON.parse(response.choices[0].message.function_call.arguments).field;
    }

    apiPicker(field) {
      field = field.toLowerCase();
      if (field === 'last_name') {
        return this.updateEmpName;
      }
      return null;
    }

    post() {
      console.log('Post route');
    }

    async put() {
      console.log('Put method');
      const initialPrompt = this.chats[this.chats.length - 1].content;
      console.log(initialPrompt);
      const response = await this.askToProceed(initialPrompt);
      console.log('Response: ' + response);
      this.chats.push({ role: 'assistant', content: response });
      const prompt = await this.promptUser(`${response} `);
      console.log("User Prompt", prompt);
      const proceed = await this.checkUserConfirmation(prompt);
      console.log('Proceed: ' + proceed);

      if (proceed) {
        console.log('begin steps to call api...');
        const params = this.generateParams(initialPrompt);
        const field = await this.fieldToUpdate(initialPrompt);
        console.log('Updating: ' + field);
        const api = this.apiPicker(field);

        if (api === null) {
          console.log(`updating ${field}: not implemented`);
          return;
        }

        console.log('Calling api: ' + api.name);
        const response = await api(params);
        const summaryResponse = await this.summarizeResponse(initialPrompt, response);
        const variantStatement = await this.generateVariant(
          "I have attemted the make the changes you requested, here are the results:"
        );

        this.chats.push({ role: 'assistant', content: variantStatement });
        this.chats.push({ role: 'assistant', content: summaryResponse });

        console.log('\n');
        this.chats.forEach((chat) => console.log(chat));
        console.log('\n\nresetting chat thread');
        this.reset();
      } else {
        console.log('Resetting chat thread');
        this.reset();
      }
    }

    async chat(initialPrompt) {
      const response = await this.chatCompletionFetch({
        model: 'gpt-3.5-turbo-0613',
        messages: this.chats,
      });
      const chatResponse = response.choices[0].message.content;
      this.addChat('assistant', chatResponse);
    }

    async putV2() {
      console.log("In put method :D");
      const initialPrompt = this.chats[this.chats.length - 1].content;
      const response = await this.askToProceed(initialPrompt);
      console.log('Response: ' + response);
      this.addChat('assistant', response);
      const prompt = await this.promptUser();
      console.log("Escaped the second e listen");
      const proceed = await this.checkUserConfirmation(prompt);
      console.log('Proceed: ' + proceed);

      if (proceed) {
        console.log('begin steps to call api...');
        const params = this.generateParams(initialPrompt);
        const field = await this.fieldToUpdate(initialPrompt);
        console.log('Updating: ' + field);
        const api = this.apiPicker(field);

        if (api === null) {
          console.log(`updating ${field}: not implemented`);
          return;
        }

        console.log('Calling api: ' + api.name);
        const response = await api(params);
        const summaryResponse = await this.summarizeResponse(initialPrompt, response);
        const variantStatement = await this.generateVariant(
          "I have attemted the make the changes you requested, here are the results:"
        );

        this.chats.push({ role: 'assistant', content: variantStatement });
        this.chats.push({ role: 'assistant', content: summaryResponse });

        console.log('\n');
        this.chats.forEach((chat) => console.log(chat));
        console.log('\n\nresetting chat thread');
        this.reset();
      } else {
        console.log('Resetting chat thread');
        this.reset();
      }

    }

    async chatCompletionFetch(params) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(params)
      });

      return response.json();
    }

    async completionFetch(params) {
      const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(params)
      });

      return response.json();
    }

    reset() {
      this.chats = this.chats.slice(0, 2);
      this.parent.clearChat();
    }

    async run() {
      const prompt = await this.promptUser();
      const method = (await this.promptToHTTPVerb(prompt)).toUpperCase();
      console.log('Prompt: ' + prompt);
      console.log('Method: ' + method);

      if (method === 'GET') {
        console.log('Not implemented');
      } else if (method === 'POST') {
        this.post();
      } else if (method === 'PUT') {
        this.put();
      } else if (method === 'DELETE') {
        console.log('Not implemented');
      } else {
        console.log('Not implemented');
      }
    }

    addChat(role, content) {
      this.chats.push({ role, content });
      if (role === 'user')
        this.parent.addUserChatBubble(content);
      else
        this.parent.addResponseChatBubble(content);
    }

    async doWork(initialPrompt) {
      const eSummaryPage = document.getElementById('ContentFrame').contentWindow.document.getElementById('FormView1').innerHTML;
      this.extractDetails(eSummaryPage);
      this.parent.inWorkflow = true;
      console.log("User Prompt", initialPrompt);
      this.addChat("user", initialPrompt);
      const method = (await this.promptToHTTPVerb(initialPrompt)).toUpperCase();
      console.log("Method", method);
      switch (method) {
        case 'GET':
          console.log('Not implemented');
          break;
        case 'POST':
          this.post();
          break;
        case 'PUT':
          await this.putV2();
          break;
        case 'DELETE':
          console.log('Not implemented');
          break;
        default:
          console.log('Default');
          await this.chat(initialPrompt);
          break;
      }
      this.parent.inWorkflow = false;


    }
  }

  const chatAssistant = new ChatAssistant();
  const ui = new UI(chatAssistant);
  await ui.init();

};