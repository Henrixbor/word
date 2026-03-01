# Ad Monetization Strategy

**Interstitial ads + Remove Ads purchase for optimal revenue**

---

## 💰 Monetization Model

### Free-to-Play with Ads

**Ad Types:**
1. **Interstitial Ads** - Full-screen ads between games
2. **Rewarded Video Ads** - Watch for bonus points
3. **Banner Ads** - Small banners (optional, less intrusive)

**Remove Ads Purchase:**
- **Price:** $4.99 (one-time)
- **Benefit:** Removes all ads forever
- **No recurring:** Permanent unlock

---

## 📊 Ad Frequency Strategy

### Interstitial Ads (Between Games)

**Frequency Options:**

**Option 1: Every 3 Games (Recommended)**
```typescript
// Show ad after every 3rd game
if (gamesPlayed % 3 === 0 && !hasRemovedAds) {
  showInterstitialAd();
}
```
- **Pros:** Good balance, not too aggressive
- **Cons:** May miss some revenue
- **User Impact:** Low annoyance

**Option 2: Every 2 Games (Moderate)**
```typescript
// Show ad after every 2nd game
if (gamesPlayed % 2 === 0 && !hasRemovedAds) {
  showInterstitialAd();
}
```
- **Pros:** More revenue
- **Cons:** Slightly more annoying
- **User Impact:** Medium annoyance

**Option 3: Every Game (Aggressive)**
```typescript
// Show ad after every game
if (!hasRemovedAds) {
  showInterstitialAd();
}
```
- **Pros:** Maximum revenue
- **Cons:** Very annoying, may lose users
- **User Impact:** High annoyance
- **Not Recommended**

**Option 4: Time-Based (Smart)**
```typescript
// Show ad if 5+ minutes passed since last ad
const minutesSinceLastAd = (Date.now() - lastAdTime) / 60000;
if (minutesSinceLastAd >= 5 && !hasRemovedAds) {
  showInterstitialAd();
  lastAdTime = Date.now();
}
```
- **Pros:** Less predictable, better UX
- **Cons:** More complex
- **User Impact:** Low annoyance

**Recommended: Hybrid Approach**
```typescript
// Show ad every 3 games OR after 10 minutes, whichever comes first
const gamesPlayed = getGamesPlayed();
const minutesSinceLastAd = (Date.now() - lastAdTime) / 60000;

if (!hasRemovedAds) {
  if (gamesPlayed % 3 === 0 || minutesSinceLastAd >= 10) {
    showInterstitialAd();
    lastAdTime = Date.now();
  }
}
```

---

## 🎯 Implementation

### 1. Ad Service Setup

```typescript
// services/adService.ts

import * as AdMob from 'expo-ads-admob';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AdMob Unit IDs
const AD_UNIT_IDS = {
  ios: {
    interstitial: 'ca-app-pub-XXXXX/XXXXX', // Replace with real ID
    rewarded: 'ca-app-pub-XXXXX/XXXXX',
    banner: 'ca-app-pub-XXXXX/XXXXX',
  },
  android: {
    interstitial: 'ca-app-pub-XXXXX/XXXXX',
    rewarded: 'ca-app-pub-XXXXX/XXXXX',
    banner: 'ca-app-pub-XXXXX/XXXXX',
  },
};

// Test IDs (use during development)
const TEST_AD_UNIT_IDS = {
  ios: {
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
    banner: 'ca-app-pub-3940256099942544/2934735716',
  },
  android: {
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224854917',
    banner: 'ca-app-pub-3940256099942544/6300978111',
  },
};

class AdService {
  private interstitialLoaded = false;
  private rewardedLoaded = false;
  private gamesPlayed = 0;
  private lastAdTime = 0;
  private hasRemovedAds = false;

  async initialize() {
    try {
      // Initialize AdMob
      await AdMob.setTestDeviceIDAsync('EMULATOR');
      
      // Check if user has removed ads
      const removedAds = await AsyncStorage.getItem('ads_removed');
      this.hasRemovedAds = removedAds === 'true';
      
      // Load games played count
      const gamesCount = await AsyncStorage.getItem('games_played_count');
      this.gamesPlayed = gamesCount ? parseInt(gamesCount, 10) : 0;
      
      // Preload interstitial ad
      if (!this.hasRemovedAds) {
        this.loadInterstitialAd();
      }
      
      // Preload rewarded ad (always available for bonus points)
      this.loadRewardedAd();
    } catch (error) {
      console.error('AdMob initialization failed:', error);
    }
  }

  async loadInterstitialAd() {
    try {
      const adUnitId = __DEV__
        ? TEST_AD_UNIT_IDS[Platform.OS].interstitial
        : AD_UNIT_IDS[Platform.OS].interstitial;

      await AdMob.requestAdAsync(AdMob.InterstitialAdEventType.REQUEST_AD, {
        adUnitId,
      });

      this.interstitialLoaded = true;
    } catch (error) {
      console.error('Failed to load interstitial ad:', error);
      this.interstitialLoaded = false;
    }
  }

  async loadRewardedAd() {
    try {
      const adUnitId = __DEV__
        ? TEST_AD_UNIT_IDS[Platform.OS].rewarded
        : AD_UNIT_IDS[Platform.OS].rewarded;

      await AdMob.requestAdAsync(AdMob.RewardedAdEventType.REQUEST_AD, {
        adUnitId,
      });

      this.rewardedLoaded = true;
    } catch (error) {
      console.error('Failed to load rewarded ad:', error);
      this.rewardedLoaded = false;
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (this.hasRemovedAds) {
      return false; // User has removed ads
    }

    if (!this.interstitialLoaded) {
      await this.loadInterstitialAd();
    }

    try {
      await AdMob.showAdAsync(AdMob.InterstitialAdEventType.SHOW_AD);
      
      // Update last ad time
      this.lastAdTime = Date.now();
      await AsyncStorage.setItem('last_ad_time', this.lastAdTime.toString());
      
      // Reload next ad
      this.interstitialLoaded = false;
      this.loadInterstitialAd();
      
      return true;
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      return false;
    }
  }

  async showRewardedAd(): Promise<{ watched: boolean; points: number }> {
    if (!this.rewardedLoaded) {
      await this.loadRewardedAd();
    }

    try {
      const result = await AdMob.showAdAsync(AdMob.RewardedAdEventType.SHOW_AD);
      
      // User watched the ad
      const points = 25; // Reward points
      
      // Reload next ad
      this.rewardedLoaded = false;
      this.loadRewardedAd();
      
      return { watched: true, points };
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      return { watched: false, points: 0 };
    }
  }

  async incrementGameCount() {
    this.gamesPlayed++;
    await AsyncStorage.setItem('games_played_count', this.gamesPlayed.toString());
  }

  async shouldShowInterstitialAd(): Promise<boolean> {
    if (this.hasRemovedAds) {
      return false;
    }

    // Hybrid approach: Every 3 games OR 10 minutes
    const minutesSinceLastAd = (Date.now() - this.lastAdTime) / 60000;
    
    return (
      this.gamesPlayed % 3 === 0 || 
      minutesSinceLastAd >= 10
    );
  }

  async removeAds() {
    this.hasRemovedAds = true;
    await AsyncStorage.setItem('ads_removed', 'true');
  }

  async restoreAdsRemoval(): Promise<boolean> {
    // Check if user has purchased ad removal
    const removedAds = await AsyncStorage.getItem('ads_removed');
    this.hasRemovedAds = removedAds === 'true';
    return this.hasRemovedAds;
  }
}

export const adService = new AdService();
```

---

### 2. Hook for Game Completion

```typescript
// hooks/useGameCompletion.ts

import { useCallback } from 'react';
import { adService } from '../services/adService';
import { usePointsStore } from '../stores/pointsStore';

export const useGameCompletion = () => {
  const { awardPoints } = usePointsStore();

  const onGameComplete = useCallback(async (points: number) => {
    // Award points for game completion
    awardPoints(points);
    
    // Increment game count
    await adService.incrementGameCount();
    
    // Check if we should show an ad
    const shouldShow = await adService.shouldShowInterstitialAd();
    
    if (shouldShow) {
      // Small delay before showing ad
      setTimeout(async () => {
        await adService.showInterstitialAd();
      }, 1000);
    }
  }, [awardPoints]);

  return { onGameComplete };
};
```

---

### 3. Rewarded Ad Component

```typescript
// components/ads/WatchAdButton.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { adService } from '../../services/adService';
import { usePointsStore } from '../../stores/pointsStore';
import { Colors } from '../../constants/Colors';

type WatchAdButtonProps = {
  onComplete?: (points: number) => void;
};

export const WatchAdButton: React.FC<WatchAdButtonProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const { awardPoints } = usePointsStore();

  const handleWatchAd = async () => {
    setLoading(true);
    
    const result = await adService.showRewardedAd();
    
    if (result.watched) {
      // Award points
      awardPoints(result.points);
      onComplete?.(result.points);
    }
    
    setLoading(false);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleWatchAd}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Text style={styles.icon}>📺</Text>
          <Text style={styles.text}>Watch Ad for 25 Points</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 48,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

### 4. Remove Ads Purchase

```typescript
// services/purchaseService.ts

import * as InAppPurchases from 'expo-in-app-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adService } from './adService';

const PRODUCT_IDS = {
  removeAds: 'com.wordgame.removeads',
};

class PurchaseService {
  async initialize() {
    try {
      await InAppPurchases.connectAsync();
    } catch (error) {
      console.error('IAP initialization failed:', error);
    }
  }

  async purchaseRemoveAds(): Promise<boolean> {
    try {
      // Get product
      const products = await InAppPurchases.getProductsAsync([
        PRODUCT_IDS.removeAds,
      ]);

      if (products.results.length === 0) {
        throw new Error('Remove Ads product not found');
      }

      // Purchase
      await InAppPurchases.purchaseItemAsync(PRODUCT_IDS.removeAds);

      // Listen for purchase result
      const purchaseListener = InAppPurchases.setPurchaseListener(
        async ({ responseCode, results }) => {
          if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            // Purchase successful
            for (const purchase of results || []) {
              if (
                purchase.productId === PRODUCT_IDS.removeAds &&
                purchase.acknowledged === false
              ) {
                // Acknowledge purchase
                await InAppPurchases.finishTransactionAsync(purchase, true);
                
                // Remove ads
                await adService.removeAds();
                await AsyncStorage.setItem('ads_removed', 'true');
                
                purchaseListener.remove();
                return true;
              }
            }
          }
        }
      );

      return true;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    }
  }

  async restorePurchases(): Promise<boolean> {
    try {
      const history = await InAppPurchases.getPurchaseHistoryAsync();
      
      const hasRemovedAds = history.results?.some(
        (purchase) => purchase.productId === PRODUCT_IDS.removeAds
      );

      if (hasRemovedAds) {
        await adService.removeAds();
        await AsyncStorage.setItem('ads_removed', 'true');
      }

      return hasRemovedAds || false;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  }
}

export const purchaseService = new PurchaseService();
```

---

### 5. Shop Screen (Updated)

```typescript
// app/(tabs)/shop.tsx (excerpt)

import { purchaseService } from '../../services/purchaseService';

const ShopScreen = () => {
  const [purchasing, setPurchasing] = useState(false);

  const handleRemoveAds = async () => {
    setPurchasing(true);
    
    const success = await purchaseService.purchaseRemoveAds();
    
    if (success) {
      Alert.alert(
        'Success!',
        'Ads have been removed. Enjoy ad-free gaming!',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Purchase Failed',
        'Could not complete purchase. Please try again.',
        [{ text: 'OK' }]
      );
    }
    
    setPurchasing(false);
  };

  return (
    <View style={styles.container}>
      {/* Point Bundles */}
      
      {/* Remove Ads */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>🚫 Remove Ads</Text>
        <Text style={styles.cardDescription}>
          Remove all ads permanently
        </Text>
        <Text style={styles.price}>$4.99</Text>
        <Button
          title={purchasing ? 'Processing...' : 'Purchase'}
          onPress={handleRemoveAds}
          disabled={purchasing}
        />
      </Card>
    </View>
  );
};
```

---

## 📊 Revenue Projections

### With Ads + Remove Ads Purchase

**Assumptions:**
- 100,000 DAU (Daily Active Users)
- 3 games per user per day
- Ad shown every 3 games
- Ad RPM: $2 (revenue per 1,000 impressions)
- Remove Ads conversion: 10%

**Ad Revenue:**
```
100,000 users × 3 games ÷ 3 ads = 100,000 ad impressions/day
100,000 impressions × ($2 / 1,000) = $200/day
$200/day × 30 days = $6,000/month from ads
```

**Remove Ads Revenue:**
```
100,000 users × 10% conversion = 10,000 purchases
10,000 purchases × $4.99 = $49,900 (one-time)
```

**Total First Month:** $55,900
**Ongoing Monthly:** $6,000 (ads) + new users purchasing

---

### Scaled Projections

**1M DAU:**
- Ad revenue: $60,000/month
- Remove Ads (10% of new users): ~$50k/month from growth
- **Total: $110k/month**

**10M DAU:**
- Ad revenue: $600,000/month
- Remove Ads: ~$500k/month from growth
- **Total: $1.1M/month**

---

## 🎯 Best Practices

### 1. Ad Timing
✅ **Do:**
- Show ads after game completion
- Add 1-2 second delay before showing ad
- Show success/results screen first
- Let user celebrate their win

❌ **Don't:**
- Show ads during gameplay
- Show ads on app launch
- Show ads during loading
- Interrupt user flow

### 2. Ad Frequency
✅ **Do:**
- Start with every 3 games
- Monitor user retention
- A/B test different frequencies
- Adjust based on data

❌ **Don't:**
- Show ads too frequently
- Show ads after every game (too aggressive)
- Ignore user feedback
- Prioritize revenue over UX

### 3. Remove Ads Pricing
✅ **Do:**
- Price at $4.99 (sweet spot)
- Make it prominent in shop
- Show value ("Never see ads again!")
- Offer during ad viewing ("Skip this ad forever for $4.99")

❌ **Don't:**
- Price too high ($9.99+)
- Hide the option
- Make it hard to find
- Require subscription

---

## 🚀 Implementation Steps

### Week 1: Setup
- [ ] Sign up for AdMob account
- [ ] Create app in AdMob console
- [ ] Get ad unit IDs (iOS + Android)
- [ ] Install expo-ads-admob
- [ ] Configure app.json

### Week 2: Integration
- [ ] Implement AdService
- [ ] Add interstitial ad logic
- [ ] Add rewarded ad component
- [ ] Test with test ad IDs

### Week 3: Purchase
- [ ] Set up In-App Purchases
- [ ] Create "Remove Ads" product
- [ ] Implement purchase flow
- [ ] Test purchase (sandbox)

### Week 4: Testing & Launch
- [ ] Test ad frequency
- [ ] Monitor user feedback
- [ ] Adjust frequency if needed
- [ ] Launch!

---

## 📈 Success Metrics

### Key Metrics to Track

**Ad Performance:**
- Impressions per user
- eCPM (effective cost per mille)
- Fill rate
- Click-through rate (CTR)

**Remove Ads:**
- Conversion rate (% of users purchasing)
- Revenue from purchases
- Impact on retention

**User Experience:**
- D1, D7, D30 retention (with vs without ads)
- Session length
- Games per session
- User complaints/feedback

### Target Metrics

**Good Performance:**
- Ad fill rate: >90%
- eCPM: $2-5
- Remove Ads conversion: 5-15%
- Retention impact: <10% difference

**Excellent Performance:**
- Ad fill rate: >95%
- eCPM: $5-10
- Remove Ads conversion: 15-25%
- Retention impact: <5% difference

---

## 🎊 Summary

**Ad Strategy:**
- ✅ Interstitial ads every 3 games
- ✅ Rewarded video ads for bonus points
- ✅ Remove Ads purchase ($4.99)
- ✅ Smart timing (after game completion)

**Revenue:**
- 100k DAU: ~$55k first month, $6k/month ongoing
- 1M DAU: ~$110k/month
- 10M DAU: ~$1.1M/month

**User Experience:**
- Not too aggressive
- Clear value for Remove Ads
- Optional rewarded ads
- Good balance

---

**Ready to implement ad monetization!** 💰📱

**Next:** Install expo-ads-admob and set up AdMob account!
