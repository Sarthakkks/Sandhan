import { useState, useCallback, useRef } from 'react';
import { bhashiniApi } from '../api/client';
import { useAppStore } from '../store/appStore';
import toast from 'react-hot-toast';

export const useBhashini = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { language } = useAppStore();
  
  const translations = useRef<Record<string, string>>({});

  const translate = useCallback(async (text: string, targetLang?: string) => {
    const lang = targetLang || language;
    if (lang === 'en') return text;
    
    const cacheKey = `${text}_${lang}`;
    if (translations.current[cacheKey]) {
      return translations.current[cacheKey];
    }
    
    try {
      const data = await bhashiniApi.translate(text, 'en', lang);
      translations.current[cacheKey] = data.translatedText;
      return data.translatedText;
    } catch (err) {
      return text;
    }
  }, [language]);

  const translateBatch = useCallback(async (texts: string[], targetLang?: string) => {
    return Promise.all(texts.map(t => translate(t, targetLang)));
  }, [translate]);

  const speakResponse = useCallback((text: string, lang: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }, []);

  const processVoiceQuery = useCallback((queryText: string) => {
    setTranscript(queryText);
    const q = queryText.toLowerCase();

    let responseMsg = '';
    let responseHi = '';

    if (q.includes('imei') || q.includes('device') || q.includes('आईएमईआई') || q.includes('डिवाइस')) {
      responseMsg = 'High Risk IMEI 490154203237518 detected. 75% risk score, SIM switching observed.';
      responseHi = '75% जोखिम वाला संदिग्ध आईएमईआई नोड 490154203237518 पाया गया।';
    } else if (q.includes('risk') || q.includes('lead') || q.includes('जोखिम') || q.includes('संदिग्ध')) {
      responseMsg = 'Found 5 ranked investigative leads. Top suspect IMEI score is 75%.';
      responseHi = '5 प्राथमिकता सुराग पाए गए। शीर्ष संदिग्ध आईएमईआई जोखिम 75% है।';
    } else if (q.includes('path') || q.includes('trail') || q.includes('upi') || q.includes('फंड')) {
      responseMsg = 'UPI transaction trail mapped: victim to mule to intermediary to cashout.';
      responseHi = 'यूपीआई लेन-देन का मुख्य धोखाधड़ी मार्ग मैप किया गया।';
    } else {
      responseMsg = `Processed voice query: "${queryText}". Searching graph...`;
      responseHi = `वॉयस कमांड: "${queryText}" संसाधित किया गया।`;
    }

    const spokenText = language === 'hi' ? responseHi : responseMsg;
    toast.success(`🎙️ "${queryText}"\n🔊 ${spokenText}`, { duration: 6000, id: 'voice-query' });
    speakResponse(spokenText, language);
  }, [language, speakResponse]);

  const startRecording = useCallback(async () => {
    // Try browser WebSpeech API first
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
          toast.loading(`🎙️ Listening in ${language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}... Speak now!`, { id: 'voice-listen' });
        };

        recognition.onresult = (event: any) => {
          toast.dismiss('voice-listen');
          const speechResult = event.results[0][0].transcript;
          processVoiceQuery(speechResult);
        };

        recognition.onerror = (event: any) => {
          toast.dismiss('voice-listen');
          setIsRecording(false);
          toast.error(`Voice input error: ${event.error}`);
        };

        recognition.onend = () => {
          setIsRecording(false);
          toast.dismiss('voice-listen');
        };

        recognition.start();
        return;
      } catch (e) {
        // Fallback to MediaRecorder
      }
    }

    // MediaRecorder Fallback
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        try {
          toast.loading('Processing Bhashini ASR audio...', { id: 'asr' });
          const data = await bhashiniApi.asr(audioBlob, language);
          processVoiceQuery(data.text || 'Search high risk IMEI');
          toast.success('Bhashini Audio Processed', { id: 'asr' });
        } catch (err) {
          toast.error('Failed to process audio', { id: 'asr' });
        }
      };

      recorder.start();
      setIsRecording(true);
      toast.loading(`🎙️ Recording audio for Bhashini ASR...`, { id: 'asr' });
    } catch (err) {
      toast.error('Microphone access denied. Please allow mic permissions.');
    }
  }, [language, processVoiceQuery]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
  }, [isRecording]);

  return { translate, translateBatch, startRecording, stopRecording, isRecording, transcript };
};
