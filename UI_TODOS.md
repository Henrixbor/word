# UI Next Todos

## Highest Impact

- Replace placeholder image assets with a real icon, splash, notification icon, and branded illustrations.
- Add a consistent motion layer for tab transitions, screen entrances, invalid guess shake, and leaderboard reorder animations.
- Unify all remaining screens to the new palette and surface system, especially auth, splash, settings, and battle details.
- Introduce a small set of reusable layout primitives for hero sections, stat pills, and section headers to reduce repeated styling.

## Gameplay Polish

- Add letter-by-letter feedback chips and a richer solved-state reveal in daily and practice modes.
- Add ambient background shapes or particles behind the main game screens so the views feel less flat during idle states.
- Add empty, loading, and error states that feel designed rather than default.
- Improve haptic and audio feedback so guesses, wins, and resets feel more physical.

## Product Quality

- Replace mock shop and leaderboard content with real backend data and proper unavailable states.
- Fix package installation by resolving the invalid `expo-in-app-purchases` version in `package.json`.
- Run `eslint`, TypeScript checks, and on-device layout verification after dependencies install cleanly.
- Add darkened overlays or safe-area tuning where floating surfaces overlap smaller phones.

## Structural Cleanup

- Move hard-coded gradients and direct hex colors into shared tokens where they repeat.
- Introduce reusable CTA and promotional card variants instead of screen-specific one-off styles.
- Review tab icons, labels, and spacing on small devices to avoid crowding once real content lands.
