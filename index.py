import os
import openai
import json
import time
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


class ChatAssistant:
    def __init__(self):
        self.chats = [
            {"role": "system",
                "content": "you are a helpful assistant that can make API calls"},
            {"role": "assistant", "content": "How may I help you"},
        ]

    def promptToHTTPVerb(self, prompt):
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=[
                {"role": "system", "content": "Only respond with the following HTTP methods: get, post, put, or delete based on the user response"},
                {"role": "user", "content": prompt}
            ],
            functions=[
                {
                    "name": "extractHttpMethod",
                    "description": "Only return get, post, put, or delete",
                    "parameters": {
                        'title': 'HTTP Method Response',
                        'type': 'object',
                        'properties': {'method': {'title': 'method', 'type': 'string'}},
                        'required': ['method']
                    }
                }
            ],
            function_call={"name": "extractHttpMethod"}
        ).choices[0]["message"]["function_call"]["arguments"]
        return eval(response)["method"]

    def check_user_confirmation(self, prompt):
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=[
                {"role": "assistant", "content": '''Only respond with 'true' or 'false' given a user message.
                If the user response is 'nope', then respond 'false'. If the user response is 'no', then respond 'false'.'''},
                {"role": "user", "content": prompt}
            ],
            functions=[
                {
                    "name": "trueOrFalse",
                    "description": "Return 'true' if the response is positive or affirmative, return 'false' if the response is not positive or affirmative",
                    "parameters": {
                        'title': 'true/false response',
                        'type': 'object',
                        'properties': {'boolean': {'title': 'boolean', 'type': 'boolean'}},
                        'required': ['boolean']
                    }
                }
            ],
            function_call={"name": "trueOrFalse"}
        ).choices[0]["message"]["function_call"]["arguments"]
        return json.loads(response)['boolean']

    def ask_to_proceed(self, prompt):
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=[
                {"role": "assistant",
                    "content": "summarize the user response and ask them if they would like to proceed or continue in a friendly way"},
                {"role": "user", "content": prompt}
            ],
            functions=[
                {
                    "name": "summarize",
                    "description": "Summarize the user response and ask if they would like to proceed or continue",
                    "parameters": {
                        'title': 'AI response',
                        'type': 'object',
                        'properties': {'summary': {'title': 'summary', 'type': 'string'}},
                        'required': ['summary']
                    }
                }
            ],
            function_call={"name": "summarize"}
        ).choices[0]["message"]["function_call"]["arguments"]
        return json.loads(response)["summary"]

    def generate_variant(self, prompt):
        respoonse = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=[
                {"role": "assistant",
                    "content": "generate a variation of the users response by rephrasing the response"},
                {"role": "user", "content": prompt}
            ],
            functions=[
                {
                    "name": "variations",
                    "description": "generate a frienly variation of the users response",
                    "parameters": {
                        'title': 'variation of response',
                        'type': 'object',
                        'properties': {'variation': {'title': 'variation', 'type': 'string'}},
                        'required': ['variation']
                    }
                }
            ],
            function_call={"name": "variations"}
        ).choices[0]["message"]["function_call"]["arguments"]
        return json.loads(respoonse)["variation"]

    def prompt_user(self, prompt="user input: "):
        response = "Hey there, I would like to change John Snow's last name to John Doe"
        if prompt != None:
            response = input(prompt)
        self.chats.append({"role": "user", "content": response})
        return response

    def generate_params(self, prompt):
        return {"results": "test"}

    def update_emp_name(self, params):
        time.sleep(1)
        return {"results": "test"}

    def summarize_response(self, initial_prompt, response):
        completion = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"write a verbose, cute and very friendly summary for the following prompt and response: '{initial_prompt}' and the results '{json.dumps(response)}' that were used to send an API call, also analyze the results compared to the prompt, if there are no fields that say success then the api call failed, no inside baseball",
            max_tokens=100,
            stop=None,
            temperature=0.2,
            n=1
        )
        return completion.choices[0].text.strip()

    def field_to_update(self, prompt):
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=[
                {"role": "assistant",
                    "content": "User the users response and extract only one pythonic field name that the user would like to change "},
                {"role": "user", "content": prompt}
            ],
            functions=[
                {
                    "name": "field_extractor",
                    "description": "extract the most lifely pythonic field name that the user would like to modify",
                    "parameters": {
                        'title': 'user field snake case',
                        'type': 'object',
                        'properties': {'field': {'title': 'field', 'type': 'string'}},
                        'required': ['field']
                    }
                }
            ],
            function_call={"name": "field_extractor"}
        ).choices[0]["message"]["function_call"]["arguments"]
        return json.loads(response)["field"]

    def api_picker(self, field):
        field = field.lower()
        if field == "last_name":
            return self.update_emp_name

    def post(self):
        print('Post route')

    def put(self):
        print('Put method')
        initial_prompt = self.chats[-1]["content"]
        print(initial_prompt)
        response = self.ask_to_proceed(initial_prompt)
        print('Response: ' + response)
        self.chats.append({"role": "assistant", "content": response})
        # print(self.chats[-1])
        prompt = self.prompt_user(prompt=f"{response} ")
        proceed = self.check_user_confirmation(prompt)
        print("Proceed: " + str(proceed))
        if proceed:
            print("begin steps to call api...")
            params = self.generate_params(initial_prompt)
            # this routes the context of the initial prompt to a specific API
            field = self.field_to_update(initial_prompt)
            print("Updating: " + field)
            api = self.api_picker(field)
            if api is None:
                print(f"updating {field}: not implemented")
                return
            print("Calling api: " + api.__name__)
            response = api(params)
            summary_response = self.summarize_response(
                initial_prompt, response)
            variant_statement = self.generate_variant(
                "I have attemted the make the changes you requested, here are the results:")
            # variant_statement = "I have made the changes you requested. Here is a summary of the results:"
            self.chats.append(
                {"role": "assistant", "content": variant_statement})
            self.chats.append(
                {"role": "assistant", "content": summary_response})
            # response, _ = self.chat()
            print("\n")
            for chat in self.chats:
                print(chat)
            print('\n\n\resetting chat thread')
            self.reset()
        else:
            print("Resetting chat thread")
            self.reset()

    def chat(self):
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=self.chats
        )
        response = completion.choices[0].message.content
        self.chats.append({"role": "assistant", "content": response})
        return response, self.chats

    def reset(self):
        self.chats = self.chats[:2]

    def run(self):
        prompt = self.prompt_user(prompt=None)
        method = self.promptToHTTPVerb(prompt).upper()
        print("Prompt: " + prompt)
        print("Method: " + method)

        if method == 'GET':
            print('Not implemented')
        elif method == 'POST':
            self.post()
        elif method == 'PUT':
            self.put()
        elif method == 'DELETE':
            print('Not implemented')
        else:
            print('Not implemented')


if __name__ == "__main__":
    assistant = ChatAssistant()
    assistant.run()
