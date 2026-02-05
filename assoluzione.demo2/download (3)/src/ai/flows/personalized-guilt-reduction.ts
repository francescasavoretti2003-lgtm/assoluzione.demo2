'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting personalized actions to reduce environmental impact based on user confessions.
 *
 * - personalizedGuiltReduction - A function that takes user confessions and suggests personalized guilt reduction actions.
 * - PersonalizedGuiltReductionInput - The input type for the personalizedGuiltReduction function.
 * - PersonalizedGuiltReductionOutput - The return type for the personalizedGuiltReduction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedGuiltReductionInputSchema = z.object({
  confessionData: z.record(z.string(), z.any()).describe('A record of the user confessions, where keys are questions and values are user answers.'),
  language: z.enum(['en', 'it']).describe('The language of the user interface (en: English, it: Italian).'),
});
export type PersonalizedGuiltReductionInput = z.infer<typeof PersonalizedGuiltReductionInputSchema>;

const PersonalizedGuiltReductionOutputSchema = z.object({
  summary: z.string().describe('A summary of the user confessions and their biggest impact.'),
  suggestedActions: z.string().describe('Personalized actions to reduce the user environmental impact.'),
});
export type PersonalizedGuiltReductionOutput = z.infer<typeof PersonalizedGuiltReductionOutputSchema>;

export async function personalizedGuiltReduction(input: PersonalizedGuiltReductionInput): Promise<PersonalizedGuiltReductionOutput> {
  return personalizedGuiltReductionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedGuiltReductionPrompt',
  input: {schema: PersonalizedGuiltReductionInputSchema},
  output: {schema: PersonalizedGuiltReductionOutputSchema},
  prompt: `You are an AI assistant designed to help users understand the impact of their digital habits and suggest personalized actions to reduce their environmental impact.

You will receive a series of confessions from the user, answering questions about their technology usage.

Based on these confessions, identify the area where the user has the biggest impact (e.g., video streaming, data storage, device replacement).

Then, suggest 3-5 specific, actionable steps the user can take to reduce their impact in that area. Be creative and consider different types of actions, such as:

*   Donations to specific environmental organizations
*   Petitions to sign related to tech and the environment
*   Changes in personal behavior
*   Products or services to boycott
*   Specific information to educate themselves about

Confessions:
{{#each confessionData}}
  {{@key}}: {{this}}
{{/each}}

Language: {{language}}

Output the biggest impact and personalized actions in the language specified. Output the summary and suggestedActions fields.`,
});

const personalizedGuiltReductionFlow = ai.defineFlow(
  {
    name: 'personalizedGuiltReductionFlow',
    inputSchema: PersonalizedGuiltReductionInputSchema,
    outputSchema: PersonalizedGuiltReductionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
