
// src/server/handlers/aiHandlers.ts
import type { Request, Response } from 'express';
import { automationAdvisor, type AutomationAdvisorInput, type AutomationAdvisorOutput } from '@/ai/flows/automation-advisor';
import { chatWithAccesoBot, type ChatWithAccesoBotInput, type ChatWithAccesoBotOutput } from '@/ai/flows/customer-support-flow';
import { z } from 'zod';

// You might want to use the Zod schemas from the flows directly if they are exported
// For example, if AutomationAdvisorInputSchema is exported from the flow file:
// import { AutomationAdvisorInputSchema } from '@/ai/flows/automation-advisor';

// Example Zod schema for validation (can be more specific based on flow schemas)
const AutomationAdvisorRequestSchema = z.object({
  businessRequirements: z.string(),
  language: z.string().min(2).max(2),
});

const ChatWithAccesoBotRequestSchema = z.object({
  userMessage: z.string(),
  language: z.string().min(2).max(2),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() })),
  })).optional(),
});


export const handleAutomationAdvice = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input - ensure the schema matches AutomationAdvisorInput
    const validatedInput = AutomationAdvisorRequestSchema.parse(req.body);
    const input: AutomationAdvisorInput = validatedInput; // Cast if shapes match
    
    const output: AutomationAdvisorOutput = await automationAdvisor(input);
    res.status(200).json(output);
  } catch (error: any) {
    console.error('Error in handleAutomationAdvice:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.flatten() });
    } else {
      res.status(500).json({ error: error.message || 'Internal server error calling automationAdvisor' });
    }
  }
};

export const handleChatWithBot = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input - ensure the schema matches ChatWithAccesoBotInput
    const validatedInput = ChatWithAccesoBotRequestSchema.parse(req.body);
    const input: ChatWithAccesoBotInput = validatedInput; // Cast if shapes match
    
    const output: ChatWithAccesoBotOutput = await chatWithAccesoBot(input);
    res.status(200).json(output);
  } catch (error: any) {
    console.error('Error in handleChatWithBot:', error);
     if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.flatten() });
    } else {
      res.status(500).json({ error: error.message || 'Internal server error calling chatWithAccesoBot' });
    }
  }
};
