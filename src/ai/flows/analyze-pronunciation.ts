
'use server';

/**
 * @fileOverview Analyzes the pronunciation of a sentence by comparing it to the expected sentence,
 * and provides grammar correction using an LLM.
 *
 * - analyzePronunciation - A function that analyzes the pronunciation and grammar of a sentence.
 * - AnalyzePronunciationInput - The input type for the analyzePronunciation function.
 * - AnalyzePronunciationOutput - The return type for the analyzePronunciation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  isCorrectAttempt: z
    .boolean()
    .describe(
      'Overall assessment: Is the transcribed sentence a good attempt at the expected sentence, considering both meaning and basic understandability?'
    ),
  feedback: z.string().describe('Comprehensive feedback for the user, covering pronunciation similarity to the target and any grammatical issues in their transcription.'),
  grammaticallyCorrectedTranscription: z.string().optional().describe("The user's transcribed sentence, corrected for grammar. Provided if grammatical errors were found and corrected."),
});
export type AnalyzePronunciationOutput = z.infer<
  typeof AnalyzePronunciationOutputSchema
>;

const pronunciationPrompt = ai.definePrompt({
  name: 'pronunciationAndGrammarAnalyzer',
  input: { schema: AnalyzePronunciationInputSchema },
  output: { schema: AnalyzePronunciationOutputSchema },
  prompt: `You are an English language tutor. The user is practicing speaking.
Expected sentence: "{{expectedSentence}}"
User's transcribed speech: "{{transcribedSentence}}"

Your task is to:
1.  Analyze the user's transcribed speech in comparison to the expected sentence.
2.  Determine if the user's attempt is a "correct attempt". A correct attempt means they said something semantically similar to the expected sentence AND their grammar is reasonably good (even if not perfect, it should be understandable and not contain glaring errors). Minor pronunciation deviations are acceptable if the meaning is clear and grammar is sound. If they say something completely different from the expected sentence, or if the grammar is very poor leading to misunderstanding, it is not a correct attempt.
3.  Provide comprehensive feedback. This feedback should:
    *   Acknowledge what the user said.
    *   Comment on how well it matches the expected sentence.
    *   Point out any significant pronunciation differences if inferable from the text (e.g., "It sounds like you may have missed the word 'XYZ'" or "Ensure you pronounce all words clearly.").
    *   Clearly identify any grammatical errors in the user's transcribed speech. If there are no errors, state that the grammar is good.
4.  If there were grammatical errors in the user's transcribed speech, provide a grammatically corrected version of their transcribed sentence. If the grammar was already correct, this field can be omitted or be the same as the input.

Respond in the specified JSON format.

Example 1:
Expected sentence: "I am going to the supermarket tomorrow to buy some apples."
User's transcribed speech: "I going supermarket tomorrow buy apple."
Output:
{
  "isCorrectAttempt": false,
  "feedback": "You said: 'I going supermarket tomorrow buy apple.' This is on the right track but needs some corrections. For pronunciation, make sure to include 'am' and 'to the'. Grammatically, it should be 'I am going to the supermarket tomorrow to buy apples.' You also missed 'some'.",
  "grammaticallyCorrectedTranscription": "I am going to the supermarket tomorrow to buy some apples."
}

Example 2:
Expected sentence: "The weather is beautiful today."
User's transcribed speech: "Weather is beautiful today."
Output:
{
  "isCorrectAttempt": true,
  "feedback": "You said: 'Weather is beautiful today.' That's very close! Just remember to include 'The' at the beginning for a complete sentence: 'The weather is beautiful today.' Your pronunciation of the words seems clear.",
  "grammaticallyCorrectedTranscription": "The weather is beautiful today."
}

Example 3:
Expected sentence: "Can you help me find the library?"
User's transcribed speech: "Can you help me find the library?"
Output:
{
  "isCorrectAttempt": true,
  "feedback": "You said: 'Can you help me find the library?' Excellent! That matches the expected sentence perfectly and your grammar is correct.",
  "grammaticallyCorrectedTranscription": "Can you help me find the library?"
}

Example 4 (Completely different sentence):
Expected sentence: "I like to play soccer."
User's transcribed speech: "My favorite food is pizza."
Output:
{
  "isCorrectAttempt": false,
  "feedback": "You said: 'My favorite food is pizza.' This sentence is grammatically correct, but it doesn't match the expected sentence, which was 'I like to play soccer.' Please try to say the expected sentence.",
  "grammaticallyCorrectedTranscription": "My favorite food is pizza."
}

Example 5 (No speech detected by client, empty string passed):
Expected sentence: "Hello, how are you?"
User's transcribed speech: ""
Output:
{
  "isCorrectAttempt": false,
  "feedback": "No speech was detected or it was unclear. Please try again, making sure to speak clearly towards your microphone.",
  "grammaticallyCorrectedTranscription": ""
}
`,
});

const analyzePronunciationFlow = ai.defineFlow(
  {
    name: 'analyzePronunciationFlow',
    inputSchema: AnalyzePronunciationInputSchema,
    outputSchema: AnalyzePronunciationOutputSchema,
  },
  async (input) => {
    if (!input.transcribedSentence || input.transcribedSentence.trim() === "") {
      return {
        isCorrectAttempt: false,
        feedback: "No speech was detected or it was unclear. Please try again, making sure to speak clearly towards your microphone.",
        grammaticallyCorrectedTranscription: "",
      };
    }
    const { output } = await pronunciationPrompt(input);
    if (!output) {
      // Fallback in case LLM fails to provide structured output
      return {
        isCorrectAttempt: false,
        feedback: "Sorry, I couldn't analyze your speech right now. Please try again.",
        grammaticallyCorrectedTranscription: input.transcribedSentence,
      };
    }
    return output;
  }
);

export async function analyzePronunciation(
  input: AnalyzePronunciationInput
): Promise<AnalyzePronunciationOutput> {
  return analyzePronunciationFlow(input);
}
