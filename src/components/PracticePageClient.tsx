
'use client';

import type { Scenario, DialogueLine } from '@/lib/scenarios';
import { analyzePronunciation } from '@/ai/flows/analyze-pronunciation';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mic, Square, ChevronRight, CheckCircle2, XCircle, Loader2, UserCircle2, PlayCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getIconByName } from '@/lib/icons';
import { cn } from '@/lib/utils';

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
  const [finalTranscriptProcessingTrigger, setFinalTranscriptProcessingTrigger] = useState(0);
  const [hasSubmittedTranscription, setHasSubmittedTranscription] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [assistantLineManuallyPlayed, setAssistantLineManuallyPlayed] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const currentDialogueLine = scenario.dialogue[currentLineIndex];
  const totalUserLines = scenario.dialogue.filter(line => line.speaker === 'USER').length;
  const userLinesCompleted = scenario.dialogue.slice(0, currentLineIndex).filter(line => line.speaker === 'USER').length;

  const progressPercentage = totalUserLines > 0 ? (userLinesCompleted / totalUserLines) * 100 : 0;
  
  const isScenarioFinished = currentLineIndex >= scenario.dialogue.length;

  const currentDialogueLineRef = useRef(currentDialogueLine);
  const feedbackRef = useRef(feedback);
  const isProcessingAiRef = useRef(isProcessingAi);
  const isScenarioFinishedRef = useRef(isScenarioFinished);
  const hasSubmittedTranscriptionRef = useRef(hasSubmittedTranscription);
  const isMobileViewRef = useRef(isMobileView);
  const assistantLineManuallyPlayedRef = useRef(assistantLineManuallyPlayed);

  useEffect(() => { currentDialogueLineRef.current = currentDialogueLine; }, [currentDialogueLine]);
  useEffect(() => { feedbackRef.current = feedback; }, [feedback]);
  useEffect(() => { isProcessingAiRef.current = isProcessingAi; }, [isProcessingAi]);
  useEffect(() => { isScenarioFinishedRef.current = isScenarioFinished; }, [isScenarioFinished]);
  useEffect(() => { hasSubmittedTranscriptionRef.current = hasSubmittedTranscription; }, [hasSubmittedTranscription]);
  useEffect(() => { isMobileViewRef.current = isMobileView; }, [isMobileView]);
  useEffect(() => { assistantLineManuallyPlayedRef.current = assistantLineManuallyPlayed; }, [assistantLineManuallyPlayed]);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const handleNextLine = useCallback(() => {
    if (isScenarioFinishedRef.current) return;

    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    if (currentLineIndex < scenario.dialogue.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
      setTranscribedText('');
      setInterimTranscription('');
      setFeedback(null);
      setShowUserMicCheck(true);
      setHasSubmittedTranscription(false);
      setAssistantLineManuallyPlayed(false); 
    } else {
      setCurrentLineIndex(prev => prev + 1); 
    }
  }, [currentLineIndex, scenario.dialogue.length]);


  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        title: "Browser Not Supported",
        description: "Speech recognition is not supported in your browser. Please try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionImpl();
    const recognition = recognitionRef.current;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started.');
    };

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
        setTranscribedText(prev => (prev + final.trim() + ' ').trimStart());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, 'Message:', event.message);
      let errorMessage = `Speech recognition error: ${event.error}`;
      if (event.error === 'no-speech') {
        errorMessage = "No speech was detected. Please ensure your microphone is active and you're speaking clearly.";
      } else if (event.error === 'audio-capture') {
        errorMessage = "Audio capture failed. Please check microphone permissions and ensure it's not in use by another app.";
      } else if (event.error === 'not-allowed') {
        errorMessage = "Microphone access denied by you or your browser settings. Please allow microphone access.";
      } else if (event.error === 'network') {
        errorMessage = "A network error occurred during speech recognition. Please check your connection. This can be common on mobile.";
      } else if (event.error === 'aborted') {
        errorMessage = "Speech recognition was aborted. Please try again.";
      } else if (event.error === 'language-not-supported' || event.error === 'service-not-allowed' || event.error === 'bad-grammar') {
        errorMessage = `A speech service configuration error occurred (${event.error}). This might be a temporary issue.`;
      } else {
        errorMessage = `An unexpected speech error occurred: ${event.error}. Message: ${event.message || 'No additional message.'}`;
      }
      
      toast({ title: "Recording Error", description: errorMessage, variant: "destructive" });
      setIsRecording(false); 
      if (currentDialogueLineRef.current?.speaker === 'USER' && !feedbackRef.current && !hasSubmittedTranscriptionRef.current) {
        setFeedback({ isCorrect: false, message: "Could not process audio due to a recording error. Please try again." });
        setHasSubmittedTranscription(true); 
      }
    };
    
    recognition.onend = () => {
      console.log('Speech recognition ended.');
      setIsRecording(false);
      setFinalTranscriptProcessingTrigger(prev => prev + 1); 
    };

    const recognitionInstance = recognitionRef.current;
    return () => {
      if (recognitionInstance) {
        recognitionInstance.onstart = null;
        recognitionInstance.onresult = null;
        recognitionInstance.onerror = null;
        recognitionInstance.onend = null;
        try {
            if(isRecording) recognitionInstance.abort();
        } catch (e) {
            console.warn("Error aborting recognition on unmount:", e);
        }
      }
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [toast]);


  const processTranscription = useCallback(async (textToProcess: string) => {
    if (!currentDialogueLineRef.current || currentDialogueLineRef.current.speaker !== 'USER' || !textToProcess.trim()) {
       if (currentDialogueLineRef.current?.speaker === 'USER' && !textToProcess.trim() && !feedbackRef.current) {
         setFeedback({ isCorrect: false, message: 'No speech was captured. Try speaking clearly.' });
       }
      return;
    }
    setIsProcessingAi(true);
    setFeedback(null); 
    try {
      const result = await analyzePronunciation({
        expectedSentence: currentDialogueLineRef.current.text,
        transcribedSentence: textToProcess.trim(),
      });
      setFeedback({
        isCorrect: result.isCorrect,
        message: result.feedback,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      setFeedback({ isCorrect: false, message: 'Error analyzing pronunciation. Please try again.' });
      toast({ title: "Analysis Error", description: "Could not analyze pronunciation.", variant: "destructive" });
    } finally {
      setIsProcessingAi(false);
    }
  }, [toast]);


  useEffect(() => {
    if (finalTranscriptProcessingTrigger === 0 || isRecording || hasSubmittedTranscription) {
      return; 
    }

    const textToProcess = transcribedText.trim();
    if (textToProcess) {
      setHasSubmittedTranscription(true); 
      processTranscription(textToProcess);
    } else if (currentDialogueLineRef.current?.speaker === 'USER') { 
      if (!feedbackRef.current) { 
          setFeedback({ isCorrect: false, message: 'No speech was detected or captured clearly.' });
      }
      setHasSubmittedTranscription(true);
    }
  }, [finalTranscriptProcessingTrigger, isRecording, transcribedText, processTranscription, hasSubmittedTranscription]);


  const handleStartRecording = useCallback(async () => {
    if (!recognitionRef.current) { 
      toast({
        title: "Browser Not Supported",
        description: "Speech recognition is not supported in your browser. Please try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
     console.log('Attempting to start recording. Current isRecording state:', isRecording);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true }); 
      setShowUserMicCheck(false);
      setTranscribedText('');
      setInterimTranscription('');
      setFeedback(null);
      setHasSubmittedTranscription(false); 
      setIsRecording(true);
      console.log('Calling recognitionRef.current.start()');
      recognitionRef.current.start();
    } catch (err) {
      console.error("Microphone permission error or other start error:", err);
      toast({ title: "Microphone Access Denied", description: "Please allow microphone access in your browser settings or check if another app is using the mic.", variant: "destructive" });
      setIsRecording(false); 
    }
  }, [toast, isRecording]); 

  const handleStopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      console.log('Calling recognitionRef.current.stop()');
      recognitionRef.current.stop(); 
    }
  }, [isRecording]);

  const speakAssistantLine = useCallback(() => {
    if (!currentDialogueLineRef.current || currentDialogueLineRef.current.speaker !== 'ASSISTANT' || !('speechSynthesis' in window)) {
      if (currentDialogueLineRef.current?.speaker === 'ASSISTANT') { // If no speech synth, auto-advance
        setTimeout(() => handleNextLine(), 1000); 
      }
      return;
    }
     // Cancel any ongoing speech first
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(currentDialogueLineRef.current.text);
    utterance.lang = 'en-US';
    utterance.onend = () => {
      console.log('Assistant speech finished.');
      if (currentDialogueLineRef.current?.speaker === 'ASSISTANT' && !isScenarioFinishedRef.current) {
        handleNextLine();
      }
    };
    utterance.onerror = (event) => {
      console.error('SpeechSynthesis Error:', event.error, (event as any).message);
      toast({ title: "Speech Error", description: "Could not play audio. Advancing in 3s.", variant: "destructive" });
      setTimeout(() => {
         if (currentDialogueLineRef.current?.speaker === 'ASSISTANT' && !isScenarioFinishedRef.current) {
           handleNextLine();
         }
       }, 3000);
    };
    window.speechSynthesis.speak(utterance);
  }, [handleNextLine, toast]);


  useEffect(() => {
    if (isScenarioFinished || !currentDialogueLine) {
      return;
    }

    let userAdvanceTimeoutId: NodeJS.Timeout | null = null;
    let synthesisFallbackTimeoutId: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (userAdvanceTimeoutId) clearTimeout(userAdvanceTimeoutId);
      if (synthesisFallbackTimeoutId) clearTimeout(synthesisFallbackTimeoutId);
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
    
    if (currentDialogueLine.speaker === 'ASSISTANT') {
      if (isMobileView && !assistantLineManuallyPlayed) {
        // On mobile, wait for user to click play
      } else {
        // On desktop, or if mobile user clicked play
        speakAssistantLine();
      }
    } else if (currentDialogueLine.speaker === 'USER' && feedback?.isCorrect && !isProcessingAi && hasSubmittedTranscription) {
      // Only auto-advance if feedback is correct AND transcription has been submitted
      userAdvanceTimeoutId = setTimeout(() => {
         if (feedbackRef.current?.isCorrect && currentDialogueLineRef.current?.speaker === 'USER' && !isScenarioFinishedRef.current && hasSubmittedTranscriptionRef.current) {
            handleNextLine();
         }
      }, 1500);
    }
    return cleanup;
  }, [currentLineIndex, currentDialogueLine, handleNextLine, toast, feedback, isProcessingAi, isScenarioFinished, hasSubmittedTranscription, isMobileView, assistantLineManuallyPlayed, speakAssistantLine]);


  const handlePlayAssistantLine = () => {
    setAssistantLineManuallyPlayed(true);
    // speakAssistantLine(); // useEffect will pick this up due to assistantLineManuallyPlayed change
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading scenario content...</p>
      </div>
    );
  }

  const ScenarioIcon = getIconByName(scenario.iconName);
  const IconComponent = currentDialogueLine.speaker === 'USER' ? UserCircle2 : ScenarioIcon;
  const cardBorderColor = currentDialogueLine.speaker === 'USER' ? 'border-primary' : 'border-gray-300';

  const showPlayAssistantButton = isMobileView && currentDialogueLine.speaker === 'ASSISTANT' && !assistantLineManuallyPlayed && !window.speechSynthesis?.speaking;

  const showNextButton = 
    (!showPlayAssistantButton && currentDialogueLine.speaker === 'ASSISTANT' && !isRecording && !isProcessingAi && !window.speechSynthesis?.speaking) ||
    (currentDialogueLine.speaker === 'USER' && feedback && !feedback.isCorrect && !isProcessingAi && hasSubmittedTranscription);


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
                  <Button 
                    onClick={handleStartRecording} 
                    disabled={isProcessingAi || isRecording || (feedback?.isCorrect === true && hasSubmittedTranscription)} 
                    className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                  >
                    <Mic className="mr-2 h-6 w-6" /> Start Recording
                  </Button>
                ) : (
                  <Button onClick={handleStopRecording} variant="destructive" disabled={isProcessingAi} className={cn("w-full sm:w-auto text-lg px-8 py-6", isRecording && "animate-pulse-opacity")}>
                    <Square className="mr-2 h-6 w-6" /> Stop Recording
                  </Button>
                )}
              </div>

              {(isRecording || transcribedText || interimTranscription) && (
                 <div className="mt-4 p-4 border rounded-md bg-background min-h-[60px]">
                    <p className="text-sm text-muted-foreground">
                        {isRecording && !interimTranscription && !transcribedText && !feedback ? "Listening..." : "You said:"}
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
          
          {showPlayAssistantButton && (
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handlePlayAssistantLine} 
                className="text-lg px-6 py-5"
              >
                <PlayCircle className="mr-2 h-5 w-5" /> Play Assistant Line
              </Button>
            </div>
          )}

          {showNextButton && (
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleNextLine} 
                className="text-lg px-6 py-5" 
                disabled={isRecording || isProcessingAi || (currentDialogueLine.speaker === 'ASSISTANT' && window.speechSynthesis?.speaking && !assistantLineManuallyPlayed)}
              >
                Next <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
