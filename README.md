# ![SteamGifts Key Prices Logo](https://i.imgur.com/UxcFblA.png "SteamGifts Key Prices Logo") SteamGifts Key Prices

A customizable userscript for [SteamGifts](https://www.steamgifts.com/) that displays the **lowest keyshop prices** from [GG.deals](https://gg.deals/) directly on giveaway listings.

[![Updated](https://img.shields.io/github/last-commit/MapperTaurus/SteamGifts-Key-Prices.svg?label=Updated&logo=github&cacheSeconds=600)](https://github.com/MapperTaurus/SteamGifts-Key-Prices/commits)
[![Version](https://img.shields.io/greasyfork/v/541115.svg?label=Version&logo=greasyfork&cacheSeconds=600)](https://greasyfork.org/en/scripts/541115-steamgifts-key-prices)
[![License](https://img.shields.io/github/license/MapperTaurus/SteamGifts-Key-Prices.svg?label=License&logo=gnu&cacheSeconds=2592000)](https://github.com/MapperTaurus/SteamGifts-Key-Prices/blob/master/LICENSE)


![Individual giveaway with the lowest keyshop price and discount shown in Deals.GG](https://i.imgur.com/CDrBWAx.png)

![Giveaway list with keyshop prices and discount badges](https://i.imgur.com/cex8xhW.png)

---

## 📥 Installation

This is a **userscript**, and requires a userscript manager extension:

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-000000?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.tampermonkey.net/)   [![Greasemonkey](https://img.shields.io/badge/Greasemonkey-FBAC00?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)   [![Violentmonkey](https://img.shields.io/badge/Violentmonkey-c37731?style=for-the-badge&logo=vivaldi&logoColor=white)](https://violentmonkey.github.io/get-it/)

> Make sure one of the userscript managers above is installed and enabled in your browser.



### 🖱️ One-Click Install

[![Install from GitHub](https://img.shields.io/badge/Install%20from-GitHub-24292E?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MapperTaurus/SteamGifts-Key-Prices/raw/master/SteamGiftsKeyPrices.user.js)
[![Install from GreasyFork](https://img.shields.io/badge/Install%20from-GreasyFork-800000?style=for-the-badge&logo=greasyfork&logoColor=white)](https://greasyfork.org/en/scripts/541115-steamgifts-key-prices)

### First-time setup

1. Confirm the script is installed and enabled. It should appear in your userscript manager's dashboard.
2. Sign in at [gg.deals/api](https://gg.deals/api/) and copy your key from the **Get Your API Key** section.
3. Open [steamgifts.com](https://www.steamgifts.com/). A browser pop-up will appear. Paste your API key into it and confirm.
4. ✅ You're all set. Prices load automatically next to each giveaway.
5. **Optional** — open the script's menu from your userscript manager's toolbar icon to adjust:
  - **Display Mode**: `AUTO` (default, prices load automatically) or `CLICK` (prices load when you click **🔑**)
  - **Currency**: any currency code, e.g. `EUR` or `USD`
  - **Individual View** / **List View**: where prices appear (both on by default)

Reload SteamGifts after changing a setting.

---



## ✨ Features



### 🔑 Price Display

Shows the **lowest keyshop prices** from [GG.deals](https://gg.deals/) across every major listing page:

- Homepage
- Group giveaways
- Wishlist / Recommended / New pages
- Individual Giveaway pages

Works for both **Steam Apps** (games & DLCs) and **Steam Packages** (subs/bundles), with color-coded discount bubbles showing your savings at a glance.

### ⚙️ Performance & Compatibility

- 🔁 **Caching built-in** — already-fetched prices are reused across pages, cutting duplicate requests and API load
- 🧠 Keeps the SteamGifts UI clean and fast
- 🧩 Non-conflicting DOM/CSS insertion, fully compatible with **ESGST** and **Extended SteamGifts**

---



## ❓ FAQ

**Q: Will this slow down SteamGifts?**
No — it's lightweight and uses caching to reduce API calls.

**Q: Do I need an API key?**
Yes. GG.deals now blocks page scraping (HTTP 403), so a free [GG.deals API key](https://gg.deals/api/) is required. Set it from the userscript menu (`🔑 API Key`).

**Q: Is it safe to use?**
Yes — this script does not interact with your account or modify anything on SteamGifts' servers.

**Q: Which price is shown in the giveaways?**
The price shown is the cheapest one available in the Keyshops section for that game on GG.deals, regardless of DRM. This means there may be rare cases where the game's price in the Keyshops is higher than its price on Steam, or where the cheapest available DRM is not Steam (for example, Red Dead Redemption).

---



## ⭐ Like this script?

Please consider ⭐ starring the repo and supporting my work:

[![Revolut](https://img.shields.io/badge/Support%20via-Revolut-0075EB?style=for-the-badge&logo=revolut&logoColor=white)](https://Revolut.Me/ivan3ryuk)
[![PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://PayPal.me/mappertaurus)

---



## 📄 License

You can use, copy, and modify this script. If you distribute a modified version, or run one as a service that other people use over a network, you must license it under AGPL-3.0 and make the corresponding source available to them.

[AGPL-3.0 license](https://github.com/MapperTaurus/SteamGifts-Key-Prices/blob/master/LICENSE)

---



## 👤 Author

Made by [Ivan Todorov](https://github.com/MapperTaurus)

📧 Contact: [ivan.it.qa@gmail.com](mailto:ivan.it.qa@gmail.com)