const fs = require('fs');

function replaceVoiceLogic(file) {
  let content = fs.readFileSync(file, 'utf8');

  const fullRegex = /const recognitionRef = useRef<any>\(null\);[\s\S]*?\}, 2500\);\n  \};\n/;
  const newLogic = `const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<any>(null);

  const toggleVoiceInput = () => {
    if (isListening) {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      setIsListening(false);
      // Wait, let the send button trigger handleSendText if clicked, 
      // but here we just manually stop it. If they click Voice again, it just stops.
      if (inputText.trim()) {
        // Auto send if they tap the voice button to stop
        setTimeout(() => handleSendText(inputText), 10);
      }
      return;
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setInputText('');
        };

        recognition.onresult = (event: any) => {
          let transcript = '';
          const isAndroid = /Android/i.test(navigator.userAgent);
          if (isAndroid) {
            transcript = event.results[event.results.length - 1][0].transcript;
          } else {
            transcript = Array.from(event.results as any)
              .map((result: any) => result[0].transcript)
              .join('');
          }
          setInputText(transcript);

          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

          silenceTimeoutRef.current = setTimeout(() => {
            if (transcript.trim()) {
              try { recognition.stop(); } catch (e) {}
              setIsListening(false);
              handleSendText(transcript);
            } else {
              try { recognition.stop(); } catch (e) {}
              setIsListening(false);
            }
          }, 1500);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      }
    }

    // Mock fallback
    setIsListening(true);
    setInputText('I had a grilled chicken salad with olive oil for lunch...');
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      setIsListening(false);
      handleSendText('I had a grilled chicken salad with olive oil for lunch');
    }, 2500);
  };
`;

  content = content.replace(fullRegex, newLogic);
  fs.writeFileSync(file, content);
  console.log('Fixed voice logic in ' + file);
}

replaceVoiceLogic('mobile/app/(tabs)/liva-home.tsx');
replaceVoiceLogic('mobile/app/liva-chat.tsx');

