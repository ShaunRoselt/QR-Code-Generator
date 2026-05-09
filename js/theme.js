"use strict";

// Theme Manager
class ThemeManager {
    constructor() {
        this.storageKey = 'qr-theme';
        this.mediaQuery = typeof window.matchMedia === 'function'
            ? window.matchMedia('(prefers-color-scheme: dark)')
            : null;
        this.currentTheme = this.getStoredTheme();
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
        this.bindSystemThemeListener();
        this.applyTheme();
    }

    getStoredTheme() {
        try {
            const storedTheme = localStorage.getItem(this.storageKey);
            return storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'system'
                ? storedTheme
                : 'dark';
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

        return theme === 'light' ? 'light' : 'dark';
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
        if (theme === 'dark' || theme === 'light' || theme === 'system') {
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
