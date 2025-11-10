# 🤖 AI AUTOMATION LAB – SEZON 5 (2.1 → 2.3)

**Okres:** 04.11 → 24.11.2025
**Czas:** 3–4 h / tydzień
**System:** bloki 45 min + co drugi tydzień 90-min deepwork
**Cel końcowy:** stworzyć, zrozumieć i udokumentować pełnego **Mini Bota #1**, działającego w pełnym pipeline → _scrape → save → log → screenshot → report_

---

## 📘 Cel ogólny

Rozwinięcie umiejętności automatyzacji w JavaScripcie / TypeScripcie:

- Praktyczne wykorzystanie asynchroniczności (`Promise`, `async/await`)
- Budowa modularnych pipeline’ów (funkcje → utils → bots)
- Praca z plikami i logami (`fs-extra`)
- Automatyzacja przeglądarki (Playwright)
- Refaktoryzacja, GitHub workflow, README dokumentacja

Efekt po 3 tygodniach: **jeden kompletny bot na publicznym repozytorium**, działający w CLI, z czystą strukturą kodu i logiką gotową do rozbudowy o API / OpenAI.

---

## 🔹 Tydzień 1 (04.11 → 10.11) – Stage 1: Collect + Save + Log

**Cele**

1. Review repo `automation-core` + Housekeeper (`npm run hk:status` → `hk:run`)
2. Stworzyć `src/bots/mini1/scrape.ts` → pobiera dane z `books.toscrape.com`
3. `src/utils/file.ts` → funkcja `writeJSON()` zapisująca dane do `data/out/run-<timestamp>.json`
4. `src/utils/log.ts` → funkcja `appendLog()` dopisywania do `data/logs/run.log`
5. `src/bots/mini1/run.ts` → pipeline `scrape → save → log` + test uruchomienia
6. Każdy moduł testowany osobno, commit po każdym działającym etapie

**KPI**

- `npm run dev` tworzy nowy plik `run-<timestamp>.json` i log.
- Kod czytelny, modularny, bez błędów.
- Commit: `feat: Mini Bot #1 – stage 1 (scrape + save + log)`

---

## 🔹 Tydzień 2 (11.11 → 17.11) – Stage 2: Automation + Screenshots

**Cele**

1. Zainstaluj Playwright → `npm i playwright` → `npx playwright install`
2. Utwórz `src/services/browser.ts` z funkcjami `goto`, `screenshot`, `waitForSelector`.
3. Rozszerz Mini Bota → dla każdego produktu z listy scrape zrób screenshot do `data/screens/`.
4. Obsłuż błędy → try/catch + logowanie `FAIL: <error>` w `run.log`.
5. Ustal porządek plików screens, logi i clean z Housekeepera.

**KPI**

- Każdy run = zrzuty ekranu + log `OK/FAIL`.
- Pipeline stabilny, działa headless.
- Commit: `feat: Mini Bot #1 – stage 2 (browser + screens)`

---

## 🔹 Tydzień 3 (18.11 → 24.11) – Stage 3: Report + Refactor + Release

**Cele**

1. Dodaj `src/services/report.ts` → analiza danych (JSON → średnia cena, liczba produktów itp.)
2. Refaktoryzacja → czytelne utils (`getTimestamp`, `writeJSON`, `appendLog`)
3. Utwórz `README.md` → opis działania, komendy, screens, efekt końcowy.
4. Test pełnego pipeline → `scrape → screenshot → report → log`.
5. Finalny commit + push → `release: Mini Bot #1 v1.0`.

**KPI**

- Bot działa stabilnie z pełnym pipeline.
- Repo czyste, publiczne, zawiera README + screens.
- Gotowość na Stage 4 (API/Telegram/OpenAI).

---

## 📈 Po 3 tygodniach

✅ 1 pełny bot (`Mini Bot #1 v1.0`)
✅ Zrozumienie pełnego pipeline (scrape → save → screenshot → report)
✅ Gotowe repozytorium portfolio na GitHub
✅ Przygotowanie pod integracje API i automatyzacje komercyjne (Sezon 6)
