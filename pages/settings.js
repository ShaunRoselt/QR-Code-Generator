"use strict";

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
    BETA_STORAGE_KEY: 'qr-beta-enrolled',

    getThemeLabel(theme, resolvedTheme = themeManager.getResolvedTheme()) {
        if (theme === 'system') {
            const modeLabel = I18n.translateString(resolvedTheme === 'dark' ? 'Dark' : 'Light');
            return I18n.translate('System ({mode})', {
                mode: modeLabel
            });
        }

        return I18n.translateString(theme === 'light' ? 'Light' : 'Dark');
    },

    syncThemeSelect(themeSelect) {
        if (!themeSelect) {
            return;
        }

        const currentTheme = themeManager.getTheme();
        const resolvedTheme = themeManager.getResolvedTheme();

        themeSelect.value = currentTheme;

        Array.from(themeSelect.options).forEach(option => {
            if (option.value === 'system') {
                option.textContent = this.getThemeLabel('system', resolvedTheme);
                return;
            }

            option.textContent = this.getThemeLabel(option.value, resolvedTheme);
        });
    },

    isBetaEnrolled() {
        try {
            return localStorage.getItem(this.BETA_STORAGE_KEY) === 'true';
        } catch (error) {
            return false;
        }
    },

    setBetaEnrollment(enabled) {
        try {
            const nextValue = Boolean(enabled);
            localStorage.setItem(this.BETA_STORAGE_KEY, String(nextValue));
            document.dispatchEvent(new CustomEvent('app:beta-changed', {
                detail: {
                    enabled: nextValue
                }
            }));
        } catch (error) {
            console.error('Failed to persist beta enrollment state:', error);
        }
    },

    getReleaseChannel(isBetaEnrolled = this.isBetaEnrolled()) {
        return isBetaEnrolled ? 'BETA' : 'RELEASE';
    },

    getVersionInfo(isBetaEnrolled = this.isBetaEnrolled()) {
        if (!this.appInfo) {
            return I18n.translateString('Loading...');
        }

        return I18n.translate('Version {version} | WEB | {channel} | {date}', {
            version: this.appInfo.version,
            channel: this.getReleaseChannel(isBetaEnrolled),
            date: this.appInfo.releaseDate
        });
    },

    getBetaToggleButtonMarkup(isBetaEnrolled = this.isBetaEnrolled()) {
        const iconMarkup = isBetaEnrolled
            ? `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0Zm0 14A6 6 0 1 1 14 8a6 6 0 0 1-6 6Zm1-9.5L4.5 8 9 11.5V9h4V7H9V4.5Z"/></svg>`
            : `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0Zm0 14A6 6 0 1 1 14 8a6 6 0 0 1-6 6ZM4.5 7h7v2h-7z"/></svg>`;
        const label = I18n.translateString(isBetaEnrolled ? 'Leave Beta' : 'Join Beta');

        return `
            <button class="icon-btn settings-beta-btn" id="betaToggleBtn" type="button" title="${label}" aria-label="${label}">
                ${iconMarkup}
            </button>
        `;
    },

    getBetaEnrollmentDialogMarkup(isBetaEnrolled = this.isBetaEnrolled()) {
        const title = I18n.translateString(isBetaEnrolled ? 'Leave beta?' : 'Join beta?');
        const description = I18n.translateString(isBetaEnrolled
            ? 'You are currently enrolled in the beta version. Do you want to leave beta?'
            : 'Do you want to enroll into the beta version?');
        const confirmLabel = I18n.translateString(isBetaEnrolled ? 'Leave Beta' : 'Join Beta');
        const cancelLabel = I18n.translateString('Cancel');

        return `
            <div class="settings-modal" id="betaEnrollmentDialog" hidden>
                <div class="settings-modal-backdrop" data-beta-dialog-close="true" aria-hidden="true"></div>
                <div class="settings-modal-panel" role="dialog" aria-modal="true" aria-labelledby="betaEnrollmentDialogTitle" aria-describedby="betaEnrollmentDialogMessage">
                        <div class="settings-modal-header">
                            <div class="settings-modal-icon">
                            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0Zm0 14A6 6 0 1 1 14 8a6 6 0 0 1-6 6Zm1-9.5L4.5 8 9 11.5V9h4V7H9V4.5Z"/></svg>
                            </div>
                        <div class="settings-modal-copy">
                            <h2 class="settings-modal-title" id="betaEnrollmentDialogTitle">${title}</h2>
                            <p class="settings-modal-message" id="betaEnrollmentDialogMessage">${description}</p>
                        </div>
                    </div>
                    <div class="settings-modal-actions">
                        <button type="button" class="btn btn-secondary" data-beta-dialog-close="true">${cancelLabel}</button>
                        <button type="button" class="btn btn-primary" id="betaEnrollmentConfirmBtn">${confirmLabel}</button>
                    </div>
                </div>
            </div>
        `;
    },

    syncBetaEnrollmentUI(versionInfoElement, betaToggleBtn, betaDialog = null) {
        const isBetaEnrolled = this.isBetaEnrolled();

        if (versionInfoElement) {
            versionInfoElement.textContent = this.getVersionInfo(isBetaEnrolled);
        }

        if (!betaToggleBtn) {
            return;
        }

        const label = I18n.translateString(isBetaEnrolled ? 'Leave Beta' : 'Join Beta');
        betaToggleBtn.title = label;
        betaToggleBtn.setAttribute('aria-label', label);
        betaToggleBtn.innerHTML = isBetaEnrolled
            ? `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0Zm0 14A6 6 0 1 1 14 8a6 6 0 0 1-6 6Zm1-9.5L4.5 8 9 11.5V9h4V7H9V4.5Z"/></svg>`
            : `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0Zm0 14A6 6 0 1 1 14 8a6 6 0 0 1-6 6ZM4.5 7h7v2h-7z"/></svg>`;

        if (!betaDialog) {
            return;
        }

        const dialogTitle = betaDialog.querySelector('#betaEnrollmentDialogTitle');
        const dialogMessage = betaDialog.querySelector('#betaEnrollmentDialogMessage');
        const confirmButton = betaDialog.querySelector('#betaEnrollmentConfirmBtn');
        if (dialogTitle) {
            dialogTitle.textContent = I18n.translateString(isBetaEnrolled ? 'Leave beta?' : 'Join beta?');
        }
        if (dialogMessage) {
            dialogMessage.textContent = I18n.translateString(isBetaEnrolled
                ? 'You are currently enrolled in the beta version. Do you want to leave beta?'
                : 'Do you want to enroll into the beta version?');
        }
        if (confirmButton) {
            confirmButton.textContent = I18n.translateString(isBetaEnrolled ? 'Leave Beta' : 'Join Beta');
        }
    },

    openBetaEnrollmentDialog(betaDialog) {
        if (!betaDialog) {
            return;
        }

        betaDialog.hidden = false;
        requestAnimationFrame(() => {
            betaDialog.classList.add('is-open');
            betaDialog.querySelector('#betaEnrollmentConfirmBtn')?.focus();
        });
    },

    closeBetaEnrollmentDialog(betaDialog) {
        if (!betaDialog) {
            return;
        }

        betaDialog.classList.remove('is-open');
        betaDialog.hidden = true;
    },
    
    async render() {
        const currentTheme = themeManager.getTheme();
        const resolvedTheme = themeManager.getResolvedTheme();
        const currentLanguage = I18n.getLanguage();
        const isFullscreenEnabled = AppDisplaySettings.getFullscreenPreference();
        const isBetaEnrolled = this.isBetaEnrolled();
        
        // Fetch app info from package.json
        await this.loadAppInfo();
        const versionInfo = this.getVersionInfo(isBetaEnrolled);
        const languageOptions = I18n.getLanguages()
            .map(language => `
                <option value="${language.code}" ${currentLanguage === language.code ? 'selected' : ''}>${I18n.getLanguageDisplayName(language.code)}</option>
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
                            <option value="system" ${currentTheme === 'system' ? 'selected' : ''}>${this.getThemeLabel('system', resolvedTheme)}</option>
                            <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>${this.getThemeLabel('dark', resolvedTheme)}</option>
                            <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>${this.getThemeLabel('light', resolvedTheme)}</option>
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
                            <img class="setting-logo" src="assets/favicon.svg" alt="" width="40" height="40">
                        </div>
                        <div class="setting-info">
                            <div class="setting-label">QR Code Generator</div>
                            <div class="setting-description" id="versionInfo">${versionInfo}</div>
                        </div>
                    </div>
                    <div class="setting-right app-details-actions">
                        ${this.getBetaToggleButtonMarkup(isBetaEnrolled)}
                        <button class="icon-btn" id="copyInfoBtn" title="Copy System Info">
                            <i class="bi bi-clipboard"></i>
                        </button>
                        <button class="icon-btn" id="releaseNotesBtn" title="Release Notes">
                            <i class="bi bi-box-arrow-up-right"></i>
                        </button>
                    </div>
                </div>

                ${this.getBetaEnrollmentDialogMarkup(isBetaEnrolled)}
                
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
            releaseChannel: this.getReleaseChannel(),
            releaseDate: this.appInfo?.releaseDate || 'Unknown',
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: I18n.getLanguage(),
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            theme: this.getThemeLabel(themeManager.getTheme(), themeManager.getResolvedTheme()),
            timestamp: new Date().toISOString()
        };

        return I18n.translate('QR Code Generator - System Information\n        \nApp Version: {version}\nRelease Channel: {releaseChannel}\nRelease Date: {releaseDate}\nUser Agent: {userAgent}\nPlatform: {platform}\nLanguage: {language}\nScreen Resolution: {screenResolution}\nCurrent Theme: {theme}\nTimestamp: {timestamp}', info);
    },
    
    async init() {
        await this.loadAppInfo();
        
        // Theme selector
        const themeSelect = document.getElementById('themeSelect');
        const syncThemeSelect = () => this.syncThemeSelect(themeSelect);

        syncThemeSelect();
        themeSelect.addEventListener('change', (e) => {
            themeManager.setTheme(e.target.value);
        });
        document.addEventListener('app:theme-changed', syncThemeSelect);

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

        const versionInfoElement = document.getElementById('versionInfo');
        const betaToggleBtn = document.getElementById('betaToggleBtn');
        const betaDialog = document.getElementById('betaEnrollmentDialog');
        const betaConfirmBtn = document.getElementById('betaEnrollmentConfirmBtn');
        this.syncBetaEnrollmentUI(versionInfoElement, betaToggleBtn, betaDialog);

        betaToggleBtn?.addEventListener('click', () => {
            this.openBetaEnrollmentDialog(betaDialog);
        });

        betaDialog?.addEventListener('click', (event) => {
            const closeAction = event.target.closest('[data-beta-dialog-close="true"]');
            if (closeAction) {
                this.closeBetaEnrollmentDialog(betaDialog);
            }
        });

        betaConfirmBtn?.addEventListener('click', () => {
            const isBetaEnrolled = this.isBetaEnrolled();
            this.setBetaEnrollment(!isBetaEnrolled);
            this.syncBetaEnrollmentUI(versionInfoElement, betaToggleBtn, betaDialog);
            this.closeBetaEnrollmentDialog(betaDialog);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && betaDialog && !betaDialog.hidden) {
                this.closeBetaEnrollmentDialog(betaDialog);
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
