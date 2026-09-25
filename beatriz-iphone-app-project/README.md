# Beatriz iPhone App

Detta är ett komplett startprojekt för en iPhone-vänlig Beatriz-app.

Projektet är gjort för att vara så enkelt som möjligt för en nybörjare:

- Du behöver inte kunna apputveckling.
- Du behöver inte Xcode i första versionen.
- Du deployar appen som en webbapp/PWA.
- Sedan installerar du den på iPhone via Safari: **Dela → Lägg till på hemskärmen**.

## Vad du får

- FaceTime-liknande samtalsvy.
- Beatriz-avatar med subtil rörelse så att det känns mer levande.
- Mikrofonbaserat röstläge via OpenAI Realtime API.
- Beatriz-persona enligt Language Transfer-metoden.
- Långsammare spanska, korrigeringar, repetition och svenska/engelska förklaringar vid behov.
- Installationssida för iPhone.
- Native iOS-startspår för senare SwiftUI/Xcode-version.

## Viktigt

Detta är inte en signerad iOS `.ipa`. En riktig iPhone-app som installeras direkt som `.ipa` kräver Apple Developer-konto, Xcode-signering och provisioning. Den här versionen är därför byggd som en PWA, vilket är den snabbaste vägen till en appikon på din iPhone.

## Snabb väg

1. Ladda upp projektet till GitHub.
2. Deploya mappen `beatriz-pwa` till Render/Railway/Fly.io.
3. Lägg till environment variable `OPENAI_API_KEY`.
4. Öppna appens HTTPS-länk på iPhone.
5. Tryck **Dela → Lägg till på hemskärmen**.

Se `deploy/BEGINNER_GUIDE_SE.md` för steg-för-steg.
