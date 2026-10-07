# Crypto Tracker (React Native)

A React Native + TypeScript mobile app for browsing live cryptocurrency market data. It lists coins with their USD price and 24h change, supports search, infinite scroll and pull-to-refresh, and opens a detail screen with market cap, volume and supply figures. Prices come from the public [CoinLore API](https://www.coinlore.com/cryptocurrency-data-api), so no API key is needed.

<p align="center">
  <img width="300" alt="Market list screen" src="https://github.com/user-attachments/assets/0d0fe73c-beb0-485b-bfad-477e2c828a4a" />
  &nbsp;&nbsp;
  <img width="300" alt="Coin detail screen" src="https://github.com/user-attachments/assets/f1c31d0a-8b74-4088-ac5b-d64a4afce607" />
</p>

## Features

**Market list (Home)**

- Coins shown as cards with symbol (`SYMBOL/USDT`), USD price and a green or red 24h change.
- Infinite scroll: pages of 10 tickers loaded with CoinLore's `start` / `limit` pagination.
- Search by name or symbol, debounced by 500 ms, which filters the top 100 tickers on the client.
- Pull-to-refresh, plus a silent auto-refresh every 60 seconds while you aren't searching.
- Loading, empty ("No cryptocurrencies found") and error states.

**Coin details**

- Live price and 24h change in the header.
- Market cap, 24h volume, circulating supply and max supply ("Unlimited" when a coin has no cap), formatted in compact notation (for example `$1.2T`).
- Pull-to-refresh, plus an auto-refresh every 30 seconds.

## Tech stack

| Area          | Choice                                                        |
| ------------- | ------------------------------------------------------------- |
| Framework     | React Native 0.77, React 18.3                                 |
| Language      | TypeScript 5                                                  |
| Navigation    | React Navigation 7 (native stack, typed route params)         |
| UI            | React Native Paper 5 (Material Design 3), Vector Icons        |
| Data          | `fetch` against the CoinLore REST API                         |
| State         | Local React state in custom hooks (no global store)           |
| Tooling       | Jest + React Test Renderer, ESLint (`@react-native`), Prettier |

## Architecture

The UI is kept thin. Data fetching and refresh logic live in custom hooks, and the hooks get their data from a small service layer. That layer turns raw API payloads into domain model classes, which own all the formatting.

```
Screen (pages/)  ->  hook (hooks/)  ->  CoinLoreAPI (services/)  ->  api.coinlore.net
                                              |
                                              v
                          ExchangeRate / CryptoDetails models
                          (parsing + Intl.NumberFormat formatting)
```

- **`CoinLoreAPI`** wraps the endpoints `GET /tickers/?start=&limit=` (paginated list) and `GET /ticker/?id=` (single coin).
- **`ExchangeRate`** maps a ticker's string fields to numbers and exposes helpers such as `formatUSDValue()`, `get24hChange()` and `get24hVolume()`.
- **`CryptoDetails`** extends `ExchangeRate` with market cap, supply fields and their formatters.
- **`useCrypto`** handles the list state: pagination, `hasMore`, debounced search, refresh and the 60 s polling.
- **`useCryptoDetails`** loads one coin by id and polls it every 30 s.

### Project structure

```
.
├── App.tsx                     # PaperProvider + root navigator
├── index.js                    # App registration
├── __tests__/App.test.tsx      # Render smoke test (fetch mocked)
├── src/
│   ├── components/
│   │   ├── CryptoListItem/     # Card used in the market list
│   │   └── ExchangeCard.tsx    # Alternative rate card component
│   ├── hooks/
│   │   ├── useCrypto.tsx       # List, search, pagination, polling
│   │   └── useCryptoDetails.tsx
│   ├── navigation/
│   │   ├── root.tsx            # Native stack: Home -> Details
│   │   └── types.ts            # RootStackParamList
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── Details.tsx
│   ├── services/
│   │   ├── CoinLoreAPI.ts      # HTTP client
│   │   ├── ExchangeService.ts  # ExchangeRate model
│   │   ├── CryptoDetailts.ts   # CryptoDetails model
│   │   └── CryptoPortfolio.ts  # Holdings / total value model
│   └── types/crypto.ts         # API and domain interfaces
├── android/
└── ios/
```

## Getting started

### Prerequisites

- Node.js 18 or later
- A React Native environment for your target platform: Android Studio and an emulator, or Xcode and CocoaPods for iOS. See the official [environment setup guide](https://reactnative.dev/docs/set-up-your-environment).

### Install

```sh
git clone https://github.com/teamzz111/crypto-tracker-rn.git
cd crypto-tracker-rn
npm install
```

For iOS only, install the CocoaPods dependencies once, and again whenever native dependencies change:

```sh
bundle install
cd ios && bundle exec pod install && cd ..
```

### Run

Start Metro in one terminal:

```sh
npm start
```

Then build and launch the app from another terminal:

```sh
npm run android
# or
npm run ios
```

## Quality checks

```sh
npm run typecheck   # TypeScript (tsc --noEmit)
npm run lint        # ESLint
npm test            # Jest
```

The Jest suite renders the whole app tree, including navigation and Paper. It mocks `fetch` and uses fake timers, so it never calls the real API.

## Data source

All market data comes from the free, keyless [CoinLore public API](https://www.coinlore.com/cryptocurrency-data-api) (`https://api.coinlore.net/api`). Prices are quoted in USD.
