// ==UserScript==
// @name         SteamGifts Key Prices
// @namespace    SteamGifts Key Prices from Deals.GG
// @version      4.1
// @description  A customizable web extension for SteamGifts that displays the lowest keyshop prices from GG.deals directly on all giveaway pages
// @author       Taurus#
// @homepage	 https://github.com/MapperTaurus/SteamGifts-Key-Prices
// @downloadURL	 https://github.com/MapperTaurus/SteamGifts-Key-Prices/raw/master/SteamGiftsKeyPrices.user.js
// @updateURL	 https://github.com/MapperTaurus/SteamGifts-Key-Prices/raw/master/SteamGiftsKeyPrices.user.js
// @license      https://github.com/MapperTaurus/SteamGifts-Key-Prices/blob/master/LICENSE
// @icon         https://i.imgur.com/UxcFblA.png
// @match        https://www.steamgifts.com/
// @match        https://www.steamgifts.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.gg.deals
// @connect      gg.deals
// ==/UserScript==

(function () {
    'use strict';

    // === CONFIG HANDLING ===
    const MODE_KEY = 'priceDisplayMode'; // "auto" or "click"
    const INDIVIDUAL_KEY = 'viewModeIndividual'; // true or false
    const LIST_KEY = 'viewModeList'; // true or false
    const API_KEY = 'ggDealsApiKey'; // API key storage
    const CURRENCY_KEY = 'ggDealsCurrency';
    const REGION_KEY = 'ggDealsRegion'; // legacy, used only to migrate old settings
    const API_NOTICE_KEY = 'apiKeyMigrationNotice';

    const CURRENCIES = {
        USD: { region: 'us', symbol: '$', label: 'US Dollar' },
        EUR: { region: 'eu', symbol: '€', label: 'Euro' },
        GBP: { region: 'gb', symbol: '£', label: 'British Pound' },
        CAD: { region: 'ca', symbol: 'CA$', label: 'Canadian Dollar' },
        AUD: { region: 'au', symbol: 'A$', label: 'Australian Dollar' },
        CHF: { region: 'ch', symbol: 'CHF', label: 'Swiss Franc' },
        PLN: { region: 'pl', symbol: 'zł', label: 'Polish Zloty' },
        BRL: { region: 'br', symbol: 'R$', label: 'Brazilian Real' },
        SEK: { region: 'se', symbol: 'kr', label: 'Swedish Krona' },
        NOK: { region: 'no', symbol: 'kr', label: 'Norwegian Krone' },
        DKK: { region: 'dk', symbol: 'kr', label: 'Danish Krone' }
    };
    const CURRENCY_CODES = Object.keys(CURRENCIES);
    const LEGACY_REGION_TO_CURRENCY = {
        us: 'USD', eu: 'EUR', de: 'EUR', fr: 'EUR', es: 'EUR', it: 'EUR',
        nl: 'EUR', be: 'EUR', fi: 'EUR', ie: 'EUR', gb: 'GBP', ca: 'CAD',
        au: 'AUD', ch: 'CHF', pl: 'PLN', br: 'BRL', se: 'SEK', no: 'NOK', dk: 'DKK'
    };
    const PRICE_ENDPOINTS = {
        app: 'https://api.gg.deals/v1/prices/by-steam-app-id/',
        sub: 'https://api.gg.deals/v1/prices/by-steam-sub-id/',
        bundle: 'https://api.gg.deals/v1/prices/by-steam-bundle-id/'
    };

    const currentMode = GM_getValue(MODE_KEY, 'click');
    const individualEnabled = GM_getValue(INDIVIDUAL_KEY, true);
    const listEnabled = GM_getValue(LIST_KEY, true);

    function getApiKey() {
        return String(GM_getValue(API_KEY, '') || '').trim();
    }

    function getCurrencyCode() {
        const stored = String(GM_getValue(CURRENCY_KEY, '') || '').toUpperCase();
        if (CURRENCIES[stored]) {
            return stored;
        }

        const legacyRegion = String(GM_getValue(REGION_KEY, '') || '').toLowerCase();
        return LEGACY_REGION_TO_CURRENCY[legacyRegion] || 'USD';
    }

    function getCurrency() {
        return CURRENCIES[getCurrencyCode()] || CURRENCIES.USD;
    }

    function getRegion() {
        return getCurrency().region;
    }

    // === PERFORMANCE OPTIMIZATION ===
    const priceCache = new Map();
    const pendingRequests = new Map();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
    let activeRequests = 0;
    let listRefreshTimer = null;

    // Initialize cache from stored data
    try {
        const storedCache = GM_getValue('priceCache', {});
        if (storedCache && typeof storedCache === 'object') {
            Object.entries(storedCache).forEach(([key, value]) => {
                if (value && value.timestamp && value.data) {
                    priceCache.set(key, value);
                }
            });
        }
    } catch (e) {
        console.warn('Failed to load price cache:', e);
    }

    function toggleMode() {
        const newMode = currentMode === 'auto' ? 'click' : 'auto';
        GM_setValue(MODE_KEY, newMode);
        alert(`GG.deals price display mode set to: ${newMode.toUpperCase()}\nReload the page to apply changes.`);
    }

    function toggleIndividual() {
        const newState = !individualEnabled;
        GM_setValue(INDIVIDUAL_KEY, newState);
        alert(`Individual page view: ${newState ? 'ON' : 'OFF'}\nReload the page to apply changes.`);
    }

    function toggleList() {
        const newState = !listEnabled;
        GM_setValue(LIST_KEY, newState);
        alert(`List view: ${newState ? 'ON' : 'OFF'}\nReload the page to apply changes.`);
    }

    function chooseCurrency() {
        const current = getCurrencyCode();
        const options = CURRENCY_CODES.map((code, index) => {
            const marker = code === current ? ' (current)' : '';
            return `${index + 1}. ${code} - ${CURRENCIES[code].label}${marker}`;
        }).join('\n');

        const choice = prompt(
            `Select a display currency.\nGG.deals will return keyshop prices in that currency.\n\n${options}\n\nEnter a number or currency code:`,
            current
        );

        if (choice === null) {
            return;
        }

        const trimmed = choice.trim().toUpperCase();
        const byNumber = CURRENCY_CODES[parseInt(trimmed, 10) - 1];
        const next = CURRENCIES[trimmed] ? trimmed : byNumber;

        if (!next) {
            alert('Invalid currency. No changes were made.');
            return;
        }

        GM_setValue(CURRENCY_KEY, next);
        priceCache.clear();
        savePriceCache();
        alert(`Currency set to ${next} (${CURRENCIES[next].label}).\nReload the page to apply changes.`);
    }

    function promptForApiKey(prefill) {
        const newKey = prompt(
            'Enter your GG.deals API key:\n\n' +
            'Create a free key at: https://gg.deals/api/\n' +
            'Leave empty to remove the current key.',
            prefill || ''
        );

        if (newKey === null) {
            return getApiKey();
        }

        const trimmedKey = newKey.trim();
        GM_setValue(API_KEY, trimmedKey);
        return trimmedKey;
    }

    function manageApiKey() {
        const currentKey = getApiKey();
        const keyPreview = currentKey ? `${currentKey.substring(0, 8)}...` : 'Not set';

        const action = confirm(
            `Current API Key: ${keyPreview}\n\n` +
            `GG.deals now requires a free API key.\n` +
            `Page scraping is blocked (HTTP 403).\n\n` +
            `Get your free API key at: https://gg.deals/api/\n\n` +
            `Click OK to set/update API key, Cancel to remove it.`
        );

        if (action) {
            const trimmedKey = promptForApiKey(currentKey);
            if (trimmedKey) {
                alert(`✅ API Key saved successfully!\nKey preview: ${trimmedKey.substring(0, 8)}...\n\nPrices will load with this key.`);
            } else {
                alert('🗑️ API Key removed. Set a key again to load prices.');
            }
        } else {
            GM_setValue(API_KEY, '');
            alert('🗑️ API Key removed. Set a key again to load prices.');
        }

        return getApiKey();
    }

    function ensureApiKey() {
        const existing = getApiKey();
        if (existing) {
            return existing;
        }

        const openPage = confirm(
            'GG.deals now requires a free API key.\n' +
            'They block price scraping with HTTP 403.\n\n' +
            'Click OK to open https://gg.deals/api/ and create a key.'
        );

        if (openPage) {
            window.open('https://gg.deals/api/', '_blank', 'noopener,noreferrer');
        }

        return promptForApiKey('');
    }

    function maybePromptForApiKeyOnce() {
        if (getApiKey() || GM_getValue(API_NOTICE_KEY, false)) {
            return;
        }

        GM_setValue(API_NOTICE_KEY, true);
        ensureApiKey();
    }

    // Register menu commands
    GM_registerMenuCommand(`👁️Display Mode: ${currentMode.toUpperCase()}`, toggleMode);
    GM_registerMenuCommand(`📄Individual View: ${individualEnabled ? 'ON' : 'OFF'}`, toggleIndividual);
    GM_registerMenuCommand(`📚List View: ${listEnabled ? 'ON' : 'OFF'}`, toggleList);
    GM_registerMenuCommand(`💱Currency: ${getCurrencyCode()}`, chooseCurrency);
    GM_registerMenuCommand(`🔑API Key: ${getApiKey() ? 'SET' : 'NOT SET'}`, manageApiKey);
    GM_registerMenuCommand(`❤️Like This Script?`, () => {
        window.open('https://github.com/MapperTaurus/SteamGifts-Key-Prices?tab=readme-ov-file#-like-this-script', '_blank');
    });

    // === API HELPER FUNCTIONS ===
    function buildPricesUrl(steamType, ids) {
        const endpoint = PRICE_ENDPOINTS[steamType] || PRICE_ENDPOINTS.app;
        const url = new URL(endpoint);
        url.searchParams.set('ids', ids.join(','));
        url.searchParams.set('key', getApiKey());
        url.searchParams.set('region', getRegion());
        return url.toString();
    }

    function gmGet(url) {
        return new Promise((resolve, reject) => {
            activeRequests++;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Accept': 'application/json'
                },
                timeout: 12000,
                onload: function (response) {
                    activeRequests--;
                    resolve(response);
                },
                onerror: function (error) {
                    activeRequests--;
                    reject(error);
                },
                ontimeout: function () {
                    activeRequests--;
                    reject(new Error('timeout'));
                }
            });
        });
    }

    // === PAGE DETECTION ===
    function isIndividualGiveawayPage() {
        return window.location.pathname.startsWith('/giveaway/') && window.location.pathname.split('/').length >= 3;
    }

    function isGiveawayListPage() {
        return window.location.pathname === '/' ||
               window.location.pathname === '' ||
               window.location.pathname.startsWith('/giveaways') ||
               window.location.pathname.startsWith('/user/') ||
               window.location.pathname.startsWith('/group/');
    }

    // === UTILITY FUNCTIONS ===
    function parseSteamUrl(steamUrl) {
        if (!steamUrl) {
            return { type: null, id: null };
        }

        const match = steamUrl.match(/store\.steampowered\.com\/(app|sub|bundle)\/(\d+)/i);
        if (!match) {
            return { type: null, id: null };
        }

        return { type: match[1].toLowerCase(), id: match[2] };
    }

    function getSteamIdentity(root) {
        const scope = root || document;
        const steamLink = scope.querySelector('a[href*="store.steampowered.com/"]');
        return parseSteamUrl(steamLink ? steamLink.href : null);
    }

    function getGameTitle(root) {
        const scope = root || document;
        const titleElement = scope.querySelector('.featured__heading__medium') ||
            scope.querySelector('.giveaway__heading__name');
        return titleElement ? titleElement.textContent.trim() : null;
    }

    function formatPrice(amount, currency) {
        const numeric = parseFloat(amount);
        if (Number.isNaN(numeric)) {
            return null;
        }
        if (numeric === 0) {
            return 'Free';
        }

        const code = String(currency || getCurrencyCode()).toUpperCase();
        const formatted = numeric.toFixed(2);
        const selected = CURRENCIES[code];
        if (selected && ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'BRL'].includes(code)) {
            return `${selected.symbol}${formatted}`;
        }
        if (selected) {
            return `${formatted} ${selected.symbol}`;
        }
        return `${formatted} ${code}`;
    }

    function steamPageUrl(steamType, steamId) {
        return `https://gg.deals/steam/${steamType || 'app'}/${steamId}/`;
    }

    // === PRICE FETCHING FUNCTIONS (ENHANCED WITH CACHING) ===
    function getCacheKey(steamType, steamId, gameTitle) {
        if (steamType && steamId) {
            return `${steamType}_${steamId}_${getRegion()}`;
        }
        return `title_${gameTitle || 'unknown'}_${getRegion()}`;
    }

    function getCachedPrice(cacheKey) {
        const cached = priceCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            return cached.data;
        }
        return null;
    }

    function setCachedPrice(cacheKey, data) {
        priceCache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });

        const now = Date.now();
        for (const [key, value] of priceCache.entries()) {
            if (!value.timestamp || now - value.timestamp > CACHE_DURATION) {
                priceCache.delete(key);
            }
        }

        savePriceCache();
    }

    function savePriceCache() {
        try {
            const plainObject = Object.fromEntries(priceCache);
            GM_setValue('priceCache', plainObject);
        } catch (e) {
            console.warn('Failed to save price cache:', e);
        }
    }

    function parseOfficialPrice(gameData, steamType, steamId) {
        if (!gameData || !gameData.prices) {
            return {
                success: false,
                message: '⭕No keyshop prices found',
                url: steamPageUrl(steamType, steamId)
            };
        }

        const current = gameData.prices.currentKeyshops;
        const historic = gameData.prices.historicalKeyshops;
        const currency = gameData.prices.currency;
        const priceText = formatPrice(current, currency);
        const url = gameData.url || steamPageUrl(steamType, steamId);

        if (!priceText) {
            return {
                success: false,
                message: '⭕No keyshop prices found',
                url: url
            };
        }

        const currentValue = parseFloat(current);
        const historicValue = parseFloat(historic);
        const historicLow = !Number.isNaN(currentValue) && !Number.isNaN(historicValue) && currentValue <= historicValue + 0.01;

        return {
            success: true,
            price: priceText,
            discount: historicLow ? 'Historic Low' : null,
            historicLow: historicLow,
            url: url,
            source: 'API'
        };
    }

    function requestErrorResult(status) {
        if (status === 401 || status === 403) {
            return { success: false, message: '🔐Invalid API key' };
        }
        if (status === 400) {
            return { success: false, message: '⚠️Check your GG.deals API key and region' };
        }
        if (status === 429) {
            return { success: false, message: '⏰Rate limit exceeded' };
        }
        return { success: false, message: `⚠️API request failed (HTTP ${status})` };
    }

    async function fetchPricesByType(steamType, ids) {
        const uniqueIds = [...new Set(ids.filter(Boolean))];
        const results = new Map();
        if (uniqueIds.length === 0) {
            return results;
        }

        for (let i = 0; i < uniqueIds.length; i += 100) {
            const batch = uniqueIds.slice(i, i + 100);
            const response = await gmGet(buildPricesUrl(steamType, batch));

            if (response.status !== 200) {
                const errorResult = requestErrorResult(response.status);
                batch.forEach(id => results.set(id, errorResult));
                continue;
            }

            let jsonData;
            try {
                jsonData = JSON.parse(response.responseText);
            } catch (err) {
                batch.forEach(id => results.set(id, { success: false, message: '❌Error parsing API response' }));
                continue;
            }

            if (!jsonData.success || !jsonData.data) {
                batch.forEach(id => results.set(id, { success: false, message: '⚠️API request failed' }));
                continue;
            }

            batch.forEach(id => {
                const gameData = jsonData.data[id];
                if (!gameData) {
                    results.set(id, {
                        success: false,
                        message: '⭕No keyshop prices found',
                        url: steamPageUrl(steamType, id)
                    });
                    return;
                }
                results.set(id, parseOfficialPrice(gameData, steamType, id));
            });
        }

        return results;
    }

    function fetchPrice(steamType, steamId, gameTitle, callback) {
        if (!steamType || !steamId) {
            callback({ success: false, message: '❌No Steam App/Sub/Bundle ID found', url: '' });
            return;
        }

        const cacheKey = getCacheKey(steamType, steamId, gameTitle);
        const cached = getCachedPrice(cacheKey);
        if (cached) {
            callback(cached);
            return;
        }

        if (pendingRequests.has(cacheKey)) {
            pendingRequests.get(cacheKey).push(callback);
            return;
        }

        if (!getApiKey()) {
            const key = ensureApiKey();
            if (!key) {
                callback({ success: false, message: '🔐Set a free GG.deals API key to load prices' });
                return;
            }
        }

        pendingRequests.set(cacheKey, [callback]);

        fetchPricesByType(steamType, [steamId]).then(results => {
            const result = results.get(steamId) || { success: false, message: '⚠️API request failed' };
            if (result.success) {
                setCachedPrice(cacheKey, result);
            }

            const callbacks = pendingRequests.get(cacheKey) || [];
            pendingRequests.delete(cacheKey);
            callbacks.forEach(cb => cb(result));
        }).catch(() => {
            const callbacks = pendingRequests.get(cacheKey) || [];
            pendingRequests.delete(cacheKey);
            callbacks.forEach(cb => cb({ success: false, message: '❌Network error' }));
        });
    }

    function fetchPriceBatch(targets) {
        const grouped = { app: [], sub: [], bundle: [] };

        targets.forEach(target => {
            const cached = getCachedPrice(target.cacheKey);
            if (cached) {
                target.onResult(cached);
                return;
            }

            if (!target.steamType || !target.steamId) {
                target.onResult({ success: false, message: '❌No Steam App/Sub/Bundle ID found', url: '' });
                return;
            }

            grouped[target.steamType] = grouped[target.steamType] || [];
            grouped[target.steamType].push(target);
        });

        Object.keys(grouped).forEach(steamType => {
            const typeTargets = grouped[steamType];
            if (!typeTargets.length) {
                return;
            }

            fetchPricesByType(steamType, typeTargets.map(target => target.steamId)).then(results => {
                typeTargets.forEach(target => {
                    const result = results.get(target.steamId) || { success: false, message: '⚠️API request failed' };
                    if (result.success) {
                        setCachedPrice(target.cacheKey, result);
                    }
                    target.onResult(result);
                });
            }).catch(() => {
                typeTargets.forEach(target => {
                    target.onResult({ success: false, message: '❌Network error' });
                });
            });
        });
    }

    // === DISPLAY FUNCTIONS ===
    function createDiscountBadge(discount, historicLow) {
        if (historicLow) {
            return `<span style="
                background-color: #d9534f;
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: bold;
                margin-left: 6px;
                display: inline-block;
            ">📉 Historic Low</span>`;
        }

        if (!discount || !String(discount).includes('%')) {
            return '';
        }

        const discountValue = parseInt(String(discount).replace(/[^0-9]/g, ''), 10);
        let color = '#45cc54';
        if (discountValue > 90) color = '#d9534f';
        else if (discountValue > 60) color = '#f0ad4e';
        else if (discountValue > 30) color = '#5cb89c';

        return `<span style="
            background-color: ${color};
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 6px;
            display: inline-block;
        ">${discount}</span>`;
    }

    function createSourceBadge(source) {
        if (!source || source === 'Scraping') return '';

        return `<span style="
            background-color: #007acc;
            color: white;
            padding: 1px 4px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: bold;
            margin-left: 4px;
            display: inline-block;
        ">API</span>`;
    }

    function updatePriceDisplay(result, priceInfo) {
        if (result.success) {
            const discountPart = createDiscountBadge(result.discount, result.historicLow);
            const sourcePart = createSourceBadge(result.source);
            priceInfo.innerHTML = `<strong>🔑:</strong> <a href="${result.url}" target="_blank" rel="noopener noreferrer" style="font-size:18px;">${result.price}</a>${discountPart}${sourcePart}`;
        } else {
            const message = result.message || '⚠️Unable to load price';
            const link = result.url
                ? ` <a href="${result.url}" target="_blank" rel="noopener noreferrer">GG.deals</a>`
                : '';
            priceInfo.innerHTML = `<strong>🔑:</strong> <span style="font-size:18px;">${message}</span>${link}`;
        }
    }

    function updateListPriceDisplay(result, priceElement) {
        if (result.success) {
            const discountPart = createDiscountBadge(result.discount, result.historicLow);
            const sourcePart = createSourceBadge(result.source);
            priceElement.innerHTML = `<a href="${result.url}" target="_blank" rel="noopener noreferrer" style="color: #3f7300; text-decoration: none; font-weight: bold;">${result.price}</a>${discountPart}${sourcePart}`;
        } else {
            const message = result.message || '⚠️Unable to load price';
            priceElement.innerHTML = `<span style="color: #888; font-size: 12px;">${message}</span>`;
        }
    }

    // === INDIVIDUAL PAGE FUNCTIONALITY ===
    function fetchLowestKeyshopPrice(steamType, steamId, priceInfo, button) {
        if (button) {
            button.textContent = '⏳ Loading...';
            button.disabled = true;
            button.style.cursor = 'default';
            button.style.opacity = '0.6';
        }

        fetchPrice(steamType, steamId, getGameTitle(), (result) => {
            updatePriceDisplay(result, priceInfo);
        });
    }

    function createClickablePriceLine(steamType, steamId) {
        const giveawayTitle = document.querySelector('.featured__heading__medium');
        if (!giveawayTitle) {
            return;
        }

        const priceInfo = document.createElement('div');
        priceInfo.style.marginTop = '2px';
        priceInfo.style.fontSize = '14px';
        priceInfo.style.color = '#f6f6f6';

        const button = document.createElement('button');
        button.textContent = '🔑:';
        button.style.background = 'transparent';
        button.style.border = 'none';
        button.style.color = '#f6f6f6';
        button.style.fontSize = '18px';
        button.style.cursor = 'pointer';
        button.style.padding = '0';
        button.style.marginLeft = '0';
        button.style.fontWeight = 'bold';

        button.addEventListener('click', () => {
            fetchLowestKeyshopPrice(steamType, steamId, priceInfo, button);
        });

        priceInfo.appendChild(button);
        giveawayTitle.parentNode.insertBefore(priceInfo, giveawayTitle.nextSibling);
    }

    function displayAutomatically(steamType, steamId) {
        const giveawayTitle = document.querySelector('.featured__heading__medium');
        if (!giveawayTitle) {
            return;
        }

        const priceInfo = document.createElement('div');
        priceInfo.style.marginTop = '2px';
        priceInfo.style.fontSize = '14px';
        priceInfo.style.color = '#f6f6f6';

        giveawayTitle.parentNode.insertBefore(priceInfo, giveawayTitle.nextSibling);
        fetchLowestKeyshopPrice(steamType, steamId, priceInfo, null);
    }

    // === LIST VIEW FUNCTIONALITY (OPTIMIZED) ===
    function createListButton(onClick) {
        const button = document.createElement('button');
        button.textContent = '🔑';
        button.style.background = 'transparent';
        button.style.border = '1px solid #73a442';
        button.style.color = '#6cc04a';
        button.style.fontSize = '14px';
        button.style.cursor = 'pointer';
        button.style.padding = '2px 6px';
        button.style.marginTop = '2px';
        button.style.marginLeft = '8px';
        button.style.borderRadius = '3px';
        button.style.display = 'block';
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(button);
        });
        return button;
    }

    function prepareGiveawayRow(row) {
        if (row.dataset.priceProcessed) {
            return null;
        }

        const headingElement = row.querySelector('.giveaway__heading');
        const titleElement = row.querySelector('.giveaway__heading__name');
        const steam = getSteamIdentity(row);
        const gameTitle = titleElement ? titleElement.textContent.trim() : null;

        if (!headingElement || (!steam.id && !gameTitle)) {
            return null;
        }

        row.dataset.priceProcessed = 'true';

        const priceElement = document.createElement('div');
        priceElement.style.fontSize = '14px';
        priceElement.style.color = '#f6f6f6';
        priceElement.style.marginTop = '2px';
        priceElement.style.lineHeight = '1.2';
        headingElement.appendChild(priceElement);

        return {
            steamType: steam.type,
            steamId: steam.id,
            gameTitle: gameTitle,
            cacheKey: getCacheKey(steam.type, steam.id, gameTitle),
            priceElement: priceElement
        };
    }

    function processAllGiveawayRows() {
        const pendingTargets = [];
        document.querySelectorAll('.giveaway__row-outer-wrap').forEach(row => {
            const target = prepareGiveawayRow(row);
            if (target) {
                pendingTargets.push(target);
            }
        });

        if (pendingTargets.length === 0) {
            return;
        }

        const cachedTargets = [];
        const liveTargets = [];

        pendingTargets.forEach(target => {
            const cached = getCachedPrice(target.cacheKey);
            if (cached) {
                cachedTargets.push({ target, cached });
            } else {
                liveTargets.push(target);
            }
        });

        cachedTargets.forEach(({ target, cached }) => {
            updateListPriceDisplay(cached, target.priceElement);
        });

        if (liveTargets.length === 0) {
            return;
        }

        if (currentMode === 'auto' && getApiKey()) {
            liveTargets.forEach(target => {
                target.priceElement.innerHTML = '<span style="color: #888;">⏳ Loading price...</span>';
                target.onResult = (result) => updateListPriceDisplay(result, target.priceElement);
            });
            fetchPriceBatch(liveTargets);
            return;
        }

        liveTargets.forEach(target => {
            target.priceElement.appendChild(createListButton((button) => {
                button.textContent = '⏳ Loading...';
                button.disabled = true;
                button.style.opacity = '0.6';
                fetchPrice(target.steamType, target.steamId, target.gameTitle, (result) => {
                    updateListPriceDisplay(result, target.priceElement);
                });
            }));
        });
    }

    function scheduleListRefresh() {
        clearTimeout(listRefreshTimer);
        listRefreshTimer = setTimeout(processAllGiveawayRows, 250);
    }

    // === MAIN INITIALIZATION ===
    function init() {
        console.log('🔑 SteamGifts Key Prices v4.1 initialized');
        console.log(`📊 Mode: ${currentMode}, Individual: ${individualEnabled}, List: ${listEnabled}, API: ${getApiKey() ? 'SET' : 'NOT SET'}, Currency: ${getCurrencyCode()}`);

        maybePromptForApiKeyOnce();

        if (individualEnabled && isIndividualGiveawayPage()) {
            const steam = getSteamIdentity();
            const gameTitle = getGameTitle();

            if (steam.id || gameTitle) {
                if (currentMode === 'auto') {
                    displayAutomatically(steam.type, steam.id);
                } else {
                    createClickablePriceLine(steam.type, steam.id);
                }
            } else {
                console.warn('❓Neither Steam ID nor game title found on this giveaway page.');
            }
        }

        if (listEnabled && isGiveawayListPage()) {
            processAllGiveawayRows();
            setTimeout(processAllGiveawayRows, 1000);

            const observer = new MutationObserver(() => {
                scheduleListRefresh();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
