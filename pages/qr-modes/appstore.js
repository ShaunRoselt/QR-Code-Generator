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
                            <label class="form-label">Error Correction</label>
                            <select class="form-select" id="errorCorrection">
                                <option value="L">Low (7%)</option>
                                <option value="M" selected>Medium (15%)</option>
                                <option value="Q">Quartile (25%)</option>
                                <option value="H">High (30%)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="bi bi-border-all"></i>
                                Frame Style
                            </label>
                            <select class="form-select" id="frameSelect">
                                <option value="none">None</option>
                                <option value="square">Square Border</option>
                                <option value="rounded">Rounded Corners</option>
                                <option value="circle">Circle</option>
                                <option value="badge">Badge</option>
                                <option value="scanme">Scan Me Banner</option>
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
        const DISPLAY_SIZE = 300;
        const platformSelect = document.getElementById('platformSelect');
        const appIdInput = document.getElementById('appIdInput');
        const appIdLabel = document.getElementById('appIdLabel');
        const appIdHint = document.getElementById('appIdHint');
        const errorCorrection = document.getElementById('errorCorrection');
        const frameSelect = document.getElementById('frameSelect');
        
        let currentQRCanvas = null;
        
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
            
            const errorCorrectionLevel = errorCorrection.value;
            const frameType = frameSelect.value;
            
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
            
            // Wait for QR code to be generated, then apply frame
            setTimeout(() => {
                const canvas = qrContainer.querySelector('canvas');
                if (canvas && frameType !== 'none') {
                    const framedCanvas = window.QRFrames.applyFrame(canvas, frameType, DISPLAY_SIZE);
                    qrContainer.innerHTML = '';
                    qrContainer.appendChild(framedCanvas);
                    currentQRCanvas = framedCanvas;
                } else if (canvas) {
                    currentQRCanvas = canvas;
                }
            }, 100);
            
            document.getElementById('qrPlaceholder').style.display = 'none';
            document.getElementById('downloadOptions').classList.remove('d-none');
        };
        
        // Auto-generate on input
        appIdInput.addEventListener('input', autoGenerate);
        errorCorrection.addEventListener('change', autoGenerate);
        frameSelect.addEventListener('change', autoGenerate);
        
        // Download handlers
        document.getElementById('downloadPng').addEventListener('click', () => {
            const exportSize = parseInt(document.getElementById('exportSize').value);
            const frameType = frameSelect.value;
            const platform = platformSelect.value;
            const appId = appIdInput.value.trim();
            const config = platformConfigs[platform];
            const url = config.urlTemplate + appId;
            
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
                        window.QRFrames.exportWithFrame(canvas, frameType, exportSize, 'qrcode.png');
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
            const exportSize = parseInt(document.getElementById('exportSize').value);
            const frameType = frameSelect.value;
            const platform = platformSelect.value;
            const appId = appIdInput.value.trim();
            const config = platformConfigs[platform];
            const url = config.urlTemplate + appId;
            
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
                const img = tempContainer.querySelector('img');
                if (img) {
                    // Convert canvas to SVG
                    const canvas = tempContainer.querySelector('canvas');
                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                        <rect width="100" height="100" fill="#ffffff"/>
                        <image href="${canvas.toDataURL()}" width="100" height="100"/>
                    </svg>`;
                    
                    if (frameType !== 'none') {
                        window.QRFrames.exportSVGWithFrame(svg, frameType, exportSize, 'qrcode.svg');
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
