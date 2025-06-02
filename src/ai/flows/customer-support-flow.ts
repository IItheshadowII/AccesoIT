
'use server';
/**
 * @fileOverview A customer support AI agent for AccesoIT.
 *
 * - chatWithAccesoBot - A function that handles the chat interaction.
 * - ChatWithAccesoBotInput - The input type for the chatWithAccesoBot function.
 * - ChatWithAccesoBotOutput - The return type for the chatWithAccesoBot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { MessageData } from 'genkit';
import { findProductByName } from '@/app/[lang]/admin/products/actions';
import { isFirebaseInitialized, firebaseCriticalError } from '@/lib/firebase'; // Import Firebase status

// Tool to schedule demos (stubbed)
const scheduleGoogleCalendarDemoTool = ai.defineTool(
  {
    name: 'scheduleGoogleCalendarDemo',
    description: 'Schedules a product demo in Google Calendar. Asks for preferred date, time, user name, and email if not provided. Date and time must be in ISO 8601 format.',
    inputSchema: z.object({
      dateTime: z.string().describe("The preferred date and time for the demo in ISO 8601 format (e.g., '2024-07-15T14:00:00Z'). If the user provides a relative time like 'tomorrow at 4 PM', you MUST ask for their timezone to convert it accurately to ISO 8601 UTC."),
      userName: z.string().describe("The user's full name."),
      userEmail: z.string().email().describe("The user's email address."),
    }),
    outputSchema: z.string().describe("A confirmation message including the scheduled time or an error/clarification message if inputs are still missing or unclear. This output is for AccesoBot's internal use to formulate its final response to the user."),
  },
  async (input) => {
    console.log('Attempting to schedule demo:', input);
    // This response is internal to the AI, it uses this to formulate its own message to the user.
    return `Demo scheduling for ${input.userName} (${input.userEmail}) on ${new Date(input.dateTime).toLocaleString()} acknowledged. A human colleague will confirm. Ensure to inform the user in their language.`;
  }
);

const getProductPriceTool = ai.defineTool(
  {
    name: 'getProductPrice',
    description: 'Provides the price and description for a specific AccesoIT product or service by looking it up in the product database. Asks for the product name if not provided.',
    inputSchema: z.object({
      productName: z.string().describe('The name of the product or service to get the price for (e.g., "Basic Bot Plan", "Pro Bot Plan").'),
    }),
    outputSchema: z.string().describe("The price and description of the product, a 'product not found' message, a 'database unavailable' message, or a request for clarification. This output is for AccesoBot's internal use to formulate its final response to the user."),
  },
  async (input) => {
    if (!isFirebaseInitialized) {
      const detailMessage = firebaseCriticalError ? `Details: ${firebaseCriticalError}` : "The product database is temporarily inaccessible.";
      return `Product database access error: ${detailMessage}. Inform the user politely in their language that product information is currently unavailable.`;
    }
    console.log('Fetching price for product from Firestore:', input.productName);
    const productResult = await findProductByName(input.productName);

    if (productResult && 'id' in productResult) {
      const product = productResult;
      let response = `Product: ${product.name}, Price: ${product.price}.`;
      if (product.description) {
        response += ` Description: ${product.description}`;
      }
      return response;
    } else if (productResult && 'error' in productResult) {
        console.error("Error from findProductByName:", productResult.error);
        if (productResult.error.includes("Firebase is not configured correctly")) {
             return "Product database access error: Firebase not configured. Inform user politely in their language.";
        }
        return `Product lookup error for "${input.productName}": ${productResult.error}. Ask for clarification or available products in user's language.`;
    } else {
        return `Product "${input.productName}" not found. Ask for clarification or available products in user's language.`;
    }
  }
);

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({ text: z.string() })),
});

export type ChatWithAccesoBotInput = z.infer<typeof ChatWithAccesoBotInputSchema>;
const ChatWithAccesoBotInputSchema = z.object({
  userMessage: z.string().describe('The latest message from the user.'),
  language: z.string().min(2).max(2).describe('The language for the response, e.g., "en" or "es".'),
  chatHistory: z.array(ChatMessageSchema).optional().describe('The history of the conversation so far. This is for the prompt template if needed, but Genkit also handles history natively.'),
});


export type ChatWithAccesoBotOutput = z.infer<typeof ChatWithAccesoBotOutputSchema>;
const ChatWithAccesoBotOutputSchema = z.object({
  aiResponse: z.string().describe('The AI\'s response to the user.'),
});


export async function chatWithAccesoBot(input: ChatWithAccesoBotInput): Promise<ChatWithAccesoBotOutput> {
  return customerSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerSupportPrompt',
  input: { schema: ChatWithAccesoBotInputSchema },
  output: { schema: ChatWithAccesoBotOutputSchema },
  tools: [scheduleGoogleCalendarDemoTool, getProductPriceTool],
  prompt: `You are AccesoBot, a friendly and helpful AI customer support assistant for AccesoIT, a company based in Argentina that specializes in IT solutions and AI automation.
Your primary goal is to assist users by answering their questions, helping them schedule product demos, and providing pricing information for products and services, using the available tools when appropriate.

🌎 REGIONAL CONTEXT:
• AccesoIT is based in Argentina (timezone America/Argentina/Buenos_Aires).  
• Any time you reference or schedule events, default to this timezone unless the user specifies otherwise.

🗣️ LANGUAGE DETECTION:
• Detect the language of the user interface or website.  
• If it’s in English, ALL your messages—including follow-up questions and summaries—MUST be in English.  
• If it’s in Spanish, ALL your messages must be in Spanish.  
• This rule is absolute: do not mix languages in a single response.

⚠️ CRITICAL LANGUAGE REQUIREMENT:
EVERYTHING you say to the user, including direct answers, questions to gather more info for tools, and summaries of tool actions, MUST be in the language determined by the interface ({{{language}}}). This is non-negotiable.

🛠️ TOOL USAGE PROTOCOL:
1. Understand the user’s request. If it matches a tool’s capability, prepare to call that tool.  
2. If a tool (e.g., getProductPrice or scheduleGoogleCalendarDemo) requires parameters the user hasn’t provided, ASK for exactly what’s missing—in the correct language.  
   • Date/time must be in ISO 8601; if the user says “mañana a las 10,” ask “¿En qué zona horaria?” (en español) or “What timezone are you in?” (in English).  
3. When the tool returns data, DO NOT paste its raw output. Instead, interpret and rephrase everything naturally—and in the proper language—before replying to the user.

📋 EXAMPLE FLOW:
User (web in Spanish): “Quiero agendar demo mañana a las 10.”  
AccesoBot (in Spanish): “¿Tu zona horaria sigue siendo America/Argentina/Buenos_Aires?”  
⇨ call scheduleGoogleCalendarDemo(...)  
AccesoBot (in Spanish): “¡Listo! Tu demo quedó agendada para el 30 de mayo a las 10:00 (GMT-3).”

AccesoBot’s response (STRICTLY in {{{language}}}, following all protocols above):`,
});

const customerSupportFlow = ai.defineFlow(
  {
    name: 'customerSupportFlow',
    inputSchema: ChatWithAccesoBotInputSchema,
    outputSchema: ChatWithAccesoBotOutputSchema,
  },
  async (input) => {
    const history: MessageData[] = input.chatHistory ? input.chatHistory.map(msg => ({
        role: msg.role,
        content: msg.parts.map(part => ({text: part.text}))
      })) : [];

    const { stream, response } = ai.generateStream({
        prompt: input.userMessage,
        history,
        model: 'googleai/gemini-1.5-flash-latest',
        customPrompt: prompt,
        promptVariables: { language: input.language, userMessage: input.userMessage },
        tools: [scheduleGoogleCalendarDemoTool, getProductPriceTool],
        config: {
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
        },
    });

    let fullResponseText = "";
    for await (const chunk of stream) {
        if (chunk.text) {
            fullResponseText += chunk.text;
        }
    }

    const finalResponse = await response;

    // Prefer output from the schema if available
    if (finalResponse.output?.aiResponse) {
        return { aiResponse: finalResponse.output.aiResponse };
    }

    // Otherwise, use the text response
    const responseText = finalResponse.text ?? fullResponseText;

    if (!responseText && finalResponse.toolRequests?.length > 0) {
      // If the bot is about to use a tool, it might not have text yet.
      // We can provide a generic placeholder or let the next turn handle it.
      // For now, let's try to encourage a text response or indicate tool use.
      // This case should ideally be handled by the LLM generating some text before a tool_code part.
      return { aiResponse: "AccesoBot está procesando tu solicitud..." }; // Generic message in the target language
    }

    return { aiResponse: responseText || "Lo siento, no pude procesar esa solicitud. Por favor, inténtalo de nuevo." };
  }
);

