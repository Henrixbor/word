# Word!

Mobile battle-first word game built with Expo and React Native.

Current focus:
- solo queue into the public arena
- duo lobby with friend invites and auto-pair fallback
- live top-10 guess race
- 10-round matches with 1-minute rounds or instant solve

Repository:
- GitHub: `https://github.com/Henrixbor/word`

Backend:
- Railway API: `https://wordgame-production-79dc.up.railway.app`
- backend repo: `/Users/henri/Repositories/wordgame`

## Local setup

```bash
npm install
npx expo start
```

Native:

```bash
npm run ios
npm run android
```

Web:

```bash
npm run web
```

## Quality checks

```bash
npm run lint
npm run typecheck
```

## Current product shape

- `Battle` is the primary game mode.
- `Ranks` and `Profile` support the multiplayer loop.
- Daily/practice still exist, but the product is currently optimized around live arena play.

## Main directories

- `app/` Expo Router screens
- `components/` UI, game, branding, and animation components
- `assets/branding/` approved art, logo, splash, and mascot assets
- `assets/avatars/` selectable player animals
- `services/` API, sockets, Game Center scaffolding
- `stores/` auth and gameplay persistence
- `ios/` native iOS project
- `android/` native Android project

## Release notes

Important current behavior:
- live arena guesses are submitted over Socket.IO
- reconnecting players rejoin active matches
- top-10 board shows only real discoveries plus hidden `#1`
- intermission shows the winning word and score snapshot

## Repo strategy

For now, keep mobile and backend separate.

See:
- `docs/REPO_STRATEGY.md`
- `../wordgame/RAILWAY_DEPLOY_LOOP.md`
