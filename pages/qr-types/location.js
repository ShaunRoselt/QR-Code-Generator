// Location QR Code Module  
const LocationMode = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">Location</h1>
                    <p class="content-subtitle">Create QR codes for geographic locations</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">Latitude</label>
                            <input type="number" class="form-input" id="latitudeInput" placeholder="37.7749" step="0.000001">
                            <div class="form-hint">Enter latitude (-90 to 90)</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Longitude</label>
                            <input type="number" class="form-input" id="longitudeInput" placeholder="-122.4194" step="0.000001">
                            <div class="form-hint">Enter longitude (-180 to 180)</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Location Name (Optional)</label>
                            <input type="text" class="form-input" id="labelInput" placeholder="San Francisco">
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
                                <p>Enter coordinates to generate QR code</p>
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
        const latitudeInput = document.getElementById('latitudeInput');
        const longitudeInput = document.getElementById('longitudeInput');
        const labelInput = document.getElementById('labelInput');
        const errorCorrection = document.getElementById('errorCorrection');
        
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
        
        // Auto-generate function
        const autoGenerate = () => {
            const latitude = latitudeInput.value.trim();
            const longitude = longitudeInput.value.trim();
            
            if (!latitude || !longitude) {
                // Hide QR code and download options if coordinates are empty
                document.getElementById('qrcode').innerHTML = '';
                document.getElementById('qrPlaceholder').style.display = 'block';
                document.getElementById('downloadOptions').classList.add('d-none');
                return;
            }
            
            // Build geo URL
            const label = labelInput.value.trim();
            let geoUrl = `geo:${latitude},${longitude}`;
            
            if (label) {
                geoUrl += `?q=${latitude},${longitude}(${encodeURIComponent(label)})`;
            }
            
            const errorCorrectionLevel = errorCorrection.value;
            const frameType = selectedFrame;
            
            // Generate QR code
            const qrContainer = document.getElementById('qrcode');
            qrContainer.innerHTML = '';
            
            const qrCode = new QRCode(qrContainer, {
                text: geoUrl,
                width: DISPLAY_SIZE,
                height: DISPLAY_SIZE,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel[errorCorrectionLevel]
            });
            
            QRCodePreviewRenderer.finalize(qrContainer, frameType, DISPLAY_SIZE, canvas => {
                currentQRCanvas = canvas;
            });
            
            // Show download options
            document.getElementById('qrPlaceholder').style.display = 'none';
            document.getElementById('downloadOptions').classList.remove('d-none');
        };
        
        // Auto-generate on input
        latitudeInput.addEventListener('input', autoGenerate);
        longitudeInput.addEventListener('input', autoGenerate);
        labelInput.addEventListener('input', autoGenerate);
        errorCorrection.addEventListener('change', autoGenerate);
        
        // Download handlers
        document.getElementById('downloadPng').addEventListener('click', () => {
            const exportSize = QRCodeExportControls.getExportSize();
            if (!exportSize) {
                return;
            }
            const frameType = selectedFrame;
            const latitude = latitudeInput.value.trim();
            const longitude = longitudeInput.value.trim();
            const label = labelInput.value.trim();
            
            // Build geo URL
            let geoUrl = `geo:${latitude},${longitude}`;
            if (label) {
                geoUrl += `?q=${latitude},${longitude}(${encodeURIComponent(label)})`;
            }
            
            // Generate high-res QR code for export
            const tempContainer = document.createElement('div');
            const qrCode = new QRCode(tempContainer, {
                text: geoUrl,
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
            const latitude = latitudeInput.value.trim();
            const longitude = longitudeInput.value.trim();
            const label = labelInput.value.trim();
            
            // Build geo URL
            let geoUrl = `geo:${latitude},${longitude}`;
            if (label) {
                geoUrl += `?q=${latitude},${longitude}(${encodeURIComponent(label)})`;
            }
            
            // Generate SVG QR code for export
            const tempContainer = document.createElement('div');
            const qrCode = new QRCode(tempContainer, {
                text: geoUrl,
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
