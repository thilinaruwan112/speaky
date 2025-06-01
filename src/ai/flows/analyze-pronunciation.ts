
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
  model: 'googleai/gemini-pro', // Explicitly use gemini-pro for this prompt
  input: {schema: AnalyzePronunciationInputSchema},
  prompt: `You are an AI assistant. Your task is to compare two sentences: an "Expected Sentence" and a "Transcribed Sentence".

Determine if the "Transcribed Sentence" is substantially similar to the "Expected Sentence". "Substantially similar" means that the core meaning is the same and most of the important words are present, even if there are minor grammatical differences (like "I'm" vs "I am"), or some small words are missing or different. This should be roughly equivalent to an 80% match or higher.

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
    outputSchema: AnalyzePronunciationOutputSchema,
  },
  async (input): Promise<AnalyzePronunciationOutput> => {
    if (!input.transcribedSentence || input.transcribedSentence.trim() === "") {
      return {
        isCorrect: false,
        feedback: "No speech was detected or it was unclear. Please try again.",
      };
    }

    try {
      const response = await analyzePronunciationPrompt(input);
      const rawResponseText = response.text; 

      if (rawResponseText && typeof rawResponseText === 'string') {
        const processedText = rawResponseText.trim().toUpperCase();
        if (processedText === 'CORRECT') {
          return {
            isCorrect: true,
            feedback: "Good job! That's a good match.",
          };
        } else if (processedText === 'INCORRECT') {
          return {
            isCorrect: false,
            feedback: "That's not quite right. Please try matching the sentence more closely.",
          };
        } else {
          console.error('AI model returned unexpected text for analyzePronunciationPrompt:', rawResponseText, 'Input:', input, 'Full response object:', response);
          return {
            isCorrect: false,
            feedback: "I couldn't quite understand if that was correct. Please try speaking again clearly.",
          };
        }
      } else {
        console.error('AI model did not return text or returned invalid text for analyzePronunciationPrompt. Response object:', response, 'Input:', input);
        return {
          isCorrect: false,
          feedback: "I'm having a little trouble understanding the response. Could you try that again?",
        };
      }
    } catch (e) {
      console.error('Critical error within analyzePronunciationFlow or prompt execution. Input:', input);
      if (e instanceof Error) {
        console.error('Error Name:', e.name);
        console.error('Error Message:', e.message);
        console.error('Error Stack:', e.stack);
        // Attempt to log more details if available (e.g., from a Genkit-specific error)
        if ('details' in e) {
          console.error('Error Details:', (e as any).details);
        }
      } else {
        console.error('Caught a non-Error object:', e);
      }
      return {
        isCorrect: false,
        feedback: "There was an unexpected problem analyzing your speech. Please try again.",
      };
    }
  }
);

