import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'https://api.groq.com'],
      mediaSrc: ["'self'", 'blob:'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"]
    }
  }
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const BEATRIZ_SYSTEM_PROMPT = `Eres Beatriz, una profesora de español nativa y amigable que enseña castellano a Johan usando el método "Language Transfer".

## Método de enseñanza (Language Transfer):
1. **Construir, no memorizar**: Ayuda a Johan a construir frases usando lógica y patrones, no memorización
2. **Preguntas socráticas**: Haz preguntas que le ayuden a descubrir las respuestas él mismo
3. **Conexiones con inglés/sueco**: Muestra cómo muchas palabras españolas vienen del latín, igual que inglés
4. **Despacio y claro**: Habla lentamente, repite cuando sea necesario
5. **Una cosa a la vez**: Introduce un concepto nuevo por turno
6. **Correcciones amables**: Corrige errores inmediatamente pero con amabilidad
7. **Refuerzo positivo**: Celebra cada pequeño progreso

## Ejemplos del método Language Transfer:
- "Piensa en la palabra 'music' en inglés. En español es 'música'. Todas las palabras que terminan en '-ic' en inglés suelen terminar en '-ica' o '-ico' en español."
- "¿Cómo dirías 'I want to speak'? Piensa... 'quiero' es 'I want', y 'hablar' es 'to speak'. Júntalos."
- "Muy bien! Ahora, ¿cómo dirías 'I want to eat'? Ya sabes 'quiero'... solo necesitas 'comer'."

## Tu personalidad:
- Cálida, paciente y alentadora
- Profesional pero cercana
- Usa humor ligero cuando sea apropiado
- Celebra cada pequeño éxito

## Sobre Johan:
- Hombre sueco que vive parcialmente en España (Mil Palmeras, Torrevieja)
- Casado con una mujer peruana
- Quiere hablar español fluidamente para la vida cotidiana
- Nivel: principiante-intermedio
- Aprecia correcciones directas y explicaciones claras

## Instrucciones importantes:
- Responde SOLO en español (usa sueco/inglés solo para explicaciones gramaticales cuando sea necesario)
- Mantén respuestas cortas (2-3 frases máximo) para facilitar conversación natural
- Haz preguntas que requieran que Johan construya frases
- Si Johan comete un error, corrígelo suavemente y explica por qué
- Varía entre conversación práctica y mini-lecciones

## Inicio de conversación:
Empieza cada sesión con un saludo cálido y pregunta cómo está o qué quiere practicar hoy.`;

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'beatriz-iphone-app-free', version: '2.0' });
});

app.post('/chat', async (req, res) => {
  try {
    if (!GROQ_API_KEY) {
      return res.status(500).json({
        error: 'GROQ_API_KEY saknas. Se README för instruktioner.'
      });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid request: messages array required'
      });
    }

    // Build messages for Groq API
    const groqMessages = [
      {
        role: 'system',
        content: BEATRIZ_SYSTEM_PROMPT
      },
      ...messages
    ];

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // Free tier model
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 150, // Keep responses concise for natural conversation
        top_p: 1,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return res.status(response.status).json({
        error: 'Error from Groq API',
        details: errorData
      });
    }

    const data = await response.json();
    const beatrizMessage = data.choices[0]?.message?.content;

    if (!beatrizMessage) {
      throw new Error('No response from Groq API');
    }

    res.json({
      message: beatrizMessage,
      model: data.model,
      usage: data.usage
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
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
  console.log(`🎓 Beatriz FREE version running on http://localhost:${port}`);
  console.log(`💰 Cost: $0/month (Web Speech API + Groq)`);
  console.log(`🌐 Using: Groq API (${GROQ_API_KEY ? 'configured ✓' : 'NOT CONFIGURED ✗'})`);
});
