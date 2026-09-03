// Cookie Banner Logic
const COOKIE_CONSENT_KEY = 'cookieConsent';
const COOKIE_CONSENT_VERSION = '1.0';
const GOOGLE_ANALYTICS_ID = 'G-S4M422D44C';

// Function to initialize the cookie banner
function initCookieBanner() {
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    // If user already accepted, enable tracking and hide banner
    if (hasConsent === COOKIE_CONSENT_VERSION) {
        enableTracking();
        hideCookieBanner();
    } else {
        clearTrackingCookies();
        showCookieBanner();
    }
}

// Function to show the cookie banner
function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'flex';
    }
}

// Function to hide the cookie banner
function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Function to enable tracking scripts
function enableTracking() {
    let trackingFound = false;

    const trackingScripts = document.querySelectorAll('script[data-tracking]');
    trackingScripts.forEach(script => {
        if (script.dataset.enabled === 'true') {
            return;
        }

        trackingFound = true;
        const src = script.getAttribute('data-src');

        if (src) {
            const newScript = document.createElement('script');
            newScript.src = src;
            newScript.async = true;
            newScript.dataset.consentTracking = 'true';
            document.head.appendChild(newScript);
        } else {
            const newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.textContent = script.textContent;
            newScript.dataset.consentTracking = 'true';
            document.head.appendChild(newScript);
        }

        script.dataset.enabled = 'true';
        script.remove();
    });

    if (typeof window.clarity === 'function') {
        window.clarity('consent');
    }

    if (!trackingFound) {
        console.warn('Cookie banner: no tracking placeholders found.');
    }
}

// Function to accept cookies
function acceptCookies() {
    localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_VERSION);
    enableTracking();
    hideCookieBanner();
}

// Function to reject cookies
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
    document.querySelectorAll('script[data-consent-tracking]').forEach(script => script.remove());
}

function clearTrackingCookies() {
    const cookieNames = new Set([
        '_fbp', '_ga', `_ga_${GOOGLE_ANALYTICS_ID.replace('G-', '')}`,
        '_gid', '_gat', '_clck', '_clsk'
    ]);

    document.cookie.split(';').forEach(cookie => {
        cookieNames.add(cookie.split('=')[0].trim());
    });

    const domains = ['', location.hostname, location.hostname ? `.${location.hostname}` : ''];
    const paths = ['/', location.pathname];

    cookieNames.forEach(cookieName => {
        if (/^(_fbp|_ga|_gid|_gat|_clck|_clsk)/.test(cookieName)) {
            paths.forEach(path => {
                domains.forEach(domain => {
                    const domainAttribute = domain ? `; domain=${domain}` : '';
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=${path}${domainAttribute}`;
                });
            });
        }
    });
}

// Initialize banner on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
} else {
    initCookieBanner();
}
