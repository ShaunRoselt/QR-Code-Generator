// vCard QR Code Module
const VcardMode = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">Contact Card (vCard)</h1>
                    <p class="content-subtitle">Create QR codes for digital contact cards</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">First Name</label>
                            <input type="text" class="form-input" id="firstNameInput" placeholder="John">
                            <div class="form-hint">Required field</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Last Name</label>
                            <input type="text" class="form-input" id="lastNameInput" placeholder="Doe">
                            <div class="form-hint">Required field</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Organization / Company</label>
                            <input type="text" class="form-input" id="organizationInput" placeholder="Company Name">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Phone Number</label>
                            <input type="tel" class="form-input" id="phoneInput" placeholder="+1234567890">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" id="emailInput" placeholder="email@example.com">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Website</label>
                            <input type="url" class="form-input" id="websiteInput" placeholder="https://example.com">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Street Address</label>
                            <input type="text" class="form-input" id="streetInput" placeholder="123 Main St">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">City</label>
                            <input type="text" class="form-input" id="cityInput" placeholder="New York">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">State / Province</label>
                            <input type="text" class="form-input" id="stateInput" placeholder="NY">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">ZIP / Postal Code</label>
                            <input type="text" class="form-input" id="zipInput" placeholder="10001">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Country</label>
                            <input type="text" class="form-input" id="countryInput" placeholder="USA">
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
                                <p>Enter contact information</p>
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
        const errorCorrection = document.getElementById('errorCorrection');
        
        const firstNameInput = document.getElementById('firstNameInput');
        const lastNameInput = document.getElementById('lastNameInput');
        const organizationInput = document.getElementById('organizationInput');
        const phoneInput = document.getElementById('phoneInput');
        const emailInput = document.getElementById('emailInput');
        const websiteInput = document.getElementById('websiteInput');
        const streetInput = document.getElementById('streetInput');
        const cityInput = document.getElementById('cityInput');
        const stateInput = document.getElementById('stateInput');
        const zipInput = document.getElementById('zipInput');
        const countryInput = document.getElementById('countryInput');
        
        // Auto-generate function
        const autoGenerate = () => {
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            
            if (!firstName || !lastName) {
                document.getElementById('qrcode').innerHTML = '';
                document.getElementById('qrPlaceholder').style.display = 'block';
                document.getElementById('downloadOptions').classList.add('d-none');
                return;
            }
            
            const fullName = `${firstName} ${lastName}`;
            const organization = organizationInput.value.trim();
            const phone = phoneInput.value.trim();
            const email = emailInput.value.trim();
            const website = websiteInput.value.trim();
            const street = streetInput.value.trim();
            const city = cityInput.value.trim();
            const state = stateInput.value.trim();
            const zip = zipInput.value.trim();
            const country = countryInput.value.trim();
            
            let vcard = 'BEGIN:VCARD\n';
            vcard += 'VERSION:3.0\n';
            vcard += `FN:${fullName}\n`;
            vcard += `N:${lastName};${firstName};;;\n`;
            
            if (organization) {
                vcard += `ORG:${organization}\n`;
            }
            
            if (phone) {
                vcard += `TEL:${phone}\n`;
            }
            
            if (email) {
                vcard += `EMAIL:${email}\n`;
            }
            
            if (website) {
                vcard += `URL:${website}\n`;
            }
            
            if (street || city || state || zip || country) {
                vcard += `ADR:;;${street};${city};${state};${zip};${country}\n`;
            }
            
            vcard += 'END:VCARD';
            
            const size = parseInt(sizeSlider.value);
            const errorCorrectionLevel = errorCorrection.value;
            
            generateQRCode(vcard, 'qrcode', { size, errorCorrection: errorCorrectionLevel });
            
            document.getElementById('qrPlaceholder').style.display = 'none';
            document.getElementById('downloadOptions').classList.remove('d-none');
        };
        
        // Update size display
        sizeSlider.addEventListener('input', () => {
            sizeValue.textContent = sizeSlider.value + 'px';
            autoGenerate();
        });
        
        // Auto-generate on input changes
        const inputs = [
            firstNameInput, lastNameInput, organizationInput, phoneInput,
            emailInput, websiteInput, streetInput, cityInput,
            stateInput, zipInput, countryInput
        ];
        
        inputs.forEach(input => {
            input.addEventListener('input', autoGenerate);
        });
        
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
