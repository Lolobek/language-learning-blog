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
    // Enable Google Analytics - inline script FIRST (definitions must be before library)
    const gaScriptInline = document.querySelector('script[data-tracking="google-analytics"]:not([data-src])');
    if (gaScriptInline) {
        const newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.textContent = gaScriptInline.textContent;
        document.head.appendChild(newScript);
    }

    // Enable Google Analytics - external script SECOND (library loads after definitions)
    const gaScriptExternal = document.querySelector('script[data-tracking="google-analytics"][data-src]');
    if (gaScriptExternal) {
        const newScript = document.createElement('script');
        newScript.src = gaScriptExternal.getAttribute('data-src');
        newScript.async = true;
        document.head.appendChild(newScript);
    }

    // Enable Meta Pixel if present - inline script first
    const metaScripts = document.querySelectorAll('script[data-tracking="meta-pixel"]:not([data-src])');
    metaScripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.textContent = script.textContent;
        document.head.appendChild(newScript);
    });

    // Enable Meta Pixel external if present
    const metaScriptExternal = document.querySelector('script[data-tracking="meta-pixel"][data-src]');
    if (metaScriptExternal) {
        const newScript = document.createElement('script');
        newScript.src = metaScriptExternal.getAttribute('data-src');
        newScript.async = true;
        document.head.appendChild(newScript);
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
document.addEventListener('DOMContentLoaded', initCookieBanner);

// Alternative: Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
} else {
    initCookieBanner();
}
