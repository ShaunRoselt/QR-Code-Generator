/**
 * QR Code Frame Utilities
 * Provides various frame styles for QR codes
 */

const QRFrames = {
    // Available frame types
    FRAME_TYPES: {
        NONE: 'none',
        // Classic Frames
        SQUARE: 'square',
        ROUNDED: 'rounded',
        CIRCLE: 'circle',
        MINIMAL: 'minimal',
        DOUBLE: 'double',
        THICK: 'thick',
        // Corner Frames
        CORNERS: 'corners',
        ROUNDED_CORNERS: 'rounded-corners',
        BRACKET: 'bracket',
        // Badge & Label Frames
        BADGE: 'badge',
        SCAN_ME: 'scanme',
        SCAN_HERE: 'scanhere',
        QR_LABEL: 'qrlabel',
        // Modern Frames
        GRADIENT: 'gradient',
        SHADOW: 'shadow',
        GLOW: 'glow',
        NEON: 'neon',
        // Shape Frames
        HEXAGON: 'hexagon',
        OCTAGON: 'octagon',
        ROUNDED_SQUARE: 'rounded-square',
        DIAMOND: 'diamond',
        // Decorative Frames
        ORNAMENTAL: 'ornamental',
        TECH: 'tech',
        MINIMAL_LINES: 'minimal-lines',
        GRID: 'grid'
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
                    <optgroup label="Classic Frames">
                        <option value="square">Square Border</option>
                        <option value="rounded">Rounded Corners</option>
                        <option value="circle">Circle</option>
                        <option value="minimal">Minimal Border</option>
                        <option value="double">Double Border</option>
                        <option value="thick">Thick Border</option>
                    </optgroup>
                    <optgroup label="Corner Frames">
                        <option value="corners">Corner Accents</option>
                        <option value="rounded-corners">Rounded Corner Accents</option>
                        <option value="bracket">Corner Brackets</option>
                    </optgroup>
                    <optgroup label="Labels & Banners">
                        <option value="badge">Badge</option>
                        <option value="scanme">Scan Me</option>
                        <option value="scanhere">Scan Here</option>
                        <option value="qrlabel">QR Code Label</option>
                    </optgroup>
                    <optgroup label="Modern Styles">
                        <option value="gradient">Gradient Border</option>
                        <option value="shadow">Drop Shadow</option>
                        <option value="glow">Glow Effect</option>
                        <option value="neon">Neon Style</option>
                    </optgroup>
                    <optgroup label="Shapes">
                        <option value="hexagon">Hexagon</option>
                        <option value="octagon">Octagon</option>
                        <option value="rounded-square">Rounded Square</option>
                        <option value="diamond">Diamond</option>
                    </optgroup>
                    <optgroup label="Decorative">
                        <option value="ornamental">Ornamental</option>
                        <option value="tech">Tech/Circuit</option>
                        <option value="minimal-lines">Minimal Lines</option>
                        <option value="grid">Grid Pattern</option>
                    </optgroup>
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
            // Classic Frames
            case 'square':
                this.drawSquareFrame(ctx, newSize, padding);
                break;
            case 'rounded':
                this.drawRoundedFrame(ctx, newSize, padding);
                break;
            case 'circle':
                this.drawCircleFrame(ctx, newSize, padding);
                break;
            case 'minimal':
                this.drawMinimalFrame(ctx, newSize, padding);
                break;
            case 'double':
                this.drawDoubleFrame(ctx, newSize, padding);
                break;
            case 'thick':
                this.drawThickFrame(ctx, newSize, padding);
                break;
            // Corner Frames
            case 'corners':
                this.drawCornersFrame(ctx, newSize, padding);
                break;
            case 'rounded-corners':
                this.drawRoundedCornersFrame(ctx, newSize, padding);
                break;
            case 'bracket':
                this.drawBracketFrame(ctx, newSize, padding);
                break;
            // Badge & Label Frames
            case 'badge':
                this.drawBadgeFrame(ctx, newSize, padding);
                break;
            case 'scanme':
                this.drawScanMeFrame(ctx, newSize, padding);
                break;
            case 'scanhere':
                this.drawScanHereFrame(ctx, newSize, padding);
                break;
            case 'qrlabel':
                this.drawQRLabelFrame(ctx, newSize, padding);
                break;
            // Modern Frames
            case 'gradient':
                this.drawGradientFrame(ctx, newSize, padding);
                break;
            case 'shadow':
                this.drawShadowFrame(ctx, newSize, padding);
                break;
            case 'glow':
                this.drawGlowFrame(ctx, newSize, padding);
                break;
            case 'neon':
                this.drawNeonFrame(ctx, newSize, padding);
                break;
            // Shape Frames
            case 'hexagon':
                this.drawHexagonFrame(ctx, newSize, padding);
                break;
            case 'octagon':
                this.drawOctagonFrame(ctx, newSize, padding);
                break;
            case 'rounded-square':
                this.drawRoundedSquareFrame(ctx, newSize, padding);
                break;
            case 'diamond':
                this.drawDiamondFrame(ctx, newSize, padding);
                break;
            // Decorative Frames
            case 'ornamental':
                this.drawOrnamentalFrame(ctx, newSize, padding);
                break;
            case 'tech':
                this.drawTechFrame(ctx, newSize, padding);
                break;
            case 'minimal-lines':
                this.drawMinimalLinesFrame(ctx, newSize, padding);
                break;
            case 'grid':
                this.drawGridFrame(ctx, newSize, padding);
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

    // ===== CLASSIC FRAMES =====
    
    /**
     * Draw minimal border frame
     */
    drawMinimalFrame(ctx, size, padding) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(padding - 10, padding - 10, size - (padding * 2) + 20, size - (padding * 2) + 20);
    },

    /**
     * Draw double border frame
     */
    drawDoubleFrame(ctx, size, padding) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        // Outer border
        ctx.strokeRect(padding - 15, padding - 15, size - (padding * 2) + 30, size - (padding * 2) + 30);
        // Inner border
        ctx.strokeRect(padding - 5, padding - 5, size - (padding * 2) + 10, size - (padding * 2) + 10);
    },

    /**
     * Draw thick border frame
     */
    drawThickFrame(ctx, size, padding) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 8;
        ctx.strokeRect(padding - 10, padding - 10, size - (padding * 2) + 20, size - (padding * 2) + 20);
    },

    // ===== CORNER FRAMES =====

    /**
     * Draw corner accents frame
     */
    drawCornersFrame(ctx, size, padding) {
        const cornerSize = 40;
        const offset = padding - 10;
        const width = size - (padding * 2) + 20;
        const height = size - (padding * 2) + 20;

        ctx.strokeStyle = '#007ACC';
        ctx.lineWidth = 5;

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
     * Draw rounded corner accents frame
     */
    drawRoundedCornersFrame(ctx, size, padding) {
        const cornerSize = 35;
        const offset = padding - 10;
        const width = size - (padding * 2) + 20;
        const height = size - (padding * 2) + 20;
        const radius = 15;

        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 5;

        // Top-left
        ctx.beginPath();
        ctx.arc(offset + radius, offset + radius, radius, Math.PI, Math.PI * 1.5);
        ctx.lineTo(offset + cornerSize, offset);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(offset, offset + radius);
        ctx.lineTo(offset, offset + cornerSize);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.arc(offset + width - radius, offset + radius, radius, Math.PI * 1.5, 0);
        ctx.lineTo(offset + width, offset + cornerSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(offset + width - cornerSize, offset);
        ctx.lineTo(offset + width - radius, offset);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.arc(offset + radius, offset + height - radius, radius, Math.PI * 0.5, Math.PI);
        ctx.lineTo(offset, offset + height - cornerSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(offset + radius, offset + height);
        ctx.lineTo(offset + cornerSize, offset + height);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.arc(offset + width - radius, offset + height - radius, radius, 0, Math.PI * 0.5);
        ctx.lineTo(offset + width - cornerSize, offset + height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(offset + width, offset + height - cornerSize);
        ctx.lineTo(offset + width, offset + height - radius);
        ctx.stroke();
    },

    /**
     * Draw bracket-style corner frame
     */
    drawBracketFrame(ctx, size, padding) {
        const bracketSize = 50;
        const offset = padding - 15;
        const width = size - (padding * 2) + 30;
        const height = size - (padding * 2) + 30;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6;

        // Top-left
        ctx.beginPath();
        ctx.moveTo(offset + bracketSize, offset);
        ctx.lineTo(offset, offset);
        ctx.lineTo(offset, offset + bracketSize);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(offset + width - bracketSize, offset);
        ctx.lineTo(offset + width, offset);
        ctx.lineTo(offset + width, offset + bracketSize);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(offset, offset + height - bracketSize);
        ctx.lineTo(offset, offset + height);
        ctx.lineTo(offset + bracketSize, offset + height);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(offset + width, offset + height - bracketSize);
        ctx.lineTo(offset + width, offset + height);
        ctx.lineTo(offset + width - bracketSize, offset + height);
        ctx.stroke();
    },

    // ===== LABEL & BANNER FRAMES =====

    /**
     * Draw "Scan Here" banner frame
     */
    drawScanHereFrame(ctx, size, padding) {
        this.drawSquareFrame(ctx, size, padding);

        const bannerHeight = 35;
        const bannerY = padding - 10;

        ctx.fillStyle = '#28A745';
        ctx.fillRect(padding - 10, bannerY, size - (padding * 2) + 20, bannerHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SCAN HERE', size / 2, bannerY + bannerHeight / 2);
    },

    /**
     * Draw "QR Code" label frame
     */
    drawQRLabelFrame(ctx, size, padding) {
        this.drawRoundedFrame(ctx, size, padding);

        const labelHeight = 30;
        const labelY = size - padding + 15;

        ctx.fillStyle = '#333333';
        ctx.fillRect(padding - 10, labelY, size - (padding * 2) + 20, labelHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('QR CODE', size / 2, labelY + labelHeight / 2);
    },

    // ===== MODERN FRAMES =====

    /**
     * Draw gradient border frame
     */
    drawGradientFrame(ctx, size, padding) {
        const offset = padding - 10;
        const width = size - (padding * 2) + 20;

        const gradient = ctx.createLinearGradient(offset, offset, offset + width, offset + width);
        gradient.addColorStop(0, '#667EEA');
        gradient.addColorStop(0.5, '#764BA2');
        gradient.addColorStop(1, '#F093FB');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 6;
        ctx.strokeRect(offset, offset, width, width);
    },

    /**
     * Draw shadow effect frame
     */
    drawShadowFrame(ctx, size, padding) {
        const offset = padding - 10;
        const width = size - (padding * 2) + 20;

        // Shadow layers
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(offset + 8, offset + 8, width, width);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(offset + 4, offset + 4, width, width);

        // Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeRect(offset, offset, width, width);
    },

    /**
     * Draw glow effect frame
     */
    drawGlowFrame(ctx, size, padding) {
        const offset = padding - 10;
        const width = size - (padding * 2) + 20;

        // Glow layers
        ctx.shadowColor = '#007ACC';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#007ACC';
        ctx.lineWidth = 4;
        ctx.strokeRect(offset, offset, width, width);

        ctx.shadowBlur = 10;
        ctx.strokeRect(offset, offset, width, width);

        // Reset shadow
        ctx.shadowBlur = 0;
    },

    /**
     * Draw neon style frame
     */
    drawNeonFrame(ctx, size, padding) {
        const offset = padding - 10;
        const width = size - (padding * 2) + 20;

        // Outer glow
        ctx.shadowColor = '#FF10F0';
        ctx.shadowBlur = 25;
        ctx.strokeStyle = '#FF10F0';
        ctx.lineWidth = 5;
        ctx.strokeRect(offset, offset, width, width);

        // Inner bright line
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(offset, offset, width, width);

        ctx.shadowBlur = 0;
    },

    // ===== SHAPE FRAMES =====

    /**
     * Draw hexagon frame
     */
    drawHexagonFrame(ctx, size, padding) {
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = (size - (padding * 2) + 20) / 2;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.beginPath();

        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    },

    /**
     * Draw octagon frame
     */
    drawOctagonFrame(ctx, size, padding) {
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = (size - (padding * 2) + 20) / 2;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.beginPath();

        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 4) * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    },

    /**
     * Draw rounded square frame (large corner radius)
     */
    drawRoundedSquareFrame(ctx, size, padding) {
        const x = padding - 10;
        const y = padding - 10;
        const width = size - (padding * 2) + 20;
        const height = size - (padding * 2) + 20;
        const radius = 50;

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
     * Draw diamond frame
     */
    drawDiamondFrame(ctx, size, padding) {
        const centerX = size / 2;
        const centerY = size / 2;
        const halfSize = (size - (padding * 2) + 20) / 2;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - halfSize);
        ctx.lineTo(centerX + halfSize, centerY);
        ctx.lineTo(centerX, centerY + halfSize);
        ctx.lineTo(centerX - halfSize, centerY);
        ctx.closePath();
        ctx.stroke();
    },

    // ===== DECORATIVE FRAMES =====

    /**
     * Draw ornamental frame
     */
    drawOrnamentalFrame(ctx, size, padding) {
        this.drawDoubleFrame(ctx, size, padding);

        const offset = padding - 20;
        const width = size - (padding * 2) + 40;
        const dotSize = 3;

        ctx.fillStyle = '#FFD700';

        // Draw decorative dots in corners
        const positions = [
            [offset, offset],
            [offset + width, offset],
            [offset, offset + width],
            [offset + width, offset + width]
        ];

        positions.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
            ctx.fill();
        });
    },

    /**
     * Draw tech/circuit style frame
     */
    drawTechFrame(ctx, size, padding) {
        const offset = padding - 10;
        const width = size - (padding * 2) + 20;
        const cornerSize = 20;

        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;

        // Main border
        ctx.strokeRect(offset, offset, width, width);

        // Tech corners
        ctx.fillStyle = '#00FF00';
        const corners = [
            [offset, offset],
            [offset + width - cornerSize, offset],
            [offset, offset + width - cornerSize],
            [offset + width - cornerSize, offset + width - cornerSize]
        ];

        corners.forEach(([x, y]) => {
            ctx.fillRect(x, y, cornerSize, 3);
            ctx.fillRect(x, y, 3, cornerSize);
        });

        // Circuit lines
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const lineOffset = offset + 15 + (i * 10);
            ctx.beginPath();
            ctx.moveTo(lineOffset, offset);
            ctx.lineTo(lineOffset, offset - 5);
            ctx.stroke();
        }
    },

    /**
     * Draw minimal lines frame
     */
    drawMinimalLinesFrame(ctx, size, padding) {
        const lineLength = 25;
        const offset = padding - 10;
        const width = size - (padding * 2) + 20;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;

        // Top
        ctx.beginPath();
        ctx.moveTo(size / 2 - lineLength, offset);
        ctx.lineTo(size / 2 + lineLength, offset);
        ctx.stroke();

        // Bottom
        ctx.beginPath();
        ctx.moveTo(size / 2 - lineLength, offset + width);
        ctx.lineTo(size / 2 + lineLength, offset + width);
        ctx.stroke();

        // Left
        ctx.beginPath();
        ctx.moveTo(offset, size / 2 - lineLength);
        ctx.lineTo(offset, size / 2 + lineLength);
        ctx.stroke();

        // Right
        ctx.beginPath();
        ctx.moveTo(offset + width, size / 2 - lineLength);
        ctx.lineTo(offset + width, size / 2 + lineLength);
        ctx.stroke();
    },

    /**
     * Draw grid pattern frame
     */
    drawGridFrame(ctx, size, padding) {
        const offset = padding - 10;
        const width = size - (padding * 2) + 20;
        const gridSize = 10;

        // Main border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeRect(offset, offset, width, width);

        // Grid pattern in border area
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;

        // Top border grid
        for (let i = 0; i < width; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(offset + i, 0);
            ctx.lineTo(offset + i, offset);
            ctx.stroke();
        }

        // Bottom border grid
        for (let i = 0; i < width; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(offset + i, offset + width);
            ctx.lineTo(offset + i, size);
            ctx.stroke();
        }

        // Left border grid
        for (let i = 0; i < width; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, offset + i);
            ctx.lineTo(offset, offset + i);
            ctx.stroke();
        }

        // Right border grid
        for (let i = 0; i < width; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(offset + width, offset + i);
            ctx.lineTo(size, offset + i);
            ctx.stroke();
        }
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
            // Classic Frames
            case 'square':
                frameElements = `<rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="#000000" stroke-width="4"/>`;
                break;
            case 'rounded':
                frameElements = `<rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" rx="20" fill="none" stroke="#000000" stroke-width="4"/>`;
                break;
            case 'circle':
                frameElements = `<circle cx="${size/2}" cy="${size/2}" r="${(qrSize + 20)/2}" fill="none" stroke="#000000" stroke-width="4"/>`;
                break;
            case 'minimal':
                frameElements = `<rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="#000000" stroke-width="2"/>`;
                break;
            case 'double':
                frameElements = `
                    <rect x="${padding - 15}" y="${padding - 15}" width="${qrSize + 30}" height="${qrSize + 30}" fill="none" stroke="#000000" stroke-width="3"/>
                    <rect x="${padding - 5}" y="${padding - 5}" width="${qrSize + 10}" height="${qrSize + 10}" fill="none" stroke="#000000" stroke-width="3"/>
                `;
                break;
            case 'thick':
                frameElements = `<rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="#000000" stroke-width="8"/>`;
                break;
            
            // Corner Frames  
            case 'corners':
            case 'bracket':
                const cornerSize = frameType === 'bracket' ? 50 : 40;
                const offset = frameType === 'bracket' ? padding - 15 : padding - 10;
                const w = frameType === 'bracket' ? qrSize + 30 : qrSize + 20;
                const color = frameType === 'bracket' ? '#000000' : '#007ACC';
                const lineWidth = frameType === 'bracket' ? 6 : 5;
                frameElements = `
                    <path d="M ${offset} ${offset + cornerSize} L ${offset} ${offset} L ${offset + cornerSize} ${offset}" fill="none" stroke="${color}" stroke-width="${lineWidth}"/>
                    <path d="M ${offset + w - cornerSize} ${offset} L ${offset + w} ${offset} L ${offset + w} ${offset + cornerSize}" fill="none" stroke="${color}" stroke-width="${lineWidth}"/>
                    <path d="M ${offset} ${offset + w - cornerSize} L ${offset} ${offset + w} L ${offset + cornerSize} ${offset + w}" fill="none" stroke="${color}" stroke-width="${lineWidth}"/>
                    <path d="M ${offset + w - cornerSize} ${offset + w} L ${offset + w} ${offset + w} L ${offset + w} ${offset + w - cornerSize}" fill="none" stroke="${color}" stroke-width="${lineWidth}"/>
                `;
                break;
            case 'rounded-corners':
                frameElements = `<rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" rx="15" fill="none" stroke="#FF6B6B" stroke-width="5" stroke-dasharray="35 ${qrSize - 35}"/>`;
                break;
            
            // Labels & Banners
            case 'badge':
                const badgeCorner = 30;
                const badgeOff = padding - 10;
                const badgeW = qrSize + 20;
                frameElements = `
                    <path d="M ${badgeOff} ${badgeOff + badgeCorner} L ${badgeOff} ${badgeOff} L ${badgeOff + badgeCorner} ${badgeOff}" fill="none" stroke="#007ACC" stroke-width="6"/>
                    <path d="M ${badgeOff + badgeW - badgeCorner} ${badgeOff} L ${badgeOff + badgeW} ${badgeOff} L ${badgeOff + badgeW} ${badgeOff + badgeCorner}" fill="none" stroke="#007ACC" stroke-width="6"/>
                    <path d="M ${badgeOff} ${badgeOff + badgeW - badgeCorner} L ${badgeOff} ${badgeOff + badgeW} L ${badgeOff + badgeCorner} ${badgeOff + badgeW}" fill="none" stroke="#007ACC" stroke-width="6"/>
                    <path d="M ${badgeOff + badgeW - badgeCorner} ${badgeOff + badgeW} L ${badgeOff + badgeW} ${badgeOff + badgeW} L ${badgeOff + badgeW} ${badgeOff + badgeW - badgeCorner}" fill="none" stroke="#007ACC" stroke-width="6"/>
                `;
                break;
            case 'scanme':
                const bannerY = size - padding - 50;
                frameElements = `
                    <rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" rx="20" fill="none" stroke="#000000" stroke-width="4"/>
                    <rect x="${padding - 10}" y="${bannerY}" width="${qrSize + 20}" height="40" fill="#007ACC"/>
                    <text x="${size/2}" y="${bannerY + 25}" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold" font-family="Arial">SCAN ME</text>
                `;
                break;
            case 'scanhere':
                const bannerY2 = padding - 10;
                frameElements = `
                    <rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="#000000" stroke-width="4"/>
                    <rect x="${padding - 10}" y="${bannerY2}" width="${qrSize + 20}" height="35" fill="#28A745"/>
                    <text x="${size/2}" y="${bannerY2 + 20}" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold" font-family="Arial">SCAN HERE</text>
                `;
                break;
            case 'qrlabel':
                const labelY = size - padding + 15;
                frameElements = `
                    <rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" rx="20" fill="none" stroke="#000000" stroke-width="4"/>
                    <rect x="${padding - 10}" y="${labelY}" width="${qrSize + 20}" height="30" fill="#333333"/>
                    <text x="${size/2}" y="${labelY + 18}" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold" font-family="Arial">QR CODE</text>
                `;
                break;
            
            // Modern Styles
            case 'gradient':
                frameElements = `
                    <defs>
                        <linearGradient id="gradFrame" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#667EEA;stop-opacity:1" />
                            <stop offset="50%" style="stop-color:#764BA2;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#F093FB;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="url(#gradFrame)" stroke-width="6"/>
                `;
                break;
            case 'shadow':
                frameElements = `
                    <rect x="${padding - 2}" y="${padding - 2}" width="${qrSize + 20}" height="${qrSize + 20}" fill="rgba(0,0,0,0.1)"/>
                    <rect x="${padding - 6}" y="${padding - 6}" width="${qrSize + 20}" height="${qrSize + 20}" fill="rgba(0,0,0,0.05)"/>
                    <rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="#000000" stroke-width="3"/>
                `;
                break;
            case 'glow':
                frameElements = `
                    <defs>
                        <filter id="glowFilter">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="#007ACC" stroke-width="4" filter="url(#glowFilter)"/>
                `;
                break;
            case 'neon':
                frameElements = `
                    <defs>
                        <filter id="neonFilter">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="#FF10F0" stroke-width="5" filter="url(#neonFilter)"/>
                    <rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="#FFFFFF" stroke-width="2"/>
                `;
                break;
            
            // Shape Frames
            case 'hexagon':
                const hexPoints = [];
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const radius = (qrSize + 20) / 2;
                    const x = size/2 + radius * Math.cos(angle);
                    const y = size/2 + radius * Math.sin(angle);
                    hexPoints.push(`${x},${y}`);
                }
                frameElements = `<polygon points="${hexPoints.join(' ')}" fill="none" stroke="#000000" stroke-width="4"/>`;
                break;
            case 'octagon':
                const octPoints = [];
                for (let i = 0; i < 8; i++) {
                    const angle = (Math.PI / 4) * i;
                    const radius = (qrSize + 20) / 2;
                    const x = size/2 + radius * Math.cos(angle);
                    const y = size/2 + radius * Math.sin(angle);
                    octPoints.push(`${x},${y}`);
                }
                frameElements = `<polygon points="${octPoints.join(' ')}" fill="none" stroke="#000000" stroke-width="4"/>`;
                break;
            case 'rounded-square':
                frameElements = `<rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" rx="50" fill="none" stroke="#000000" stroke-width="4"/>`;
                break;
            case 'diamond':
                const halfS = (qrSize + 20) / 2;
                frameElements = `<polygon points="${size/2},${size/2 - halfS} ${size/2 + halfS},${size/2} ${size/2},${size/2 + halfS} ${size/2 - halfS},${size/2}" fill="none" stroke="#000000" stroke-width="4"/>`;
                break;
            
            // Decorative Frames
            case 'ornamental':
                frameElements = `
                    <rect x="${padding - 20}" y="${padding - 20}" width="${qrSize + 40}" height="${qrSize + 40}" fill="none" stroke="#000000" stroke-width="3"/>
                    <rect x="${padding - 15}" y="${padding - 15}" width="${qrSize + 30}" height="${qrSize + 30}" fill="none" stroke="#000000" stroke-width="3"/>
                    <circle cx="${padding - 20}" cy="${padding - 20}" r="3" fill="#FFD700"/>
                    <circle cx="${size - padding + 20}" cy="${padding - 20}" r="3" fill="#FFD700"/>
                    <circle cx="${padding - 20}" cy="${size - padding + 20}" r="3" fill="#FFD700"/>
                    <circle cx="${size - padding + 20}" cy="${size - padding + 20}" r="3" fill="#FFD700"/>
                `;
                break;
            case 'tech':
                const techCorner = 20;
                frameElements = `
                    <rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="#00FF00" stroke-width="3"/>
                    <rect x="${padding - 10}" y="${padding - 10}" width="${techCorner}" height="3" fill="#00FF00"/>
                    <rect x="${padding - 10}" y="${padding - 10}" width="3" height="${techCorner}" fill="#00FF00"/>
                    <rect x="${size - padding + 10 - techCorner}" y="${padding - 10}" width="${techCorner}" height="3" fill="#00FF00"/>
                    <rect x="${size - padding + 7}" y="${padding - 10}" width="3" height="${techCorner}" fill="#00FF00"/>
                    <rect x="${padding - 10}" y="${size - padding + 7}" width="${techCorner}" height="3" fill="#00FF00"/>
                    <rect x="${padding - 10}" y="${size - padding + 10 - techCorner}" width="3" height="${techCorner}" fill="#00FF00"/>
                    <rect x="${size - padding + 10 - techCorner}" y="${size - padding + 7}" width="${techCorner}" height="3" fill="#00FF00"/>
                    <rect x="${size - padding + 7}" y="${size - padding + 10 - techCorner}" width="3" height="${techCorner}" fill="#00FF00"/>
                `;
                break;
            case 'minimal-lines':
                const lineLen = 25;
                const off = padding - 10;
                const w2 = qrSize + 20;
                frameElements = `
                    <line x1="${size/2 - lineLen}" y1="${off}" x2="${size/2 + lineLen}" y2="${off}" stroke="#000000" stroke-width="2"/>
                    <line x1="${size/2 - lineLen}" y1="${off + w2}" x2="${size/2 + lineLen}" y2="${off + w2}" stroke="#000000" stroke-width="2"/>
                    <line x1="${off}" y1="${size/2 - lineLen}" x2="${off}" y2="${size/2 + lineLen}" stroke="#000000" stroke-width="2"/>
                    <line x1="${off + w2}" y1="${size/2 - lineLen}" x2="${off + w2}" y2="${size/2 + lineLen}" stroke="#000000" stroke-width="2"/>
                `;
                break;
            case 'grid':
                frameElements = `<rect x="${padding - 10}" y="${padding - 10}" width="${qrSize + 20}" height="${qrSize + 20}" fill="none" stroke="#000000" stroke-width="3"/>`;
                // Grid lines would be complex in SVG, keeping it simple
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
