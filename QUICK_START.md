# 🚀 Quick Start - 3 Steps to Launch

**Get your app live in 3 easy steps!**

---

## 📱 Step 1: Test It Works

```bash
cd /home/bob/wordgame-mobile
npm install
npx expo start
```

✅ Scan QR code with Expo Go app  
✅ Test on your phone  
✅ Verify everything works

**Time:** 10 minutes

---

## 💰 Step 2: Set Up Monetization

### AdMob (Ads)

1. Go to https://admob.google.com/
2. Create app (iOS + Android)
3. Create 2 ad units:
   - Interstitial (between games)
   - Rewarded (watch for points)
4. Copy IDs → Update `app.json`

### In-App Purchase (Remove Ads)

**iOS:**
1. App Store Connect → Create IAP
2. Product: "Remove Ads"
3. ID: `com.wordgame.removeads`
4. Price: $4.99

**Android:**
1. Google Play Console → Create product
2. Same ID: `com.wordgame.removeads`
3. Price: $4.99

**Time:** 30 minutes

---

## 🚀 Step 3: Submit to Stores

### Build

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform all
```

### Submit

```bash
# iOS
eas submit --platform ios

# Android
eas submit --platform android
```

### Complete Listings

**Both stores need:**
- App icon (1024x1024)
- Screenshots (5-6 images)
- Description (use template in SETUP_GUIDE.md)
- Privacy policy URL

**Time:** 2-3 hours  
**Review Time:** 1-7 days

---

## 🎯 That's It!

**Total Time:** ~4 hours of work  
**Wait Time:** 1-7 days for approval  
**Result:** Live app on App Store + Google Play! 🎉

---

## 📚 Need More Details?

See **SETUP_GUIDE.md** for complete step-by-step instructions!

---

**Ready? Let's go! 🚀**
