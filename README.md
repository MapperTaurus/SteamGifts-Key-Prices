# ![SteamGifts Key Prices Logo](https://i.imgur.com/UxcFblA.png "SteamGifts Key Prices Logo") SteamGifts Key Prices

A customizable userscript for [SteamGifts](https://www.steamgifts.com/) that displays the **lowest keyshop prices** from [GG.deals](https://gg.deals/) directly on giveaway listings.

![Individual giveaway with the lowest keyshop price and discount shown in Deals.GG](https://i.imgur.com/CDrBWAx.png)

![Giveaway list with keyshop prices and discount badges](https://i.imgur.com/828t8dH.png)

---

## 📥 Installation

This is a **userscript**, and requires a userscript manager extension:

![Tampermonkey](https://img.shields.io/badge/Tampermonkey-000000?style=for-the-badge&logo=googlechrome&logoColor=white)   ![Greasemonkey](https://img.shields.io/badge/Greasemonkey-FBAC00?style=for-the-badge&logo=firefox-browser&logoColor=white)   ![Violentmonkey](https://img.shields.io/badge/Violentmonkey-c37731?style=for-the-badge&logo=vivaldi&logoColor=white)

### 🖱️ One-Click Install

![Install from GitHub](https://img.shields.io/badge/Install%20from-GitHub-24292E?style=for-the-badge&logo=github&logoColor=white)
![Install from GreasyFork](https://img.shields.io/badge/Install%20from-GreasyFork-800000?style=for-the-badge&logo=greasyfork&logoColor=white)

> Make sure one of the userscript managers above is installed and enabled in your browser.



### First-time setup

1. Confirm the script is installed and enabled. It should appear in your userscript manager's dashboard.
2. Sign in at [gg.deals/api](https://gg.deals/api/) and copy your key from the **Get Your API Key** button.
3. Open [steamgifts.com](https://www.steamgifts.com/). A browser pop-up will appear. Paste your API key into it and confirm.
4. ✅ You're all set. Click **🔑** next to a giveaway to see its price.
5. **Optional** — open the script's menu from your userscript manager's toolbar icon to adjust:
  - **Display Mode**: `CLICK` (default, prices load on click) or `AUTO` (prices load automatically)
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



## 🛠 How It Works

1. The script runs automatically as you browse SteamGifts.
2. It extracts the App or Sub ID from each giveaway.
3. It checks the cache, or queries [GG.deals](https://gg.deals/) if the price isn't cached yet.
4. The lowest keyshop price is displayed under each game's listing.

---



## ❓ FAQ

**Q: Will this slow down SteamGifts?**
No — it's lightweight and uses caching to reduce API calls.

**Q: Do I need an API key?**
Yes. GG.deals now blocks page scraping (HTTP 403), so a free [GG.deals API key](https://gg.deals/api/) is required. Set it from the userscript menu (`🔑 API Key`).

**Q: Is it safe to use?**
Yes — this script does not interact with your account or modify anything on SteamGifts' servers.

---



## ⭐ Like this script?

Please consider ⭐ starring the repo and supporting my work:

![Revolut](https://img.shields.io/badge/Support%20via-Revolut-0075EB?style=for-the-badge&logo=revolut&logoColor=white)
![PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)

---



## 📄 License

[MIT License](LICENSE)

---



## 👤 Author

Made by [Ivan Todorov](https://github.com/MapperTaurus)

📧 Contact: [ivan.it.qa@gmail.com](mailto:ivan.it.qa@gmail.com)