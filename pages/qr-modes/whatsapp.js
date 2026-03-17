// Whatsapp QR Code Module  
const WhatsappMode = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">Whatsapp</h1>
                    <p class="content-subtitle">Create Whatsapp QR codes</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">Content</label>
                            <input type="text" class="form-input" id="contentInput" placeholder="Enter content">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Size (pixels)</label>
                            <input type="range" class="form-input" id="qrSize" min="128" max="1024" value="256" step="64">
                            <div class="form-hint" id="sizeValue">256px</div>
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
        
        sizeSlider.addEventListener('input', () => {
            sizeValue.textContent = sizeSlider.value + 'px';
        });
        
        document.getElementById('generateBtn').addEventListener('click', () => {
            const content = document.getElementById('contentInput').value.trim();
            if (!content) {
                alert('Please enter content');
                return;
            }
            
            const size = parseInt(sizeSlider.value);
            generateQRCode(content, 'qrcode', { size });
            
            document.getElementById('qrPlaceholder').style.display = 'none';
            document.getElementById('downloadOptions').classList.remove('d-none');
        });
        
        document.getElementById('downloadPng').addEventListener('click', () => {
            downloadQRAsPNG(parseInt(document.getElementById('exportSize').value));
        });
        
        document.getElementById('downloadSvg').addEventListener('click', () => {
            downloadQRAsSVG(parseInt(document.getElementById('exportSize').value));
        });
    }
};
