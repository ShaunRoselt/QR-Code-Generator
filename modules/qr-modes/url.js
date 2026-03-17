// URL QR Code Module
const URLMode = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">URL / Website</h1>
                    <p class="content-subtitle">Create QR codes for website links</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">Website URL</label>
                            <input type="url" class="form-input" id="urlInput" placeholder="https://example.com">
                            <div class="form-hint">Enter the complete URL including https://</div>
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
                        
                        <button class="btn btn-primary btn-block" id="generateBtn">
                            <i class="bi bi-qr-code"></i>
                            Generate QR Code
                        </button>
                    </div>
                    
                    <div class="qr-preview-section">
                        <h2 class="section-title">
                            <i class="bi bi-eye"></i>
                            Preview
                        </h2>
                        
                        <div class="qr-display">
                            <div class="qr-placeholder" id="qrPlaceholder">
                                <i class="bi bi-qr-code"></i>
                                <p>Your QR code will appear here</p>
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
        const generateBtn = document.getElementById('generateBtn');
        const urlInput = document.getElementById('urlInput');
        
        // Update size display
        sizeSlider.addEventListener('input', () => {
            sizeValue.textContent = sizeSlider.value + 'px';
        });
        
        // Generate QR code
        generateBtn.addEventListener('click', () => {
            let url = urlInput.value.trim();
            if (!url) {
                alert('Please enter a URL');
                return;
            }
            
            // Add https:// if no protocol
            if (!url.match(/^https?:\/\//i)) {
                url = 'https://' + url;
            }
            
            const size = parseInt(sizeSlider.value);
            const errorCorrection = document.getElementById('errorCorrection').value;
            
            generateQRCode(url, 'qrcode', { size, errorCorrection });
            
            // Show download options
            document.getElementById('qrPlaceholder').style.display = 'none';
            document.getElementById('downloadOptions').classList.remove('d-none');
        });
        
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
