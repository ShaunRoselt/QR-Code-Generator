"use strict";

// Frame Editor Module
const FramesMode = {
    frameLibraryCache: null,
    framePreviewCache: new Map(),
    blockIdCounter: 0,
    PREVIEW_QR_TEXT: 'https://qrcode.apps.shaunroselt.com/',
    PREVIEW_QR_OPTIONS: Object.freeze({
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: 'Q',
        margin: 4
    }),
    BLOCK_LIBRARY: Object.freeze([
        {
            type: 'qr',
            name: 'QR Code Block',
            description: 'Drop a QR code anywhere on the canvas.',
            icon: 'bi-qr-code'
        },
        {
            type: 'text',
            name: 'Text Block',
            description: 'Place editable text anywhere in the layout.',
            icon: 'bi-type-h2'
        }
    ]),

    state: {
        activeTab: 'frames',
        searchTerm: '',
        selectedFrameKey: '',
        selectedBlockId: '',
        workspaceView: 'grid',
        isSidebarCollapsed: false,
        preferLeftSidebarExpanded: false,
        isRightSidebarCollapsed: false,
        autoCollapseLeftSidebar: false,
        rightSidebarTab: 'block',
        canvasZoom: 1,
        canvasPanX: 0,
        canvasPanY: 0,
        canvasBackgroundColor: '#2d2d2d',
        canvasGridColor: '#66c0f4',
        canvasGridOpacity: 0.08,
        canvasGridBaseSize: 32,
        isLoading: true,
        errorMessage: '',
        canvasBlocks: []
    },

    render() {
        const hasFrameData = !this.state.isLoading && !this.state.errorMessage;
        const allFrames = hasFrameData ? this.getAllFrames() : [];
        const filteredFrames = this.state.activeTab === 'frames'
            ? this.getFilteredFrames(allFrames, this.state.searchTerm)
            : [];
        const filteredBlocks = this.state.activeTab === 'blocks'
            ? this.getFilteredBlocks(this.state.searchTerm)
            : [];
        const selectedFrame = hasFrameData ? this.getSelectedFrame(allFrames) : null;
        const selectedBlock = this.getSelectedBlock();
        const totalFrameCount = allFrames.length;
        const searchLabel = this.state.activeTab === 'frames'
            ? I18n.translateString('Search frames')
            : I18n.translateString('Search blocks');
        const leftSidebarCollapsed = this.isLeftSidebarCollapsed();
        const sidebarToggleLabel = leftSidebarCollapsed
            ? I18n.translateString('Expand sidebar')
            : I18n.translateString('Collapse sidebar');
        const rightSidebarToggleLabel = this.state.isRightSidebarCollapsed
            ? I18n.translateString('Expand properties sidebar')
            : I18n.translateString('Collapse properties sidebar');
        const isDeveloperMode = this.isDeveloperMode();

        return `
            <div class="qr-mode-page frame-editor-page">
                <div class="content-header">
                    <h1 class="content-title">${I18n.translateString('Frame Editor')}</h1>
                </div>

                <div class="frame-editor-header-bar">
                    <button
                        type="button"
                        class="frame-editor-sidebar-toggle"
                        data-frame-editor-toggle-sidebar
                        aria-expanded="${leftSidebarCollapsed ? 'false' : 'true'}"
                        aria-controls="frameEditorSidebarPanel"
                        title="${this.escapeHTML(sidebarToggleLabel)}"
                    >
                        <i class="bi ${leftSidebarCollapsed ? 'bi-layout-sidebar-inset-reverse' : 'bi-layout-sidebar-inset'}" aria-hidden="true"></i>
                        <span class="frame-editor-button-label">${I18n.translateString('Sidebar')}</span>
                    </button>
                    <div class="frame-editor-header-actions">
                        <button
                            type="button"
                            class="frame-editor-sidebar-toggle"
                            data-frame-editor-save-json
                            title="${this.escapeHTML(I18n.translateString('Save frame as JSON'))}"
                        >
                            <i class="bi bi-floppy" aria-hidden="true"></i>
                            <span class="frame-editor-button-label">${I18n.translateString('Save JSON')}</span>
                        </button>
                        <div class="frame-editor-header-zoom" data-frame-editor-zoom-group>
                            <div class="frame-editor-canvas-controls" role="group" aria-label="${this.escapeHTML(I18n.translateString('Canvas controls'))}">
                                <button
                                    type="button"
                                    class="frame-editor-canvas-control frame-editor-canvas-control-icon"
                                    data-canvas-zoom="out"
                                    title="${this.escapeHTML(I18n.translateString('Zoom out'))}"
                                    aria-label="${this.escapeHTML(I18n.translateString('Zoom out'))}"
                                >
                                    <i class="bi bi-dash-lg" aria-hidden="true"></i>
                                </button>
                                <div class="frame-editor-canvas-zoom-field">
                                    <input
                                    type="text"
                                        class="frame-editor-canvas-zoom-input"
                                        data-canvas-zoom-input
                                        inputmode="decimal"
                                        pattern="[0-9]*[.,]?[0-9]*"
                                        value="${this.escapeHTML(String(Math.round(this.state.canvasZoom * 100)))}"
                                        aria-label="${this.escapeHTML(I18n.translateString('Zoom percentage'))}"
                                        title="${this.escapeHTML(I18n.translateString('Zoom percentage'))}"
                                    >
                                    <span class="frame-editor-canvas-zoom-unit" aria-hidden="true">%</span>
                                </div>
                                <button
                                    type="button"
                                    class="frame-editor-canvas-control frame-editor-canvas-control-icon"
                                    data-canvas-zoom="in"
                                    title="${this.escapeHTML(I18n.translateString('Zoom in'))}"
                                    aria-label="${this.escapeHTML(I18n.translateString('Zoom in'))}"
                                >
                                    <i class="bi bi-plus-lg" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div class="frame-editor-zoom-context-menu" data-frame-editor-zoom-menu hidden role="menu" aria-label="${this.escapeHTML(I18n.translateString('Canvas controls'))}">
                                <button type="button" class="frame-editor-zoom-context-menu-item" data-canvas-zoom="reset" role="menuitem">
                                    <i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
                                    <span>${I18n.translateString('Reset')}</span>
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="frame-editor-sidebar-toggle"
                            data-frame-editor-toggle-right-sidebar
                            aria-expanded="${this.state.isRightSidebarCollapsed ? 'false' : 'true'}"
                            aria-controls="frameEditorRightSidebarPanel"
                            title="${this.escapeHTML(rightSidebarToggleLabel)}"
                        >
                            <i class="bi ${this.state.isRightSidebarCollapsed ? 'bi-layout-sidebar-reverse' : 'bi-layout-sidebar'}" aria-hidden="true"></i>
                            <span class="frame-editor-button-label">${I18n.translateString('Properties')}</span>
                        </button>
                    </div>
                </div>

                <div class="frame-editor-layout-scroll">
                    <div class="frame-editor-layout${leftSidebarCollapsed ? ' frame-editor-layout-sidebar-collapsed' : ''}${this.state.isRightSidebarCollapsed ? ' frame-editor-layout-right-sidebar-collapsed' : ''}">
                        <aside
                            id="frameEditorSidebarPanel"
                            class="frame-editor-sidebar-panel"
                            aria-label="${I18n.translateString('Frame Editor sidebar')}"
                            aria-hidden="${leftSidebarCollapsed ? 'true' : 'false'}"
                        >
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
                                    placeholder="${this.escapeHTML(searchLabel)}"
                                    aria-label="${this.escapeHTML(searchLabel)}"
                                >
                            </div>

                            <div class="frame-editor-sidebar-body">
                                ${this.renderSidebarContent(filteredFrames, totalFrameCount, filteredBlocks)}
                            </div>
                        </aside>

                        <section
                            class="frame-editor-workspace-panel"
                            data-frame-editor-workspace-panel
                            style="background-color: ${this.escapeHTML(this.state.canvasBackgroundColor)}; ${this.getCanvasGridStyle()}"
                        >
                            ${isDeveloperMode ? this.renderWorkspaceViewTabs() : ''}
                            ${this.renderWorkspace(selectedFrame, totalFrameCount, selectedBlock, isDeveloperMode)}
                        </section>

                        <aside
                            id="frameEditorRightSidebarPanel"
                            class="frame-editor-right-sidebar-panel"
                            aria-label="${I18n.translateString('Frame Editor properties')}"
                            aria-hidden="${this.state.isRightSidebarCollapsed ? 'true' : 'false'}"
                        >
                            ${this.renderRightSidebar(selectedBlock)}
                        </aside>
                    </div>
                </div>
            </div>
        `;
    },

    renderWorkspaceViewTabs() {
        return `
            <div class="frame-editor-workspace-tabs frame-editor-tabs" role="tablist" aria-label="${this.escapeHTML(I18n.translateString('Frame Editor workspace views'))}">
                ${this.renderWorkspaceViewTabButton('grid', 'Grid', 'bi-grid-3x3-gap')}
                ${this.renderWorkspaceViewTabButton('json', 'JSON', 'bi-braces')}
            </div>
        `;
    },

    renderWorkspaceViewTabButton(tabId, label, icon) {
        const isActive = this.state.workspaceView === tabId;

        return `
            <button
                type="button"
                class="frame-editor-tab${isActive ? ' active' : ''}"
                data-frame-editor-workspace-tab="${tabId}"
                role="tab"
                aria-selected="${isActive ? 'true' : 'false'}"
            >
                <i class="bi ${icon}" aria-hidden="true"></i>
                <span>${this.escapeHTML(I18n.translateString(label))}</span>
            </button>
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

    renderSidebarContent(filteredFrames, totalFrameCount, filteredBlocks) {
        if (this.state.activeTab === 'blocks') {
            return this.renderBlocksSidebar(filteredBlocks);
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

        const selectedFrame = this.getSelectedFrame(this.getAllFrames(false));

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

    renderBlocksSidebar(filteredBlocks) {
        const totalBlocks = this.BLOCK_LIBRARY.length;

        if (!filteredBlocks.length) {
            return `
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString('Blocks')}</span>
                    <span class="frame-editor-sidebar-count">${I18n.translate('{count} available', { count: String(totalBlocks) })}</span>
                </div>
                <div class="frame-editor-empty-state">
                    <i class="bi bi-search" aria-hidden="true"></i>
                    <div class="frame-editor-empty-title">${I18n.translateString('No matching blocks')}</div>
                    <p>${I18n.translateString('Try a different keyword or clear the search to see all available blocks.')}</p>
                </div>
            `;
        }

        return `
            <div class="frame-editor-sidebar-summary">
                <span class="frame-editor-sidebar-title">${I18n.translateString('Blocks')}</span>
                <span class="frame-editor-sidebar-count">${I18n.translate('{count} available', { count: String(filteredBlocks.length) })}</span>
            </div>
            <div class="frame-editor-library-list" role="list">
                ${filteredBlocks.map(block => this.renderBlockLibraryItem(block)).join('')}
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

    renderBlockLibraryItem(block) {
        return `
            <button
                type="button"
                class="frame-editor-library-item"
                data-frame-editor-add-block="${block.type}"
                data-frame-editor-drag-block="${block.type}"
                draggable="true"
                title="${this.escapeHTML(block.name)}"
            >
                <span class="frame-editor-library-item-icon" aria-hidden="true">
                    <i class="bi ${block.icon}"></i>
                </span>
                <span class="frame-editor-library-item-meta">
                    <span class="frame-editor-library-item-name">${this.escapeHTML(I18n.translateString(block.name))}</span>
                    <span class="frame-editor-library-item-description">${this.escapeHTML(I18n.translateString(block.description))}</span>
                </span>
                <span class="frame-editor-library-item-action">${I18n.translateString('Drag or click')}</span>
            </button>
        `;
    },

    renderRightSidebar(selectedBlock) {
        return `
            <div class="frame-editor-right-sidebar-tabs" role="tablist" aria-label="${this.escapeHTML(I18n.translateString('Frame Editor properties panels'))}">
                ${this.renderRightSidebarTabButton('block', 'Block', 'bi-bounding-box')}
                ${this.renderRightSidebarTabButton('canvas', 'Canvas', 'bi-grid-1x2')}
            </div>
            <div class="frame-editor-right-sidebar-body">
                ${this.state.rightSidebarTab === 'block'
                    ? this.renderRightSidebarBlockContent(selectedBlock)
                    : this.renderRightSidebarCanvasContent()}
            </div>
        `;
    },

    renderRightSidebarTabButton(tabId, label, icon) {
        const isActive = this.state.rightSidebarTab === tabId;

        return `
            <button
                type="button"
                class="frame-editor-tab${isActive ? ' active' : ''}"
                data-frame-editor-properties-tab="${tabId}"
                role="tab"
                aria-selected="${isActive ? 'true' : 'false'}"
            >
                <i class="bi ${icon}" aria-hidden="true"></i>
                <span>${this.escapeHTML(I18n.translateString(label))}</span>
            </button>
        `;
    },

    renderRightSidebarBlockContent(selectedBlock) {
        if (!selectedBlock) {
            return `
                <div class="frame-editor-empty-state frame-editor-empty-state-compact">
                    <i class="bi bi-cursor" aria-hidden="true"></i>
                    <div class="frame-editor-empty-title">${I18n.translateString('No block selected')}</div>
                    <p>${I18n.translateString('Select a block on the canvas to edit its properties here.')}</p>
                </div>
            `;
        }

        if (selectedBlock.type === 'text') {
            return `
                <div class="frame-editor-sidebar-panel-section">
                    <div class="frame-editor-sidebar-summary">
                        <span class="frame-editor-sidebar-title">${I18n.translateString('Text Block')}</span>
                    </div>
                    <div class="frame-editor-sidebar-form">
                        <label class="frame-editor-field frame-editor-field-wide">
                            <span>${I18n.translateString('Text')}</span>
                            <textarea rows="3" data-block-setting="text">${this.escapeHTML(selectedBlock.text)}</textarea>
                        </label>
                        <label class="frame-editor-field">
                            <span>${I18n.translateString('Font size')}</span>
                            <input type="range" min="18" max="72" step="1" value="${this.escapeHTML(String(selectedBlock.fontSize))}" data-block-setting="fontSize">
                        </label>
                        <label class="frame-editor-field">
                            <span>${I18n.translateString('Width')}</span>
                            <input type="range" min="180" max="520" step="10" value="${this.escapeHTML(String(selectedBlock.width))}" data-block-setting="width">
                        </label>
                        <label class="frame-editor-field">
                            <span>${I18n.translateString('Color')}</span>
                            <input type="color" value="${this.escapeHTML(selectedBlock.color)}" data-block-setting="color">
                        </label>
                        <div class="frame-editor-field frame-editor-field-wide">
                            <span>${I18n.translateString('Formatting')}</span>
                            <div class="frame-editor-toggle-group">
                                ${this.renderSidebarToggleButton('fontWeight', selectedBlock.fontWeight >= 700 ? '400' : '700', selectedBlock.fontWeight >= 700, 'bi-type-bold', 'Bold')}
                                ${this.renderSidebarToggleButton('fontStyle', selectedBlock.fontStyle === 'italic' ? 'normal' : 'italic', selectedBlock.fontStyle === 'italic', 'bi-type-italic', 'Italic')}
                                ${this.renderSidebarToggleButton('textAlign', 'left', selectedBlock.textAlign === 'left', 'bi-text-left', 'Left')}
                                ${this.renderSidebarToggleButton('textAlign', 'center', selectedBlock.textAlign === 'center', 'bi-text-center', 'Center')}
                                ${this.renderSidebarToggleButton('textAlign', 'right', selectedBlock.textAlign === 'right', 'bi-text-right', 'Right')}
                            </div>
                        </div>
                        <div class="frame-editor-inspector-actions">
                            <button type="button" class="frame-editor-action-button" data-block-action="duplicate">
                                <i class="bi bi-files" aria-hidden="true"></i>
                                <span>${I18n.translateString('Duplicate')}</span>
                            </button>
                            <button type="button" class="frame-editor-action-button danger" data-block-action="delete">
                                <i class="bi bi-trash3" aria-hidden="true"></i>
                                <span>${I18n.translateString('Delete')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="frame-editor-sidebar-panel-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString('QR Code Block')}</span>
                </div>
                <div class="frame-editor-sidebar-form">
                    <label class="frame-editor-field frame-editor-field-wide">
                        <span>${I18n.translateString('QR content')}</span>
                        <input type="text" value="${this.escapeHTML(selectedBlock.content)}" data-block-setting="content">
                    </label>
                    <label class="frame-editor-field">
                        <span>${I18n.translateString('Size')}</span>
                        <input type="range" min="120" max="300" step="4" value="${this.escapeHTML(String(selectedBlock.size))}" data-block-setting="size">
                    </label>
                    <label class="frame-editor-field">
                        <span>${I18n.translateString('Dark color')}</span>
                        <input type="color" value="${this.escapeHTML(selectedBlock.colorDark)}" data-block-setting="colorDark">
                    </label>
                    <div class="frame-editor-inspector-actions">
                        <button type="button" class="frame-editor-action-button" data-block-action="duplicate">
                            <i class="bi bi-files" aria-hidden="true"></i>
                            <span>${I18n.translateString('Duplicate')}</span>
                        </button>
                        <button type="button" class="frame-editor-action-button danger" data-block-action="delete">
                            <i class="bi bi-trash3" aria-hidden="true"></i>
                            <span>${I18n.translateString('Delete')}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderRightSidebarCanvasContent() {
        return `
            <div class="frame-editor-sidebar-panel-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString('Canvas')}</span>
                </div>
                <div class="frame-editor-sidebar-form">
                    <label class="frame-editor-field">
                        <span>${I18n.translateString('Background')}</span>
                        <input type="color" value="${this.escapeHTML(this.state.canvasBackgroundColor)}" data-canvas-setting="canvasBackgroundColor">
                    </label>
                    <label class="frame-editor-field">
                        <span>${I18n.translateString('Grid color')}</span>
                        <input type="color" value="${this.escapeHTML(this.state.canvasGridColor)}" data-canvas-setting="canvasGridColor">
                    </label>
                    <label class="frame-editor-field">
                        <span>${I18n.translateString('Grid opacity')}</span>
                        <input type="range" min="0" max="0.3" step="0.01" value="${this.escapeHTML(String(this.state.canvasGridOpacity))}" data-canvas-setting="canvasGridOpacity">
                    </label>
                    <label class="frame-editor-field">
                        <span>${I18n.translateString('Grid size')}</span>
                        <input type="range" min="16" max="64" step="2" value="${this.escapeHTML(String(this.state.canvasGridBaseSize))}" data-canvas-setting="canvasGridBaseSize">
                    </label>
                    <button type="button" class="frame-editor-action-button" data-canvas-action="reset-view">
                        <i class="bi bi-arrows-angle-contract" aria-hidden="true"></i>
                        <span>${I18n.translateString('Reset view')}</span>
                    </button>
                </div>
            </div>
        `;
    },

    renderSidebarToggleButton(setting, value, isActive, icon, label) {
        return `
            <button
                type="button"
                class="frame-editor-toggle-button${isActive ? ' active' : ''}"
                data-block-toggle="${setting}"
                data-block-value="${value}"
                aria-pressed="${isActive ? 'true' : 'false'}"
                title="${this.escapeHTML(I18n.translateString(label))}"
            >
                <i class="bi ${icon}" aria-hidden="true"></i>
            </button>
        `;
    },

    renderWorkspace(selectedFrame, totalFrameCount, selectedBlock, isDeveloperMode = false) {
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

        if (isDeveloperMode && this.state.workspaceView === 'json') {
            return this.renderWorkspaceJsonView(selectedFrame);
        }

        return `
                <div class="frame-editor-canvas-shell">
                <div class="frame-editor-canvas-scroll" data-frame-editor-canvas-scroll>
                    <div
                        class="frame-editor-canvas-stage"
                        data-frame-editor-stage
                        aria-label="${this.escapeHTML(I18n.translateString('Frame editor canvas'))}"
                    >
                        <div class="frame-editor-canvas-viewport" data-frame-editor-viewport>
                            <div
                                class="frame-editor-canvas-camera"
                                data-frame-editor-camera
                                style="transform: translate(${this.state.canvasPanX}px, ${this.state.canvasPanY}px);"
                            >
                                <div
                                    class="frame-editor-canvas-scene"
                                    data-frame-editor-scene
                                    style="transform: scale(${this.state.canvasZoom});"
                                >
                                    <div class="frame-editor-canvas-block-layer">
                                        ${this.state.canvasBlocks.map(block => this.renderCanvasBlock(block)).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderWorkspaceJsonView(selectedFrame) {
        return `
            <div class="frame-editor-json-view">
                <pre class="frame-editor-json-content"><code>${this.escapeHTML(this.getCurrentFrameJson(selectedFrame))}</code></pre>
            </div>
        `;
    },

    renderCanvasBlock(block) {
        const isActive = this.state.selectedBlockId === block.id;
        const width = block.type === 'text' ? block.width : block.size;
        const style = [
            `left: ${block.xPct}%`,
            `top: ${block.yPct}%`,
            `width: ${width}px`
        ].join('; ');

        return `
            <div
                class="frame-editor-canvas-block frame-editor-canvas-block-${block.type}${isActive ? ' active' : ''}"
                data-frame-editor-canvas-block="${block.id}"
                data-block-type="${block.type}"
                style="${style}"
                tabindex="0"
                role="button"
                aria-label="${this.escapeHTML(I18n.translateString(block.type === 'text' ? 'Text Block' : 'QR Code Block'))}"
            >
                ${block.type === 'text'
                    ? `<div class="frame-editor-canvas-block-badge">${this.escapeHTML(I18n.translateString('Text'))}</div>`
                    : ''}
                ${this.renderCanvasBlockInner(block)}
            </div>
        `;
    },

    renderCanvasBlockInner(block) {
        if (block.type === 'text') {
            const inlineStyle = [
                `font-size: ${block.fontSize}px`,
                `font-weight: ${block.fontWeight}`,
                `font-style: ${block.fontStyle}`,
                `color: ${block.color}`,
                `text-align: ${block.textAlign || 'left'}`
            ].join('; ');

            return `
                <div class="frame-editor-text-block-surface">
                    <div
                        class="frame-editor-text-block-content"
                        style="${inlineStyle}"
                        spellcheck="false"
                    >
                        ${this.escapeHTML(block.text)}
                    </div>
                </div>
            `;
        }

        return `
            <div class="frame-editor-qr-block-surface" style="width: ${block.size}px; height: ${block.size}px;">
                ${this.getCanvasQrMarkup(block)}
            </div>
        `;
    },

    getCanvasQrMarkup(block) {
        return buildNativeQRCodeSVG({
            text: block.content || this.PREVIEW_QR_TEXT,
            size: block.size,
            qrOptions: {
                ...this.PREVIEW_QR_OPTIONS,
                colorDark: block.colorDark,
                colorLight: 'transparent',
                transparentBackground: true,
                correctLevel: QRCode.CorrectLevel[this.PREVIEW_QR_OPTIONS.correctLevel]
            },
            includeLogo: false
        });
    },

    getCanvasGridStyle(scrollLeft = this.canvasScrollLeft || 0, scrollTop = this.canvasScrollTop || 0) {
        const gridSize = Math.max(8, this.state.canvasGridBaseSize * this.state.canvasZoom);
        const offsetX = (((Math.max(this.state.canvasPanX, 0) - scrollLeft) % gridSize) + gridSize) % gridSize;
        const offsetY = (((Math.max(this.state.canvasPanY, 0) - scrollTop) % gridSize) + gridSize) % gridSize;
        const gridColor = this.hexToRgba(this.state.canvasGridColor, this.state.canvasGridOpacity);

        return `background-image: linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px); background-size: ${gridSize}px ${gridSize}px; background-position: ${offsetX}px ${offsetY}px;`;
    },

    getEffectiveCanvasPan() {
        return {
            x: Number.isFinite(this.liveCanvasPanX) ? this.liveCanvasPanX : this.state.canvasPanX,
            y: Number.isFinite(this.liveCanvasPanY) ? this.liveCanvasPanY : this.state.canvasPanY
        };
    },

    getCanvasContentBounds(root, viewportWidth, viewportHeight) {
        const viewport = root?.querySelector?.('[data-frame-editor-viewport]');
        if (!viewport) {
            return null;
        }

        const viewportRect = viewport.getBoundingClientRect();
        let bounds = null;

        root.querySelectorAll('[data-frame-editor-canvas-block]').forEach(element => {
            const rect = element.getBoundingClientRect();
            if (!rect.width || !rect.height) {
                return;
            }

            const left = rect.left - viewportRect.left;
            const top = rect.top - viewportRect.top;
            const right = rect.right - viewportRect.left;
            const bottom = rect.bottom - viewportRect.top;

            if (!bounds) {
                bounds = { left, top, right, bottom };
                return;
            }

            bounds.left = Math.min(bounds.left, left);
            bounds.top = Math.min(bounds.top, top);
            bounds.right = Math.max(bounds.right, right);
            bounds.bottom = Math.max(bounds.bottom, bottom);
        });

        return bounds;
    },

    getCanvasLayoutMetrics(root = this.getRoot()) {
        const scroll = root?.querySelector?.('[data-frame-editor-canvas-scroll]');
        if (!scroll) {
            return null;
        }

        const viewportWidth = Math.max(0, scroll.clientWidth);
        const viewportHeight = Math.max(0, scroll.clientHeight);
        if (!viewportWidth || !viewportHeight) {
            return null;
        }

        const effectivePan = this.getEffectiveCanvasPan();
        const contentBounds = this.getCanvasContentBounds(root, viewportWidth, viewportHeight);
        const epsilon = 1;
        const minX = Math.min(0, contentBounds?.left ?? 0);
        const minY = Math.min(0, contentBounds?.top ?? 0);
        const maxX = Math.max(viewportWidth, contentBounds?.right ?? viewportWidth);
        const maxY = Math.max(viewportHeight, contentBounds?.bottom ?? viewportHeight);
        const viewportLeft = Math.abs(minX) <= epsilon ? 0 : -minX;
        const viewportTop = Math.abs(minY) <= epsilon ? 0 : -minY;
        const stageWidth = (maxX - minX) <= (viewportWidth + epsilon)
            ? viewportWidth
            : Math.ceil(maxX - minX);
        const stageHeight = (maxY - minY) <= (viewportHeight + epsilon)
            ? viewportHeight
            : Math.ceil(maxY - minY);

        return {
            viewportWidth,
            viewportHeight,
            viewportLeft,
            viewportTop,
            sceneOffsetX: viewportLeft + effectivePan.x,
            sceneOffsetY: viewportTop + effectivePan.y,
            stageWidth,
            stageHeight,
            defaultScrollLeft: viewportLeft,
            defaultScrollTop: viewportTop
        };
    },

    captureCanvasScrollState(root = this.getRoot()) {
        const scroll = root?.querySelector?.('[data-frame-editor-canvas-scroll]');
        if (!scroll) {
            return;
        }

        this.canvasScrollLeft = scroll.scrollLeft;
        this.canvasScrollTop = scroll.scrollTop;
    },

    queueCanvasScrollCompensation(root = this.getRoot()) {
        this.captureCanvasScrollState(root);
        const metrics = this.getCanvasLayoutMetrics(root);
        this.pendingCanvasScrollReference = metrics
            ? {
                left: metrics.defaultScrollLeft,
                top: metrics.defaultScrollTop
            }
            : null;
    },

    applyCanvasGridStyle(root = this.getRoot()) {
        const workspace = root?.querySelector?.('[data-frame-editor-workspace-panel]');
        const scroll = root?.querySelector?.('[data-frame-editor-canvas-scroll]');
        const metrics = this.getCanvasLayoutMetrics(root);
        if (!workspace || !scroll || !metrics) {
            return;
        }

        const gridSize = Math.max(8, this.state.canvasGridBaseSize * this.state.canvasZoom);
        const gridColor = this.hexToRgba(this.state.canvasGridColor, this.state.canvasGridOpacity);
        const offsetX = (((metrics.sceneOffsetX - scroll.scrollLeft) % gridSize) + gridSize) % gridSize;
        const offsetY = (((metrics.sceneOffsetY - scroll.scrollTop) % gridSize) + gridSize) % gridSize;

        workspace.style.backgroundColor = this.state.canvasBackgroundColor;
        workspace.style.backgroundImage = `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`;
        workspace.style.backgroundSize = `${gridSize}px ${gridSize}px`;
        workspace.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
    },

    applyCanvasLayout(root = this.getRoot()) {
        const scroll = root?.querySelector?.('[data-frame-editor-canvas-scroll]');
        const stage = root?.querySelector?.('[data-frame-editor-stage]');
        const viewport = root?.querySelector?.('[data-frame-editor-viewport]');
        const metrics = this.getCanvasLayoutMetrics(root);
        if (!scroll || !stage || !viewport || !metrics) {
            return;
        }

        stage.style.width = `${metrics.stageWidth}px`;
        stage.style.height = `${metrics.stageHeight}px`;
        viewport.style.left = `${metrics.viewportLeft}px`;
        viewport.style.top = `${metrics.viewportTop}px`;
        viewport.style.width = `${metrics.viewportWidth}px`;
        viewport.style.height = `${metrics.viewportHeight}px`;

        let nextScrollLeft = Number.isFinite(this.canvasScrollLeft)
            ? this.canvasScrollLeft
            : metrics.defaultScrollLeft;
        let nextScrollTop = Number.isFinite(this.canvasScrollTop)
            ? this.canvasScrollTop
            : metrics.defaultScrollTop;

        if (this.pendingCanvasScrollReference) {
            nextScrollLeft += metrics.defaultScrollLeft - this.pendingCanvasScrollReference.left;
            nextScrollTop += metrics.defaultScrollTop - this.pendingCanvasScrollReference.top;
            this.pendingCanvasScrollReference = null;
        }

        nextScrollLeft = this.clamp(nextScrollLeft, 0, Math.max(0, metrics.stageWidth - metrics.viewportWidth));
        nextScrollTop = this.clamp(nextScrollTop, 0, Math.max(0, metrics.stageHeight - metrics.viewportHeight));

        this.isSyncingCanvasScroll = true;
        scroll.scrollLeft = nextScrollLeft;
        scroll.scrollTop = nextScrollTop;
        this.isSyncingCanvasScroll = false;

        this.canvasScrollLeft = nextScrollLeft;
        this.canvasScrollTop = nextScrollTop;
        this.applyCanvasGridStyle(root);
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
        this.syncViewportLayout(root);
    },

    init() {
        if (!this.handleViewportResize) {
            this.handleViewportResize = () => this.syncViewportLayout();
            window.addEventListener('resize', this.handleViewportResize);
        }
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
        root.querySelectorAll('[data-frame-editor-toggle-sidebar]').forEach(button => {
            button.addEventListener('click', () => {
                const nextCollapsed = !this.isLeftSidebarCollapsed();
                this.state = {
                    ...this.state,
                    isSidebarCollapsed: nextCollapsed,
                    preferLeftSidebarExpanded: !nextCollapsed
                };
                this.renderIntoRoot();
            });
        });

        root.querySelectorAll('[data-frame-editor-toggle-right-sidebar]').forEach(button => {
            button.addEventListener('click', () => {
                this.state = {
                    ...this.state,
                    isRightSidebarCollapsed: !this.state.isRightSidebarCollapsed
                };
                this.renderIntoRoot();
            });
        });

        root.querySelectorAll('[data-frame-editor-tab]').forEach(button => {
            button.addEventListener('click', () => {
                const nextTab = button.dataset.frameEditorTab;
                if (!nextTab || nextTab === this.state.activeTab) {
                    return;
                }

                this.state = {
                    ...this.state,
                    activeTab: nextTab,
                    searchTerm: ''
                };
                this.renderIntoRoot();
            });
        });

        root.querySelectorAll('[data-frame-editor-workspace-tab]').forEach(button => {
            button.addEventListener('click', () => {
                const nextWorkspaceView = button.dataset.frameEditorWorkspaceTab;
                if (!nextWorkspaceView || nextWorkspaceView === this.state.workspaceView) {
                    return;
                }

                this.state = {
                    ...this.state,
                    workspaceView: nextWorkspaceView
                };
                this.renderIntoRoot();
            });
        });

        root.querySelectorAll('[data-frame-editor-properties-tab]').forEach(button => {
            button.addEventListener('click', () => {
                const nextTab = button.dataset.frameEditorPropertiesTab;
                if (!nextTab || nextTab === this.state.rightSidebarTab) {
                    return;
                }

                this.state = {
                    ...this.state,
                    rightSidebarTab: nextTab
                };
                this.renderIntoRoot();
            });
        });

        root.querySelectorAll('[data-frame-editor-save-json]').forEach(button => {
            button.addEventListener('click', () => {
                this.saveFrameAsJson(root);
            });
        });

        const searchInput = root.querySelector('#frameEditorSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', event => {
                const nextSearchTerm = event.target.value;
                const nextState = {
                    ...this.state,
                    searchTerm: nextSearchTerm
                };

                if (this.state.activeTab === 'frames') {
                    const filteredFrames = this.getFilteredFrames(this.getAllFrames(false), nextSearchTerm);
                    nextState.selectedFrameKey = this.resolveSelectedFrameKey(filteredFrames.length ? filteredFrames : this.getAllFrames(false));
                }

                this.state = nextState;
                this.renderIntoRoot();
            });
        }

        root.querySelectorAll('[data-frame-editor-frame]').forEach(button => {
            button.addEventListener('click', () => {
                const selectedFrameKey = button.dataset.frameEditorFrame;
                if (!selectedFrameKey) {
                    return;
                }

                const selectedFrame = this.getAllFrames(false).find(frame => frame.key === selectedFrameKey) || null;
                if (selectedFrame?.frameType === QRFrames.FRAME_TYPES.CUSTOM && selectedFrame.customFrameId) {
                    QRFrames.setActiveCustomFrame(selectedFrame.customFrameId);
                }

                this.state = {
                    ...this.state,
                    selectedFrameKey
                };
                this.renderIntoRoot();
            });
        });

        root.querySelectorAll('[data-frame-editor-add-block]').forEach(button => {
            button.addEventListener('click', () => {
                const blockType = button.dataset.frameEditorAddBlock;
                if (!this.isSupportedBlockType(blockType)) {
                    return;
                }

                this.addBlock(blockType, null, root);
            });

            button.addEventListener('dragstart', event => {
                const blockType = button.dataset.frameEditorDragBlock;
                if (!this.isSupportedBlockType(blockType) || !event.dataTransfer) {
                    return;
                }

                event.dataTransfer.effectAllowed = 'copy';
                event.dataTransfer.setData('text/frame-editor-block', blockType);
                event.dataTransfer.setData('text/plain', blockType);
            });
        });

        const stage = root.querySelector('[data-frame-editor-stage]');
        if (stage) {
            stage.addEventListener('pointerdown', event => {
                this.beginCanvasPan(root, stage, event);
            });

            stage.addEventListener('click', event => {
                if (this.stagePanSuppressClick === true) {
                    this.stagePanSuppressClick = false;
                    return;
                }

                if (event.target.closest('[data-frame-editor-canvas-block]')) {
                    return;
                }

                if (!this.state.selectedBlockId) {
                    return;
                }

                this.state = {
                    ...this.state,
                    selectedBlockId: ''
                };
                this.renderIntoRoot();
            });

            stage.addEventListener('dragover', event => {
                if (!this.getDraggedBlockType(event)) {
                    return;
                }

                event.preventDefault();
                stage.classList.add('is-drop-target');
            });

            stage.addEventListener('dragleave', event => {
                if (event.currentTarget !== event.target) {
                    return;
                }
                stage.classList.remove('is-drop-target');
            });

            stage.addEventListener('drop', event => {
                const blockType = this.getDraggedBlockType(event);
                stage.classList.remove('is-drop-target');
                if (!this.isSupportedBlockType(blockType)) {
                    return;
                }

                event.preventDefault();
                this.addBlock(blockType, this.getCanvasPositionFromPointer(root, event.clientX, event.clientY), root);
            });

            stage.addEventListener('wheel', event => {
                event.preventDefault();
                this.adjustCanvasZoom(event.deltaY < 0 ? 0.12 : -0.12, {
                    x: event.clientX,
                    y: event.clientY
                }, root);
            }, { passive: false });
        }

        const canvasScroll = root.querySelector('[data-frame-editor-canvas-scroll]');
        if (canvasScroll) {
            canvasScroll.addEventListener('scroll', () => {
                if (this.isSyncingCanvasScroll) {
                    return;
                }

                this.canvasScrollLeft = canvasScroll.scrollLeft;
                this.canvasScrollTop = canvasScroll.scrollTop;
                this.applyCanvasGridStyle(root);
            }, { passive: true });
        }

        const zoomGroup = root.querySelector('[data-frame-editor-zoom-group]');
        if (zoomGroup) {
            zoomGroup.addEventListener('contextmenu', event => {
                if (event.target.closest('[data-frame-editor-zoom-menu]')) {
                    return;
                }

                event.preventDefault();
                this.showCanvasZoomContextMenu(event.clientX, event.clientY, root);
            });

            zoomGroup.addEventListener('keydown', event => {
                const openedWithKeyboard = event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10');
                if (!openedWithKeyboard) {
                    return;
                }

                const bounds = zoomGroup.getBoundingClientRect();
                event.preventDefault();
                this.showCanvasZoomContextMenu(bounds.right - 8, bounds.bottom + 4, root);
            });
        }

        root.querySelectorAll('[data-canvas-zoom]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.canvasZoom;
                if (action === 'in') {
                    this.adjustCanvasZoom(0.12, null, root);
                    return;
                }
                if (action === 'out') {
                    this.adjustCanvasZoom(-0.12, null, root);
                    return;
                }
                if (action === 'reset') {
                    this.resetCanvasView();
                }
            });
        });

        root.querySelectorAll('[data-canvas-zoom-input]').forEach(input => {
            const commitZoom = () => this.handleCanvasZoomInput(input, root);

            input.addEventListener('keydown', event => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    commitZoom();
                    return;
                }

                if (event.key === 'Escape') {
                    input.value = String(Math.round(this.state.canvasZoom * 100));
                    input.blur();
                    this.hideCanvasZoomContextMenu(root);
                }
            });

            input.addEventListener('change', commitZoom);
        });

        root.addEventListener('pointerdown', event => {
            const menu = root.querySelector('[data-frame-editor-zoom-menu]');
            if (!menu || menu.hidden || menu.contains(event.target)) {
                return;
            }

            this.hideCanvasZoomContextMenu(root);
        });

        root.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                this.hideCanvasZoomContextMenu(root);
            }
        });

        root.querySelectorAll('[data-frame-editor-canvas-block]').forEach(blockElement => {
            blockElement.addEventListener('pointerdown', event => {
                this.beginCanvasBlockDrag(root, blockElement, event);
            });

            blockElement.addEventListener('keydown', event => {
                const blockId = blockElement.dataset.frameEditorCanvasBlock;
                if (!blockId) {
                    return;
                }

                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.selectBlock(blockId);
                    return;
                }

                const block = this.getBlockById(blockId);
                if (!block) {
                    return;
                }

                const step = event.shiftKey ? 2 : 1;
                const updates = {
                    ArrowLeft: { xPct: block.xPct - step },
                    ArrowRight: { xPct: block.xPct + step },
                    ArrowUp: { yPct: block.yPct - step },
                    ArrowDown: { yPct: block.yPct + step }
                };
                if (!updates[event.key]) {
                    return;
                }

                event.preventDefault();
                this.updateBlock(blockId, updates[event.key]);
                this.renderIntoRoot();
            });
        });

        root.querySelectorAll('[data-block-setting]').forEach(control => {
            const onSettingChange = event => {
                this.handleInspectorSettingInput(root, event.currentTarget);
            };
            control.addEventListener('input', onSettingChange);
            control.addEventListener('change', onSettingChange);
        });

        root.querySelectorAll('[data-canvas-setting]').forEach(control => {
            const onCanvasChange = event => {
                this.handleCanvasSettingInput(event.currentTarget);
            };
            control.addEventListener('input', onCanvasChange);
            control.addEventListener('change', onCanvasChange);
        });

        root.querySelectorAll('[data-block-toggle]').forEach(button => {
            button.addEventListener('click', () => {
                const block = this.getSelectedBlock();
                if (!block) {
                    return;
                }

                const setting = button.dataset.blockToggle;
                if (!setting) {
                    return;
                }

                this.updateBlock(block.id, {
                    [setting]: button.dataset.blockValue || ''
                });
                this.renderIntoRoot();
            });
        });

        root.querySelectorAll('[data-block-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.blockAction;
                if (action === 'delete') {
                    this.removeSelectedBlock();
                    return;
                }
                if (action === 'duplicate') {
                    this.duplicateSelectedBlock();
                }
            });
        });

        root.querySelectorAll('[data-canvas-action]').forEach(button => {
            button.addEventListener('click', () => {
                if (button.dataset.canvasAction === 'reset-view') {
                    this.resetCanvasView();
                }
            });
        });
    },

    beginCanvasBlockDrag(root, blockElement, event) {
        if (event.button !== 0) {
            return;
        }

        const blockId = blockElement.dataset.frameEditorCanvasBlock;
        const block = this.getBlockById(blockId);
        const canvasScroll = root.querySelector('[data-frame-editor-canvas-scroll]');
        if (!block || !canvasScroll) {
            return;
        }

        event.preventDefault();

        const startPointer = {
            x: event.clientX,
            y: event.clientY
        };
        let nextPosition = {
            xPct: block.xPct,
            yPct: block.yPct
        };
        let didMove = false;

        const onPointerMove = moveEvent => {
            const deltaX = moveEvent.clientX - startPointer.x;
            const deltaY = moveEvent.clientY - startPointer.y;

            if (!didMove && Math.hypot(deltaX, deltaY) >= 4) {
                didMove = true;
                blockElement.classList.add('dragging');
            }

            if (!didMove) {
                return;
            }

            nextPosition = this.clampCanvasBlockPosition(
                root,
                block,
                {
                    xPct: block.xPct + (((deltaX / this.state.canvasZoom) / Math.max(canvasScroll.clientWidth, 1)) * 100),
                    yPct: block.yPct + (((deltaY / this.state.canvasZoom) / Math.max(canvasScroll.clientHeight, 1)) * 100)
                },
                blockElement
            );
            blockElement.style.left = `${nextPosition.xPct}%`;
            blockElement.style.top = `${nextPosition.yPct}%`;
            this.applyCanvasLayout(root);
        };

        const finishDrag = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            blockElement.classList.remove('dragging');

            if (didMove) {
                this.updateBlock(blockId, nextPosition);
                this.selectBlock(blockId);
                return;
            }

            this.selectBlock(blockId);
        };

        const onPointerUp = () => {
            finishDrag();
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    },

    beginCanvasPan(root, stage, event) {
        if (event.button !== 0) {
            return;
        }

        if (event.target.closest('[data-frame-editor-canvas-block]')) {
            return;
        }

        event.preventDefault();

        const camera = root.querySelector('[data-frame-editor-camera]');
        if (!camera) {
            return;
        }

        const startPointer = {
            x: event.clientX,
            y: event.clientY
        };
        const startPan = {
            x: this.state.canvasPanX,
            y: this.state.canvasPanY
        };
        let didPan = false;

        const onPointerMove = moveEvent => {
            const deltaX = moveEvent.clientX - startPointer.x;
            const deltaY = moveEvent.clientY - startPointer.y;
            if (!didPan && Math.hypot(deltaX, deltaY) >= 4) {
                didPan = true;
                stage.classList.add('is-panning');
            }

            if (!didPan) {
                return;
            }

            this.liveCanvasPanX = startPan.x + deltaX;
            this.liveCanvasPanY = startPan.y + deltaY;
            camera.style.transform = `translate(${this.liveCanvasPanX}px, ${this.liveCanvasPanY}px)`;
            this.applyCanvasLayout(root);
        };

        const finishPan = moveEvent => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            stage.classList.remove('is-panning');

            if (!didPan) {
                this.liveCanvasPanX = null;
                this.liveCanvasPanY = null;
                return;
            }

            const deltaX = moveEvent.clientX - startPointer.x;
            const deltaY = moveEvent.clientY - startPointer.y;
            this.stagePanSuppressClick = true;
            this.liveCanvasPanX = startPan.x + deltaX;
            this.liveCanvasPanY = startPan.y + deltaY;
            this.queueCanvasScrollCompensation(root);
            this.state = {
                ...this.state,
                canvasPanX: this.liveCanvasPanX,
                canvasPanY: this.liveCanvasPanY
            };
            this.liveCanvasPanX = null;
            this.liveCanvasPanY = null;
            this.renderIntoRoot();
        };

        const onPointerUp = upEvent => {
            finishPan(upEvent);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    },

    handleInspectorSettingInput(root, control) {
        const block = this.getSelectedBlock();
        if (!block) {
            return;
        }

        const setting = control.dataset.blockSetting;
        if (!setting) {
            return;
        }

        const numericSettings = new Set(['fontSize', 'width', 'size']);
        const nextValue = numericSettings.has(setting)
            ? Number(control.value)
            : control.value;

        this.updateBlock(block.id, {
            [setting]: nextValue
        });
        const updatedBlock = this.getBlockById(block.id);
        this.syncCanvasBlock(root, updatedBlock);
        this.clampUpdatedBlockToCanvas(root, updatedBlock);
    },

    syncCanvasBlock(root, block) {
        if (!block) {
            return;
        }

        const blockElement = root.querySelector(`[data-frame-editor-canvas-block="${block.id}"]`);
        if (!blockElement) {
            this.renderIntoRoot();
            return;
        }

        const width = block.type === 'text' ? block.width : block.size;
        blockElement.style.left = `${block.xPct}%`;
        blockElement.style.top = `${block.yPct}%`;
        blockElement.style.width = `${width}px`;
        blockElement.innerHTML = `
            ${block.type === 'text'
                ? `<div class="frame-editor-canvas-block-badge">${this.escapeHTML(I18n.translateString('Text'))}</div>`
                : ''}
            ${this.renderCanvasBlockInner(block)}
        `;
        this.applyCanvasLayout(root);
    },

    clampUpdatedBlockToCanvas(root, block) {
        if (!block) {
            return;
        }

        const stage = root.querySelector('[data-frame-editor-viewport]') || root.querySelector('[data-frame-editor-stage]');
        const blockElement = root.querySelector(`[data-frame-editor-canvas-block="${block.id}"]`);
        if (!stage || !blockElement) {
            return;
        }

        const clampedPosition = this.clampCanvasBlockPosition(
            root,
            block,
            {
                xPct: block.xPct,
                yPct: block.yPct
            },
            blockElement
        );
        this.updateBlock(block.id, clampedPosition);
        blockElement.style.left = `${clampedPosition.xPct}%`;
        blockElement.style.top = `${clampedPosition.yPct}%`;
        this.applyCanvasLayout(root);
    },

    handleCanvasSettingInput(control) {
        const setting = control.dataset.canvasSetting;
        if (!setting) {
            return;
        }

        const numericSettings = new Set(['canvasGridOpacity', 'canvasGridBaseSize']);
        this.state = {
            ...this.state,
            [setting]: numericSettings.has(setting) ? Number(control.value) : control.value
        };
        this.renderIntoRoot();
    },

    handleCanvasZoomInput(control, root = this.getRoot()) {
        const rawValue = String(control.value || '').trim().replace(/%$/, '');
        const parsedValue = Number.parseFloat(rawValue);
        if (!Number.isFinite(parsedValue)) {
            control.value = String(Math.round(this.state.canvasZoom * 100));
            return;
        }

        const nextZoom = parsedValue / 100;
        this.setCanvasZoom(nextZoom, null, root);
    },

    setCanvasZoom(nextZoom, anchorPoint = null, root = this.getRoot()) {
        const scroll = root?.querySelector?.('[data-frame-editor-canvas-scroll]');
        const metrics = this.getCanvasLayoutMetrics(root);
        const oldZoom = this.state.canvasZoom;
        const normalizedZoom = Number(this.clamp(nextZoom, 0.5, 2.5).toFixed(2));
        if (!scroll || !metrics || normalizedZoom === oldZoom) {
            return;
        }

        const rect = scroll.getBoundingClientRect();
        const anchorX = anchorPoint ? anchorPoint.x - rect.left : rect.width / 2;
        const anchorY = anchorPoint ? anchorPoint.y - rect.top : rect.height / 2;
        const stageAnchorX = scroll.scrollLeft + anchorX;
        const stageAnchorY = scroll.scrollTop + anchorY;
        const contentX = (stageAnchorX - metrics.sceneOffsetX) / oldZoom;
        const contentY = (stageAnchorY - metrics.sceneOffsetY) / oldZoom;
        const nextPanX = stageAnchorX - (contentX * normalizedZoom);
        const nextPanY = stageAnchorY - (contentY * normalizedZoom);

        this.queueCanvasScrollCompensation(root);
        this.state = {
            ...this.state,
            canvasZoom: normalizedZoom,
            canvasPanX: nextPanX,
            canvasPanY: nextPanY
        };
        this.renderIntoRoot();
    },

    adjustCanvasZoom(delta, anchorPoint = null, root = this.getRoot()) {
        this.setCanvasZoom(this.state.canvasZoom + delta, anchorPoint, root);
    },

    resetCanvasView(root = this.getRoot()) {
        this.queueCanvasScrollCompensation(root);
        this.state = {
            ...this.state,
            canvasZoom: 1,
            canvasPanX: 0,
            canvasPanY: 0
        };
        this.renderIntoRoot();
        this.hideCanvasZoomContextMenu(root);
    },

    showCanvasZoomContextMenu(clientX, clientY, root = this.getRoot()) {
        const menu = root?.querySelector?.('[data-frame-editor-zoom-menu]');
        if (!menu) {
            return;
        }

        menu.hidden = false;
        menu.style.left = '0px';
        menu.style.top = '0px';

        const menuRect = menu.getBoundingClientRect();
        const padding = 12;
        const left = Math.min(Math.max(padding, clientX), Math.max(padding, window.innerWidth - menuRect.width - padding));
        const top = Math.min(Math.max(padding, clientY), Math.max(padding, window.innerHeight - menuRect.height - padding));

        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
    },

    hideCanvasZoomContextMenu(root = this.getRoot()) {
        const menu = root?.querySelector?.('[data-frame-editor-zoom-menu]');
        if (!menu) {
            return;
        }

        menu.hidden = true;
    },

    syncViewportLayout(root = this.getRoot()) {
        if (!root) {
            return;
        }

        const viewportWidth = root.getBoundingClientRect().width;
        const nextAutoCollapse = viewportWidth < (this.state.isRightSidebarCollapsed ? 1220 : 1480);
        if (nextAutoCollapse !== this.state.autoCollapseLeftSidebar) {
            this.state = {
                ...this.state,
                autoCollapseLeftSidebar: nextAutoCollapse
            };
            this.renderIntoRoot();
            return;
        }

        this.applyCanvasLayout(root);
    },

    addBlock(blockType, position = null, root = this.getRoot()) {
        if (!this.isSupportedBlockType(blockType)) {
            return;
        }

        const nextBlock = this.createBlock(blockType, position || this.getVisibleCanvasCenterPosition(root));
        this.state = {
            ...this.state,
            selectedBlockId: nextBlock.id,
            canvasBlocks: [...this.state.canvasBlocks, nextBlock]
        };
        this.renderIntoRoot();
        this.clampUpdatedBlockToCanvas(this.getRoot(), this.getBlockById(nextBlock.id));
    },

    createBlock(blockType, position = null) {
        const basePosition = position || {};
        const xPct = Number.isFinite(basePosition.xPct) ? basePosition.xPct : 50;
        const yPct = Number.isFinite(basePosition.yPct) ? basePosition.yPct : (blockType === 'text' ? 28 : 52);

        if (blockType === 'text') {
            return {
                id: this.getNextBlockId(),
                type: 'text',
                text: I18n.translateString('This is a text block'),
                xPct,
                yPct,
                width: 320,
                fontSize: 34,
                fontWeight: 700,
                fontStyle: 'normal',
                color: '#1f2937',
                textAlign: 'left'
            };
        }

        return {
            id: this.getNextBlockId(),
            type: 'qr',
            content: this.PREVIEW_QR_TEXT,
            xPct,
            yPct,
            size: 180,
            colorDark: '#111111',
            colorLight: 'transparent'
        };
    },

    updateBlock(blockId, patch) {
        this.state = {
            ...this.state,
            canvasBlocks: this.state.canvasBlocks.map(block => block.id === blockId
                ? { ...block, ...patch }
                : block)
        };
    },

    removeSelectedBlock() {
        const selectedBlock = this.getSelectedBlock();
        if (!selectedBlock) {
            return;
        }

        const remainingBlocks = this.state.canvasBlocks.filter(block => block.id !== selectedBlock.id);
        this.state = {
            ...this.state,
            canvasBlocks: remainingBlocks,
            selectedBlockId: remainingBlocks[remainingBlocks.length - 1]?.id || ''
        };
        this.renderIntoRoot();
    },

    duplicateSelectedBlock() {
        const selectedBlock = this.getSelectedBlock();
        if (!selectedBlock) {
            return;
        }

        const duplicatedBlock = {
            ...selectedBlock,
            id: this.getNextBlockId(),
            xPct: this.clamp(selectedBlock.xPct + 4, 10, 90),
            yPct: this.clamp(selectedBlock.yPct + 4, 10, 90)
        };

        this.state = {
            ...this.state,
            selectedBlockId: duplicatedBlock.id,
            canvasBlocks: [...this.state.canvasBlocks, duplicatedBlock]
        };
        this.renderIntoRoot();
        this.clampUpdatedBlockToCanvas(this.getRoot(), this.getBlockById(duplicatedBlock.id));
    },

    selectBlock(blockId) {
        if (this.state.selectedBlockId === blockId) {
            return;
        }

        this.state = {
            ...this.state,
            selectedBlockId: blockId
        };
        this.renderIntoRoot();
    },

    getSelectedBlock() {
        return this.state.canvasBlocks.find(block => block.id === this.state.selectedBlockId) || null;
    },

    isLeftSidebarCollapsed() {
        return this.state.isSidebarCollapsed || (this.state.autoCollapseLeftSidebar && !this.state.preferLeftSidebarExpanded);
    },

    getBlockById(blockId) {
        return this.state.canvasBlocks.find(block => block.id === blockId) || null;
    },

    getNextBlockId() {
        this.blockIdCounter += 1;
        return `block-${this.blockIdCounter}`;
    },

    getDraggedBlockType(event) {
        return event.dataTransfer?.getData('text/frame-editor-block')
            || event.dataTransfer?.getData('text/plain')
            || '';
    },

    hexToRgba(hexColor, alpha = 1) {
        const normalized = String(hexColor || '').replace('#', '').trim();
        if (normalized.length !== 6) {
            return `rgba(102, 192, 244, ${alpha})`;
        }

        const red = Number.parseInt(normalized.slice(0, 2), 16);
        const green = Number.parseInt(normalized.slice(2, 4), 16);
        const blue = Number.parseInt(normalized.slice(4, 6), 16);
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    },

    getCanvasPositionFromPointer(root, clientX, clientY) {
        const scroll = root?.querySelector?.('[data-frame-editor-canvas-scroll]');
        const metrics = this.getCanvasLayoutMetrics(root);
        if (!scroll || !metrics) {
            return {
                xPct: 50,
                yPct: 50
            };
        }

        const rect = scroll.getBoundingClientRect();
        const stageX = scroll.scrollLeft + (clientX - rect.left);
        const stageY = scroll.scrollTop + (clientY - rect.top);
        return {
            xPct: (((stageX - metrics.sceneOffsetX) / this.state.canvasZoom) / metrics.viewportWidth) * 100,
            yPct: (((stageY - metrics.sceneOffsetY) / this.state.canvasZoom) / metrics.viewportHeight) * 100
        };
    },

    getVisibleCanvasContentBounds(root = this.getRoot()) {
        const scroll = root?.querySelector?.('[data-frame-editor-canvas-scroll]');
        const metrics = this.getCanvasLayoutMetrics(root);
        if (!scroll || !metrics) {
            return null;
        }

        const zoom = Math.max(this.state.canvasZoom, 0.01);
        const left = (scroll.scrollLeft - metrics.sceneOffsetX) / zoom;
        const top = (scroll.scrollTop - metrics.sceneOffsetY) / zoom;
        const width = scroll.clientWidth / zoom;
        const height = scroll.clientHeight / zoom;

        return {
            left,
            top,
            width,
            height,
            right: left + width,
            bottom: top + height,
            viewportWidth: metrics.viewportWidth,
            viewportHeight: metrics.viewportHeight
        };
    },

    getVisibleCanvasCenterPosition(root = this.getRoot()) {
        const bounds = this.getVisibleCanvasContentBounds(root);
        if (!bounds) {
            return {
                xPct: 50,
                yPct: 50
            };
        }

        return {
            xPct: ((bounds.left + (bounds.width / 2)) / bounds.viewportWidth) * 100,
            yPct: ((bounds.top + (bounds.height / 2)) / bounds.viewportHeight) * 100
        };
    },

    getCanvasBlockFootprint(block, blockElement = null) {
        if (blockElement) {
            const blockRect = blockElement.getBoundingClientRect();
            const zoom = Math.max(this.state.canvasZoom, 0.01);
            return {
                width: blockRect.width / zoom,
                height: blockRect.height / zoom
            };
        }

        if (!block) {
            return {
                width: 0,
                height: 0
            };
        }

        if (block.type === 'qr') {
            return {
                width: block.size,
                height: block.size
            };
        }

        const lineCount = Math.max(1, String(block.text || '').split('\n').length);
        return {
            width: block.width,
            height: Math.max(54, (lineCount * block.fontSize * 1.2) + 28)
        };
    },

    clampCanvasBlockPosition(root, block, position, blockElement = null) {
        const bounds = this.getVisibleCanvasContentBounds(root);
        const footprint = this.getCanvasBlockFootprint(block, blockElement);
        if (!bounds) {
            const fallbackXPct = Number(position.xPct);
            const fallbackYPct = Number(position.yPct);
            return {
                xPct: Number.isFinite(fallbackXPct) ? fallbackXPct : 50,
                yPct: Number.isFinite(fallbackYPct) ? fallbackYPct : 50
            };
        }

        const viewportWidth = Math.max(bounds.viewportWidth, 1);
        const viewportHeight = Math.max(bounds.viewportHeight, 1);
        const proposedX = (Number(position.xPct) / 100) * viewportWidth;
        const proposedY = (Number(position.yPct) / 100) * viewportHeight;
        const halfWidth = footprint.width / 2;
        const halfHeight = footprint.height / 2;
        let minX = bounds.left + halfWidth;
        let maxX = bounds.right - halfWidth;
        let minY = bounds.top + halfHeight;
        let maxY = bounds.bottom - halfHeight;

        if (maxX < minX) {
            minX = bounds.left + (bounds.width / 2);
            maxX = minX;
        }

        if (maxY < minY) {
            minY = bounds.top + (bounds.height / 2);
            maxY = minY;
        }

        return {
            xPct: (this.clamp(proposedX, minX, maxX) / viewportWidth) * 100,
            yPct: (this.clamp(proposedY, minY, maxY) / viewportHeight) * 100
        };
    },

    isSupportedBlockType(blockType) {
        return this.BLOCK_LIBRARY.some(block => block.type === blockType);
    },

    getFilteredBlocks(searchTerm = this.state.searchTerm) {
        const normalizedSearchTerm = String(searchTerm || '').trim().toLowerCase();
        if (!normalizedSearchTerm) {
            return this.BLOCK_LIBRARY;
        }

        return this.BLOCK_LIBRARY.filter(block => {
            const haystack = `${block.name} ${block.description}`.toLowerCase();
            return haystack.includes(normalizedSearchTerm);
        });
    },

    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    },

    isDeveloperMode() {
        if (typeof window.AppRole?.isDeveloper === 'function') {
            return window.AppRole.isDeveloper();
        }

        try {
            return new URLSearchParams(window.location.search).get('role') === 'developer';
        } catch (_) {
            return false;
        }
    },

    withSelectedFrameContext(selectedFrame, render) {
        if (!selectedFrame || selectedFrame.frameType !== QRFrames.FRAME_TYPES.CUSTOM || !selectedFrame.customFrameId) {
            return render();
        }

        const previousCustomFrameId = QRFrames.activeCustomFrameId;
        const previousCustomFrame = QRFrames.customFrame;
        QRFrames.setActiveCustomFrame(selectedFrame.customFrameId);

        try {
            return render();
        } finally {
            QRFrames.activeCustomFrameId = previousCustomFrameId || '';
            QRFrames.customFrame = previousCustomFrame || null;
        }
    },

    getSerializedCustomFrame(customFrameId = '') {
        const frame = QRFrames.customFrames.find(candidate => candidate.id === customFrameId);
        if (!frame) {
            return null;
        }

        return {
            id: frame.id,
            name: frame.name,
            naturalWidth: frame.naturalWidth,
            naturalHeight: frame.naturalHeight,
            qrRect: frame.qrRect,
            dataUrl: frame.dataUrl
        };
    },

    getCurrentFrameDocument(selectedFrame = this.getSelectedFrame(this.getAllFrames(false))) {
        return this.withSelectedFrameContext(selectedFrame, () => ({
            version: 1,
            frame: selectedFrame
                ? {
                    key: selectedFrame.key,
                    name: selectedFrame.name,
                    frameType: selectedFrame.frameType,
                    source: selectedFrame.frameType === QRFrames.FRAME_TYPES.CUSTOM ? 'custom' : 'preset',
                    customFrameId: selectedFrame.customFrameId || null
                }
                : null,
            frameCustomization: selectedFrame
                ? QRFrames.getFrameCustomization(selectedFrame.frameType)
                : null,
            frameQRRect: selectedFrame
                ? QRFrames.getFrameQRRect(selectedFrame.frameType)
                : null,
            customFrame: selectedFrame?.frameType === QRFrames.FRAME_TYPES.CUSTOM
                ? this.getSerializedCustomFrame(selectedFrame.customFrameId)
                : null,
            canvas: {
                backgroundColor: this.state.canvasBackgroundColor,
                gridColor: this.state.canvasGridColor,
                gridOpacity: this.state.canvasGridOpacity,
                gridBaseSize: this.state.canvasGridBaseSize
            },
            blocks: this.state.canvasBlocks.map(block => ({ ...block }))
        }));
    },

    getCurrentFrameJson(selectedFrame = this.getSelectedFrame(this.getAllFrames(false))) {
        return JSON.stringify(this.getCurrentFrameDocument(selectedFrame), null, 2);
    },

    sanitizeFilename(value) {
        const baseName = String(value || '').trim().toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return baseName || 'frame';
    },

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    showToast(message, tone = 'success') {
        if (typeof window.QRShareLink?.showToast === 'function') {
            window.QRShareLink.showToast(message, tone);
        }
    },

    saveFrameAsJson() {
        try {
            const selectedFrame = this.getSelectedFrame(this.getAllFrames(false));
            const filename = `${this.sanitizeFilename(selectedFrame?.name || 'frame')}.json`;
            this.downloadBlob(
                new Blob([this.getCurrentFrameJson(selectedFrame)], { type: 'application/json' }),
                filename
            );
            this.showToast(I18n.translateString('Frame JSON saved.'));
        } catch (error) {
            console.error('Failed to save frame JSON.', error);
            this.showToast(I18n.translateString('Failed to save frame JSON.'), 'error');
        }
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

    getSelectedFrame(allFrames) {
        if (!Array.isArray(allFrames) || !allFrames.length) {
            return null;
        }

        return allFrames.find(frame => frame.key === this.state.selectedFrameKey) || allFrames[0] || null;
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
