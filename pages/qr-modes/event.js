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
        const sizeSlider = document.getElementById('qrSize');
        const sizeValue = document.getElementById('sizeValue');
        const titleInput = document.getElementById('titleInput');
        const locationInput = document.getElementById('locationInput');
        const descriptionInput = document.getElementById('descriptionInput');
        const startInput = document.getElementById('startInput');
        const endInput = document.getElementById('endInput');
        const errorCorrection = document.getElementById('errorCorrection');
        
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
            
            const size = parseInt(sizeSlider.value);
            const errorCorrectionLevel = errorCorrection.value;
            
            generateQRCode(vEvent, 'qrcode', { size, errorCorrection: errorCorrectionLevel });
            
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
        titleInput.addEventListener('input', autoGenerate);
        locationInput.addEventListener('input', autoGenerate);
        descriptionInput.addEventListener('input', autoGenerate);
        startInput.addEventListener('change', autoGenerate);
        endInput.addEventListener('change', autoGenerate);
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
