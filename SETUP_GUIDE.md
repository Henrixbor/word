# Wordgame Mobile - Complete Setup Guide

**Step-by-step instructions to launch your app**

---

## ✅ Step 1: Test Mobile App Locally

### Prerequisites
- Node.js 18+ installed
- Expo Go app on your phone (iOS or Android)

### Commands

```bash
cd /home/bob/wordgame-mobile

# Install dependencies
npm install

# Start development server
npx expo start
```

### What Happens Next

1. Terminal shows QR code
2. Scan QR code with:
   - **iOS:** Camera app → Opens in Expo Go
   - **Android:** Expo Go app → Scan QR
3. App loads on your phone!

### Testing Checklist

- [ ] App loads successfully
- [ ] Can navigate between tabs
- [ ] Animations are smooth
- [ ] Daily Challenge loads
- [ ] Practice mode works
- [ ] Points display correctly
- [ ] Leaderboard loads
- [ ] Profile shows stats
- [ ] Shop shows products

### Common Issues

**"Cannot find module"**
- Run: `npm install`

**"Port 8081 already in use"**
- Run: `npx expo start --port 8082`

**App doesn't load**
- Check phone and computer are on same WiFi
- Try scanning QR code again

---

## ✅ Step 2: Sign Up for AdMob

### Create AdMob Account

**1. Go to AdMob**
- Visit: https://admob.google.com/
- Click "Sign Up" or "Get Started"
- Use your Google account

**2. Create Your App**

Click "Apps" → "Add App"

**Is your app published?** No

**App name:** Wordgame

**Platform:** iOS (then repeat for Android)

**3. Get App ID**

After creating app, you'll see:

**iOS App ID:**
```
ca-app-pub-1234567890123456~1234567890
```

**Android App ID:**
```
ca-app-pub-1234567890123456~0987654321
```

**4. Create Ad Units**

For each platform, create 3 ad units:

**a) Interstitial Ad**
- Click "Ad units" → "Add ad unit"
- Select "Interstitial"
- Name: "Game Interstitial"
- Get Ad Unit ID: `ca-app-pub-XXXXX/XXXXX`

**b) Rewarded Video Ad**
- Click "Ad units" → "Add ad unit"
- Select "Rewarded"
- Name: "Bonus Points Reward"
- Get Ad Unit ID: `ca-app-pub-XXXXX/XXXXX`

**c) Banner Ad (Optional)**
- Click "Ad units" → "Add ad unit"
- Select "Banner"
- Name: "Home Banner"
- Get Ad Unit ID: `ca-app-pub-XXXXX/XXXXX`

**5. Update app.json**

Replace placeholder IDs in `/home/bob/wordgame-mobile/app.json`:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-YOUR-IOS-APP-ID"
      },
      "infoPlist": {
        "GADApplicationIdentifier": "ca-app-pub-YOUR-IOS-APP-ID"
      }
    },
    "android": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-YOUR-ANDROID-APP-ID"
      }
    },
    "plugins": [
      [
        "expo-ads-admob",
        {
          "androidAppId": "ca-app-pub-YOUR-ANDROID-APP-ID",
          "iosAppId": "ca-app-pub-YOUR-IOS-APP-ID"
        }
      ]
    ]
  }
}
```

**6. Update services/adService.ts**

Replace ad unit IDs in code:

```typescript
const AD_UNIT_IDS = {
  ios: {
    interstitial: 'ca-app-pub-XXXXX/XXXXX', // Your iOS Interstitial ID
    rewarded: 'ca-app-pub-XXXXX/XXXXX',     // Your iOS Rewarded ID
    banner: 'ca-app-pub-XXXXX/XXXXX',       // Your iOS Banner ID
  },
  android: {
    interstitial: 'ca-app-pub-XXXXX/XXXXX', // Your Android Interstitial ID
    rewarded: 'ca-app-pub-XXXXX/XXXXX',     // Your Android Rewarded ID
    banner: 'ca-app-pub-XXXXX/XXXXX',       // Your Android Banner ID
  },
};
```

**7. Test Ads**

For testing, use test ad IDs (already in code):
- iOS Interstitial: `ca-app-pub-3940256099942544/4411468910`
- Android Interstitial: `ca-app-pub-3940256099942544/1033173712`

Switch to real IDs before App Store submission!

---

## ✅ Step 3: Create IAP Products (Remove Ads)

### iOS - App Store Connect

**1. Log in to App Store Connect**
- Visit: https://appstoreconnect.apple.com/
- Sign in with your Apple Developer account ($99/year required)

**2. Create App**
- Click "My Apps" → "+"
- Select "New App"
- **Platform:** iOS
- **Name:** Wordgame
- **Language:** English
- **Bundle ID:** com.wordgame.app
- **SKU:** wordgame-ios-001

**3. Create In-App Purchase**

- Click your app → "In-App Purchases"
- Click "+" to add new
- **Type:** Non-Consumable (one-time purchase)
- Click "Create"

**4. Configure Product**

- **Reference Name:** Remove Ads
- **Product ID:** `com.wordgame.removeads`
- **Price:** Tier 5 ($4.99 USD)

**5. Add Localization**

- **Display Name:** Remove Ads
- **Description:** Remove all ads permanently. Enjoy ad-free gameplay!

**6. Screenshot (Optional)**

Upload a screenshot showing ad-free experience

**7. Review Information**

- Upload screenshot
- Add review notes if needed

**8. Save**

Click "Save" → Product is now "Ready to Submit"

---

### Android - Google Play Console

**1. Log in to Google Play Console**
- Visit: https://play.google.com/console/
- Sign in ($25 one-time fee required)

**2. Create App**
- Click "Create app"
- **App name:** Wordgame
- **Default language:** English (United States)
- **App or game:** Game
- **Free or paid:** Free
- Accept declarations
- Click "Create app"

**3. Create In-App Product**

- Go to "Monetize" → "In-app products"
- Click "Create product"
- **Product ID:** `com.wordgame.removeads`
- Click "Create"

**4. Configure Product**

- **Name:** Remove Ads
- **Description:** Remove all ads permanently. Enjoy ad-free gameplay!
- **Status:** Active
- **Price:** $4.99 USD (set for all countries or select specific)

**5. Save & Activate**

- Click "Save"
- Click "Activate"
- Product is now live (but only accessible in your app)

---

### Update Code with Product IDs

**services/purchaseService.ts:**

```typescript
const PRODUCT_IDS = {
  removeAds: 'com.wordgame.removeads', // Must match exactly!
};
```

---

## 🚀 Step 4: Submit to App Stores

### iOS - App Store

**1. Build App**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios
```

**2. Wait for Build**

- Build takes 10-20 minutes
- You'll get a download link

**3. Submit to App Store**

```bash
eas submit --platform ios
```

Or manually:
- Download .ipa file
- Upload to App Store Connect via Transporter app

**4. Complete App Store Connect**

- Fill in app description
- Add screenshots (5.5" and 6.5" required)
- Set category: Games → Puzzle
- Set age rating: 4+
- Add privacy policy URL
- Submit for review

**5. Review Time**

- Usually 1-3 days
- Monitor status in App Store Connect
- Respond to any reviewer notes

---

### Android - Google Play

**1. Build App**

```bash
# Build for Android
eas build --platform android
```

**2. Submit to Google Play**

```bash
eas submit --platform android
```

Or manually upload .aab file to Play Console

**3. Complete Play Console Listing**

**Store Listing:**
- App name: Wordgame
- Short description: Daily word-guessing puzzle game
- Full description: (see template below)
- App icon: 512x512px
- Feature graphic: 1024x500px
- Screenshots: At least 2 (phone, 7-inch, 10-inch tablets)

**Content Rating:**
- Complete questionnaire
- Likely rating: Everyone

**Pricing & Distribution:**
- Free
- Available countries: All
- Content guidelines: Accept

**4. Create Release**

- Go to "Production"
- Click "Create new release"
- Upload .aab file
- Add release notes
- Save → Review → Start rollout

**5. Review Time**

- Usually 1-7 days
- Can take up to 2 weeks initially

---

## 📝 App Descriptions

### Short Description (80 chars)

```
Daily word-guessing puzzle game. Compete with friends!
```

### Full Description

```
🎯 Wordgame - The Ultimate Word-Guessing Challenge!

Guess words and discover their semantic similarity to a secret target. Can you find the word?

✨ FEATURES

🎯 Daily Challenge
• One word per day
• Global leaderboard
• Compete with players worldwide

🔥 Practice Mode
• Unlimited words
• Learn and improve
• No pressure, just fun

⚔️ Battle Royale
• Real-time 100-player battles
• Live rankings
• Win prizes and points

🏆 Tournaments
• Join via QR code
• Up to 100 players
• Sponsored prizes

💎 Points & Rewards
• Earn points by playing
• Unlock achievements
• Climb the leaderboards
• Redeem for rewards

🎨 Beautiful Design
• Smooth animations
• Color-coded feedback
• Clean, modern interface
• Fun and engaging

📊 Track Your Progress
• Detailed statistics
• Achievement badges
• Daily streaks
• Friend leaderboards

💰 FREE TO PLAY
• No ads with optional $4.99 purchase
• Earn points through gameplay
• Optional purchases available

Download now and join millions of players worldwide!

Perfect for:
• Word game enthusiasts
• Puzzle lovers
• Competitive gamers
• Anyone who loves a challenge
```

---

## 📸 Screenshots Needed

### Required Sizes (iOS)

- 6.5" (iPhone 14 Pro Max): 1284 x 2778
- 5.5" (iPhone 8 Plus): 1242 x 2208

### Required Sizes (Android)

- Phone: 1080 x 1920 (or similar 16:9)
- 7" Tablet: 1200 x 1920
- 10" Tablet: 1600 x 2560

### Screenshot Ideas

1. **Home Screen** - Daily challenge card
2. **Gameplay** - Word input with guesses
3. **Victory** - Win celebration with confetti
4. **Leaderboard** - Top players
5. **Tournament** - QR code join screen
6. **Profile** - Stats and achievements

---

## 🎯 Pre-Launch Checklist

### App Quality

- [ ] All screens work
- [ ] No crashes
- [ ] Smooth animations
- [ ] Ads display correctly (test mode)
- [ ] Remove Ads purchase works (sandbox)
- [ ] Points system works
- [ ] Leaderboards load
- [ ] Socket.IO connects (when backend ready)

### Store Presence

- [ ] App icon created (1024x1024)
- [ ] Screenshots captured (all sizes)
- [ ] Description written
- [ ] Keywords selected
- [ ] Privacy policy created
- [ ] Support email set up

### Legal

- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Age rating determined
- [ ] Content rating complete

### Monetization

- [ ] AdMob account created
- [ ] Ad unit IDs added
- [ ] Remove Ads IAP created (iOS + Android)
- [ ] Pricing confirmed ($4.99)
- [ ] Test purchases work

---

## 🚀 Launch Day

**When Both Stores Approve:**

1. **Announce on social media**
2. **Post on Product Hunt**
3. **Contact tech blogs**
4. **Reach out to streamers**
5. **Monitor reviews**
6. **Respond to feedback**
7. **Track metrics (downloads, revenue, retention)**

---

## 📊 Post-Launch Monitoring

### Key Metrics

**Acquisition:**
- Daily downloads
- Organic vs paid installs
- App Store rankings

**Engagement:**
- DAU (Daily Active Users)
- D1, D7, D30 retention
- Session length
- Games per session

**Monetization:**
- Ad revenue
- Remove Ads conversion rate
- ARPDAU (Average Revenue Per DAU)
- IAP revenue

**Quality:**
- Crash-free rate (target: >99.5%)
- App Store rating (target: >4.5 stars)
- Review sentiment

### Tools to Use

- **Analytics:** Expo Analytics, Firebase
- **Crash Reporting:** Sentry
- **A/B Testing:** Expo Config
- **Revenue:** AdMob dashboard, App Store Connect, Play Console

---

## 🎊 Congratulations!

You now have a complete, production-ready mobile app with:
- ✅ Beautiful UI/UX
- ✅ Smooth animations
- ✅ Ad monetization
- ✅ In-app purchases
- ✅ Tournament system
- ✅ Points economy
- ✅ Real-time multiplayer ready

**Time to launch and grow to millions of users!** 🚀

---

## 📞 Need Help?

**Documentation:**
- README.md - Main documentation
- AD_MONETIZATION_STRATEGY.md - Ad setup
- AD_USER_FLOW.md - User experience
- This guide - Setup walkthrough

**Resources:**
- Expo Docs: https://docs.expo.dev/
- AdMob Help: https://support.google.com/admob/
- App Store Connect: https://help.apple.com/app-store-connect/
- Play Console: https://support.google.com/googleplay/android-developer/

---

**You've got this! Good luck! 🍀**
