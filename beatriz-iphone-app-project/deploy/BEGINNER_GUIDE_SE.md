# Nybörjarguide: få Beatriz-appen till din iPhone

## Mål

Du ska få en appikon på din iPhone som öppnar Beatriz i en FaceTime-liknande vy.

## Del 1: Lägg projektet i GitHub

1. Gå till ditt repo: `johanrobinson/beatriz-iphone-app`.
2. Klicka **Add file → Upload files**.
3. Dra in alla filer från detta projekt, eller ladda upp ZIP:en och packa upp lokalt först.
4. Klicka **Commit changes**.

## Del 2: Skapa OpenAI API-nyckel

1. Gå till OpenAI Platform.
2. Skapa en API-nyckel.
3. Spara den privat. Klistra inte in den i ChatGPT eller GitHub.

## Del 3: Deploya till Render

Render är en enkel hostingtjänst för Node-appar.

1. Gå till Render.
2. Klicka **New → Web Service**.
3. Koppla GitHub-repot `beatriz-iphone-app`.
4. Välj root directory: `beatriz-pwa`.
5. Build command:

```bash
npm install
```

6. Start command:

```bash
npm start
```

7. Lägg till environment variable:

```text
OPENAI_API_KEY=din_openai_api_nyckel
```

8. Deploya.

## Del 4: Installera på iPhone

1. Öppna appens HTTPS-länk i Safari på iPhone.
2. Gå till `/install.html`.
3. Tryck på **Dela**-ikonen.
4. Välj **Lägg till på hemskärmen**.
5. Namnge appen `Beatriz`.
6. Starta den från hemskärmen.

## Del 5: Testa

1. Tryck **Starta samtal**.
2. Tillåt mikrofon.
3. Säg: `Hola Beatriz, quiero practicar español.`

## Felsökning

### Mikrofonen fungerar inte

Kontrollera att appen körs via HTTPS. Mikrofon i webbläsaren kräver normalt HTTPS.

### Beatriz svarar inte

Kontrollera att `OPENAI_API_KEY` finns i hostingtjänsten och att kontot har API-krediter.

### Appen öppnas i Safari med adressfält

Öppna sidan i Safari och använd **Dela → Lägg till på hemskärmen**. Starta sedan från ikonen.
