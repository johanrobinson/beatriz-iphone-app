const root = document.querySelector('.call-screen');
const startButton = document.getElementById('startCall');
const muteButton = document.getElementById('muteCall');
const endButton = document.getElementById('endCall');
const stateLabel = document.getElementById('connectionState');
const subtitle = document.getElementById('subtitle');
const lastMessage = document.getElementById('lastMessage');
const liveDot = document.getElementById('liveDot');
const remoteAudio = document.getElementById('remoteAudio');
const clock = document.getElementById('clock');

let peerConnection;
let dataChannel;
let localStream;
let muted = false;

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

function handleRealtimeEvent(event) {
  if (!event || !event.type) return;

  if (event.type === 'response.audio_transcript.delta') {
    lastMessage.textContent = (lastMessage.textContent || '') + (event.delta || '');
    setState('Beatriz pratar', true);
  }

  if (event.type === 'response.audio_transcript.done') {
    setState('Lyssnar', false);
  }

  if (event.type === 'conversation.item.input_audio_transcription.completed') {
    const transcript = event.transcript ? `Du: ${event.transcript}` : '';
    if (transcript) lastMessage.textContent = transcript;
  }

  if (event.type === 'error') {
    console.error(event);
    lastMessage.textContent = event.error?.message || 'Ett fel uppstod.';
    setState('Fel', false);
  }
}

async function startCall() {
  try {
    setControls(true);
    lastMessage.textContent = '';
    setState('Ansluter...', false);
    subtitle.textContent = 'Conectando contigo...';

    const sessionResponse = await fetch('/session', { method: 'POST' });
    const session = await sessionResponse.json();

    if (!sessionResponse.ok) {
      throw new Error(session.error || 'Kunde inte skapa session.');
    }

    const clientSecret = session.client_secret?.value;
    if (!clientSecret) {
      throw new Error('Servern returnerade ingen client_secret.');
    }

    peerConnection = new RTCPeerConnection();

    peerConnection.ontrack = event => {
      remoteAudio.srcObject = event.streams[0];
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        setState('Samtal aktivt', true);
        subtitle.textContent = 'Vamos despacio, frase por frase';
      }
      if (['disconnected', 'failed', 'closed'].includes(peerConnection.connectionState)) {
        setState('Avslutat', false);
      }
    };

    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }

    dataChannel = peerConnection.createDataChannel('oai-events');
    dataChannel.addEventListener('message', message => {
      try {
        handleRealtimeEvent(JSON.parse(message.data));
      } catch (error) {
        console.warn('Could not parse event', message.data);
      }
    });

    dataChannel.addEventListener('open', () => {
      dataChannel.send(JSON.stringify({
        type: 'response.create',
        response: {
          modalities: ['audio', 'text'],
          instructions: 'Saluda a Johan como Beatriz y empieza una práctica corta de español. Habla despacio.'
        }
      }));
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const sdpResponse = await fetch('https://api.openai.com/v1/realtime?model=gpt-realtime', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${clientSecret}`,
        'Content-Type': 'application/sdp'
      },
      body: offer.sdp
    });

    if (!sdpResponse.ok) {
      throw new Error(await sdpResponse.text());
    }

    const answerSdp = await sdpResponse.text();
    await peerConnection.setRemoteDescription({ type: 'answer', sdp: answerSdp });
    setState('Lyssnar', true);
  } catch (error) {
    console.error(error);
    lastMessage.textContent = `Fel: ${error.message}`;
    setState('Fel', false);
    await endCall();
  }
}

async function endCall() {
  if (dataChannel) {
    try { dataChannel.close(); } catch {}
    dataChannel = null;
  }
  if (peerConnection) {
    try { peerConnection.close(); } catch {}
    peerConnection = null;
  }
  if (localStream) {
    for (const track of localStream.getTracks()) track.stop();
    localStream = null;
  }
  remoteAudio.srcObject = null;
  muted = false;
  muteButton.textContent = 'Mikrofon';
  setControls(false);
  setState('Redo', false);
  subtitle.textContent = 'Tu profesora de español';
}

function toggleMute() {
  if (!localStream) return;
  muted = !muted;
  for (const track of localStream.getAudioTracks()) track.enabled = !muted;
  muteButton.textContent = muted ? 'Slå på mic' : 'Mikrofon';
}

startButton.addEventListener('click', startCall);
endButton.addEventListener('click', endCall);
muteButton.addEventListener('click', toggleMute);
