const root = document.querySelector('.call-screen');
const startButton = document.getElementById('startCall');
const muteButton = document.getElementById('muteCall');
const endButton = document.getElementById('endCall');
const stateLabel = document.getElementById('connectionState');
const subtitle = document.getElementById('subtitle');
const lastMessage = document.getElementById('lastMessage');
const liveDot = document.getElementById('liveDot');
const clock = document.getElementById('clock');

let recognition;
let synthesis = window.speechSynthesis;
let isListening = false;
let isSpeaking = false;
let conversationHistory = [];
let spanishVoice;

// Find best Spanish voice
function findSpanishVoice() {
  const voices = synthesis.getVoices();
  // Prefer female Spanish voices
  const preferred = voices.find(v =>
    (v.lang.startsWith('es') && v.name.includes('Female')) ||
    (v.lang.startsWith('es') && v.name.includes('Monica')) ||
    (v.lang.startsWith('es') && v.name.includes('Paulina'))
  );
  return preferred || voices.find(v => v.lang.startsWith('es')) || voices[0];
}

// Load voices when available
if (synthesis.onvoiceschanged !== undefined) {
  synthesis.onvoiceschanged = () => {
    spanishVoice = findSpanishVoice();
  };
}
spanishVoice = findSpanishVoice();

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateClock, 15_000);
updateClock();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

function setState(text, active = false) {
  stateLabel.textContent = text;
  liveDot.classList.toggle('active', active);
  root.classList.toggle('talking', active);
}

function setControls(inCall) {
  startButton.disabled = inCall;
  muteButton.disabled = !inCall;
  endButton.disabled = !inCall;
}

function speak(text) {
  return new Promise((resolve) => {
    if (!text || text.trim().length === 0) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = spanishVoice;
    utterance.lang = 'es-ES';
    utterance.rate = 0.85; // Slower for learning
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      isSpeaking = true;
      setState('Beatriz pratar', true);
    };

    utterance.onend = () => {
      isSpeaking = false;
      setState('Lyssnar', false);
      if (isListening) {
        startListening();
      }
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      isSpeaking = false;
      setState('Fel', false);
      resolve();
    };

    synthesis.speak(utterance);
  });
}

function startListening() {
  if (!recognition || isSpeaking) return;

  try {
    recognition.start();
    setState('Lyssnar', false);
  } catch (error) {
    if (error.name !== 'InvalidStateError') {
      console.error('Recognition start error:', error);
    }
  }
}

function stopListening() {
  if (recognition) {
    try {
      recognition.stop();
    } catch (error) {
      console.error('Recognition stop error:', error);
    }
  }
}

async function getBeatrizResponse(userMessage) {
  try {
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    // Keep only last 10 messages to avoid context overflow
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: conversationHistory
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Server error');
    }

    const data = await response.json();
    const beatrizMessage = data.message;

    conversationHistory.push({
      role: 'assistant',
      content: beatrizMessage
    });

    return beatrizMessage;
  } catch (error) {
    console.error('Error getting response:', error);
    return 'Lo siento, tuve un problema. ¿Puedes repetir?';
  }
}

async function startCall() {
  try {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('Tu navegador no soporta reconocimiento de voz. Usa Safari en iPhone.');
    }

    setControls(true);
    lastMessage.textContent = '';
    setState('Iniciando...', false);
    subtitle.textContent = 'Conectando contigo...';

    // Initialize speech recognition
    recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const last = event.results.length - 1;
      const userText = event.results[last][0].transcript;

      lastMessage.textContent = `Tú: ${userText}`;

      // Stop listening while Beatriz responds
      stopListening();
      setState('Pensando...', false);

      // Get Beatriz's response
      const beatrizResponse = await getBeatrizResponse(userText);

      lastMessage.textContent = `Beatriz: ${beatrizResponse}`;

      // Speak the response
      await speak(beatrizResponse);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Restart listening if no speech detected
        if (isListening && !isSpeaking) {
          startListening();
        }
      } else if (event.error === 'not-allowed') {
        lastMessage.textContent = 'Tillåt mikrofon-åtkomst i inställningar.';
        setState('Fel', false);
        endCall();
      } else {
        setState('Lyssnar', false);
      }
    };

    recognition.onend = () => {
      // Restart if still in call and not speaking
      if (isListening && !isSpeaking) {
        setTimeout(() => startListening(), 100);
      }
    };

    isListening = true;

    // Start with Beatriz greeting
    setState('Ansluten', true);
    subtitle.textContent = 'Vamos despacio, frase por frase';

    const greeting = 'Hola Johan, soy Beatriz. ¿Qué tal estás hoy? Vamos despacio, frase por frase.';
    conversationHistory = [];
    lastMessage.textContent = `Beatriz: ${greeting}`;

    await speak(greeting);

  } catch (error) {
    console.error('Start call error:', error);
    lastMessage.textContent = `Fel: ${error.message}`;
    setState('Fel', false);
    await endCall();
  }
}

async function endCall() {
  isListening = false;
  isSpeaking = false;

  stopListening();
  synthesis.cancel();

  recognition = null;
  conversationHistory = [];

  setControls(false);
  setState('Redo', false);
  subtitle.textContent = 'Tu profesora de español';
  lastMessage.textContent = '';
}

function toggleMute() {
  if (!recognition) return;

  isListening = !isListening;

  if (isListening) {
    startListening();
    muteButton.textContent = 'Mikrofon';
    setState('Lyssnar', false);
  } else {
    stopListening();
    muteButton.textContent = 'Slå på mic';
    setState('Tystad', false);
  }
}

startButton.addEventListener('click', startCall);
endButton.addEventListener('click', endCall);
muteButton.addEventListener('click', toggleMute);
