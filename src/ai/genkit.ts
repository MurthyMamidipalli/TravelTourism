import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  // Using the preferred model factory for Genkit v1.x
  model: googleAI.model('gemini-2.5-flash'),
});
