/**
 * QR Code Frame Utilities
 * Provides various frame styles for QR codes
 */

const QRFrames = {
    // Available frame types
    FRAME_TYPES: {
        NONE: 'none',
        SQUARE: 'square',
        ROUNDED: 'rounded',
        CIRCLE: 'circle',
        BADGE: 'badge',
        SCAN_ME: 'scanme'
    },

    /**
     * Get frame dropdown HTML
     */
    getFrameSelector() {
        return `
            <div class="form-group">
                <label for="frameSelect">
                    <i class="bi bi-border-all"></i>
                    Frame Style
                </label>
                <select id="frameSelect" class="form-control">
                    <option value="none">None</option>
                    <option value="square">Square Border</option>
                    <option value="rounded">Rounded Corners</option>
                    <option value="circle">Circle</option>
                    <option value="badge">Badge</option>
                    <option value="scanme">Scan Me Banner</option>
                </select>
            </div>
        `;
    },

    /**
     * Apply frame to QR code canvas
     * @param {HTMLCanvasElement} canvas - The QR code canvas
     * @param {string} frameType - Type of frame to apply
     * @param {number} targetSize - Target size for the final canvas
     * @returns {HTMLCanvasElement} - New canvas with frame applied
     */
    applyFrame(canvas, frameType, targetSize = 300) {
        if (frameType === 'none' || !frameType) {
            return canvas;
        }

        const padding = 30; // Padding around QR code
        const newSize = targetSize;
        const qrSize = newSize - (padding * 2);

        // Create new canvas with frame
        const framedCanvas = document.createElement('canvas');
        framedCanvas.width = newSize;
        framedCanvas.height = newSize;
        const ctx = framedCanvas.getContext('2d');

        // Fill background (white)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, newSize, newSize);

        // Draw QR code in center
        ctx.drawImage(canvas, padding, padding, qrSize, qrSize);

        // Apply frame based on type
        switch (frameType) {
            case 'square':
                this.drawSquareFrame(ctx, newSize, padding);
                break;
            case 'rounded':
                this.drawRoundedFrame(ctx, newSize, padding);
                break;
            case 'circle':
                this.drawCircleFrame(ctx, newSize, padding);
                break;
            case 'badge':
                this.drawBadgeFrame(ctx, newSize, padding);
                break;
            case 'scanme':
                this.drawScanMeFrame(ctx, newSize, padding);
                break;
        }

        return framedCanvas;
    },

    /**
     * Draw square border frame
     */
    drawSquareFrame(ctx, size, padding) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeRect(padding - 10, padding - 10, size - (padding * 2) + 20, size - (padding * 2) + 20);
    },

    /**
     * Draw rounded corners frame
     */
    drawRoundedFrame(ctx, size, padding) {
        const radius = 20;
        const x = padding - 10;
        const y = padding - 10;
        const width = size - (padding * 2) + 20;
        const height = size - (padding * 2) + 20;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.stroke();
    },

    /**
     * Draw circle frame
     */
    drawCircleFrame(ctx, size, padding) {
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = (size - (padding * 2) + 20) / 2;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    },

    /**
     * Draw badge-style frame with corner accents
     */
    drawBadgeFrame(ctx, size, padding) {
        const cornerSize = 30;
        const offset = padding - 10;
        const width = size - (padding * 2) + 20;
        const height = size - (padding * 2) + 20;

        ctx.strokeStyle = '#007ACC';
        ctx.lineWidth = 6;

        // Top-left corner
        ctx.beginPath();
        ctx.moveTo(offset, offset + cornerSize);
        ctx.lineTo(offset, offset);
        ctx.lineTo(offset + cornerSize, offset);
        ctx.stroke();

        // Top-right corner
        ctx.beginPath();
        ctx.moveTo(offset + width - cornerSize, offset);
        ctx.lineTo(offset + width, offset);
        ctx.lineTo(offset + width, offset + cornerSize);
        ctx.stroke();

        // Bottom-left corner
        ctx.beginPath();
        ctx.moveTo(offset, offset + height - cornerSize);
        ctx.lineTo(offset, offset + height);
        ctx.lineTo(offset + cornerSize, offset + height);
        ctx.stroke();

        // Bottom-right corner
        ctx.beginPath();
        ctx.moveTo(offset + width - cornerSize, offset + height);
        ctx.lineTo(offset + width, offset + height);
        ctx.lineTo(offset + width, offset + height - cornerSize);
        ctx.stroke();
    },

    /**
     * Draw "Scan Me" banner frame
     */
    drawScanMeFrame(ctx, size, padding) {
        // Draw border first
        this.drawRoundedFrame(ctx, size, padding);

        // Add "SCAN ME" banner at bottom
        const bannerHeight = 40;
        const bannerY = size - padding - 50;

        ctx.fillStyle = '#007ACC';
        ctx.fillRect(padding - 10, bannerY, size - (padding * 2) + 20, bannerHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SCAN ME', size / 2, bannerY + bannerHeight / 2);
    },

    /**
     * Export canvas as PNG with frame
     */
    exportWithFrame(canvas, frameType, size, filename) {
        const framedCanvas = this.applyFrame(canvas, frameType, size);
        const link = document.createElement('a');
        link.download = filename;
        link.href = framedCanvas.toDataURL('image/png');
        link.click();
    },

    /**
     * Export canvas as SVG with frame
     */
    exportSVGWithFrame(qrSVG, frameType, size, filename) {
        // For SVG, we'll wrap the QR SVG in a frame SVG
        let svgContent = qrSVG;

        if (frameType !== 'none' && frameType) {
            const padding = 30;
            svgContent = this.wrapSVGWithFrame(qrSVG, frameType, size, padding);
        }

        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Wrap SVG QR code with frame elements
     */
    wrapSVGWithFrame(qrSVG, frameType, size, padding) {
        const qrSize = size - (padding * 2);
        
        // Extract the QR path data from the SVG
        const pathMatch = qrSVG.match(/<path[^>]*d="([^"]*)"[^>]*\/>/);
        if (!pathMatch) return qrSVG;
        
        const qrPath = pathMatch[1];
        
        let frameElements = '';
        
        switch (frameType) {
            case 'square':
                frameElements = `<rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="#000000" stroke-width="4"/>`;
                break;
            case 'rounded':
                frameElements = `<rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" rx="20" fill="none" stroke="#000000" stroke-width="4"/>`;
                break;
            case 'circle':
                frameElements = `<circle cx="${size/2}" cy="${size/2}" r="${(qrSize + 20)/2}" fill="none" stroke="#000000" stroke-width="4"/>`;
                break;
            case 'scanme':
                const bannerY = size - padding - 50;
                frameElements = `
                    <rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" rx="20" fill="none" stroke="#000000" stroke-width="4"/>
                    <rect x="${padding - 10}" y="${bannerY}" width="${qrSize + 20}" height="40" fill="#007ACC"/>
                    <text x="${size/2}" y="${bannerY + 20}" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold" font-family="Arial">SCAN ME</text>
                `;
                break;
        }
        
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
            <rect width="${size}" height="${size}" fill="#ffffff"/>
            <g transform="translate(${padding}, ${padding}) scale(${qrSize/100})">
                <path d="${qrPath}" fill="#000000"/>
            </g>
            ${frameElements}
        </svg>`;
    }
};

// Make available globally
window.QRFrames = QRFrames;
