// Settings Page Module
const SettingsPage = {
    appInfo: null,
    
    async render() {
        const currentTheme = themeManager.getTheme();
        
        // Fetch app info from package.json
        await this.loadAppInfo();
        
        const versionInfo = this.appInfo ? 
            `Version ${this.appInfo.version} | RELEASE | ${this.appInfo.releaseDate}` :
            'Loading...';
        
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
                            <div class="setting-description" id="versionInfo">${versionInfo}</div>
                        </div>
                    </div>
                    <div class="setting-right">
                        <button class="icon-btn" id="copyInfoBtn" title="Copy System Info">
                            <i class="bi bi-clipboard"></i>
                        </button>
                        <button class="icon-btn" id="releaseNotesBtn" title="Release Notes">
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
    
    async loadAppInfo() {
        if (!this.appInfo) {
            try {
                const response = await fetch('package.json');
                this.appInfo = await response.json();
            } catch (error) {
                console.error('Failed to load app info:', error);
                this.appInfo = {
                    version: '1.0.0',
                    releaseDate: new Date().toLocaleDateString()
                };
            }
        }
    },
    
    getSystemInfo() {
        const info = {
            app: 'QR Code Generator',
            version: this.appInfo?.version || 'Unknown',
            releaseDate: this.appInfo?.releaseDate || 'Unknown',
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            theme: themeManager.getTheme(),
            timestamp: new Date().toISOString()
        };
        
        return `QR Code Generator - System Information
        
App Version: ${info.version}
Release Date: ${info.releaseDate}
User Agent: ${info.userAgent}
Platform: ${info.platform}
Language: ${info.language}
Screen Resolution: ${info.screenResolution}
Current Theme: ${info.theme}
Timestamp: ${info.timestamp}`;
    },
    
    async init() {
        await this.loadAppInfo();
        
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
        
        // Copy system info button
        const copyInfoBtn = document.getElementById('copyInfoBtn');
        copyInfoBtn.addEventListener('click', async () => {
            const systemInfo = this.getSystemInfo();
            try {
                await navigator.clipboard.writeText(systemInfo);
                // Visual feedback
                const icon = copyInfoBtn.querySelector('i');
                icon.className = 'bi bi-check2';
                setTimeout(() => {
                    icon.className = 'bi bi-clipboard';
                }, 2000);
            } catch (error) {
                console.error('Failed to copy:', error);
                alert('Failed to copy to clipboard');
            }
        });
        
        // Release notes button
        const releaseNotesBtn = document.getElementById('releaseNotesBtn');
        releaseNotesBtn.addEventListener('click', () => {
            window.router.navigate('/release-notes');
        });
    }
};
