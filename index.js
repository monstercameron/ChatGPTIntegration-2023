// import axios
import axios from 'axios';

class AIAssistant {
    constructor() {
        this.openaiApiKey = 'YOUR_OPENAI_API_KEY'; // replace with your actual key
        this.baseURL = 'https://api.openai.com/v1/chat/completions/';
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiApiKey}`
        };
        this.chats = [
            {"role": "system", "content": "you are a helpful assistant that can make API calls"},
            {"role": "assistant", "content": "How may I help you"},
        ];
    }

    // Method to post a request to OpenAI API
    async postToOpenAI(data) {
        try {
            const response = await axios.post(this.baseURL, data, { headers: this.headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    // ... (other methods will be written here)

}

export default AIAssistant;
