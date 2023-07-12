# UKG Hackathon Chat Assistant

Welcome to the UKG Hackathon Chat Assistant! This friendly and helpful assistant is designed to assist you in making API calls. It's a 48-hour hackathon, so let's have some fun while coding!

## About the Chat Assistant

This Chat Assistant is built using Python and leverages the power of OpenAI's GPT-3.5 language model. It provides various capabilities to interact with users, extract information, generate variations, and summarize responses.

## Usage

To use the Chat Assistant, follow these steps:

1. Make sure you have the required dependencies installed. You can install them by running `pip install -r requirements.txt`.

2. Set up your OpenAI API key. Create a file named `.env` and add your API key using the following format:

   ```plaintext
   OPENAI_API_KEY=<your_api_key>
   ```

3. Run the Python code. Execute the script to start the Chat Assistant.

   ```bash
   python index.py
   ```

4. The Chat Assistant will prompt you for user input. Feel free to provide any relevant information or make API calls.

5. Enjoy a friendly conversation with the Chat Assistant and see the results!

## Features

The Chat Assistant comes with the following features:

### Extract HTTP Method

The assistant can extract the HTTP method (GET, POST, PUT, DELETE) from a user prompt. It ensures that you only respond with the appropriate HTTP method.

### User Confirmation Check

The assistant can check user confirmation by evaluating their response. You can respond with either "true" or "false" based on a positive or negative confirmation. The assistant understands variations like "nope" and "no" and responds accordingly.

### Proceed Confirmation

The assistant can rephrase the user's response and ask if they would like to proceed or continue. It provides a friendly and engaging way to prompt users for further action.

### Generate Variations

The assistant can generate variations of the user's response by rephrasing it. This feature adds fun and creativity to the conversation.

### Field Extraction

The assistant can extract a Pythonic field name that the user wants to modify. It identifies the most likely field from the user's response.

### API Call

The assistant handles API calls by routing the context to a specific API based on the field name. It executes the appropriate API function to update the specified field.

### Summary Generation

After making the API call, the assistant generates a verbose, cute, and friendly summary of the prompt and response. It analyzes the results compared to the initial prompt and indicates success or failure.

## Example Usage

Here's an example of how you can interact with the Chat Assistant:

```plaintext
Prompt: Hey there, I would like to change John Snow's last name to John Doe
Method: PUT
Put method
Hey there, I would like to change John Snow's last name to John Doe
Response: You would like to change John Snow's last name to John Doe. Would you like to proceed with this change?
You would like to change John Snow's last name to John Doe. Would you like to proceed with this change? yes
Proceed: True
begin steps to call api...
Updating: last_name
Calling api: update_emp_name


{'role': 'system', 'content': 'you are a helpful assistant that can make API calls'}
{'role': 'assistant', 'content': 'How may I help you'}
{'role': 'user', 'content': "Hey there, I would like to change John Snow's last name to John Doe"}
{'role': 'assistant', 'content': "You would like to change John Snow's last name to John Doe. Would you like to proceed with this change?"}
{'role': 'user', 'content': 'yes'}
{'role': 'assistant', 'content': 'I have tried to implement the changes you requested, and here are the outcomes:'}
{'role': 'assistant', 'content': 'Hey there! We attempted to change John Snow\'s last name to John Doe by sending an API call, and we received the results \'{"results": "test"}\'. Unfortunately, since there were no fields that indicated success, it appears that the API call failed. We apologize for any inconvenience this may have caused.'}


Resetting chat thread
```

## Have Fun!

Feel free to explore and experiment with the Chat Assistant during the hackathon. Enjoy coding, and don't hesitate to ask the Chat Assistant for help or assistance. Good luck with your project and have a fantastic time at the UKG Hackathon!