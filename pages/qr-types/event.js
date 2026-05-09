"use strict";

// Event QR Code Module  
const EventMode = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">Event</h1>
                    <p class="content-subtitle">Create QR codes for calendar events</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">Event Title</label>
                            <input type="text" class="form-input" id="titleInput" placeholder="Meeting with Team">
                            <div class="form-hint">Enter the event name</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Location (Optional)</label>
                            <input type="text" class="form-input" id="locationInput" placeholder="Conference Room A">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Description (Optional)</label>
                            <textarea class="form-input" id="descriptionInput" rows="3" placeholder="Event description"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Start Date & Time</label>
                            <input type="datetime-local" class="form-input" id="startInput">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">End Date & Time</label>
                            <input type="datetime-local" class="form-input" id="endInput">
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
                                <p>Enter event details to generate QR code</p>
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
        const titleInput = document.getElementById('titleInput');
        const locationInput = document.getElementById('locationInput');
        const descriptionInput = document.getElementById('descriptionInput');
        const startInput = document.getElementById('startInput');
        const endInput = document.getElementById('endInput');
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
        
        // Helper function to format date to iCal format
        const formatICalDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        // Auto-generate function
        const autoGenerate = () => {
            const title = titleInput.value.trim();
            const start = startInput.value;
            
            if (!title || !start) {
                // Hide QR code and download options if required fields are empty
                document.getElementById('qrcode').innerHTML = '';
                document.getElementById('qrPlaceholder').style.display = 'block';
                document.getElementById('downloadOptions').classList.add('d-none');
                return;
            }
            
            const location = locationInput.value.trim();
            const description = descriptionInput.value.trim();
            const end = endInput.value || start;
            
            // Build vEvent/iCal format
            let vEvent = 'BEGIN:VCALENDAR\n';
            vEvent += 'VERSION:2.0\n';
            vEvent += 'BEGIN:VEVENT\n';
            vEvent += `SUMMARY:${title}\n`;
            vEvent += `DTSTART:${formatICalDate(start)}\n`;
            vEvent += `DTEND:${formatICalDate(end)}\n`;
            
            if (location) {
                vEvent += `LOCATION:${location}\n`;
            }
            
            if (description) {
                vEvent += `DESCRIPTION:${description}\n`;
            }
            
            vEvent += 'END:VEVENT\n';
            vEvent += 'END:VCALENDAR';
            
            const errorCorrectionLevel = errorCorrection.value;
            const frameType = selectedFrame;
            
            // Generate QR code
            const qrContainer = document.getElementById('qrcode');
            qrContainer.innerHTML = '';
            
            const qrCode = new QRCode(qrContainer, {
                text: vEvent,
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
        titleInput.addEventListener('input', autoGenerate);
        locationInput.addEventListener('input', autoGenerate);
        descriptionInput.addEventListener('input', autoGenerate);
        startInput.addEventListener('change', autoGenerate);
        endInput.addEventListener('change', autoGenerate);
        errorCorrection.addEventListener('change', autoGenerate);
        
        // Download handlers
        document.getElementById('downloadPng').addEventListener('click', () => {
            const exportSize = QRCodeExportControls.getExportSize();
            if (!exportSize) {
                return;
            }
            const frameType = selectedFrame;
            const title = titleInput.value.trim();
            const location = locationInput.value.trim();
            const description = descriptionInput.value.trim();
            const start = startInput.value;
            const end = endInput.value || start;
            
            // Build vEvent for export
            let vEvent = 'BEGIN:VCALENDAR\n';
            vEvent += 'VERSION:2.0\n';
            vEvent += 'BEGIN:VEVENT\n';
            vEvent += `SUMMARY:${title}\n`;
            vEvent += `DTSTART:${formatICalDate(start)}\n`;
            vEvent += `DTEND:${formatICalDate(end)}\n`;
            
            if (location) {
                vEvent += `LOCATION:${location}\n`;
            }
            
            if (description) {
                vEvent += `DESCRIPTION:${description}\n`;
            }
            
            vEvent += 'END:VEVENT\n';
            vEvent += 'END:VCALENDAR';
            
            // Generate high-res QR code for export
            const tempContainer = document.createElement('div');
            const qrCode = new QRCode(tempContainer, {
                text: vEvent,
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
            const title = titleInput.value.trim();
            const location = locationInput.value.trim();
            const description = descriptionInput.value.trim();
            const start = startInput.value;
            const end = endInput.value || start;
            
            // Build vEvent for export
            let vEvent = 'BEGIN:VCALENDAR\n';
            vEvent += 'VERSION:2.0\n';
            vEvent += 'BEGIN:VEVENT\n';
            vEvent += `SUMMARY:${title}\n`;
            vEvent += `DTSTART:${formatICalDate(start)}\n`;
            vEvent += `DTEND:${formatICalDate(end)}\n`;
            
            if (location) {
                vEvent += `LOCATION:${location}\n`;
            }
            
            if (description) {
                vEvent += `DESCRIPTION:${description}\n`;
            }
            
            vEvent += 'END:VEVENT\n';
            vEvent += 'END:VCALENDAR';
            
            exportQRCodeAsSVG({
                text: vEvent,
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
