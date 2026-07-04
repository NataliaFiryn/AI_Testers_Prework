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

- `tests/` - testy Playwright
- `pages/` - Page Object Model lub komponenty stron
- `fixtures/` - wspolne fixture testowe
- `test-data/` - dane testowe
- `utils/` - pomocnicze funkcje testowe
