import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const model = process.env.REALTIME_MODEL || 'gpt-realtime';
const voice = process.env.REALTIME_VOICE || 'shimmer';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'https://api.openai.com'],
      mediaSrc: ["'self'", 'blob:'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"]
    }
  }
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const BEATRIZ_INSTRUCTIONS = `
Du är Beatriz, en vuxen spansk språktränare och samtalspartner för Johan.
Du hjälper Johan att lära sig castellano/spanska genom en metod inspirerad av Language Transfer.

Pedagogisk metod:
- För en naturlig dialog på spanska.
- Tala långsamt, tydligt och vänligt.
- Låt Johan först försöka bygga meningen själv.
- Korrigera hans spanska direkt men kort.
- Förklara varför korrigeringen behövs.
- Använd svenska eller engelska kort när det gör grammatiken tydligare.
- Ge enkla frågor, en i taget.
- Sammanfatta gärna i slutet: vad han gjorde bra, viktiga korrigeringar och 2-3 retos för nästa gång.

Persona:
- Du är varm, charmig, coqueta, sensuell i tonen men professionell och respektfull.
- Du kan rollspela som Beatriz i ett videosamtal.
- Håll allt vuxet, respektfullt och icke-explicit.
- Undvik explicit sexuella detaljer.

Johan:
- Svensk man som vill bli flytande i spanska privat och professionellt.
- Han har anknytning till Spanien, Mil Palmeras, Torrevieja och en peruansk fru.
- Han vill kunna prata naturligt med spanjorer.
- Han uppskattar direkta korrigeringar, långsamt tempo och praktiska fraser.

Starta gärna med:
"Hola Johan, soy Beatriz. ¿Qué tal estás hoy? Vamos despacio, frase por frase."
`;

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'beatriz-iphone-app' });
});

app.post('/session', async (_req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OPENAI_API_KEY saknas på servern. Lägg in den som environment variable.'
      });
    }

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        voice,
        instructions: BEATRIZ_INSTRUCTIONS,
        modalities: ['audio', 'text'],
        input_audio_transcription: {
          model: 'gpt-4o-mini-transcribe'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 800
        }
      })
    });

    const body = await response.json();

    if (!response.ok) {
      console.error('OpenAI session error', body);
      return res.status(response.status).json({
        error: 'Kunde inte skapa Realtime-session.',
        details: body
      });
    }

    res.json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Serverfel när session skulle skapas.' });
  }
});

app.get('/install/beatriz.mobileconfig', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const profile = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>FullScreen</key><true/>
      <key>Icon</key><data></data>
      <key>IsRemovable</key><true/>
      <key>Label</key><string>Beatriz</string>
      <key>PayloadDescription</key><string>Beatriz iPhone Web Clip</string>
      <key>PayloadDisplayName</key><string>Beatriz</string>
      <key>PayloadIdentifier</key><string>se.johanrobinson.beatriz.webclip</string>
      <key>PayloadType</key><string>com.apple.webClip.managed</string>
      <key>PayloadUUID</key><string>7AA13E58-3C97-4EDC-A5EF-BEATRIZ00001</string>
      <key>PayloadVersion</key><integer>1</integer>
      <key>Precomposed</key><true/>
      <key>URL</key><string>${baseUrl}/</string>
    </dict>
  </array>
  <key>PayloadDescription</key><string>Installera Beatriz på hemskärmen</string>
  <key>PayloadDisplayName</key><string>Beatriz iPhone App</string>
  <key>PayloadIdentifier</key><string>se.johanrobinson.beatriz.profile</string>
  <key>PayloadOrganization</key><string>Johan Robinson</string>
  <key>PayloadRemovalDisallowed</key><false/>
  <key>PayloadType</key><string>Configuration</string>
  <key>PayloadUUID</key><string>911BF829-078E-48A6-B0BA-BEATRIZ00002</string>
  <key>PayloadVersion</key><integer>1</integer>
</dict>
</plist>`;

  res.setHeader('Content-Type', 'application/x-apple-aspen-config');
  res.setHeader('Content-Disposition', 'attachment; filename="beatriz.mobileconfig"');
  res.send(profile);
});

app.listen(port, () => {
  console.log(`Beatriz app running on http://localhost:${port}`);
});
