const fs = require('fs');

function injectVoice(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace old toggleVoiceInput with robust web speech API
  const oldFuncRegex = /const toggleVoiceInput = \(\) => \{[\s\S]*?if \(!isListening\) \{.*?\}[\s\S]*?\n  \};\n/;
  const newFunc = `const recognitionRef = useRef<any>(null);

  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setInputText('');
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInputText(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
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
    setTimeout(() => {
      setInputText('I had a grilled chicken salad with olive oil for lunch');
      setIsListening(false);
    }, 2500);
  };
`;

  content = content.replace(oldFuncRegex, newFunc);
  fs.writeFileSync(file, content);
  console.log('Injected real voice logic in ' + file);
}

injectVoice('mobile/app/(tabs)/liva-home.tsx');
injectVoice('mobile/app/liva-chat.tsx');

