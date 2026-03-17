// Social Media QR Code Module
const SocialMode = {
    render() {
        return `
            <div class="qr-mode-page">
                <div class="content-header">
                    <h1 class="content-title">Social Media</h1>
                    <p class="content-subtitle">Create QR codes for social media profiles</p>
                </div>
                
                <div class="qr-content-wrapper">
                    <div class="qr-form-section">
                        <h2 class="section-title">
                            <i class="bi bi-pencil-square"></i>
                            Configuration
                        </h2>
                        
                        <div class="form-group">
                            <label class="form-label">Social Platform</label>
                            <select class="form-select" id="platformSelect">
                                <option value="">Select platform...</option>
                                <option value="facebook">Facebook</option>
                                <option value="instagram">Instagram</option>
                                <option value="twitter">Twitter / X</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="tiktok">TikTok</option>
                                <option value="youtube">YouTube</option>
                                <option value="snapchat">Snapchat</option>
                                <option value="pinterest">Pinterest</option>
                                <option value="reddit">Reddit</option>
                                <option value="discord">Discord</option>
                                <option value="telegram">Telegram</option>
                                <option value="threads">Threads</option>
                                <option value="github">GitHub</option>
                                <option value="twitch">Twitch</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Username / Handle</label>
                            <input type="text" class="form-input" id="usernameInput" placeholder="username">
                            <div class="form-hint" id="usernameHint">Enter your username without @ symbol</div>
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
                                <p>Select platform and enter username</p>
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
        const platformSelect = document.getElementById('platformSelect');
        const usernameInput = document.getElementById('usernameInput');
        const usernameHint = document.getElementById('usernameHint');
        const errorCorrection = document.getElementById('errorCorrection');
        
        // Platform-specific URL templates
        const platformUrls = {
            facebook: { url: 'https://facebook.com/', hint: 'Enter your Facebook username' },
            instagram: { url: 'https://instagram.com/', hint: 'Enter your Instagram username' },
            twitter: { url: 'https://twitter.com/', hint: 'Enter your Twitter/X username' },
            linkedin: { url: 'https://linkedin.com/in/', hint: 'Enter your LinkedIn username' },
            tiktok: { url: 'https://tiktok.com/@', hint: 'Enter your TikTok username' },
            youtube: { url: 'https://youtube.com/@', hint: 'Enter your YouTube channel name' },
            snapchat: { url: 'https://snapchat.com/add/', hint: 'Enter your Snapchat username' },
            pinterest: { url: 'https://pinterest.com/', hint: 'Enter your Pinterest username' },
            reddit: { url: 'https://reddit.com/u/', hint: 'Enter your Reddit username' },
            discord: { url: 'https://discord.com/users/', hint: 'Enter your Discord user ID' },
            telegram: { url: 'https://t.me/', hint: 'Enter your Telegram username' },
            threads: { url: 'https://threads.net/@', hint: 'Enter your Threads username' },
            github: { url: 'https://github.com/', hint: 'Enter your GitHub username' },
            twitch: { url: 'https://twitch.tv/', hint: 'Enter your Twitch username' }
        };
        
        // Update hint when platform changes
        platformSelect.addEventListener('change', () => {
            const platform = platformSelect.value;
            if (platform && platformUrls[platform]) {
                usernameHint.textContent = platformUrls[platform].hint;
            }
            autoGenerate();
        });
        
        // Auto-generate function
        const autoGenerate = () => {
            const platform = platformSelect.value;
            let username = usernameInput.value.trim();
            
            if (!platform || !username) {
                document.getElementById('qrcode').innerHTML = '';
                document.getElementById('qrPlaceholder').style.display = 'block';
                document.getElementById('downloadOptions').classList.add('d-none');
                return;
            }
            
            // Remove @ if user included it
            username = username.replace(/^@/, '');
            
            const url = platformUrls[platform].url + username;
            
            const size = parseInt(sizeSlider.value);
            const errorCorrectionLevel = errorCorrection.value;
            
            generateQRCode(url, 'qrcode', { size, errorCorrection: errorCorrectionLevel });
            
            document.getElementById('qrPlaceholder').style.display = 'none';
            document.getElementById('downloadOptions').classList.remove('d-none');
        };
        
        // Update size display
        sizeSlider.addEventListener('input', () => {
            sizeValue.textContent = sizeSlider.value + 'px';
            autoGenerate();
        });
        
        // Auto-generate on input
        usernameInput.addEventListener('input', autoGenerate);
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
