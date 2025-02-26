import axios from 'axios';
import { debug } from 'console';
import * as dotenv from 'dotenv';
import path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', 'src', '.env') });

const API_KEY = 'GET YOUR OWN KEY';
const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
console.log(API_ENDPOINT);

// Define the expected structure of the response from OpenRouter.ai
export interface OpenRouterResponse {
  choices: { message: { role: string; content: string } }[];
}

/**
 * Sends a prompt to the OpenRouter.ai API and returns the response message.
 * @param prompt The text prompt to send.
 */
export async function sendOpenRouterRequest(prompt: string): Promise<string | null> {
  try {
    const data = {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7
    };

    const response = await axios.post(API_ENDPOINT!, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      }
    });
    
    const message = response.data.choices[0].message.content;
    console.log("OpenRouter.ai response:", message);
    return message;
  } catch (error) {
    console.error("Error calling OpenRouter.ai API:", error);
    return null;
  }
}
