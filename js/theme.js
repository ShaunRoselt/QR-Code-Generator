"use strict";

// Theme Manager
class ThemeManager {
    constructor() {
        this.storageKey = 'qr-theme';
        this.availableThemes = ['dark', 'light', 'system'];
        this.mediaQuery = typeof window.matchMedia === 'function'
            ? window.matchMedia('(prefers-color-scheme: dark)')
            : null;
        this.currentTheme = this.getStoredTheme();
        
        // Allow overriding theme via URL param: ?theme=<themeKey>
        // Only accept exact theme keys defined in `availableThemes` (case-insensitive)
        try {
            const params = new URLSearchParams(window.location.search);
            const urlTheme = params.get('theme');
            if (urlTheme) {
                const normalized = urlTheme.toLowerCase();
                const match = this.availableThemes.find(t => t.toLowerCase() === normalized);
                if (match) {
                    this.currentTheme = match;
                }
            }
        } catch (e) {
            // Ignore any URL parsing errors
        }
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
        this.bindSystemThemeListener();
        this.applyTheme();
    }

    getStoredTheme() {
        try {
            const storedTheme = localStorage.getItem(this.storageKey);
            return this.availableThemes.includes(storedTheme) ? storedTheme : 'dark';
        } catch (error) {
            return 'dark';
        }
    }

    bindSystemThemeListener() {
        if (!this.mediaQuery) {
            return;
        }

        if (typeof this.mediaQuery.addEventListener === 'function') {
            this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
            return;
        }

        if (typeof this.mediaQuery.addListener === 'function') {
            this.mediaQuery.addListener(this.handleSystemThemeChange);
        }
    }

    handleSystemThemeChange() {
        if (this.currentTheme === 'system') {
            this.applyTheme();
            return;
        }

        this.emitThemeChange();
    }

    resolveTheme(theme = this.currentTheme) {
        if (theme === 'system') {
            return this.mediaQuery?.matches ? 'dark' : 'light';
        }

        // For non-system themes, return the theme key itself so
        // the data-theme attribute can be used for arbitrary themes.
        return theme;
    }

    emitThemeChange() {
        document.dispatchEvent(new CustomEvent('app:theme-changed', {
            detail: {
                theme: this.currentTheme,
                resolvedTheme: this.getResolvedTheme()
            }
        }));
    }
    
    applyTheme() {
        const resolvedTheme = this.resolveTheme();

        document.documentElement.setAttribute('data-theme', resolvedTheme);

        try {
            localStorage.setItem(this.storageKey, this.currentTheme);
        } catch (error) {
            console.error('Failed to persist theme preference:', error);
        }

        this.emitThemeChange();
    }
    
    toggleTheme() {
        this.setTheme(this.getResolvedTheme() === 'dark' ? 'light' : 'dark');
    }
    
    setTheme(theme) {
        if (this.availableThemes.includes(theme)) {
            this.currentTheme = theme;
            this.applyTheme();
        }
    }
    
    getTheme() {
        return this.currentTheme;
    }

    getResolvedTheme() {
        return this.resolveTheme();
    }
}

// Export theme manager instance
const themeManager = new ThemeManager();
