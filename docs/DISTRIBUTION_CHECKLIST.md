# Distribution Checklist

## What is already prepared

- Native iOS and Android projects exist.
- App icon, splash, favicon, and branded assets are in place.
- CI runs `lint` and `typecheck`.
- EAS build profiles exist in `eas.json`.
- App privacy manifest exists on iOS.
- Live backend is deployed on Railway.

## Before inviting testers

- Confirm `EXPO_PUBLIC_API_URL` and `EXPO_PUBLIC_SOCKET_URL` point to production.
- Run `npm run lint`
- Run `npm run typecheck`
- Build one iOS preview binary
- Build one Android preview binary
- Verify login, solo queue, duo queue, active round, reconnect

## Apple / TestFlight

- Join Apple Developer Program
- Create app record in App Store Connect
- Set bundle ID to the final production identifier
- Add privacy policy URL
- Add support URL
- Upload build with EAS or Xcode
- Add internal testers first
- For external testers, provide TestFlight review info and feedback email

## Google Play

- Join Google Play Console
- Create app record
- Use Play App Signing
- Upload `aab` from production profile
- Fill store listing, privacy policy, and Data safety
- Start with internal testing
- Expand to closed testing after stability pass

## Current recommendation

- Start with TestFlight internal testers on iPhone
- Start with Play internal testing or direct APK on Android
- Keep both on the Railway production backend
