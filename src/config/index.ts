import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface IConfig {
  geminiApiKey: string;
}

const config: IConfig = {
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};

// Validate that the API key is present
if (!config.geminiApiKey) {
  throw new Error('GEMINI_API_KEY is not defined in the environment variables. Please create a .env file and add it.');
}

export default config;