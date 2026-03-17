// QR Code generation utilities
let currentQRCode = null;

function generateQRCode(content, elementId, options = {}) {
    const {
        size = 256,
        foreground = '#000000',
        background = '#ffffff',
        errorCorrection = 'M'
    } = options;
    
    const element = document.getElementById(elementId);
    if (!element) return null;
    
    // Clear previous QR code
    element.innerHTML = '';
    
    try {
        currentQRCode = new QRCode(element, {
            text: content,
            width: size,
            height: size,
            colorDark: foreground,
            colorLight: background,
            correctLevel: QRCode.CorrectLevel[errorCorrection]
        });
        return currentQRCode;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
}

function downloadQRAsPNG(size = 3840) {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        alert('No QR code to download');
        return;
    }
    
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = size;
    exportCanvas.height = size;
    const ctx = exportCanvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    
    ctx.drawImage(canvas, 0, 0, size, size);
    
    const url = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${size}x${size}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadQRAsSVG(size = 3840) {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        alert('No QR code to download');
        return;
    }
    
    const canvasSize = canvas.width;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
    const data = imageData.data;
    
    const scale = size / canvasSize;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    
    const bgColor = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    svg += `<rect width="${size}" height="${size}" fill="${bgColor}"/>`;
    
    let path = '';
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const i = (y * canvasSize + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            if (r < 128 || g < 128 || b < 128) {
                const scaledX = Math.floor(x * scale);
                const scaledY = Math.floor(y * scale);
                const scaledSize = Math.ceil(scale);
                path += `M${scaledX},${scaledY}h${scaledSize}v${scaledSize}h-${scaledSize}z `;
            }
        }
    }
    
    if (path) {
        const fgColor = document.getElementById('foregroundColor')?.value || '#000000';
        svg += `<path fill="${fgColor}" d="${path}"/>`;
    }
    
    svg += '</svg>';
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${size}x${size}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
