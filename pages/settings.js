// Settings Page Module
const SettingsPage = {
    render() {
        const currentTheme = themeManager.getTheme();
        
        return `
            <div class="content-header">
                <h1 class="content-title">Settings</h1>
            </div>
            
            <div class="settings-container">
                <!-- Theme Setting -->
                <div class="setting-row">
                    <div class="setting-left">
                        <div class="setting-icon">
                            <i class="bi bi-palette"></i>
                        </div>
                        <div class="setting-info">
                            <div class="setting-label">Theme</div>
                            <div class="setting-description">Select which theme to display</div>
                        </div>
                    </div>
                    <div class="setting-right">
                        <select class="setting-select" id="themeSelect">
                            <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>Dark</option>
                            <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>Light</option>
                        </select>
                    </div>
                </div>
                
                <!-- Language Setting -->
                <div class="setting-row">
                    <div class="setting-left">
                        <div class="setting-icon">
                            <i class="bi bi-translate"></i>
                        </div>
                        <div class="setting-info">
                            <div class="setting-label">Language</div>
                            <div class="setting-description">Select which language to display</div>
                        </div>
                    </div>
                    <div class="setting-right">
                        <select class="setting-select" id="languageSelect">
                            <option value="en" selected>English</option>
                        </select>
                    </div>
                </div>
                
                <!-- FullScreen Setting -->
                <div class="setting-row">
                    <div class="setting-left">
                        <div class="setting-icon">
                            <i class="bi bi-arrows-fullscreen"></i>
                        </div>
                        <div class="setting-info">
                            <div class="setting-label">FullScreen (F11)</div>
                            <div class="setting-description">Select whether you want the app to be FullScreen or not</div>
                        </div>
                    </div>
                    <div class="setting-right">
                        <label class="toggle-switch">
                            <input type="checkbox" id="fullscreenToggle">
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">Normal</span>
                        </label>
                    </div>
                </div>
                
                <!-- App Details -->
                <div class="setting-row app-details">
                    <div class="setting-left">
                        <div class="setting-icon app-icon">
                            <i class="bi bi-qr-code-scan"></i>
                        </div>
                        <div class="setting-info">
                            <div class="setting-label">QR Code Generator</div>
                            <div class="setting-description">Version 2.0.0 | RELEASE | ${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="setting-right">
                        <button class="icon-btn" title="Copy">
                            <i class="bi bi-clipboard"></i>
                        </button>
                        <button class="icon-btn" title="Open">
                            <i class="bi bi-box-arrow-up-right"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Useful Links -->
                <div class="useful-links">
                    <div class="links-header">
                        <i class="bi bi-link-45deg"></i>
                        Useful Links
                    </div>
                    <div class="links-grid">
                        <a href="https://github.com/ShaunRoselt/QR-Code-Generator" target="_blank" class="link-item">
                            <i class="bi bi-github"></i>
                            <span>Source Code</span>
                        </a>
                        <a href="#" class="link-item">
                            <i class="bi bi-asterisk"></i>
                            <span>License</span>
                        </a>
                        <a href="#" class="link-item">
                            <i class="bi bi-steam"></i>
                            <span>Download on Steam</span>
                        </a>
                        <a href="https://github.com/ShaunRoselt/QR-Code-Generator/issues" target="_blank" class="link-item">
                            <i class="bi bi-bug"></i>
                            <span>Report a problem</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    },
    
    init() {
        // Theme selector
        const themeSelect = document.getElementById('themeSelect');
        themeSelect.addEventListener('change', (e) => {
            themeManager.setTheme(e.target.value);
        });
        
        // Fullscreen toggle
        const fullscreenToggle = document.getElementById('fullscreenToggle');
        const toggleLabel = document.querySelector('.toggle-label');
        
        fullscreenToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                toggleLabel.textContent = 'FullScreen';
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                }
            } else {
                toggleLabel.textContent = 'Normal';
                if (document.exitFullscreen && document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        });
        
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                fullscreenToggle.checked = false;
                toggleLabel.textContent = 'Normal';
            }
        });
    }
};
