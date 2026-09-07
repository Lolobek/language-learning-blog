const COOKIE_CONSENT_KEY = 'cookieConsent';
const COOKIE_CONSENT_VERSION = '1.0';
const COOKIE_DENIED_VALUE = 'denied';
const GOOGLE_ANALYTICS_ID = 'G-S4M422D44C';

function initCookieBanner() {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (consent === COOKIE_CONSENT_VERSION) {
        enableTracking();
        hideCookieBanner();
    } else if (consent === COOKIE_DENIED_VALUE) {
        disableTracking();
        clearTrackingCookies();
        showCookieBanner();
    } else {
        disableTracking();
        clearTrackingCookies();
        showCookieBanner();
    }
}

function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'flex';
    }
}

function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

function enableTracking() {
    window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = false;

    document.querySelectorAll('script[data-tracking]').forEach(script => {
        const replacement = document.createElement('script');
        const source = script.getAttribute('data-src');

        replacement.dataset.consentTracking = 'true';
        if (source) {
            replacement.src = source;
            replacement.async = true;
        } else {
            replacement.type = 'text/javascript';
            replacement.textContent = script.textContent;
        }

        document.head.appendChild(replacement);
        script.remove();
    });

    if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted'
        });
    }
    if (typeof window.clarity === 'function') {
        window.clarity('consent');
    }
    if (typeof window.fbq === 'function') {
        window.fbq('consent', 'grant');
    }
}

function acceptCookies() {
    localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_VERSION);
    enableTracking();
    hideCookieBanner();
}

function rejectCookies() {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    disableTracking();
    clearTrackingCookies();
    hideCookieBanner();
}

function disableTracking() {
    window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = true;

    if (typeof window.clarity === 'function') {
        window.clarity('consent', false);
    }
    if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
            analytics_storage: 'denied',
            ad_storage: 'denied'
        });
    }
    if (typeof window.fbq === 'function') {
        window.fbq('consent', 'revoke');
    }

    document.querySelectorAll('script[data-consent-tracking]').forEach(script => script.remove());
}

function clearTrackingCookies() {
    const cookieNames = new Set([
        '_fbp', '_fbc', '_ga', `_ga_${GOOGLE_ANALYTICS_ID.replace('G-', '')}`,
        '_gid', '_gat', '_clck', '_clsk', 'fr', 'CLID', 'MUID',
        'ANONCHK', 'MR', 'SM', 'SRM_B'
    ]);

    document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name) {
            cookieNames.add(name);
        }
    });

    const domains = ['', location.hostname, `.${location.hostname}`];
    const paths = ['/', location.pathname];

    cookieNames.forEach(cookieName => {
        if (!/^(_fbp|_fbc|_ga|_gid|_gat|_clck|_clsk|fr|CLID|MUID|ANONCHK|MR|SM|SRM_B)/.test(cookieName)) {
            return;
        }

        paths.forEach(path => {
            domains.forEach(domain => {
                const domainAttribute = domain ? `; domain=${domain}` : '';
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=${path}${domainAttribute}`;
            });
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
} else {
    initCookieBanner();
}
