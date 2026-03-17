// App Store QR Code Module
const AppstoreMode = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">App Store Links</h1>
                    <p class="content-subtitle">Create QR codes for app store links</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">Store Platform</label>
                            <select class="form-select" id="platformSelect">
                                <option value="">Select platform...</option>
                                <option value="googleplay">Google Play Store</option>
                                <option value="appstore">Apple App Store</option>
                                <option value="microsoft">Microsoft Store</option>
                                <option value="steam">Steam</option>
                                <option value="amazon">Amazon Appstore</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" id="appIdLabel">App ID / Package Name</label>
                            <input type="text" class="form-input" id="appIdInput" placeholder="e.g., com.example.app">
                            <div class="form-hint" id="appIdHint">Enter the app identifier for the selected platform</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Size (pixels)</label>
                            <input type="range" class="form-input" id="qrSize" min="128" max="1024" value="256" step="64">
                            <div class="form-hint" id="sizeValue">256px</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Error Correction</label>
                            <select class="form-select" id="errorCorrection">
                                <option value="L">Low (7%)</option>
                                <option value="M" selected>Medium (15%)</option>
                                <option value="Q">Quartile (25%)</option>
                                <option value="H">High (30%)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="qr-preview-section">
                        <h2 class="section-title">
                            <i class="bi bi-eye"></i>
                            Preview
                        </h2>
                        
                        <div class="qr-display">
                            <div class="qr-placeholder" id="qrPlaceholder">
                                <i class="bi bi-qr-code"></i>
                                <p>Select platform and enter app ID</p>
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
        const sizeSlider = document.getElementById('qrSize');
        const sizeValue = document.getElementById('sizeValue');
        const platformSelect = document.getElementById('platformSelect');
        const appIdInput = document.getElementById('appIdInput');
        const appIdLabel = document.getElementById('appIdLabel');
        const appIdHint = document.getElementById('appIdHint');
        const errorCorrection = document.getElementById('errorCorrection');
        
        // Platform-specific configurations
        const platformConfigs = {
            googleplay: {
                label: 'Package Name',
                placeholder: 'com.example.app',
                hint: 'Enter the Android package name (e.g., com.whatsapp)',
                urlTemplate: 'https://play.google.com/store/apps/details?id='
            },
            appstore: {
                label: 'App ID',
                placeholder: '123456789',
                hint: 'Enter the numeric App ID (e.g., 310633997)',
                urlTemplate: 'https://apps.apple.com/app/id'
            },
            microsoft: {
                label: 'App ID',
                placeholder: '9WZDNCRFJ3TJ',
                hint: 'Enter the Microsoft Store app ID',
                urlTemplate: 'https://www.microsoft.com/store/apps/'
            },
            steam: {
                label: 'App ID',
                placeholder: '730',
                hint: 'Enter the numeric Steam app ID',
                urlTemplate: 'https://store.steampowered.com/app/'
            },
            amazon: {
                label: 'ASIN',
                placeholder: 'B01234ABCD',
                hint: 'Enter the Amazon ASIN',
                urlTemplate: 'https://www.amazon.com/dp/'
            }
        };
        
        // Update labels when platform changes
        platformSelect.addEventListener('change', () => {
            const platform = platformSelect.value;
            if (platform && platformConfigs[platform]) {
                const config = platformConfigs[platform];
                appIdLabel.textContent = config.label;
                appIdInput.placeholder = config.placeholder;
                appIdHint.textContent = config.hint;
            }
            autoGenerate();
        });
        
        // Auto-generate function
        const autoGenerate = () => {
            const platform = platformSelect.value;
            const appId = appIdInput.value.trim();
            
            if (!platform || !appId) {
                document.getElementById('qrcode').innerHTML = '';
                document.getElementById('qrPlaceholder').style.display = 'block';
                document.getElementById('downloadOptions').classList.add('d-none');
                return;
            }
            
            const config = platformConfigs[platform];
            const url = config.urlTemplate + appId;
            
            const size = parseInt(sizeSlider.value);
            const errorCorrectionLevel = errorCorrection.value;
            
            generateQRCode(url, 'qrcode', { size, errorCorrection: errorCorrectionLevel });
            
            document.getElementById('qrPlaceholder').style.display = 'none';
            document.getElementById('downloadOptions').classList.remove('d-none');
        };
        
        // Update size display
        sizeSlider.addEventListener('input', () => {
            sizeValue.textContent = sizeSlider.value + 'px';
            autoGenerate();
        });
        
        // Auto-generate on input
        appIdInput.addEventListener('input', autoGenerate);
        errorCorrection.addEventListener('change', autoGenerate);
        
        // Download handlers
        document.getElementById('downloadPng').addEventListener('click', () => {
            const exportSize = parseInt(document.getElementById('exportSize').value);
            downloadQRAsPNG(exportSize);
        });
        
        document.getElementById('downloadSvg').addEventListener('click', () => {
            const exportSize = parseInt(document.getElementById('exportSize').value);
            downloadQRAsSVG(exportSize);
        });
    }
};
