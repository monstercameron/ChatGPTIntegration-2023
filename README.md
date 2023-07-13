# Chat Assistant Project

This project is a chat assistant that can make API calls based on user prompts and provide responses. It is built using JavaScript and the OpenAI GPT-3.5 model.

## Getting Started

To use this chat assistant, you need to have an OpenAI API key. Replace the `OPENAI_API_KEY` variable in the code with your own API key.

## Usage

The chat assistant is designed to interact with the user through a chat interface. It listens for user input and responds accordingly. Here's how it works:

1. When the page loads, the `onload` function is triggered, and the chat assistant and UI are initialized.
2. The chat assistant prompts the user with a system message and an initial assistant message.
3. The user can enter their input in the chat interface. Pressing Enter sends the user's message to the chat assistant.
4. The chat assistant processes the user's input and generates a response.
5. The response is displayed in the chat interface, with a timestamp indicating the time of the response.
6. The process continues with the user entering more messages and receiving responses.

The chat assistant supports the following HTTP methods: GET, POST, PUT, and DELETE. It can handle different user prompts and make API calls accordingly.

## UI Class

The UI class handles the chat interface and user interactions. It has the following methods:

- `init()`: Initializes the chat interface and sets up event listeners for user input.
- `getTime()`: Returns the current time in the format "HH:MM".
- `addUserChat(value)`: Adds a user's chat bubble to the chat interface.
- `addUserChatBubble(chatText)`: Creates and appends a user's chat bubble element to the chat interface.
- `scrollToBottom()`: Scrolls the chat interface to the bottom.
- `addResponseChatBubble(chatText)`: Creates and appends a response chat bubble element to the chat interface.
- `clearChat()`: Clears the chat interface.

## ChatAssistant Class

The ChatAssistant class handles the chat logic and API calls. It has the following methods:

- `init()`: Initializes the chat assistant and extracts employee details from the page.
- `promptToHTTPVerb(prompt)`: Prompts the user for an HTTP method and returns the chosen method.
- `checkUserConfirmation(prompt)`: Prompts the user for confirmation and returns a boolean value indicating the response.
- `askToProceed(prompt)`: Summarizes the user response and asks for confirmation to proceed.
- `generateVariant(prompt)`: Generates a variation of the user's response.
- `promptUser()`: Prompts the user for input and returns the entered value.
- `promptUserOld(prompt)`: Prompts the user for input using a previous method (not currently used).
- `updateEmpName(params)`: Updates the employee name on the page with the provided parameters.
- `generateParams(prompt)`: Generates parameters based on the user's response.
- `summarizeResponse(initialPrompt, response)`: Summarizes the prompt and response in a friendly manner.
- `extractDetails(details)`: Extracts key details from the user input.
- `fieldToUpdate(prompt)`: Extracts the field name the user wants to modify.
- `apiPicker(field)`: Picks the appropriate API method based on the field to update.
- `post()`: Handles the POST method (not currently implemented).
- `put()`: Handles the PUT method.
- `chatCompletionFetch(params)`: Sends a completion request to the OpenAI API for chat-based models.
- `completionFetch(params)`: Sends a completion request to the OpenAI API.
- `reset()`: Resets the chat thread and clears the chat interface.
- `run()`: Runs the chat assistant based on user input.

## Example Usage

Here's an example of how to use the chat assistant:

```javascript
const chatAssistant = new ChatAssistant();
const ui = new UI(chatAssistant);
await ui.init();
```

Make sure to replace the `OPENAI_API_KEY` variable with your actual API key.

## License

This project is licensed under the [MIT License](LICENSE).