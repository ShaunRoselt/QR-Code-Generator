"use strict";

// Frame Editor Module
const FramesMode = {
    frameLibraryCache: null,
    framePreviewCache: new Map(),
    PREVIEW_QR_TEXT: 'https://qrcode.apps.shaunroselt.com/',
    PREVIEW_QR_OPTIONS: Object.freeze({
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: 'Q',
        margin: 4
    }),

    state: {
        activeTab: 'frames',
        searchTerm: '',
        selectedFrameKey: '',
        isLoading: true,
        errorMessage: ''
    },

    render() {
        const hasFrameData = !this.state.isLoading && !this.state.errorMessage;
        const allFrames = hasFrameData ? this.getAllFrames() : [];
        const filteredFrames = this.state.activeTab === 'frames'
            ? this.getFilteredFrames(allFrames, this.state.searchTerm)
            : [];
        const selectedFrame = this.getSelectedFrame(allFrames, filteredFrames);
        const searchPlaceholder = this.state.activeTab === 'frames'
            ? I18n.translateString('Search frames')
            : I18n.translateString('Blocks coming soon');

        return `
            <div class="qr-mode-page frame-editor-page">
                <div class="content-header">
                    <h1 class="content-title">${I18n.translateString('Frame Editor')}</h1>
                </div>

                <div class="frame-editor-layout">
                    <aside class="frame-editor-sidebar-panel" aria-label="${I18n.translateString('Frame Editor sidebar')}">
                        <div class="frame-editor-tabs" role="tablist" aria-label="${I18n.translateString('Frame Editor panels')}">
                            ${this.renderTabButton('frames', 'Frames', 'bi-collection')}
                            ${this.renderTabButton('blocks', 'Blocks', 'bi-grid-3x3-gap')}
                        </div>

                        <div class="frame-editor-sidebar-search search-field">
                            <i class="bi bi-search search-icon" aria-hidden="true"></i>
                            <input
                                type="search"
                                class="search-input"
                                id="frameEditorSearchInput"
                                value="${this.escapeHTML(this.state.searchTerm)}"
                                placeholder="${this.escapeHTML(searchPlaceholder)}"
                                aria-label="${this.escapeHTML(I18n.translateString('Search frames'))}"
                                ${this.state.activeTab === 'frames' ? '' : 'disabled'}
                            >
                        </div>

                        <div class="frame-editor-sidebar-body">
                            ${this.renderSidebarContent(filteredFrames, allFrames.length, selectedFrame)}
                        </div>
                    </aside>

                    <section class="frame-editor-workspace-panel">
                        ${this.renderWorkspace(selectedFrame, allFrames.length)}
                    </section>
                </div>
            </div>
        `;
    },

    renderTabButton(tabId, label, icon) {
        const isActive = this.state.activeTab === tabId;
        const translatedLabel = I18n.translateString(label);

        return `
            <button
                type="button"
                class="frame-editor-tab${isActive ? ' active' : ''}"
                data-frame-editor-tab="${tabId}"
                role="tab"
                aria-selected="${isActive ? 'true' : 'false'}"
            >
                <i class="bi ${icon}" aria-hidden="true"></i>
                <span>${translatedLabel}</span>
            </button>
        `;
    },

    renderSidebarContent(filteredFrames, totalFrameCount, selectedFrame) {
        if (this.state.activeTab === 'blocks') {
            return `
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString('Blocks')}</span>
                    <span class="frame-editor-sidebar-count">${I18n.translateString('Coming soon')}</span>
                </div>
                <div class="frame-editor-empty-state">
                    <i class="bi bi-grid-3x3-gap" aria-hidden="true"></i>
                    <div class="frame-editor-empty-title">${I18n.translateString('No blocks yet')}</div>
                    <p>${I18n.translateString('This tab will hold items like text, images, and other frame elements.')}</p>
                </div>
            `;
        }

        if (this.state.isLoading) {
            return `
                <div class="frame-editor-empty-state">
                    <i class="bi bi-arrow-repeat spin" aria-hidden="true"></i>
                    <div class="frame-editor-empty-title">${I18n.translateString('Loading frames')}</div>
                    <p>${I18n.translateString('Pulling in your available frame library.')}</p>
                </div>
            `;
        }

        if (this.state.errorMessage) {
            return `
                <div class="frame-editor-empty-state frame-editor-empty-state-error">
                    <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
                    <div class="frame-editor-empty-title">${I18n.translateString('Unable to load frames')}</div>
                    <p>${this.escapeHTML(this.state.errorMessage)}</p>
                </div>
            `;
        }

        if (!filteredFrames.length) {
            return `
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString('Frames')}</span>
                    <span class="frame-editor-sidebar-count">${I18n.translate('{count} total', { count: String(totalFrameCount) })}</span>
                </div>
                <div class="frame-editor-empty-state">
                    <i class="bi bi-search" aria-hidden="true"></i>
                    <div class="frame-editor-empty-title">${I18n.translateString('No matching frames')}</div>
                    <p>${I18n.translateString('Try a different name or clear the search to see all frames.')}</p>
                </div>
            `;
        }

        return `
            <div class="frame-editor-sidebar-summary">
                <span class="frame-editor-sidebar-title">${I18n.translateString('Frames')}</span>
                <span class="frame-editor-sidebar-count">${I18n.translate('{count} available', { count: String(filteredFrames.length) })}</span>
            </div>
            <div class="frame-editor-frame-list" role="list">
                ${filteredFrames.map(frame => this.renderFrameListItem(frame, selectedFrame)).join('')}
            </div>
        `;
    },

    renderFrameListItem(frame, selectedFrame) {
        const isActive = Boolean(selectedFrame && selectedFrame.key === frame.key);

        return `
            <button
                type="button"
                class="frame-editor-frame-item${isActive ? ' active' : ''}"
                data-frame-editor-frame="${frame.key}"
                title="${this.escapeHTML(frame.name)}"
            >
                <span class="frame-editor-frame-thumb" aria-hidden="true">
                    ${frame.previewMarkup}
                </span>
                <span class="frame-editor-frame-meta">
                    <span class="frame-editor-frame-name">${this.escapeHTML(frame.name)}</span>
                    <span class="frame-editor-frame-source">${this.escapeHTML(frame.sourceLabel)}</span>
                </span>
            </button>
        `;
    },

    renderWorkspace(selectedFrame, totalFrameCount) {
        if (this.state.activeTab === 'blocks') {
            return `
                <div class="frame-editor-workspace-empty">
                    <i class="bi bi-grid-3x3-gap" aria-hidden="true"></i>
                    <h2 class="section-title">${I18n.translateString('Blocks')}</h2>
                    <p class="content-subtitle">${I18n.translateString('Block tools will be added here later for text, images, and other editable frame content.')}</p>
                </div>
            `;
        }

        if (this.state.isLoading) {
            return `
                <div class="frame-editor-workspace-empty">
                    <i class="bi bi-arrow-repeat spin" aria-hidden="true"></i>
                    <h2 class="section-title">${I18n.translateString('Loading frame workspace')}</h2>
                    <p class="content-subtitle">${I18n.translateString('Preparing the editor library and previews.')}</p>
                </div>
            `;
        }

        if (this.state.errorMessage) {
            return `
                <div class="frame-editor-workspace-empty frame-editor-workspace-error">
                    <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
                    <h2 class="section-title">${I18n.translateString('Frame library unavailable')}</h2>
                    <p class="content-subtitle">${this.escapeHTML(this.state.errorMessage)}</p>
                </div>
            `;
        }

        if (!selectedFrame) {
            return `
                <div class="frame-editor-workspace-empty">
                    <i class="bi bi-brush" aria-hidden="true"></i>
                    <h2 class="section-title">${I18n.translateString('No frame selected')}</h2>
                    <p class="content-subtitle">${I18n.translateString('Pick a frame from the left sidebar to start working with it.')}</p>
                </div>
            `;
        }

        const selectedPreviewMarkup = this.getLargePreviewMarkup(selectedFrame);

        return `
            <div class="frame-editor-workspace-header">
                <div>
                    <div class="frame-editor-workspace-kicker">${I18n.translateString('Frame Workspace')}</div>
                    <h2 class="section-title">
                        <i class="bi bi-brush" aria-hidden="true"></i>
                        ${this.escapeHTML(selectedFrame.name)}
                    </h2>
                    <p class="content-subtitle">${I18n.translateString('Use the sidebar to browse saved frames. Editing controls will live here as the workspace expands.')}</p>
                </div>
                <div class="frame-editor-workspace-badges">
                    <span class="frame-editor-badge">${this.escapeHTML(selectedFrame.sourceLabel)}</span>
                    <span class="frame-editor-badge">${I18n.translate('{count} frames', { count: String(totalFrameCount) })}</span>
                </div>
            </div>

            <div class="frame-editor-canvas-shell">
                <div class="frame-editor-canvas-preview">
                    ${selectedPreviewMarkup}
                </div>
                <div class="frame-editor-canvas-note">
                    <i class="bi bi-layout-sidebar-inset" aria-hidden="true"></i>
                    <div class="frame-editor-empty-title">${I18n.translateString('Editor tools coming next')}</div>
                    <p>${I18n.translateString('The new left sidebar is ready for browsing frames. Blocks will be added from the second tab when that workflow is built out.')}</p>
                </div>
            </div>
        `;
    },

    getRoot() {
        return document.getElementById('mainContent');
    },

    renderIntoRoot() {
        const root = this.getRoot();
        if (!root) {
            return;
        }

        root.innerHTML = this.render();
        this.bindEvents(root);
    },

    init() {
        this.renderIntoRoot();
        void this.loadFrames();
    },

    async loadFrames() {
        this.framePreviewCache.clear();
        this.frameLibraryCache = null;
        this.state = {
            ...this.state,
            isLoading: true,
            errorMessage: ''
        };
        this.renderIntoRoot();

        try {
            await QRFrames.loadFrameCatalog();
            const frames = this.getAllFrames(false);

            this.state = {
                ...this.state,
                isLoading: false,
                errorMessage: '',
                selectedFrameKey: this.resolveSelectedFrameKey(frames)
            };
            this.renderIntoRoot();
        } catch (error) {
            console.error('Failed to load frames for Frame Editor.', error);

            this.state = {
                ...this.state,
                isLoading: false,
                errorMessage: I18n.translateString('Failed to load frames. Please refresh the page and try again.')
            };
            this.renderIntoRoot();
        }
    },

    bindEvents(root) {
        root.querySelectorAll('[data-frame-editor-tab]').forEach(button => {
            button.addEventListener('click', () => {
                const nextTab = button.dataset.frameEditorTab;
                if (!nextTab || nextTab === this.state.activeTab) {
                    return;
                }

                this.state = {
                    ...this.state,
                    activeTab: nextTab
                };
                this.renderIntoRoot();
            });
        });

        const searchInput = root.querySelector('#frameEditorSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', event => {
                const nextSearchTerm = event.target.value;
                const filteredFrames = this.getFilteredFrames(this.getAllFrames(false), nextSearchTerm);

                this.state = {
                    ...this.state,
                    searchTerm: nextSearchTerm,
                    selectedFrameKey: this.resolveSelectedFrameKey(filteredFrames)
                };
                this.renderIntoRoot();
            });
        }

        root.querySelectorAll('[data-frame-editor-frame]').forEach(button => {
            button.addEventListener('click', () => {
                const selectedFrameKey = button.dataset.frameEditorFrame;
                if (!selectedFrameKey) {
                    return;
                }

                this.state = {
                    ...this.state,
                    selectedFrameKey
                };
                this.renderIntoRoot();
            });
        });
    },

    getAllFrames(includePreview = true) {
        if (includePreview && Array.isArray(this.frameLibraryCache)) {
            return this.frameLibraryCache;
        }

        const customFrames = Array.isArray(QRFrames.customFrames)
            ? QRFrames.customFrames.map(frame => ({
                key: `custom:${frame.id}`,
                frameType: QRFrames.FRAME_TYPES.CUSTOM,
                customFrameId: frame.id,
                name: frame.name || I18n.translateString('Custom'),
                sourceLabel: I18n.translateString('Saved'),
                previewMarkup: includePreview ? this.getFramePreviewMarkup(QRFrames.FRAME_TYPES.CUSTOM, frame.id, 100) : ''
            }))
            : [];

        const presetFrames = QRFrames.getFrameOptions().map(frame => ({
            key: `preset:${frame.id}`,
            frameType: frame.id,
            customFrameId: '',
            name: frame.name,
            sourceLabel: I18n.translateString('Built-in'),
            previewMarkup: includePreview ? this.getFramePreviewMarkup(frame.id, '', 100) : ''
        }));

        const frames = [...customFrames, ...presetFrames];
        if (includePreview) {
            this.frameLibraryCache = frames;
        }

        return frames;
    },

    getFilteredFrames(frames, searchTerm = this.state.searchTerm) {
        const normalizedSearchTerm = String(searchTerm || '').trim().toLowerCase();
        if (!normalizedSearchTerm) {
            return frames;
        }

        return frames.filter(frame => {
            const haystack = `${frame.name} ${frame.frameType} ${frame.sourceLabel}`.toLowerCase();
            return haystack.includes(normalizedSearchTerm);
        });
    },

    resolveSelectedFrameKey(frames) {
        if (!Array.isArray(frames) || !frames.length) {
            return '';
        }

        const hasSelection = frames.some(frame => frame.key === this.state.selectedFrameKey);
        return hasSelection ? this.state.selectedFrameKey : frames[0].key;
    },

    getSelectedFrame(allFrames, filteredFrames = allFrames) {
        if (!Array.isArray(allFrames) || !allFrames.length) {
            return null;
        }

        if (Array.isArray(filteredFrames) && filteredFrames.length === 0) {
            return null;
        }

        const preferredFrames = Array.isArray(filteredFrames) && filteredFrames.length ? filteredFrames : allFrames;
        return preferredFrames.find(frame => frame.key === this.state.selectedFrameKey) || preferredFrames[0] || null;
    },

    getLargePreviewMarkup(frame) {
        return this.getFramePreviewMarkup(frame.frameType, frame.customFrameId || '', 420, frame.name);
    },

    getFramePreviewMarkup(frameType, customFrameId = '', size = 100, frameName = '') {
        const cacheKey = `${frameType}:${customFrameId || 'default'}:${size}`;
        if (this.framePreviewCache.has(cacheKey)) {
            return this.framePreviewCache.get(cacheKey);
        }

        const previewMarkup = this.buildFramePreviewMarkup(frameType, customFrameId, size, frameName);
        this.framePreviewCache.set(cacheKey, previewMarkup);
        return previewMarkup;
    },

    buildFramePreviewMarkup(frameType, customFrameId, size, frameName = '') {
        const previewOptions = {
            ...this.PREVIEW_QR_OPTIONS,
            correctLevel: QRCode.CorrectLevel[this.PREVIEW_QR_OPTIONS.correctLevel]
        };
        const qrSVG = buildNativeQRCodeSVG({
            text: this.PREVIEW_QR_TEXT,
            size,
            qrOptions: previewOptions,
            includeLogo: false
        });

        if (frameType === QRFrames.FRAME_TYPES.CUSTOM && customFrameId) {
            const previousCustomFrameId = QRFrames.activeCustomFrameId;
            QRFrames.setActiveCustomFrame(customFrameId);
            try {
                return QRFrames.wrapSVGWithFrame(qrSVG, frameType, size);
            } finally {
                QRFrames.setActiveCustomFrame(previousCustomFrameId);
            }
        }

        if (frameType && frameType !== QRFrames.FRAME_TYPES.NONE) {
            return QRFrames.withFrameCustomization(frameType, () => {
                const previousFrameText = QRFrames.FRAME_TEXT;
                const defaultFrameText = QRFrames.getDefaultFrameText(frameType);

                if (defaultFrameText) {
                    QRFrames.FRAME_TEXT = defaultFrameText;
                }

                try {
                    return QRFrames.wrapSVGWithFrameWithActiveCustomization(qrSVG, frameType, size);
                } finally {
                    QRFrames.FRAME_TEXT = previousFrameText;
                }
            });
        }

        return qrSVG;
    },

    escapeHTML(value) {
        return QRFrames.escapeHTML ? QRFrames.escapeHTML(value) : String(value ?? '');
    }
};
