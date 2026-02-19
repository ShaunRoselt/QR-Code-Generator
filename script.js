// QR Code Generator JavaScript

// Global variables
let currentQRCode = null;
let currentType = 'url';

// Add animation on scroll - IntersectionObserver setup
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateSizeDisplay();
    
    // Observe feature cards for animation
    const cards = document.querySelectorAll('#features .card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
});

// Initialize all event listeners
function initializeEventListeners() {
    // QR Type selection
    const typeRadios = document.querySelectorAll('input[name="qrType"]');
    typeRadios.forEach(radio => {
        radio.addEventListener('change', handleTypeChange);
    });

    // Generate button
    document.getElementById('generateBtn').addEventListener('click', generateQRCode);

    // Download buttons
    document.getElementById('downloadPng').addEventListener('click', downloadPNG);
    document.getElementById('downloadSvg').addEventListener('click', downloadSVG);

    // Size slider
    document.getElementById('qrSize').addEventListener('input', updateSizeDisplay);

    // App store platform change handler
    const appstorePlatform = document.getElementById('appstorePlatform');
    if (appstorePlatform) {
        appstorePlatform.addEventListener('change', handleAppStorePlatformChange);
    }

    // Enter key support for text inputs
    const textInputs = document.querySelectorAll('input[type="text"], input[type="url"], input[type="email"], input[type="tel"], textarea');
    textInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                generateQRCode();
            }
        });
    });
}

// Handle app store platform change
function handleAppStorePlatformChange(e) {
    const platform = e.target.value;
    const googlePlayFields = document.getElementById('googlePlayFields');
    const customUrlField = document.getElementById('customUrlField');
    const appPackageName = document.getElementById('appPackageName');
    
    if (platform === 'custom') {
        googlePlayFields.classList.add('d-none');
        customUrlField.classList.remove('d-none');
    } else {
        googlePlayFields.classList.remove('d-none');
        customUrlField.classList.add('d-none');
        
        // Update placeholder based on platform
        switch(platform) {
            case 'googleplay':
                appPackageName.placeholder = 'com.example.app';
                appPackageName.previousElementSibling.textContent = 'Package Name / App ID';
                break;
            case 'appstore':
                appPackageName.placeholder = '123456789';
                appPackageName.previousElementSibling.textContent = 'App ID (numeric)';
                break;
            case 'microsoft':
                appPackageName.placeholder = '9wzdncrfj3tj';
                appPackageName.previousElementSibling.textContent = 'App ID';
                break;
            case 'steam':
                appPackageName.placeholder = '730';
                appPackageName.previousElementSibling.textContent = 'Steam App ID (numeric)';
                break;
            case 'amazonappstore':
                appPackageName.placeholder = 'com.example.app';
                appPackageName.previousElementSibling.textContent = 'Package Name';
                break;
        }
    }
}

// Handle QR type change
function handleTypeChange(e) {
    currentType = e.target.value;
    
    // Hide all forms
    document.querySelectorAll('.input-form').forEach(form => {
        form.classList.add('d-none');
    });
    
    // Show selected form
    const formId = currentType + 'Form';
    const selectedForm = document.getElementById(formId);
    if (selectedForm) {
        selectedForm.classList.remove('d-none');
    }
}

// Update size display
function updateSizeDisplay() {
    const sizeValue = document.getElementById('qrSize').value;
    document.getElementById('qrSizeValue').textContent = sizeValue;
}

// Generate QR Code
function generateQRCode() {
    const qrContent = getQRContent();
    
    if (!qrContent) {
        showError('Please fill in all required fields');
        return;
    }

    // Get customization options
    const size = parseInt(document.getElementById('qrSize').value);
    const errorCorrection = document.getElementById('errorCorrection').value;
    const foregroundColor = document.getElementById('foregroundColor').value;
    const backgroundColor = document.getElementById('backgroundColor').value;

    // Clear previous QR code
    const qrcodeElement = document.getElementById('qrcode');
    qrcodeElement.innerHTML = '';

    // Hide placeholder and show download section
    document.getElementById('qrPlaceholder').style.display = 'none';
    document.getElementById('downloadSection').classList.remove('d-none');

    try {
        // Generate new QR code
        currentQRCode = new QRCode(qrcodeElement, {
            text: qrContent,
            width: size,
            height: size,
            colorDark: foregroundColor,
            colorLight: backgroundColor,
            correctLevel: QRCode.CorrectLevel[errorCorrection]
        });

        // Show success message
        showSuccess('QR Code generated successfully!');
    } catch (error) {
        showError('Error generating QR code: ' + error.message);
    }
}

// Get QR content based on selected type
function getQRContent() {
    switch(currentType) {
        case 'url':
            return getUrlContent();
        case 'text':
            return getTextContent();
        case 'email':
            return getEmailContent();
        case 'phone':
            return getPhoneContent();
        case 'sms':
            return getSmsContent();
        case 'whatsapp':
            return getWhatsappContent();
        case 'wifi':
            return getWifiContent();
        case 'location':
            return getLocationContent();
        case 'event':
            return getEventContent();
        case 'appstore':
            return getAppStoreContent();
        case 'socialmedia':
            return getSocialMediaContent();
        case 'vcard':
            return getVcardContent();
        default:
            return null;
    }
}

// Get URL content
function getUrlContent() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return null;
    
    // Add https:// if no protocol specified
    if (!url.match(/^https?:\/\//i)) {
        return 'https://' + url;
    }
    return url;
}

// Get text content
function getTextContent() {
    const text = document.getElementById('textInput').value.trim();
    return text || null;
}

// Get email content
function getEmailContent() {
    const email = document.getElementById('emailInput').value.trim();
    if (!email) return null;
    
    const subject = document.getElementById('emailSubject').value.trim();
    const body = document.getElementById('emailBody').value.trim();
    
    let mailtoUrl = 'mailto:' + email;
    const params = [];
    
    if (subject) params.push('subject=' + encodeURIComponent(subject));
    if (body) params.push('body=' + encodeURIComponent(body));
    
    if (params.length > 0) {
        mailtoUrl += '?' + params.join('&');
    }
    
    return mailtoUrl;
}

// Get phone content
function getPhoneContent() {
    const phone = document.getElementById('phoneInput').value.trim();
    if (!phone) return null;
    return 'tel:' + phone;
}

// Get SMS content
function getSmsContent() {
    const phone = document.getElementById('smsPhone').value.trim();
    if (!phone) return null;
    
    const message = document.getElementById('smsMessage').value.trim();
    
    // SMS URL format with body parameter
    let smsUrl = 'sms:' + phone;
    if (message) {
        // Using ? which works on both iOS and most Android devices
        smsUrl += '?body=' + encodeURIComponent(message);
    }
    
    return smsUrl;
}

// Get WhatsApp content
function getWhatsappContent() {
    const phone = document.getElementById('whatsappPhone').value.trim();
    if (!phone) return null;
    
    const message = document.getElementById('whatsappMessage').value.trim();
    
    // WhatsApp URL format
    let whatsappUrl = 'https://wa.me/' + phone;
    if (message) {
        whatsappUrl += '?text=' + encodeURIComponent(message);
    }
    
    return whatsappUrl;
}

// Get WiFi content
function getWifiContent() {
    const ssid = document.getElementById('wifiSsid').value.trim();
    if (!ssid) return null;
    
    const password = document.getElementById('wifiPassword').value.trim();
    const encryption = document.getElementById('wifiEncryption').value;
    const hidden = document.getElementById('wifiHidden').checked ? 'true' : 'false';
    
    // WiFi QR code format: WIFI:T:WPA;S:mynetwork;P:mypass;H:false;;
    return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden};;`;
}

// Get Location content
function getLocationContent() {
    const lat = document.getElementById('locationLat').value.trim();
    const lng = document.getElementById('locationLng').value.trim();
    
    if (!lat || !lng) return null;
    
    const name = document.getElementById('locationName').value.trim();
    
    // Google Maps format: geo:latitude,longitude?q=latitude,longitude(label)
    if (name) {
        return `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(name)})`;
    }
    return `geo:${lat},${lng}`;
}

// Get Calendar Event content
function getEventContent() {
    const title = document.getElementById('eventTitle').value.trim();
    if (!title) return null;
    
    const location = document.getElementById('eventLocation').value.trim();
    const start = document.getElementById('eventStart').value;
    const end = document.getElementById('eventEnd').value;
    const description = document.getElementById('eventDescription').value.trim();
    
    // Convert datetime-local to iCal format (YYYYMMDDTHHMMSS)
    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    // vCalendar format
    let vcal = 'BEGIN:VEVENT\n';
    vcal += `SUMMARY:${title}\n`;
    
    if (location) vcal += `LOCATION:${location}\n`;
    if (start) vcal += `DTSTART:${formatDateTime(start)}\n`;
    if (end) vcal += `DTEND:${formatDateTime(end)}\n`;
    if (description) vcal += `DESCRIPTION:${description}\n`;
    
    vcal += 'END:VEVENT';
    
    return vcal;
}

// Get App Store content
function getAppStoreContent() {
    const platform = document.getElementById('appstorePlatform').value;
    
    if (platform === 'custom') {
        const customUrl = document.getElementById('appCustomUrl').value.trim();
        return customUrl || null;
    }
    
    const appId = document.getElementById('appPackageName').value.trim();
    if (!appId) return null;
    
    // Build URL based on platform
    switch(platform) {
        case 'googleplay':
            return `https://play.google.com/store/apps/details?id=${appId}`;
        case 'appstore':
            return `https://apps.apple.com/app/id${appId}`;
        case 'microsoft':
            return `https://www.microsoft.com/store/apps/${appId}`;
        case 'steam':
            return `https://store.steampowered.com/app/${appId}`;
        case 'amazonappstore':
            return `https://www.amazon.com/dp/${appId}`;
        default:
            return null;
    }
}

// Get Social Media content
function getSocialMediaContent() {
    const platform = document.getElementById('socialPlatform').value;
    const username = document.getElementById('socialUsername').value.trim();
    
    if (!username) return null;
    
    // Build URL based on platform
    switch(platform) {
        case 'facebook':
            return `https://facebook.com/${username}`;
        case 'instagram':
            return `https://instagram.com/${username}`;
        case 'twitter':
            return `https://twitter.com/${username}`;
        case 'x':
            return `https://x.com/${username}`;
        case 'linkedin':
            return `https://linkedin.com/in/${username}`;
        case 'tiktok':
            return `https://tiktok.com/@${username}`;
        case 'youtube':
            return `https://youtube.com/@${username}`;
        case 'snapchat':
            return `https://snapchat.com/add/${username}`;
        case 'pinterest':
            return `https://pinterest.com/${username}`;
        case 'reddit':
            return `https://reddit.com/user/${username}`;
        case 'discord':
            return username; // Discord uses invite links
        case 'telegram':
            return `https://t.me/${username}`;
        case 'threads':
            return `https://threads.net/@${username}`;
        case 'github':
            return `https://github.com/${username}`;
        case 'twitch':
            return `https://twitch.tv/${username}`;
        default:
            return null;
    }
}

// Get vCard content
function getVcardContent() {
    const firstName = document.getElementById('vcardFirstName').value.trim();
    const lastName = document.getElementById('vcardLastName').value.trim();
    
    if (!firstName && !lastName) return null;
    
    const org = document.getElementById('vcardOrg').value.trim();
    const phone = document.getElementById('vcardPhone').value.trim();
    const email = document.getElementById('vcardEmail').value.trim();
    const url = document.getElementById('vcardUrl').value.trim();
    
    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';
    vcard += `N:${lastName};${firstName};;;\n`;
    
    // Create full name, trimming spaces
    const fullName = `${firstName} ${lastName}`.trim();
    vcard += `FN:${fullName}\n`;
    
    if (org) vcard += `ORG:${org}\n`;
    if (phone) vcard += `TEL:${phone}\n`;
    if (email) vcard += `EMAIL:${email}\n`;
    if (url) vcard += `URL:${url}\n`;
    
    vcard += 'END:VCARD';
    
    return vcard;
}

// Download as PNG
function downloadPNG() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        showError('No QR code to download');
        return;
    }
    
    const exportSize = parseInt(document.getElementById('exportSize').value);
    
    // Create a new canvas at the export size
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;
    const ctx = exportCanvas.getContext('2d');
    
    // Disable image smoothing for crisp pixels
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    
    // Draw the original canvas scaled to the export size
    ctx.drawImage(canvas, 0, 0, exportSize, exportSize);
    
    // Convert to data URL and download
    const url = exportCanvas.toDataURL('image/png');
    downloadFile(url, `qrcode-${exportSize}x${exportSize}.png`);
    
    showSuccess(`QR code downloaded as ${exportSize}x${exportSize} PNG`);
}

// Download as SVG
function downloadSVG() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        showError('No QR code to download');
        return;
    }
    
    const exportSize = parseInt(document.getElementById('exportSize').value);
    
    // Convert canvas to SVG at export size
    const svg = convertCanvasToSVG(canvas, exportSize);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    downloadFile(url, `qrcode-${exportSize}x${exportSize}.svg`);
    URL.revokeObjectURL(url);
    
    showSuccess(`QR code downloaded as ${exportSize}x${exportSize} SVG`);
}

// Convert canvas to SVG
function convertCanvasToSVG(canvas, exportSize) {
    const canvasSize = canvas.width;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
    const data = imageData.data;
    
    // Calculate scaling factor for export size
    const scale = exportSize / canvasSize;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${exportSize}" height="${exportSize}" viewBox="0 0 ${exportSize} ${exportSize}">`;
    
    // Get background color (from first pixel)
    const bgColor = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    svg += `<rect width="${exportSize}" height="${exportSize}" fill="${bgColor}"/>`;
    
    // Create paths for dark pixels - scaled to export size
    let path = '';
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const i = (y * canvasSize + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // If pixel is dark (not background)
            if (r < 128 || g < 128 || b < 128) {
                const scaledX = Math.floor(x * scale);
                const scaledY = Math.floor(y * scale);
                const scaledSize = Math.ceil(scale);
                path += `M${scaledX},${scaledY}h${scaledSize}v${scaledSize}h-${scaledSize}z `;
            }
        }
    }
    
    if (path) {
        const fgColor = document.getElementById('foregroundColor').value;
        svg += `<path fill="${fgColor}" d="${path}"/>`;
    }
    
    svg += '</svg>';
    return svg;
}

// Download file helper
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Show success message
function showSuccess(message) {
    showToast(message, 'success');
}

// Show error message
function showError(message) {
    showToast(message, 'danger');
}

// Show toast notification
function showToast(message, type) {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} toast-notification position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg`;
    toast.style.zIndex = '9999';
    toast.style.minWidth = '300px';
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
