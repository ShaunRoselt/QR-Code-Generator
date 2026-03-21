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
    FRAME_FONT_DEFAULT: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    FRAME_FONT_SCRIPT: 'cursive',
    RENDER_PHASES: {
        BEFORE: 'before',
        AFTER: 'after'
    },
    // Path data authored against the shared 64x84 decorative frame artboard.
    BOLD_BORDER_PATH: 'M64 3.815v76.27a1.3 1.3 0 0 1-.498.301c-1.572.382-2.568 1.345-2.926 2.911-.16.703-.677.683-1.234.683H40.61c-11.885 0-23.789 0-35.693.02-.816 0-1.254-.2-1.473-1.044a3.16 3.16 0 0 0-2.409-2.43C.2 80.307 0 79.865 0 79.042.02 54.327.02 29.633 0 4.92c0-.843.18-1.345 1.055-1.566 1.254-.321 2.03-1.185 2.389-2.45.06-.32.219-.642.418-.903h56.336c.04.06.1.1.12.16.378 1.968 1.552 3.153 3.503 3.534.08.02.14.08.179.12',
    CENTERED_QR_FRAME_PATH: 'M-2 4a6 6 0 0 1 6-6h56a6 6 0 0 1 6 6h-4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zm66 74H0zm-66 0V4a6 6 0 0 1 6-6v4a2 2 0 0 0-2 2v74zM60-2a6 6 0 0 1 6 6v74h-4V4a2 2 0 0 0-2-2z',
    CENTERED_QR_RIP_PATH: 'M3.016 83.259 0 78l1.767-1 2.574 4.66 2.132-3.86c.546-.989 2.105-.989 2.65 0l2.133 3.86 2.132-3.86c.546-.989 2.104-.989 2.65 0l2.133 3.86 2.131-3.86c.547-.989 2.105-.989 2.651 0l2.132 3.86 2.132-3.86c.546-.989 2.105-.989 2.65 0L32 81.66l2.132-3.86c.546-.989 2.105-.989 2.65 0l2.133 3.86 2.132-3.86c.546-.989 2.104-.989 2.65 0l2.133 3.86 2.132-3.86c.546-.989 2.104-.989 2.65 0l2.132 3.86 2.132-3.86c.546-.989 2.105-.989 2.651 0l2.132 3.86L62.233 77 64 78l-3.016 5.259c-.546.988-2.104.988-2.65 0l-2.132-3.86-2.132 3.86c-.546.988-2.105.988-2.651 0l-2.132-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.104.988-2.65 0l-2.132-3.86-2.133 3.86c-.546.988-2.104.988-2.65 0l-2.132-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.104.988-2.65 0',
    VIDEO_ICON_PATH: 'M13.9917 72.9938C13.8958 72.6354 13.6146 72.3542 13.2563 72.2583C12.6083 72.0833 10 72.0833 10 72.0833C10 72.0833 7.39375 72.0833 6.74375 72.2583C6.38542 72.3542 6.10417 72.6354 6.00834 72.9938C5.8875 73.6563 5.82917 74.3271 5.83334 75C5.82917 75.6729 5.8875 76.3438 6.00834 77.0063C6.10417 77.3646 6.38542 77.6458 6.74375 77.7417C7.39167 77.9167 10 77.9167 10 77.9167C10 77.9167 12.6063 77.9167 13.2563 77.7417C13.6146 77.6458 13.8958 77.3646 13.9917 77.0063C14.1125 76.3438 14.1708 75.6729 14.1667 75C14.1708 74.3271 14.1125 73.6563 13.9917 72.9938ZM9.16667 76.25V73.75L11.3313 75L9.16667 76.25Z',
    PHONE_FRAME_PATH: 'M8 0a4 4 0 0 0-4 4v76a4 4 0 0 0 4 4h48a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4zm15 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zm6 0a1 1 0 1 0 0 2h11a1 1 0 1 0 0-2zm6 72a3 3 0 1 1-6 0 3 3 0 0 1 6 0M7 11a2 2 0 0 1 2-2h46a2 2 0 0 1 2 2v56a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z',
    CORNER_ACCENT_PATH_PRIMARY: 'M59.78 10.864H64l-.04 1.122h-3.54c.1.2.18.421.26.662a.568.568 0 1 1-1.08.36 4.8 4.8 0 0 0-.66-1.362l-.005-.007c-1.075-1.417-1.166-1.537-8.015-1.537H48.9a.76.76 0 0 0 0 1.523.581.581 0 0 1 0 1.163.76.76 0 0 0 0 1.524.581.581 0 0 1 0 1.162.76.76 0 0 0-.76.762c0 .36.24.661.58.741h.2c.32 0 .58.26.58.582q0 .12-.06.24c-.1.22-.3.36-.54.36-.1 0-.2 0-.3-.02H44c-.36 0-.74.281-.74.762 0 .482.3.822.74.822h7.56c1 0 1.74.26 2.2.742.36.4.54.922.5 1.523a24 24 0 0 1-.086 1.306l-.034.418c-.08.962-.14 1.724-.06 2.225.08.38.2.5.54.561.54.08.8-.4 1.36-2.065l.085-.25c.178-.521.377-1.105.635-1.674.26-.56.718-.8 1.137-1.02l.003-.002c.4-.2.78-.42 1.12-.882.72-.982 1.02-2.666 1.02-2.686a.57.57 0 0 1 .66-.46c.3.04.52.34.46.66 0 .04-.14.782-.44 1.624H64v1.163h-3.86c-.046.124-.117.224-.183.318q-.03.041-.057.083c-.5.701-1.08 1.002-1.52 1.222-.34.18-.52.281-.6.461-.24.531-.42 1.062-.592 1.568l-.088.256-.1.28c-.235.665-.441 1.247-.74 1.705-.38.58-.88.881-1.48.881-.1 0-.22 0-.32-.02-.82-.12-1.32-.62-1.48-1.483-.12-.641-.06-1.483.04-2.525.04-.501.08-1.083.12-1.684 0-.3-.06-.5-.2-.661-.24-.26-.7-.381-1.36-.381H44c-1.08 0-1.9-.842-1.9-1.964 0-1.063.86-1.925 1.9-1.925h3.14a2.2 2.2 0 0 1-.14-.741c0-.521.22-1.002.56-1.343-.34-.34-.56-.822-.56-1.343s.22-1.002.56-1.343c-.34-.34-.56-.822-.56-1.343C47 9.862 47.86 9 48.92 9h2.02c3.72 0 5.46.04 6.58.28 1.22.281 1.68.822 2.26 1.584M8.9 51.813c0 .32.26.581.58.581s.56-.26.56-.56v-31.37c0-.42.26-.762.6-.762h27.72a.581.581 0 0 0 0-1.162h-27.7c-.98 0-1.76.862-1.76 1.904zM25.64 64.84h27.7c.98 0 1.76-.862 1.76-1.904V31.568a.581.581 0 1 0-1.16 0v31.348c0 .42-.26.761-.6.761h-27.7a.581.581 0 0 0 0 1.163',
    CORNER_ACCENT_PATH_SECONDARY: 'M20 62.174h-7.58c-.66 0-1.12-.12-1.36-.38-.14-.161-.2-.361-.2-.662.04-.601.08-1.183.12-1.684.1-1.042.16-1.884.04-2.525-.16-.862-.66-1.363-1.48-1.483-.74-.12-1.36.18-1.8.861-.299.458-.505 1.04-.74 1.704l-.1.28-.088.257a17 17 0 0 1-.592 1.568c-.08.18-.26.28-.6.46-.44.221-1.02.522-1.52 1.223l-.049.073a3 3 0 0 0-.191.308H0v1.163h3.34c-.3.841-.44 1.583-.44 1.623a.57.57 0 1 0 1.12.2c0-.02.3-1.703 1.02-2.685.34-.461.72-.682 1.12-.882l.003-.002c.419-.22.878-.46 1.137-1.02.258-.57.457-1.153.635-1.675l.085-.25c.56-1.663.82-2.144 1.36-2.064.34.06.46.18.54.561.08.501.02 1.263-.06 2.225q-.023.295-.052.61c-.03.346-.063.715-.088 1.114-.04.601.14 1.122.5 1.523.46.481 1.2.742 2.2.742H20c.44 0 .74.34.74.822 0 .48-.38.761-.74.761h-4.6c-.1-.02-.2-.02-.3-.02h-4.22a1.923 1.923 0 0 0-.96 3.588c-.2.3-.3.661-.3 1.042 0 .662.34 1.243.84 1.584-.22.32-.34.701-.34 1.102 0 .26.06.521.16.762-4.086-.06-4.299-.34-5.191-1.512l-.009-.012a4.8 4.8 0 0 1-.66-1.363.568.568 0 1 0-1.08.36c.08.242.16.442.26.663H0v1.162h4.22c.56.762 1.04 1.303 2.26 1.583 1 .221 2.5.281 5.46.281h3.14c1.06 0 1.92-.862 1.92-1.924 0-.521-.22-1.002-.56-1.343.34-.34.56-.822.56-1.343s-.22-1.002-.56-1.343c.34-.34.56-.822.56-1.343 0-.26-.06-.52-.14-.741H20c1.04 0 1.9-.862 1.9-1.925 0-1.182-.82-2.024-1.9-2.024m-4.14 7.316a.76.76 0 0 1-.76.762h-3.58a.76.76 0 0 1 0-1.524h3.56c.44 0 .78.341.78.762m-.78 3.468H12c-.4-.02-.74-.361-.74-.762a.76.76 0 0 1 .76-.762h3.08a.76.76 0 1 1-.02 1.523m.78-6.154a.76.76 0 0 1-.76.762h-4.24a.76.76 0 0 1 0-1.523h4.04c.06.02.1.02.16.02h.2c.36.08.6.38.6.741',
    BAG_FRAME_PATH: 'M59.123 17.153c0-2.303-1.857-4.153-4.128-4.153H8.024c-2.29 0-4.129 1.869-4.129 4.153L2 75.847C2 78.15 3.858 80 6.129 80H56.87c2.292 0 4.13-1.869 4.13-4.153zm-52.788 0c0-.925.75-1.699 1.689-1.699h46.97a1.7 1.7 0 0 1 1.69 1.7v48.951H6.334z',
    BAG_HANDLE_LEFT_PATH: 'm22.81 3.02-4.69 4.663v9.93h4.69z',
    BAG_HANDLE_RIGHT_PATH: 'm40.188 3.02 4.692 4.663v9.93h-4.692z',
    BAG_HANDLE_SHADOW_PATH: 'M40.188 3H22.81v4.72h17.377z',
    GIFT_FRAME_PATH: 'M56.525 20.57v49.175H7.475V20.569zm0-2.425H7.475a2.395 2.395 0 0 0-2.4 2.406v49.175a2.395 2.395 0 0 0 2.4 2.405h49.069c1.331 0 2.4-1.07 2.4-2.405V20.569a2.427 2.427 0 0 0-2.419-2.424',
    GIFT_TEXT_CONTAINER_PATH: 'M56.525 81.546H7.475a2.395 2.395 0 0 1-2.4-2.406v-9.094h53.887v9.094a2.44 2.44 0 0 1-2.437 2.406',
    BOW_SHADOW_PATH: 'M62.094 18.333v.921l-12.619-.094c.112.77.075 1.635-.375 2.48-.506.94-1.613 2.067-3.994 2.067-3.15 0-7.443-2.048-9.956-4.171a2.9 2.9 0 0 1-1.612.507h-2.25a2.77 2.77 0 0 1-1.594-.507c-2.494 2.104-6.806 4.171-9.956 4.171-2.382 0-3.488-1.127-3.994-2.067-.45-.845-.488-1.71-.375-2.48l-13.481.113.077-.94 30.258-2.482z',
    BOW_LEFT_RIBBON_PATH: 'M20.9 8.205s-13.875-.507-18-.113c2.175 1.973 4.144 4.623 4.144 4.623l-5.081 5.618 22.275-.15c-.507-2.01-3.338-9.978-3.338-9.978',
    BOW_RIGHT_RIBBON_PATH: 'M43.156 8.205s13.875-.507 18-.113c-2.175 1.973-4.143 4.623-4.143 4.623l5.08 5.618-22.274-.15c.525-2.01 3.337-9.978 3.337-9.978',
    BOW_LEFT_SOLID_PATH: 'M30.594 8.487s-6.225-5.374-10.95-5.337c-4.725.038-4.444 3.007-4.238 3.852.356 1.504 2.175 5.187 2.175 7.216s-2.137 4.735-1.031 6.915c2.25 4.397 12.188-.958 14.044-4.153 1.837-3.194 0-8.493 0-8.493',
    BOW_RIGHT_SOLID_PATH: 'M34.269 8.487s6.225-5.374 10.95-5.337c4.725.038 4.444 2.988 4.237 3.834-.356 1.503-2.175 5.186-2.175 7.215s2.157 4.754 1.032 6.934c-2.25 4.397-12.188-.958-14.044-4.153s0-8.493 0-8.493',
    BOW_LEFT_SHADOW_PATH: 'M28.006 8.618S20 2.85 17.675 5.255c-2.569 2.687 10.331 3.363 10.331 3.363',
    BOW_RIGHT_SHADOW_PATH: 'M36.838 8.618s8.006-5.768 10.33-3.363c2.588 2.687-10.33 3.363-10.33 3.363',
    BOW_KNOT_PATH: 'M31.306 7.867h2.25a1.93 1.93 0 0 1 1.931 1.935v7.235a1.93 1.93 0 0 1-1.93 1.935h-2.25a1.93 1.93 0 0 1-1.932-1.935V9.783c0-1.052.863-1.916 1.931-1.916',
    POINTER_PANEL_TRIANGLE_POINTS: {
        tip: { x: 32.5, y: 61 },
        right: { x: 35.531, y: 67 },
        left: { x: 29.47, y: 67 }
    },

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
        SKETCH_BORDER: 'sketch-border',
        SCRIPT_CARD: 'script-card',
        VIDEO_PANEL: 'video-panel',
        PHONE_SCREEN: 'phone-screen',
        ARROW_NOTE: 'arrow-note',
        CORNER_ACCENT: 'corner-accent',
        BAG_TAG: 'bag-tag',
        GIFT_BOW: 'gift-bow'
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
            },
            {
                id: this.FRAME_TYPES.SCRIPT_CARD,
                name: 'Script Card'
            },
            {
                id: this.FRAME_TYPES.VIDEO_PANEL,
                name: 'Video Panel'
            },
            {
                id: this.FRAME_TYPES.PHONE_SCREEN,
                name: 'Phone Screen'
            },
            {
                id: this.FRAME_TYPES.ARROW_NOTE,
                name: 'Arrow Note'
            },
            {
                id: this.FRAME_TYPES.CORNER_ACCENT,
                name: 'Corner Accent'
            },
            {
                id: this.FRAME_TYPES.BAG_TAG,
                name: 'Bag Tag'
            },
            {
                id: this.FRAME_TYPES.GIFT_BOW,
                name: 'Gift Bow'
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
            this.FRAME_TYPES.SKETCH_BORDER,
            this.FRAME_TYPES.SCRIPT_CARD,
            this.FRAME_TYPES.VIDEO_PANEL,
            this.FRAME_TYPES.PHONE_SCREEN,
            this.FRAME_TYPES.ARROW_NOTE,
            this.FRAME_TYPES.CORNER_ACCENT,
            this.FRAME_TYPES.BAG_TAG,
            this.FRAME_TYPES.GIFT_BOW
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
            qrInset: isBorderFrame ? Math.max(4, Math.round(size * 0.04)) : 0,
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
            case this.FRAME_TYPES.PHONE_SCREEN:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    qrBackground: { x: 10, y: 12, width: 44, height: 44, radius: 2 },
                    qrBounds: { x: 15, y: 17, size: 34 }
                };
            case this.FRAME_TYPES.CORNER_ACCENT:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    qrBackground: { x: 14.5, y: 24, width: 35, height: 35, radius: 2 },
                    qrBounds: { x: 20, y: 29.5, size: 24 }
                };
            case this.FRAME_TYPES.BAG_TAG:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    qrBackground: { x: 10, y: 19.5, width: 43, height: 43, radius: 2 },
                    qrBounds: { x: 16.5, y: 26, size: 30 }
                };
            case this.FRAME_TYPES.GIFT_BOW:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    qrBackground: { x: 11, y: 24, width: 42, height: 42, radius: 2 },
                    qrBounds: { x: 17, y: 30, size: 30 }
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
        const qrRenderSize = frameType === this.FRAME_TYPES.SCAN_ME_BORDER
            ? size - (metrics.qrInset * 2)
            : size;
        const qrOffset = frameType === this.FRAME_TYPES.SCAN_ME_BORDER ? metrics.qrInset : 0;
        const scaleX = qrRenderSize / sourceViewBox.width;
        const scaleY = qrRenderSize / sourceViewBox.height;
        const translateX = qrOffset - (sourceViewBox.minX * scaleX);
        const translateY = qrOffset - (sourceViewBox.minY * scaleY);
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
        const customText = ({
            x = metrics.size / 2,
            y,
            color,
            fontSize = metrics.fontSize,
            fontWeight = '700',
            fontFamily = 'var(--font-frame-default)',
            rotation,
            rotateX = x,
            rotateY = y
        }) => `
            <text x="${this.formatMetric(x)}" y="${this.formatMetric(y)}" text-anchor="middle" dominant-baseline="middle" font-size="${this.formatMetric(fontSize)}" font-weight="${fontWeight}" font-family="${fontFamily}" fill="${color}"${rotation !== undefined ? ` transform="rotate(${rotation} ${this.formatMetric(rotateX)} ${this.formatMetric(rotateY)})"` : ''}>${this.FRAME_TEXT}</text>
        `;
        const commonText = (textY, color) => customText({ y: textY, color });

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
                        <path d="${this.getPointerPanelTrianglePath(metrics)}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}" fill="none"></path>
                        <path d="${this.getBottomRoundedRectPath(this.scaleArtboardX(1, metrics), this.scaleArtboardY(68, metrics), this.scaleArtboardX(62, metrics), this.scaleArtboardY(14, metrics), this.scaleArtboardY(1, metrics))}" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}"></path>
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
            case this.FRAME_TYPES.SCRIPT_CARD:
                return {
                    beforeQR: `
                        <rect x="0" y="0" width="${this.formatMetric(metrics.size)}" height="${this.formatMetric(metrics.totalHeight)}" rx="${this.scaleArtboardY(4, metrics)}" fill="${this.FRAME_BACKGROUND_COLOR}"></rect>
                        ${qrBackground}
                    `,
                    afterQR: customText({
                        y: this.scaleArtboardY(72.7, metrics),
                        color: this.FRAME_FOREGROUND_COLOR,
                        fontSize: this.scaleArtboardY(20, metrics),
                        fontWeight: '400',
                        fontFamily: 'var(--font-frame-cursive), var(--font-frame-cursive-fallback)'
                    })
                };
            case this.FRAME_TYPES.VIDEO_PANEL:
                return {
                    beforeQR: `
                        <path d="M4 1h56a3 3 0 0 1 3 3v56a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z" transform="scale(${this.formatMetric(metrics.scale)})" fill="none" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                        ${qrBackground}
                        <path d="M2 67h60a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="M2 67h60a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1Z" transform="scale(${this.formatMetric(metrics.scale)})" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                    `,
                    afterQR: `
                        <path d="${this.VIDEO_ICON_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#ffffff"></path>
                        ${customText({
                            x: this.scaleArtboardX(39, metrics),
                            y: this.scaleArtboardY(75.765, metrics),
                            color: '#ffffff',
                            fontSize: this.scaleArtboardY(9, metrics)
                        })}
                    `
                };
            case this.FRAME_TYPES.PHONE_SCREEN:
                return {
                    beforeQR: `
                        <path d="${this.PHONE_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-rule="evenodd"></path>
                        ${qrBackground}
                    `,
                    afterQR: customText({
                        y: this.scaleArtboardY(63.18, metrics),
                        color: this.FRAME_FOREGROUND_COLOR,
                        fontSize: this.scaleArtboardY(8, metrics)
                    })
                };
            case this.FRAME_TYPES.ARROW_NOTE:
                return {
                    beforeQR: `
                        <rect x="0" y="0" width="${this.formatMetric(metrics.size)}" height="${this.formatMetric(metrics.totalHeight)}" rx="${this.scaleArtboardY(4, metrics)}" fill="${this.FRAME_BACKGROUND_COLOR}"></rect>
                        ${qrBackground}
                    `,
                    afterQR: `
                        <path d="M6.096 77.37s-3.764-5.443-1.203-11.627C6.01 63.022 7.539 61.8 7.539 61.8l-1.478.361-.24-.878s2.939-.379 3.643-.258c-.584 1.292-.859 3.324-.859 3.324l-.842-.086.447-1.809s-2.458 2.326-3.077 5.581c-1.048 5.495 1.255 9.198 1.255 9.198z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${customText({
                            x: this.scaleArtboardX(33, metrics),
                            y: this.scaleArtboardY(75.7, metrics),
                            color: this.FRAME_FOREGROUND_COLOR,
                            fontSize: this.scaleArtboardY(20, metrics),
                            fontWeight: '400',
                            fontFamily: 'var(--font-frame-cursive), var(--font-frame-cursive-fallback)',
                            rotation: -8.34,
                            rotateX: this.scaleArtboardX(16.5, metrics),
                            rotateY: this.scaleArtboardY(75.7, metrics)
                        })}
                    `
                };
            case this.FRAME_TYPES.CORNER_ACCENT:
                return {
                    beforeQR: `
                        <path d="${this.CORNER_ACCENT_PATH_PRIMARY}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.CORNER_ACCENT_PATH_SECONDARY}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-rule="evenodd"></path>
                        ${qrBackground}
                    `,
                    afterQR: customText({
                        x: this.scaleArtboardX(37, metrics),
                        y: this.scaleArtboardY(71.68, metrics),
                        color: this.FRAME_FOREGROUND_COLOR,
                        fontSize: this.scaleArtboardY(8, metrics)
                    })
                };
            case this.FRAME_TYPES.BAG_TAG:
                return {
                    beforeQR: `
                        <path d="${this.BAG_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.BAG_HANDLE_LEFT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.BAG_HANDLE_RIGHT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.BAG_HANDLE_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        ${qrBackground}
                    `,
                    afterQR: customText({
                        y: this.scaleArtboardY(73.765, metrics),
                        color: '#ffffff',
                        fontSize: this.scaleArtboardY(9, metrics)
                    })
                };
            case this.FRAME_TYPES.GIFT_BOW:
                return {
                    beforeQR: `
                        <path d="${this.GIFT_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.GIFT_TEXT_CONTAINER_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${qrBackground}
                        <path d="${this.BOW_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.BOW_LEFT_RIBBON_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.BOW_RIGHT_RIBBON_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.BOW_LEFT_SOLID_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.BOW_RIGHT_SOLID_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.BOW_LEFT_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.BOW_RIGHT_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.BOW_KNOT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                    `,
                    afterQR: customText({
                        y: this.scaleArtboardY(76.345, metrics),
                        color: '#ffffff',
                        fontSize: this.scaleArtboardY(7, metrics)
                    })
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
        if (frameType === this.FRAME_TYPES.SCAN_ME_BORDER) {
            const qrRenderSize = targetSize - (metrics.qrInset * 2);
            ctx.drawImage(canvas, metrics.qrInset, metrics.qrInset, qrRenderSize, qrRenderSize);
        } else {
            ctx.drawImage(canvas, 0, 0, targetSize, targetSize);
        }

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
        } else if (frameType === this.FRAME_TYPES.PHONE_SCREEN) {
            this.drawPhoneScreenFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.CORNER_ACCENT) {
            this.drawCornerAccentFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.BAG_TAG) {
            this.drawBagTagFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.GIFT_BOW) {
            this.drawGiftBowFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
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
            case this.FRAME_TYPES.SCRIPT_CARD:
                this.drawScriptCardFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.VIDEO_PANEL:
                this.drawVideoPanelFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.PHONE_SCREEN:
                this.drawPhoneScreenFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.ARROW_NOTE:
                this.drawArrowNoteFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.CORNER_ACCENT:
                this.drawCornerAccentFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.BAG_TAG:
                this.drawBagTagFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.GIFT_BOW:
                this.drawGiftBowFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
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

        const trianglePoints = this.getPointerPanelTriangleCoordinates(metrics);
        ctx.beginPath();
        ctx.moveTo(trianglePoints.tip.x, trianglePoints.tip.y);
        ctx.lineTo(trianglePoints.right.x, trianglePoints.right.y);
        ctx.lineTo(trianglePoints.left.x, trianglePoints.left.y);
        ctx.closePath();
        ctx.lineWidth = Math.max(1, metrics.strokeWidth);
        ctx.stroke();

        this.bottomRoundedRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(68, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(14, metrics),
            this.scaleArtboardY(1, metrics)
        );
        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
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

    drawScriptCardFrame(ctx, metrics) {
        ctx.fillStyle = this.FRAME_BACKGROUND_COLOR;
        this.roundRect(ctx, 0, 0, metrics.size, metrics.totalHeight, this.scaleArtboardY(4, metrics));
        ctx.fill();
        this.drawArtboardText(ctx, metrics, {
            y: 72.7,
            fontSize: 20,
            fontWeight: '400',
            fontFamily: this.FRAME_FONT_SCRIPT,
            color: this.FRAME_FOREGROUND_COLOR
        });
    },

    drawVideoPanelFrame(ctx, metrics) {
        this.drawArtboardPath(ctx, metrics, 'M4 1h56a3 3 0 0 1 3 3v56a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z', {
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawArtboardPath(ctx, metrics, 'M2 67h60a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, 'M2 67h60a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1Z', {
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawArtboardPath(ctx, metrics, this.VIDEO_ICON_PATH, {
            fill: '#ffffff'
        });
        this.drawArtboardText(ctx, metrics, {
            x: 39,
            y: 75.765,
            fontSize: 9,
            color: '#ffffff'
        });
    },

    drawPhoneScreenFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.PHONE_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                fillRule: 'evenodd'
            });
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            y: 63.18,
            fontSize: 8,
            color: this.FRAME_FOREGROUND_COLOR
        });
    },

    drawArrowNoteFrame(ctx, metrics) {
        ctx.fillStyle = this.FRAME_BACKGROUND_COLOR;
        this.roundRect(ctx, 0, 0, metrics.size, metrics.totalHeight, this.scaleArtboardY(4, metrics));
        ctx.fill();
        this.drawArtboardPath(ctx, metrics, 'M6.096 77.37s-3.764-5.443-1.203-11.627C6.01 63.022 7.539 61.8 7.539 61.8l-1.478.361-.24-.878s2.939-.379 3.643-.258c-.584 1.292-.859 3.324-.859 3.324l-.842-.086.447-1.809s-2.458 2.326-3.077 5.581c-1.048 5.495 1.255 9.198 1.255 9.198z', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardText(ctx, metrics, {
            x: 33,
            y: 75.7,
            fontSize: 20,
            fontWeight: '400',
            fontFamily: this.FRAME_FONT_SCRIPT,
            color: this.FRAME_FOREGROUND_COLOR,
            rotation: -8.34,
            rotateX: 16.5,
            rotateY: 75.7
        });
    },

    drawCornerAccentFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.CORNER_ACCENT_PATH_PRIMARY, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.CORNER_ACCENT_PATH_SECONDARY, {
                fill: this.FRAME_FOREGROUND_COLOR,
                fillRule: 'evenodd'
            });
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            x: 37,
            y: 71.68,
            fontSize: 8,
            color: this.FRAME_FOREGROUND_COLOR
        });
    },

    drawBagTagFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.BAG_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BAG_HANDLE_LEFT_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BAG_HANDLE_RIGHT_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BAG_HANDLE_SHADOW_PATH, {
                fill: '#84868E'
            });
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            y: 73.765,
            fontSize: 9,
            color: '#ffffff'
        });
    },

    drawGiftBowFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.GIFT_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.GIFT_TEXT_CONTAINER_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_SHADOW_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_LEFT_RIBBON_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_RIGHT_RIBBON_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_LEFT_SOLID_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_RIGHT_SOLID_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_LEFT_SHADOW_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_RIGHT_SHADOW_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_KNOT_PATH, {
                fill: '#84868E'
            });
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            y: 76.345,
            fontSize: 7,
            color: '#ffffff'
        });
    },

    drawFrameLabel(ctx, metrics, y, color) {
        ctx.fillStyle = color;
        ctx.font = `700 ${metrics.fontSize}px ${this.FRAME_FONT_DEFAULT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.FRAME_TEXT, metrics.size / 2, y);
    },

    drawArtboardText(ctx, metrics, {
        x = 32,
        y,
        fontSize = 9,
        fontWeight = '700',
        fontFamily = this.FRAME_FONT_DEFAULT,
        color = this.FRAME_FOREGROUND_COLOR,
        rotation,
        rotateX = x,
        rotateY = y
    }) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = `${fontWeight} ${this.scaleArtboardY(fontSize, metrics)}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (rotation !== undefined) {
            ctx.translate(this.scaleArtboardX(rotateX, metrics), this.scaleArtboardY(rotateY, metrics));
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-this.scaleArtboardX(rotateX, metrics), -this.scaleArtboardY(rotateY, metrics));
        }

        ctx.fillText(this.FRAME_TEXT, this.scaleArtboardX(x, metrics), this.scaleArtboardY(y, metrics));
        ctx.restore();
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

    getPointerPanelTrianglePath(metrics) {
        const trianglePoints = this.getPointerPanelTriangleCoordinates(metrics);

        return [
            `M ${trianglePoints.tip.x} ${trianglePoints.tip.y}`,
            `L ${trianglePoints.right.x} ${trianglePoints.right.y}`,
            `L ${trianglePoints.left.x} ${trianglePoints.left.y}`,
            'Z'
        ].join(' ');
    },

    getPointerPanelTriangleCoordinates(metrics) {
        return {
            tip: {
                x: this.scaleArtboardX(this.POINTER_PANEL_TRIANGLE_POINTS.tip.x, metrics),
                y: this.scaleArtboardY(this.POINTER_PANEL_TRIANGLE_POINTS.tip.y, metrics)
            },
            right: {
                x: this.scaleArtboardX(this.POINTER_PANEL_TRIANGLE_POINTS.right.x, metrics),
                y: this.scaleArtboardY(this.POINTER_PANEL_TRIANGLE_POINTS.right.y, metrics)
            },
            left: {
                x: this.scaleArtboardX(this.POINTER_PANEL_TRIANGLE_POINTS.left.x, metrics),
                y: this.scaleArtboardY(this.POINTER_PANEL_TRIANGLE_POINTS.left.y, metrics)
            }
        };
    },

    drawArtboardPath(ctx, metrics, pathData, options = {}) {
        const path = new Path2D(pathData);
        ctx.save();
        ctx.scale(metrics.scale, metrics.scale);

        if (options.fill) {
            ctx.fillStyle = options.fill;
            ctx.fill(path, options.fillRule || 'nonzero');
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
