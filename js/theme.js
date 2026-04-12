// Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('qr-theme') || 'dark';
        this.applyTheme();
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('qr-theme', this.currentTheme);
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
    }
    
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.currentTheme = theme;
            this.applyTheme();
        }
    }
    
    getTheme() {
        return this.currentTheme;
    }
}

// Export theme manager instance
const themeManager = new ThemeManager();
