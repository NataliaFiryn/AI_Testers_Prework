# AI Testers Prework

Repozytorium jest czescia kursu AI_Testers od jaktestowac.pl.

To publiczny projekt do samorozwoju w automatyzacji testow.

## Start

Wymagany jest Node.js 22 (co najmniej 22.17.0) oraz npm. Plik `.nvmrc`
wskazuje wersje Node uzywana lokalnie i w CI.

```bash
npm ci
npx playwright install
cp .env.example .env
npm test
```

Plik `.env` jest lokalny i nie jest zapisywany w repozytorium.
Przed uruchomieniem testow uruchom aplikacje Rolnopol pod adresem `BASE_URL`
z `.env` (domyslnie lokalny port 3000). CI uruchamia ja jako usluge Docker.

## Przydatne komendy

```bash
npm run test:ui
npm run test:headed
npx playwright test --project=smoke-tests
npx playwright test --project=demo-user
npm run lint
npm run typecheck
npm run format:check
npm run check
```

`npm run check` sprawdza formatowanie, lint i typy bez zmiany plikow; nie
wymaga aplikacji ani `.env`. Poprawki uruchamiaj jawnie przez `npm run format`
i `npm run lint:fix`. Testy przegladarkowe pozostaja osobnym krokiem.

`npm ci` instaluje hook Husky. Przed commitem lint-staged formatuje pliki
ze staging area i uruchamia ESLint z poprawkami dla kodu. Blad linta blokuje
commit; ostrzezenia pozostaja informacyjne. Sprawdzenie typow obejmuje caly
projekt przez `npm run check`, a nie tylko pliki przygotowane do commitu.
Hook nie zastapi kontroli CI i mozna go pominac przez `HUSKY=0`.

Formatowanie obejmuje kod, konfiguracje i dokumentacje projektu. Pomija
artefakty, lokalny stan narzedzi, zasoby `.agents/` oraz `package-lock.json`
zarzadzany przez npm. Uzywamy LF; nie wymuszamy sortowania importow.
Lokalne ustawienia `.vscode/` nie sa wersjonowane. Zalecane rozszerzenia to
Prettier i ESLint; ich instalacja nie zastepuje `npm run check`.

W PowerShell z zablokowanymi skryptami uzyj `npm.cmd` i `npx.cmd` zamiast
zmieniac systemowa polityke uruchamiania skryptow.

CI uruchamia niezalezny job `Quality checks` obok istniejacego joba `test`
dla pull requestow do `main`/`master` i przez `workflow_dispatch`.
Oba uzywaja `npm ci` i Node z `.nvmrc`; hooki sa w CI wylaczone.
Po udanej instalacji lint i kontrola typow uruchamiaja sie takze po bledzie
formatowania, aby pokazac komplet wynikow. Job jakosci nie wymaga sekretow
ani srodowiska `rolnopol`. Blad dowolnej kontroli powoduje niepowodzenie joba.
Wymaganie `Quality checks` i `test` przed scaleniem nalezy ustawic w regulach
ochrony galezi na GitHub; sam plik workflow nie blokuje przycisku merge.

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
