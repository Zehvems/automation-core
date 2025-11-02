# 🤖 AI AUTOMATION LAB – SEZON 5

**Okres:** 07.10 → 03.11.2025
**Czas:** 3–5 h / tydzień
**System:** bloki 45 min + co drugi tydzień 90-min deep work
**Cel końcowy:** stworzyć prostego bota, który zbiera dane z wybranej strony i je przetwarza

---

## 📘 Cel ogólny

Nauka automatyzacji z użyciem JavaScript (Node.js):

- Scraping (zbieranie danych)
- Automatyzacja przeglądarki (Playwright)
- API i boty (Telegram, OpenAI – później)

Celem do końca roku jest stworzenie 1–2 mini-botów gotowych do portfolio.
GitHub zostanie uruchomiony w 3. tygodniu.

---

## 🔹 Tydzień 1 (07.10 → 13.10) – Setup + Pierwszy Scraper

**Cele:**

1. Zainstaluj Node.js i stwórz folder `automation-lab`.
2. `npm init -y`, następnie zainstaluj `axios`, `cheerio`, `dotenv`.
3. Powtórz JS-podstawy: moduły, import/export, async/await.
4. Stwórz scraper: `books.toscrape.com` → wypisz tytuły i ceny w konsoli.
5. Zrób krótką notatkę: _„Jak działał scraper? Co było trudne?”_

**KPI:**

- Kod działa i pokazuje min. 10 produktów.
- Rozumiesz różnicę między stroną statyczną a dynamiczną.

---

## 🔹 Tydzień 2 (14.10 → 20.10) – Zbieranie i zapisywanie danych

**Cele:**

1. Poznaj `fs.writeFile` – zapis do pliku.
2. Zapisz wyniki scrapera do CSV (`title, price, link`).
3. Dodaj bazę SQLite (`better-sqlite3`).
4. Stwórz funkcję porównującą nowy run z poprzednim (diff).
5. Mini-projekt: alert w konsoli, jeśli cena się zmieniła.

**KPI:**

- Pipeline działa: scrape → save → diff.

---

## 🔹 Tydzień 3 (21.10 → 27.10) – Playwright / Automatyzacja przeglądarki

**Cele:**

1. Zainstaluj Playwright: `npm i playwright` → `npx playwright install`.
2. Otwórz stronę, wyszukaj frazę, zrób screenshot.
3. Użyj `await page.waitForSelector`.
4. Połącz z poprzednim scraperem: pobierz dane → screenshot produktu.
5. Załóż GitHub, wrzuć projekt + README.

**KPI:**

- Bot działa headless.
- Repozytorium publiczne z działającym kodem.

---

## 🔹 Tydzień 4 (28.10 → 03.11) – Mini Projekt #1

**Cele:**

1. Wybierz realny cel (np. monitoring cen sneakersów, newsy).
2. Połącz scraping + Playwright + bazę danych.
3. Dodaj raport (log w pliku lub prosty komunikat).
4. Napisz `README.md` z opisem i przykładem działania.
5. Zrób notatkę: _„Czego się nauczyłem, co dalej rozwijać?”_

**KPI:**

- Działa pełny bot z jednym realnym zastosowaniem.
- Kod i README są czyste i zrozumiałe.

---

## 📈 Po 4 tygodniach

- 1 projekt na GitHubie.
- Zrozumienie scrapingu i automatyzacji przeglądarki.
- Gotowość na API + OpenAI (listopad).
