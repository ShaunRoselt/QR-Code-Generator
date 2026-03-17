// Text QR Code Module
const TextMode = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">Plain Text</h1>
                    <p class="content-subtitle">Create QR codes with text content</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">Text Content</label>
                            <textarea class="form-textarea" id="textInput" placeholder="Enter your text here..."></textarea>
                            <div class="form-hint">Enter any text content for the QR code</div>
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
                                <p>Enter text to generate QR code</p>
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
        const textInput = document.getElementById('textInput');
        const errorCorrection = document.getElementById('errorCorrection');
        const frameSelect = document.getElementById('frameSelect');
        
        let currentQRCanvas = null;
        
        // Auto-generate function
        const autoGenerate = () => {
            const text = textInput.value.trim();
            if (!text) {
                document.getElementById('qrcode').innerHTML = '';
                document.getElementById('qrPlaceholder').style.display = 'block';
                document.getElementById('downloadOptions').classList.add('d-none');
                return;
            }
            
            const errorCorrectionLevel = errorCorrection.value;
            const frameType = frameSelect.value;
            
            // Generate QR code
            const qrContainer = document.getElementById('qrcode');
            qrContainer.innerHTML = '';
            
            const qrCode = new QRCode(qrContainer, {
                text: text,
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
        textInput.addEventListener('input', autoGenerate);
        errorCorrection.addEventListener('change', autoGenerate);
        frameSelect.addEventListener('change', autoGenerate);
        
        // Download handlers
        document.getElementById('downloadPng').addEventListener('click', () => {
            const exportSize = parseInt(document.getElementById('exportSize').value);
            const frameType = frameSelect.value;
            const text = textInput.value.trim();
            
            // Generate high-res QR code for export
            const tempContainer = document.createElement('div');
            const qrCode = new QRCode(tempContainer, {
                text: text,
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
            const text = textInput.value.trim();
            
            // Generate SVG QR code for export
            const tempContainer = document.createElement('div');
            const qrCode = new QRCode(tempContainer, {
                text: text,
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
