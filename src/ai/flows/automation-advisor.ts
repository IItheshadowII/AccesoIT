// src/ai/flows/automation-advisor.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing tailored automation and bot plan recommendations based on user-provided business requirements and goals, in the specified language.
 *
 * - automationAdvisor - A function that takes user input (including language) and returns automation and bot plan recommendations.
 * - AutomationAdvisorInput - The input type for the automationAdvisor function.
 * - AutomationAdvisorOutput - The return type for the automationAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
// Removed import for getGoogleApiKey as it's no longer fetched from Firestore
// Removed import for genkitGoogleAIPlugin as direct instantiation is no longer primary path

const AutomationAdvisorInputSchema = z.object({
  businessRequirements: z
    .string()
    .describe(
      'A detailed description of the user’s business requirements and goals for automation.'
    ),
  language: z.string().describe('The language for the response, e.g., "en" or "es".')
});
export type AutomationAdvisorInput = z.infer<typeof AutomationAdvisorInputSchema>;

const AutomationAdvisorOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('A tailored recommendation for automation and bot plans.'),
  reasoning: z.string().describe('The AI’s reasoning for the recommendation.'),
});
export type AutomationAdvisorOutput = z.infer<typeof AutomationAdvisorOutputSchema>;

export async function automationAdvisor(input: AutomationAdvisorInput): Promise<AutomationAdvisorOutput> {
  return automationAdvisorFlow(input);
}

// This prompt object uses the globally configured Genkit `ai` object, 
// which relies on the GOOGLE_API_KEY environment variable.
const basePrompt = ai.definePrompt({
  name: 'automationAdvisorBasePrompt',
  input: {schema: AutomationAdvisorInputSchema},
  output: {schema: AutomationAdvisorOutputSchema},
  prompt: `You are an AI-powered automation advisor. Analyze the business requirements and goals provided by the user and recommend tailored automation and bot plans. Explain your reasoning for the recommendation.

IMPORTANT: Respond in the following language: {{{language}}}. If the language is 'es', respond in Spanish. If the language is 'en', respond in English.

Business Requirements and Goals: {{{businessRequirements}}}

Your response MUST be a JSON object with two keys: "recommendation" (string) and "reasoning" (string).
Do not include any explanatory text or markdown formatting like \`\`\`json before or after the JSON object.
Example JSON response format:
{
  "recommendation": "Based on your needs, we recommend Plan A because...",
  "reasoning": "Plan A is suitable due to X, Y, and Z. It addresses your core requirement of..."
}

JSON response:`,
});

const automationAdvisorFlow = ai.defineFlow(
  {
    name: 'automationAdvisorFlow',
    inputSchema: AutomationAdvisorInputSchema,
    outputSchema: AutomationAdvisorOutputSchema,
  },
  async (input: AutomationAdvisorInput): Promise<AutomationAdvisorOutput> => {
    console.log('Automation Advisor Flow: Attempting to use GOOGLE_API_KEY from environment.');
    try {
        const { output } = await basePrompt(input); // This prompt uses the globally configured ai object
        if (!output) {
          console.error(`AI prompt for automationAdvisorFlow (using environment key) did not return a valid output.`);
          throw new Error(`The AI failed to generate a recommendation (using environment key).`);
        }
        console.log(`Automation Advisor Flow: Successfully used API Key from environment.`);
        return output;
    } catch (error: any) {
        console.error(`Automation Advisor Flow: Error using Google AI with environment key:`, error.message);
        let errorMessage = 'Failed to get AI recommendation. Ensure your GOOGLE_API_KEY environment variable is set correctly, has permissions for "Generative Language API", and that the model (e.g., gemini-1.5-flash-latest) is available for your key.';
        if (error.message && (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID"))) {
            errorMessage = 'CRITICAL: The GOOGLE_API_KEY environment variable is invalid or not working. Please check your .env.local file or server environment configuration and ensure the key has permissions for "Generative Language API".';
        } else if (error.message) {
            errorMessage = `Failed to get AI recommendation using environment key. Error: ${error.message}`;
        }
        // This error will be caught by the calling component (AutomationAdvisorForm)
        throw new Error(errorMessage);
    }
  }
);
