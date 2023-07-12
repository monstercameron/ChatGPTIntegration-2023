const fetch = require('node-fetch');
const dotenv = require('dotenv');
const util = require('util');

dotenv.config();

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
                    role: 'assistant',
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

    promptUser(prompt = 'user input: ') {
        // const readline = require('readline').createInterface({
        //     input: process.stdin,
        //     output: process.stdout
        // });
    
        return new Promise((resolve) => {
            console.log(prompt,"Change Jon Snow's last name to Ramsey")
            resolve("Change Jon Snow's last name to Ramsey")

        });
    }

    async updateEmpName(params) {
        //await util.promisify(setTimeout)(1000);
        //return { results: 'test' };
        document.getElementById("ctl00_Content_FormView1_Label2").innerText = params.updated;
        document.getElementById("header-title-0").innerText = params.updated;
        document.getElementById("ctl00_Content_FormView1_lblName").innerText = params.updated;
    }

    async generateParams(prompt) {
        const response = await chatCompletionFetch({
          model: 'gpt-3.5-turbo-0613',
          messages: [
            { role: 'system', content: "Based on the user's response, respond with the value of the subject and the new value the user would like to change the subject to" },
            { role: 'user', content: prompt }
          ],
          functions: [
            {
              name: 'original_name_new_name',
              description: "Based on the user's response, respond with the value of the subject and the new value the user would like to change the subject to",
              parameters: {
                title: 'original name and updated name',
                type: 'object',
                properties: {
                  original: { title: 'field', type: 'string' },
                  updated: { title: 'field', type: 'string' }
                },
                required: ['original', 'updated']
              }
            }
          ],
          function_call: { name: 'original_name_new_name' }
        });
        return JSON.parse(response);
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
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
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
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(params)
        });

        return response.json();
    }

    reset() {
        this.chats = this.chats.slice(0, 2);
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
}

const assistant = new ChatAssistant();
assistant.run();
