# Ad User Flow - Visual Guide

**How ads appear in the game experience**

---

## 🎮 Game Flow with Ads

### Flow 1: Free User (With Ads)

```
┌─────────────────────────────────┐
│ Game 1                          │
│ User plays and wins             │
│ ✅ +100 points awarded          │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Results Screen                  │
│ "You won! 🎉"                   │
│ Score: 12 guesses               │
│ [Play Again]                    │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Game 2                          │
│ User plays again                │
│ ✅ +100 points awarded          │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Results Screen                  │
│ [Play Again]                    │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Game 3                          │
│ User plays again                │
│ ✅ +100 points awarded          │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Results Screen                  │
│ [Play Again]                    │
└──────────────┬──────────────────┘
               │ 1-2 second delay
               ▼
┌─────────────────────────────────┐
│ 📺 INTERSTITIAL AD              │
│                                 │
│ (Full-screen ad)                │
│ 5 seconds → [Skip Ad]           │
│                                 │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Back to Home or Game            │
│ Continue playing                │
└─────────────────────────────────┘
```

---

### Flow 2: Paid User (No Ads)

```
┌─────────────────────────────────┐
│ User Purchased "Remove Ads"     │
│ ✅ $4.99 one-time payment       │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Game 1, 2, 3, 4, 5...           │
│ ✅ No ads shown                 │
│ ✅ Seamless experience          │
│ [Play Again] → Instant          │
└─────────────────────────────────┘
```

---

### Flow 3: Rewarded Video (Optional)

```
┌─────────────────────────────────┐
│ User on Home Screen             │
│ Points: 150                     │
│                                 │
│ [📺 Watch Ad for 25 Points]    │
│    ↑ User taps                  │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ 📺 REWARDED VIDEO AD            │
│                                 │
│ (30-second video)               │
│ Cannot skip                     │
│                                 │
└──────────────┬──────────────────┘
               │ User watches
               ▼
┌─────────────────────────────────┐
│ ✨ +25 Points Awarded           │
│                                 │
│ New Balance: 175 points         │
│                                 │
│ [Continue]                      │
└─────────────────────────────────┘
```

---

## 📊 Ad Display Logic

### Game Counter

```typescript
// Example tracking
let gamesPlayed = 0;
let lastAdTime = Date.now();

// After each game
gamesPlayed++;

// Check if we should show ad
if (gamesPlayed % 3 === 0 && !hasRemovedAds) {
  // Wait 1 second
  setTimeout(() => {
    showInterstitialAd();
  }, 1000);
}
```

---

## 💰 Monetization Comparison

### Free User Journey

**Day 1:**
- Plays 10 games
- Sees 3-4 ads
- Considers purchasing "Remove Ads"
- Revenue: ~$0.01 (from ads)

**Day 7:**
- Plays 70 games total
- Sees 23-24 ads
- Frustrated with ads
- **Purchases Remove Ads for $4.99**
- Revenue: $4.99 + $0.07 (from ads) = **$5.06**

**Day 30:**
- Plays ad-free
- Happy customer
- Likely to recommend
- Lifetime Value: $4.99

### Always Free User

**Day 30:**
- Plays 300 games
- Sees 100 ads
- Revenue: ~$0.20 (from ads)

**Year 1:**
- Revenue: ~$2.40 (from ads)
- Lower LTV than paid user

---

## 🎯 Conversion Tactics

### 1. Ad Interruption Message

```
┌─────────────────────────────────┐
│ 📺 Advertisement                │
│                                 │
│ Tired of ads?                   │
│                                 │
│ [Remove Ads Forever - $4.99]   │
│                                 │
│ (Ad playing...)                 │
│                                 │
│ [Skip Ad in 5s]                 │
└─────────────────────────────────┘
```

### 2. Shop Prominence

```
┌─────────────────────────────────┐
│ Shop                            │
├─────────────────────────────────┤
│                                 │
│ 🔥 MOST POPULAR                │
│ ┌─────────────────────────┐   │
│ │ 🚫 Remove Ads           │   │
│ │                         │   │
│ │ Never see ads again!    │   │
│ │ One-time payment        │   │
│ │                         │   │
│ │ Was: $9.99              │   │
│ │ Now: $4.99 (50% OFF!)   │   │
│ │                         │   │
│ │ [Purchase Now]          │   │
│ └─────────────────────────┘   │
│                                 │
│ Point Bundles                   │
│ • 1,000 pts - $0.99            │
│ • 5,000 pts - $4.99            │
│ ...                             │
└─────────────────────────────────┘
```

### 3. After Multiple Ads

```
// After user sees 5+ ads
if (adsShown >= 5 && !hasSeenRemovalOffer) {
  showRemoveAdsOffer();
}
```

```
┌─────────────────────────────────┐
│ 💡 Special Offer                │
├─────────────────────────────────┤
│                                 │
│ You've watched 5 ads so far.    │
│                                 │
│ Remove all ads forever?         │
│                                 │
│ ✅ No more interruptions        │
│ ✅ Faster gameplay              │
│ ✅ One-time payment             │
│                                 │
│ [Get Ad-Free for $4.99]        │
│                                 │
│ [Maybe Later]                   │
└─────────────────────────────────┘
```

---

## 🎨 Ad Screen Mockups

### Interstitial Ad Screen

```
┌─────────────────────────────────┐
│                                 │
│         📱 Ad Content           │
│                                 │
│     (Full-screen ad from        │
│      Google AdMob network)      │
│                                 │
│                                 │
│                                 │
│                                 │
│        ⏱️ Skip in 5s...         │
│                                 │
│                                 │
│     🔇 [Mute]    ℹ️ [Info]      │
│                                 │
└─────────────────────────────────┘
```

### After Ad Closes

```
┌─────────────────────────────────┐
│ ✅ Ad Completed                 │
├─────────────────────────────────┤
│                                 │
│ Thank you for your patience!    │
│                                 │
│ Tired of ads?                   │
│                                 │
│ [Remove Ads - $4.99]           │
│                                 │
│ [No Thanks, Continue]          │
│                                 │
└─────────────────────────────────┘
```

---

## 📈 Expected Conversion Rates

### Industry Benchmarks

**Interstitial Ad Click Rate:**
- Average: 1-3%
- Good: 3-5%
- Excellent: 5%+

**Remove Ads Conversion:**
- After 1 ad: 1-2%
- After 5 ads: 5-10%
- After 20 ads: 10-20%

**Rewarded Video Completion:**
- Average: 70-80%
- Good: 80-90%
- Excellent: 90%+

---

## 🎯 A/B Testing Ideas

### Test 1: Ad Frequency

**Variant A:** Every 3 games
**Variant B:** Every 2 games
**Variant C:** Every 5 games

**Measure:**
- Revenue per user
- Retention (D1, D7, D30)
- Remove Ads conversion rate

### Test 2: Ad Timing

**Variant A:** Immediately after game
**Variant B:** 1 second delay
**Variant C:** 2 second delay

**Measure:**
- User satisfaction
- Ad completion rate
- Retention

### Test 3: Pricing

**Variant A:** $4.99 (recommended)
**Variant B:** $2.99 (lower price, more conversions?)
**Variant C:** $6.99 (higher price, fewer conversions?)

**Measure:**
- Conversion rate
- Total revenue
- LTV

---

## 🎊 Summary

**User Flow:**
- Free users: Ads every 3 games (1-2s delay after results)
- Paid users: No ads ever
- Optional: Rewarded video ads for bonus points

**Conversion Strategy:**
- Prominent "Remove Ads" in shop
- Offer after multiple ads
- Fair pricing ($4.99)
- Clear value proposition

**Expected Results:**
- 5-15% Remove Ads conversion
- $2-5 eCPM from ads
- $0.20-2.00 ARPDAU
- Positive user experience

---

**Balanced monetization that respects users while generating revenue!** 💰✨
