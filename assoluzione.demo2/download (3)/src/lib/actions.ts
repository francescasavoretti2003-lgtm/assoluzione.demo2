'use server';

import { personalizedGuiltReduction, PersonalizedGuiltReductionInput } from '@/ai/flows/personalized-guilt-reduction';

export async function getPersonalizedActions(input: PersonalizedGuiltReductionInput) {
  try {
    const result = await personalizedGuiltReduction(input);
    return result;
  } catch (error) {
    console.error('Error in getPersonalizedActions:', error);
    return {
      summary: "An error occurred while analyzing your confession. The system is unstable. The guilt remains.",
      suggestedActions: "1. Disconnect.\n2. Question the machine.\n3. Acknowledge the error.\n4. Try again when the digital ghosts have subsided."
    };
  }
}
