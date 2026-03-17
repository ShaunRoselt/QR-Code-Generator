// SMS QR Code Module  
const SmsMode = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">SMS</h1>
                    <p class="content-subtitle">Create QR codes for SMS messages</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">Phone Number</label>
                            <input type="tel" class="form-input" id="phoneInput" placeholder="+1234567890">
                            <div class="form-hint">Include country code (e.g., +1 for US)</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Message Text (Optional)</label>
                            <textarea class="form-input" id="messageInput" rows="4" placeholder="Enter your message"></textarea>
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
                                <p>Enter a phone number to generate QR code</p>
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
        const phoneInput = document.getElementById('phoneInput');
        const messageInput = document.getElementById('messageInput');
        const errorCorrection = document.getElementById('errorCorrection');
        
        // Auto-generate function
        const autoGenerate = () => {
            const phone = phoneInput.value.trim();
            if (!phone) {
                // Hide QR code and download options if phone is empty
                document.getElementById('qrcode').innerHTML = '';
                document.getElementById('qrPlaceholder').style.display = 'block';
                document.getElementById('downloadOptions').classList.add('d-none');
                return;
            }
            
            // Build SMS URL
            const message = messageInput.value.trim();
            let smsUrl = `sms:${phone}`;
            
            if (message) {
                smsUrl += `?body=${encodeURIComponent(message)}`;
            }
            
            const size = parseInt(sizeSlider.value);
            const errorCorrectionLevel = errorCorrection.value;
            
            generateQRCode(smsUrl, 'qrcode', { size, errorCorrection: errorCorrectionLevel });
            
            // Show download options
            document.getElementById('qrPlaceholder').style.display = 'none';
            document.getElementById('downloadOptions').classList.remove('d-none');
        };
        
        // Update size display
        sizeSlider.addEventListener('input', () => {
            sizeValue.textContent = sizeSlider.value + 'px';
            autoGenerate();
        });
        
        // Auto-generate on input
        phoneInput.addEventListener('input', autoGenerate);
        messageInput.addEventListener('input', autoGenerate);
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
