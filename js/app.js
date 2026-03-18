// Main App Initialization

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

// Route definitions
router.register('/', () => {
    updateNavigation('/');
    document.getElementById('mainContent').innerHTML = HomePage.render();
    HomePage.init();
});

router.register('/settings', async () => {
    updateNavigation('/settings');
    document.getElementById('mainContent').innerHTML = await SettingsPage.render();
    SettingsPage.init();
});

router.register('/release-notes', async () => {
    updateNavigation('/release-notes');
    document.getElementById('mainContent').innerHTML = ReleaseNotesPage.render();
    ReleaseNotesPage.init();
});

// QR Mode routes
router.register('/url', () => {
    updateNavigation('/url');
    document.getElementById('mainContent').innerHTML = URLMode.render();
    URLMode.init();
});

router.register('/text', () => {
    updateNavigation('/text');
    document.getElementById('mainContent').innerHTML = TextMode.render();
    TextMode.init();
});

router.register('/email', () => {
    updateNavigation('/email');
    document.getElementById('mainContent').innerHTML = EmailMode.render();
    EmailMode.init();
});

router.register('/phone', () => {
    updateNavigation('/phone');
    document.getElementById('mainContent').innerHTML = PhoneMode.render();
    PhoneMode.init();
});

router.register('/sms', () => {
    updateNavigation('/sms');
    document.getElementById('mainContent').innerHTML = SmsMode.render();
    SmsMode.init();
});

router.register('/whatsapp', () => {
    updateNavigation('/whatsapp');
    document.getElementById('mainContent').innerHTML = WhatsappMode.render();
    WhatsappMode.init();
});

router.register('/wifi', () => {
    updateNavigation('/wifi');
    document.getElementById('mainContent').innerHTML = WifiMode.render();
    WifiMode.init();
});

router.register('/location', () => {
    updateNavigation('/location');
    document.getElementById('mainContent').innerHTML = LocationMode.render();
    LocationMode.init();
});

router.register('/event', () => {
    updateNavigation('/event');
    document.getElementById('mainContent').innerHTML = EventMode.render();
    EventMode.init();
});

router.register('/appstore', () => {
    updateNavigation('/appstore');
    document.getElementById('mainContent').innerHTML = AppstoreMode.render();
    AppstoreMode.init();
});

router.register('/social', () => {
    updateNavigation('/social');
    document.getElementById('mainContent').innerHTML = SocialMode.render();
    SocialMode.init();
});

router.register('/vcard', () => {
    updateNavigation('/vcard');
    document.getElementById('mainContent').innerHTML = VcardMode.render();
    VcardMode.init();
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle - collapse/expand sidebar
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const isOverlaySidebar = () => window.innerWidth <= 1024;
    const closeOverlaySidebar = () => sidebar.classList.remove('open');
    
    menuToggle.addEventListener('click', () => {
        if (isOverlaySidebar()) {
            sidebar.classList.toggle('open');
            sidebar.classList.remove('collapsed');
            return;
        }

        sidebar.classList.toggle('collapsed');
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

    document.addEventListener('click', (event) => {
        if (!isOverlaySidebar() || !sidebar.classList.contains('open')) {
            return;
        }

        if (sidebar.contains(event.target) || menuToggle.contains(event.target)) {
            return;
        }

        closeOverlaySidebar();
    });

    window.addEventListener('resize', () => {
        if (isOverlaySidebar()) {
            sidebar.classList.remove('collapsed');
            return;
        }

        closeOverlaySidebar();
    });
    
    // Initialize router
    router.handleRoute();
});
