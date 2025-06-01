
'use server';

/**
 * @fileOverview AI agent that analyzes the pronunciation of a sentence and compares it to the expected sentence.
 *
 * - analyzePronunciation - A function that analyzes the pronunciation of a sentence.
 * - AnalyzePronunciationInput - The input type for the analyzePronunciation function.
 * - AnalyzePronunciationOutput - The return type for the analyzePronunciation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePronunciationInputSchema = z.object({
  expectedSentence: z
    .string()
    .describe('The expected sentence that the user should pronounce.'),
  transcribedSentence: z
    .string()
    .describe('The transcribed sentence from the user.'),
});
export type AnalyzePronunciationInput = z.infer<
  typeof AnalyzePronunciationInputSchema
>;

const AnalyzePronunciationOutputSchema = z.object({
  isCorrect: z
    .boolean()
    .describe(
      'Whether the transcribed sentence is substantially similar to the expected sentence.'
    ),
  feedback: z.string().describe('Feedback on the user pronunciation attempt.'),
});
export type AnalyzePronunciationOutput = z.infer<
  typeof AnalyzePronunciationOutputSchema
>;

export async function analyzePronunciation(
  input: AnalyzePronunciationInput
): Promise<AnalyzePronunciationOutput> {
  return analyzePronunciationFlow(input);
}

const analyzePronunciationPrompt = ai.definePrompt({
  name: 'analyzePronunciationPrompt',
  input: {schema: AnalyzePronunciationInputSchema},
  // Removed output schema here to simplify AI's task
  prompt: `You are an AI assistant. Your task is to compare two sentences: an "Expected Sentence" and a "Transcribed Sentence".

Determine if the "Transcribed Sentence" is substantially similar to the "Expected Sentence". "Substantially similar" means that the core meaning is the same and most of the important words are present, even if there are minor grammatical differences, or some small words are missing or different. This should be roughly equivalent to an 80% match or higher.

Expected Sentence: {{{expectedSentence}}}
Transcribed Sentence: {{{transcribedSentence}}}

Respond with ONLY the word "CORRECT" if the sentences are substantially similar.
Respond with ONLY the word "INCORRECT" if they are not.
Do not provide any other explanation or text.`,
});

const analyzePronunciationFlow = ai.defineFlow(
  {
    name: 'analyzePronunciationFlow',
    inputSchema: AnalyzePronunciationInputSchema,
    outputSchema: AnalyzePronunciationOutputSchema, // This is the flow's output, not the prompt's direct output
  },
  async (input): Promise<AnalyzePronunciationOutput> => {
    // Ensure transcribed sentence is not empty
    if (!input.transcribedSentence || input.transcribedSentence.trim() === "") {
      return {
        isCorrect: false,
        feedback: "No speech was detected or it was unclear. Please try again.",
      };
    }

    try {
      const response = await analyzePronunciationPrompt(input);
      const aiResponseText = response.text?.trim().toUpperCase();

      if (aiResponseText === 'CORRECT') {
        return {
          isCorrect: true,
          feedback: "Good job! That's a good match.",
        };
      } else if (aiResponseText === 'INCORRECT') {
        return {
          isCorrect: false,
          feedback: "That's not quite right. Please try matching the sentence more closely.",
        };
      } else {
        // The AI didn't return "CORRECT" or "INCORRECT"
        console.error('AI model returned unexpected text for analyzePronunciationPrompt:', response.text, 'Input:', input);
        return {
          isCorrect: false,
          feedback: "I couldn't determine if that was correct. Please try speaking again clearly.",
        };
      }
    } catch (e) {
      console.error('Error within analyzePronunciationFlow or prompt execution:', e, 'Input:', input);
      return {
        isCorrect: false,
        feedback: "There was an unexpected problem analyzing your speech. Please try again.",
      };
    }
  }
);
