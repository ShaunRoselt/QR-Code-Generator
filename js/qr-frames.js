/**
 * QR Code Frame Utilities
 * Provides visual card-based frame selection with multiple frame styles
 */

const QRFrames = {
    FRAME_ARTBOARD_WIDTH: 64,
    DECORATIVE_FRAME_ARTBOARD_HEIGHT: 84,
    BORDER_FRAME_WIDTH_RATIO: 2 / 300,
    BORDER_SEPARATOR_RATIO: 1 / 300,
    FRAME_BACKGROUND_COLOR: '#ffffff',
    QR_BACKGROUND_COLOR: '#E6E7ED',
    FRAME_FOREGROUND_COLOR: '#000000',
    FRAME_TEXT: 'Scan me!',
    RENDER_PHASES: {
        BEFORE: 'before',
        AFTER: 'after'
    },
    // Path data authored against the shared 64x84 decorative frame artboard.
    BOLD_BORDER_PATH: 'M64 3.815v76.27a1.3 1.3 0 0 1-.498.301c-1.572.382-2.568 1.345-2.926 2.911-.16.703-.677.683-1.234.683H40.61c-11.885 0-23.789 0-35.693.02-.816 0-1.254-.2-1.473-1.044a3.16 3.16 0 0 0-2.409-2.43C.2 80.307 0 79.865 0 79.042.02 54.327.02 29.633 0 4.92c0-.843.18-1.345 1.055-1.566 1.254-.321 2.03-1.185 2.389-2.45.06-.32.219-.642.418-.903h56.336c.04.06.1.1.12.16.378 1.968 1.552 3.153 3.503 3.534.08.02.14.08.179.12',
    CENTERED_QR_FRAME_PATH: 'M-2 4a6 6 0 0 1 6-6h56a6 6 0 0 1 6 6h-4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zm66 74H0zm-66 0V4a6 6 0 0 1 6-6v4a2 2 0 0 0-2 2v74zM60-2a6 6 0 0 1 6 6v74h-4V4a2 2 0 0 0-2-2z',
    CENTERED_QR_RIP_PATH: 'M3.016 83.259 0 78l1.767-1 2.574 4.66 2.132-3.86c.546-.989 2.105-.989 2.65 0l2.133 3.86 2.132-3.86c.546-.989 2.104-.989 2.65 0l2.133 3.86 2.131-3.86c.547-.989 2.105-.989 2.651 0l2.132 3.86 2.132-3.86c.546-.989 2.105-.989 2.65 0L32 81.66l2.132-3.86c.546-.989 2.105-.989 2.65 0l2.133 3.86 2.132-3.86c.546-.989 2.104-.989 2.65 0l2.133 3.86 2.132-3.86c.546-.989 2.104-.989 2.65 0l2.132 3.86 2.132-3.86c.546-.989 2.105-.989 2.651 0l2.132 3.86L62.233 77 64 78l-3.016 5.259c-.546.988-2.104.988-2.65 0l-2.132-3.86-2.132 3.86c-.546.988-2.105.988-2.651 0l-2.132-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.104.988-2.65 0l-2.132-3.86-2.133 3.86c-.546.988-2.104.988-2.65 0l-2.132-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.104.988-2.65 0',

    // Available frame types
    FRAME_TYPES: {
        NONE: 'none',
        SCAN_ME: 'scanme',
        SCAN_ME_BORDER: 'scanme-border',
        ROUNDED_BANNER: 'rounded-banner',
        OUTLINED_LABEL: 'outlined-label',
        FOOTER_PANEL: 'footer-panel',
        CENTER_BADGE: 'center-badge',
        POINTER_PANEL: 'pointer-panel',
        BOLD_BORDER: 'bold-border',
        CENTERED_QR: 'centered-qr',
        BOX_POINTER: 'box-pointer',
        TOP_BANNER: 'top-banner',
        SKETCH_BORDER: 'sketch-border'
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
            },
            {
                id: this.FRAME_TYPES.BOLD_BORDER,
                name: 'Bold Border'
            },
            {
                id: this.FRAME_TYPES.CENTERED_QR,
                name: 'Centered QR'
            },
            {
                id: this.FRAME_TYPES.BOX_POINTER,
                name: 'Box Pointer'
            },
            {
                id: this.FRAME_TYPES.TOP_BANNER,
                name: 'Top Banner'
            },
            {
                id: this.FRAME_TYPES.SKETCH_BORDER,
                name: 'Sketch Border'
            }
        ];
    },

    getFrameDisplayName(frameType) {
        const match = this.getFrameOptions().find(frame => frame.id === frameType);
        return match ? match.name : this.FRAME_TEXT;
    },

    isDecorativeFrame(frameType) {
        return [
            this.FRAME_TYPES.ROUNDED_BANNER,
            this.FRAME_TYPES.OUTLINED_LABEL,
            this.FRAME_TYPES.FOOTER_PANEL,
            this.FRAME_TYPES.CENTER_BADGE,
            this.FRAME_TYPES.POINTER_PANEL,
            this.FRAME_TYPES.BOLD_BORDER,
            this.FRAME_TYPES.CENTERED_QR,
            this.FRAME_TYPES.BOX_POINTER,
            this.FRAME_TYPES.TOP_BANNER,
            this.FRAME_TYPES.SKETCH_BORDER
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
            return this.getDecorativeFrameMetrics(frameType, size);
        }

        const hasText = frameType === this.FRAME_TYPES.SCAN_ME || frameType === this.FRAME_TYPES.SCAN_ME_BORDER;
        const textHeight = hasText ? Math.round(size * 0.15) : 0;
        const isBorderFrame = frameType === this.FRAME_TYPES.SCAN_ME_BORDER;

        return {
            size,
            hasText,
            totalHeight: size + textHeight,
            textHeight,
            borderWidth: isBorderFrame ? Math.max(2, Math.round(size * this.BORDER_FRAME_WIDTH_RATIO)) : 0,
            separatorWidth: isBorderFrame ? Math.max(1, Math.round(size * this.BORDER_SEPARATOR_RATIO)) : 0,
            borderRadius: Math.max(3, Math.round(size * 0.01)),
            fontSize: hasText ? Math.max(6, Math.round(textHeight * 0.5)) : 0,
            textY: hasText ? size + (textHeight / 2) : size
        };
    },

    getDecorativeFrameConfig(frameType) {
        const defaultConfig = {
            artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
            qrBackground: { x: 6, y: 6, width: 52, height: 52, radius: 4 },
            qrBounds: { x: 12, y: 12, size: 40 }
        };

        switch (frameType) {
            case this.FRAME_TYPES.CENTERED_QR:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    qrBackground: { x: 6, y: 6, width: 52, height: 52, radius: 4 },
                    qrBounds: { x: 12, y: 12, size: 40 }
                };
            case this.FRAME_TYPES.BOX_POINTER:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    qrBackground: { x: 7, y: 5, width: 50, height: 50, radius: 4 },
                    qrBounds: { x: 12, y: 12, size: 40 }
                };
            case this.FRAME_TYPES.TOP_BANNER:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    qrBackground: { x: 7, y: 29, width: 50, height: 50, radius: 4 },
                    qrBounds: { x: 12, y: 34, size: 40 }
                };
            case this.FRAME_TYPES.SKETCH_BORDER:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    qrBackground: { x: 12, y: 15, width: 40, height: 40, radius: 4 },
                    qrBounds: { x: 16, y: 19, size: 32 }
                };
            default:
                return defaultConfig;
        }
    },

    getDecorativeFrameMetrics(frameType, size) {
        const config = this.getDecorativeFrameConfig(frameType);
        const scale = size / this.FRAME_ARTBOARD_WIDTH;
        const strokeWidth = Math.max(1.5, scale * 2);
        const mapRect = rect => rect ? {
            x: scale * rect.x,
            y: scale * rect.y,
            width: scale * rect.width,
            height: scale * rect.height,
            radius: scale * rect.radius
        } : null;
        const mapQRBounds = bounds => bounds ? {
            x: scale * bounds.x,
            y: scale * bounds.y,
            size: scale * bounds.size
        } : null;

        return {
            size,
            scale,
            artboardHeight: config.artboardHeight,
            totalHeight: Math.ceil(scale * config.artboardHeight),
            strokeWidth,
            outerRadius: Math.max(2, scale * 3),
            qrBackground: mapRect(config.qrBackground),
            qrBounds: mapQRBounds(config.qrBounds),
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
        const metrics = this.getDecorativeFrameMetrics(frameType, size);
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
        const qrBackground = metrics.qrBackground ? `<rect x="${this.formatMetric(metrics.qrBackground.x)}" y="${this.formatMetric(metrics.qrBackground.y)}" width="${this.formatMetric(metrics.qrBackground.width)}" height="${this.formatMetric(metrics.qrBackground.height)}" rx="${this.formatMetric(metrics.qrBackground.radius)}" fill="${this.QR_BACKGROUND_COLOR}"></rect>` : '';
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
                        ${qrBackground}
                        <path d="M ${this.scaleArtboardX(32.5, metrics)} ${this.scaleArtboardY(61, metrics)} L ${this.scaleArtboardX(35.531, metrics)} ${this.scaleArtboardY(67, metrics)} L ${this.scaleArtboardX(29.47, metrics)} ${this.scaleArtboardY(67, metrics)} Z" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.getBottomRoundedRectPath(this.scaleArtboardX(1, metrics), this.scaleArtboardY(67, metrics), this.scaleArtboardX(62, metrics), this.scaleArtboardY(16, metrics), metrics.outerRadius)}" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}"></path>
                    `,
                    afterQR: commonText(this.scaleArtboardY(75.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.BOLD_BORDER:
                return {
                    beforeQR: `
                        <path d="${this.BOLD_BORDER_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${qrBackground}
                    `,
                    afterQR: commonText(this.scaleArtboardY(73.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.CENTERED_QR:
                return {
                    beforeQR: `
                        <path d="${this.CENTERED_QR_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${qrBackground}
                    `,
                    afterQR: `
                        <path d="${this.CENTERED_QR_RIP_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${commonText(this.scaleArtboardY(68.765, metrics), this.FRAME_FOREGROUND_COLOR)}
                    `
                };
            case this.FRAME_TYPES.BOX_POINTER:
                return {
                    beforeQR: `
                        <path d="M6 1h52a3 3 0 0 1 3 3v52a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z" transform="scale(${this.formatMetric(metrics.scale)})" fill="none" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                        ${qrBackground}
                        <path d="m32.5 61 3.031 5.25H29.47z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="M4 67h56a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1Z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                    `,
                    afterQR: commonText(this.scaleArtboardY(75.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.TOP_BANNER:
                return {
                    beforeQR: `
                        <path d="M4 1h56a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                        <path d="m32.5 23-3.031-5.25h6.062z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="M6 25h52a3 3 0 0 1 3 3v52a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V28a3 3 0 0 1 3-3Z" transform="scale(${this.formatMetric(metrics.scale)})" fill="none" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                        ${qrBackground}
                    `,
                    afterQR: commonText(this.scaleArtboardY(9.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.SKETCH_BORDER:
                return {
                    beforeQR: `
                        <path d="M49.392 6.206a.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.83l4.02-3.013a.57.57 0 0 1 .816.122c.2.263.14.627-.12.829l-4.02 3.013a.54.54 0 0 1-.338.122M22.233 8.674H12.41l-1.134.849a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.58.58 0 0 1-.038-.666.6.6 0 0 0 .356.12c.12 0 .239-.041.338-.122l4.021-3.014a.61.61 0 0 0 .12-.829.59.59 0 0 0-.817-.121l-4.02 3.013a.61.61 0 0 0-.087.87H8.61C7.176 8.653 6 9.826 6 11.303v8.141l-3.881 2.9a.593.593 0 0 0-.12.83.59.59 0 0 0 .478.242c.12.02.239-.02.338-.121l7.066-5.279a.61.61 0 0 0 .12-.829.57.57 0 0 0-.816-.121l-.577.43v-6.193h16.765q.029.096.094.181a.59.59 0 0 0 .477.243c.12 0 .259-.04.338-.121l4.021-3.014a.593.593 0 0 0 .12-.829.59.59 0 0 0-.816-.121l-1.35 1.011h-2.83l-3.205 2.427a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.585.585 0 0 1-.022-.675.6.6 0 0 0 .34.108c.12 0 .24-.04.34-.121l7.065-5.279a.593.593 0 0 0 .12-.829.57.57 0 0 0-.817-.121z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="M.588 46.431a.59.59 0 0 1-.478-.242.61.61 0 0 1 .12-.83L6 41.031V26.288l1.891-1.415a.593.593 0 0 0-.004-.953.6.6 0 0 1-.135.144l-2.468 1.86a.64.64 0 0 1-.358.122.53.53 0 0 1-.458-.243.593.593 0 0 1 .12-.83L6 23.91v-2.09l2.608-1.942V58.83h46.714V27.522l2.607-1.941v2.308l3.901-2.915a.57.57 0 0 1 .816.12c.2.264.14.628-.12.83l-4.816 3.6a.54.54 0 0 1-.338.121.6.6 0 0 1-.367-.127.59.59 0 0 0 .009.694.59.59 0 0 0 .477.243c.12 0 .24-.04.339-.122l.12-.08v14.481l1.213-.911a.57.57 0 0 1 .816.121c.2.263.14.627-.12.83l-2.746 2.062c-.1.101-.219.121-.338.121a.6.6 0 0 1-.354-.117.585.585 0 0 0 .016.684.59.59 0 0 0 .477.242.54.54 0 0 0 .339-.12l.716-.527v2.25l5.096-3.808a.57.57 0 0 1 .816.122.59.59 0 0 1-.12.829l-7.065 5.279a.54.54 0 0 1-.339.12.6.6 0 0 1-.35-.114.58.58 0 0 0 .031.661.59.59 0 0 0 .478.243c.12 0 .239-.04.338-.121l1.115-.83v15.412l4.479-3.358a.57.57 0 0 1 .816.121.593.593 0 0 1-.12.83l-6.15 4.61a.54.54 0 0 1-.338.122.6.6 0 0 1-.341-.108.585.585 0 0 0 .022.674.59.59 0 0 0 .478.243c.12 0 .238-.04.338-.121l.816-.647v4.59c0 1.477-1.174 2.65-2.607 2.65H53.57l1.254-.95a.593.593 0 0 0-.01-.956.6.6 0 0 1-.149.166l-5.553 4.166a.38.38 0 0 1-.338.121.59.59 0 0 1-.478-.242.593.593 0 0 1 .12-.83l1.966-1.475H33.867l.438-.324a.593.593 0 0 0-.01-.955.6.6 0 0 1-.15.166l-7.065 5.279a.38.38 0 0 1-.339.121.59.59 0 0 1-.477-.242.593.593 0 0 1 .119-.83l4.305-3.215H11.913l1.532-1.133a.593.593 0 0 0-.011-.956.6.6 0 0 1-.147.167L6.22 80.124a.54.54 0 0 1-.339.122.59.59 0 0 1-.477-.243.61.61 0 0 1 .12-.83l3.193-2.385h-.11C7.155 76.788 6 75.595 6 74.138v-8.675l1.414-1.052a.593.593 0 0 0-.01-.957.6.6 0 0 1-.15.168l-2.747 2.063a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.829l2.19-1.644V47.584l1.512-1.132a.61.61 0 0 0 .12-.83.6.6 0 0 0-.123-.122.6.6 0 0 1-.156.183l-2.767 2.063a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.593.593 0 0 1 .12-.83l2.11-1.573v-1.804l2.13-1.597a.61.61 0 0 0 .119-.83.6.6 0 0 0-.125-.124.6.6 0 0 1-.134.144L.926 46.31a.54.54 0 0 1-.338.121" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="M53.551 27.845a.59.59 0 0 1-.477-.242.593.593 0 0 1 .12-.83l2.189-1.639V11.303h-5.334l3.543-2.65h1.79c1.454 0 2.608 1.193 2.608 2.65v11.879l1.632-1.222a.57.57 0 0 1 .816.122c.2.262.14.627-.12.829l-6.428 4.813a.54.54 0 0 1-.339.121M2.02 79.154a.59.59 0 0 0 .478.243c.12 0 .24-.02.339-.121l2.766-2.063a.61.61 0 0 0 .12-.83.59.59 0 0 0-.816-.12L2.14 78.324a.593.593 0 0 0-.12.83m45.062-67.285a.59.59 0 0 0 .478.242c.12 0 .239-.02.338-.101l5.852-4.389a.593.593 0 0 0 .12-.829.59.59 0 0 0-.817-.121l-2.655 1.982H30.662c.12.243.04.546-.179.728l-2.588 1.922h19.11a.58.58 0 0 0 .077.565M33.329 6.206a.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.83l1.353-1.01a.57.57 0 0 1 .816.121c.2.263.14.627-.12.83l-1.353 1.01a.54.54 0 0 1-.338.122m-.736 74.364a.59.59 0 0 0 .478.242c.14 0 .259-.04.338-.122l1.354-1.01a.593.593 0 0 0 .12-.83.59.59 0 0 0-.817-.121l-1.353 1.01a.593.593 0 0 0-.12.83" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${qrBackground}
                    `,
                    afterQR: commonText(this.scaleArtboardY(67.765, metrics), '#ffffff')
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
        // Only filled shell-style frames need their outer art drawn before the QR background and QR modules.
        if (frameType === this.FRAME_TYPES.BOLD_BORDER) {
            this.drawBoldBorderShell(ctx, metrics);
        } else if (frameType === this.FRAME_TYPES.CENTERED_QR) {
            this.drawCenteredQRFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        }

        if (metrics.qrBackground) {
            ctx.fillStyle = this.QR_BACKGROUND_COLOR;
            this.roundRect(
                ctx,
                metrics.qrBackground.x,
                metrics.qrBackground.y,
                metrics.qrBackground.width,
                metrics.qrBackground.height,
                metrics.qrBackground.radius
            );
            ctx.fill();
        }

        if (metrics.qrBounds) {
            ctx.drawImage(
                canvas,
                metrics.qrBounds.x,
                metrics.qrBounds.y,
                metrics.qrBounds.size,
                metrics.qrBounds.size
            );
        }

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
            case this.FRAME_TYPES.BOLD_BORDER:
                this.drawBoldBorderLabel(ctx, metrics);
                break;
            case this.FRAME_TYPES.CENTERED_QR:
                this.drawCenteredQRFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.BOX_POINTER:
                this.drawBoxPointerFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.TOP_BANNER:
                this.drawTopBannerFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.SKETCH_BORDER:
                this.drawSketchBorderFrame(ctx, metrics);
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
        ctx.lineTo(this.scaleArtboardX(35.531, metrics), this.scaleArtboardY(67, metrics));
        ctx.lineTo(this.scaleArtboardX(29.47, metrics), this.scaleArtboardY(67, metrics));
        ctx.closePath();
        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.fill();

        this.bottomRoundedRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(67, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(16, metrics),
            metrics.outerRadius
        );
        ctx.fill();
        ctx.stroke();

        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(75.765, metrics), '#ffffff');
    },

    drawBoldBorderShell(ctx, metrics) {
        this.drawArtboardPath(ctx, metrics, this.BOLD_BORDER_PATH, {
            fill: this.FRAME_FOREGROUND_COLOR
        });
    },

    drawBoldBorderLabel(ctx, metrics) {
        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(73.765, metrics), '#ffffff');
    },

    drawCenteredQRFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.CENTERED_QR_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            return;
        }

        this.drawArtboardPath(ctx, metrics, this.CENTERED_QR_RIP_PATH, {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(68.765, metrics), this.FRAME_FOREGROUND_COLOR);
    },

    drawBoxPointerFrame(ctx, metrics) {
        this.drawArtboardPath(ctx, metrics, 'M6 1h52a3 3 0 0 1 3 3v52a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z', {
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawArtboardPath(ctx, metrics, 'm32.5 61 3.031 5.25H29.47z', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, 'M4 67h56a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1Z', {
            fill: this.FRAME_FOREGROUND_COLOR,
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(75.765, metrics), '#ffffff');
    },

    drawTopBannerFrame(ctx, metrics) {
        this.drawArtboardPath(ctx, metrics, 'M4 1h56a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z', {
            fill: this.FRAME_FOREGROUND_COLOR,
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawArtboardPath(ctx, metrics, 'm32.5 23-3.031-5.25h6.062z', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, 'M6 25h52a3 3 0 0 1 3 3v52a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V28a3 3 0 0 1 3-3Z', {
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(9.765, metrics), '#ffffff');
    },

    drawSketchBorderFrame(ctx, metrics) {
        this.drawArtboardPath(ctx, metrics, 'M49.392 6.206a.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.83l4.02-3.013a.57.57 0 0 1 .816.122c.2.263.14.627-.12.829l-4.02 3.013a.54.54 0 0 1-.338.122M22.233 8.674H12.41l-1.134.849a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.58.58 0 0 1-.038-.666.6.6 0 0 0 .356.12c.12 0 .239-.041.338-.122l4.021-3.014a.61.61 0 0 0 .12-.829.59.59 0 0 0-.817-.121l-4.02 3.013a.61.61 0 0 0-.087.87H8.61C7.176 8.653 6 9.826 6 11.303v8.141l-3.881 2.9a.593.593 0 0 0-.12.83.59.59 0 0 0 .478.242c.12.02.239-.02.338-.121l7.066-5.279a.61.61 0 0 0 .12-.829.57.57 0 0 0-.816-.121l-.577.43v-6.193h16.765q.029.096.094.181a.59.59 0 0 0 .477.243c.12 0 .259-.04.338-.121l4.021-3.014a.593.593 0 0 0 .12-.829.59.59 0 0 0-.816-.121l-1.35 1.011h-2.83l-3.205 2.427a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.585.585 0 0 1-.022-.675.6.6 0 0 0 .34.108c.12 0 .24-.04.34-.121l7.065-5.279a.593.593 0 0 0 .12-.829.57.57 0 0 0-.817-.121z', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, 'M.588 46.431a.59.59 0 0 1-.478-.242.61.61 0 0 1 .12-.83L6 41.031V26.288l1.891-1.415a.593.593 0 0 0-.004-.953.6.6 0 0 1-.135.144l-2.468 1.86a.64.64 0 0 1-.358.122.53.53 0 0 1-.458-.243.593.593 0 0 1 .12-.83L6 23.91v-2.09l2.608-1.942V58.83h46.714V27.522l2.607-1.941v2.308l3.901-2.915a.57.57 0 0 1 .816.12c.2.264.14.628-.12.83l-4.816 3.6a.54.54 0 0 1-.338.121.6.6 0 0 1-.367-.127.59.59 0 0 0 .009.694.59.59 0 0 0 .477.243c.12 0 .24-.04.339-.122l.12-.08v14.481l1.213-.911a.57.57 0 0 1 .816.121c.2.263.14.627-.12.83l-2.746 2.062c-.1.101-.219.121-.338.121a.6.6 0 0 1-.354-.117.585.585 0 0 0 .016.684.59.59 0 0 0 .477.242.54.54 0 0 0 .339-.12l.716-.527v2.25l5.096-3.808a.57.57 0 0 1 .816.122.59.59 0 0 1-.12.829l-7.065 5.279a.54.54 0 0 1-.339.12.6.6 0 0 1-.35-.114.58.58 0 0 0 .031.661.59.59 0 0 0 .478.243c.12 0 .239-.04.338-.121l1.115-.83v15.412l4.479-3.358a.57.57 0 0 1 .816.121.593.593 0 0 1-.12.83l-6.15 4.61a.54.54 0 0 1-.338.122.6.6 0 0 1-.341-.108.585.585 0 0 0 .022.674.59.59 0 0 0 .478.243c.12 0 .238-.04.338-.121l.816-.647v4.59c0 1.477-1.174 2.65-2.607 2.65H53.57l1.254-.95a.593.593 0 0 0-.01-.956.6.6 0 0 1-.149.166l-5.553 4.166a.38.38 0 0 1-.338.121.59.59 0 0 1-.478-.242.593.593 0 0 1 .12-.83l1.966-1.475H33.867l.438-.324a.593.593 0 0 0-.01-.955.6.6 0 0 1-.15.166l-7.065 5.279a.38.38 0 0 1-.339.121.59.59 0 0 1-.477-.242.593.593 0 0 1 .119-.83l4.305-3.215H11.913l1.532-1.133a.593.593 0 0 0-.011-.956.6.6 0 0 1-.147.167L6.22 80.124a.54.54 0 0 1-.339.122.59.59 0 0 1-.477-.243.61.61 0 0 1 .12-.83l3.193-2.385h-.11C7.155 76.788 6 75.595 6 74.138v-8.675l1.414-1.052a.593.593 0 0 0-.01-.957.6.6 0 0 1-.15.168l-2.747 2.063a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.829l2.19-1.644V47.584l1.512-1.132a.61.61 0 0 0 .12-.83.6.6 0 0 0-.123-.122.6.6 0 0 1-.156.183l-2.767 2.063a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.593.593 0 0 1 .12-.83l2.11-1.573v-1.804l2.13-1.597a.61.61 0 0 0 .119-.83.6.6 0 0 0-.125-.124.6.6 0 0 1-.134.144L.926 46.31a.54.54 0 0 1-.338.121', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, 'M53.551 27.845a.59.59 0 0 1-.477-.242.593.593 0 0 1 .12-.83l2.189-1.639V11.303h-5.334l3.543-2.65h1.79c1.454 0 2.608 1.193 2.608 2.65v11.879l1.632-1.222a.57.57 0 0 1 .816.122c.2.262.14.627-.12.829l-6.428 4.813a.54.54 0 0 1-.339.121M2.02 79.154a.59.59 0 0 0 .478.243c.12 0 .24-.02.339-.121l2.766-2.063a.61.61 0 0 0 .12-.83.59.59 0 0 0-.816-.12L2.14 78.324a.593.593 0 0 0-.12.83m45.062-67.285a.59.59 0 0 0 .478.242c.12 0 .239-.02.338-.101l5.852-4.389a.593.593 0 0 0 .12-.829.59.59 0 0 0-.817-.121l-2.655 1.982H30.662c.12.243.04.546-.179.728l-2.588 1.922h19.11a.58.58 0 0 0 .077.565M33.329 6.206a.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.83l1.353-1.01a.57.57 0 0 1 .816.121c.2.263.14.627-.12.83l-1.353 1.01a.54.54 0 0 1-.338.122m-.736 74.364a.59.59 0 0 0 .478.242c.14 0 .259-.04.338-.122l1.354-1.01a.593.593 0 0 0 .12-.83.59.59 0 0 0-.817-.121l-1.353 1.01a.593.593 0 0 0-.12.83', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(67.765, metrics), '#ffffff');
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

    drawArtboardPath(ctx, metrics, pathData, options = {}) {
        const path = new Path2D(pathData);
        ctx.save();
        ctx.scale(metrics.scale, metrics.scale);

        if (options.fill) {
            ctx.fillStyle = options.fill;
            ctx.fill(path);
        }

        if (options.stroke) {
            ctx.strokeStyle = options.stroke;
            ctx.lineWidth = options.lineWidth || 2;
            ctx.stroke(path);
        }

        ctx.restore();
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
