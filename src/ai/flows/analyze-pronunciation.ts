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
      'Whether the transcribed sentence matches the expected sentence.'
    ),
  feedback: z.string().describe('Feedback on the user pronunciation.'),
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
  prompt: `You are an expert English pronunciation evaluator.

You will receive the expected sentence and the transcribed sentence from the user.

You will compare the transcribed sentence with the expected sentence and determine if the pronunciation is correct.

If the transcribed sentence does not match the expected sentence, provide feedback on the user pronunciation.

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
