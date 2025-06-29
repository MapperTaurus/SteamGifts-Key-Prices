# 💰 SteamGifts Key Prices

A customizable userscript for [SteamGifts](https://www.steamgifts.com/) that displays the **lowest keyshop prices** from [GG.deals](https://gg.deals/) directly on giveaway listings.  

---

## ✨ Features

### 🔎 Price Display

- Shows the **lowest keyshop prices** from [GG.deals](https://gg.deals/) directly on:
  - Homepage
  - Group giveaways
  - Wishlist / Recommended / New pages
  - Individual Giveaway pages
- Supports both:
  - **Steam Apps** (games & DLCs)
  - **Steam Packages** (subs/bundles)

### ⚙️ Efficiency

- 🔁 **Caching built-in** - already fetched prices are reused across pages to avoid duplicate requests and reduce API load.
- 💸 Shows discount as **color-coded bubbles** indicating savings:
- 🧠 Focused on clarity - keeps the SteamGifts UI clean and fast

### 🎨 Customizability

- 💬 Choose your **display mode**:
  - Auto-show prices
  - Show on click
- 📍 Select the **display location**:
  - List View (main giveaway pages)
  - Individual View (giveaway details page)
- 🚀 Optional **GG.deals API key support** - increases request limits and enables near-instant price loading
- ⚙️ Adjustable internal settings directly in the userscript (no UI clutter)

### 🧩 Integrability

- ✅ Fully compatible with popular SteamGifts extensions like:
  - **ESGST (Enhanced SteamGifts & SteamTrades)**
  - **Extended SteamGifts**
- 🧼 Designed for non-conflicting DOM insertion and CSS
---

## 📥 Installation

This is a **userscript**, and requires a userscript manager extension:

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-000000?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.tampermonkey.net/)  
[![Greasemonkey](https://img.shields.io/badge/Greasemonkey-FBAC00?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)  
[![Violentmonkey](https://img.shields.io/badge/Violentmonkey-4B4B4B?style=for-the-badge&logo=vivaldi&logoColor=white)](https://violentmonkey.github.io/get-it/)

---

### 🖱️ One-Click Install

Click below to install the script directly:

[![Install Script](https://img.shields.io/badge/Install%20Script-SteamGifts%20Key%20Prices-4CAF50?style=for-the-badge&logo=greasyfork&logoColor=white)](https://github.com/MapperTaurus/SteamGifts-Key-Prices/raw/master/SteamGiftsKeyPrices.user.js)

> Make sure one of the userscript managers above is installed and enabled in your browser.

---

## 🛠 How It Works

1. The script runs automatically when browsing SteamGifts.
2. It extracts the App or Sub ID from each giveaway.
3. It checks for cached price data or queries [GG.deals](https://gg.deals/).
4. The lowest keyshop price is displayed under each game's listing.
5. Discount bubbles show how much you’re saving at a glance.

---

## ❓ FAQ

**Q: Does it work with group giveaways, wishlist, or recommended pages?**  
Yes - all major listing pages are supported.

**Q: Will this slow down SteamGifts?**  
No - it’s lightweight and uses caching to reduce API calls.

**Q: Do I need an API key?**  
No, but if you set your free [GG.deals API key](https://gg.deals/api/) in the script, you'll get:
- Higher request limits
- Faster responses
- Improved reliability

**Q: Is it safe to use?**  
Yes - this script does not interact with your account or modify anything on SteamGifts' servers.

---

## 📄 License

[MIT License](LICENSE)

---

## 👤 Author

Made by [Ivan Todorov](https://github.com/MapperTaurus)  
📧 Contact: mappertaurus@gmail.com

---

## ⭐ Like this script?

Please consider ⭐ starring the repo and supporting my work:

[![Revolut](https://img.shields.io/badge/Support%20via-Revolut-0075EB?style=for-the-badge&logo=revolut&logoColor=white)](https://Revolut.Me/ivan3ryuk)  
[![PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://PayPal.me/mappertaurus)  
[![Steam Trade](https://img.shields.io/badge/Send%20a%20Trade%20Offer-Steam-171A21?style=for-the-badge&logo=steam&logoColor=white)](https://steamcommunity.com/tradeoffer/new/?partner=172949613&token=aw45pePu)  
[![Steam Wishlist](https://img.shields.io/badge/Gift%20a%20Game-Steam%20Wishlist-1B2838?style=for-the-badge&logo=steam&logoColor=white)](https://store.steampowered.com/wishlist/id/MapperTaurus/#sort=order)
