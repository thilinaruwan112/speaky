
'use client';

import type { Scenario, DialogueLine } from '@/lib/scenarios';
import { analyzePronunciation, AnalyzePronunciationOutput } from '@/ai/flows/analyze-pronunciation';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mic, Square, ChevronRight, CheckCircle2, XCircle, Loader2, UserCircle2, PlayCircle, AlertTriangle, MessageSquareQuote } from 'lucide-react';
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

type FeedbackState = (AnalyzePronunciationOutput & { rawTranscribedText: string }) | null;


type MicrophonePermissionStatus = 'pending' | 'granted' | 'denied' | 'unsupported_api' | 'unsupported_mic';

export default function PracticePageClient({ scenario }: PracticePageClientProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechApiServiceProcessing, setIsSpeechApiServiceProcessing] = useState(false); // For Web Speech API's own processing time after stop
  const [transcribedText, setTranscribedText] = useState('');
  const [interimTranscription, setInterimTranscription] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isProcessingAi, setIsProcessingAi] = useState(false); // For our Genkit flow processing
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState<MicrophonePermissionStatus>('pending');
  const [finalTranscriptProcessingTrigger, setFinalTranscriptProcessingTrigger] = useState(0);
  const [hasSubmittedTranscription, setHasSubmittedTranscription] = useState(false); 
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [hasRecordedSomething, setHasRecordedSomething] = useState(false); 

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const errorReportedRef = useRef(false); 
  const latestTranscriptionRef = useRef(""); 

  const currentDialogueLineRef = useRef(scenario.dialogue[currentLineIndex]);
  const feedbackRef = useRef(feedback);
  const isProcessingAiRef = useRef(isProcessingAi);
  const isScenarioFinishedRef = useRef(currentLineIndex >= scenario.dialogue.length);
  const hasSubmittedTranscriptionRef = useRef(hasSubmittedTranscription);
  const isAssistantSpeakingRef = useRef(isAssistantSpeaking);
  const hasAutoPlayedCurrentAssistantLineRef = useRef(false); 
  const assistantLineManuallyPlayedRef = useRef(false); 

  useEffect(() => { currentDialogueLineRef.current = scenario.dialogue[currentLineIndex]; }, [scenario.dialogue, currentLineIndex]);
  useEffect(() => { feedbackRef.current = feedback; }, [feedback]);
  useEffect(() => { isProcessingAiRef.current = isProcessingAi; }, [isProcessingAi]);
  useEffect(() => { hasSubmittedTranscriptionRef.current = hasSubmittedTranscription; }, [hasSubmittedTranscription]);
  useEffect(() => { isScenarioFinishedRef.current = currentLineIndex >= scenario.dialogue.length; }, [currentLineIndex, scenario.dialogue.length]);
  useEffect(() => { isAssistantSpeakingRef.current = isAssistantSpeaking; }, [isAssistantSpeaking]);
  
  const currentDialogueLine = scenario.dialogue[currentLineIndex];
  const totalUserLines = scenario.dialogue.filter(line => line.speaker === 'USER').length;
  const userLinesCompleted = scenario.dialogue.slice(0, currentLineIndex).filter(line => line.speaker === 'USER').length;
  const progressPercentage = totalUserLines > 0 ? (userLinesCompleted / totalUserLines) * 100 : 0;
  const isScenarioFinished = currentLineIndex >= scenario.dialogue.length;

  const { toast } = useToast();

  useEffect(() => {
    setHasMounted(true);
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
        if (navigator.permissions && typeof navigator.permissions.query === 'function') {
            const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            if (permission.state === 'granted') {
              setMicrophonePermissionStatus('granted');
            } else if (permission.state === 'prompt') {
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
        } else { 
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicrophonePermissionStatus('granted');
            stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.error("Error checking/requesting microphone permissions:", err);
        setMicrophonePermissionStatus('denied'); 
        if (hasMounted) toast({ variant: "destructive", title: "Microphone Access Error", description: "Could not access microphone. Please check permissions and refresh." });
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
    isAssistantSpeakingRef.current = false;
    hasAutoPlayedCurrentAssistantLineRef.current = false;
    assistantLineManuallyPlayedRef.current = false;

    setCurrentLineIndex(prev => prev + 1);
    
    setTranscribedText('');
    latestTranscriptionRef.current = "";
    setInterimTranscription('');
    setFeedback(null);
    feedbackRef.current = null; 
    setHasSubmittedTranscription(false);
    hasSubmittedTranscriptionRef.current = false; 
    setHasRecordedSomething(false);
    errorReportedRef.current = false;
    setIsProcessingAi(false);
    isProcessingAiRef.current = false;
    setIsSpeechApiServiceProcessing(false); 
    if (recognitionRef.current && isRecording) {
        recognitionRef.current.abort(); // Abort existing recording if any
        setIsRecording(false); 
    }
  }, [isRecording]);


  const processTranscription = useCallback(async (textToProcess: string) => {
    if (!currentDialogueLineRef.current || currentDialogueLineRef.current.speaker !== 'USER') {
      return;
    }
    
    setIsProcessingAi(true);
    isProcessingAiRef.current = true;
    setFeedback(null); // Clear old feedback before new analysis
    feedbackRef.current = null;

    try {
      const result = await analyzePronunciation({
        expectedSentence: currentDialogueLineRef.current.text,
        transcribedSentence: textToProcess.trim(),
      });
      setFeedback({ ...result, rawTranscribedText: textToProcess.trim() });
    } catch (error) {
      console.error("Analysis error:", error);
      setFeedback({ 
        isCorrectAttempt: false, 
        feedback: 'Error analyzing pronunciation. Please try again.',
        grammaticallyCorrectedTranscription: textToProcess.trim(), 
        rawTranscribedText: textToProcess.trim(),
       });
      if (hasMounted) toast({ title: "Analysis Error", description: "Could not analyze pronunciation.", variant: "destructive" });
    } finally {
      setIsProcessingAi(false);
      isProcessingAiRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, hasMounted]);


  useEffect(() => {
    if (finalTranscriptProcessingTrigger === 0 || isRecording || isSpeechApiServiceProcessing) return;
    
    const textToProcess = latestTranscriptionRef.current.trim();
    
    if (hasSubmittedTranscriptionRef.current && feedbackRef.current?.rawTranscribedText === textToProcess && !isProcessingAiRef.current) {
        return;
    }
    
    setHasSubmittedTranscription(true); 
    hasSubmittedTranscriptionRef.current = true;
    
    processTranscription(textToProcess);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscriptProcessingTrigger]);


  const handleStartRecording = useCallback(async () => {
    // Reset all relevant states for a fresh recording attempt
    setTranscribedText('');
    latestTranscriptionRef.current = "";
    setInterimTranscription('');
    setFeedback(null);
    feedbackRef.current = null;
    setHasSubmittedTranscription(false);
    hasSubmittedTranscriptionRef.current = false;
    errorReportedRef.current = false;
    setHasRecordedSomething(false);
    setIsProcessingAi(false); // Ensure AI processing state is also reset
    isProcessingAiRef.current = false;
    setIsSpeechApiServiceProcessing(false);


    if (microphonePermissionStatus !== 'granted') {
      let msg = "Microphone permission is required to record.";
      if (microphonePermissionStatus === 'pending') msg = "Microphone permission check is ongoing. Please wait.";
      else if (microphonePermissionStatus === 'denied') msg = "Microphone permission denied. Please enable it in browser settings and refresh.";
      else if (microphonePermissionStatus === 'unsupported_api') msg = "Speech API not supported. Try Chrome or Edge.";
      else if (microphonePermissionStatus === 'unsupported_mic') msg = "Microphone access (getUserMedia) not supported.";
      
      if (hasMounted) toast({ title: "Cannot Start Recording", description: msg, variant: "destructive" });
      if (!feedbackRef.current) setFeedback({ 
          isCorrectAttempt: false, 
          feedback: msg, 
          rawTranscribedText: '',
      });
      setHasSubmittedTranscription(true);
      hasSubmittedTranscriptionRef.current = true;
      return;
    }

    const SpeechRecognitionAPI = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!SpeechRecognitionAPI) {
      setMicrophonePermissionStatus('unsupported_api'); 
      const msg = "Speech recognition API is not available in your browser. Try Chrome or Edge.";
      if (hasMounted) toast({ variant: "destructive", title: "Browser Not Supported", description: msg});
      if (!feedbackRef.current) setFeedback({ isCorrectAttempt: false, feedback: msg, rawTranscribedText: '' });
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
        setIsSpeechApiServiceProcessing(true);
        setHasRecordedSomething(false);
        if (hasMounted) toast({
          title: "Recording Started",
          description: "Speak your sentence.",
        });
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimDisplay = '';
        let currentFinalTranscriptThisEvent = ''; 

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinalTranscriptThisEvent += transcriptSegment.trim() + ' ';
          } else {
            interimDisplay += transcriptSegment;
          }
        }
        
        setInterimTranscription(interimDisplay);

        if (currentFinalTranscriptThisEvent.trim() !== "") {
          // Accumulate final results directly to latestTranscriptionRef and setTranscribedText
          const newFullFinalText = (latestTranscriptionRef.current + currentFinalTranscriptThisEvent.trim() + ' ').trimStart();
          setTranscribedText(newFullFinalText);
          latestTranscriptionRef.current = newFullFinalText; // Update ref immediately for onend
          setHasRecordedSomething(true);
        } else if (interimDisplay.trim() && !hasRecordedSomething) {
          setHasRecordedSomething(true);
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
           setIsRecording(false); 
           setIsSpeechApiServiceProcessing(false);
           if (!hasRecordedSomething && !feedbackRef.current && !hasSubmittedTranscriptionRef.current) { 
             setFeedback({ isCorrectAttempt: false, feedback: "Recording stopped before any speech was captured.", rawTranscribedText: ''});
             setHasSubmittedTranscription(true); 
             hasSubmittedTranscriptionRef.current = true;
           }
           return; 
        }
        
        if (hasMounted) toast({ title: "Recording Error", description: errorMessage, variant: "destructive" });
        if (!feedbackRef.current && !hasSubmittedTranscriptionRef.current) {
            setFeedback({ isCorrectAttempt: false, feedback: feedbackMessage, rawTranscribedText: '' });
            setHasSubmittedTranscription(true); 
            hasSubmittedTranscriptionRef.current = true;
        }
        setIsRecording(false);
        setIsSpeechApiServiceProcessing(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        setIsSpeechApiServiceProcessing(false); 

        if (errorReportedRef.current) { 
            return; 
        }
        
        const finalTranscribedText = latestTranscriptionRef.current.trim();

        if (finalTranscribedText !== "") { 
            if (hasMounted) toast({
                title: "Recording Finished",
                description: "Processing your speech...",
            });
            if (!hasSubmittedTranscriptionRef.current || feedbackRef.current?.rawTranscribedText !== finalTranscribedText) {
                setFinalTranscriptProcessingTrigger(prev => prev + 1);
            }
        } else { 
            if (hasMounted) toast({
                title: "Recording Finished",
                description: "No speech was clearly transcribed.",
            });
            if (!feedbackRef.current && !hasSubmittedTranscriptionRef.current) {
                setFeedback({ isCorrectAttempt: false, feedback: "No speech was detected or captured clearly. Please try again.", rawTranscribedText: '' });
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
        setFeedback({ isCorrectAttempt: false, feedback: errMsg, rawTranscribedText: '' });
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
    }
  }, [isRecording]);

  const speakAssistantLine = useCallback(() => {
    if (!currentDialogueLineRef.current || currentDialogueLineRef.current.speaker !== 'ASSISTANT' || !(typeof window !== 'undefined' && 'speechSynthesis' in window)) {
      if (currentDialogueLineRef.current?.speaker === 'ASSISTANT' && !isScenarioFinishedRef.current) { 
        if (!isMobileView || (isMobileView && !assistantLineManuallyPlayedRef.current)) {
             setTimeout(() => {
                 if (currentDialogueLineRef.current?.speaker === 'ASSISTANT' && !isScenarioFinishedRef.current && (!isMobileView || !assistantLineManuallyPlayedRef.current)) {
                    handleNextLine();
                 }
             }, 1000);
        }
      }
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); 
    }
    
    setIsAssistantSpeaking(true);
    isAssistantSpeakingRef.current = true;
    const utterance = new SpeechSynthesisUtterance(currentDialogueLineRef.current.text);
    utterance.lang = 'en-US';
    
    utterance.onend = () => {
      setIsAssistantSpeaking(false);
      isAssistantSpeakingRef.current = false;
      if (currentDialogueLineRef.current?.speaker === 'ASSISTANT' && !isScenarioFinishedRef.current && !isMobileView) {
        handleNextLine();
      }
    };
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      setIsAssistantSpeaking(false);
      isAssistantSpeakingRef.current = false;
      if (event.error === 'interrupted') {
        console.log('SpeechSynthesis was interrupted (often normal).');
      } else {
        console.error('SpeechSynthesis Error:', event.error, (event as any).message);
        if (hasMounted) toast({ title: "Speech Error", description: "Could not play audio. Advancing in 3s (desktop) or click Next (mobile).", variant: "destructive" });
         setTimeout(() => {
           if (currentDialogueLineRef.current?.speaker === 'ASSISTANT' && !isScenarioFinishedRef.current && !isMobileView) { 
             handleNextLine();
           }
         }, 3000);
      }
    };
    window.speechSynthesis.speak(utterance);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleNextLine, toast, hasMounted, isMobileView]);


  useEffect(() => {
    if (!hasMounted || isScenarioFinishedRef.current || !currentDialogueLineRef.current) {
      return;
    }
  
    let userAdvanceTimeoutId: NodeJS.Timeout | null = null;
  
    const cleanup = () => {
      if (userAdvanceTimeoutId) clearTimeout(userAdvanceTimeoutId);
    };
      
    if (currentDialogueLineRef.current.speaker === 'ASSISTANT') {
      if (!isMobileView && !hasAutoPlayedCurrentAssistantLineRef.current) {
        speakAssistantLine();
        hasAutoPlayedCurrentAssistantLineRef.current = true; 
      }
    } else if (currentDialogueLineRef.current.speaker === 'USER') {
      if (feedback?.isCorrectAttempt && !isProcessingAiRef.current && hasSubmittedTranscriptionRef.current) {
        userAdvanceTimeoutId = setTimeout(() => {
          if (feedbackRef.current?.isCorrectAttempt && 
              currentDialogueLineRef.current?.speaker === 'USER' && 
              !isScenarioFinishedRef.current && 
              hasSubmittedTranscriptionRef.current && 
              !isProcessingAiRef.current) {
            handleNextLine();
          }
        }, 1500);
      }
    }
    return cleanup;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLineIndex, feedback, handleNextLine, speakAssistantLine, hasMounted]); 


  const handlePlayAssistantLineManual = () => {
    if (currentDialogueLineRef.current?.speaker === 'ASSISTANT') {
        assistantLineManuallyPlayedRef.current = true; 
        speakAssistantLine(); 
    }
  };

  if (!hasMounted && !isScenarioFinished) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading & preparing experience...</p>
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

  const showPlayAssistantButton = currentDialogueLine.speaker === 'ASSISTANT'; 

  const showNextButton = 
    (currentDialogueLine.speaker === 'ASSISTANT' && isMobileView && !isAssistantSpeakingRef.current) ||
    (currentDialogueLine.speaker === 'USER' && 
     feedback && !feedback.isCorrectAttempt && 
     !isProcessingAiRef.current && 
     hasSubmittedTranscriptionRef.current && 
     !isRecording && !isSpeechApiServiceProcessing);

  // Determine what text to display in the "You said:" box
  let displayedTranscriptionText = transcribedText; // Default to current raw transcription from state
  if (feedback) {
    // If feedback is available, prioritize showing the AI's corrected version if it's different
    if (typeof feedback.grammaticallyCorrectedTranscription === 'string' &&
        feedback.grammaticallyCorrectedTranscription !== feedback.rawTranscribedText) {
      displayedTranscriptionText = feedback.grammaticallyCorrectedTranscription;
    } else {
      // Otherwise, show the raw text that was analyzed by the AI
      displayedTranscriptionText = feedback.rawTranscribedText;
    }
  }


  return (
    <div className="flex flex-col items-center p-4 md:p-8 min-h-full">
      <Card className={`w-full max-w-2xl mx-auto shadow-xl mb-6 ${cardBorderColor}`}>
        <CardHeader>
           <CardTitle className={`font-headline text-2xl ${hasMounted && isMobileView ? 'text-2xl' : 'md:text-3xl'} text-center`}>{scenario.title}</CardTitle>
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
              <p className={`text-xl ${hasMounted && isMobileView ? 'text-xl' : 'md:text-2xl'} font-semibold ${currentDialogueLine.speaker === 'USER' ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>
                {currentDialogueLine.text}
              </p>
            </div>
          </div>

          {currentDialogueLine.speaker === 'USER' && (
            <div className="space-y-4">
              {microphonePermissionStatus === 'pending' && !isScenarioFinished && (
                <Alert variant="default">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertTitle>Microphone Check</AlertTitle>
                  <AlertDescription>
                    Checking microphone permissions...
                  </AlertDescription>
                </Alert>
              )}
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
                    disabled={isProcessingAiRef.current || isRecording || isSpeechApiServiceProcessing || (feedback?.isCorrectAttempt === true && hasSubmittedTranscriptionRef.current) || microphonePermissionStatus !== 'granted' || isAssistantSpeakingRef.current} 
                    className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                  >
                    <Mic className="mr-2 h-6 w-6" /> Start Recording
                  </Button>
                ) : (
                  <Button onClick={handleStopRecording} variant="destructive" disabled={isProcessingAiRef.current} className={cn("w-full sm:w-auto text-lg px-8 py-6", (isRecording || isSpeechApiServiceProcessing) && "animate-pulse-opacity")}>
                    <Square className="mr-2 h-6 w-6" /> Stop Recording
                  </Button>
                )}
              </div>
              
              {(isRecording || interimTranscription || transcribedText || (feedback && feedback.rawTranscribedText) || hasRecordedSomething) && (
                 <div className="mt-4 p-4 border rounded-md bg-background min-h-[60px]">
                    <p className="text-sm text-muted-foreground">
                        {(isRecording && !interimTranscription && !transcribedText && !feedback) ? "Listening..." : "You said:"}
                    </p>
                    <p className="text-lg">
                        {displayedTranscriptionText}
                        {isRecording && !feedback && interimTranscription && (
                          <span className="text-muted-foreground">{interimTranscription}</span>
                        )}
                    </p>
                 </div>
              )}

              {isProcessingAiRef.current && (
                <div className="flex items-center justify-center text-primary mt-4 p-2">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Analyzing pronunciation & grammar...</span>
                </div>
              )}
              
              {isSpeechApiServiceProcessing && !isRecording && !isProcessingAiRef.current && (
                 <div className="flex items-center justify-center text-primary mt-4 p-2">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Finalizing recording...</span>
                 </div>
              )}


              {feedback && !isProcessingAiRef.current && ( 
                <Alert variant={feedback.isCorrectAttempt ? "default" : "destructive"} className={`mt-4 ${feedback.isCorrectAttempt ? 'bg-accent/20 border-accent' : ''}`}>
                  {feedback.isCorrectAttempt ? <CheckCircle2 className="h-5 w-5 text-accent-foreground" /> : <XCircle className="h-5 w-5" />}
                  <AlertTitle className={`font-headline ${feedback.isCorrectAttempt ? 'text-accent-foreground' : ''}`}>
                    {feedback.isCorrectAttempt ? 'Good Attempt!' : 'Needs Improvement'}
                  </AlertTitle>
                  <AlertDescription className={`${feedback.isCorrectAttempt ? 'text-accent-foreground' : ''}`}>
                    {feedback.feedback}
                  </AlertDescription>
                  {/* Display the suggestion clearly if a correction was made and it's different from raw */}
                  {feedback.grammaticallyCorrectedTranscription && 
                   typeof feedback.grammaticallyCorrectedTranscription === 'string' && /* Ensure it's a string */
                   feedback.grammaticallyCorrectedTranscription !== feedback.rawTranscribedText && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-sm font-semibold flex items-center">
                            <MessageSquareQuote className="w-4 h-4 mr-2"/>
                            Suggestion:
                        </p>
                        <p className="italic">{feedback.grammaticallyCorrectedTranscription}</p>
                    </div>
                  )}
                </Alert>
              )}
            </div>
          )}
          
          {showPlayAssistantButton && ( 
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handlePlayAssistantLineManual} 
                className="text-lg px-6 py-5"
                disabled={isAssistantSpeakingRef.current} 
              >
                <PlayCircle className="mr-2 h-5 w-5" /> 
                {isAssistantSpeakingRef.current ? "Playing..." : "Play Assistant Line"}
              </Button>
            </div>
          )}

          {showNextButton && (
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleNextLine} 
                className="text-lg px-6 py-5" 
                disabled={isRecording || isProcessingAiRef.current || isSpeechApiServiceProcessing || isAssistantSpeakingRef.current }
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
