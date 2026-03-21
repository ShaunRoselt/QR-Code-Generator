/**
 * QR Code Frame Utilities
 * Provides visual card-based frame selection with multiple frame styles
 */

const QRFrames = {
    FRAME_ARTBOARD_WIDTH: 64,
    DECORATIVE_FRAME_ARTBOARD_HEIGHT: 84,
    BORDER_FRAME_WIDTH_RATIO: 8 / 300,
    BORDER_SEPARATOR_RATIO: 3 / 300,
    FRAME_BACKGROUND_COLOR: '#ffffff',
    QR_BACKGROUND_COLOR: '#E6E7ED',
    FRAME_FOREGROUND_COLOR: '#000000',
    FRAME_TEXT: 'Scan me!',

    // Available frame types
    FRAME_TYPES: {
        NONE: 'none',
        SCAN_ME: 'scanme',
        SCAN_ME_BORDER: 'scanme-border',
        ROUNDED_BANNER: 'rounded-banner',
        OUTLINED_LABEL: 'outlined-label',
        FOOTER_PANEL: 'footer-panel',
        CENTER_BADGE: 'center-badge',
        POINTER_PANEL: 'pointer-panel'
    },

    getFrameOptions() {
        return [
            {
                id: this.FRAME_TYPES.NONE,
                name: 'None'
            },
            {
                id: this.FRAME_TYPES.SCAN_ME,
                name: 'Scan me!'
            },
            {
                id: this.FRAME_TYPES.SCAN_ME_BORDER,
                name: 'Scan me! + Border'
            },
            {
                id: this.FRAME_TYPES.ROUNDED_BANNER,
                name: 'Rounded Banner'
            },
            {
                id: this.FRAME_TYPES.OUTLINED_LABEL,
                name: 'Outlined Label'
            },
            {
                id: this.FRAME_TYPES.FOOTER_PANEL,
                name: 'Footer Panel'
            },
            {
                id: this.FRAME_TYPES.CENTER_BADGE,
                name: 'Center Badge'
            },
            {
                id: this.FRAME_TYPES.POINTER_PANEL,
                name: 'Pointer Panel'
            }
        ];
    },

    getFrameDisplayName(frameType) {
        const match = this.getFrameOptions().find(frame => frame.id === frameType);
        return match ? match.name : 'Scan me!';
    },

    isDecorativeFrame(frameType) {
        return [
            this.FRAME_TYPES.ROUNDED_BANNER,
            this.FRAME_TYPES.OUTLINED_LABEL,
            this.FRAME_TYPES.FOOTER_PANEL,
            this.FRAME_TYPES.CENTER_BADGE,
            this.FRAME_TYPES.POINTER_PANEL
        ].includes(frameType);
    },

    /**
     * Get visual frame selector HTML with preview cards
     */
    getFrameSelector() {
        const frames = this.getFrameOptions().map(frame => ({
            ...frame,
            preview: this.getFramePreviewMarkup(frame.id)
        }));

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
     * Get preview image markup for a frame type
     */
    getFramePreviewMarkup(frameType) {
        const previewCanvas = this.applyFrame(this.createSampleQRCodeCanvas(100), frameType, 100);
        const previewName = this.getFrameDisplayName(frameType);

        return `<img src="${previewCanvas.toDataURL('image/png')}" alt="${previewName} frame preview">`;
    },

    /**
     * Update frame selector thumbnails using the current QR preview canvas
     */
    updateFramePreviews(qrCanvas, previewSize = 100) {
        if (!qrCanvas) {
            return;
        }

        const frameCards = document.querySelectorAll('.frame-card');
        frameCards.forEach(card => {
            const frameType = card.dataset.frame;
            const preview = card.querySelector('.frame-preview');
            if (!preview) {
                return;
            }

            const sourceCanvas = document.createElement('canvas');
            sourceCanvas.width = previewSize;
            sourceCanvas.height = previewSize;
            const sourceContext = sourceCanvas.getContext('2d');
            sourceContext.fillStyle = this.FRAME_BACKGROUND_COLOR;
            sourceContext.fillRect(0, 0, previewSize, previewSize);
            sourceContext.drawImage(qrCanvas, 0, 0, previewSize, previewSize);

            const framedPreview = this.applyFrame(sourceCanvas, frameType, previewSize);
            const previewName = this.getFrameDisplayName(frameType);

            preview.innerHTML = `<img src="${framedPreview.toDataURL('image/png')}" alt="${previewName} frame preview">`;
        });
    },

    /**
     * Create a QR-like sample canvas used for frame selector thumbnails
     */
    createSampleQRCodeCanvas(size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        const modules = [
            '1111001000',
            '1001000100',
            '1011000010',
            '1001001000',
            '1111000010',
            '0000010100',
            '1010100010',
            '0100001000',
            '0010100010',
            '0000000000'
        ];
        const moduleSize = size / modules.length;

        ctx.fillStyle = this.FRAME_BACKGROUND_COLOR;
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;

        modules.forEach((row, y) => {
            for (let x = 0; x < row.length; x += 1) {
                if (row[x] === '1') {
                    ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
                }
            }
        });

        return canvas;
    },

    /**
     * Get shared frame metrics for preview and export rendering
     */
    getFrameMetrics(frameType, size) {
        if (this.isDecorativeFrame(frameType)) {
            return this.getDecorativeFrameMetrics(size);
        }

        const hasText = frameType === this.FRAME_TYPES.SCAN_ME || frameType === this.FRAME_TYPES.SCAN_ME_BORDER;
        const textHeight = hasText ? Math.round(size * 0.15) : 0;
        const isBorderFrame = frameType === this.FRAME_TYPES.SCAN_ME_BORDER;

        return {
            size,
            hasText,
            totalHeight: size + textHeight,
            textHeight,
            borderWidth: isBorderFrame ? Math.max(4, Math.round(size * this.BORDER_FRAME_WIDTH_RATIO)) : 0,
            separatorWidth: isBorderFrame ? Math.max(2, Math.round(size * this.BORDER_SEPARATOR_RATIO)) : 0,
            borderRadius: Math.max(3, Math.round(size * 0.01)),
            fontSize: hasText ? Math.max(6, Math.round(textHeight * 0.5)) : 0,
            textY: hasText ? size + (textHeight / 2) : size
        };
    },

    getDecorativeFrameMetrics(size) {
        const scale = size / this.FRAME_ARTBOARD_WIDTH;
        const strokeWidth = Math.max(1.5, scale * 2);

        return {
            size,
            scale,
            totalHeight: Math.ceil(scale * this.DECORATIVE_FRAME_ARTBOARD_HEIGHT),
            strokeWidth,
            outerRadius: Math.max(2, scale * 3),
            qrBackgroundRadius: Math.max(2, scale * 4),
            qrBackground: {
                x: scale * 6,
                y: scale * 6,
                width: scale * 52,
                height: scale * 52
            },
            qrBounds: {
                x: scale * 12,
                y: scale * 12,
                size: scale * 40
            },
            fontSize: Math.max(6, scale * 9)
        };
    },

    /**
     * Format metric values for SVG output
     */
    formatMetric(value) {
        return Number(value.toFixed(2));
    },

    /**
     * Extract the inner SVG content and source viewBox
     */
    extractSVGSource(qrSVG, fallbackSize) {
        const content = qrSVG
            .replace(/^[\s\S]*?<svg\b[^>]*>/i, '')
            .replace(/<\/svg>\s*$/i, '')
            .trim();

        const viewBoxMatch = qrSVG.match(/viewBox="([^"]+)"/i);
        if (viewBoxMatch) {
            const [minX, minY, width, height] = viewBoxMatch[1].split(/\s+/).map(Number);
            return {
                content,
                viewBox: { minX, minY, width, height }
            };
        }

        const widthMatch = qrSVG.match(/width="([^"]+)"/i);
        const heightMatch = qrSVG.match(/height="([^"]+)"/i);
        const width = parseFloat(widthMatch?.[1]) || fallbackSize;
        const height = parseFloat(heightMatch?.[1]) || fallbackSize;

        return {
            content,
            viewBox: { minX: 0, minY: 0, width, height }
        };
    },

    /**
     * Build a framed SVG using shared layout metrics
     */
    buildFrameSVG(frameType, size, qrContent, sourceViewBox) {
        if (this.isDecorativeFrame(frameType)) {
            return this.buildDecorativeFrameSVG(frameType, size, qrContent, sourceViewBox);
        }

        const metrics = this.getFrameMetrics(frameType, size);
        const scaleX = size / sourceViewBox.width;
        const scaleY = size / sourceViewBox.height;
        const translateX = -sourceViewBox.minX * scaleX;
        const translateY = -sourceViewBox.minY * scaleY;
        const borderInset = metrics.borderWidth / 2;

        return `
            <svg viewBox="0 0 ${size} ${metrics.totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="${size}" height="${metrics.totalHeight}" fill="${this.FRAME_BACKGROUND_COLOR}"></rect>
                <g transform="translate(${this.formatMetric(translateX)} ${this.formatMetric(translateY)}) scale(${this.formatMetric(scaleX)} ${this.formatMetric(scaleY)})">
                    ${qrContent}
                </g>
                ${frameType === this.FRAME_TYPES.SCAN_ME_BORDER ? `
                    <rect x="${this.formatMetric(borderInset)}" y="${this.formatMetric(borderInset)}" width="${this.formatMetric(size - metrics.borderWidth)}" height="${this.formatMetric(metrics.totalHeight - metrics.borderWidth)}" rx="${metrics.borderRadius}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${metrics.borderWidth}" fill="none"></rect>
                    <line x1="${this.formatMetric(borderInset)}" y1="${size}" x2="${this.formatMetric(size - borderInset)}" y2="${size}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${metrics.separatorWidth}"></line>
                ` : ''}
                ${metrics.hasText ? `
                    <text x="${size / 2}" y="${this.formatMetric(metrics.textY)}" text-anchor="middle" dominant-baseline="middle" font-size="${metrics.fontSize}" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fill="${this.FRAME_FOREGROUND_COLOR}">${this.FRAME_TEXT}</text>
                ` : ''}
            </svg>
        `;
    },

    buildDecorativeFrameSVG(frameType, size, qrContent, sourceViewBox) {
        const metrics = this.getDecorativeFrameMetrics(size);
        const qrScaleX = metrics.qrBounds.size / sourceViewBox.width;
        const qrScaleY = metrics.qrBounds.size / sourceViewBox.height;
        const qrTranslateX = metrics.qrBounds.x - (sourceViewBox.minX * qrScaleX);
        const qrTranslateY = metrics.qrBounds.y - (sourceViewBox.minY * qrScaleY);
        const frameMarkup = this.getDecorativeFrameSVGMarkup(frameType, metrics);

        return `
            <svg viewBox="0 0 ${size} ${metrics.totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="${size}" height="${metrics.totalHeight}" fill="${this.FRAME_BACKGROUND_COLOR}"></rect>
                ${frameMarkup.beforeQR}
                <g transform="translate(${this.formatMetric(qrTranslateX)} ${this.formatMetric(qrTranslateY)}) scale(${this.formatMetric(qrScaleX)} ${this.formatMetric(qrScaleY)})">
                    ${qrContent}
                </g>
                ${frameMarkup.afterQR}
            </svg>
        `;
    },

    getDecorativeFrameSVGMarkup(frameType, metrics) {
        const qrBackground = `<rect x="${this.formatMetric(metrics.qrBackground.x)}" y="${this.formatMetric(metrics.qrBackground.y)}" width="${this.formatMetric(metrics.qrBackground.width)}" height="${this.formatMetric(metrics.qrBackground.height)}" rx="${this.formatMetric(metrics.qrBackgroundRadius)}" fill="${this.QR_BACKGROUND_COLOR}"></rect>`;
        const commonText = (textY, color) => `
            <text x="${this.formatMetric(metrics.size / 2)}" y="${this.formatMetric(textY)}" text-anchor="middle" dominant-baseline="middle" font-size="${this.formatMetric(metrics.fontSize)}" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fill="${color}">${this.FRAME_TEXT}</text>
        `;

        switch (frameType) {
            case this.FRAME_TYPES.ROUNDED_BANNER:
                return {
                    beforeQR: `
                        <rect x="${this.scaleArtboardX(1, metrics)}" y="${this.scaleArtboardY(1, metrics)}" width="${this.scaleArtboardX(62, metrics)}" height="${this.scaleArtboardY(62, metrics)}" rx="${this.formatMetric(metrics.outerRadius)}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}" fill="none"></rect>
                        ${qrBackground}
                        <rect x="${this.scaleArtboardX(1, metrics)}" y="${this.scaleArtboardY(67, metrics)}" width="${this.scaleArtboardX(62, metrics)}" height="${this.scaleArtboardY(16, metrics)}" rx="${this.scaleArtboardY(1, metrics)}" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}"></rect>
                    `,
                    afterQR: commonText(this.scaleArtboardY(75.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.OUTLINED_LABEL:
                return {
                    beforeQR: `
                        <rect x="${this.scaleArtboardX(1, metrics)}" y="${this.scaleArtboardY(1, metrics)}" width="${this.scaleArtboardX(62, metrics)}" height="${this.scaleArtboardY(82, metrics)}" rx="${this.formatMetric(metrics.outerRadius)}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}" fill="none"></rect>
                        ${qrBackground}
                    `,
                    afterQR: commonText(this.scaleArtboardY(73.765, metrics), this.FRAME_FOREGROUND_COLOR)
                };
            case this.FRAME_TYPES.FOOTER_PANEL:
                return {
                    beforeQR: `
                        <path d="${this.getTopRoundedRectPath(this.scaleArtboardX(1, metrics), this.scaleArtboardY(1, metrics), this.scaleArtboardX(62, metrics), this.scaleArtboardY(62, metrics), metrics.outerRadius)}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}" fill="none"></path>
                        ${qrBackground}
                        <path d="${this.getBottomRoundedRectPath(this.scaleArtboardX(1, metrics), this.scaleArtboardY(63, metrics), this.scaleArtboardX(62, metrics), this.scaleArtboardY(20, metrics), metrics.outerRadius)}" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}"></path>
                    `,
                    afterQR: commonText(this.scaleArtboardY(73.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.CENTER_BADGE:
                return {
                    beforeQR: `
                        ${qrBackground}
                        <rect x="${this.scaleArtboardX(7, metrics)}" y="${this.scaleArtboardY(63, metrics)}" width="${this.scaleArtboardX(50, metrics)}" height="${this.scaleArtboardY(16, metrics)}" rx="${this.scaleArtboardY(1, metrics)}" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}"></rect>
                    `,
                    afterQR: commonText(this.scaleArtboardY(71.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.POINTER_PANEL:
                return {
                    beforeQR: `
                        <path d="${this.getTopRoundedRectPath(this.scaleArtboardX(1, metrics), this.scaleArtboardY(1, metrics), this.scaleArtboardX(62, metrics), this.scaleArtboardY(63, metrics), metrics.outerRadius)}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}" fill="none"></path>
                        <path d="M ${this.scaleArtboardX(32.5, metrics)} ${this.scaleArtboardY(61, metrics)} L ${this.scaleArtboardX(35.531, metrics)} ${this.scaleArtboardY(66.25, metrics)} L ${this.scaleArtboardX(29.47, metrics)} ${this.scaleArtboardY(66.25, metrics)} Z" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${qrBackground}
                        <path d="${this.getBottomRoundedRectPath(this.scaleArtboardX(1, metrics), this.scaleArtboardY(67, metrics), this.scaleArtboardX(62, metrics), this.scaleArtboardY(16, metrics), this.scaleArtboardY(1, metrics))}" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}"></path>
                    `,
                    afterQR: commonText(this.scaleArtboardY(75.765, metrics), '#ffffff')
                };
            default:
                return {
                    beforeQR: qrBackground,
                    afterQR: ''
                };
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
        if (frameType === this.FRAME_TYPES.NONE || !frameType) {
            return canvas;
        }

        const metrics = this.getFrameMetrics(frameType, targetSize);

        // Create new canvas with frame
        const framedCanvas = document.createElement('canvas');
        framedCanvas.width = targetSize;
        framedCanvas.height = metrics.totalHeight;
        const ctx = framedCanvas.getContext('2d');

        // Fill background (white)
        ctx.fillStyle = this.FRAME_BACKGROUND_COLOR;
        ctx.fillRect(0, 0, targetSize, metrics.totalHeight);

        if (this.isDecorativeFrame(frameType)) {
            this.drawDecorativeFrame(ctx, canvas, frameType, metrics);
            return framedCanvas;
        }

        // Draw QR code at top
        ctx.drawImage(canvas, 0, 0, targetSize, targetSize);

        // Apply frame based on type
        if (frameType === this.FRAME_TYPES.SCAN_ME) {
            this.drawScanMeFrame(ctx, metrics);
        } else if (frameType === this.FRAME_TYPES.SCAN_ME_BORDER) {
            this.drawScanMeBorderFrame(ctx, metrics);
        }

        return framedCanvas;
    },

    drawDecorativeFrame(ctx, canvas, frameType, metrics) {
        ctx.fillStyle = this.QR_BACKGROUND_COLOR;
        this.roundRect(
            ctx,
            metrics.qrBackground.x,
            metrics.qrBackground.y,
            metrics.qrBackground.width,
            metrics.qrBackground.height,
            metrics.qrBackgroundRadius
        );
        ctx.fill();

        ctx.drawImage(
            canvas,
            metrics.qrBounds.x,
            metrics.qrBounds.y,
            metrics.qrBounds.size,
            metrics.qrBounds.size
        );

        switch (frameType) {
            case this.FRAME_TYPES.ROUNDED_BANNER:
                this.drawRoundedBannerFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.OUTLINED_LABEL:
                this.drawOutlinedLabelFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.FOOTER_PANEL:
                this.drawFooterPanelFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.CENTER_BADGE:
                this.drawCenterBadgeFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.POINTER_PANEL:
                this.drawPointerPanelFrame(ctx, metrics);
                break;
        }
    },

    /**
     * Draw "Scan me!" text frame (no border)
     */
    drawScanMeFrame(ctx, metrics) {
        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.font = `700 ${metrics.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.FRAME_TEXT, metrics.size / 2, metrics.textY);
    },

    /**
     * Draw "Scan me!" text frame with border
     */
    drawScanMeBorderFrame(ctx, metrics) {
        // Draw outer border with rounded corners
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.borderWidth;
        this.roundRect(
            ctx,
            metrics.borderWidth / 2,
            metrics.borderWidth / 2,
            metrics.size - metrics.borderWidth,
            metrics.totalHeight - metrics.borderWidth,
            metrics.borderRadius
        );
        ctx.stroke();

        // Draw horizontal line separating QR from text
        ctx.beginPath();
        ctx.lineWidth = metrics.separatorWidth;
        ctx.moveTo(metrics.borderWidth / 2, metrics.size);
        ctx.lineTo(metrics.size - (metrics.borderWidth / 2), metrics.size);
        ctx.stroke();

        // Draw "Scan me!" text
        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.font = `700 ${metrics.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.FRAME_TEXT, metrics.size / 2, metrics.textY);
    },

    drawRoundedBannerFrame(ctx, metrics) {
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.strokeWidth;
        this.roundRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(1, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(62, metrics),
            metrics.outerRadius
        );
        ctx.stroke();

        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        this.roundRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(67, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(16, metrics),
            this.scaleArtboardY(1, metrics)
        );
        ctx.fill();
        ctx.stroke();

        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(75.765, metrics), '#ffffff');
    },

    drawOutlinedLabelFrame(ctx, metrics) {
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.strokeWidth;
        this.roundRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(1, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(82, metrics),
            metrics.outerRadius
        );
        ctx.stroke();

        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(73.765, metrics), this.FRAME_FOREGROUND_COLOR);
    },

    drawFooterPanelFrame(ctx, metrics) {
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.strokeWidth;
        this.topRoundedRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(1, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(62, metrics),
            metrics.outerRadius
        );
        ctx.stroke();

        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        this.bottomRoundedRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(63, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(20, metrics),
            metrics.outerRadius
        );
        ctx.fill();
        ctx.stroke();

        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(73.765, metrics), '#ffffff');
    },

    drawCenterBadgeFrame(ctx, metrics) {
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.strokeWidth;
        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        this.roundRect(
            ctx,
            this.scaleArtboardX(7, metrics),
            this.scaleArtboardY(63, metrics),
            this.scaleArtboardX(50, metrics),
            this.scaleArtboardY(16, metrics),
            this.scaleArtboardY(1, metrics)
        );
        ctx.fill();
        ctx.stroke();

        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(71.765, metrics), '#ffffff');
    },

    drawPointerPanelFrame(ctx, metrics) {
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.strokeWidth;
        this.topRoundedRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(1, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(63, metrics),
            metrics.outerRadius
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.scaleArtboardX(32.5, metrics), this.scaleArtboardY(61, metrics));
        ctx.lineTo(this.scaleArtboardX(35.531, metrics), this.scaleArtboardY(66.25, metrics));
        ctx.lineTo(this.scaleArtboardX(29.47, metrics), this.scaleArtboardY(66.25, metrics));
        ctx.closePath();
        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.fill();

        this.bottomRoundedRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(67, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(16, metrics),
            this.scaleArtboardY(1, metrics)
        );
        ctx.fill();
        ctx.stroke();

        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(75.765, metrics), '#ffffff');
    },

    drawFrameLabel(ctx, metrics, y, color) {
        ctx.fillStyle = color;
        ctx.font = `700 ${metrics.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.FRAME_TEXT, metrics.size / 2, y);
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

    topRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    },

    bottomRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.closePath();
    },

    getTopRoundedRectPath(x, y, width, height, radius) {
        return [
            `M ${this.formatMetric(x + radius)} ${this.formatMetric(y)}`,
            `H ${this.formatMetric(x + width - radius)}`,
            `Q ${this.formatMetric(x + width)} ${this.formatMetric(y)} ${this.formatMetric(x + width)} ${this.formatMetric(y + radius)}`,
            `V ${this.formatMetric(y + height)}`,
            `H ${this.formatMetric(x)}`,
            `V ${this.formatMetric(y + radius)}`,
            `Q ${this.formatMetric(x)} ${this.formatMetric(y)} ${this.formatMetric(x + radius)} ${this.formatMetric(y)}`,
            'Z'
        ].join(' ');
    },

    getBottomRoundedRectPath(x, y, width, height, radius) {
        return [
            `M ${this.formatMetric(x)} ${this.formatMetric(y)}`,
            `H ${this.formatMetric(x + width)}`,
            `V ${this.formatMetric(y + height - radius)}`,
            `Q ${this.formatMetric(x + width)} ${this.formatMetric(y + height)} ${this.formatMetric(x + width - radius)} ${this.formatMetric(y + height)}`,
            `H ${this.formatMetric(x + radius)}`,
            `Q ${this.formatMetric(x)} ${this.formatMetric(y + height)} ${this.formatMetric(x)} ${this.formatMetric(y + height - radius)}`,
            'Z'
        ].join(' ');
    },

    scaleArtboardX(value, metrics) {
        return this.formatMetric(value * metrics.scale);
    },

    scaleArtboardY(value, metrics) {
        return this.formatMetric(value * metrics.scale);
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
        if (frameType === this.FRAME_TYPES.NONE || !frameType) {
            return qrSVG;
        }
        const { content, viewBox } = this.extractSVGSource(qrSVG, size);
        return this.buildFrameSVG(frameType, size, content, viewBox);
    }
};
