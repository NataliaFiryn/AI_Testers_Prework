# AI Testers Prework

Repozytorium jest czescia kursu AI_Testers od jaktestowac.pl.

To publiczny projekt do samorozwoju w automatyzacji testow.

## Start

```bash
npm install
npx playwright install
cp .env.example .env
npm test
```

Plik `.env` jest lokalny i nie jest zapisywany w repozytorium.

## Przydatne komendy

```bash
npm run test:ui
npm run test:headed
npx playwright test --project=smoke-tests
npx playwright test --project=demo-user
npm run lint
npm run typecheck
npm run format:check
```

Projekt `smoke-tests` uruchamia szybkie testy podstawowego stanu aplikacji bez
logowania. Projekt `demo-user` najpierw uruchamia projekt `setup`, ktory zapisuje
lokalny stan uwierzytelnienia w `playwright/.auth/user.json`. Ten plik jest
generowany automatycznie i nie jest zapisywany w repozytorium.

## Struktura

- `src/pages/` - Page Objecty i komponenty stron
- `src/fixtures/` - wlasne fixture Playwrighta
- `src/utils/` - funkcje pomocnicze
- `test-data/` - statyczne dane i pliki uzywane przez testy
- `tests/auth/` - konfiguracja sesji i testy wymagajace konta DEMO_USER
- `tests/` - scenariusze testowe Playwright
