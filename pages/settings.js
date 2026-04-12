const AppDisplaySettings = {
    FULLSCREEN_STORAGE_KEY: 'qr-fullscreen',

    getFullscreenPreference() {
        try {
            return localStorage.getItem(this.FULLSCREEN_STORAGE_KEY) === 'true';
        } catch (error) {
            return false;
        }
    },

    setFullscreenPreference(enabled) {
        try {
            localStorage.setItem(this.FULLSCREEN_STORAGE_KEY, String(Boolean(enabled)));
        } catch (error) {
            console.error('Failed to persist fullscreen preference:', error);
        }
    },

    applyFullscreenLayout(enabled = this.getFullscreenPreference()) {
        document.body.classList.toggle('app-fullscreen', Boolean(enabled));
    },

    async setFullscreen(enabled, { requestBrowserFullscreen = false } = {}) {
        const shouldEnable = Boolean(enabled);
        this.setFullscreenPreference(shouldEnable);
        this.applyFullscreenLayout(shouldEnable);

        if (requestBrowserFullscreen && shouldEnable && document.documentElement.requestFullscreen && !document.fullscreenElement) {
            try {
                await document.documentElement.requestFullscreen();
            } catch (error) {
                console.warn('Browser fullscreen request was blocked.', error);
            }
        }

        if (!shouldEnable && document.exitFullscreen && document.fullscreenElement) {
            try {
                await document.exitFullscreen();
            } catch (error) {
                console.warn('Unable to exit browser fullscreen.', error);
            }
        }
    }
};

AppDisplaySettings.applyFullscreenLayout();

// Settings Page Module
const SettingsPage = {
    appInfo: null,

    getVersionInfo() {
        if (!this.appInfo) {
            return I18n.translateString('Loading...');
        }

        return I18n.translate('Version {version} | WEB | RELEASE | {date}', {
            version: this.appInfo.version,
            date: this.appInfo.releaseDate
        });
    },
    
    async render() {
        const currentTheme = themeManager.getTheme();
        const currentLanguage = I18n.getLanguage();
        const isFullscreenEnabled = AppDisplaySettings.getFullscreenPreference();
        
        // Fetch app info from package.json
        await this.loadAppInfo();
        const versionInfo = this.getVersionInfo();
        const languageOptions = I18n.getLanguages()
            .map(language => `
                <option value="${language.code}" ${currentLanguage === language.code ? 'selected' : ''}>${language.nativeName}</option>
            `)
            .join('');
        
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
                            ${languageOptions}
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
                            <input type="checkbox" id="fullscreenToggle" ${isFullscreenEnabled ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${isFullscreenEnabled ? 'FullScreen' : 'Normal'}</span>
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
                        <a href="LICENSE" target="_blank" rel="noopener noreferrer" class="link-item">
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
            language: I18n.getLanguage(),
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            theme: themeManager.getTheme(),
            timestamp: new Date().toISOString()
        };

        return I18n.translate('QR Code Generator - System Information\n        \nApp Version: {version}\nRelease Date: {releaseDate}\nUser Agent: {userAgent}\nPlatform: {platform}\nLanguage: {language}\nScreen Resolution: {screenResolution}\nCurrent Theme: {theme}\nTimestamp: {timestamp}', info);
    },
    
    async init() {
        await this.loadAppInfo();
        
        // Theme selector
        const themeSelect = document.getElementById('themeSelect');
        themeSelect.addEventListener('change', (e) => {
            themeManager.setTheme(e.target.value);
        });

        const languageSelect = document.getElementById('languageSelect');
        languageSelect.addEventListener('change', e => {
            I18n.setLanguage(e.target.value, { rerender: true });
        });
        
        // Fullscreen toggle
        const fullscreenToggle = document.getElementById('fullscreenToggle');
        const toggleLabel = document.querySelector('.toggle-label');

        const syncFullscreenLabel = enabled => {
            fullscreenToggle.checked = enabled;
            toggleLabel.textContent = enabled
                ? I18n.translateString('FullScreen')
                : I18n.translateString('Normal');
        };

        syncFullscreenLabel(AppDisplaySettings.getFullscreenPreference());
        
        fullscreenToggle.addEventListener('change', async e => {
            const enabled = e.target.checked;
            syncFullscreenLabel(enabled);
            await AppDisplaySettings.setFullscreen(enabled, {
                requestBrowserFullscreen: enabled
            });
        });
        
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            syncFullscreenLabel(AppDisplaySettings.getFullscreenPreference());
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
                alert(I18n.translateString('Failed to copy to clipboard'));
            }
        });
        
        // Release notes button
        const releaseNotesBtn = document.getElementById('releaseNotesBtn');
        releaseNotesBtn.addEventListener('click', () => {
            window.router.navigate('/release-notes');
        });
    }
};
