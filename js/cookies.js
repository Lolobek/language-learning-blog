// Cookie Banner Logic
const COOKIE_CONSENT_KEY = 'cookieConsent';
const COOKIE_CONSENT_VERSION = '1.0';

// Function to initialize the cookie banner
function initCookieBanner() {
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    // If user already accepted, enable tracking and hide banner
    if (hasConsent === COOKIE_CONSENT_VERSION) {
        enableTracking();
        hideCookieBanner();
    } else {
        // Show banner if consent not given
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

    // Enable all tracking scripts by type
    const trackingScripts = document.querySelectorAll('script[data-tracking]');
    trackingScripts.forEach(script => {
        trackingFound = true;
        const type = script.dataset.tracking;
        const src = script.getAttribute('data-src');

        if (src) {
            const newScript = document.createElement('script');
            newScript.src = src;
            newScript.async = true;
            document.head.appendChild(newScript);
        } else {
            const newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.textContent = script.textContent;
            document.head.appendChild(newScript);
        }
    });

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
    // Clear any tracking-related data
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    hideCookieBanner();
}

// Initialize banner on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
} else {
    initCookieBanner();
}
