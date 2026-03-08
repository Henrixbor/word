# Publish Ready Plan

## Current State

The app now has a deterministic offline gameplay loop for daily and practice mode, persisted local game state, and core stat tracking. Multiplayer, monetization, backend sync, and store-asset production are still not implemented end to end.

## Phase 1: Finish Local Product Quality

- Install and lock dependencies, then run `eslint` and TypeScript checks.
- Add real image assets for icon, splash, adaptive icon, and store screenshots.
- Replace placeholder confetti and add a small sound design layer.
- Add unit tests for the game engine and session store behavior.
- Add invalid-word shake animation and per-letter reveal states.

## Phase 2: Backend and Sync

- Build authenticated API for daily puzzle delivery, cloud save, and leaderboard submission.
- Add authoritative score validation on the server.
- Replace mock leaderboard/profile/shop data with real endpoints.
- Add offline queueing and sync conflict handling.

## Phase 3: Multiplayer

- Add matchmaking, room lifecycle, reconnect logic, and spectating states.
- Define battle-specific game rules instead of reusing the solo session model.
- Add anti-cheat validation and latency-tolerant event handling.

## Phase 4: Store Launch

- Finalize bundle identifiers, EAS project setup, privacy policy, and analytics.
- Add App Store / Play Store metadata, screenshots, preview video, and age rating answers.
- Validate notification permissions and ad/IAP compliance only after those systems are real.

## Recommended Order

1. Make the local app verifiably stable.
2. Add backend sync for the current solo modes.
3. Ship a polished single-player v1.
4. Add multiplayer and monetization as v2 features.
