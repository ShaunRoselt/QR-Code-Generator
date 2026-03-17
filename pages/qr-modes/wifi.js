// WiFi QR Code Module  
const WifiMode = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">WiFi Network</h1>
                    <p class="content-subtitle">Create QR codes for WiFi network credentials</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">Network Name (SSID)</label>
                            <input type="text" class="form-input" id="ssidInput" placeholder="MyWiFiNetwork">
                            <div class="form-hint">The name of your WiFi network</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="text" class="form-input" id="passwordInput" placeholder="Enter WiFi password">
                            <div class="form-hint">Leave empty for open networks</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Security Type</label>
                            <select class="form-select" id="encryptionInput">
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">None (Open Network)</option>
                            </select>
                            <div class="form-hint">Most networks use WPA/WPA2</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-check-label">
                                <input type="checkbox" class="form-check" id="hiddenInput">
                                Hidden Network
                            </label>
                            <div class="form-hint">Check if network SSID is hidden</div>
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
                                <p>Enter network details to generate QR code</p>
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
        const ssidInput = document.getElementById('ssidInput');
        const passwordInput = document.getElementById('passwordInput');
        const encryptionInput = document.getElementById('encryptionInput');
        const hiddenInput = document.getElementById('hiddenInput');
        const errorCorrection = document.getElementById('errorCorrection');
        
        // Auto-generate function
        const autoGenerate = () => {
            const ssid = ssidInput.value.trim();
            if (!ssid) {
                // Hide QR code and download options if SSID is empty
                document.getElementById('qrcode').innerHTML = '';
                document.getElementById('qrPlaceholder').style.display = 'block';
                document.getElementById('downloadOptions').classList.add('d-none');
                return;
            }
            
            const password = passwordInput.value;
            const encryption = encryptionInput.value;
            const hidden = hiddenInput.checked;
            
            // Format: WIFI:T:WPA;S:mynetwork;P:mypass;H:false;;
            let wifiString = `WIFI:T:${encryption};S:${ssid};`;
            if (password && encryption !== 'nopass') {
                wifiString += `P:${password};`;
            }
            wifiString += `H:${hidden};;`;
            
            const errorCorrectionLevel = errorCorrection.value;
            
            generateQRCode(wifiString, 'qrcode', { size: DISPLAY_SIZE, errorCorrection: errorCorrectionLevel });
            
            // Show download options
            document.getElementById('qrPlaceholder').style.display = 'none';
            document.getElementById('downloadOptions').classList.remove('d-none');
        };
        
        // Auto-generate on input changes
        ssidInput.addEventListener('input', autoGenerate);
        passwordInput.addEventListener('input', autoGenerate);
        encryptionInput.addEventListener('change', autoGenerate);
        hiddenInput.addEventListener('change', autoGenerate);
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
