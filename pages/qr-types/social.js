// Social Media QR Code Module
const SocialMode = {
    getPlatformOptions() {
        return [
            {
                value: 'other',
                label: 'Other',
                hint: 'Enter the full social profile URL',
                url: ''
            },
            {
                value: 'facebook',
                label: 'Facebook',
                hint: 'Enter your Facebook username',
                url: 'https://facebook.com/'
            },
            {
                value: 'instagram',
                label: 'Instagram',
                hint: 'Enter your Instagram username',
                url: 'https://instagram.com/'
            },
            {
                value: 'twitter',
                label: 'Twitter / X',
                hint: 'Enter your Twitter/X username',
                url: 'https://twitter.com/',
                logoPresetId: 'x'
            },
            {
                value: 'linkedin',
                label: 'LinkedIn',
                hint: 'Enter your LinkedIn username',
                url: 'https://linkedin.com/in/'
            },
            {
                value: 'tiktok',
                label: 'TikTok',
                hint: 'Enter your TikTok username',
                url: 'https://tiktok.com/@'
            },
            {
                value: 'youtube',
                label: 'YouTube',
                hint: 'Enter your YouTube channel name',
                url: 'https://youtube.com/@'
            },
            {
                value: 'snapchat',
                label: 'Snapchat',
                hint: 'Enter your Snapchat username',
                url: 'https://snapchat.com/add/'
            },
            {
                value: 'pinterest',
                label: 'Pinterest',
                hint: 'Enter your Pinterest username',
                url: 'https://pinterest.com/'
            },
            {
                value: 'reddit',
                label: 'Reddit',
                hint: 'Enter your Reddit username',
                url: 'https://reddit.com/u/'
            },
            {
                value: 'discord',
                label: 'Discord',
                hint: 'Enter your Discord user ID',
                url: 'https://discord.com/users/'
            },
            {
                value: 'telegram',
                label: 'Telegram',
                hint: 'Enter your Telegram username',
                url: 'https://t.me/'
            },
            {
                value: 'bluesky',
                label: 'Bluesky',
                hint: 'Enter your Bluesky handle',
                url: 'https://bsky.app/profile/'
            },
            {
                value: 'mastodon',
                label: 'Mastodon',
                hint: 'Enter your full Mastodon handle',
                url: 'https://mastodon.social/@'
            },
            {
                value: 'threads',
                label: 'Threads',
                hint: 'Enter your Threads username',
                url: 'https://threads.net/@'
            },
            {
                value: 'github',
                label: 'GitHub',
                hint: 'Enter your GitHub username',
                url: 'https://github.com/'
            },
            {
                value: 'messenger',
                label: 'Messenger',
                hint: 'Enter your Messenger username',
                url: 'https://m.me/'
            },
            {
                value: 'tumblr',
                label: 'Tumblr',
                hint: 'Enter your Tumblr blog name',
                url: 'https://'
            },
            {
                value: 'medium',
                label: 'Medium',
                hint: 'Enter your Medium username',
                url: 'https://medium.com/@'
            },
            {
                value: 'behance',
                label: 'Behance',
                hint: 'Enter your Behance username',
                url: 'https://www.behance.net/'
            },
            {
                value: 'dribbble',
                label: 'Dribbble',
                hint: 'Enter your Dribbble username',
                url: 'https://dribbble.com/'
            },
            {
                value: 'patreon',
                label: 'Patreon',
                hint: 'Enter your Patreon username',
                url: 'https://patreon.com/'
            },
            {
                value: 'devto',
                label: 'DEV',
                hint: 'Enter your DEV username',
                url: 'https://dev.to/'
            },
            {
                value: 'substack',
                label: 'Substack',
                hint: 'Enter your Substack username',
                url: 'https://substack.com/@'
            },
            {
                value: 'twitch',
                label: 'Twitch',
                hint: 'Enter your Twitch username',
                url: 'https://twitch.tv/'
            }
        ];
    },

    getPlatformLogoMap() {
        if (this.platformLogoMap) {
            return this.platformLogoMap;
        }

        const presets = typeof QRCodeLogoControls?.getLogoPresets === 'function'
            ? QRCodeLogoControls.getLogoPresets()
            : [];
        const presetMap = new Map(presets.map(preset => [preset.id, preset.dataUrl]));

        this.platformLogoMap = this.getPlatformOptions().reduce((map, option) => {
            const presetId = option.logoPresetId || option.value;
            map[option.value] = presetMap.get(presetId) || '';
            return map;
        }, {});

        return this.platformLogoMap;
    },

    getPlatformOptionsMarkup() {
        return this.getPlatformOptions()
            .map(option => `<option value="${option.value}"${option.value === 'other' ? ' selected' : ''}>${option.label}</option>`)
            .join('');
    },

    buildPlatformUrl(platform, username, platformConfig) {
        if (!platformConfig) {
            return '';
        }

        if (platform === 'other') {
            return username;
        }

        if (platform === 'tumblr') {
            return `https://${username}.tumblr.com`;
        }

        return platformConfig.url + username;
    },

    getPlatformDropdownItemsMarkup() {
        const logoMap = this.getPlatformLogoMap();

        return this.getPlatformOptions()
            .map(option => {
                const logoMarkup = logoMap[option.value]
                    ? `<img src="${logoMap[option.value]}" alt="" class="platform-dropdown-option-logo-image">`
                    : '<i class="bi bi-share"></i>';

                return `
                    <button type="button" class="platform-dropdown-option" data-platform="${option.value}" role="option" aria-selected="false">
                        <span class="platform-dropdown-option-logo">${logoMarkup}</span>
                        <span class="platform-dropdown-option-label">${option.label}</span>
                    </button>
                `;
            })
            .join('');
    },

    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">Social Media</h1>
                    <p class="content-subtitle">Create QR codes for social media profiles</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">Social Platform</label>
                            <div class="platform-dropdown" id="platformDropdown">
                                <select class="form-select platform-select-native" id="platformSelect">
                                    <option value="">Select platform...</option>
                                    ${this.getPlatformOptionsMarkup()}
                                </select>
                                <button
                                    type="button"
                                    class="platform-dropdown-trigger"
                                    id="platformDropdownTrigger"
                                    aria-haspopup="listbox"
                                    aria-expanded="false"
                                    aria-controls="platformDropdownMenu"
                                >
                                    <span class="platform-dropdown-trigger-value">
                                        <span class="platform-dropdown-trigger-logo" id="platformDropdownLogo">
                                            <i class="bi bi-share"></i>
                                        </span>
                                        <span class="platform-dropdown-trigger-label" id="platformDropdownLabel">Select platform...</span>
                                    </span>
                                    <i class="bi bi-chevron-down platform-dropdown-trigger-chevron"></i>
                                </button>
                                <div class="platform-dropdown-menu" id="platformDropdownMenu" role="listbox" hidden>
                                    ${this.getPlatformDropdownItemsMarkup()}
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Username / Handle</label>
                            <input type="text" class="form-input" id="usernameInput" placeholder="username">
                            <div class="form-hint" id="usernameHint">Enter your username without @ symbol</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Error Correction</label>
                            <select class="form-select" id="errorCorrection">
                                <option value="L">Very Low (7%)</option>
                                <option value="M">Low (15%)</option>
                                <option value="Q" selected>Medium (25%)</option>
                                <option value="H">High (30%)</option>
                            </select>
                        </div>
                        
                        ${QRFrames.getFrameSelector()}
                    </div>
                    
                    <div class="qr-preview-section">
                        <h2 class="section-title">
                            <i class="bi bi-eye"></i>
                            Preview
                        </h2>
                        
                        <div class="qr-display">
                            <div class="qr-placeholder" id="qrPlaceholder">
                                <i class="bi bi-qr-code"></i>
                                <p>Select platform and enter username</p>
                            </div>
                            <div id="qrcode"></div>
                        </div>
                        
                        <div class="download-options d-none" id="downloadOptions">
                            <label class="form-label">Export Size</label>
                            <select class="form-select mb-2" id="exportSize">
                                <option value="1920">1080p (1920x1920)</option>
                                <option value="2560">1440p (2560x2560)</option>
                                <option value="3840" selected>4K (3840x3840)</option>
                                <option value="7680">8K (7680x7680)</option>
                            </select>
                            <div class="download-buttons">
                                <button class="btn btn-secondary btn-block" id="downloadPng">
                                    <i class="bi bi-download"></i>
                                    Download PNG
                                </button>
                                <button class="btn btn-secondary btn-block" id="downloadSvg">
                                    <i class="bi bi-file-earmark-code"></i>
                                    Download SVG
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    init() {
        const DISPLAY_SIZE = 300;
        const defaultUsernameHint = 'Enter your username without @ symbol';
        const platformOptions = this.getPlatformOptions();
        const platformConfigs = platformOptions.reduce((map, option) => {
            map[option.value] = option;
            return map;
        }, {});
        const platformLogoMap = this.getPlatformLogoMap();
        const platformSelect = document.getElementById('platformSelect');
        const platformDropdown = document.getElementById('platformDropdown');
        const platformDropdownTrigger = document.getElementById('platformDropdownTrigger');
        const platformDropdownMenu = document.getElementById('platformDropdownMenu');
        const platformDropdownLabel = document.getElementById('platformDropdownLabel');
        const platformDropdownLogo = document.getElementById('platformDropdownLogo');
        const platformDropdownOptions = Array.from(document.querySelectorAll('.platform-dropdown-option'));
        const usernameInput = document.getElementById('usernameInput');
        const usernameHint = document.getElementById('usernameHint');
        const errorCorrection = document.getElementById('errorCorrection');
        let typeaheadBuffer = '';
        let typeaheadTimer = null;

        if (platformSelect && !platformSelect.value) {
            platformSelect.value = 'other';
        }
        
        let currentQRCanvas = null;
        let selectedFrame = 'none';
        
        // Frame card selector handler
        const frameCards = document.querySelectorAll('.frame-card');
        frameCards.forEach(card => {
            card.addEventListener('click', () => {
                // Update active state
                frameCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                // Get selected frame
                selectedFrame = card.dataset.frame;
                
                // Auto-generate with new frame
                autoGenerate();
            });
        });
        
        const renderDropdownLogo = platform => {
            const logoDataUrl = platformLogoMap[platform];

            if (!logoDataUrl) {
                platformDropdownLogo.innerHTML = '<i class="bi bi-share"></i>';
                platformDropdownLogo.classList.add('is-placeholder');
                return;
            }

            platformDropdownLogo.innerHTML = `<img src="${logoDataUrl}" alt="" class="platform-dropdown-trigger-logo-image">`;
            platformDropdownLogo.classList.remove('is-placeholder');
        };

        const closePlatformDropdown = () => {
            platformDropdown.classList.remove('is-open');
            platformDropdownTrigger.setAttribute('aria-expanded', 'false');
            platformDropdownMenu.hidden = true;
        };

        const openPlatformDropdown = () => {
            platformDropdown.classList.add('is-open');
            platformDropdownTrigger.setAttribute('aria-expanded', 'true');
            platformDropdownMenu.hidden = false;
        };

        const focusPlatformOption = optionButton => {
            if (!optionButton) {
                return;
            }

            optionButton.focus();
            optionButton.scrollIntoView({ block: 'nearest' });
        };

        const findPlatformOptionBySearch = searchTerm => {
            const normalizedSearchTerm = searchTerm.trim().toLowerCase();
            if (!normalizedSearchTerm) {
                return null;
            }

            return platformDropdownOptions.find(optionButton => {
                const optionLabel = optionButton.querySelector('.platform-dropdown-option-label')?.textContent?.trim().toLowerCase() || '';
                return optionLabel.startsWith(normalizedSearchTerm);
            }) || platformDropdownOptions.find(optionButton => {
                const optionLabel = optionButton.querySelector('.platform-dropdown-option-label')?.textContent?.trim().toLowerCase() || '';
                return optionLabel.includes(normalizedSearchTerm);
            }) || null;
        };

        const handlePlatformTypeahead = event => {
            if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) {
                return false;
            }

            typeaheadBuffer += event.key.toLowerCase();
            window.clearTimeout(typeaheadTimer);
            typeaheadTimer = window.setTimeout(() => {
                typeaheadBuffer = '';
            }, 700);

            const matchedOption = findPlatformOptionBySearch(typeaheadBuffer);
            if (!matchedOption) {
                return false;
            }

            event.preventDefault();

            if (!platformDropdown.classList.contains('is-open')) {
                openPlatformDropdown();
            }

            focusPlatformOption(matchedOption);
            return true;
        };

        const syncPlatformDropdown = platform => {
            const platformConfig = platformConfigs[platform];

            platformDropdownLabel.textContent = platformConfig ? platformConfig.label : 'Select platform...';
            usernameHint.textContent = platformConfig ? platformConfig.hint : defaultUsernameHint;
            renderDropdownLogo(platform);

            platformDropdownOptions.forEach(optionButton => {
                const isActive = optionButton.dataset.platform === platform;
                optionButton.classList.toggle('active', isActive);
                optionButton.setAttribute('aria-selected', String(isActive));
            });
        };
        
        // Update hint when platform changes
        platformSelect.addEventListener('change', () => {
            const platform = platformSelect.value;
            syncPlatformDropdown(platform);
            autoGenerate();
        });

        platformDropdownTrigger.addEventListener('click', () => {
            if (platformDropdown.classList.contains('is-open')) {
                closePlatformDropdown();
                return;
            }

            openPlatformDropdown();
        });

        platformDropdownTrigger.addEventListener('keydown', event => {
            if (handlePlatformTypeahead(event)) {
                return;
            }

            if (event.key !== 'ArrowDown' && event.key !== 'Enter' && event.key !== ' ') {
                return;
            }

            event.preventDefault();
            openPlatformDropdown();
            const selectedOption = platformDropdownOptions.find(optionButton => optionButton.dataset.platform === platformSelect.value);
            focusPlatformOption(selectedOption || platformDropdownOptions[0]);
        });

        platformDropdownOptions.forEach((optionButton, index) => {
            optionButton.addEventListener('click', () => {
                const platform = optionButton.dataset.platform;
                platformSelect.value = platform;
                closePlatformDropdown();
                platformSelect.dispatchEvent(new Event('change', { bubbles: true }));
            });

            optionButton.addEventListener('keydown', event => {
                if (handlePlatformTypeahead(event)) {
                    return;
                }

                if (event.key === 'Escape') {
                    event.preventDefault();
                    closePlatformDropdown();
                    platformDropdownTrigger.focus();
                    return;
                }

                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    platformDropdownOptions[(index + 1) % platformDropdownOptions.length]?.focus();
                    return;
                }

                if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    platformDropdownOptions[(index - 1 + platformDropdownOptions.length) % platformDropdownOptions.length]?.focus();
                }
            });
        });

        document.addEventListener('click', event => {
            if (!platformDropdown.contains(event.target)) {
                closePlatformDropdown();
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closePlatformDropdown();
            }
        });

        syncPlatformDropdown(platformSelect.value);
        
        // Auto-generate function
        const autoGenerate = () => {
            const platform = platformSelect.value;
            let username = usernameInput.value.trim();
            const platformConfig = platformConfigs[platform];
            
            if (!platformConfig || !username) {
                document.getElementById('qrcode').innerHTML = '';
                document.getElementById('qrPlaceholder').style.display = 'block';
                document.getElementById('downloadOptions').classList.add('d-none');
                return;
            }
            
            // Remove @ if user included it
            username = username.replace(/^@/, '');
            
            const url = this.buildPlatformUrl(platform, username, platformConfig);
            
            const errorCorrectionLevel = errorCorrection.value;
            const frameType = selectedFrame;
            
            // Generate QR code
            const qrContainer = document.getElementById('qrcode');
            qrContainer.innerHTML = '';
            
            const qrCode = new QRCode(qrContainer, {
                text: url,
                width: DISPLAY_SIZE,
                height: DISPLAY_SIZE,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel[errorCorrectionLevel]
            });
            
            QRCodePreviewRenderer.finalize(qrContainer, frameType, DISPLAY_SIZE, canvas => {
                currentQRCanvas = canvas;
            });
            
            document.getElementById('qrPlaceholder').style.display = 'none';
            document.getElementById('downloadOptions').classList.remove('d-none');
        };
        
        // Auto-generate on input
        usernameInput.addEventListener('input', autoGenerate);
        errorCorrection.addEventListener('change', autoGenerate);
        
        // Download handlers
        document.getElementById('downloadPng').addEventListener('click', () => {
            const exportSize = QRCodeExportControls.getExportSize();
            if (!exportSize) {
                return;
            }
            const frameType = selectedFrame;
            const platform = platformSelect.value;
            const platformConfig = platformConfigs[platform];
            let username = usernameInput.value.trim();
            username = username.replace(/^@/, '');

            if (!platformConfig) {
                return;
            }

            const url = this.buildPlatformUrl(platform, username, platformConfig);
            
            // Generate high-res QR code for export
            const tempContainer = document.createElement('div');
            const qrCode = new QRCode(tempContainer, {
                text: url,
                width: exportSize,
                height: exportSize,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel[errorCorrection.value]
            });
            
            setTimeout(() => {
                const canvas = tempContainer.querySelector('canvas');
                if (canvas) {
                    if (frameType !== 'none') {
                        QRFrames.exportWithFrame(canvas, frameType, exportSize, 'qrcode.png');
                    } else {
                        const link = document.createElement('a');
                        link.download = 'qrcode.png';
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    }
                }
            }, 100);
        });
        
        document.getElementById('downloadSvg').addEventListener('click', () => {
            const exportSize = QRCodeExportControls.getExportSize();
            if (!exportSize) {
                return;
            }
            const frameType = selectedFrame;
            const platform = platformSelect.value;
            const platformConfig = platformConfigs[platform];
            let username = usernameInput.value.trim();
            username = username.replace(/^@/, '');

            if (!platformConfig) {
                return;
            }

            const url = this.buildPlatformUrl(platform, username, platformConfig);
            
            // Generate SVG QR code for export
            const tempContainer = document.createElement('div');
            const qrCode = new QRCode(tempContainer, {
                text: url,
                width: exportSize,
                height: exportSize,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel[errorCorrection.value]
            });
            
            setTimeout(() => {
                const canvas = tempContainer.querySelector('canvas');
                if (canvas) {
                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                        <rect width="100" height="100" fill="#ffffff"/>
                        <image href="${canvas.toDataURL()}" width="100" height="100"/>
                    </svg>`;
                    
                    if (frameType !== 'none') {
                        QRFrames.exportSVGWithFrame(svg, frameType, exportSize, 'qrcode.svg');
                    } else {
                        const blob = new Blob([svg], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.download = 'qrcode.svg';
                        link.href = url;
                        link.click();
                        URL.revokeObjectURL(url);
                    }
                }
            }, 100);
        });
    }
};
