
// use server'

/**
 * @fileOverview AI agent that analyzes the pronunciation of a sentence and compares it to the expected sentence.
 *
 * - analyzePronunciation - A function that analyzes the pronunciation of a sentence.
 * - AnalyzePronunciationInput - The input type for the analyzePronunciation function.
 * - AnalyzePronunciationOutput - The return type for the analyzePronunciation function.
 */

'use server';

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
  output: {schema: AnalyzePronunciationOutputSchema},
  prompt: `You are an AI assistant. Your task is to compare two sentences: an "Expected Sentence" and a "Transcribed Sentence".

Determine if the "Transcribed Sentence" is substantially similar to the "Expected Sentence". "Substantially similar" means that the core meaning is the same and most of the important words are present, even if there are minor grammatical differences, or some small words are missing or different. This should be roughly equivalent to an 80% match or higher.

Output fields:
- isCorrect (boolean): Set to true if the sentences are substantially similar, false otherwise.
- feedback (string):
    - If isCorrect is true, set feedback to "Good job! That's a good match."
    - If isCorrect is false, set feedback to "That's not quite right. Please try matching the sentence more closely."

Expected Sentence: {{{expectedSentence}}}
Transcribed Sentence: {{{transcribedSentence}}}`,
});

const analyzePronunciationFlow = ai.defineFlow(
  {
    name: 'analyzePronunciationFlow',
    inputSchema: AnalyzePronunciationInputSchema,
    outputSchema: AnalyzePronunciationOutputSchema,
  },
  async input => {
    const {output} = await analyzePronunciationPrompt(input);
    return output!;
  }
);

