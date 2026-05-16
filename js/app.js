// Main App Initialization
const MOBILE_SIDEBAR_BREAKPOINT = 768;
const AUTO_COLLAPSE_SIDEBAR_BREAKPOINT = 1064;
const DEFAULT_PAGE_META = {
    title: 'QR Code Generator',
    description: 'Professional QR Code Generator - Create custom QR codes',
    keywords: 'qr code generator, qr code maker, qr code creator',
    ogTitle: 'QR Code Generator',
    ogDescription: 'Professional QR Code Generator - Create custom QR codes',
    ogUrl: 'https://qrcode.apps.shaunroselt.com/index.html?page=home',
    twitterTitle: 'QR Code Generator',
    twitterDescription: 'Professional QR Code Generator - Create custom QR codes'
};

// Navigation state management
function updateNavigation(route) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current route
    const activeItem = document.querySelector(`.nav-item[data-route="${route}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

function upsertMeta(selector, attributes) {
    let element = document.head.querySelector(selector);

    if (!element) {
        element = document.createElement('meta');
        Object.entries(attributes).forEach(([key, value]) => {
            if (key !== 'content') {
                element.setAttribute(key, value);
            }
        });
        document.head.appendChild(element);
    }

    if (attributes.content !== undefined) {
        element.setAttribute('content', attributes.content);
    }
}

function applyPageMetadata(meta = DEFAULT_PAGE_META) {
    document.title = meta.title;
    upsertMeta('meta[name="description"]', { name: 'description', content: meta.description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: meta.keywords });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: meta.ogTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: meta.ogDescription });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: meta.ogUrl });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.twitterTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: meta.twitterDescription });
}

function applyShellMode(route) {
    document.body.classList.toggle('public-route', route === '/public' || route === '/pricing' || route === '/compare');
}

function isBetaEnrolled() {
    try {
        return localStorage.getItem('qr-beta-enrolled') === 'true';
    } catch (error) {
        return false;
    }
}

function syncBetaSidebarVisibility() {
    const isBeta = isBetaEnrolled();
    document.querySelectorAll('[data-beta-only-nav]').forEach(item => {
        item.hidden = !isBeta;
    });
    document.querySelectorAll('[data-beta-only-divider]').forEach(item => {
        item.hidden = !isBeta;
    });
}

function applyCurrentRouteMetadata() {
    const currentRoute = router.getCurrentRoute();
    if (currentRoute === '/public') {
        applyPageMetadata(PublicPage.meta);
        return;
    }

    if (currentRoute === '/pricing') {
        applyPageMetadata(PricingPage.meta);
        return;
    }

    if (currentRoute === '/compare') {
        applyPageMetadata(ComparePage.meta);
        return;
    }

    applyPageMetadata(DEFAULT_PAGE_META);
}

function renderRoute({ route, render, init, meta = DEFAULT_PAGE_META }) {
    applyShellMode(route);
    updateNavigation(route);
    applyPageMetadata(meta);
    document.getElementById('mainContent').innerHTML = render();
    init();
}

// Route definitions
router.register('/public', () => {
    renderRoute({
        route: '/public',
        render: () => PublicPage.render(),
        init: () => PublicPage.init(),
        meta: PublicPage.meta
    });
});

router.register('/home', () => {
    renderRoute({
        route: '/home',
        render: () => HomePage.render(),
        init: () => HomePage.init()
    });
});

router.register('/pricing', () => {
    renderRoute({
        route: '/pricing',
        render: () => PricingPage.render(),
        init: () => PricingPage.init(),
        meta: PricingPage.meta
    });
});

router.register('/compare', () => {
    renderRoute({
        route: '/compare',
        render: () => ComparePage.render(),
        init: () => ComparePage.init(),
        meta: ComparePage.meta
    });
});

router.register('/settings', async () => {
    applyShellMode('/settings');
    updateNavigation('/settings');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = await SettingsPage.render();
    SettingsPage.init();
});

router.register('/release-notes', async () => {
    applyShellMode('/release-notes');
    updateNavigation('/release-notes');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = ReleaseNotesPage.render();
    ReleaseNotesPage.init();
});

// QR Mode routes
router.register('/url', () => {
    applyShellMode('/url');
    updateNavigation('/url');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = URLMode.render();
    URLMode.init();
});

router.register('/text', () => {
    applyShellMode('/text');
    updateNavigation('/text');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = TextMode.render();
    TextMode.init();
});

router.register('/email', () => {
    applyShellMode('/email');
    updateNavigation('/email');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = EmailMode.render();
    EmailMode.init();
});

router.register('/phone', () => {
    applyShellMode('/phone');
    updateNavigation('/phone');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = PhoneMode.render();
    PhoneMode.init();
});

router.register('/sms', () => {
    applyShellMode('/sms');
    updateNavigation('/sms');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = SmsMode.render();
    SmsMode.init();
});

router.register('/whatsapp', () => {
    applyShellMode('/whatsapp');
    updateNavigation('/whatsapp');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = WhatsappMode.render();
    WhatsappMode.init();
});

router.register('/wifi', () => {
    applyShellMode('/wifi');
    updateNavigation('/wifi');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = WifiMode.render();
    WifiMode.init();
});

router.register('/location', () => {
    applyShellMode('/location');
    updateNavigation('/location');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = LocationMode.render();
    LocationMode.init();
});

router.register('/event', () => {
    applyShellMode('/event');
    updateNavigation('/event');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = EventMode.render();
    EventMode.init();
});

router.register('/appstore', () => {
    applyShellMode('/appstore');
    updateNavigation('/appstore');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = AppstoreMode.render();
    AppstoreMode.init();
});

router.register('/social', () => {
    applyShellMode('/social');
    updateNavigation('/social');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = SocialMode.render();
    SocialMode.init();
});

router.register('/vcard', () => {
    applyShellMode('/vcard');
    updateNavigation('/vcard');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = VcardMode.render();
    VcardMode.init();
});
router.register('/frames', () => {
    if (!isBetaEnrolled()) {
        router.navigate('/home');
        return;
    }
    applyShellMode('/frames');
    updateNavigation('/frames');
    applyPageMetadata(DEFAULT_PAGE_META);
    document.getElementById('mainContent').innerHTML = FramesMode.render();
    FramesMode.init();
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    AppDisplaySettings.applyFullscreenLayout();
    I18n.init();
    document.addEventListener('app:route-rendered', () => {
        applyCurrentRouteMetadata();
    });
    document.addEventListener('app:beta-changed', syncBetaSidebarVisibility);
    document.addEventListener('app:beta-changed', () => {
        if (router.getCurrentRoute() === '/frames' && !isBetaEnrolled()) {
            router.navigate('/home');
        }
    });

    // Hamburger menu toggle - collapse/expand sidebar
    const appContainer = document.querySelector('.app-container');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const isOverlaySidebar = () => appContainer.clientWidth <= MOBILE_SIDEBAR_BREAKPOINT;
    const shouldAutoCollapseSidebar = () => appContainer.clientWidth <= AUTO_COLLAPSE_SIDEBAR_BREAKPOINT;
    const closeOverlaySidebar = () => sidebar.classList.remove('open');
    let desktopSidebarCollapsedPreference = sidebar.classList.contains('collapsed');
    let sidebarAutoCollapsed = false;
    let sidebarLayoutRefreshTimeout = null;

    const dispatchSidebarLayoutChanged = () => {
        document.dispatchEvent(new CustomEvent('app:sidebar-layout-changed'));
    };

    const scheduleSidebarLayoutChanged = () => {
        if (isOverlaySidebar()) {
            return;
        }

        if (sidebarLayoutRefreshTimeout !== null) {
            window.clearTimeout(sidebarLayoutRefreshTimeout);
        }

        sidebarLayoutRefreshTimeout = window.setTimeout(() => {
            sidebarLayoutRefreshTimeout = null;
            dispatchSidebarLayoutChanged();
        }, 320);
    };

    const syncSidebarMode = () => {
        if (isOverlaySidebar()) {
            sidebar.classList.remove('collapsed');
            return;
        }

        closeOverlaySidebar();

        if (shouldAutoCollapseSidebar()) {
            if (!sidebarAutoCollapsed && !sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('collapsed');
                sidebarAutoCollapsed = true;
            }
            return;
        }

        if (sidebarAutoCollapsed) {
            sidebar.classList.remove('collapsed');
            sidebarAutoCollapsed = false;
            desktopSidebarCollapsedPreference = false;
            return;
        }

        sidebar.classList.toggle('collapsed', desktopSidebarCollapsedPreference);
    };
    
    menuToggle.addEventListener('click', () => {
        if (isOverlaySidebar()) {
            sidebar.classList.toggle('open');
            sidebar.classList.remove('collapsed');
            return;
        }

        sidebar.classList.toggle('collapsed');
        desktopSidebarCollapsedPreference = sidebar.classList.contains('collapsed');
        sidebarAutoCollapsed = false;
        scheduleSidebarLayoutChanged();
    });

    sidebar.addEventListener('transitionend', event => {
        if (event.propertyName !== 'width' || isOverlaySidebar()) {
            return;
        }

        if (sidebarLayoutRefreshTimeout !== null) {
            window.clearTimeout(sidebarLayoutRefreshTimeout);
            sidebarLayoutRefreshTimeout = null;
        }

        dispatchSidebarLayoutChanged();
    });
    
    // Handle navigation clicks
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const route = item.getAttribute('data-route');
            closeOverlaySidebar();
            router.navigate(route);
        });
    });

    document.querySelectorAll('[data-route]').forEach(item => {
        if (item.classList.contains('nav-item')) {
            return;
        }

        if (item.getAttribute('target') === '_blank') {
            return;
        }

        item.addEventListener('click', event => {
            const route = item.getAttribute('data-route');
            if (!route) {
                return;
            }

            event.preventDefault();
            closeOverlaySidebar();
            router.navigate(route);
        });
    });

    document.addEventListener('click', (event) => {
        if (!isOverlaySidebar() || !sidebar.classList.contains('open')) {
            return;
        }

        if (sidebar.contains(event.target) || menuToggle.contains(event.target)) {
            return;
        }

        closeOverlaySidebar();
    });

    window.addEventListener('resize', syncSidebarMode);

    if (typeof ResizeObserver === 'function') {
        new ResizeObserver(syncSidebarMode).observe(appContainer);
    }

    syncBetaSidebarVisibility();
    syncSidebarMode();
    
    // Initialize router
    router.handleRoute();
});
