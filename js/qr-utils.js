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
        alert(I18n.translateString('No QR code to download'));
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
        alert(I18n.translateString('No QR code to download'));
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

const QRCodeExportControls = {
    CUSTOM_OPTION_VALUE: 'custom',
    MIN_SIZE: 256,
    MAX_SIZE: 16384,
    DEFAULT_CUSTOM_SIZE: 3200,

    init(root = document) {
        const exportSizeSelect = root.querySelector('#exportSize');
        if (!exportSizeSelect || exportSizeSelect.dataset.customExportInitialized === 'true') {
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

    finalize(qrContainer, frameType, displaySize, onComplete) {
        if (!qrContainer) {
            return;
        }

        const nextToken = (this.renderTokens.get(qrContainer) || 0) + 1;
        this.renderTokens.set(qrContainer, nextToken);

        window.setTimeout(() => {
            if (this.renderTokens.get(qrContainer) !== nextToken) {
                return;
            }

            const canvas = qrContainer.querySelector('canvas');
            if (!canvas) {
                return;
            }

            QRFrames.updateFramePreviews(canvas);

            if (frameType !== 'none') {
                const framedCanvas = QRFrames.applyFrame(canvas, frameType, displaySize);
                qrContainer.innerHTML = '';
                qrContainer.appendChild(framedCanvas);
                onComplete?.(framedCanvas);
                return;
            }

            onComplete?.(canvas);
        }, 100);
    }
};

const QRCodeLogoControls = {
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
    ICONS_ASSET_PATH: 'assets/icons',
    logoDataUrl: '',
    logoImage: null,
    logoBackgroundColor: '#ffffff',
    activeLogoLabel: '',
    selectedPresetId: '',
    logoPresets: null,
    assetPresetSlugSet: null,
    sizePercent: 22,
    assetPresetNameOverrides: {
        '1and1': '1&1',
        '1dot1dot1dot1': '1.1.1.1',
        '3m': '3M',
        '4chan': '4chan',
        '4d': '4D',
        '500px': '500px',
        '7zip': '7-Zip',
        '99designs': '99designs',
        '9gag': '9GAG',
        atandt: 'AT&T',
        c: 'C',
        cplusplus: 'C++',
        cplusplusbuilder: 'C++Builder',
        css: 'CSS',
        d3: 'D3.js',
        dotnet: '.NET',
        e3: 'E3',
        f1: 'F1',
        f5: 'F5',
        g2: 'G2',
        h2database: 'H2',
        h3: 'H3',
        html5: 'HTML5',
        i18next: 'i18next',
        i3: 'i3',
        k3s: 'K3s',
        k6: 'k6',
        mdnwebdocs: 'MDN Web Docs',
        nextdotjs: 'Next.js',
        nodedotjs: 'Node.js',
        o2: 'O2',
        p5dotjs: 'p5.js',
        qt: 'Qt',
        r: 'R',
        r3: 'R3',
        svgdotjs: 'SVG.js',
        tv4play: 'TV4 Play',
        v0: 'v0',
        v8: 'V8',
        w3schools: 'W3Schools',
        web3dotjs: 'Web3.js',
        x: 'X',
        xdotorg: 'X.Org'
    },

    getPresetMarkup() {
        const presets = this.getLogoPresets();

        presets.forEach(preset => {
            if (preset.hex) {
                const invert = !this.isLightColor(preset.hex);
                preset.thumbCls = invert ? ' logo-preset-thumb-branded logo-preset-thumb-invert' : ' logo-preset-thumb-branded';
                preset.thumbStyle = ` style="background-color: #${preset.hex}"`;
            } else {
                preset.thumbCls = '';
                preset.thumbStyle = '';
            }
        });

        return `
            <div class="logo-presets-panel">
                <input type="file" class="logo-upload-input" id="qrLogoInput" accept="image/png,image/jpeg,image/svg+xml">
                <div class="logo-presets-header">
                    <div class="logo-presets-title">${I18n.translateString('Logos')}</div>
                </div>
                <div class="logo-presets-search">
                    <input type="search" class="form-input logo-presets-search-input" id="logoPresetSearchInput" placeholder="${I18n.translateString('Search logos')}" aria-label="${I18n.translateString('Filter logos by name')}">
                </div>
                <div class="logo-presets-grid" id="qrLogoPresets">
                    <button type="button" class="logo-preset-button logo-preset-button-action" data-logo-action="clear" data-logo-preset-name="none remove clear" aria-label="${I18n.translateString('Clear logo')}">
                        <span class="logo-preset-thumb logo-preset-thumb-action"></span>
                        <span class="logo-preset-name">${I18n.translateString('None')}</span>
                    </button>
                    <button type="button" class="logo-preset-button logo-preset-button-action" data-logo-action="upload" data-logo-preset-name="upload custom file logo" aria-label="${I18n.translateString('Upload logo')}">
                        <span class="logo-preset-thumb logo-preset-thumb-action logo-preset-thumb-upload">
                            <i class="bi bi-upload"></i>
                        </span>
                        <span class="logo-preset-name">${I18n.translateString('Upload logo')}</span>
                    </button>
                    ${presets.map(preset => `
                        <button type="button" class="logo-preset-button" data-logo-preset="${preset.id}" data-logo-preset-name="${`${preset.name} ${preset.slug || preset.id}`.toLowerCase()}" aria-label="${preset.name} logo preset">
                            <span class="logo-preset-thumb${preset.thumbCls}"${preset.thumbStyle}>
                                <img src="${preset.dataUrl}" alt="${preset.name} logo preset" loading="lazy">
                            </span>
                            <span class="logo-preset-name">${preset.name}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="form-hint logo-presets-empty-state" id="logoPresetSearchEmpty" hidden>${I18n.translateString('No logos match your search.')}</div>
            </div>
        `;
    },

    getLogoPresets() {
        if (this.logoPresets) {
            return this.logoPresets;
        }

        const manualPresets = [];

        if (!this.hasAssetPreset('twitter')) {
            manualPresets.push(this.createTwitterPreset());
        }

        if (!this.hasAssetPreset('linkedin')) {
            manualPresets.push(this.createLinkedInPreset());
        }

        if (!this.hasAssetPreset('outlook')) {
            manualPresets.push(this.createOutlookPreset());
        }

        if (this.hasAssetPreset('devdotto')) {
            manualPresets.push(this.createDevToPreset());
        }

        this.logoPresets = [
            ...manualPresets,
            ...this.createCatalogIconPresets()
        ];

        return this.logoPresets;
    },

    getAssetPresetSlugs() {
        return Array.isArray(window.QRCodeLogoPresetData)
            ? window.QRCodeLogoPresetData.map(entry => entry[0])
            : [];
    },

    getAssetPresetSlugSet() {
        if (!this.assetPresetSlugSet) {
            this.assetPresetSlugSet = new Set(this.getAssetPresetSlugs());
        }

        return this.assetPresetSlugSet;
    },

    hasAssetPreset(slug) {
        return this.getAssetPresetSlugSet().has(slug);
    },

    getAssetPresetHex(slug) {
        if (!this.assetPresetHexMap) {
            this.assetPresetHexMap = new Map(
                Array.isArray(window.QRCodeLogoPresetData) ? window.QRCodeLogoPresetData : []
            );
        }
        return this.assetPresetHexMap.get(slug) || '';
    },

    isLightColor(hex) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) > 186;
    },

    getAssetPresetName(slug) {
        if (this.assetPresetNameOverrides[slug]) {
            return this.assetPresetNameOverrides[slug];
        }

        const normalized = slug
            .replace(/_/g, ' ')
            .replace(/dotjs/g, '.js')
            .replace(/dotio/g, '.io')
            .replace(/dotcom/g, '.com')
            .replace(/dotorg/g, '.org')
            .replace(/dotnet/g, '.net')
            .replace(/dotrs/g, '.rs')
            .replace(/dotgg/g, '.gg')
            .replace(/dotcv/g, '.cv')
            .replace(/dotde/g, '.de')
            .replace(/dotas/g, '.as')
            .replace(/dotat/g, '.at')
            .replace(/dotco/g, '.co')
            .replace(/dotsh/g, '.sh')
            .replace(/dotlv/g, '.lv')
            .replace(/([0-9])([a-z])/gi, '$1 $2')
            .replace(/([a-z])([0-9])/gi, '$1 $2')
            .replace(/\s+/g, ' ')
            .trim();

        return normalized
            .split(' ')
            .filter(Boolean)
            .map(token => this.formatAssetPresetToken(token))
            .join(' ');
    },

    formatAssetPresetToken(token) {
        if (!token) {
            return '';
        }

        if (token.includes('.')) {
            return token
                .split('.')
                .map((segment, index) => {
                    if (!segment) {
                        return '';
                    }

                    if (segment.length <= 3) {
                        return segment.toUpperCase();
                    }

                    return index === 0
                        ? segment.charAt(0).toUpperCase() + segment.slice(1)
                        : segment.toLowerCase();
                })
                .join('.');
        }

        if (/^[0-9.+&-]+$/.test(token)) {
            return token;
        }

        if (token.length <= 3 && /^[a-z0-9.+&-]+$/i.test(token)) {
            return token.toUpperCase();
        }

        return token.charAt(0).toUpperCase() + token.slice(1);
    },

    createContainedIconPreset({
        id,
        name,
        backgroundMarkup = '',
        iconMarkup,
        iconWidth,
        iconHeight,
        box = { x: 18, y: 18, width: 60, height: 60 }
    }) {
        const scale = Math.min(box.width / iconWidth, box.height / iconHeight);
        const translateX = box.x + ((box.width - (iconWidth * scale)) / 2);
        const translateY = box.y + ((box.height - (iconHeight * scale)) / 2);
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
                ${backgroundMarkup}
                <g transform="translate(${translateX.toFixed(2)} ${translateY.toFixed(2)}) scale(${scale.toFixed(4)})">
                    ${iconMarkup}
                </g>
            </svg>
        `;

        return { id, name, dataUrl: this.svgToDataUrl(svg) };
    },

    createTextBadgePreset({
        id,
        name,
        text,
        background = '#111111',
        foreground = '#ffffff',
        shape = 'rounded'
    }) {
        const frameMarkup = shape === 'circle'
            ? `<circle cx="48" cy="48" r="42" fill="${background}"/>`
            : `<rect x="12" y="12" width="72" height="72" rx="18" fill="${background}"/>`;
        const fontSize = text.length >= 4 ? 23 : text.length === 3 ? 27 : text.length === 2 ? 32 : 40;
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
                ${frameMarkup}
                <text x="48" y="54" text-anchor="middle" dominant-baseline="middle" fill="${foreground}" font-size="${fontSize}" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" letter-spacing="${text.length >= 3 ? '-1.2' : '-0.6'}">${text}</text>
            </svg>
        `;

        return { id, name, dataUrl: this.svgToDataUrl(svg) };
    },

    createAssetSvgPreset({ id, name, slug = id, hex = '' }) {
        const presetId = id || slug;
        return {
            id: presetId,
            slug,
            name,
            hex,
            dataUrl: `${this.ICONS_ASSET_PATH}/${slug}.svg`
        };
    },

    createCatalogIconPresets() {
        const data = Array.isArray(window.QRCodeLogoPresetData) ? window.QRCodeLogoPresetData : [];
        return data.map(([slug, hex]) => this.createAssetSvgPreset({
            id: slug,
            slug,
            hex: hex || '',
            name: this.getAssetPresetName(slug)
        }));
    },

    createTwitterPreset() {
        return this.createContainedIconPreset({
            id: 'twitter',
            name: 'Twitter',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#1d9bf0"/>',
            iconWidth: 512,
            iconHeight: 512,
            box: { x: 22, y: 22, width: 52, height: 52 },
            iconMarkup: '<path fill="#ffffff" d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103l0-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"/>'
        });
    },

    createXPreset() {
        return this.createContainedIconPreset({
            id: 'x',
            name: 'X',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#111111"/>',
            iconWidth: 448,
            iconHeight: 512,
            box: { x: 23, y: 21, width: 50, height: 54 },
            iconMarkup: '<path fill="#ffffff" d="M357.2 48L427.8 48 273.6 224.2 455 464 313 464 201.7 318.6 74.5 464 3.8 464 168.7 275.5-5.2 48 140.4 48 240.9 180.9 357.2 48zM332.4 421.8l39.1 0-252.4-333.8-42 0 255.3 333.8z"/>'
        });
    },

    createYouTubePreset() {
        return this.createContainedIconPreset({
            id: 'youtube',
            name: 'YouTube',
            backgroundMarkup: '<rect x="18" y="25" width="60" height="42" rx="14" fill="#ffffff"/>',
            iconWidth: 576,
            iconHeight: 512,
            box: { x: 18, y: 25, width: 60, height: 42 },
            iconMarkup: '<path fill="#ff0000" d="M549.7 124.1C543.5 100.4 524.9 81.8 501.4 75.5 458.9 64 288.1 64 288.1 64S117.3 64 74.7 75.5C51.2 81.8 32.7 100.4 26.4 124.1 15 167 15 256.4 15 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6l0-162.4 142.7 81.2-142.7 81.2z"/>'
        });
    },

    createInstagramPreset() {
        return this.createContainedIconPreset({
            id: 'instagram',
            name: 'Instagram',
            backgroundMarkup: `
                <defs>
                    <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#feda75"/>
                        <stop offset="45%" stop-color="#fa7e1e"/>
                        <stop offset="75%" stop-color="#d62976"/>
                        <stop offset="100%" stop-color="#4f5bd5"/>
                    </linearGradient>
                </defs>
                <rect x="10" y="10" width="76" height="76" rx="22" fill="url(#igGradient)"/>
            `,
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 23, y: 23, width: 50, height: 50 },
            iconMarkup: '<path fill="#ffffff" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>'
        });
    },

    createTikTokPreset() {
        return this.createContainedIconPreset({
            id: 'tiktok',
            name: 'TikTok',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="18" fill="#111111"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 24, y: 18, width: 48, height: 60 },
            iconMarkup: `
                <path fill="#25f4ee" transform="translate(-0.55 -0.35)" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                <path fill="#fe2c55" transform="translate(0.55 0.35)" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                <path fill="#ffffff" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            `
        });
    },

    createLinkedInPreset() {
        return this.createContainedIconPreset({
            id: 'linkedin',
            name: 'LinkedIn',
            backgroundMarkup: '<rect x="14" y="14" width="68" height="68" rx="16" fill="#0a66c2"/>',
            iconWidth: 448,
            iconHeight: 512,
            box: { x: 24, y: 20, width: 48, height: 56 },
            iconMarkup: '<path fill="#ffffff" d="M100.3 448l-92.9 0 0-299.1 92.9 0 0 299.1zM53.8 108.1C24.1 108.1 0 83.5 0 53.8 0 39.5 5.7 25.9 15.8 15.8s23.8-15.8 38-15.8 27.9 5.7 38 15.8 15.8 23.8 15.8 38c0 29.7-24.1 54.3-53.8 54.3zM447.9 448l-92.7 0 0-145.6c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7l0 148.1-92.8 0 0-299.1 89.1 0 0 40.8 1.3 0c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3l0 164.3-.1 0z"/>'
        });
    },

    createSnapchatPreset() {
        return this.createContainedIconPreset({
            id: 'snapchat',
            name: 'Snapchat',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#fffc00"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 20, y: 19, width: 56, height: 58 },
            iconMarkup: '<path fill="#111111" d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>'
        });
    },

    createPinterestPreset() {
        return this.createContainedIconPreset({
            id: 'pinterest',
            name: 'Pinterest',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#e60023"/>',
            iconWidth: 384,
            iconHeight: 512,
            box: { x: 28, y: 18, width: 40, height: 58 },
            iconMarkup: '<path fill="#ffffff" d="M204 6.5c-102.6 0-204 68.4-204 179.1 0 70.4 39.6 110.4 63.6 110.4 9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8 0-99.3-85.8-164.1-180-164.1z"/>'
        });
    },

    createRedditPreset() {
        return this.createContainedIconPreset({
            id: 'reddit',
            name: 'Reddit',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#ff4500"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 18, width: 60, height: 60 },
            iconMarkup: '<path fill="#ffffff" d="M12 0C5.373 0 .029 5.373.029 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/>'
        });
    },

    createDiscordPreset() {
        return this.createContainedIconPreset({
            id: 'discord',
            name: 'Discord',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="18" fill="#5865f2"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 20, width: 60, height: 56 },
            iconMarkup: '<path fill="#ffffff" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>'
        });
    },

    createBlueskyPreset() {
        return this.createContainedIconPreset({
            id: 'bluesky',
            name: 'Bluesky',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#0285ff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 20, width: 60, height: 56 },
            iconMarkup: '<path fill="#ffffff" d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026"/>'
        });
    },

    createMastodonPreset() {
        return this.createContainedIconPreset({
            id: 'mastodon',
            name: 'Mastodon',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="18" fill="#6364ff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 18, width: 60, height: 60 },
            iconMarkup: '<path fill="#ffffff" d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/>'
        });
    },

    createOutlookPreset() {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
                <rect x="10" y="18" width="30" height="60" rx="8" fill="#0f5bd7"/>
                <rect x="36" y="24" width="46" height="48" rx="9" fill="#1f8fff"/>
                <rect x="42" y="30" width="34" height="36" rx="6" fill="#0f78d4"/>
                <path d="M45 36l14 12 14-12" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M45 60l11-9" fill="none" stroke="#8ed0ff" stroke-width="3" stroke-linecap="round"/>
                <path d="M73 60l-11-9" fill="none" stroke="#8ed0ff" stroke-width="3" stroke-linecap="round"/>
                <circle cx="25" cy="48" r="10" fill="none" stroke="#ffffff" stroke-width="5"/>
            </svg>
        `;

        return { id: 'outlook', name: 'Outlook', dataUrl: this.svgToDataUrl(svg) };
    },

    createTelegramPreset() {
        return this.createContainedIconPreset({
            id: 'telegram',
            name: 'Telegram',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#27a7e7"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 19, y: 19, width: 58, height: 58 },
            iconMarkup: '<path fill="#ffffff" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>'
        });
    },

    createApplePreset() {
        return this.createContainedIconPreset({
            id: 'apple',
            name: 'Apple',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#111111"/>',
            iconWidth: 384,
            iconHeight: 512,
            box: { x: 26, y: 18, width: 44, height: 58 },
            iconMarkup: '<path fill="#ffffff" d="M319.1 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7-55.8 .9-115.1 44.5-115.1 133.2 0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.5 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>'
        });
    },

    createGmailPreset() {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
                <rect x="10" y="14" width="76" height="68" rx="18" fill="#ffffff" stroke="#e5e7eb" stroke-width="2.5"/>
                <path d="M24 68V30l24 18 24-18v38" fill="none" stroke="#ea4335" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M24 68V30" fill="none" stroke="#4285f4" stroke-width="7" stroke-linecap="round"/>
                <path d="M72 68V30" fill="none" stroke="#34a853" stroke-width="7" stroke-linecap="round"/>
                <path d="M24 30l24 18 24-18" fill="none" stroke="#fbbc05" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        return { id: 'gmail', name: 'Gmail', dataUrl: this.svgToDataUrl(svg) };
    },

    createWhatsAppPreset() {
        return this.createContainedIconPreset({
            id: 'whatsapp',
            name: 'WhatsApp',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#ffffff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 18, width: 60, height: 60 },
            iconMarkup: '<path fill="#25d366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>'
        });
    },

    createFacebookPreset() {
        return this.createContainedIconPreset({
            id: 'facebook',
            name: 'Facebook',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#1877f2"/>',
            iconWidth: 320,
            iconHeight: 512,
            box: { x: 31, y: 19, width: 34, height: 58 },
            iconMarkup: '<path fill="#ffffff" d="M80 299.3l0 212.7 116 0 0-212.7 86.5 0 18-97.8-104.5 0 0-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 .4 37 1.2l0-88.7C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4l0 42.1-66 0 0 97.8 66 0z"/>'
        });
    },

    createGitHubPreset() {
        return this.createContainedIconPreset({
            id: 'github',
            name: 'GitHub',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#111111"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 19, y: 19, width: 58, height: 58 },
            iconMarkup: '<path fill="#ffffff" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>'
        });
    },

    createMessengerPreset() {
        return this.createContainedIconPreset({
            id: 'messenger',
            name: 'Messenger',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#0084ff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 18, width: 60, height: 60 },
            iconMarkup: '<path fill="#ffffff" d="M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13"/>'
        });
    },

    createTumblrPreset() {
        return this.createContainedIconPreset({
            id: 'tumblr',
            name: 'Tumblr',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="18" fill="#001935"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 27, y: 18, width: 42, height: 60 },
            iconMarkup: '<path fill="#ffffff" d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l.011.002z"/>'
        });
    },

    createTwitchPreset() {
        return this.createContainedIconPreset({
            id: 'twitch',
            name: 'Twitch',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="16" fill="#9146ff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 17, y: 16, width: 62, height: 62 },
            iconMarkup: '<path fill="#ffffff" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>'
        });
    },

    createThreadsPreset() {
        return this.createContainedIconPreset({
            id: 'threads',
            name: 'Threads',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#111111"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 18, width: 60, height: 60 },
            iconMarkup: '<path fill="#ffffff" d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"/>'
        });
    },

    createMediumPreset() {
        return this.createContainedIconPreset({
            id: 'medium',
            name: 'Medium',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="18" fill="#ffffff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 16, y: 16, width: 64, height: 64 },
            iconMarkup: '<path fill="#111111" d="M4.21 0A4.201 4.201 0 0 0 0 4.21v15.58A4.201 4.201 0 0 0 4.21 24h15.58A4.201 4.201 0 0 0 24 19.79v-1.093c-.137.013-.278.02-.422.02-2.577 0-4.027-2.146-4.09-4.832a7.592 7.592 0 0 1 .022-.708c.093-1.186.475-2.241 1.105-3.022a3.885 3.885 0 0 1 1.395-1.1c.468-.237 1.127-.367 1.664-.367h.023c.101 0 .202.004.303.01V4.211A4.201 4.201 0 0 0 19.79 0Zm.198 5.583h4.165l3.588 8.435 3.59-8.435h3.864v.146l-.019.004c-.705.16-1.063.397-1.063 1.254h-.003l.003 10.274c.06.676.424.885 1.063 1.03l.02.004v.145h-4.923v-.145l.019-.005c.639-.144.994-.353 1.054-1.03V7.267l-4.745 11.15h-.261L6.15 7.569v9.445c0 .857.358 1.094 1.063 1.253l.02.004v.147H4.405v-.147l.019-.004c.705-.16 1.065-.397 1.065-1.253V6.987c0-.857-.358-1.094-1.064-1.254l-.018-.004zm19.25 3.668c-1.086.023-1.733 1.323-1.813 3.124H24V9.298a1.378 1.378 0 0 0-.342-.047Zm-1.862 3.632c-.1 1.756.86 3.239 2.204 3.634v-3.634z"/>'
        });
    },

    createBehancePreset() {
        return this.createAssetSvgPreset({
            id: 'behance',
            name: 'Behance',
            slug: 'behance',
            hex: this.getAssetPresetHex('behance')
        });
    },

    createDribbblePreset() {
        return this.createAssetSvgPreset({
            id: 'dribbble',
            name: 'Dribbble',
            slug: 'dribbble',
            hex: this.getAssetPresetHex('dribbble')
        });
    },

    createPatreonPreset() {
        return this.createAssetSvgPreset({
            id: 'patreon',
            name: 'Patreon',
            slug: 'patreon',
            hex: this.getAssetPresetHex('patreon')
        });
    },

    createDevToPreset() {
        return this.createAssetSvgPreset({
            id: 'devto',
            name: 'DEV',
            slug: 'devdotto',
            hex: this.getAssetPresetHex('devdotto')
        });
    },

    createSubstackPreset() {
        return this.createAssetSvgPreset({
            id: 'substack',
            name: 'Substack',
            slug: 'substack',
            hex: this.getAssetPresetHex('substack')
        });
    },

    createNetflixPreset() {
        return this.createAssetSvgPreset({
            id: 'netflix',
            name: 'Netflix',
            slug: 'netflix',
            hex: this.getAssetPresetHex('netflix')
        });
    },

    svgToDataUrl(svg) {
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s{2,}/g, ' ').trim())}`;
    },

    init(root = document) {
        const logoInput = root.querySelector('#qrLogoInput');
        const logoSizeRange = root.querySelector('#qrLogoSizeRange');
        const logoBackgroundColorControl = FrameColorControl.getControl(root, 'logoBackgroundColor');
        const presetSearchInput = root.querySelector('#logoPresetSearchInput');
        const presetEmptyState = root.querySelector('#logoPresetSearchEmpty');
        const sizeValueLabel = root.querySelector('#qrLogoSizeValue');
        const presetButtons = root.querySelectorAll('[data-logo-preset]');
        const actionButtons = root.querySelectorAll('[data-logo-action]');

        if (!logoInput || !logoSizeRange || !sizeValueLabel || !logoBackgroundColorControl) {
            return;
        }

        if (logoInput.dataset.logoControlsInitialized !== 'true') {
            logoInput.addEventListener('change', async event => {
                const [file] = event.target.files || [];
                if (!file) {
                    return;
                }

                const loaded = await this.loadLogoFile(file);
                if (!loaded) {
                    logoInput.value = '';
                    return;
                }

                this.insertUploadedTile(root);
                this.syncUI(root);
                QRCodeFrameControls.triggerActiveFrameRefresh(root);
            });

            logoSizeRange.addEventListener('input', () => {
                this.sizePercent = parseInt(logoSizeRange.value, 10) || 22;
                this.syncUI(root);
                if (this.hasLogo()) {
                    QRCodeFrameControls.triggerActiveFrameRefresh(root);
                }
            });

            FrameColorControl.bindControl(logoBackgroundColorControl, control => {
                this.logoBackgroundColor = FrameColorControl.getValue(control);
                if (this.hasLogo()) {
                    QRCodeFrameControls.triggerActiveFrameRefresh(root);
                }
            });

            presetSearchInput?.addEventListener('input', () => {
                this.applyPresetSearch(root, [...actionButtons, ...presetButtons], presetSearchInput, presetEmptyState);
            });

            logoInput.dataset.logoControlsInitialized = 'true';
        }

        actionButtons.forEach(button => {
            if (button.dataset.logoActionInitialized === 'true') {
                return;
            }

            button.addEventListener('click', () => {
                const action = button.dataset.logoAction;
                if (action === 'upload') {
                    logoInput.click();
                    return;
                }

                if (action === 'clear') {
                    this.clearLogo(root);
                    QRCodeFrameControls.triggerActiveFrameRefresh(root);
                }
            });

            button.dataset.logoActionInitialized = 'true';
        });

        presetButtons.forEach(button => {
            if (button.dataset.logoPresetInitialized === 'true') {
                return;
            }

            button.addEventListener('click', async () => {
                const presetId = button.dataset.logoPreset;
                if (!presetId) {
                    return;
                }

                const loaded = await this.selectPreset(presetId, root);
                if (loaded) {
                    QRCodeFrameControls.triggerActiveFrameRefresh(root);
                }
            });

            button.dataset.logoPresetInitialized = 'true';
        });

        this.syncUI(root);
        this.applyPresetSearch(root, [...actionButtons, ...presetButtons], presetSearchInput, presetEmptyState);
    },

    insertUploadedTile(root = document) {
        const grid = root.querySelector('#qrLogoPresets');
        if (!grid) {
            return;
        }

        let tile = grid.querySelector('[data-logo-uploaded]');
        if (tile) {
            const thumb = tile.querySelector('img');
            if (thumb) {
                thumb.src = this.logoDataUrl;
                thumb.alt = this.activeLogoLabel;
            }
            return;
        }

        const uploadButton = grid.querySelector('[data-logo-action="upload"]');
        tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'logo-preset-button';
        tile.dataset.logoUploaded = 'true';
        tile.dataset.logoPresetName = 'uploaded custom';
        tile.setAttribute('aria-label', I18n.translateString('Uploaded logo'));
        tile.innerHTML = `
            <span class="logo-preset-thumb logo-preset-thumb-uploaded">
                <img src="${this.logoDataUrl}" alt="${this.activeLogoLabel}">
            </span>
            <span class="logo-preset-name">${I18n.translateString('Uploaded')}</span>
        `;

        tile.addEventListener('click', async () => {
            if (this.logoDataUrl === tile.querySelector('img')?.src) {
                return;
            }
            const dataUrl = tile.querySelector('img')?.src;
            if (dataUrl) {
                await this.setLogoSource(dataUrl, {
                    label: 'Uploaded logo',
                    selectedPresetId: ''
                });
                this.syncUI(root);
                QRCodeFrameControls.triggerActiveFrameRefresh(root);
            }
        });

        if (uploadButton && uploadButton.nextSibling) {
            grid.insertBefore(tile, uploadButton.nextSibling);
        } else if (uploadButton) {
            grid.appendChild(tile);
        }
    },

    applyPresetSearch(root, presetButtons, presetSearchInput, presetEmptyState) {
        if (!presetSearchInput) {
            return;
        }

        const searchTerm = presetSearchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        presetButtons.forEach(button => {
            const presetName = button.dataset.logoPresetName || '';
            const matches = !searchTerm || presetName.includes(searchTerm);
            button.hidden = !matches;
            button.classList.toggle('is-filtered-out', !matches);
            if (matches) {
                visibleCount += 1;
            }
        });

        if (presetEmptyState) {
            presetEmptyState.hidden = visibleCount > 0;
        }
    },

    async loadLogoFile(file) {
        const isSupportedType = ['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type);
        if (!isSupportedType) {
            alert(I18n.translateString('Upload a PNG, JPG, or SVG logo.'));
            return false;
        }

        if (file.size > this.MAX_FILE_SIZE_BYTES) {
            alert(I18n.translateString('Logo file must be 5MB or smaller.'));
            return false;
        }

        try {
            const dataUrl = await this.readFileAsDataUrl(file);
            await this.setLogoSource(dataUrl, {
                label: file.name,
                selectedPresetId: ''
            });
            return true;
        } catch (error) {
            console.error('Unable to load logo image:', error);
            alert(I18n.translateString('Unable to load the selected logo image.'));
            return false;
        }
    },

    async selectPreset(presetId, root = document) {
        const preset = this.getLogoPresets().find(candidate => candidate.id === presetId);
        if (!preset) {
            return false;
        }

        try {
            const presetSource = await this.resolvePresetDataUrl(preset);
            await this.setLogoSource(presetSource, {
                label: `${preset.name} preset`,
                selectedPresetId: preset.id
            });

            const logoInput = root.querySelector('#qrLogoInput');
            if (logoInput) {
                logoInput.value = '';
            }

            this.syncUI(root);
            return true;
        } catch (error) {
            console.error('Unable to load preset logo:', error);
            alert(I18n.translateString('Unable to load the selected preset logo.'));
            return false;
        }
    },

    async resolvePresetDataUrl(preset) {
        return preset?.dataUrl || '';
    },

    async setLogoSource(dataUrl, { label = '', selectedPresetId = '' } = {}) {
        const image = await this.loadImage(dataUrl);
        this.logoDataUrl = dataUrl;
        this.logoImage = image;
        this.activeLogoLabel = label;
        this.selectedPresetId = selectedPresetId;
    },

    clearLogo(root = document) {
        this.logoDataUrl = '';
        this.logoImage = null;
        this.activeLogoLabel = '';
        this.selectedPresetId = '';

        const logoInput = root.querySelector('#qrLogoInput');
        if (logoInput) {
            logoInput.value = '';
        }

        const uploadedTile = root.querySelector('[data-logo-uploaded]');
        if (uploadedTile) {
            uploadedTile.remove();
        }

        this.syncUI(root);
    },

    hasLogo() {
        return Boolean(this.logoImage);
    },

    syncUI(root = document, uploadedFileName = '') {
        const sizeRange = root.querySelector('#qrLogoSizeRange');
        const logoBackgroundColorControl = FrameColorControl.getControl(root, 'logoBackgroundColor');
        const sizeValueLabel = root.querySelector('#qrLogoSizeValue');
        const presetButtons = root.querySelectorAll('[data-logo-preset]');
        const clearActionButton = root.querySelector('[data-logo-action="clear"]');

        if (sizeRange) {
            sizeRange.value = String(this.sizePercent);
        }

        if (sizeValueLabel) {
            const newSizeText = I18n.translate('{size}% of QR width', {
                size: this.sizePercent
            });
            if (sizeValueLabel.textContent !== newSizeText) {
                sizeValueLabel.textContent = newSizeText;
            }
        }

        if (logoBackgroundColorControl) {
            FrameColorControl.setValue(logoBackgroundColorControl, this.logoBackgroundColor);
        }

        if (clearActionButton) {
            clearActionButton.classList.toggle('active', !this.hasLogo());
        }

        const uploadedTile = root.querySelector('[data-logo-uploaded]');
        if (uploadedTile) {
            const isUploadedActive = this.hasLogo() && !this.selectedPresetId;
            uploadedTile.classList.toggle('active', isUploadedActive);
        }

        presetButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.logoPreset === this.selectedPresetId);
        });
    },

    applyLogoToContainer(container) {
        if (!container || !this.hasLogo()) {
            return;
        }

        const canvas = container.querySelector('canvas');
        if (!canvas) {
            return;
        }

        this.applyLogoToCanvas(canvas);
    },

    applyLogoToCanvas(canvas) {
        if (!canvas || !this.hasLogo()) {
            return canvas;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return canvas;
        }

        const qrSize = Math.min(canvas.width, canvas.height);
        const logoBoxSize = qrSize * (this.sizePercent / 100);
        const backgroundSize = logoBoxSize * 1.35;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const backgroundX = centerX - (backgroundSize / 2);
        const backgroundY = centerY - (backgroundSize / 2);
        const backgroundRadius = Math.max(8, backgroundSize * 0.18);

        const imageAspectRatio = this.logoImage.naturalWidth / this.logoImage.naturalHeight || 1;
        const imageWidth = imageAspectRatio >= 1 ? logoBoxSize : logoBoxSize * imageAspectRatio;
        const imageHeight = imageAspectRatio >= 1 ? logoBoxSize / imageAspectRatio : logoBoxSize;
        const imageX = centerX - (imageWidth / 2);
        const imageY = centerY - (imageHeight / 2);

        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.fillStyle = this.logoBackgroundColor;
        this.roundRect(ctx, backgroundX, backgroundY, backgroundSize, backgroundSize, backgroundRadius);
        ctx.fill();
        ctx.drawImage(this.logoImage, imageX, imageY, imageWidth, imageHeight);
        ctx.restore();

        return canvas;
    },

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

    readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    },

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = src;
        });
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

const QRCodeFrameControls = {
    qrCodeWrapped: false,

    init(root = document) {
        if (!window.QRFrames) {
            return;
        }

        const frameTextInput = root.querySelector('#frameTextInput');
        const frameForegroundColorControl = FrameColorControl.getControl(root, 'frameForegroundColor');
        const frameBackgroundColorControl = FrameColorControl.getControl(root, 'frameBackgroundColor');
        const frameTextColorControl = FrameColorControl.getControl(root, 'frameTextColor');
        const frameTransparentBackgroundInput = root.querySelector('#frameTransparentBackground');

        if (!frameTextInput || !frameForegroundColorControl || !frameBackgroundColorControl || !frameTextColorControl || !frameTransparentBackgroundInput) {
            return;
        }

        if (frameTextInput.dataset.frameControlsInitialized !== 'true') {
            const rerender = () => {
                this.applySettings(root);
                this.updateFramePreviewSamples();
                this.triggerActiveFrameRefresh(root);
            };

            frameTextInput.addEventListener('input', rerender);
            FrameColorControl.bindControl(frameForegroundColorControl, rerender);
            FrameColorControl.bindControl(frameBackgroundColorControl, rerender);
            FrameColorControl.bindControl(frameTextColorControl, rerender, { markUserModified: true });
            frameTransparentBackgroundInput.addEventListener('change', rerender);

            root.querySelectorAll('.frame-card').forEach(card => {
                if (card.dataset.frameControlsBound === 'true') {
                    return;
                }

                card.addEventListener('click', () => {
                    this.syncControlValues(root, card.dataset.frame);
                });
                card.dataset.frameControlsBound = 'true';
            });

            frameTextInput.dataset.frameControlsInitialized = 'true';
        }

        this.syncControlValues(root, this.getActiveFrameType(root));
        this.applySettings(root);
    },

    syncControlValues(root = document, frameType = this.getActiveFrameType(root)) {
        if (!window.QRFrames) {
            return;
        }

        const frameTextInput = root.querySelector('#frameTextInput');
        const frameForegroundColorControl = FrameColorControl.getControl(root, 'frameForegroundColor');
        const frameBackgroundColorControl = FrameColorControl.getControl(root, 'frameBackgroundColor');
        const frameTextColorControl = FrameColorControl.getControl(root, 'frameTextColor');
        const frameTransparentBackgroundInput = root.querySelector('#frameTransparentBackground');

        if (!frameTextInput || !frameForegroundColorControl || !frameBackgroundColorControl || !frameTextColorControl || !frameTransparentBackgroundInput) {
            return;
        }

        frameTextInput.value = window.QRFrames.FRAME_TEXT;
        FrameColorControl.setValue(frameForegroundColorControl, window.QRFrames.FRAME_FOREGROUND_COLOR);
        FrameColorControl.setValue(frameBackgroundColorControl, window.QRFrames.FRAME_BACKGROUND_COLOR);
        frameTransparentBackgroundInput.checked = Boolean(window.QRFrames.TRANSPARENT_BACKGROUND);

        if (frameTextColorControl.picker.dataset.userModified !== 'true') {
            FrameColorControl.setValue(frameTextColorControl, window.QRFrames.FRAME_TEXT_COLOR || window.QRFrames.getDefaultTextColor(frameType));
        }
    },

    applySettings(root = document) {
        if (!window.QRFrames) {
            return;
        }

        const frameTextInput = root.querySelector('#frameTextInput');
        const frameForegroundColorControl = FrameColorControl.getControl(root, 'frameForegroundColor');
        const frameBackgroundColorControl = FrameColorControl.getControl(root, 'frameBackgroundColor');
        const frameTextColorControl = FrameColorControl.getControl(root, 'frameTextColor');
        const frameTransparentBackgroundInput = root.querySelector('#frameTransparentBackground');

        if (!frameTextInput || !frameForegroundColorControl || !frameBackgroundColorControl || !frameTextColorControl || !frameTransparentBackgroundInput) {
            return;
        }

        window.QRFrames.setFrameCustomization({
            frameText: frameTextInput.value,
            frameColor: FrameColorControl.getValue(frameForegroundColorControl),
            backgroundColor: FrameColorControl.getValue(frameBackgroundColorControl),
            textColor: frameTextColorControl.picker.dataset.userModified === 'true' ? FrameColorControl.getValue(frameTextColorControl) : null,
            transparentBackground: frameTransparentBackgroundInput.checked
        });
    },

    updateFramePreviewSamples() {
        if (!window.QRFrames) {
            return;
        }

        const frameCards = document.querySelectorAll('.frame-card');
        frameCards.forEach(card => {
            const preview = card.querySelector('.frame-preview');
            if (!preview) {
                return;
            }

            const previewMarkup = window.QRFrames.getFramePreviewMarkup(card.dataset.frame);
            preview.innerHTML = previewMarkup;
        });
    },

    triggerActiveFrameRefresh(root = document) {
        const activeFrame = root.querySelector('.frame-card.active');
        if (activeFrame) {
            activeFrame.click();
        }
    },

    getActiveFrameType(root = document) {
        return root.querySelector('.frame-card.active')?.dataset.frame || 'none';
    },

    getQRCodeAppearance() {
        this.applySettings(document);

        if (!window.QRFrames) {
            return {
                colorDark: '#000000',
                colorLight: '#ffffff'
            };
        }

        return {
            colorDark: window.QRFrames.FRAME_FOREGROUND_COLOR,
            colorLight: window.QRFrames.TRANSPARENT_BACKGROUND ? 'rgba(255, 255, 255, 0)' : window.QRFrames.QR_BACKGROUND_COLOR
        };
    },

    decorateQRCodeOptions(options = {}) {
        const appearance = this.getQRCodeAppearance();
        return {
            ...options,
            colorDark: appearance.colorDark,
            colorLight: appearance.colorLight
        };
    },

    wrapQRCodeConstructor() {
        if (this.qrCodeWrapped || typeof window.QRCode !== 'function') {
            return;
        }

        const OriginalQRCode = window.QRCode;
        const controls = this;
        function WrappedQRCode(element, options) {
            const instance = new OriginalQRCode(element, controls.decorateQRCodeOptions(options));
            QRCodeLogoControls.applyLogoToContainer(element);
            return instance;
        }

        Object.keys(OriginalQRCode).forEach(key => {
            WrappedQRCode[key] = OriginalQRCode[key];
        });
        WrappedQRCode.prototype = OriginalQRCode.prototype;

        window.QRCode = WrappedQRCode;
        this.qrCodeWrapped = true;
    },

    observe() {
        this.wrapQRCodeConstructor();

        const initializeControls = () => this.init(document);
        initializeControls();

        const observer = new MutationObserver(() => initializeControls());
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

const QRCodeConfigurationAccordion = {
    SECTION_ORDER: ['Content', 'Settings', 'Styling', 'Frame Type', 'Logo'],
    SECTION_META: {
        Content: {
            icon: 'bi-card-text',
            description: 'Enter the main information that will be encoded in the QR code.'
        },
        Settings: {
            icon: 'bi-sliders',
            description: 'Control scanning resilience and other shared QR generation settings.'
        },
        Styling: {
            icon: 'bi-palette',
            description: 'Adjust frame text, colors, and visual presentation.'
        },
        'Frame Type': {
            icon: 'bi-grid-1x2',
            description: 'Choose the QR frame style and presentation format.'
        },
        Logo: {
            icon: 'bi-image',
            description: 'Choose a logo for the center mark and adjust its size.'
        }
    },

    init(root = document) {
        const formSections = root.querySelectorAll('.qr-form-section');
        formSections.forEach(formSection => {
            if (formSection.dataset.configurationAccordionInitialized === 'true') {
                return;
            }

            const title = formSection.querySelector('.section-title');
            const customizationPanel = formSection.querySelector('.qr-customization-panel');
            if (!title || !customizationPanel) {
                return;
            }

            const directChildren = Array.from(formSection.children).filter(child => child !== title);
            const contentNodes = [];
            let typeNode = null;

            directChildren.forEach(child => {
                if (child === customizationPanel) {
                    typeNode = child;
                    return;
                }

                contentNodes.push(child);
            });

            const errorCorrectionGroup = contentNodes.find(node =>
                node.classList.contains('form-group') && node.querySelector('#errorCorrection')
            ) || null;

            const contentSectionNodes = errorCorrectionGroup
                ? contentNodes.filter(node => node !== errorCorrectionGroup)
                : contentNodes;

            const typeBlock = customizationPanel.querySelector('.qr-config-type-block');
            const stylingBlock = customizationPanel.querySelector('.qr-config-styling-block');
            const logoBlock = customizationPanel.querySelector('.qr-config-logo-block');
            if (!typeBlock || !stylingBlock || !logoBlock) {
                return;
            }

            const accordion = document.createElement('div');
            accordion.className = 'config-accordion';

            accordion.appendChild(this.createSection('Content', contentSectionNodes, true));

            if (stylingBlock) {
                accordion.appendChild(this.createSection('Styling', Array.from(stylingBlock.childNodes), false));
            }

            const typeNodes = [];
            typeNodes.push(...Array.from(typeBlock.childNodes));
            accordion.appendChild(this.createSection('Frame Type', typeNodes, false));

            accordion.appendChild(this.createSection('Logo', Array.from(logoBlock.childNodes), false));

            if (errorCorrectionGroup) {
                const settingsNodes = [
                    this.createSettingsHint(),
                    errorCorrectionGroup
                ];
                accordion.appendChild(this.createSection('Settings', settingsNodes, false));
            }

            customizationPanel.remove();
            formSection.appendChild(accordion);

            accordion.querySelectorAll('.config-accordion-trigger').forEach(button => {
                button.addEventListener('click', () => {
                    const item = button.closest('.config-accordion-item');
                    if (!item) {
                        return;
                    }

                    if (item.classList.contains('open')) {
                        item.classList.remove('open');
                        button.setAttribute('aria-expanded', 'false');
                    } else {
                        item.classList.add('open');
                        button.setAttribute('aria-expanded', 'true');
                    }
                });
            });

            formSection.dataset.configurationAccordionInitialized = 'true';
        });
    },

    createSection(label, nodes, isOpen) {
        const item = document.createElement('section');
        item.className = `config-accordion-item${isOpen ? ' open' : ''}`;
        item.dataset.section = label.toLowerCase();
        const meta = this.SECTION_META[label] || {
            icon: 'bi-folder2-open',
            description: ''
        };

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'config-accordion-trigger';
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        trigger.innerHTML = `
            <span class="config-accordion-trigger-main">
                <span class="config-accordion-icon" aria-hidden="true">
                    <i class="bi ${meta.icon}"></i>
                </span>
                <span class="config-accordion-copy">
                    <span class="config-accordion-label">${label}</span>
                    <span class="config-accordion-description">${meta.description}</span>
                </span>
            </span>
            <i class="bi bi-chevron-down config-accordion-chevron" aria-hidden="true"></i>
        `;

        const panel = document.createElement('div');
        panel.className = 'config-accordion-panel';
        nodes.forEach(node => {
            if (node) {
                panel.appendChild(node);
            }
        });

        item.appendChild(trigger);
        item.appendChild(panel);
        return item;
    },

    createSettingsHint() {
        const hint = document.createElement('div');
        hint.className = 'config-settings-intro';
        hint.innerHTML = `
            <div class="config-settings-title">QR Settings</div>
            <div class="form-hint">Choose how resilient the QR code should be when a logo or damage covers part of it.</div>
        `;
        return hint;
    },

    observe() {
        const initializeAccordion = () => this.init(document);
        initializeAccordion();

        document.addEventListener('app:route-rendered', initializeAccordion);

        const observer = new MutationObserver(() => initializeAccordion());
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    QRCodeExportControls.observe();
    QRCodeLogoControls.observe();
    QRCodeFrameControls.observe();
    QRCodeConfigurationAccordion.observe();
});
