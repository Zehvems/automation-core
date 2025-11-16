/**
 * 🧠 Mini Bot #1 — Stage 1 (Collect + Save + Log) + Stage 2 (Automation + Screens)
 *
 * Wersja: 2.0 (edukacyjna)
 *
 * 🎯 Cel główny:
 * Zbudować pełny pipeline bota:
 *   1. Stage 1 — dane:
 *      - pobiera dane ze strony (https://books.toscrape.com/)
 *      - zapisuje wyniki do pliku JSON w folderze data/out/
 *      - dopisuje log do data/logs/run.log z liczbą pobranych rekordów (OK/FAIL)
 *
 *   2. Stage 2 — automatyzacja przeglądarki:
 *      - otwiera stronę produktów za pomocą Playwright (chromium)
 *      - robi screenshoty wybranych stron do folderu data/screens/
 *      - obsługuje błędy (try/catch) i dopisuje je do run.log
 *
 * ✅ Efekt końcowy:
 * Po uruchomieniu `npm run dev` powstaje:
 *   - plik data/out/run-<timestamp>.json z danymi (Stage 1)
 *   - wpis w data/logs/run.log (OK count=<n> lub FAIL:<error>)
 *   - zrzuty ekranu stron produktów w data/screens/ (Stage 2)
 *
 * Projekt służy do nauki pipeline’u:
 *   scrape → save → log → browser → screenshot
 */

import { run } from "./bots/mini1/run";
(async () => {
  await run();
})();
