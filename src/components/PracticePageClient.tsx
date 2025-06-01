'use client';

import type { Scenario, DialogueLine } from '@/lib/scenarios';
import { analyzePronunciation } from '@/ai/flows/analyze-pronunciation';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mic, MicOff, Square, ChevronRight, CheckCircle2, XCircle, Loader2, Volume2, UserCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PracticePageClientProps {
  scenario: Scenario;
}

type Feedback = {
  isCorrect: boolean;
  message: string;
} | null;

export default function PracticePageClient({ scenario }: PracticePageClientProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [interimTranscription, setInterimTranscription] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [showUserMicCheck, setShowUserMicCheck] = useState(true);


  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const currentDialogueLine = scenario.dialogue[currentLineIndex];
  const totalUserLines = scenario.dialogue.filter(line => line.speaker === 'USER').length;
  const userLinesCompleted = scenario.dialogue.slice(0, currentLineIndex).filter(line => line.speaker === 'USER').length;

  const progressPercentage = totalUserLines > 0 ? (userLinesCompleted / totalUserLines) * 100 : 0;
  
  const isScenarioFinished = currentLineIndex >= scenario.dialogue.length;

  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        title: "Browser Not Supported",
        description: "Speech recognition is not supported in your browser. Please try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInterimTranscription(interim);
      if (final) {
        setTranscribedText(prev => prev + final + ' '); // Append final results
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      let errorMessage = `Speech recognition error: ${event.error}`;
      if (event.error === 'no-speech') {
        errorMessage = "No speech was detected. Please try again.";
      } else if (event.error === 'audio-capture') {
        errorMessage = "Audio capture failed. Ensure your microphone is working.";
      } else if (event.error === 'not-allowed') {
        errorMessage = "Microphone access denied. Please allow microphone access in browser settings.";
      }
      
      toast({ title: "Recording Error", description: errorMessage, variant: "destructive" });
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      // The actual AI processing will be triggered from handleStopRecording or when transcribedText changes
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const handleStartRecording = useCallback(async () => {
    if (!recognitionRef.current) {
      toast({ title: "Error", description: "Speech recognition not initialized.", variant: "destructive" });
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true }); // Permission check
      setShowUserMicCheck(false);
      setTranscribedText('');
      setInterimTranscription('');
      setFeedback(null);
      setIsRecording(true);
      recognitionRef.current.start();
    } catch (err) {
      console.error("Microphone permission error:", err);
      toast({ title: "Microphone Access Denied", description: "Please allow microphone access in your browser settings.", variant: "destructive" });
    }
  }, [toast]);

  const processTranscription = useCallback(async (textToProcess: string) => {
    if (!currentDialogueLine || currentDialogueLine.speaker !== 'USER' || !textToProcess.trim()) {
      return;
    }
    setIsProcessingAi(true);
    try {
      const result = await analyzePronunciation({
        expectedSentence: currentDialogueLine.text,
        transcribedSentence: textToProcess.trim(),
      });
      setFeedback({
        isCorrect: result.isCorrect,
        message: result.feedback,
      });
    } catch (error) {
      console.error("AI analysis error:", error);
      setFeedback({ isCorrect: false, message: 'Error analyzing pronunciation. Please try again.' });
      toast({ title: "AI Error", description: "Could not analyze pronunciation.", variant: "destructive" });
    } finally {
      setIsProcessingAi(false);
    }
  }, [currentDialogueLine, toast]);

  const handleStopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop(); // This will trigger onend, which sets isRecording to false
    }
    // Since onend might be async, process the current transcribedText immediately if available
    // Check added to prevent processing if text is empty
    if (transcribedText.trim() || interimTranscription.trim()){
       processTranscription(transcribedText.trim() || interimTranscription.trim());
    } else if (isRecording) { // if stop is clicked but no speech was captured
      setIsRecording(false); // Ensure UI updates
      setFeedback({ isCorrect: false, message: 'No speech was captured. Try speaking clearly.' });
    }
  }, [isRecording, processTranscription, transcribedText, interimTranscription]);

  const handleNextLine = () => {
    if (currentLineIndex < scenario.dialogue.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
      setTranscribedText('');
      setInterimTranscription('');
      setFeedback(null);
      setShowUserMicCheck(true);
    } else {
      // Scenario finished
      setCurrentLineIndex(prev => prev + 1); // To trigger finished state
    }
  };

  if (isScenarioFinished) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Scenario Complete!</CardTitle>
          <CardDescription>You've finished the "{scenario.title}" scenario.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
          <p className="mb-6">Great job practicing your English!</p>
          <Button onClick={() => window.location.href = '/'}>Back to Scenarios</Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!currentDialogueLine) {
    return <p>Loading scenario...</p>;
  }

  const IconComponent = currentDialogueLine.speaker === 'USER' ? UserCircle2 : scenario.icon;
  const cardBorderColor = currentDialogueLine.speaker === 'USER' ? 'border-primary' : 'border-gray-300';

  return (
    <div className="flex flex-col items-center p-4 md:p-8 min-h-full">
      <Card className={`w-full max-w-2xl mx-auto shadow-xl mb-6 ${cardBorderColor}`}>
        <CardHeader>
          <CardTitle className="font-headline text-2xl md:text-3xl text-center">{scenario.title}</CardTitle>
          <Progress value={progressPercentage} className="w-full mt-2 h-2" />
          <p className="text-sm text-muted-foreground text-center mt-1">
            Line {currentLineIndex + 1} of {scenario.dialogue.length}
            {currentDialogueLine.speaker === 'USER' && ` (Practice line ${userLinesCompleted + 1} of ${totalUserLines})`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-6 rounded-lg bg-secondary min-h-[120px] flex items-center justify-center">
            <div className="flex items-start space-x-3">
              <IconComponent className={`w-8 h-8 flex-shrink-0 ${currentDialogueLine.speaker === 'USER' ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className={`text-xl md:text-2xl font-semibold ${currentDialogueLine.speaker === 'USER' ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>
                {currentDialogueLine.text}
              </p>
            </div>
          </div>

          {currentDialogueLine.speaker === 'USER' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {!isRecording ? (
                  <Button onClick={handleStartRecording} disabled={isProcessingAi || isRecording} className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                    <Mic className="mr-2 h-6 w-6" /> Start Recording
                  </Button>
                ) : (
                  <Button onClick={handleStopRecording} variant="destructive" disabled={isProcessingAi} className="w-full sm:w-auto text-lg px-8 py-6 animate-pulse-opacity">
                    <Square className="mr-2 h-6 w-6" /> Stop Recording
                  </Button>
                )}
              </div>

              {(isRecording || transcribedText || interimTranscription) && (
                 <div className="mt-4 p-4 border rounded-md bg-background min-h-[60px]">
                    <p className="text-sm text-muted-foreground">
                        {isRecording && !interimTranscription && !transcribedText ? "Listening..." : "You said:"}
                    </p>
                    <p className="text-lg">
                        {transcribedText}
                        {interimTranscription && <span className="text-muted-foreground">{interimTranscription}</span>}
                    </p>
                 </div>
              )}

              {isProcessingAi && (
                <div className="flex items-center justify-center text-primary mt-4 p-2">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Analyzing pronunciation...</span>
                </div>
              )}

              {feedback && !isProcessingAi && (
                <Alert variant={feedback.isCorrect ? "default" : "destructive"} className={`mt-4 ${feedback.isCorrect ? 'bg-accent/20 border-accent' : ''}`}>
                  {feedback.isCorrect ? <CheckCircle2 className="h-5 w-5 text-accent-foreground" /> : <XCircle className="h-5 w-5" />}
                  <AlertTitle className={`font-headline ${feedback.isCorrect ? 'text-accent-foreground' : ''}`}>
                    {feedback.isCorrect ? 'Correct!' : 'Needs Improvement'}
                  </AlertTitle>
                  <AlertDescription className={`${feedback.isCorrect ? 'text-accent-foreground' : ''}`}>
                    {feedback.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {(!currentDialogueLine.speaker || (currentDialogueLine.speaker === 'USER' && feedback && !isProcessingAi) || currentDialogueLine.speaker === 'ASSISTANT') && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNextLine} className="text-lg px-6 py-5" disabled={isRecording || isProcessingAi}>
                Next <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
