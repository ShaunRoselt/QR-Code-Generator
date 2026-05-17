"use strict";

function buildNativeQRCodeSVG({
    text,
    size,
    qrOptions = {},
    includeLogo = true
}) {
    const tempContainer = document.createElement('div');
    const qrCode = new QRCode(tempContainer, {
        ...qrOptions,
        text,
        width: size,
        height: size,
        margin: qrOptions.margin ?? 0,
        output: 'svg'
    });
    const svgElement = tempContainer.querySelector('svg');

    if (!svgElement) {
        throw new Error('Unable to generate native SVG QR code.');
    }

    const requestedTransparentBackground = qrOptions.transparentBackground === true
        || qrOptions.colorLight === 'rgba(255, 255, 255, 0)'
        || qrOptions.colorLight === 'transparent';
    const darkColor = qrOptions.colorDark || '#000000';
    const lightColor = requestedTransparentBackground
        ? 'transparent'
        : (qrOptions.colorLight || '#ffffff');

    svgElement.querySelectorAll('path').forEach(path => {
        path.setAttribute('fill', darkColor);
    });

    if (requestedTransparentBackground) {
        svgElement.querySelectorAll('rect').forEach(rect => {
            const fill = rect.getAttribute('fill');
            if (fill === '#ffffff' || fill === 'white' || fill === 'rgb(255, 255, 255)') {
                rect.remove();
            }
        });
        svgElement.setAttribute('fill', 'transparent');
    } else {
        svgElement.querySelectorAll('rect').forEach(rect => {
            rect.setAttribute('fill', lightColor);
        });
        svgElement.setAttribute('fill', lightColor);
    }

    svgElement.setAttribute('width', String(size));
    svgElement.setAttribute('height', String(size));
    svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    if (includeLogo && QRCodeLogoControls.hasLogo()) {
        QRCodeLogoControls.applyLogoToSVG(svgElement, qrCode, qrOptions);
    }

    return svgElement.outerHTML;
}

function exportQRCodeAsSVG({
    text,
    size,
    filename = 'qrcode.svg',
    frameType = 'none',
    qrOptions = {},
    includeLogo = true
}) {
    const svg = buildNativeQRCodeSVG({
        text,
        size,
        qrOptions,
        includeLogo
    });

    if (window.QRFrames && frameType) {
        QRFrames.exportSVGWithFrame(svg, frameType, size, filename);
        return;
    }

    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), filename);
}

const QRCodeExportControls = {
    CUSTOM_OPTION_VALUE: 'custom',
    EPS_BUTTON_ID: 'downloadEps',
    PDF_BUTTON_ID: 'downloadPdf',
    WEBP_BUTTON_ID: 'downloadWebp',
    MIN_SIZE: 256,
    MAX_SIZE: 16384,
    DEFAULT_CUSTOM_SIZE: 3200,

    init(root = document) {
        const exportSizeSelect = root.querySelector('#exportSize');
        if (!exportSizeSelect) {
            return;
        }

        this.ensureWebPButton(root);
        this.ensureEpsButton(root);
        this.ensurePdfButton(root);

        if (exportSizeSelect.dataset.customExportInitialized === 'true') {
            return;
        }

        const customOption = document.createElement('option');
        customOption.value = this.CUSTOM_OPTION_VALUE;
        customOption.textContent = I18n.translateString('Custom resolution');
        exportSizeSelect.appendChild(customOption);

        const customResolutionWrapper = document.createElement('div');
        customResolutionWrapper.className = 'custom-export-size d-none';
        customResolutionWrapper.innerHTML = `
            <input
                type="number"
                class="form-input mt-2"
                id="customExportSize"
                min="${this.MIN_SIZE}"
                max="${this.MAX_SIZE}"
                step="1"
                inputmode="numeric"
                placeholder="${I18n.translateString('Custom size in pixels')}"
                value="${this.DEFAULT_CUSTOM_SIZE}"
            >
            <div class="form-hint">${I18n.translate('Enter a square export size between 256px and 16384px.', { min: this.MIN_SIZE, max: this.MAX_SIZE })}</div>
        `;
        exportSizeSelect.insertAdjacentElement('afterend', customResolutionWrapper);

        const customResolutionInput = customResolutionWrapper.querySelector('#customExportSize');
        const syncCustomResolutionVisibility = () => {
            const isCustom = exportSizeSelect.value === this.CUSTOM_OPTION_VALUE;
            customResolutionWrapper.classList.toggle('d-none', !isCustom);

            if (isCustom) {
                customResolutionInput.focus();
                customResolutionInput.select();
            }
        };

        exportSizeSelect.addEventListener('change', syncCustomResolutionVisibility);
        exportSizeSelect.dataset.customExportInitialized = 'true';
        syncCustomResolutionVisibility();
    },

    ensureEpsButton(root = document) {
        const downloadButtons = root.querySelector('#downloadOptions .download-buttons');
        if (!downloadButtons || downloadButtons.querySelector(`#${this.EPS_BUTTON_ID}`)) {
            return;
        }

        const epsButton = document.createElement('button');
        epsButton.type = 'button';
        epsButton.className = 'btn btn-secondary btn-block';
        epsButton.id = this.EPS_BUTTON_ID;
        epsButton.innerHTML = `
            <i class="bi bi-file-earmark-post"></i>
            ${I18n.translateString('Download EPS')}
        `;
        epsButton.addEventListener('click', async () => {
            const exportSize = this.getExportSize(root);
            if (!exportSize) {
                return;
            }

            const qrContainer = root.querySelector('#qrcode');
            await QRCodePreviewRenderer.exportContainerAsEPS(qrContainer, exportSize);
        });

        downloadButtons.appendChild(epsButton);
    },

    ensureWebPButton(root = document) {
        const downloadButtons = root.querySelector('#downloadOptions .download-buttons');
        if (!downloadButtons || downloadButtons.querySelector(`#${this.WEBP_BUTTON_ID}`)) {
            return;
        }

        const webpButton = document.createElement('button');
        webpButton.type = 'button';
        webpButton.className = 'btn btn-secondary btn-block';
        webpButton.id = this.WEBP_BUTTON_ID;
        webpButton.innerHTML = `
            <i class="bi bi-image"></i>
            ${I18n.translateString('Download WebP')}
        `;
        webpButton.addEventListener('click', async () => {
            const exportSize = this.getExportSize(root);
            if (!exportSize) {
                return;
            }

            const qrContainer = root.querySelector('#qrcode');
            await QRCodePreviewRenderer.exportContainerAsWebP(qrContainer, exportSize);
        });

        downloadButtons.appendChild(webpButton);
    },

    ensurePdfButton(root = document) {
        const downloadButtons = root.querySelector('#downloadOptions .download-buttons');
        if (!downloadButtons || downloadButtons.querySelector(`#${this.PDF_BUTTON_ID}`)) {
            return;
        }

        const pdfButton = document.createElement('button');
        pdfButton.type = 'button';
        pdfButton.className = 'btn btn-secondary btn-block';
        pdfButton.id = this.PDF_BUTTON_ID;
        pdfButton.innerHTML = `
            <i class="bi bi-file-earmark-pdf"></i>
            ${I18n.translateString('Download PDF')}
        `;
        pdfButton.addEventListener('click', async () => {
            const exportSize = this.getExportSize(root);
            if (!exportSize) {
                return;
            }

            const qrContainer = root.querySelector('#qrcode');
            await QRCodePreviewRenderer.exportContainerAsPDF(qrContainer, exportSize);
        });

        downloadButtons.appendChild(pdfButton);
    },

    getExportSize(root = document) {
        this.init(root);

        const exportSizeSelect = root.querySelector('#exportSize');
        if (!exportSizeSelect) {
            return null;
        }

        if (exportSizeSelect.value !== this.CUSTOM_OPTION_VALUE) {
            return parseInt(exportSizeSelect.value, 10);
        }

        const customResolutionInput = root.querySelector('#customExportSize');
        const customResolution = parseInt(customResolutionInput?.value || '', 10);
        const isValid = Number.isInteger(customResolution)
            && customResolution >= this.MIN_SIZE
            && customResolution <= this.MAX_SIZE;

        if (!isValid) {
            alert(`Enter a custom export size between ${this.MIN_SIZE}px and ${this.MAX_SIZE}px.`.replace('Enter a custom export size between 256px and 16384px.', I18n.translateString('Enter a square export size between 256px and 16384px.')));
            customResolutionInput?.focus();
            return null;
        }

        return customResolution;
    },

    observe() {
        const initializeControls = () => this.init(document);

        initializeControls();

        const observer = new MutationObserver(() => initializeControls());
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

const QRCodePreviewRenderer = {
    renderTokens: new WeakMap(),
    previewStates: new WeakMap(),
    maxCanvasWaitFrames: 12,
    menuId: 'qrPreviewContextMenu',
    menuPadding: 12,
    activeMenuTarget: null,
    contextMenuInitialized: false,
    cloneCanvas(sourceCanvas) {
        if (!(sourceCanvas instanceof HTMLCanvasElement)) {
            return null;
        }

        const canvas = document.createElement('canvas');
        canvas.width = sourceCanvas.width;
        canvas.height = sourceCanvas.height;
        const context = canvas.getContext('2d');
        context.drawImage(sourceCanvas, 0, 0);
        return canvas;
    },

    createSVGPreviewElement(svgMarkup, displaySize) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = svgMarkup.trim();
        const svgElement = wrapper.firstElementChild;

        if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
            return null;
        }

        const previewElement = svgElement;
        previewElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        previewElement.setAttribute('width', String(displaySize));
        previewElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        return previewElement;
    },

    ensureContextMenu() {
        if (this.contextMenuInitialized) {
            return;
        }

        this.contextMenuInitialized = true;

        const menu = document.createElement('div');
        menu.id = this.menuId;
        menu.className = 'qr-preview-context-menu';
        menu.hidden = true;
        menu.innerHTML = `
            <button type="button" class="qr-preview-context-menu-item" data-action="open-image">
                <i class="bi bi-box-arrow-up-right"></i>
                ${I18n.translateString('Open Image in new tab')}
            </button>
            <div class="qr-preview-context-menu-separator" role="separator"></div>
            <div class="qr-preview-context-submenu">
                <button type="button" class="qr-preview-context-menu-item qr-preview-context-submenu-trigger" aria-haspopup="true">
                    <span class="qr-preview-context-menu-item-label">
                        <i class="bi bi-download"></i>
                        ${I18n.translateString('Save Image')}
                    </span>
                    <i class="bi bi-chevron-right qr-preview-context-submenu-caret" aria-hidden="true"></i>
                </button>
                <div class="qr-preview-context-submenu-panel">
                    <button type="button" class="qr-preview-context-menu-item" data-action="save-png">
                        <i class="bi bi-filetype-png"></i>
                        ${I18n.translateString('Save Image as PNG')}
                    </button>
                    <button type="button" class="qr-preview-context-menu-item" data-action="save-webp">
                        <i class="bi bi-image"></i>
                        ${I18n.translateString('Save Image as WebP')}
                    </button>
                    <button type="button" class="qr-preview-context-menu-item" data-action="save-svg">
                        <i class="bi bi-filetype-svg"></i>
                        ${I18n.translateString('Save Image as SVG')}
                    </button>
                    <button type="button" class="qr-preview-context-menu-item" data-action="save-eps">
                        <i class="bi bi-file-earmark-post"></i>
                        ${I18n.translateString('Save Image as EPS')}
                    </button>
                    <button type="button" class="qr-preview-context-menu-item" data-action="save-pdf">
                        <i class="bi bi-file-earmark-pdf"></i>
                        ${I18n.translateString('Save Image as PDF')}
                    </button>
                </div>
            </div>
            <div class="qr-preview-context-submenu">
                <button type="button" class="qr-preview-context-menu-item qr-preview-context-submenu-trigger" aria-haspopup="true">
                    <span class="qr-preview-context-menu-item-label">
                        <i class="bi bi-clipboard"></i>
                        ${I18n.translateString('Copy Image')}
                    </span>
                    <i class="bi bi-chevron-right qr-preview-context-submenu-caret" aria-hidden="true"></i>
                </button>
                <div class="qr-preview-context-submenu-panel">
                    <button type="button" class="qr-preview-context-menu-item" data-action="copy-png">
                        <i class="bi bi-filetype-png"></i>
                        ${I18n.translateString('Copy Image as PNG')}
                    </button>
                    <button type="button" class="qr-preview-context-menu-item" data-action="copy-webp">
                        <i class="bi bi-image"></i>
                        ${I18n.translateString('Copy Image as WebP')}
                    </button>
                    <button type="button" class="qr-preview-context-menu-item" data-action="copy-svg">
                        <i class="bi bi-filetype-svg"></i>
                        ${I18n.translateString('Copy Image as SVG')}
                    </button>
                    <button type="button" class="qr-preview-context-menu-item" data-action="copy-image-base64">
                        <i class="bi bi-link-45deg"></i>
                        ${I18n.translateString('Copy Image as Base64')}
                    </button>
                </div>
            </div>
            <div class="qr-preview-context-menu-separator" role="separator"></div>
            <button type="button" class="qr-preview-context-menu-item" data-action="copy-content">
                <i class="bi bi-clipboard"></i>
                ${I18n.translateString('Copy QR Code Content')}
            </button>
            <button type="button" class="qr-preview-context-menu-item" data-action="copy-share-link">
                <i class="bi bi-share"></i>
                ${I18n.translateString('Copy Share Link')}
            </button>
            <button type="button" class="qr-preview-context-menu-item" data-action="copy-editable-link">
                <i class="bi bi-pencil-square"></i>
                ${I18n.translateString('Copy Editable Link')}
            </button>
        `;

        menu.addEventListener('click', event => {
            const button = event.target.closest('[data-action]');
            if (!button) {
                return;
            }

            event.preventDefault();
            void this.handleMenuAction(button.dataset.action);
        });

        document.body.appendChild(menu);

        document.addEventListener('pointerdown', event => {
            if (menu.hidden || menu.contains(event.target)) {
                return;
            }

            this.hideContextMenu();
        });

        document.addEventListener('scroll', () => this.hideContextMenu(), true);
        window.addEventListener('resize', () => this.hideContextMenu());
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                this.hideContextMenu();
            }
        });
    },

    attachPreviewSurface(qrContainer, previewElement, state, onComplete) {
        this.ensureContextMenu();

        this.previewStates.set(qrContainer, {
            ...state,
            previewElement
        });

        qrContainer.classList.add('has-preview');
        qrContainer.tabIndex = 0;
        qrContainer.setAttribute('aria-label', I18n.translateString('QR code preview'));

        if (qrContainer.dataset.contextMenuBound !== 'true') {
            qrContainer.addEventListener('contextmenu', event => {
                const targetContainer = event.currentTarget;
                const previewState = this.previewStates.get(targetContainer);
                if (!previewState?.previewElement || !targetContainer.firstElementChild) {
                    return;
                }

                event.preventDefault();
                this.showContextMenu(event.clientX, event.clientY, targetContainer);
            });

            qrContainer.addEventListener('keydown', event => {
                const openedWithKeyboard = event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10');
                if (!openedWithKeyboard) {
                    return;
                }

                const targetContainer = event.currentTarget;
                const previewState = this.previewStates.get(targetContainer);
                if (!previewState?.previewElement || !targetContainer.firstElementChild) {
                    return;
                }

                const bounds = targetContainer.getBoundingClientRect();
                event.preventDefault();
                this.showContextMenu(bounds.left + (bounds.width / 2), bounds.top + 28, targetContainer);
            });

            qrContainer.dataset.contextMenuBound = 'true';
        }

        onComplete?.(previewElement);
    },

    showContextMenu(clientX, clientY, qrContainer) {
        const menu = document.getElementById(this.menuId);
        if (!menu) {
            return;
        }

        this.activeMenuTarget = qrContainer;
        menu.hidden = false;
        menu.style.left = '0px';
        menu.style.top = '0px';

        const menuRect = menu.getBoundingClientRect();
        const maxLeft = Math.max(this.menuPadding, window.innerWidth - menuRect.width - this.menuPadding);
        const maxTop = Math.max(this.menuPadding, window.innerHeight - menuRect.height - this.menuPadding);
        const left = Math.min(Math.max(this.menuPadding, clientX), maxLeft);
        const top = Math.min(Math.max(this.menuPadding, clientY), maxTop);

        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        this.syncContextSubmenuDirection(menu);
    },

    hideContextMenu() {
        const menu = document.getElementById(this.menuId);
        if (!menu) {
            return;
        }

        this.activeMenuTarget = null;
        menu.hidden = true;
    },

    syncContextSubmenuDirection(menu) {
        const submenuPanels = Array.from(menu.querySelectorAll('.qr-preview-context-submenu-panel'));
        if (!submenuPanels.length) {
            return;
        }

        const menuRect = menu.getBoundingClientRect();
        const maxPanelWidth = submenuPanels.reduce((largestWidth, panel) => {
            const panelWidth = panel.getBoundingClientRect().width;
            return Math.max(largestWidth, panelWidth);
        }, 0);
        const hasRoomOnRight = (menuRect.right + maxPanelWidth + this.menuPadding) <= window.innerWidth;

        menu.classList.toggle('qr-preview-context-menu-open-left', !hasRoomOnRight);
    },

    getActivePreviewState() {
        if (!this.activeMenuTarget) {
            return null;
        }

        return this.getPreviewStateForContainer(this.activeMenuTarget);
    },

    getPreviewStateForContainer(qrContainer) {
        if (!qrContainer) {
            return null;
        }

        const state = this.previewStates.get(qrContainer);
        if (!state?.previewElement || !qrContainer.firstElementChild) {
            return null;
        }

        return state;
    },

    getExportSizeOrNull() {
        return QRCodeExportControls.getExportSize(document);
    },

    buildPreviewSVGMarkup(state, size = state.displaySize, forceRebuild = false) {
        if (!forceRebuild && state.previewElement instanceof SVGElement) {
            return this.serializePreviewSVG(state.previewElement, size);
        }

        const qrSVG = buildNativeQRCodeSVG({
            text: state.qrText,
            size,
            qrOptions: state.qrOptions
        });

        if (state.frameType && window.QRFrames) {
            return QRFrames.wrapSVGWithFrame(qrSVG, state.frameType, size);
        }

        return qrSVG;
    },

    refreshContainerPreview(qrContainer, frameType = null) {
        const state = this.getPreviewStateForContainer(qrContainer);
        if (!state?.qrText || !state?.qrOptions) {
            return false;
        }

        const nextFrameType = frameType || window.QRFrames?.getActiveFrameType?.(document) || state.frameType;
        if (nextFrameType) {
            state.frameType = nextFrameType;
        }

        const svgMarkup = this.buildPreviewSVGMarkup(state, state.displaySize, true);
        const previewElement = this.createSVGPreviewElement(svgMarkup, state.displaySize);
        if (!previewElement) {
            return false;
        }

        qrContainer.replaceChildren(previewElement);
        this.attachPreviewSurface(qrContainer, previewElement, {
            ...state,
            previewElement
        });
        return true;
    },

    serializePreviewSVG(svgElement, size) {
        const clonedSVG = svgElement.cloneNode(true);
        clonedSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clonedSVG.setAttribute('width', String(size));
        clonedSVG.setAttribute('height', String(size));
        clonedSVG.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        return new XMLSerializer().serializeToString(clonedSVG);
    },

    buildPreviewSVGDataUrl(state) {
        const svgMarkup = this.buildPreviewSVGMarkup(state);
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
    },

    async buildPreviewPNGBlob(state, size = state.displaySize) {
        if (state.previewElement instanceof HTMLCanvasElement && size === state.displaySize) {
            const directBlob = await this.canvasToBlob(state.previewElement);
            if (directBlob) {
                return directBlob;
            }
        }

        const svgMarkup = this.buildPreviewSVGMarkup(state, size);
        return this.svgMarkupToPNGBlob(svgMarkup, size);
    },

    async buildPreviewWebPBlob(state, size = state.displaySize, quality = 0.92) {
        const canvas = await this.buildPreviewCanvas(state, size);
        return this.canvasToBlob(canvas, 'image/webp', quality);
    },

    async buildPreviewCanvas(state, size = state.displaySize) {
        if (state.previewElement instanceof HTMLCanvasElement && size === state.displaySize) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext('2d');
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, size, size);
            context.drawImage(state.previewElement, 0, 0, size, size);
            return canvas;
        }

        const svgMarkup = this.buildPreviewSVGMarkup(state, size);
        return this.svgMarkupToCanvas(svgMarkup, size);
    },

    async svgMarkupToPNGBlob(svgMarkup, size) {
        const canvas = await this.svgMarkupToCanvas(svgMarkup, size);
        return this.canvasToBlob(canvas);
    },

    async svgMarkupToCanvas(svgMarkup, size) {
        const imageUrl = this.createSVGObjectUrl(svgMarkup);
        const image = await this.loadImage(imageUrl);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        try {
            const context = canvas.getContext('2d');
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, size, size);
            context.drawImage(image, 0, 0, size, size);
        } finally {
            URL.revokeObjectURL(imageUrl);
        }

        return canvas;
    },

    createSVGObjectUrl(svgMarkup) {
        return URL.createObjectURL(new Blob([svgMarkup], { type: 'image/svg+xml' }));
    },

    canvasToBlob(canvas, mimeType = 'image/png', quality) {
        return new Promise(resolve => {
            canvas.toBlob(blob => resolve(blob), mimeType, quality);
        });
    },

    blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Unable to read exported image.'));
            reader.readAsDataURL(blob);
        });
    },

    binaryStringToWrappedHex(binaryString, lineLength = 128) {
        let currentLine = '';
        const lines = [];

        for (let index = 0; index < binaryString.length; index += 1) {
            currentLine += binaryString.charCodeAt(index).toString(16).padStart(2, '0').toUpperCase();
            if (currentLine.length >= lineLength) {
                lines.push(currentLine);
                currentLine = '';
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines.join('\n');
    },

    buildRasterEPSDocument({ jpegDataUrl, width, height }) {
        const base64Payload = jpegDataUrl.split(',')[1] || '';
        const jpegBinary = atob(base64Payload);
        const jpegHex = this.binaryStringToWrappedHex(jpegBinary);

        return [
            '%!PS-Adobe-3.0 EPSF-3.0',
            `%%BoundingBox: 0 0 ${width} ${height}`,
            `%%HiResBoundingBox: 0 0 ${width} ${height}`,
            '%%Creator: QR Code Generator',
            '%%LanguageLevel: 2',
            '%%Pages: 1',
            '%%EndComments',
            'gsave',
            `0 ${height} translate`,
            '1 -1 scale',
            '<<',
            '/ImageType 1',
            `/Width ${width}`,
            `/Height ${height}`,
            '/BitsPerComponent 8',
            '/ColorSpace /DeviceRGB',
            '/Decode [0 1 0 1 0 1]',
            '/DataSource currentfile /ASCIIHexDecode filter /DCTDecode filter',
            `/ImageMatrix [${width} 0 0 -${height} 0 ${height}]`,
            '>> image',
            jpegHex,
            '>',
            'grestore',
            'showpage',
            '%%EOF'
        ].join('\n');
    },

    async buildRasterPreviewEPSBlob(state, size = state.displaySize) {
        const canvas = await this.buildPreviewCanvas(state, size);
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const epsDocument = this.buildRasterEPSDocument({
            jpegDataUrl,
            width: canvas.width,
            height: canvas.height
        });

        return new Blob([epsDocument], { type: 'application/postscript' });
    },

    formatEPSNumber(value) {
        if (!Number.isFinite(value)) {
            return '0';
        }

        const fixed = (Math.abs(value) < 1e-8 ? 0 : value).toFixed(4);
        return fixed.replace(/(?:\.0+|(\.\d+?)0+)$/, '$1').replace(/\.$/, '') || '0';
    },

    escapePostScriptString(text) {
        return String(text)
            .replace(/\\/g, '\\\\')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)');
    },

    parseInlineSVGStyle(styleValue) {
        if (!styleValue) {
            return {};
        }

        return styleValue.split(';').reduce((styles, declaration) => {
            const [property, value] = declaration.split(':');
            if (!property || value == null) {
                return styles;
            }

            styles[property.trim()] = value.trim();
            return styles;
        }, {});
    },

    getSVGPresentationAttribute(element, name, inheritedValue = null) {
        const inlineStyles = this.parseInlineSVGStyle(element.getAttribute('style'));
        return inlineStyles[name] ?? element.getAttribute(name) ?? inheritedValue;
    },

    parseSVGColor(colorValue) {
        if (!colorValue || colorValue === 'none' || colorValue === 'transparent') {
            return null;
        }

        const normalized = colorValue.trim();

        if (normalized.startsWith('#')) {
            const hex = normalized.slice(1);
            if (hex.length === 3) {
                return [0, 1, 2].map(index => parseInt(hex[index] + hex[index], 16) / 255);
            }

            if (hex.length === 6) {
                return [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
            }
        }

        const rgbMatch = normalized.match(/^rgba?\(([^)]+)\)$/i);
        if (rgbMatch) {
            const parts = rgbMatch[1].split(',').map(part => part.trim());
            return parts.slice(0, 3).map(part => {
                if (part.endsWith('%')) {
                    return Math.max(0, Math.min(1, parseFloat(part) / 100));
                }

                return Math.max(0, Math.min(1, parseFloat(part) / 255));
            });
        }

        const namedColors = {
            black: [0, 0, 0],
            white: [1, 1, 1],
            red: [1, 0, 0],
            green: [0, 0.5, 0],
            blue: [0, 0, 1],
            gray: [0.5, 0.5, 0.5],
            grey: [0.5, 0.5, 0.5]
        };

        return namedColors[normalized.toLowerCase()] || null;
    },

    applyEPSColor(commands, colorValue, opacity = 1) {
        const rgb = this.parseSVGColor(colorValue);
        if (!rgb) {
            return false;
        }

        const alpha = Math.max(0, Math.min(1, opacity));
        const blended = rgb.map(channel => (channel * alpha) + (1 * (1 - alpha)));
        commands.push(`${this.formatEPSNumber(blended[0])} ${this.formatEPSNumber(blended[1])} ${this.formatEPSNumber(blended[2])} setrgbcolor`);
        return true;
    },

    parseViewBox(svgElement, fallbackWidth, fallbackHeight) {
        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
            const [minX, minY, width, height] = viewBox.split(/\s+/).map(Number);
            return { minX, minY, width, height };
        }

        const width = parseFloat(svgElement.getAttribute('width')) || fallbackWidth;
        const height = parseFloat(svgElement.getAttribute('height')) || fallbackHeight;
        return { minX: 0, minY: 0, width, height };
    },

    tokenizeSVGPathData(pathData) {
        return pathData.match(/[AaCcHhLlMmQqSsTtVvZz]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g) || [];
    },

    reflectControlPoint(current, controlPoint) {
        if (!controlPoint) {
            return { x: current.x, y: current.y };
        }

        return {
            x: (2 * current.x) - controlPoint.x,
            y: (2 * current.y) - controlPoint.y
        };
    },

    quadraticToCubic(current, controlPoint, endPoint) {
        return {
            cp1: {
                x: current.x + ((2 / 3) * (controlPoint.x - current.x)),
                y: current.y + ((2 / 3) * (controlPoint.y - current.y))
            },
            cp2: {
                x: endPoint.x + ((2 / 3) * (controlPoint.x - endPoint.x)),
                y: endPoint.y + ((2 / 3) * (controlPoint.y - endPoint.y))
            }
        };
    },

    vectorAngle(u, v) {
        const dot = (u.x * v.x) + (u.y * v.y);
        const length = Math.sqrt((u.x * u.x) + (u.y * u.y)) * Math.sqrt((v.x * v.x) + (v.y * v.y));
        const ratio = Math.max(-1, Math.min(1, dot / length));
        const direction = (u.x * v.y) - (u.y * v.x) < 0 ? -1 : 1;
        return direction * Math.acos(ratio);
    },

    arcToBezierSegments(current, arc) {
        let rx = Math.abs(arc.rx);
        let ry = Math.abs(arc.ry);
        const xAxisRotation = (arc.xAxisRotation * Math.PI) / 180;
        const endPoint = { x: arc.x, y: arc.y };

        if (rx === 0 || ry === 0 || (current.x === endPoint.x && current.y === endPoint.y)) {
            return [{
                cp1: { x: current.x, y: current.y },
                cp2: { x: endPoint.x, y: endPoint.y },
                end: endPoint
            }];
        }

        const cosPhi = Math.cos(xAxisRotation);
        const sinPhi = Math.sin(xAxisRotation);
        const dx = (current.x - endPoint.x) / 2;
        const dy = (current.y - endPoint.y) / 2;
        const x1Prime = (cosPhi * dx) + (sinPhi * dy);
        const y1Prime = (-sinPhi * dx) + (cosPhi * dy);
        const rxSquared = rx * rx;
        const rySquared = ry * ry;
        const x1PrimeSquared = x1Prime * x1Prime;
        const y1PrimeSquared = y1Prime * y1Prime;
        const radiiScale = (x1PrimeSquared / rxSquared) + (y1PrimeSquared / rySquared);

        if (radiiScale > 1) {
            const scale = Math.sqrt(radiiScale);
            rx *= scale;
            ry *= scale;
        }

        const updatedRxSquared = rx * rx;
        const updatedRySquared = ry * ry;
        const numerator = (updatedRxSquared * updatedRySquared) - (updatedRxSquared * y1PrimeSquared) - (updatedRySquared * x1PrimeSquared);
        const denominator = (updatedRxSquared * y1PrimeSquared) + (updatedRySquared * x1PrimeSquared);
        const coefficient = ((arc.largeArcFlag === arc.sweepFlag) ? -1 : 1) * Math.sqrt(Math.max(0, numerator / denominator));
        const cxPrime = coefficient * ((rx * y1Prime) / ry);
        const cyPrime = coefficient * (-(ry * x1Prime) / rx);
        const centerX = (cosPhi * cxPrime) - (sinPhi * cyPrime) + ((current.x + endPoint.x) / 2);
        const centerY = (sinPhi * cxPrime) + (cosPhi * cyPrime) + ((current.y + endPoint.y) / 2);
        const unitStart = {
            x: (x1Prime - cxPrime) / rx,
            y: (y1Prime - cyPrime) / ry
        };
        const unitEnd = {
            x: (-x1Prime - cxPrime) / rx,
            y: (-y1Prime - cyPrime) / ry
        };

        let startAngle = this.vectorAngle({ x: 1, y: 0 }, unitStart);
        let deltaAngle = this.vectorAngle(unitStart, unitEnd);
        if (!arc.sweepFlag && deltaAngle > 0) {
            deltaAngle -= Math.PI * 2;
        } else if (arc.sweepFlag && deltaAngle < 0) {
            deltaAngle += Math.PI * 2;
        }

        const segments = Math.ceil(Math.abs(deltaAngle) / (Math.PI / 2));
        const segmentAngle = deltaAngle / segments;
        const mappedPoint = (unitX, unitY) => ({
            x: (cosPhi * rx * unitX) - (sinPhi * ry * unitY) + centerX,
            y: (sinPhi * rx * unitX) + (cosPhi * ry * unitY) + centerY
        });
        const curveSegments = [];

        for (let segmentIndex = 0; segmentIndex < segments; segmentIndex += 1) {
            const theta1 = startAngle + (segmentIndex * segmentAngle);
            const theta2 = theta1 + segmentAngle;
            const alpha = (4 / 3) * Math.tan((theta2 - theta1) / 4);
            const p1 = { x: Math.cos(theta1), y: Math.sin(theta1) };
            const p2 = { x: Math.cos(theta2), y: Math.sin(theta2) };

            curveSegments.push({
                cp1: mappedPoint(p1.x - (alpha * p1.y), p1.y + (alpha * p1.x)),
                cp2: mappedPoint(p2.x + (alpha * p2.y), p2.y - (alpha * p2.x)),
                end: mappedPoint(p2.x, p2.y)
            });
        }

        return curveSegments;
    },

    emitEPSPathFromSVGData(pathData, style, commands) {
        if (!pathData) {
            return;
        }

        const tokens = this.tokenizeSVGPathData(pathData);
        if (!tokens.length) {
            return;
        }

        let index = 0;
        let command = null;
        let currentPoint = { x: 0, y: 0 };
        let subpathStart = { x: 0, y: 0 };
        let previousCubicControl = null;
        let previousQuadraticControl = null;
        const pathCommands = [];
        const readNumber = () => parseFloat(tokens[index++]);
        const isCommandToken = token => /^[A-Za-z]$/.test(token);
        const hasNumbers = () => index < tokens.length && !isCommandToken(tokens[index]);

        while (index < tokens.length) {
            if (isCommandToken(tokens[index])) {
                command = tokens[index++];
            }

            if (!command) {
                break;
            }

            switch (command) {
                case 'M':
                case 'm': {
                    const isRelative = command === 'm';
                    let isFirstPoint = true;

                    while (hasNumbers()) {
                        const x = readNumber();
                        const y = readNumber();
                        const nextPoint = {
                            x: isRelative ? currentPoint.x + x : x,
                            y: isRelative ? currentPoint.y + y : y
                        };

                        pathCommands.push(`${this.formatEPSNumber(nextPoint.x)} ${this.formatEPSNumber(nextPoint.y)} ${isFirstPoint ? 'moveto' : 'lineto'}`);
                        currentPoint = nextPoint;
                        if (isFirstPoint) {
                            subpathStart = nextPoint;
                            isFirstPoint = false;
                        }
                    }

                    previousCubicControl = null;
                    previousQuadraticControl = null;
                    break;
                }
                case 'L':
                case 'l': {
                    const isRelative = command === 'l';
                    while (hasNumbers()) {
                        const x = readNumber();
                        const y = readNumber();
                        currentPoint = {
                            x: isRelative ? currentPoint.x + x : x,
                            y: isRelative ? currentPoint.y + y : y
                        };
                        pathCommands.push(`${this.formatEPSNumber(currentPoint.x)} ${this.formatEPSNumber(currentPoint.y)} lineto`);
                    }
                    previousCubicControl = null;
                    previousQuadraticControl = null;
                    break;
                }
                case 'H':
                case 'h': {
                    const isRelative = command === 'h';
                    while (hasNumbers()) {
                        const x = readNumber();
                        currentPoint = {
                            x: isRelative ? currentPoint.x + x : x,
                            y: currentPoint.y
                        };
                        pathCommands.push(`${this.formatEPSNumber(currentPoint.x)} ${this.formatEPSNumber(currentPoint.y)} lineto`);
                    }
                    previousCubicControl = null;
                    previousQuadraticControl = null;
                    break;
                }
                case 'V':
                case 'v': {
                    const isRelative = command === 'v';
                    while (hasNumbers()) {
                        const y = readNumber();
                        currentPoint = {
                            x: currentPoint.x,
                            y: isRelative ? currentPoint.y + y : y
                        };
                        pathCommands.push(`${this.formatEPSNumber(currentPoint.x)} ${this.formatEPSNumber(currentPoint.y)} lineto`);
                    }
                    previousCubicControl = null;
                    previousQuadraticControl = null;
                    break;
                }
                case 'C':
                case 'c': {
                    const isRelative = command === 'c';
                    while (hasNumbers()) {
                        const cp1 = {
                            x: isRelative ? currentPoint.x + readNumber() : readNumber(),
                            y: isRelative ? currentPoint.y + readNumber() : readNumber()
                        };
                        const cp2 = {
                            x: isRelative ? currentPoint.x + readNumber() : readNumber(),
                            y: isRelative ? currentPoint.y + readNumber() : readNumber()
                        };
                        const endPoint = {
                            x: isRelative ? currentPoint.x + readNumber() : readNumber(),
                            y: isRelative ? currentPoint.y + readNumber() : readNumber()
                        };
                        pathCommands.push(`${this.formatEPSNumber(cp1.x)} ${this.formatEPSNumber(cp1.y)} ${this.formatEPSNumber(cp2.x)} ${this.formatEPSNumber(cp2.y)} ${this.formatEPSNumber(endPoint.x)} ${this.formatEPSNumber(endPoint.y)} curveto`);
                        currentPoint = endPoint;
                        previousCubicControl = cp2;
                        previousQuadraticControl = null;
                    }
                    break;
                }
                case 'S':
                case 's': {
                    const isRelative = command === 's';
                    while (hasNumbers()) {
                        const reflectedControl = this.reflectControlPoint(currentPoint, previousCubicControl);
                        const cp2 = {
                            x: isRelative ? currentPoint.x + readNumber() : readNumber(),
                            y: isRelative ? currentPoint.y + readNumber() : readNumber()
                        };
                        const endPoint = {
                            x: isRelative ? currentPoint.x + readNumber() : readNumber(),
                            y: isRelative ? currentPoint.y + readNumber() : readNumber()
                        };
                        pathCommands.push(`${this.formatEPSNumber(reflectedControl.x)} ${this.formatEPSNumber(reflectedControl.y)} ${this.formatEPSNumber(cp2.x)} ${this.formatEPSNumber(cp2.y)} ${this.formatEPSNumber(endPoint.x)} ${this.formatEPSNumber(endPoint.y)} curveto`);
                        currentPoint = endPoint;
                        previousCubicControl = cp2;
                        previousQuadraticControl = null;
                    }
                    break;
                }
                case 'Q':
                case 'q': {
                    const isRelative = command === 'q';
                    while (hasNumbers()) {
                        const controlPoint = {
                            x: isRelative ? currentPoint.x + readNumber() : readNumber(),
                            y: isRelative ? currentPoint.y + readNumber() : readNumber()
                        };
                        const endPoint = {
                            x: isRelative ? currentPoint.x + readNumber() : readNumber(),
                            y: isRelative ? currentPoint.y + readNumber() : readNumber()
                        };
                        const cubic = this.quadraticToCubic(currentPoint, controlPoint, endPoint);
                        pathCommands.push(`${this.formatEPSNumber(cubic.cp1.x)} ${this.formatEPSNumber(cubic.cp1.y)} ${this.formatEPSNumber(cubic.cp2.x)} ${this.formatEPSNumber(cubic.cp2.y)} ${this.formatEPSNumber(endPoint.x)} ${this.formatEPSNumber(endPoint.y)} curveto`);
                        currentPoint = endPoint;
                        previousCubicControl = cubic.cp2;
                        previousQuadraticControl = controlPoint;
                    }
                    break;
                }
                case 'T':
                case 't': {
                    const isRelative = command === 't';
                    while (hasNumbers()) {
                        const controlPoint = this.reflectControlPoint(currentPoint, previousQuadraticControl);
                        const endPoint = {
                            x: isRelative ? currentPoint.x + readNumber() : readNumber(),
                            y: isRelative ? currentPoint.y + readNumber() : readNumber()
                        };
                        const cubic = this.quadraticToCubic(currentPoint, controlPoint, endPoint);
                        pathCommands.push(`${this.formatEPSNumber(cubic.cp1.x)} ${this.formatEPSNumber(cubic.cp1.y)} ${this.formatEPSNumber(cubic.cp2.x)} ${this.formatEPSNumber(cubic.cp2.y)} ${this.formatEPSNumber(endPoint.x)} ${this.formatEPSNumber(endPoint.y)} curveto`);
                        currentPoint = endPoint;
                        previousCubicControl = cubic.cp2;
                        previousQuadraticControl = controlPoint;
                    }
                    break;
                }
                case 'A':
                case 'a': {
                    const isRelative = command === 'a';
                    while (hasNumbers()) {
                        const arc = {
                            rx: readNumber(),
                            ry: readNumber(),
                            xAxisRotation: readNumber(),
                            largeArcFlag: readNumber() === 1,
                            sweepFlag: readNumber() === 1,
                            x: isRelative ? currentPoint.x + readNumber() : readNumber(),
                            y: isRelative ? currentPoint.y + readNumber() : readNumber()
                        };
                        const arcSegments = this.arcToBezierSegments(currentPoint, arc);
                        for (const segment of arcSegments) {
                            pathCommands.push(`${this.formatEPSNumber(segment.cp1.x)} ${this.formatEPSNumber(segment.cp1.y)} ${this.formatEPSNumber(segment.cp2.x)} ${this.formatEPSNumber(segment.cp2.y)} ${this.formatEPSNumber(segment.end.x)} ${this.formatEPSNumber(segment.end.y)} curveto`);
                        }
                        currentPoint = { x: arc.x, y: arc.y };
                        previousCubicControl = arcSegments.length ? arcSegments[arcSegments.length - 1].cp2 : null;
                        previousQuadraticControl = null;
                    }
                    break;
                }
                case 'Z':
                case 'z': {
                    pathCommands.push('closepath');
                    currentPoint = { ...subpathStart };
                    previousCubicControl = null;
                    previousQuadraticControl = null;
                    break;
                }
                default:
                    throw new Error(`Unsupported SVG path command: ${command}`);
            }
        }

        const fillOpacity = Number(style.fillOpacity || '1');
        const strokeOpacity = Number(style.strokeOpacity || '1');
        const opacity = Number(style.opacity || '1');
        const effectiveFillOpacity = Math.max(0, Math.min(1, opacity * fillOpacity));
        const effectiveStrokeOpacity = Math.max(0, Math.min(1, opacity * strokeOpacity));
        const hasFill = style.fill && style.fill !== 'none';
        const hasStroke = style.stroke && style.stroke !== 'none';
        const fillRule = style.fillRule === 'evenodd' ? 'eofill' : 'fill';
        const pathBody = pathCommands.join('\n');

        if (hasFill) {
            commands.push('gsave');
            if (this.applyEPSColor(commands, style.fill, effectiveFillOpacity)) {
                commands.push('newpath');
                commands.push(pathBody);
                commands.push(fillRule);
            }
            commands.push('grestore');
        }

        if (hasStroke) {
            commands.push('gsave');
            if (this.applyEPSColor(commands, style.stroke, effectiveStrokeOpacity)) {
                commands.push(`${this.formatEPSNumber(parseFloat(style.strokeWidth || '1') || 1)} setlinewidth`);
                commands.push('1 setlinejoin');
                commands.push('1 setlinecap');
                commands.push('newpath');
                commands.push(pathBody);
                commands.push('stroke');
            }
            commands.push('grestore');
        }
    },

    getRectPathData(element) {
        const x = parseFloat(element.getAttribute('x') || '0');
        const y = parseFloat(element.getAttribute('y') || '0');
        const width = parseFloat(element.getAttribute('width') || '0');
        const height = parseFloat(element.getAttribute('height') || '0');
        const rx = parseFloat(element.getAttribute('rx') || '0');
        const ry = parseFloat(element.getAttribute('ry') || element.getAttribute('rx') || '0');

        if (!rx && !ry) {
            return `M ${x} ${y} H ${x + width} V ${y + height} H ${x} Z`;
        }

        const clampedRx = Math.min(rx || ry, width / 2);
        const clampedRy = Math.min(ry || rx, height / 2);

        return [
            `M ${x + clampedRx} ${y}`,
            `H ${x + width - clampedRx}`,
            `A ${clampedRx} ${clampedRy} 0 0 1 ${x + width} ${y + clampedRy}`,
            `V ${y + height - clampedRy}`,
            `A ${clampedRx} ${clampedRy} 0 0 1 ${x + width - clampedRx} ${y + height}`,
            `H ${x + clampedRx}`,
            `A ${clampedRx} ${clampedRy} 0 0 1 ${x} ${y + height - clampedRy}`,
            `V ${y + clampedRy}`,
            `A ${clampedRx} ${clampedRy} 0 0 1 ${x + clampedRx} ${y}`,
            'Z'
        ].join(' ');
    },

    getLinePathData(element) {
        const x1 = parseFloat(element.getAttribute('x1') || '0');
        const y1 = parseFloat(element.getAttribute('y1') || '0');
        const x2 = parseFloat(element.getAttribute('x2') || '0');
        const y2 = parseFloat(element.getAttribute('y2') || '0');
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    },

    parseSVGTransform(transformValue) {
        const transforms = [];
        const transformPattern = /(translate|scale|rotate)\(([^)]+)\)/g;
        let match = null;

        while ((match = transformPattern.exec(transformValue)) !== null) {
            transforms.push({
                type: match[1],
                values: match[2]
                    .split(/[\s,]+/)
                    .filter(Boolean)
                    .map(Number)
            });
        }

        return transforms;
    },

    applyEPSTransforms(commands, transforms) {
        for (const transform of transforms) {
            switch (transform.type) {
                case 'translate': {
                    const [x = 0, y = 0] = transform.values;
                    commands.push(`${this.formatEPSNumber(x)} ${this.formatEPSNumber(y)} translate`);
                    break;
                }
                case 'scale': {
                    const [x = 1, y = x] = transform.values;
                    commands.push(`${this.formatEPSNumber(x)} ${this.formatEPSNumber(y)} scale`);
                    break;
                }
                case 'rotate': {
                    const [angle = 0, cx = 0, cy = 0] = transform.values;
                    if (transform.values.length > 1) {
                        commands.push(`${this.formatEPSNumber(cx)} ${this.formatEPSNumber(cy)} translate`);
                        commands.push(`${this.formatEPSNumber(angle)} rotate`);
                        commands.push(`${this.formatEPSNumber(-cx)} ${this.formatEPSNumber(-cy)} translate`);
                    } else {
                        commands.push(`${this.formatEPSNumber(angle)} rotate`);
                    }
                    break;
                }
                default:
                    break;
            }
        }
    },

    resolveSVGStyle(element, inheritedStyle = {}) {
        return {
            fill: this.getSVGPresentationAttribute(element, 'fill', inheritedStyle.fill ?? '#000000'),
            stroke: this.getSVGPresentationAttribute(element, 'stroke', inheritedStyle.stroke ?? 'none'),
            strokeWidth: this.getSVGPresentationAttribute(element, 'stroke-width', inheritedStyle.strokeWidth ?? '1'),
            fillRule: this.getSVGPresentationAttribute(element, 'fill-rule', inheritedStyle.fillRule ?? 'nonzero'),
            opacity: this.getSVGPresentationAttribute(element, 'opacity', inheritedStyle.opacity ?? '1'),
            fillOpacity: this.getSVGPresentationAttribute(element, 'fill-opacity', inheritedStyle.fillOpacity ?? '1'),
            strokeOpacity: this.getSVGPresentationAttribute(element, 'stroke-opacity', inheritedStyle.strokeOpacity ?? '1'),
            fontSize: this.getSVGPresentationAttribute(element, 'font-size', inheritedStyle.fontSize ?? '16'),
            fontWeight: this.getSVGPresentationAttribute(element, 'font-weight', inheritedStyle.fontWeight ?? '400'),
            fontFamily: this.getSVGPresentationAttribute(element, 'font-family', inheritedStyle.fontFamily ?? 'Helvetica, sans-serif'),
            textAnchor: this.getSVGPresentationAttribute(element, 'text-anchor', inheritedStyle.textAnchor ?? 'start'),
            dominantBaseline: this.getSVGPresentationAttribute(element, 'dominant-baseline', inheritedStyle.dominantBaseline ?? 'alphabetic')
        };
    },

    getPostScriptFont(style) {
        const family = String(style.fontFamily || '').split(',')[0].trim().replace(/^['"]|['"]$/g, '').toLowerCase();
        const isBold = String(style.fontWeight || '').includes('bold') || Number(style.fontWeight || '400') >= 600;

        if (family.includes('times')) {
            return isBold ? 'Times-Bold' : 'Times-Roman';
        }

        if (family.includes('courier') || family.includes('mono')) {
            return isBold ? 'Courier-Bold' : 'Courier';
        }

        return isBold ? 'Helvetica-Bold' : 'Helvetica';
    },

    emitEPSText(element, style, commands) {
        const textContent = element.textContent || '';
        if (!textContent.trim()) {
            return;
        }

        const x = parseFloat(element.getAttribute('x') || '0');
        const y = parseFloat(element.getAttribute('y') || '0');
        const fontSize = parseFloat(style.fontSize || '16');
        const transforms = this.parseSVGTransform(element.getAttribute('transform') || '');
        const rotation = transforms.find(transform => transform.type === 'rotate');

        commands.push('gsave');

        if (rotation) {
            const [angle = 0, cx = x, cy = y] = rotation.values;
            commands.push(`${this.formatEPSNumber(cx)} ${this.formatEPSNumber(cy)} translate`);
            commands.push(`${this.formatEPSNumber(-angle)} rotate`);
            commands.push(`${this.formatEPSNumber(-cx)} ${this.formatEPSNumber(-cy)} translate`);
        }

        if (!this.applyEPSColor(commands, style.fill, Number(style.opacity || '1') * Number(style.fillOpacity || '1'))) {
            commands.push('grestore');
            return;
        }

        commands.push('1 -1 scale');
        commands.push(`/${this.getPostScriptFont(style)} findfont ${this.formatEPSNumber(fontSize)} scalefont setfont`);
        commands.push(`${this.formatEPSNumber(x)} ${this.formatEPSNumber(-y)} moveto`);

        const textAnchor = String(style.textAnchor || 'start').toLowerCase();
        if (textAnchor === 'middle') {
            commands.push(`(${this.escapePostScriptString(textContent)}) dup stringwidth pop 2 div neg 0 rmoveto`);
        } else if (textAnchor === 'end') {
            commands.push(`(${this.escapePostScriptString(textContent)}) dup stringwidth pop neg 0 rmoveto`);
        }

        if (String(style.dominantBaseline || '').toLowerCase() === 'middle') {
            commands.push(`0 ${this.formatEPSNumber(-fontSize * 0.35)} rmoveto`);
        }

        commands.push(`(${this.escapePostScriptString(textContent)}) show`);
        commands.push('grestore');
    },

    emitSVGElementToEPS(element, inheritedStyle, commands) {
        const tagName = element.tagName.toLowerCase();
        const style = this.resolveSVGStyle(element, inheritedStyle);

        if (tagName === 'text') {
            this.emitEPSText(element, style, commands);
            return;
        }

        let pathData = null;
        if (tagName === 'path') {
            pathData = element.getAttribute('d');
        } else if (tagName === 'rect') {
            pathData = this.getRectPathData(element);
        } else if (tagName === 'line') {
            pathData = this.getLinePathData(element);
        }

        if (!pathData) {
            return;
        }

        this.emitEPSPathFromSVGData(pathData, style, commands);
    },

    appendSVGTreeToEPS(element, inheritedStyle, commands) {
        const tagName = element.tagName.toLowerCase();
        const transformValue = element.getAttribute('transform');
        const style = this.resolveSVGStyle(element, inheritedStyle);

        if (tagName === 'image') {
            throw new Error('Embedded SVG images require raster EPS fallback.');
        }

        if ((tagName === 'g' || transformValue) && tagName !== 'text') {
            commands.push('gsave');
            if (transformValue) {
                this.applyEPSTransforms(commands, this.parseSVGTransform(transformValue));
            }
        }

        if (tagName === 'svg' || tagName === 'g') {
            for (const child of element.children) {
                this.appendSVGTreeToEPS(child, style, commands);
            }
        } else {
            this.emitSVGElementToEPS(element, style, commands);
        }

        if ((tagName === 'g' || transformValue) && tagName !== 'text') {
            commands.push('grestore');
        }
    },

    buildVectorEPSDocument(svgMarkup, fallbackWidth, fallbackHeight) {
        const svgDocument = new DOMParser().parseFromString(svgMarkup, 'image/svg+xml');
        if (svgDocument.querySelector('parsererror')) {
            throw new Error('Unable to parse SVG markup for EPS export.');
        }

        const svgElement = svgDocument.documentElement;
        const viewBox = this.parseViewBox(svgElement, fallbackWidth, fallbackHeight);
        const width = Math.ceil(viewBox.width);
        const height = Math.ceil(viewBox.height);
        const commands = [
            '%!PS-Adobe-3.0 EPSF-3.0',
            `%%BoundingBox: 0 0 ${width} ${height}`,
            `%%HiResBoundingBox: 0 0 ${this.formatEPSNumber(viewBox.width)} ${this.formatEPSNumber(viewBox.height)}`,
            '%%Creator: QR Code Generator',
            '%%LanguageLevel: 2',
            '%%Pages: 1',
            '%%EndComments',
            'gsave',
            `0 ${this.formatEPSNumber(viewBox.height)} translate`,
            '1 -1 scale'
        ];

        if (viewBox.minX || viewBox.minY) {
            commands.push(`${this.formatEPSNumber(-viewBox.minX)} ${this.formatEPSNumber(-viewBox.minY)} translate`);
        }

        this.appendSVGTreeToEPS(svgElement, {}, commands);
        commands.push('grestore', 'showpage', '%%EOF');
        return commands.join('\n');
    },

    async buildPreviewEPSBlob(state, size = state.displaySize) {
        const svgMarkup = this.buildPreviewSVGMarkup(state, size);

        try {
            const epsDocument = this.buildVectorEPSDocument(svgMarkup, size, size);
            return new Blob([epsDocument], { type: 'application/postscript' });
        } catch (error) {
            console.warn('Falling back to raster EPS export.', error);
            return this.buildRasterPreviewEPSBlob(state, size);
        }
    },

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('Unable to load QR preview image.'));
            image.src = src;
        });
    },

    async copyText(text) {
        if (typeof QRShareLink !== 'undefined' && typeof QRShareLink.copyToClipboard === 'function') {
            return QRShareLink.copyToClipboard(text);
        }

        if (!navigator.clipboard?.writeText) {
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            return false;
        }
    },

    supportsClipboardItems() {
        return Boolean(navigator.clipboard?.write) && typeof ClipboardItem !== 'undefined';
    },

    async copyBlobToClipboard(blob, mimeType) {
        if (!this.supportsClipboardItems()) {
            return false;
        }

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    [mimeType]: blob
                })
            ]);
            return true;
        } catch (error) {
            return false;
        }
    },

    showToast(message, tone = 'success') {
        if (typeof QRShareLink !== 'undefined' && typeof QRShareLink.showToast === 'function') {
            QRShareLink.showToast(message, tone);
            return;
        }

        if (tone === 'error') {
            alert(message);
        }
    },

    async exportPreviewAsPDF(state, exportSize, filename = 'qrcode.pdf') {
        const jsPDF = window.jspdf?.jsPDF;
        if (!jsPDF) {
            this.showToast(I18n.translateString('PDF export is not available right now.'), 'error');
            return false;
        }

        const pngBlob = await this.buildPreviewPNGBlob(state, exportSize);
        if (!pngBlob) {
            throw new Error('Unable to create PDF export.');
        }

        const imageDataUrl = await this.blobToDataUrl(pngBlob);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
            compress: true
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = Math.max(24, Math.round(Math.min(pageWidth, pageHeight) * 0.06));
        const imageSize = Math.min(pageWidth, pageHeight) - (margin * 2);
        const x = (pageWidth - imageSize) / 2;
        const y = (pageHeight - imageSize) / 2;

        pdf.addImage(imageDataUrl, 'PNG', x, y, imageSize, imageSize, undefined, 'FAST');
        pdf.save(filename);
        return true;
    },

    async exportPreviewAsWebP(state, exportSize, filename = 'qrcode.webp') {
        const webpBlob = await this.buildPreviewWebPBlob(state, exportSize);
        if (!webpBlob) {
            throw new Error('Unable to create WebP export.');
        }

        downloadBlob(webpBlob, filename);
        return true;
    },

    async exportPreviewAsEPS(state, exportSize, filename = 'qrcode.eps') {
        const epsBlob = await this.buildPreviewEPSBlob(state, exportSize);
        if (!epsBlob) {
            throw new Error('Unable to create EPS export.');
        }

        downloadBlob(epsBlob, filename);
        return true;
    },

    async exportContainerAsPDF(qrContainer, exportSize, filename = 'qrcode.pdf') {
        const state = this.getPreviewStateForContainer(qrContainer);
        if (!state) {
            this.showToast(I18n.translateString('Generate a QR code first to export a PDF.'), 'error');
            return false;
        }

        try {
            return await this.exportPreviewAsPDF(state, exportSize, filename);
        } catch (error) {
            console.error('QR PDF export failed.', error);
            this.showToast(I18n.translateString('QR preview action failed.'), 'error');
            return false;
        }
    },

    async exportContainerAsWebP(qrContainer, exportSize, filename = 'qrcode.webp') {
        const state = this.getPreviewStateForContainer(qrContainer);
        if (!state) {
            this.showToast(I18n.translateString('Generate a QR code first to export a WebP.'), 'error');
            return false;
        }

        try {
            return await this.exportPreviewAsWebP(state, exportSize, filename);
        } catch (error) {
            console.error('QR WebP export failed.', error);
            this.showToast(I18n.translateString('QR preview action failed.'), 'error');
            return false;
        }
    },

    async exportContainerAsEPS(qrContainer, exportSize, filename = 'qrcode.eps') {
        const state = this.getPreviewStateForContainer(qrContainer);
        if (!state) {
            this.showToast(I18n.translateString('Generate a QR code first to export an EPS.'), 'error');
            return false;
        }

        try {
            return await this.exportPreviewAsEPS(state, exportSize, filename);
        } catch (error) {
            console.error('QR EPS export failed.', error);
            this.showToast(I18n.translateString('QR preview action failed.'), 'error');
            return false;
        }
    },

    async handleMenuAction(action) {
        const state = this.getActivePreviewState();
        this.hideContextMenu();

        if (!state) {
            return;
        }

        try {
            switch (action) {
                case 'open-image': {
                    window.open(this.buildPreviewSVGDataUrl(state), '_blank', 'noopener,noreferrer');
                    break;
                }
                case 'save-png': {
                    const exportSize = this.getExportSizeOrNull();
                    if (!exportSize) {
                        return;
                    }

                    const pngBlob = await this.buildPreviewPNGBlob(state, exportSize);
                    if (!pngBlob) {
                        throw new Error('Unable to create PNG export.');
                    }

                    downloadBlob(pngBlob, 'qrcode.png');
                    break;
                }
                case 'save-webp': {
                    const exportSize = this.getExportSizeOrNull();
                    if (!exportSize) {
                        return;
                    }

                    await this.exportPreviewAsWebP(state, exportSize);
                    break;
                }
                case 'save-eps': {
                    const exportSize = this.getExportSizeOrNull();
                    if (!exportSize) {
                        return;
                    }

                    await this.exportPreviewAsEPS(state, exportSize);
                    break;
                }
                case 'save-pdf': {
                    const exportSize = this.getExportSizeOrNull();
                    if (!exportSize) {
                        return;
                    }

                    await this.exportPreviewAsPDF(state, exportSize);
                    break;
                }
                case 'save-svg': {
                    const exportSize = this.getExportSizeOrNull();
                    if (!exportSize) {
                        return;
                    }

                    const svgMarkup = this.buildPreviewSVGMarkup(state, exportSize);
                    downloadBlob(new Blob([svgMarkup], { type: 'image/svg+xml' }), 'qrcode.svg');
                    break;
                }
                case 'copy-png': {
                    if (!this.supportsClipboardItems()) {
                        this.showToast(I18n.translateString('Copying images is not supported in this browser.'), 'error');
                        return;
                    }

                    const exportSize = this.getExportSizeOrNull();
                    if (!exportSize) {
                        return;
                    }

                    const pngBlob = await this.buildPreviewPNGBlob(state, exportSize);
                    if (!pngBlob) {
                        throw new Error('Unable to create image for clipboard.');
                    }

                    const copied = await this.copyBlobToClipboard(pngBlob, 'image/png');
                    if (!copied) {
                        this.showToast(I18n.translateString('Failed to copy PNG image.'), 'error');
                        return;
                    }

                    this.showToast(I18n.translateString('QR PNG image copied.'));
                    break;
                }
                case 'copy-webp': {
                    if (!this.supportsClipboardItems()) {
                        this.showToast(I18n.translateString('Copying images is not supported in this browser.'), 'error');
                        return;
                    }

                    const exportSize = this.getExportSizeOrNull();
                    if (!exportSize) {
                        return;
                    }

                    const webpBlob = await this.buildPreviewWebPBlob(state, exportSize);
                    if (!webpBlob) {
                        throw new Error('Unable to create WebP image for clipboard.');
                    }

                    const copied = await this.copyBlobToClipboard(webpBlob, 'image/webp');
                    if (!copied) {
                        this.showToast(I18n.translateString('Failed to copy WebP image.'), 'error');
                        return;
                    }

                    this.showToast(I18n.translateString('QR WebP image copied.'));
                    break;
                }
                case 'copy-svg': {
                    if (!this.supportsClipboardItems()) {
                        this.showToast(I18n.translateString('Copying images is not supported in this browser.'), 'error');
                        return;
                    }

                    const exportSize = this.getExportSizeOrNull();
                    if (!exportSize) {
                        return;
                    }

                    const svgMarkup = this.buildPreviewSVGMarkup(state, exportSize);
                    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml' });
                    const copied = await this.copyBlobToClipboard(svgBlob, 'image/svg+xml');
                    if (!copied) {
                        this.showToast(I18n.translateString('Failed to copy SVG image.'), 'error');
                        return;
                    }

                    this.showToast(I18n.translateString('QR SVG image copied.'));
                    break;
                }
                case 'copy-image-base64': {
                    const copied = await this.copyText(this.buildPreviewSVGDataUrl(state));
                    if (!copied) {
                        this.showToast(I18n.translateString('Failed to copy image as Base64.'), 'error');
                        return;
                    }

                    this.showToast(I18n.translateString('QR image copied as Base64.'));
                    break;
                }
                case 'copy-content': {
                    const copied = await this.copyText(state.qrText);
                    if (!copied) {
                        this.showToast(I18n.translateString('Failed to copy QR Code Content.'), 'error');
                        return;
                    }

                    this.showToast(I18n.translateString('QR Code Content copied.'));
                    break;
                }
                case 'copy-share-link': {
                    if (typeof QRShareLink === 'undefined' || typeof QRShareLink.buildShareUrl !== 'function') {
                        this.showToast(I18n.translateString('Share links are not available on this page.'), 'error');
                        return;
                    }

                    const shareUrl = QRShareLink.buildShareUrl({ kiosk: true });
                    if (!shareUrl) {
                        this.showToast(I18n.translateString('Generate a QR code first to create a share link.'), 'error');
                        return;
                    }

                    const copied = await this.copyText(shareUrl);
                    if (!copied) {
                        this.showToast(I18n.translateString('Failed to copy share link.'), 'error');
                        return;
                    }

                    this.showToast(I18n.translateString('Kiosk share link copied.'));
                    break;
                }
                case 'copy-editable-link': {
                    if (typeof QRShareLink === 'undefined' || typeof QRShareLink.buildShareUrl !== 'function') {
                        this.showToast(I18n.translateString('Share links are not available on this page.'), 'error');
                        return;
                    }

                    const shareUrl = QRShareLink.buildShareUrl({ kiosk: false });
                    if (!shareUrl) {
                        this.showToast(I18n.translateString('Generate a QR code first to create a share link.'), 'error');
                        return;
                    }

                    const copied = await this.copyText(shareUrl);
                    if (!copied) {
                        this.showToast(I18n.translateString('Failed to copy editable link.'), 'error');
                        return;
                    }

                    this.showToast(I18n.translateString('Editable share link copied.'));
                    break;
                }
                default:
                    break;
            }
        } catch (error) {
            console.error('QR preview action failed.', error);
            this.showToast(I18n.translateString('QR preview action failed.'), 'error');
        }
    },

    finalize(qrContainer, frameType, displaySize, qrCodeInstance, onComplete) {
        if (!qrContainer) {
            return;
        }

        const nextToken = (this.renderTokens.get(qrContainer) || 0) + 1;
        this.renderTokens.set(qrContainer, nextToken);

        const renderPreview = (frameCount = 0) => {
            if (this.renderTokens.get(qrContainer) !== nextToken) {
                return;
            }

            const canvas = qrContainer.querySelector('canvas');
            if (!canvas) {
                if (frameCount < this.maxCanvasWaitFrames) {
                    window.requestAnimationFrame(() => renderPreview(frameCount + 1));
                }
                return;
            }

            QRFrames.updateFramePreviews(canvas);

            const qrOptions = qrCodeInstance?._htOption ? { ...qrCodeInstance._htOption } : null;
            const qrText = qrOptions?.text ?? qrContainer.title ?? '';
            if (frameType === 'none' && qrOptions) {
                qrOptions.colorLight = 'rgba(255, 255, 255, 0)';
            }
            const previewState = {
                frameType,
                displaySize,
                qrOptions,
                qrText,
                qrCanvas: this.cloneCanvas(canvas)
            };

            const canRenderFramedSVGPreview = frameType === 'none'
                || !window.QRFrames
                || !window.QRFrames.isDecorativeFrame(frameType);

            if (qrOptions && qrText && canRenderFramedSVGPreview) {
                const qrSVG = buildNativeQRCodeSVG({
                    text: qrText,
                    size: displaySize,
                    qrOptions
                });
                const previewSVG = frameType && window.QRFrames
                    ? QRFrames.wrapSVGWithFrame(qrSVG, frameType, displaySize)
                    : qrSVG;
                const previewElement = this.createSVGPreviewElement(previewSVG, displaySize);

                if (previewElement) {
                    qrContainer.replaceChildren(previewElement);
                    this.attachPreviewSurface(qrContainer, previewElement, previewState, onComplete);
                    return;
                }
            }

            if (frameType !== 'none') {
                const framedCanvas = QRFrames.applyFrame(canvas, frameType, displaySize);
                qrContainer.innerHTML = '';
                qrContainer.appendChild(framedCanvas);
                this.attachPreviewSurface(qrContainer, framedCanvas, previewState, onComplete);
                return;
            }

            this.attachPreviewSurface(qrContainer, canvas, previewState, onComplete);
        };

        window.requestAnimationFrame(() => renderPreview());
    }
};
