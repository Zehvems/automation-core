/**
 * 🧠 Mini Bot #1 — Stage 1 (Collect + Log)
 *
 * Wersja: 1.0 (minimalna, edukacyjna)
 *
 * 🎯 Cel główny:
 * Utworzyć działający pipeline automatyzacji:
 *   1. Pobiera dane ze strony (https://books.toscrape.com/)
 *   2. Zapisuje wyniki do pliku JSON w folderze data/out/
 *   3. Dopisuje log do data/logs/run.log z liczbą pobranych rekordów
 *
 * ✅ Efekt końcowy:
 * Po uruchomieniu `npm run dev` powstaje:
 *   - plik data/out/run-<timestamp>.json z danymi
 *   - wpis w data/logs/run.log (OK count=<n>)
 *
 * Projekt służy do nauki pipeline’u scrape → save → log
 * bez użycia Playwrighta i bazy danych (to pojawi się w Stage 2).
 */

import { run } from "./bots/mini1/run";
(async () => {
  await run();
})();
