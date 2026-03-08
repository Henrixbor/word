# Repo Strategy

## Recommendation

Keep the mobile app and backend as separate repositories for now.

Current setup:
- Mobile app: `Henrixbor/word`
- Backend: `openclawbob/wordgame`

Why this is the right shape today:
- Mobile and backend deploy on different cadences.
- Railway operations and database/runtime concerns should not block mobile UI work.
- Expo native assets, iOS, and Android files create a very different change surface than the server.
- The backend can be validated and redeployed independently when matchmaking or socket behavior changes.

## When to consider a monorepo later

Move to a monorepo only if one of these becomes painful:
- shared types drift between mobile and backend
- CI duplication becomes expensive
- release coordination across both repos becomes frequent
- a shared game-engine package needs to be consumed by both sides

## Current operational rule

- Ship gameplay/UI changes from the mobile repo.
- Ship matchmaking/socket/runtime changes from the backend repo.
- Treat the backend API contract as the integration boundary.
