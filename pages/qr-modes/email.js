// Email QR Code Module  
const EmailMode = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">Email</h1>
                    <p class="content-subtitle">Create QR codes for email addresses</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <input type="email" class="form-input" id="emailInput" placeholder="example@email.com">
                            <div class="form-hint">Enter the recipient email address</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Subject (Optional)</label>
                            <input type="text" class="form-input" id="subjectInput" placeholder="Email subject">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Message Body (Optional)</label>
                            <textarea class="form-input" id="bodyInput" rows="4" placeholder="Enter your message"></textarea>
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
                                <p>Enter an email address to generate QR code</p>
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
        const emailInput = document.getElementById('emailInput');
        const subjectInput = document.getElementById('subjectInput');
        const bodyInput = document.getElementById('bodyInput');
        const errorCorrection = document.getElementById('errorCorrection');
        
        // Auto-generate function
        const autoGenerate = () => {
            const email = emailInput.value.trim();
            if (!email) {
                // Hide QR code and download options if email is empty
                document.getElementById('qrcode').innerHTML = '';
                document.getElementById('qrPlaceholder').style.display = 'block';
                document.getElementById('downloadOptions').classList.add('d-none');
                return;
            }
            
            // Build mailto URL
            let mailtoUrl = `mailto:${email}`;
            const subject = subjectInput.value.trim();
            const body = bodyInput.value.trim();
            
            const params = [];
            if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
            if (body) params.push(`body=${encodeURIComponent(body)}`);
            
            if (params.length > 0) {
                mailtoUrl += '?' + params.join('&');
            }
            
            const errorCorrectionLevel = errorCorrection.value;
            
            generateQRCode(mailtoUrl, 'qrcode', { size: DISPLAY_SIZE, errorCorrection: errorCorrectionLevel });
            
            // Show download options
            document.getElementById('qrPlaceholder').style.display = 'none';
            document.getElementById('downloadOptions').classList.remove('d-none');
        };
        
        // Auto-generate on input
        emailInput.addEventListener('input', autoGenerate);
        subjectInput.addEventListener('input', autoGenerate);
        bodyInput.addEventListener('input', autoGenerate);
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
