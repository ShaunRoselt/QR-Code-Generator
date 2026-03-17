/**
 * QR Code Frame Utilities
 * Provides visual card-based frame selection with 3 frame styles
 */

const QRFrames = {
    // Available frame types
    FRAME_TYPES: {
        NONE: 'none',
        SCAN_ME: 'scanme',
        SCAN_ME_BORDER: 'scanme-border'
    },

    /**
     * Get visual frame selector HTML with preview cards
     */
    getFrameSelector() {
        const frames = [
            {
                id: 'none',
                name: 'None',
                preview: this.getFramePreviewSVG('none')
            },
            {
                id: 'scanme',
                name: 'Scan me!',
                preview: this.getFramePreviewSVG('scanme')
            },
            {
                id: 'scanme-border',
                name: 'Scan me! + Border',
                preview: this.getFramePreviewSVG('scanme-border')
            }
        ];

        return `
            <div class="form-group">
                <label>
                    <i class="bi bi-border-all"></i>
                    Frame Style
                </label>
                <div class="frame-selector-grid" id="frameSelector">
                    ${frames.map(frame => `
                        <div class="frame-card ${frame.id === 'none' ? 'active' : ''}" data-frame="${frame.id}">
                            <div class="frame-preview">
                                ${frame.preview}
                            </div>
                            <div class="frame-name">${frame.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Get preview SVG for a frame type
     */
    getFramePreviewSVG(frameType) {
        // Sample QR code SVG path for preview
        const qrSample = `<path d="M13.271 0H0v13.285h13.27zm-3.126 10.155H3.126V3.11h7.019z" fill="#0A0909"></path><path d="M8.198 5.078H5.072v3.13h3.126zM39.959 0H26.687v13.285H39.96zm-3.085 10.155h-7.04V3.11h7.04z" fill="#0A0909"></path><path d="M34.886 5.078H31.76v3.13h3.126zM13.271 26.715H0V40h13.27zm-3.126 10.156H3.126v-7.026h7.019z" fill="#0A0909"></path><path d="M8.198 31.793H5.072v3.13h3.126z" fill="#0A0909"></path>`;

        if (frameType === 'none') {
            return `
                <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="40" height="40" rx="2" fill="#E6E7ED"></rect>
                    <svg width="30" height="30" viewBox="0 0 40 40" x="10" y="10">
                        ${qrSample}
                    </svg>
                </svg>
            `;
        } else if (frameType === 'scanme') {
            return `
                <svg viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="40" height="40" rx="2" fill="#E6E7ED"></rect>
                    <svg width="30" height="30" viewBox="0 0 40 40" x="10" y="10">
                        ${qrSample}
                    </svg>
                    <text x="25" y="53" text-anchor="middle" font-size="6" font-weight="700" fill="#000000">Scan me!</text>
                </svg>
            `;
        } else if (frameType === 'scanme-border') {
            return `
                <svg viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="46" height="56" rx="2" stroke="#000000" stroke-width="1.5" fill="transparent"></rect>
                    <rect x="5" y="5" width="40" height="40" rx="2" fill="#E6E7ED"></rect>
                    <svg width="30" height="30" viewBox="0 0 40 40" x="10" y="10">
                        ${qrSample}
                    </svg>
                    <path d="M2 47h46" stroke="#000000" stroke-width="1.5"></path>
                    <text x="25" y="53" text-anchor="middle" font-size="6" font-weight="700" fill="#000000">Scan me!</text>
                </svg>
            `;
        }
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

        // Calculate dimensions based on frame type
        const hasText = frameType === 'scanme' || frameType === 'scanme-border';
        const textHeight = hasText ? Math.floor(targetSize * 0.15) : 0; // 15% for text area
        const totalHeight = targetSize + textHeight;
        
        // Create new canvas with frame
        const framedCanvas = document.createElement('canvas');
        framedCanvas.width = targetSize;
        framedCanvas.height = totalHeight;
        const ctx = framedCanvas.getContext('2d');

        // Fill background (white)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetSize, totalHeight);

        // Draw QR code at top
        ctx.drawImage(canvas, 0, 0, targetSize, targetSize);

        // Apply frame based on type
        if (frameType === 'scanme') {
            this.drawScanMeFrame(ctx, targetSize, totalHeight, textHeight);
        } else if (frameType === 'scanme-border') {
            this.drawScanMeBorderFrame(ctx, targetSize, totalHeight, textHeight);
        }

        return framedCanvas;
    },

    /**
     * Draw "Scan me!" text frame (no border)
     */
    drawScanMeFrame(ctx, width, totalHeight, textHeight) {
        const textY = totalHeight - (textHeight / 2);
        const fontSize = Math.floor(textHeight * 0.5);

        ctx.fillStyle = '#000000';
        ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Scan me!', width / 2, textY);
    },

    /**
     * Draw "Scan me!" text frame with border
     */
    drawScanMeBorderFrame(ctx, width, totalHeight, textHeight) {
        const qrSize = totalHeight - textHeight;
        const borderWidth = 2;
        const borderRadius = 3;

        // Draw outer border with rounded corners
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = borderWidth;
        this.roundRect(ctx, borderWidth / 2, borderWidth / 2, width - borderWidth, totalHeight - borderWidth, borderRadius);
        ctx.stroke();

        // Draw horizontal line separating QR from text
        ctx.beginPath();
        ctx.moveTo(0, qrSize);
        ctx.lineTo(width, qrSize);
        ctx.stroke();

        // Draw "Scan me!" text
        const textY = qrSize + (textHeight / 2);
        const fontSize = Math.floor(textHeight * 0.5);

        ctx.fillStyle = '#000000';
        ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Scan me!', width / 2, textY);
    },

    /**
     * Helper to draw rounded rectangle
     */
    roundRect(ctx, x, y, width, height, radius) {
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
    },

    /**
     * Export QR code with frame as PNG
     * @param {HTMLCanvasElement} canvas - The QR code canvas
     * @param {string} frameType - Type of frame
     * @param {number} exportSize - Export resolution
     * @param {string} filename - Download filename
     */
    exportWithFrame(canvas, frameType, exportSize, filename) {
        const framedCanvas = this.applyFrame(canvas, frameType, exportSize);
        
        framedCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    },

    /**
     * Export QR code with frame as SVG
     * @param {string} qrSVG - The QR code SVG string
     * @param {string} frameType - Type of frame
     * @param {number} size - SVG size
     * @param {string} filename - Download filename
     */
    exportSVGWithFrame(qrSVG, frameType, size, filename) {
        const framedSVG = this.wrapSVGWithFrame(qrSVG, frameType, size);
        
        const blob = new Blob([framedSVG], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Wrap QR code SVG with frame
     * @param {string} qrSVG - The QR code SVG string
     * @param {string} frameType - Type of frame
     * @param {number} size - SVG size
     * @returns {string} - Framed SVG string
     */
    wrapSVGWithFrame(qrSVG, frameType, size) {
        if (frameType === 'none' || !frameType) {
            return qrSVG;
        }

        const hasText = frameType === 'scanme' || frameType === 'scanme-border';
        const textHeight = hasText ? Math.floor(size * 0.15) : 0;
        const totalHeight = size + textHeight;
        const qrSize = size;

        // Extract the QR code path data from the SVG
        const pathMatch = qrSVG.match(/<path[^>]*d="([^"]*)"[^>]*\/>/g);
        const qrPaths = pathMatch ? pathMatch.join('') : '';

        let svg = '';

        if (frameType === 'scanme') {
            // Frame without border - matching provided SVG structure
            svg = `<svg viewBox="0 0 ${size} ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect id="frame" x="1" y="1" width="${size - 2}" height="${totalHeight - 2}" rx="3" fill="transparent" stroke="transparent" stroke-width="2"></rect>
                <g id="frame">
                    <path d="M6 10a4 4 0 0 1 4-4h${size - 20}a4 4 0 0 1 4 4v${qrSize - 20}a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill="#E6E7ED" id="qr-background"></path>
                    <svg width="${qrSize - 20}" height="${qrSize - 20}" viewBox="0 0 ${qrSize} ${qrSize}" fill="none" xmlns="http://www.w3.org/2000/svg" x="12" y="12">
                        ${qrPaths}
                    </svg>
                </g>
                <g id="text-container">
                    <text x="${size / 2}" y="${qrSize + (textHeight / 2) + 5}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.floor(textHeight * 0.5)}" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fill="#000000">Scan me!</text>
                </g>
            </svg>`;
        } else if (frameType === 'scanme-border') {
            // Frame with border - matching provided SVG structure
            svg = `<svg viewBox="0 0 ${size} ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect id="frame" x="1" y="1" width="${size - 2}" height="${totalHeight - 2}" rx="3" stroke="#000000" stroke-width="2" fill="transparent"></rect>
                <g id="frame">
                    <path id="qr-background" d="M6 10a4 4 0 0 1 4-4h${size - 20}a4 4 0 0 1 4 4v${qrSize - 20}a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill="#E6E7ED"></path>
                    <svg width="${qrSize - 20}" height="${qrSize - 20}" viewBox="0 0 ${qrSize} ${qrSize}" fill="none" xmlns="http://www.w3.org/2000/svg" x="12" y="12">
                        ${qrPaths}
                    </svg>
                </g>
                <path d="M1 ${qrSize}h${size - 2}" fill="#000000"></path>
                <g id="text-container">
                    <text x="${size / 2}" y="${qrSize + (textHeight / 2) + 5}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.floor(textHeight * 0.5)}" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fill="#000000">Scan me!</text>
                </g>
            </svg>`;
        }

        return svg;
    }
};
