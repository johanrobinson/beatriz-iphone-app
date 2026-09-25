# Native iOS-spår

Detta är inte en färdig signerad `.ipa`, utan ett startspår för nästa fas.

När du vill gå från PWA till riktig iOS-app gör vi detta:

1. Öppna Xcode.
2. Skapa nytt SwiftUI-projekt: `BeatrizApp`.
3. Lägg in filerna i `native-ios/BeatrizApp`.
4. Sätt din Team-signering i Xcode.
5. Kör på iPhone via USB eller TestFlight.

Första versionen använder en `WKWebView` som visar den deployade Beatriz-webbappen. Det är den snabbaste vägen till en riktig iOS-wrapper.
