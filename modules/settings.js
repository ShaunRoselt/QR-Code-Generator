// Settings Page Module
const SettingsPage = {
    render() {
        const currentTheme = themeManager.getTheme();
        
        return `
            <div class="content-header">
                <h1 class="content-title">Settings</h1>
                <p class="content-subtitle">Configure your preferences</p>
            </div>
            
            <div class="settings-section">
                <h2 class="section-title">
                    <i class="bi bi-palette"></i>
                    Appearance
                </h2>
                
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">
                            <i class="bi bi-brightness-high"></i>
                            Theme
                        </div>
                        <div class="setting-description">Select which theme to display</div>
                    </div>
                    <div class="setting-control">
                        <div class="theme-selector">
                            <button class="theme-option ${currentTheme === 'light' ? 'active' : ''}" data-theme="light">
                                Light
                            </button>
                            <button class="theme-option ${currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                                Dark
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="settings-section">
                <h2 class="section-title">
                    <i class="bi bi-info-circle"></i>
                    About
                </h2>
                
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">
                            <i class="bi bi-qr-code-scan"></i>
                            QR Code Generator
                        </div>
                        <div class="setting-description">Version 2.0.0 | Professional QR Code Generator</div>
                    </div>
                </div>
                
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-title">
                            <i class="bi bi-shield-check"></i>
                            Privacy
                        </div>
                        <div class="setting-description">All processing happens in your browser - no data is sent to servers</div>
                    </div>
                </div>
            </div>
        `;
    },
    
    init() {
        // Theme selector event listeners
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                themeManager.setTheme(theme);
                
                // Update active state
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Update theme indicator
                updateThemeIndicator();
            });
        });
    }
};

function updateThemeIndicator() {
    // This function is called to update the theme indicator in the top bar
    // The color is automatically updated via CSS based on data-theme attribute
}
