# 🎮 Wordgame Mobile App

**Cross-platform iOS & Android word-guessing game with real-time multiplayer**

Built with React Native (Expo) • TypeScript • Socket.IO

---

## ✨ Features

### 🎯 Game Modes
- **Daily Challenge** - One word per day, global competition
- **Practice Mode** - Unlimited solo play
- **Battle Royale** - Real-time 100-player battles
- **Tournaments** - QR code entry, sponsor prizes

### 🎨 Design
- Fun, colorful gradients
- Color-coded similarity feedback (cold → hot)
- Smooth animations (React Native Reanimated)
- Haptic feedback
- Professional UI (clean, mobile-first)

### 🏆 Features
- Points system (earn & spend)
- Achievements & badges
- Leaderboards (lifetime, monthly, friends)
- Profile stats & streaks
- Shop (point bundles, VIP)
- Tournaments (QR code, up to 100 players)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Studio

### Installation

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

### First Run

1. Scan QR code with Expo Go app (iOS/Android)
2. App loads on your device
3. Create account or skip to demo
4. Start playing!

---

## 📱 Screens

**Authentication:**
- Splash (animated logo)
- Onboarding (3 screens)
- Login / Register

**Main Tabs:**
- Home (daily challenge + modes)
- Battle (real-time multiplayer)
- Leaderboard (rankings)
- Profile (stats + achievements)
- Shop (points + VIP)

**Game:**
- Daily Challenge
- Practice
- Tournament Lobby
- Tournament Match
- Tournament Results

---

## 🎨 Design System

### Colors
```typescript
Primary: #6366F1 (Indigo)
Success: #22C55E (Green)
Warning: #F59E0B (Amber)
Danger: #EF4444 (Red)

Similarity:
- Cold: #3B82F6 (Blue)
- Warm: #F97316 (Orange)
- Hot: #EF4444 (Red)
- Perfect: #22C55E (Green)
```

### Typography
- Font: Poppins
- Sizes: 12px - 32px
- Weights: Regular, Medium, SemiBold, Bold

### Spacing
- Base: 8px
- Scale: 4, 8, 16, 24, 32, 48

---

## 🧩 Components

### UI Components
- Button (primary, secondary, ghost)
- Card (white, shadow, rounded)
- Badge (colored, rounded)
- Avatar (initials, circular)
- ProgressBar (animated)

### Game Components
- WordInput (haptic feedback)
- GuessList (scrollable, color-coded)
- SimilarityBar (animated, gradient)
- Timer (countdown)

### Animations
- FadeIn (opacity + translateY)
- ScaleIn (spring animation)
- SlideIn (from 4 directions)
- Bounce (vertical loop)
- Pulse (scale loop)
- Confetti (Lottie)
- Shimmer (skeleton loader)
- PointsCounter (animated number)
- SuccessCheckmark (spring + rotate)
- LoadingSpinner (rotating)
- AnimatedProgressBar (width transition)

---

## 🔧 Tech Stack

### Core
- **React Native** 0.74.1
- **Expo** ~51.0.0
- **TypeScript** ~5.3.3
- **Expo Router** ~3.5.11 (file-based routing)

### State
- **Zustand** ^4.5.0 (global state)
- **React Query** ^5.17.9 (server state)
- **AsyncStorage** 1.23.1 (persistence)

### UI
- **React Native Reanimated** ~3.10.1 (animations)
- **Lottie** 6.7.0 (complex animations)
- **Linear Gradient** ~13.0.0 (backgrounds)
- **SVG** 15.2.0 (icons)

### Backend
- **Socket.IO Client** ^4.7.4 (real-time)
- **Fetch API** (REST)

---

## 📂 Project Structure

```
wordgame-mobile/
├── app/                          # Expo Router screens
│   ├── (auth)/                  # Auth screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/                  # Bottom tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx           # Home
│   │   ├── battle.tsx
│   │   ├── leaderboard.tsx
│   │   ├── profile.tsx
│   │   └── shop.tsx
│   ├── game/                    # Game screens
│   │   ├── daily-challenge.tsx
│   │   └── practice.tsx
│   ├── _layout.tsx              # Root layout
│   └── splash.tsx
│
├── components/
│   ├── game/                    # Game components
│   │   ├── WordInput.tsx
│   │   ├── GuessList.tsx
│   │   ├── SimilarityBar.tsx
│   │   └── Timer.tsx
│   ├── ui/                      # UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── PointsDisplay.tsx
│   │   ├── LeaderboardItem.tsx
│   │   └── RankBadge.tsx
│   └── animations/              # Animation components
│       ├── Confetti.tsx
│       ├── Shimmer.tsx
│       ├── PointsCounter.tsx
│       ├── FadeIn.tsx
│       ├── ScaleIn.tsx
│       ├── SlideIn.tsx
│       ├── Bounce.tsx
│       ├── Pulse.tsx
│       ├── SuccessCheckmark.tsx
│       ├── LoadingSpinner.tsx
│       └── AnimatedProgressBar.tsx
│
├── services/
│   ├── api.ts                   # REST API client
│   ├── socket.ts                # Socket.IO client
│   ├── auth.ts                  # Authentication
│   └── points.ts                # Points management
│
├── stores/
│   ├── authStore.ts             # Auth state
│   ├── gameStore.ts             # Game state
│   ├── pointsStore.ts           # Points state
│   └── settingsStore.ts         # App settings
│
├── constants/
│   ├── Colors.ts                # Color palette
│   ├── Spacing.ts               # Spacing system
│   └── Typography.ts            # Font styles
│
├── assets/                      # Images, fonts, etc.
├── app.json                     # Expo config
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
└── babel.config.js              # Babel config
```

---

## 🎯 Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building
```bash
# Development build
npx expo build:ios
npx expo build:android

# Production build (EAS)
eas build --platform ios
eas build --platform android
```

---

## 📲 App Store Submission

### iOS (App Store)

**Requirements:**
- Apple Developer account ($99/year)
- App icon (1024x1024)
- Screenshots (all device sizes)
- Privacy policy URL
- App description

**Steps:**
1. Create app in App Store Connect
2. Build with EAS: `eas build --platform ios`
3. Submit: `eas submit --platform ios`
4. Wait for review (1-3 days)

### Android (Google Play)

**Requirements:**
- Google Play Developer account ($25 one-time)
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots
- Privacy policy URL

**Steps:**
1. Create app in Google Play Console
2. Build with EAS: `eas build --platform android`
3. Submit: `eas submit --platform android`
4. Wait for review (1-7 days)

---

## 🔐 Environment Variables

Create `.env` file:

```env
EXPO_PUBLIC_API_URL=https://api.wordgame.app
EXPO_PUBLIC_SOCKET_URL=wss://socket.wordgame.app
EXPO_PUBLIC_ENV=development
```

---

## 🎊 Features Checklist

### MVP (Completed)
- [x] Splash screen
- [x] Onboarding
- [x] Authentication
- [x] Home screen
- [x] Daily Challenge
- [x] Practice Mode
- [x] Leaderboards
- [x] Profile
- [x] Shop
- [x] Points system
- [x] Animations

### V1.1 (Next)
- [ ] Tournament system
- [ ] QR code scanner
- [ ] Battle Royale
- [ ] Push notifications
- [ ] Social sharing
- [ ] Achievements

### V1.2 (Future)
- [ ] VIP subscription
- [ ] Premium themes
- [ ] Sound effects
- [ ] Offline mode
- [ ] Widgets
- [ ] Dark mode

---

## 📝 License

Proprietary - All rights reserved

---

## 🤝 Contributing

This is a private project. For questions or issues, contact the team.

---

## 📞 Support

**Repository:** https://github.com/openclawbob/wordgame
**Backend:** https://github.com/openclawbob/wordgame (main repo)

---

**Built with ❤️ using React Native + Expo**

**Ready for App Store submission!** 🚀
