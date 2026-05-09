"use strict";

// Developer role detection.
// Activated when the URL contains ?role=developer. Persisted in sessionStorage
// so it survives SPA navigations that strip the role query parameter.
(function () {
    const STORAGE_KEY = 'qr-app-role';
    let cachedRole = null;

    try {
        const params = new URLSearchParams(window.location.search);
        const roleFromUrl = params.get('role');
        if (roleFromUrl) {
            sessionStorage.setItem(STORAGE_KEY, roleFromUrl);
            cachedRole = roleFromUrl;
        } else {
            cachedRole = sessionStorage.getItem(STORAGE_KEY);
        }
    } catch (e) {
        cachedRole = null;
    }

    const AppRole = {
        get current() {
            return cachedRole;
        },
        isDeveloper() {
            return cachedRole === 'developer';
        },
        // Append the role param to a URL string so navigation preserves it.
        decorateUrl(url) {
            if (!cachedRole) return url;
            try {
                const u = new URL(url, window.location.origin);
                if (!u.searchParams.has('role')) {
                    u.searchParams.set('role', cachedRole);
                }
                return u.pathname + u.search + u.hash;
            } catch (e) {
                return url;
            }
        }
    };

    window.AppRole = AppRole;
})();
