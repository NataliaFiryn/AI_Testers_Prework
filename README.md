# AI Testers Prework

Repozytorium jest czescia kursu AI_Testers od jaktestowac.pl.

To publiczny projekt do samorozwoju w automatyzacji testow.

## Start

```bash
npm install
npx playwright install
npm test
```

## Przydatne komendy

```bash
npm run test:ui
npm run test:headed
npm run lint
npm run typecheck
npm run format:check
```

## Struktura

- `src/pages/` - Page Objecty i komponenty stron
- `src/fixtures/` - wlasne fixture Playwrighta
- `src/utils/` - funkcje pomocnicze
- `test-data/` - statyczne dane i pliki uzywane przez testy
- `tests/` - scenariusze testowe Playwright
