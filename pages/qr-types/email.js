"use strict";

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
                                ${QRCodeErrorCorrectionOptions.renderOptions('Q')}
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
        
        let currentQRCanvas = null;
        let selectedFrame = 'none';
        
        // Frame card selector handler (delegated to support dynamically added cards)
        const frameSelector = document.getElementById('frameSelector');
        if (frameSelector) {
            frameSelector.addEventListener('click', (event) => {
                const card = event.target.closest('.frame-card');
                if (!card || !frameSelector.contains(card) || !card.dataset.frame) {
                    return;
                }
                frameSelector.querySelectorAll('.frame-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                selectedFrame = card.dataset.frame;
                autoGenerate();
            });
        }
        
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
            const frameType = selectedFrame;
            
            // Generate QR code
            const qrContainer = document.getElementById('qrcode');
            qrContainer.innerHTML = '';
            
            const qrCode = new QRCode(qrContainer, {
                text: mailtoUrl,
                width: DISPLAY_SIZE,
                height: DISPLAY_SIZE,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel[errorCorrectionLevel]
            });
            
            QRCodePreviewRenderer.finalize(qrContainer, frameType, DISPLAY_SIZE, qrCode, previewNode => {
                currentQRCanvas = previewNode;
            });
            
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
            const exportSize = QRCodeExportControls.getExportSize();
            if (!exportSize) {
                return;
            }
            const frameType = selectedFrame;
            const email = emailInput.value.trim();
            
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
            
            // Generate high-res QR code for export
            const tempContainer = document.createElement('div');
            const qrCode = new QRCode(tempContainer, {
                text: mailtoUrl,
                width: exportSize,
                height: exportSize,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel[errorCorrection.value]
            });
            
            setTimeout(() => {
                const canvas = tempContainer.querySelector('canvas');
                if (canvas) {
                    if (window.QRFrames) {
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
            const email = emailInput.value.trim();
            
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
            
            exportQRCodeAsSVG({
                text: mailtoUrl,
                size: exportSize,
                filename: 'qrcode.svg',
                frameType,
                qrOptions: {
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel[errorCorrection.value]
                }
            });
        });
    }
};
