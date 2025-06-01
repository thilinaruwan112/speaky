
'use client';

import type { Scenario, DialogueLine } from '@/lib/scenarios';
import { analyzePronunciation } from '@/ai/flows/analyze-pronunciation';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mic, Square, ChevronRight, CheckCircle2, XCircle, Loader2, UserCircle2, PlayCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getIconByName } from '@/lib/icons';
import { cn } from '@/lib/utils';

// For SpeechRecognition type
interface IWindow extends Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}
// eslint-disable-next-line no-redeclare
declare const window: IWindow;

interface PracticePageClientProps {
  scenario: Scenario;
}

type Feedback = {
  isCorrect: boolean;
  message: string;
} | null;

type MicrophonePermissionStatus = 'pending' | 'granted' | 'denied' | 'unsupported_api' | 'unsupported_mic';

export default function PracticePageClient({ scenario }: PracticePageClientProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechApiServiceProcessing, setIsSpeechApiServiceProcessing] = useState(false); // True when speech API is active (recording or processing audio event)
  const [transcribedText, setTranscribedText] = useState('');
  const [interimTranscription, setInterimTranscription] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isProcessingAi, setIsProcessingAi] = useState(false); // True when calling analyzePronunciation
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState<MicrophonePermissionStatus>('pending');
  const [finalTranscriptProcessingTrigger, setFinalTranscriptProcessingTrigger] = useState(0);
  const [hasSubmittedTranscription, setHasSubmittedTranscription] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [hasRecordedSomething, setHasRecordedSomething] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const errorReportedRef = useRef(false);
  const latestTranscriptionRef = useRef("");
  const hasRecordedSomethingRef = useRef(false); // Tracks if any audio (interim or final) came through for current attempt

  const currentDialogueLine = scenario.dialogue[currentLineIndex];
  const totalUserLines = scenario.dialogue.filter(line => line.speaker === 'USER').length;
  const userLinesCompleted = scenario.dialogue.slice(0, currentLineIndex).filter(line => line.speaker === 'USER').length;
  const progressPercentage = totalUserLines > 0 ? (userLinesCompleted / totalUserLines) * 100 : 0;
  const isScenarioFinished = currentLineIndex >= scenario.dialogue.length;

  // Refs for values used in callbacks to avoid stale closures
  const currentDialogueLineRef = useRef(currentDialogueLine);
  const feedbackRef = useRef(feedback);
  const isProcessingAiRef = useRef(isProcessingAi);
  const isScenarioFinishedRef = useRef(isScenarioFinished);
  const hasSubmittedTranscriptionRef = useRef(hasSubmittedTranscription);
  const isAssistantSpeakingRef = useRef(isAssistantSpeaking);
  const hasAutoPlayedCurrentAssistantLineRef = useRef(false);


  useEffect(() => { currentDialogueLineRef.current = currentDialogueLine; }, [currentDialogueLine]);
  useEffect(() => { feedbackRef.current = feedback; }, [feedback]);
  useEffect(() => { isProcessingAiRef.current = isProcessingAi; }, [isProcessingAi]);
  useEffect(() => { hasSubmittedTranscriptionRef.current = hasSubmittedTranscription; }, [hasSubmittedTranscription]);
  useEffect(() => { isScenarioFinishedRef.current = isScenarioFinished; }, [isScenarioFinished]);
  useEffect(() => { isAssistantSpeakingRef.current = isAssistantSpeaking; }, [isAssistantSpeaking]);
  // No longer need useEffect to sync latestTranscriptionRef from transcribedText state. It will be updated directly.

  const { toast } = useToast();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const checkPermissionAndSupport = async () => {
      const SpeechRecognitionAPI = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
      if (!SpeechRecognitionAPI) {
        setMicrophonePermissionStatus('unsupported_api');
        if (hasMounted) toast({ variant: "destructive", title: "Browser Not Supported", description: "Speech recognition API is not available in your browser. Try Chrome or Edge." });
        return;
      }

      if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
        setMicrophonePermissionStatus('unsupported_mic');
        if (hasMounted) toast({ variant: "destructive", title: "Browser Not Supported", description: "Microphone access (getUserMedia) is not available in your browser." });
        return;
      }

      try {
        // Check permission status without actually starting a persistent stream
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permission.state === 'granted') {
          setMicrophonePermissionStatus('granted');
        } else if (permission.state === 'prompt') {
          // Try to prompt for permission by a quick getUserMedia request
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicrophonePermissionStatus('granted');
            stream.getTracks().forEach(track => track.stop());
          } catch (err) {
            console.error("Microphone permission denied on prompt:", err);
            setMicrophonePermissionStatus('denied');
            if (hasMounted) toast({ variant: "destructive", title: "Microphone Access Required", description: "Please enable microphone permissions in your browser settings and refresh." });
          }
        } else {
          setMicrophonePermissionStatus('denied');
          if (hasMounted) toast({ variant: "destructive", title: "Microphone Access Denied", description: "Please enable microphone permissions in your browser settings and refresh." });
        }
        
        permission.onchange = () => {
          setMicrophonePermissionStatus(permission.state as MicrophonePermissionStatus);
           if (permission.state === 'denied' && hasMounted) {
            toast({ variant: "destructive", title: "Microphone Access Changed", description: "Permissions changed. Please re-enable if needed." });
          }
        };

      } catch (err) {
        console.error("Error checking microphone permissions:", err);
        // Fallback for browsers not supporting navigator.permissions.query well for microphone
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicrophonePermissionStatus('granted');
            stream.getTracks().forEach(track => track.stop());
        } catch (getUserMediaError) {
            console.error("Microphone permission check/denied via getUserMedia fallback:", getUserMediaError);
            setMicrophonePermissionStatus('denied');
            if (hasMounted) toast({ variant: "destructive", title: "Microphone Access Denied", description: "Please enable microphone permissions in your browser settings and refresh." });
        }
      }
    };

    checkPermissionAndSupport();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted]);


  const handleNextLine = useCallback(() => {
    if (isScenarioFinishedRef.current) return;

    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsAssistantSpeaking(false);
    hasAutoPlayedCurrentAssistantLineRef.current = false;

    setCurrentLineIndex(prev => {
      if (prev < scenario.dialogue.length - 1) {
        return prev + 1;
      }
      return prev + 1; // Go to "finished" state
    });
    
    // Reset all recording/feedback related states for the new line
    setTranscribedText('');
    latestTranscriptionRef.current = "";
    setInterimTranscription('');
    setFeedback(null);
    feedbackRef.current = null;
    setHasSubmittedTranscription(false);
    hasSubmittedTranscriptionRef.current = false;
    setHasRecordedSomething(false);
    hasRecordedSomethingRef.current = false;
    errorReportedRef.current = false; // Reset error flag for the new line
    setIsProcessingAi(false);
    setIsSpeechApiServiceProcessing(false);
    if (recognitionRef.current && isRecording) { // Stop any ongoing recording
        recognitionRef.current.abort(); // Use abort to quickly stop and prevent further events
        setIsRecording(false);
    }

  }, [scenario.dialogue.length, isRecording]);


  const processTranscription = useCallback(async (textToProcess: string) => {
    if (!currentDialogueLineRef.current || currentDialogueLineRef.current.speaker !== 'USER') {
      return;
    }
    
    setIsProcessingAi(true);
    setFeedback(null); 
    try {
      const result = await analyzePronunciation({
        expectedSentence: currentDialogueLineRef.current.text,
        transcribedSentence: textToProcess.trim(), // Ensure .trim() is used here
      });
      setFeedback({
        isCorrect: result.isCorrect,
        message: result.feedback,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      setFeedback({ isCorrect: false, message: 'Error analyzing pronunciation. Please try again.' });
      if (hasMounted) toast({ title: "Analysis Error", description: "Could not analyze pronunciation.", variant: "destructive" });
    } finally {
      setIsProcessingAi(false);
    }
  }, [toast, hasMounted]);


  useEffect(() => {
    if (finalTranscriptProcessingTrigger === 0 || isRecording || isSpeechApiServiceProcessing) {
      return; 
    }
    if (hasSubmittedTranscriptionRef.current) { // Check ref for most up-to-date status
        return;
    }
    
    const textToProcess = latestTranscriptionRef.current.trim();
    
    if (textToProcess === "") {
      if (!feedbackRef.current) { 
        setFeedback({ isCorrect: false, message: "No clear speech was processed." });
      }
      setHasSubmittedTranscription(true); // Mark as handled
      hasSubmittedTranscriptionRef.current = true;
      return;
    }
    
    setHasSubmittedTranscription(true); 
    hasSubmittedTranscriptionRef.current = true; // Mark as submitted *before* async call
    processTranscription(textToProcess);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscriptProcessingTrigger]);


  const handleStartRecording = useCallback(async () => {
    // Aggressively reset states for the new recording attempt
    setTranscribedText('');
    latestTranscriptionRef.current = "";
    setInterimTranscription('');
    setFeedback(null);
    feedbackRef.current = null;
    setHasSubmittedTranscription(false);
    hasSubmittedTranscriptionRef.current = false;
    errorReportedRef.current = false;
    setHasRecordedSomething(false);
    hasRecordedSomethingRef.current = false;

    if (microphonePermissionStatus !== 'granted') {
      let msg = "Microphone permission is required to record.";
      if (microphonePermissionStatus === 'pending') msg = "Microphone permission check is ongoing. Please wait.";
      else if (microphonePermissionStatus === 'denied') msg = "Microphone permission denied. Please enable it in browser settings and refresh.";
      else if (microphonePermissionStatus === 'unsupported_api') msg = "Speech API not supported. Try Chrome or Edge.";
      else if (microphonePermissionStatus === 'unsupported_mic') msg = "Microphone access (getUserMedia) not supported.";
      if (hasMounted) toast({ title: "Cannot Start Recording", description: msg, variant: "destructive" });
      setFeedback({ isCorrect: false, message: msg });
      setHasSubmittedTranscription(true); 
      hasSubmittedTranscriptionRef.current = true;
      return;
    }

    const SpeechRecognitionAPI = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

    if (!SpeechRecognitionAPI) {
      setMicrophonePermissionStatus('unsupported_api');
      const msg = "Speech recognition API is not available in your browser. Try Chrome or Edge.";
      if (hasMounted) toast({ variant: "destructive", title: "Browser Not Supported", description: msg});
      setFeedback({ isCorrect: false, message: msg });
      setHasSubmittedTranscription(true);
      hasSubmittedTranscriptionRef.current = true;
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }
      recognitionRef.current = new SpeechRecognitionAPI();
      const recognition = recognitionRef.current;

      recognition.continuous = false; 
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setIsSpeechApiServiceProcessing(true); // Indicates speech service is active
        setHasRecordedSomething(false); 
        hasRecordedSomethingRef.current = false;
        if (hasMounted) toast({
          title: "Recording Started",
          description: "Speak into your microphone.",
        });
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimDisplay = ''; // For displaying only the current interim segment
        let currentFinalTranscript = latestTranscriptionRef.current; // Start with existing final transcript from this attempt

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Append the new final segment
            currentFinalTranscript = (currentFinalTranscript + transcriptSegment.trim() + ' ').trimStart();
          } else {
            interimDisplay += transcriptSegment; // Accumulate current interim segments
          }
        }
        
        setInterimTranscription(interimDisplay); // Update UI for interim text

        if (currentFinalTranscript !== latestTranscriptionRef.current) {
          setTranscribedText(currentFinalTranscript); // Update UI for final text
          latestTranscriptionRef.current = currentFinalTranscript; // CRITICAL: Update ref synchronously
          setHasRecordedSomething(true);
          hasRecordedSomethingRef.current = true;
        } else if (interimDisplay.trim() && !hasRecordedSomethingRef.current) {
          // If only interim results so far, still mark that recording has captured something
          setHasRecordedSomething(true);
          hasRecordedSomethingRef.current = true;
        }
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        errorReportedRef.current = true; 
        let errorMessage = `Speech recognition error: ${event.error}.`;
        let feedbackMessage = "An error occurred during speech recognition. Please try again.";

        if (event.error === 'no-speech') {
          errorMessage = "No speech was detected. Please ensure your microphone is active and you're speaking clearly.";
          feedbackMessage = errorMessage;
        } else if (event.error === 'audio-capture') {
          errorMessage = "Audio capture failed. Please check microphone permissions and ensure it's not in use by another app.";
          feedbackMessage = errorMessage;
        } else if (event.error === 'not-allowed') {
          errorMessage = "Microphone access denied. Please enable microphone access in your browser settings and refresh.";
          feedbackMessage = errorMessage;
          setMicrophonePermissionStatus('denied');
        } else if (event.error === 'network') {
          errorMessage = "A network error occurred during speech recognition. Please check your connection.";
          feedbackMessage = errorMessage;
        } else if (event.error === 'aborted' || event.error === 'interrupted') {
           console.log('Speech recognition intentionally stopped or interrupted:', event.error);
           // If aborted before anything meaningful, set feedback. Otherwise, let onend handle it if there's text.
           if (!hasRecordedSomethingRef.current) { 
             feedbackMessage = "Recording stopped before any speech was captured.";
           } else {
             // If something was recorded, let onend handle the processing if appropriate
             setIsRecording(false); 
             setIsSpeechApiServiceProcessing(false);
             return; 
           }
        }
        
        if (hasMounted) toast({ title: "Recording Error", description: errorMessage, variant: "destructive" });
        if (!feedbackRef.current && !hasSubmittedTranscriptionRef.current) { // Avoid overwriting if AI is processing
            setFeedback({ isCorrect: false, message: feedbackMessage });
            setHasSubmittedTranscription(true); 
            hasSubmittedTranscriptionRef.current = true;
        }
        setIsRecording(false);
        setIsSpeechApiServiceProcessing(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        setIsSpeechApiServiceProcessing(false); // Speech service is no longer active

        if (errorReportedRef.current) { 
            // Error was already handled by onerror, no further action here.
            return;
        }
        
        const finalTranscribedText = latestTranscriptionRef.current.trim();

        if (finalTranscribedText !== "") { 
            if (hasMounted) toast({
                title: "Recording Stopped",
                description: "Processing your speech...",
            });
            if (!hasSubmittedTranscriptionRef.current) { // Ensure not already submitted (e.g. by quick stop/start)
                setFinalTranscriptProcessingTrigger(prev => prev + 1); // Trigger AI analysis
            }
        } else { // Recording ended with no text and no specific 'no-speech' error event.
            if (hasMounted) toast({
                title: "Recording Stopped",
                description: "No speech was clearly transcribed.",
            });
            if (!feedbackRef.current && !hasSubmittedTranscriptionRef.current) {
                setFeedback({ isCorrect: false, message: "No speech was detected or captured clearly." });
                setHasSubmittedTranscription(true);
                hasSubmittedTranscriptionRef.current = true;
            }
        }
      };
      
      recognition.start();

    } catch (err) {
      console.error("Error in handleStartRecording:", err);
      let errMsg = "Could not start speech recognition. Ensure microphone is connected and permissions are granted.";
      if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        errMsg = "Microphone access denied. Please enable it in browser settings.";
        setMicrophonePermissionStatus('denied');
      }
      if (hasMounted) toast({ title: "Recording Failed", description: errMsg, variant: "destructive" });
      if (!feedbackRef.current && !hasSubmittedTranscriptionRef.current) {
        setFeedback({ isCorrect: false, message: errMsg });
        setHasSubmittedTranscription(true);
        hasSubmittedTranscriptionRef.current = true;
      }
      setIsRecording(false);
      setIsSpeechApiServiceProcessing(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphonePermissionStatus, hasMounted, toast]);

  const handleStopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop(); 
      // onend will handle state changes and processing trigger
    }
  }, [isRecording]);

  const speakAssistantLine = useCallback(() => {
    if (!currentDialogueLineRef.current || currentDialogueLineRef.current.speaker !== 'ASSISTANT' || !(typeof window !== 'undefined' && 'speechSynthesis' in window)) {
      if (currentDialogueLineRef.current?.speaker === 'ASSISTANT' && !isScenarioFinishedRef.current) { 
        // If TTS not supported but it's assistant's turn, auto-advance.
        setTimeout(() => handleNextLine(), 1000); // Give a brief moment for user to read
      }
      return;
    }

    if (window.speechSynthesis.speaking) { // If already speaking, stop current before starting new
      window.speechSynthesis.cancel();
    }
    
    setIsAssistantSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(currentDialogueLineRef.current.text);
    utterance.lang = 'en-US';
    
    utterance.onend = () => {
      setIsAssistantSpeaking(false);
      // Auto-advance only if it was the assistant's turn and scenario is not finished
      // And it wasn't manually stopped/interrupted by a new call to speakAssistantLine or next line
      if (currentDialogueLineRef.current?.speaker === 'ASSISTANT' && !isScenarioFinishedRef.current && isAssistantSpeakingRef.current) {
        handleNextLine();
      }
    };
    utterance.onerror = (event) => {
      setIsAssistantSpeaking(false);
      if (event.error === 'interrupted') {
        console.log('SpeechSynthesis was interrupted (often normal). Message:', (event as any).message);
      } else {
        console.error('SpeechSynthesis Error:', event.error, (event as any).message);
        if (hasMounted) toast({ title: "Speech Error", description: "Could not play audio. Advancing in 3s.", variant: "destructive" });
         setTimeout(() => {
           if (currentDialogueLineRef.current?.speaker === 'ASSISTANT' && !isScenarioFinishedRef.current) {
             handleNextLine();
           }
         }, 3000);
      }
    };
    window.speechSynthesis.speak(utterance);
  }, [handleNextLine, toast, hasMounted]);


  useEffect(() => {
    if (!hasMounted || isScenarioFinishedRef.current || !currentDialogueLineRef.current) {
      return;
    }
  
    let userAdvanceTimeoutId: NodeJS.Timeout | null = null;
  
    const cleanup = () => {
      if (userAdvanceTimeoutId) clearTimeout(userAdvanceTimeoutId);
    };
      
    if (currentDialogueLineRef.current.speaker === 'ASSISTANT') {
      if (!hasAutoPlayedCurrentAssistantLineRef.current) {
        speakAssistantLine();
        hasAutoPlayedCurrentAssistantLineRef.current = true; 
      }
    } else if (currentDialogueLineRef.current.speaker === 'USER') {
      if (feedbackRef.current?.isCorrect && !isProcessingAiRef.current && hasSubmittedTranscriptionRef.current) {
        userAdvanceTimeoutId = setTimeout(() => {
          if (feedbackRef.current?.isCorrect && currentDialogueLineRef.current?.speaker === 'USER' && !isScenarioFinishedRef.current && hasSubmittedTranscriptionRef.current && !isProcessingAiRef.current) {
              handleNextLine();
          }
        }, 1500);
      }
    }
    return cleanup;
  }, [currentLineIndex, handleNextLine, speakAssistantLine, hasMounted]);


  const handlePlayAssistantLineManual = () => {
    if (currentDialogueLineRef.current?.speaker === 'ASSISTANT') {
        // If already speaking, this will cancel and restart.
        // If not speaking, it will start.
        speakAssistantLine(); 
        hasAutoPlayedCurrentAssistantLineRef.current = true; // Mark as played if manual click
    }
  };


  if (!hasMounted || (microphonePermissionStatus === 'pending' && !isScenarioFinished && currentDialogueLine?.speaker === 'USER')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading & checking microphone...</p>
      </div>
    );
  }

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

  const assistantIsNotSpeaking = typeof window !== 'undefined' && hasMounted ? !window.speechSynthesis?.speaking : true;

  const showPlayAssistantButton = currentDialogueLine.speaker === 'ASSISTANT'; 

  const showNextButton = 
    (currentDialogueLine.speaker === 'ASSISTANT' && (assistantIsNotSpeaking && !isAssistantSpeakingRef.current)) || // Show if assistant is not speaking
    (currentDialogueLine.speaker === 'USER' && feedback && !feedback.isCorrect && !isProcessingAi && hasSubmittedTranscription);


  return (
    <div className="flex flex-col items-center p-4 md:p-8 min-h-full">
      <Card className={`w-full max-w-2xl mx-auto shadow-xl mb-6 ${cardBorderColor}`}>
        <CardHeader>
           <CardTitle className={`font-headline text-2xl ${hasMounted && typeof window !== 'undefined' && window.innerWidth < 768 ? 'md:text-2xl' : 'md:text-3xl'} text-center`}>{scenario.title}</CardTitle>
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
              <p className={`text-xl ${hasMounted && typeof window !== 'undefined' && window.innerWidth < 768 ? 'md:text-xl' : 'md:text-2xl'} font-semibold ${currentDialogueLine.speaker === 'USER' ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>
                {currentDialogueLine.text}
              </p>
            </div>
          </div>

          {currentDialogueLine.speaker === 'USER' && (
            <div className="space-y-4">
              {microphonePermissionStatus === 'denied' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Microphone Access Denied</AlertTitle>
                  <AlertDescription>
                    Please enable microphone permissions in your browser settings and refresh the page to record audio.
                  </AlertDescription>
                </Alert>
              )}
              {microphonePermissionStatus === 'unsupported_api' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Browser Not Supported</AlertTitle>
                  <AlertDescription>
                    The Web Speech API is not supported by your browser. Please try Chrome or Edge.
                  </AlertDescription>
                </Alert>
              )}
               {microphonePermissionStatus === 'unsupported_mic' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Microphone Not Supported</AlertTitle>
                  <AlertDescription>
                    Your browser does not support microphone access (getUserMedia).
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {!isRecording ? (
                  <Button 
                    onClick={handleStartRecording} 
                    disabled={isProcessingAi || isRecording || isSpeechApiServiceProcessing || (feedback?.isCorrect === true && hasSubmittedTranscription) || microphonePermissionStatus !== 'granted' || isAssistantSpeaking} 
                    className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                  >
                    <Mic className="mr-2 h-6 w-6" /> Start Recording
                  </Button>
                ) : (
                  <Button onClick={handleStopRecording} variant="destructive" disabled={isProcessingAi} className={cn("w-full sm:w-auto text-lg px-8 py-6", (isRecording || isSpeechApiServiceProcessing) && "animate-pulse-opacity")}>
                    <Square className="mr-2 h-6 w-6" /> Stop Recording
                  </Button>
                )}
              </div>
              
              {(isRecording || transcribedText || interimTranscription || hasRecordedSomething) && (
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
              
              {isSpeechApiServiceProcessing && !isRecording && !isProcessingAi && ( // Shows when speech service is working but not actively recording (e.g. between result and end)
                 <div className="flex items-center justify-center text-primary mt-4 p-2">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Finalizing recording...</span>
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
                onClick={handlePlayAssistantLineManual} 
                className="text-lg px-6 py-5"
                disabled={isAssistantSpeaking} // Disable if already speaking this line
              >
                <PlayCircle className="mr-2 h-5 w-5" /> 
                {isAssistantSpeaking ? "Playing..." : "Play Assistant Line"}
              </Button>
            </div>
          )}

          {showNextButton && (
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleNextLine} 
                className="text-lg px-6 py-5" 
                disabled={isRecording || isProcessingAi || isSpeechApiServiceProcessing || isAssistantSpeaking || (currentDialogueLine.speaker === 'ASSISTANT' && (typeof window !== 'undefined' && window.speechSynthesis?.speaking && !assistantIsNotSpeaking))}
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
