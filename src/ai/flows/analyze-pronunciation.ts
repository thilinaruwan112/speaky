
'use server';

/**
 * @fileOverview Analyzes the pronunciation of a sentence by comparing it to the expected sentence using word verification.
 *
 * - analyzePronunciation - A function that analyzes the pronunciation of a sentence.
 * - AnalyzePronunciationInput - The input type for the analyzePronunciation function.
 * - AnalyzePronunciationOutput - The return type for the analyzePronunciation function.
 */

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

// Helper function to normalize and get significant words from a sentence
function getSignificantWords(sentence: string): string[] {
  const stopWords = [
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 
    'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 
    'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 
    'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
    'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
    'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 
    'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
    'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 
    'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 
    'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 
    'don', 'should', 'now', 've', 'll', 'd', 're', 'm'
  ];

  let normalized = sentence.toLowerCase();
  
  // Normalize common contractions to their expanded forms
  normalized = normalized.replace(/\bi'm\b/g, "i am");
  normalized = normalized.replace(/\byou're\b/g, "you are");
  normalized = normalized.replace(/\bhe's\b/g, "he is");
  normalized = normalized.replace(/\bshe's\b/g, "she is");
  normalized = normalized.replace(/\bit's\b/g, "it is");
  normalized = normalized.replace(/\bwe're\b/g, "we are");
  normalized = normalized.replace(/\bthey're\b/g, "they are");
  normalized = normalized.replace(/\bi've\b/g, "i have");
  normalized = normalized.replace(/\byou've\b/g, "you have");
  normalized = normalized.replace(/\bwe've\b/g, "we have");
  normalized = normalized.replace(/\bthey've\b/g, "they have");
  normalized = normalized.replace(/\bi'll\b/g, "i will");
  normalized = normalized.replace(/\byou'll\b/g, "you will");
  normalized = normalized.replace(/\bhe'll\b/g, "he will");
  normalized = normalized.replace(/\bshe'll\b/g, "she will");
  normalized = normalized.replace(/\bwe'll\b/g, "we will");
  normalized = normalized.replace(/\bthey'll\b/g, "they will");
  normalized = normalized.replace(/\bi'd\b/g, "i would"); // or "i had"
  normalized = normalized.replace(/\byou'd\b/g, "you would");
  normalized = normalized.replace(/\bhe'd\b/g, "he would");
  normalized = normalized.replace(/\bshe'd\b/g, "she would");
  normalized = normalized.replace(/\bwe'd\b/g, "we would");
  normalized = normalized.replace(/\bthey'd\b/g, "they would");
  normalized = normalized.replace(/\bwon't\b/g, "will not");
  normalized = normalized.replace(/\bcan't\b/g, "can not");
  normalized = normalized.replace(/\bdon't\b/g, "do not");
  normalized = normalized.replace(/\bdoesn't\b/g, "does not");
  normalized = normalized.replace(/\bdidn't\b/g, "did not");
  normalized = normalized.replace(/\bshouldn't\b/g, "should not");
  normalized = normalized.replace(/\bcouldn't\b/g, "could not");
  normalized = normalized.replace(/\bwouldn't\b/g, "would not");
  normalized = normalized.replace(/\baren't\b/g, "are not");
  normalized = normalized.replace(/\bisn't\b/g, "is not");
  normalized = normalized.replace(/\bwasn't\b/g, "was not");
  normalized = normalized.replace(/\bweren't\b/g, "were not");
  normalized = normalized.replace(/\bhasn't\b/g, "has not");
  normalized = normalized.replace(/\bhaven't\b/g, "have not");
  normalized = normalized.replace(/\bhadn't\b/g, "had not");

  // Remove punctuation
  normalized = normalized.replace(/[.,?!;:"']/g, ''); 
  
  const words = normalized
    .split(/\s+/)
    .filter(word => word.length > 0 && !stopWords.includes(word));
  
  return [...new Set(words)]; // Return unique significant words
}

export async function analyzePronunciation(
  input: AnalyzePronunciationInput
): Promise<AnalyzePronunciationOutput> {
  if (!input.transcribedSentence || input.transcribedSentence.trim() === "") {
    return {
      isCorrect: false,
      feedback: "No speech was detected or it was unclear. Please try again.",
    };
  }

  const expectedSignificantWords = getSignificantWords(input.expectedSentence);
  const transcribedSignificantWords = getSignificantWords(input.transcribedSentence);

  if (expectedSignificantWords.length === 0) {
    // If expected sentence has no significant words (e.g., empty or only stop words)
    if (transcribedSignificantWords.length === 0) {
      return {
        isCorrect: true,
        feedback: "Good job!",
      };
    } else {
      return {
        isCorrect: false,
        feedback: "That's not quite right. Please try matching the sentence more closely.",
      };
    }
  }

  const commonWords = expectedSignificantWords.filter(word => 
    transcribedSignificantWords.includes(word)
  );
  
  const similarity = commonWords.length / expectedSignificantWords.length;

  const threshold = 0.7; // 70% match of significant words

  if (similarity >= threshold) {
    return {
      isCorrect: true,
      feedback: "Good job! That's a good match.",
    };
  } else {
    return {
      isCorrect: false,
      feedback: "That's not quite right. Please try matching the sentence more closely.",
    };
  }
}
