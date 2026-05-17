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
        },
        {
            type: 'shape',
            name: 'Shape Block',
            description: 'Add vector-style shapes anywhere on the canvas.',
            icon: 'bi-square'
        },
        {
            type: 'image',
            name: 'Image Block',
            description: 'Upload and place custom images on the canvas.',
            icon: 'bi-image'
        }
    ]),
    SHAPE_BLOCK_OPTIONS: Object.freeze([
        { id: 'rectangle', label: 'Rectangle' },
        { id: 'circle', label: 'Circle' },
        { id: 'triangle', label: 'Triangle' },
        { id: 'diamond', label: 'Diamond' },
        { id: 'hexagon', label: 'Hexagon' },
        { id: 'star', label: 'Star' }
    ]),
    IMAGE_FIT_OPTIONS: Object.freeze([
        { id: 'contain', label: 'Contain' },
        { id: 'cover', label: 'Cover' },
        { id: 'fill', label: 'Fill' }
    ]),
    TEXT_BLOCK_FONT_SIZE_OPTIONS: Object.freeze([
        { id: 's', label: 'S', size: 24 },
        { id: 'm', label: 'M', size: 32 },
        { id: 'l', label: 'L', size: 40 },
        { id: 'xl', label: 'XL', size: 52 }
    ]),
    TEXT_BLOCK_APPEARANCE_OPTIONS: Object.freeze([
        { id: 'default', label: 'Default', fontWeight: 400, fontStyle: 'normal' },
        { id: 'bold', label: 'Bold', fontWeight: 700, fontStyle: 'normal' },
        { id: 'italic', label: 'Italic', fontWeight: 400, fontStyle: 'italic' },
        { id: 'bold-italic', label: 'Bold Italic', fontWeight: 700, fontStyle: 'italic' }
    ]),
    TEXT_BLOCK_PADDING_MAX: 160,
    MIN_CANVAS_ZOOM: 0.05,
    MAX_CANVAS_ZOOM: 2.5,

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
                        <button
                            type="button"
                            class="frame-editor-sidebar-toggle"
                            data-canvas-action="fit-blocks"
                            title="${this.escapeHTML(I18n.translateString('Fit blocks in view'))}"
                            aria-label="${this.escapeHTML(I18n.translateString('Fit blocks in view'))}"
                        >
                            <i class="bi bi-arrows-angle-expand" aria-hidden="true"></i>
                            <span class="frame-editor-button-label">${I18n.translateString('Fit blocks')}</span>
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
                            style="${isDeveloperMode && this.state.workspaceView === 'json' ? '' : `background-color: ${this.escapeHTML(this.state.canvasBackgroundColor)}; ${this.getCanvasGridStyle()}`}"
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
                        <div class="frame-editor-text-property-group">
                            ${this.renderTextPropertyGroupHeading('Colour')}
                            <div class="frame-editor-text-color-list">
                                ${this.renderTextColorControl('Text', 'color', selectedBlock.color)}
                                ${this.renderTextColorControl('Background', 'backgroundColorRaw', this.getTextBlockColorInputValue(selectedBlock.backgroundColor), true, this.isTransparentTextBlockBackground(selectedBlock))}
                            </div>
                        </div>
                        <div class="frame-editor-text-property-group">
                            ${this.renderTextPropertyGroupHeading('Typography')}
                            <div class="frame-editor-field frame-editor-field-wide">
                                <span>${I18n.translateString('Font size')}</span>
                                <div class="frame-editor-segmented-control">
                                    ${this.TEXT_BLOCK_FONT_SIZE_OPTIONS.map(option => this.renderTextOptionButton(
                                        'fontSizePreset',
                                        option.id,
                                        option.label,
                                        this.getTextBlockFontSizePreset(selectedBlock) === option.id
                                    )).join('')}
                                </div>
                            </div>
                            <div class="frame-editor-inspector-grid frame-editor-text-grid">
                                <label class="frame-editor-field">
                                    <span>${I18n.translateString('Appearance')}</span>
                                    <select class="frame-editor-select" data-block-setting="appearance">
                                        ${this.TEXT_BLOCK_APPEARANCE_OPTIONS.map(option => `
                                            <option value="${option.id}" ${this.getTextBlockAppearance(selectedBlock) === option.id ? 'selected' : ''}>${this.escapeHTML(I18n.translateString(option.label))}</option>
                                        `).join('')}
                                    </select>
                                </label>
                                <div class="frame-editor-field">
                                    <span>${I18n.translateString('Line height')}</span>
                                    <div class="frame-editor-stepper">
                                        <span class="frame-editor-stepper-value">${this.formatTextBlockLineHeight(selectedBlock.lineHeight)}</span>
                                        <button type="button" class="frame-editor-stepper-button" data-block-adjust="lineHeight" data-block-adjust-direction="increase" aria-label="${this.escapeHTML(I18n.translateString('Increase line height'))}">+</button>
                                        <button type="button" class="frame-editor-stepper-button" data-block-adjust="lineHeight" data-block-adjust-direction="decrease" aria-label="${this.escapeHTML(I18n.translateString('Decrease line height'))}">−</button>
                                    </div>
                                </div>
                                <label class="frame-editor-field">
                                    <span>${I18n.translateString('Letter spacing')}</span>
                                    <div class="frame-editor-unit-input">
                                        <input type="number" min="-10" max="40" step="0.5" value="${this.escapeHTML(String(selectedBlock.letterSpacing || 0))}" data-block-setting="letterSpacing">
                                        <span>px</span>
                                    </div>
                                </label>
                                <div class="frame-editor-field">
                                    <span>${I18n.translateString('Decoration')}</span>
                                    <div class="frame-editor-inline-options">
                                        ${this.renderTextOptionButton('textDecoration', 'none', '−', (selectedBlock.textDecoration || 'none') === 'none')}
                                        ${this.renderTextOptionButton('textDecoration', 'underline', 'U', selectedBlock.textDecoration === 'underline')}
                                        ${this.renderTextOptionButton('textDecoration', 'line-through', 'S', selectedBlock.textDecoration === 'line-through')}
                                    </div>
                                </div>
                                <div class="frame-editor-field">
                                    <span>${I18n.translateString('Alignment')}</span>
                                    <div class="frame-editor-inline-options">
                                        ${this.renderTextOptionButton('textAlign', 'left', 'L', (selectedBlock.textAlign || 'left') === 'left')}
                                        ${this.renderTextOptionButton('textAlign', 'center', 'C', selectedBlock.textAlign === 'center')}
                                        ${this.renderTextOptionButton('textAlign', 'right', 'R', selectedBlock.textAlign === 'right')}
                                    </div>
                                </div>
                                <div class="frame-editor-field frame-editor-field-wide">
                                    <span>${I18n.translateString('Letter case')}</span>
                                    <div class="frame-editor-inline-options frame-editor-inline-options-wide">
                                        ${this.renderTextOptionButton('textTransform', 'none', '−', (selectedBlock.textTransform || 'none') === 'none')}
                                        ${this.renderTextOptionButton('textTransform', 'uppercase', 'AB', selectedBlock.textTransform === 'uppercase')}
                                        ${this.renderTextOptionButton('textTransform', 'lowercase', 'ab', selectedBlock.textTransform === 'lowercase')}
                                        ${this.renderTextOptionButton('textTransform', 'capitalize', 'Ab', selectedBlock.textTransform === 'capitalize')}
                                    </div>
                                </div>
                                <label class="frame-editor-switch-row frame-editor-field-wide">
                                    <span class="frame-editor-switch-control">
                                        <input type="checkbox" data-block-setting="dropCap" ${selectedBlock.dropCap ? 'checked' : ''}>
                                        <span class="frame-editor-switch-slider" aria-hidden="true"></span>
                                    </span>
                                    <span class="frame-editor-switch-copy">
                                        <strong>${I18n.translateString('Drop Cap')}</strong>
                                        <small>${I18n.translateString('Show a large initial letter.')}</small>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div class="frame-editor-text-property-group">
                            ${this.renderTextPaddingControls(selectedBlock)}
                        </div>
                        <div class="frame-editor-text-property-group">
                            ${this.renderTextPropertyGroupHeading('Border')}
                            <label class="frame-editor-field frame-editor-field-wide">
                                <span>${I18n.translateString('Border color')}</span>
                                <input type="color" value="${this.escapeHTML(this.getTextBlockColorInputValue(selectedBlock.borderColor, selectedBlock.color || this.getTextBlockDefaultColor()))}" data-block-setting="borderColor">
                            </label>
                            ${this.renderTextMeasurementField('Border width', 'borderWidth', selectedBlock.borderWidth ?? 0, 0, 20, 1)}
                            ${this.renderTextMeasurementField('Radius', 'borderRadius', selectedBlock.borderRadius ?? 0, 0, 48, 1)}
                        </div>
                        <div class="frame-editor-text-property-group">
                            ${this.renderBlockTransformControls(selectedBlock)}
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

        if (selectedBlock.type === 'shape') {
            return this.renderShapeBlockInspector(selectedBlock);
        }

        if (selectedBlock.type === 'image') {
            return this.renderImageBlockInspector(selectedBlock);
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
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Colour')}
                        <div class="frame-editor-text-color-list">
                            ${this.renderTextColorControl('Dark', 'colorDark', selectedBlock.colorDark || '#111111')}
                            ${this.renderTextColorControl('Background', 'backgroundColorRaw', this.getTextBlockColorInputValue(selectedBlock.backgroundColor), true, this.isTransparentTextBlockBackground(selectedBlock))}
                        </div>
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Dimensions')}
                        ${this.renderTextMeasurementField('Size', 'size', selectedBlock.size ?? 180, 80, 360, 4)}
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPaddingControls(selectedBlock)}
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Border')}
                        <label class="frame-editor-field frame-editor-field-wide">
                            <span>${I18n.translateString('Border color')}</span>
                            <input type="color" value="${this.escapeHTML(this.getTextBlockColorInputValue(selectedBlock.borderColor, selectedBlock.colorDark || this.getTextBlockDefaultColor()))}" data-block-setting="borderColor">
                        </label>
                        ${this.renderTextMeasurementField('Border width', 'borderWidth', selectedBlock.borderWidth ?? 0, 0, 20, 1)}
                        ${this.renderTextMeasurementField('Radius', 'borderRadius', selectedBlock.borderRadius ?? 0, 0, 48, 1)}
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderBlockTransformControls(selectedBlock)}
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

    renderShapeBlockInspector(selectedBlock) {
        const selectedShapeType = selectedBlock.shapeType || 'rectangle';
        return `
            <div class="frame-editor-sidebar-panel-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString('Shape Block')}</span>
                </div>
                <div class="frame-editor-sidebar-form">
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Shape')}
                        <label class="frame-editor-field frame-editor-field-wide">
                            <span>${I18n.translateString('Shape type')}</span>
                            <select class="frame-editor-select" data-block-setting="shapeType">
                                ${this.SHAPE_BLOCK_OPTIONS.map(option => `
                                    <option value="${option.id}" ${selectedShapeType === option.id ? 'selected' : ''}>${this.escapeHTML(I18n.translateString(option.label))}</option>
                                `).join('')}
                            </select>
                        </label>
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Colour')}
                        <div class="frame-editor-text-color-list">
                            ${this.renderTextColorControl('Fill', 'color', selectedBlock.color || this.getTextBlockDefaultColor())}
                        </div>
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Dimensions')}
                        ${this.renderTextMeasurementField('Width', 'width', selectedBlock.width ?? 160, 48, 640, 4)}
                        ${this.renderTextMeasurementField('Height', 'height', selectedBlock.height ?? 160, 48, 640, 4)}
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Border')}
                        <label class="frame-editor-field frame-editor-field-wide">
                            <span>${I18n.translateString('Border color')}</span>
                            <input type="color" value="${this.escapeHTML(this.getTextBlockColorInputValue(selectedBlock.borderColor, this.getTextBlockDefaultColor()))}" data-block-setting="borderColor">
                        </label>
                        ${this.renderTextMeasurementField('Border width', 'borderWidth', selectedBlock.borderWidth ?? 0, 0, 20, 1)}
                        ${this.renderTextMeasurementField('Radius', 'borderRadius', selectedBlock.borderRadius ?? 0, 0, 120, 1)}
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderBlockTransformControls(selectedBlock)}
                    </div>
                    ${this.renderBlockActionButtons()}
                </div>
            </div>
        `;
    },

    renderImageBlockInspector(selectedBlock) {
        const hasImage = Boolean(selectedBlock.src);
        const fileLabel = selectedBlock.imageName || I18n.translateString('No image selected');
        const uploadLabel = hasImage ? 'Replace image' : 'Upload image';

        return `
            <div class="frame-editor-sidebar-panel-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString('Image Block')}</span>
                </div>
                <div class="frame-editor-sidebar-form">
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Image')}
                        <label class="frame-editor-field frame-editor-field-wide">
                            <span>${I18n.translateString('Selected file')}</span>
                            <input type="text" value="${this.escapeHTML(fileLabel)}" readonly aria-label="${this.escapeHTML(I18n.translateString('Selected file'))}">
                        </label>
                        <label class="frame-editor-upload-button frame-editor-action-button">
                            <i class="bi bi-upload" aria-hidden="true"></i>
                            <span>${this.escapeHTML(I18n.translateString(uploadLabel))}</span>
                            <input class="frame-editor-visually-hidden" type="file" accept="image/*" data-block-image-upload>
                        </label>
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Display')}
                        <label class="frame-editor-field frame-editor-field-wide">
                            <span>${I18n.translateString('Image fit')}</span>
                            <select class="frame-editor-select" data-block-setting="objectFit">
                                ${this.IMAGE_FIT_OPTIONS.map(option => `
                                    <option value="${option.id}" ${(selectedBlock.objectFit || 'contain') === option.id ? 'selected' : ''}>${this.escapeHTML(I18n.translateString(option.label))}</option>
                                `).join('')}
                            </select>
                        </label>
                        <div class="frame-editor-text-color-list">
                            ${this.renderTextColorControl('Background', 'backgroundColorRaw', this.getTextBlockColorInputValue(selectedBlock.backgroundColor), true, this.isTransparentTextBlockBackground(selectedBlock))}
                        </div>
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Dimensions')}
                        ${this.renderTextMeasurementField('Width', 'width', selectedBlock.width ?? 180, 48, 960, 4)}
                        ${this.renderTextMeasurementField('Height', 'height', selectedBlock.height ?? 180, 48, 960, 4)}
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Border')}
                        <label class="frame-editor-field frame-editor-field-wide">
                            <span>${I18n.translateString('Border color')}</span>
                            <input type="color" value="${this.escapeHTML(this.getTextBlockColorInputValue(selectedBlock.borderColor, this.getTextBlockDefaultColor()))}" data-block-setting="borderColor">
                        </label>
                        ${this.renderTextMeasurementField('Border width', 'borderWidth', selectedBlock.borderWidth ?? 0, 0, 20, 1)}
                        ${this.renderTextMeasurementField('Radius', 'borderRadius', selectedBlock.borderRadius ?? 0, 0, 120, 1)}
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderBlockTransformControls(selectedBlock)}
                    </div>
                    ${this.renderBlockActionButtons()}
                </div>
            </div>
        `;
    },

    renderBlockActionButtons() {
        return `
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

    renderTextPropertyGroupHeading(label, actions = '') {
        return `
            <div class="frame-editor-text-group-heading">
                <span>${this.escapeHTML(I18n.translateString(label))}</span>
                ${actions || '<i class="bi bi-three-dots-vertical" aria-hidden="true"></i>'}
            </div>
        `;
    },

    renderTextColorControl(label, setting, value, supportsTransparent = false, isTransparent = false) {
        const normalizedValue = this.escapeHTML(value || '#000000');
        return `
            <label class="frame-editor-text-color-row">
                <span class="frame-editor-text-color-label">
                    <span class="frame-editor-color-chip${isTransparent ? ' is-transparent' : ''}" style="${isTransparent ? '' : `background-color: ${normalizedValue};`}"></span>
                    <span>${this.escapeHTML(I18n.translateString(label))}</span>
                </span>
                <span class="frame-editor-text-color-actions">
                    ${supportsTransparent ? `
                        <button
                            type="button"
                            class="frame-editor-icon-button${isTransparent ? ' active' : ''}"
                            data-block-toggle="backgroundColor"
                            data-block-value="transparent"
                            aria-label="${this.escapeHTML(I18n.translateString('Use transparent background'))}"
                            title="${this.escapeHTML(I18n.translateString('Use transparent background'))}"
                        >
                            <i class="bi bi-slash-circle" aria-hidden="true"></i>
                        </button>
                    ` : ''}
                    <input type="color" value="${normalizedValue}" data-block-setting="${setting}">
                </span>
            </label>
        `;
    },

    renderTextOptionButton(setting, value, label, isActive) {
        return `
            <button
                type="button"
                class="frame-editor-option-button${isActive ? ' active' : ''}"
                data-block-toggle="${setting}"
                data-block-value="${this.escapeHTML(String(value))}"
                aria-pressed="${isActive ? 'true' : 'false'}"
            >
                <span>${this.escapeHTML(I18n.translateString(label))}</span>
            </button>
        `;
    },

    renderTextMeasurementField(label, setting, value, min, max, step = 1) {
        const normalizedValue = Number.isFinite(Number(value)) ? Number(value) : min;
        return `
            <label class="frame-editor-field frame-editor-field-wide">
                <span>${this.escapeHTML(I18n.translateString(label))}</span>
                <div class="frame-editor-measurement-field">
                    <div class="frame-editor-unit-input">
                        <input type="number" min="${min}" max="${max}" step="${step}" value="${this.escapeHTML(String(normalizedValue))}" data-block-setting="${setting}">
                        <span>px</span>
                    </div>
                    <input type="range" min="${min}" max="${max}" step="${step}" value="${this.escapeHTML(String(normalizedValue))}" data-block-setting="${setting}">
                </div>
            </label>
        `;
    },

    renderBlockTransformControls(block) {
        return `
            ${this.renderTextPropertyGroupHeading('Transform')}
            ${this.renderTextMeasurementField('Rotation', 'rotation', block.rotation ?? 0, -180, 180, 1)}
        `;
    },

    renderTextPaddingControls(block) {
        const padding = this.getTextBlockPadding(block);
        const isLinked = block?.paddingLinked !== false;
        const nextLinkedValue = isLinked ? 'false' : 'true';
        const linkLabel = isLinked ? 'Unlink sides' : 'Link sides';
        const linkedPaddingX = Math.max(padding.left, padding.right);
        const linkedPaddingY = Math.max(padding.top, padding.bottom);

        return `
            ${this.renderTextPropertyGroupHeading('Padding', `
                <button
                    type="button"
                    class="frame-editor-icon-button${isLinked ? ' active' : ''}"
                    data-block-toggle="paddingLinked"
                    data-block-value="${nextLinkedValue}"
                    aria-pressed="${isLinked ? 'true' : 'false'}"
                    title="${this.escapeHTML(I18n.translateString(linkLabel))}"
                    aria-label="${this.escapeHTML(I18n.translateString(linkLabel))}"
                >
                    <i class="bi ${isLinked ? 'bi-link-45deg' : 'bi-unlink'}" aria-hidden="true"></i>
                </button>
            `)}
            <div class="frame-editor-padding-controls">
                ${isLinked
                    ? `
                        ${this.renderTextPaddingField('Horizontal', 'paddingX', linkedPaddingX, 'bi-arrow-left-right')}
                        ${this.renderTextPaddingField('Vertical', 'paddingY', linkedPaddingY, 'bi-arrow-down-up')}
                    `
                    : `
                        ${this.renderTextPaddingField('Top', 'paddingTop', padding.top, 'bi-arrow-up')}
                        ${this.renderTextPaddingField('Right', 'paddingRight', padding.right, 'bi-arrow-right')}
                        ${this.renderTextPaddingField('Bottom', 'paddingBottom', padding.bottom, 'bi-arrow-down')}
                        ${this.renderTextPaddingField('Left', 'paddingLeft', padding.left, 'bi-arrow-left')}
                    `}
            </div>
        `;
    },

    renderTextPaddingField(label, setting, value, icon) {
        const normalizedValue = Number.isFinite(Number(value)) ? Number(value) : 0;
        return `
            <label class="frame-editor-field frame-editor-field-wide frame-editor-padding-field">
                <span class="frame-editor-padding-field-label">
                    <i class="bi ${icon}" aria-hidden="true"></i>
                    <span>${this.escapeHTML(I18n.translateString(label))}</span>
                </span>
                <div class="frame-editor-measurement-field">
                    <div class="frame-editor-unit-input">
                        <input type="number" min="0" max="${this.TEXT_BLOCK_PADDING_MAX}" step="1" value="${this.escapeHTML(String(normalizedValue))}" data-block-setting="${setting}">
                        <span>px</span>
                    </div>
                    <input type="range" min="0" max="${this.TEXT_BLOCK_PADDING_MAX}" step="1" value="${this.escapeHTML(String(normalizedValue))}" data-block-setting="${setting}">
                </div>
            </label>
        `;
    },

    getTextBlockAppearance(block) {
        const fontWeight = Number(block?.fontWeight) >= 700 ? 700 : 400;
        const fontStyle = block?.fontStyle === 'italic' ? 'italic' : 'normal';
        const match = this.TEXT_BLOCK_APPEARANCE_OPTIONS.find(option => option.fontWeight === fontWeight && option.fontStyle === fontStyle);
        return match?.id || 'default';
    },

    getTextBlockAppearancePatch(appearanceId) {
        const appearance = this.TEXT_BLOCK_APPEARANCE_OPTIONS.find(option => option.id === appearanceId) || this.TEXT_BLOCK_APPEARANCE_OPTIONS[0];
        return {
            fontWeight: appearance.fontWeight,
            fontStyle: appearance.fontStyle
        };
    },

    getTextBlockPadding(block) {
        const horizontalPadding = Math.max(0, Number(block?.paddingX) || 0);
        const verticalPadding = Math.max(0, Number(block?.paddingY) || 0);
        const resolvePaddingValue = (value, fallback) => {
            const numericValue = Number(value);
            return Number.isFinite(numericValue) ? Math.max(0, numericValue) : fallback;
        };

        return {
            top: resolvePaddingValue(block?.paddingTop, verticalPadding),
            right: resolvePaddingValue(block?.paddingRight, horizontalPadding),
            bottom: resolvePaddingValue(block?.paddingBottom, verticalPadding),
            left: resolvePaddingValue(block?.paddingLeft, horizontalPadding)
        };
    },

    buildTextBlockPaddingPatch(padding) {
        const nextPadding = {
            top: Math.max(0, Number(padding?.top) || 0),
            right: Math.max(0, Number(padding?.right) || 0),
            bottom: Math.max(0, Number(padding?.bottom) || 0),
            left: Math.max(0, Number(padding?.left) || 0)
        };

        return {
            paddingTop: nextPadding.top,
            paddingRight: nextPadding.right,
            paddingBottom: nextPadding.bottom,
            paddingLeft: nextPadding.left,
            paddingX: Math.max(nextPadding.left, nextPadding.right),
            paddingY: Math.max(nextPadding.top, nextPadding.bottom)
        };
    },

    getTextBlockPaddingSideFromSetting(setting) {
        const sideMap = {
            paddingTop: 'top',
            paddingRight: 'right',
            paddingBottom: 'bottom',
            paddingLeft: 'left'
        };

        return sideMap[setting] || '';
    },

    getMirroredTextBlockPaddingPatch(block, setting, value) {
        const side = this.getTextBlockPaddingSideFromSetting(setting);
        const normalizedValue = this.clamp(Number(value) || 0, 0, this.TEXT_BLOCK_PADDING_MAX);
        const padding = this.getTextBlockPadding(block);

        if (setting === 'paddingX') {
            padding.left = normalizedValue;
            padding.right = normalizedValue;
            return this.buildTextBlockPaddingPatch(padding);
        }

        if (setting === 'paddingY') {
            padding.top = normalizedValue;
            padding.bottom = normalizedValue;
            return this.buildTextBlockPaddingPatch(padding);
        }

        if (!side) {
            return null;
        }

        if (block?.paddingLinked === false) {
            padding[side] = normalizedValue;
            return this.buildTextBlockPaddingPatch(padding);
        }

        if (side === 'left' || side === 'right') {
            padding.left = normalizedValue;
            padding.right = normalizedValue;
        } else {
            padding.top = normalizedValue;
            padding.bottom = normalizedValue;
        }

        return this.buildTextBlockPaddingPatch(padding);
    },

    getLinkedTextBlockPaddingTogglePatch(block, nextValue) {
        const shouldLink = nextValue === 'true';
        if (!shouldLink) {
            return {
                paddingLinked: false
            };
        }

        const padding = this.getTextBlockPadding(block);
        return {
            paddingLinked: true,
            ...this.buildTextBlockPaddingPatch({
                top: Math.max(padding.top, padding.bottom),
                right: Math.max(padding.left, padding.right),
                bottom: Math.max(padding.top, padding.bottom),
                left: Math.max(padding.left, padding.right)
            })
        };
    },

    getBlockRotation(block) {
        return this.normalizeBlockRotation(block?.rotation || 0);
    },

    normalizeBlockRotation(value) {
        let rotation = Number.isFinite(Number(value)) ? Number(value) : 0;
        while (rotation <= -180) {
            rotation += 360;
        }
        while (rotation > 180) {
            rotation -= 360;
        }
        return Number(rotation.toFixed(1));
    },

    getCanvasBlockTransform(rotation = 0) {
        return `translate(-50%, -50%) rotate(${this.normalizeBlockRotation(rotation)}deg)`;
    },

    getTextBlockFontSizePreset(block) {
        const options = this.TEXT_BLOCK_FONT_SIZE_OPTIONS;
        const currentSize = Number(block?.fontSize);
        const exactMatch = options.find(option => option.size === currentSize);
        if (exactMatch) {
            return exactMatch.id;
        }

        return options.reduce((closest, option) => {
            if (!closest) {
                return option;
            }

            return Math.abs(option.size - currentSize) < Math.abs(closest.size - currentSize)
                ? option
                : closest;
        }, null)?.id || 'm';
    },

    getTextBlockFontSizePatch(presetId) {
        const option = this.TEXT_BLOCK_FONT_SIZE_OPTIONS.find(candidate => candidate.id === presetId) || this.TEXT_BLOCK_FONT_SIZE_OPTIONS[1];
        return {
            fontSizePreset: option.id,
            fontSize: option.size
        };
    },

    isTransparentTextBlockBackground(block) {
        return !block?.backgroundColor || block.backgroundColor === 'transparent';
    },

    getTextBlockColorInputValue(colorValue, fallback = '#111111') {
        if (!colorValue || colorValue === 'transparent') {
            return fallback;
        }

        return colorValue;
    },

    formatTextBlockLineHeight(lineHeight) {
        const normalizedValue = Number.isFinite(Number(lineHeight)) ? Number(lineHeight) : 1.5;
        return normalizedValue.toFixed(1).replace(/\.0$/, '');
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
        const jsonText = this.getCurrentFrameJson(selectedFrame);
        const jsonMetadata = this.getJsonViewMetadata(jsonText);

        return `
            <div class="frame-editor-json-view">
                <div class="frame-editor-json-shell">
                    <div class="frame-editor-json-header">
                        <div class="frame-editor-json-header-copy">
                            <strong>${I18n.translateString('Frame JSON')}</strong>
                            <small>${I18n.translateString('Full-frame JSON export with line numbers.')}</small>
                        </div>
                        <div class="frame-editor-json-stats" aria-label="${this.escapeHTML(I18n.translateString('JSON metadata'))}">
                            <span class="frame-editor-json-stat">${jsonMetadata.lineCount} ${I18n.translateString('lines')}</span>
                            <span class="frame-editor-json-stat">${this.escapeHTML(jsonMetadata.sizeLabel)}</span>
                        </div>
                    </div>
                    <div class="frame-editor-json-scroll">
                        <pre class="frame-editor-json-content"><code class="language-json" data-json-rendered="true">${this.renderJsonLines(jsonText)}</code></pre>
                    </div>
                </div>
            </div>
        `;
    },

    renderJsonLines(jsonText) {
        const lines = String(jsonText || '').split(/\r?\n/);

        return lines.map((line, index) => `<span class="frame-editor-json-line"><span class="frame-editor-json-line-number" aria-hidden="true">${index + 1}</span><span class="frame-editor-json-line-code">${this.highlightJsonLine(line) || '&#8203;'}</span></span>`).join('');
    },

    highlightJsonLine(line) {
        if (!line) {
            return '';
        }

        if (window.hljs && typeof window.hljs.highlight === 'function') {
            try {
                return window.hljs.highlight(line, { language: 'json', ignoreIllegals: true }).value;
            } catch (error) {
                console.warn('Failed to highlight JSON line.', error);
            }
        }

        return this.escapeHTML(line);
    },

    renderCanvasBlock(block) {
        const isActive = this.state.selectedBlockId === block.id;
        const width = this.getCanvasBlockLayout(block).width;
        const style = [
            `left: ${block.xPct}%`,
            `top: ${block.yPct}%`,
            `width: ${width}px`,
            `transform: ${this.getCanvasBlockTransform(block.rotation)}`
        ].join('; ');

        return `
            <div
                class="frame-editor-canvas-block frame-editor-canvas-block-${block.type}${isActive ? ' active' : ''}"
                data-frame-editor-canvas-block="${block.id}"
                data-block-type="${block.type}"
                style="${style}"
                tabindex="0"
                role="button"
                aria-label="${this.escapeHTML(I18n.translateString(this.getBlockLabel(block)))}"
            >
                ${this.renderCanvasBlockInner(block)}
            </div>
        `;
    },

    getBlockLabel(block) {
        if (block?.type === 'text') {
            return 'Text Block';
        }
        if (block?.type === 'shape') {
            return 'Shape Block';
        }
        if (block?.type === 'image') {
            return 'Image Block';
        }
        return 'QR Code Block';
    },

    renderCanvasBlockInner(block) {
        if (block.type === 'text') {
            const layout = this.getTextBlockLayout(block);
            const padding = this.getTextBlockPadding(block);
            const surfaceStyle = [
                `background-color: ${this.isTransparentTextBlockBackground(block) ? 'transparent' : block.backgroundColor}`,
                `border-color: ${(Number(block.borderWidth) || 0) > 0 ? (block.borderColor || block.color || this.getTextBlockDefaultColor()) : 'transparent'}`,
                'border-style: solid',
                `border-width: ${layout.borderWidth}px`,
                `padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
                `border-radius: ${Math.max(0, Number(block.borderRadius) || 0)}px`
            ].join('; ');
            const inlineStyle = [
                `font-size: ${block.fontSize}px`,
                `font-weight: ${block.fontWeight}`,
                `font-style: ${block.fontStyle}`,
                `color: ${block.color}`,
                `text-align: ${block.textAlign || 'left'}`,
                `line-height: ${this.getTextBlockLineHeight(block)}`,
                `letter-spacing: ${(Number(block.letterSpacing) || 0)}px`,
                `text-decoration: ${block.textDecoration || 'none'}`,
                `text-transform: ${block.textTransform || 'none'}`
            ].join('; ');

            return `
                <div class="frame-editor-text-block-surface" style="${surfaceStyle}"><div class="frame-editor-text-block-content" style="${inlineStyle}" spellcheck="false">${this.renderTextBlockContentMarkup(block)}</div></div>
                ${this.state.selectedBlockId === block.id ? this.renderCanvasBlockHandles(block) : ''}
            `;
        }

        if (block.type === 'shape') {
            const layout = this.getShapeBlockLayout(block);
            const borderWidth = Math.max(0, Number(block.borderWidth) || 0);
            const borderColor = borderWidth > 0 ? (block.borderColor || this.getTextBlockDefaultColor()) : 'transparent';
            const fillColor = block.color || this.getTextBlockDefaultColor();
            const shapeStyle = [
                `width: ${layout.width}px`,
                `height: ${layout.height}px`,
                `background-color: ${borderWidth > 0 ? borderColor : fillColor}`,
                this.getShapeBorderRadiusStyle(block),
                this.getShapeClipPathStyle(block),
                'overflow: hidden'
            ].join('; ');
            const innerInset = borderWidth > 0 ? Math.min(borderWidth, Math.floor(Math.min(layout.width, layout.height) / 2)) : 0;
            const fillStyle = innerInset > 0 ? [
                `inset: ${innerInset}px`,
                `background-color: ${fillColor}`,
                this.getShapeBorderRadiusStyle(block),
                this.getShapeClipPathStyle(block)
            ].join('; ') : '';

            return `
                <div class="frame-editor-shape-block-surface" style="${shapeStyle}">
                    ${innerInset > 0 ? `<div class="frame-editor-shape-block-fill" style="${fillStyle}"></div>` : ''}
                </div>
                ${this.state.selectedBlockId === block.id ? this.renderCanvasBlockHandles(block) : ''}
            `;
        }

        if (block.type === 'image') {
            const layout = this.getImageBlockLayout(block);
            const imageSurfaceStyle = [
                `border-width: ${layout.borderWidth}px`,
                'border-style: solid',
                `border-color: ${(Number(block.borderWidth) || 0) > 0 ? (block.borderColor || this.getTextBlockDefaultColor()) : 'transparent'}`,
                `border-radius: ${Math.max(0, Number(block.borderRadius) || 0)}px`,
                `background-color: ${this.isTransparentTextBlockBackground(block) ? 'transparent' : block.backgroundColor}`
            ].join('; ');
            const imageContentStyle = [
                `width: ${layout.imageWidth}px`,
                `height: ${layout.imageHeight}px`
            ].join('; ');

            return `
                <div class="frame-editor-image-block-surface" style="${imageSurfaceStyle}">
                    <div class="frame-editor-image-block-content" style="${imageContentStyle}">
                        ${block.src
                            ? `<img src="${this.escapeHTML(block.src)}" alt="" draggable="false" style="object-fit: ${this.escapeHTML(block.objectFit || 'contain')};">`
                            : `
                                <div class="frame-editor-image-block-placeholder">
                                    <i class="bi bi-image" aria-hidden="true"></i>
                                    <span>${this.escapeHTML(I18n.translateString('Upload image'))}</span>
                                </div>
                            `}
                    </div>
                </div>
                ${this.state.selectedBlockId === block.id ? this.renderCanvasBlockHandles(block) : ''}
            `;
        }

        const layout = this.getQrBlockLayout(block);
        const padding = this.getTextBlockPadding(block);
        const qrSurfaceStyle = [
            `padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
            `border-width: ${layout.borderWidth}px`,
            'border-style: solid',
            `border-color: ${(Number(block.borderWidth) || 0) > 0 ? (block.borderColor || block.colorDark || this.getTextBlockDefaultColor()) : 'transparent'}`,
            `border-radius: ${Math.max(0, Number(block.borderRadius) || 0)}px`,
            `background-color: ${this.isTransparentTextBlockBackground(block) ? 'transparent' : block.backgroundColor}`
        ].join('; ');

        return `
            <div class="frame-editor-qr-block-surface" style="${qrSurfaceStyle}">
                <div class="frame-editor-qr-block-content" style="width: ${this.getQrBlockSize(block)}px; height: ${this.getQrBlockSize(block)}px;">
                    ${this.getCanvasQrMarkup(block)}
                </div>
            </div>
            ${this.state.selectedBlockId === block.id ? this.renderCanvasBlockHandles(block) : ''}
        `;
    },

    getCanvasQrMarkup(block) {
        const size = this.getQrBlockSize(block);
        return buildNativeQRCodeSVG({
            text: block.content || this.PREVIEW_QR_TEXT,
            size,
            qrOptions: {
                ...this.PREVIEW_QR_OPTIONS,
                margin: 0,
                colorDark: block.colorDark,
                colorLight: 'transparent',
                transparentBackground: true,
                correctLevel: QRCode.CorrectLevel[this.PREVIEW_QR_OPTIONS.correctLevel]
            },
            includeLogo: false
        });
    },

    renderTextBlockContentMarkup(block) {
        const text = this.getDisplayTextForBlock(block);
        if (!text) {
            return '&nbsp;';
        }

        const escapeWithLineBreaks = value => this.escapeHTML(value).replace(/\n/g, '<br>');
        if (!block?.dropCap) {
            return escapeWithLineBreaks(text);
        }

        const characters = Array.from(text);
        const firstCharacter = characters.shift() || '';
        if (!firstCharacter || firstCharacter === '\n') {
            return escapeWithLineBreaks(text);
        }

        return `<span class="frame-editor-text-block-drop-cap">${this.escapeHTML(firstCharacter)}</span>${escapeWithLineBreaks(characters.join(''))}`;
    },

    renderCanvasBlockHandles(block) {
        if (!block) {
            return '';
        }

        if (block.type === 'shape' || block.type === 'image') {
            return `
                ${this.renderBlockRotateHandle()}
                ${this.renderShapeImageResizeHandles()}
            `;
        }

        return `
            ${this.renderBlockRotateHandle()}
            ${this.renderTextBlockResizeHandles()}
        `;
    },

    renderBlockRotateHandle() {
        return `
            <button
                type="button"
                class="frame-editor-block-rotate-handle"
                data-frame-editor-rotate-handle
                tabindex="-1"
                aria-hidden="true"
            ></button>
        `;
    },

    renderTextBlockResizeHandles() {
        return ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-right', 'bottom-left'].map(side => `
            <button
                type="button"
                class="frame-editor-text-block-resize-handle frame-editor-text-block-resize-handle-${side}"
                data-frame-editor-padding-handle="${side}"
                tabindex="-1"
                aria-hidden="true"
            ></button>
        `).join('');
    },

    renderShapeImageResizeHandles() {
        return ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-right', 'bottom-left'].map(side => `
            <button
                type="button"
                class="frame-editor-block-resize-handle frame-editor-block-resize-handle-${side}"
                data-frame-editor-resize-handle="${side}"
                tabindex="-1"
                aria-hidden="true"
            ></button>
        `).join('');
    },

    getDisplayTextForBlock(block) {
        const text = String(block?.text || '');
        const textTransform = block?.textTransform || 'none';
        if (textTransform === 'uppercase') {
            return text.toUpperCase();
        }
        if (textTransform === 'lowercase') {
            return text.toLowerCase();
        }
        if (textTransform === 'capitalize') {
            return text.replace(/\b([a-z])/gi, match => match.toUpperCase());
        }
        return text;
    },

    getTextMeasureContext() {
        if (!this.textMeasureCanvas) {
            this.textMeasureCanvas = document.createElement('canvas');
        }

        return this.textMeasureCanvas.getContext('2d');
    },

    getTextBlockLayout(block) {
        const fontSize = Number(block?.fontSize) || 32;
        const fontWeight = Number(block?.fontWeight) >= 700 ? 700 : 400;
        const fontStyle = block?.fontStyle === 'italic' ? 'italic' : 'normal';
        const lineHeight = this.getTextBlockLineHeight(block);
        const letterSpacing = Number(block?.letterSpacing) || 0;
        const text = this.getDisplayTextForBlock(block);
        const lines = text ? text.split('\n') : [''];
        const padding = this.getTextBlockPadding(block);
        const borderWidth = Math.max(0, Number(block?.borderWidth) || 0);
        const effectiveLineHeight = lineHeight;
        const measureContext = this.getTextMeasureContext();

        if (measureContext) {
            measureContext.font = `${fontStyle} ${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        }

        const maxLineWidth = lines.reduce((maxWidth, line) => {
            const normalizedLine = line || ' ';
            const glyphCount = Math.max(0, Array.from(normalizedLine).length - 1);
            const measuredWidth = measureContext
                ? measureContext.measureText(normalizedLine).width
                : (normalizedLine.length * fontSize * 0.6);
            return Math.max(maxWidth, measuredWidth + (glyphCount * letterSpacing));
        }, 0);

        const dropCapWidth = block?.dropCap ? fontSize * 1.1 : 0;
        const contentWidth = Math.max(fontSize * 0.7, maxLineWidth + dropCapWidth);
        const contentHeight = Math.max(fontSize, lines.length * fontSize * effectiveLineHeight, block?.dropCap ? fontSize * 2.4 : 0);

        return {
            width: Math.ceil(contentWidth + padding.left + padding.right + (borderWidth * 2)),
            height: Math.ceil(contentHeight + padding.top + padding.bottom + (borderWidth * 2)),
            paddingTop: padding.top,
            paddingRight: padding.right,
            paddingBottom: padding.bottom,
            paddingLeft: padding.left,
            borderWidth
        };
    },

    getQrBlockLayout(block) {
        const padding = this.getTextBlockPadding(block);
        const borderWidth = Math.max(0, Number(block?.borderWidth) || 0);
        const size = this.getQrBlockSize(block);
        return {
            width: Math.ceil(size + padding.left + padding.right + (borderWidth * 2)),
            height: Math.ceil(size + padding.top + padding.bottom + (borderWidth * 2)),
            borderWidth
        };
    },

    getQrBlockSize(block) {
        return Math.max(80, Number(block?.size) || 180);
    },

    getShapeBlockLayout(block) {
        return {
            width: Math.max(48, Number(block?.width) || 160),
            height: Math.max(48, Number(block?.height) || 160)
        };
    },

    getImageBlockLayout(block) {
        const borderWidth = Math.max(0, Number(block?.borderWidth) || 0);
        const imageWidth = Math.max(48, Number(block?.width) || 180);
        const imageHeight = Math.max(48, Number(block?.height) || 180);
        return {
            width: Math.ceil(imageWidth + (borderWidth * 2)),
            height: Math.ceil(imageHeight + (borderWidth * 2)),
            imageWidth: Math.ceil(imageWidth),
            imageHeight: Math.ceil(imageHeight),
            borderWidth
        };
    },

    getShapeClipPath(shapeType) {
        const clipPaths = {
            triangle: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        };
        return clipPaths[shapeType] || '';
    },

    getShapeClipPathStyle(block) {
        const clipPath = this.getShapeClipPath(block?.shapeType);
        return clipPath ? `clip-path: ${clipPath}` : '';
    },

    getShapeBorderRadiusStyle(block) {
        if (block?.shapeType === 'circle') {
            return 'border-radius: 999px';
        }
        if (!block?.shapeType || block.shapeType === 'rectangle') {
            return `border-radius: ${Math.max(0, Number(block?.borderRadius) || 0)}px`;
        }
        return '';
    },

    getCanvasBlockLayout(block) {
        if (!block) {
            return {
                width: 0,
                height: 0
            };
        }

        if (block.type === 'qr') {
            return this.getQrBlockLayout(block);
        }
        if (block.type === 'shape') {
            return this.getShapeBlockLayout(block);
        }
        if (block.type === 'image') {
            return this.getImageBlockLayout(block);
        }
        return this.getTextBlockLayout(block);
    },

    getTextBlockLineHeight(block) {
        const lineCount = String(block?.text || '').includes('\n') ? String(block.text).split('\n').length : 1;
        if (lineCount <= 1) {
            return 1;
        }

        const lineHeight = Number(block?.lineHeight) || 1.5;
        return Math.max(1.1, lineHeight);
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
        if (!root) {
            return null;
        }
        let bounds = null;
        const { x: panX, y: panY } = this.getEffectiveCanvasPan();
        const zoom = Math.max(this.state.canvasZoom, 0.01);

        this.state.canvasBlocks.forEach(block => {
            const footprint = this.getCanvasBlockFootprint(block);
            if (!footprint.width || !footprint.height) {
                return;
            }

            const centerX = (block.xPct / 100) * viewportWidth;
            const centerY = (block.yPct / 100) * viewportHeight;
            const left = panX + ((centerX - (footprint.width / 2)) * zoom);
            const top = panY + ((centerY - (footprint.height / 2)) * zoom);
            const right = panX + ((centerX + (footprint.width / 2)) * zoom);
            const bottom = panY + ((centerY + (footprint.height / 2)) * zoom);

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

    getRotatedFootprint(width, height, rotation = 0) {
        const radians = Math.abs(this.normalizeBlockRotation(rotation)) * (Math.PI / 180);
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));
        return {
            width: (width * cos) + (height * sin),
            height: (width * sin) + (height * cos)
        };
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

        return {
            viewportWidth,
            viewportHeight,
            viewportLeft: 0,
            viewportTop: 0,
            sceneOffsetX: effectivePan.x,
            sceneOffsetY: effectivePan.y,
            stageWidth: viewportWidth,
            stageHeight: viewportHeight,
            defaultScrollLeft: 0,
            defaultScrollTop: 0
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
        if (!workspace) {
            return;
        }
        if (!scroll || !metrics) {
            workspace.style.removeProperty('background-color');
            workspace.style.removeProperty('background-image');
            workspace.style.removeProperty('background-size');
            workspace.style.removeProperty('background-position');
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

        const scrollState = this.capturePanelScrollState(root);
        root.innerHTML = this.render();
        this.bindEvents(root);
        this.restorePanelScrollState(root, scrollState);
        this.highlightJsonView(root);
        this.syncViewportLayout(root);
        this.restorePanelScrollState(root, scrollState);
    },

    highlightJsonView(root = this.getRoot()) {
        const code = root?.querySelector?.('.frame-editor-json-content code.language-json:not([data-json-rendered="true"])');
        if (!code || !window.hljs || typeof window.hljs.highlightElement !== 'function') {
            return;
        }

        window.hljs.highlightElement(code);
    },

    capturePanelScrollState(root = this.getRoot()) {
        return {
            leftSidebarScrollTop: root?.querySelector?.('.frame-editor-sidebar-body')?.scrollTop ?? null,
            rightSidebarScrollTop: root?.querySelector?.('.frame-editor-right-sidebar-body')?.scrollTop ?? null,
            jsonViewScrollTop: root?.querySelector?.('.frame-editor-json-scroll')?.scrollTop ?? null
        };
    },

    restorePanelScrollState(root = this.getRoot(), scrollState = {}) {
        const leftSidebarBody = root?.querySelector?.('.frame-editor-sidebar-body');
        const rightSidebarBody = root?.querySelector?.('.frame-editor-right-sidebar-body');
        const jsonView = root?.querySelector?.('.frame-editor-json-scroll');

        if (leftSidebarBody && Number.isFinite(scrollState.leftSidebarScrollTop)) {
            leftSidebarBody.scrollTop = scrollState.leftSidebarScrollTop;
        }

        if (rightSidebarBody && Number.isFinite(scrollState.rightSidebarScrollTop)) {
            rightSidebarBody.scrollTop = scrollState.rightSidebarScrollTop;
        }

        if (jsonView && Number.isFinite(scrollState.jsonViewScrollTop)) {
            jsonView.scrollTop = scrollState.jsonViewScrollTop;
        }
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

        root.addEventListener('pointerdown', event => {
            const rotateHandle = event.target.closest('[data-frame-editor-rotate-handle]');
            if (rotateHandle && root.contains(rotateHandle)) {
                this.beginCanvasBlockRotate(root, rotateHandle, event);
                return;
            }

            const resizeHandle = event.target.closest('[data-frame-editor-resize-handle]');
            if (resizeHandle && root.contains(resizeHandle)) {
                this.beginCanvasBlockResize(root, resizeHandle, event);
                return;
            }

            const handle = event.target.closest('[data-frame-editor-padding-handle]');
            if (!handle || !root.contains(handle)) {
                return;
            }

            this.beginTextBlockPaddingResize(root, handle, event);
        });

        root.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                this.hideCanvasZoomContextMenu(root);
            }
        });

        root.querySelectorAll('[data-frame-editor-canvas-block]').forEach(blockElement => {
            blockElement.addEventListener('pointerdown', event => {
                if (
                    event.target.closest('[data-frame-editor-padding-handle]')
                    || event.target.closest('[data-frame-editor-resize-handle]')
                    || event.target.closest('[data-frame-editor-rotate-handle]')
                ) {
                    return;
                }
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

        root.querySelectorAll('[data-block-adjust]').forEach(button => {
            button.addEventListener('click', () => {
                const selectedBlock = this.getSelectedBlock();
                if (!selectedBlock || selectedBlock.type !== 'text') {
                    return;
                }

                const setting = button.dataset.blockAdjust;
                if (setting !== 'lineHeight') {
                    return;
                }

                const direction = button.dataset.blockAdjustDirection === 'decrease' ? -1 : 1;
                const nextLineHeight = this.clamp((Number(selectedBlock.lineHeight) || 1.5) + (direction * 0.1), 0.8, 3);
                this.updateBlock(selectedBlock.id, {
                    lineHeight: Number(nextLineHeight.toFixed(1))
                });
                this.renderIntoRoot();
            });
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

                this.updateBlock(block.id, this.getBlockTogglePatch(block, setting, button.dataset.blockValue || ''));
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

        root.querySelectorAll('[data-block-image-upload]').forEach(input => {
            input.addEventListener('change', event => {
                this.handleImageBlockUpload(root, event.currentTarget);
            });
        });

        root.querySelectorAll('[data-canvas-action]').forEach(button => {
            button.addEventListener('click', () => {
                if (button.dataset.canvasAction === 'reset-view') {
                    this.resetCanvasView();
                    return;
                }

                if (button.dataset.canvasAction === 'fit-blocks') {
                    this.fitCanvasToBlocks(root);
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

    beginTextBlockPaddingResize(root, handleElement, event) {
        if (event.button !== 0) {
            return;
        }

        const handle = handleElement.dataset.frameEditorPaddingHandle;
        const blockElement = handleElement.closest('[data-frame-editor-canvas-block]');
        const blockId = blockElement?.dataset.frameEditorCanvasBlock;
        const block = this.getBlockById(blockId);
        const canvasScroll = root.querySelector('[data-frame-editor-canvas-scroll]');
        if (!handle || !blockElement || !block || !canvasScroll) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const startPointer = {
            x: event.clientX,
            y: event.clientY
        };
        let nextPatch = null;
        let nextPosition = {
            xPct: block.xPct,
            yPct: block.yPct
        };
        let didResize = false;

        const onPointerMove = moveEvent => {
            const deltaX = moveEvent.clientX - startPointer.x;
            const deltaY = moveEvent.clientY - startPointer.y;
            const threshold = handle.includes('-')
                ? Math.hypot(deltaX, deltaY)
                : Math.abs((handle === 'left' || handle === 'right') ? deltaX : deltaY);
            if (!didResize && threshold >= 2) {
                didResize = true;
                blockElement.classList.add('is-resizing');
            }

            if (!didResize) {
                return;
            }

            const resizePreview = this.getTextBlockResizePreview(
                root,
                block,
                handle,
                deltaX / Math.max(this.state.canvasZoom, 0.01),
                deltaY / Math.max(this.state.canvasZoom, 0.01),
                canvasScroll
            );
            nextPatch = resizePreview.patch;
            nextPosition = resizePreview.position;
            const previewBlock = {
                ...block,
                ...resizePreview.patch,
                ...resizePreview.position
            };
            const layout = this.getCanvasBlockLayout(previewBlock);

            blockElement.style.left = `${previewBlock.xPct}%`;
            blockElement.style.top = `${previewBlock.yPct}%`;
            blockElement.style.width = `${layout.width}px`;
            blockElement.innerHTML = this.renderCanvasBlockInner(previewBlock);
            this.syncInspectorBlockControls(root, resizePreview.patch);
        };

        const finishResize = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            blockElement.classList.remove('is-resizing');

            if (!didResize || !nextPatch) {
                return;
            }

            this.updateBlock(block.id, {
                ...nextPatch,
                ...nextPosition
            });
            this.renderIntoRoot();
            this.clampUpdatedBlockToCanvas(this.getRoot(), this.getBlockById(block.id));
        };

        const onPointerUp = () => {
            finishResize();
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    },

    beginCanvasBlockResize(root, handleElement, event) {
        if (event.button !== 0) {
            return;
        }

        const handle = handleElement.dataset.frameEditorResizeHandle;
        const blockElement = handleElement.closest('[data-frame-editor-canvas-block]');
        const blockId = blockElement?.dataset.frameEditorCanvasBlock;
        const block = this.getBlockById(blockId);
        const canvasScroll = root.querySelector('[data-frame-editor-canvas-scroll]');
        const metrics = this.getCanvasLayoutMetrics(root);
        if (!handle || !blockElement || !block || !canvasScroll || !metrics || (block.type !== 'shape' && block.type !== 'image')) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const zoom = Math.max(this.state.canvasZoom, 0.01);
        const surfaceElement = blockElement.querySelector('.frame-editor-shape-block-surface, .frame-editor-image-block-surface') || blockElement;
        const surfaceRect = surfaceElement.getBoundingClientRect();
        const startOuterWidth = surfaceRect.width / zoom;
        const startOuterHeight = surfaceRect.height / zoom;
        const startCenter = {
            x: (block.xPct / 100) * metrics.viewportWidth,
            y: (block.yPct / 100) * metrics.viewportHeight
        };
        const startEdges = {
            left: startCenter.x - (startOuterWidth / 2),
            right: startCenter.x + (startOuterWidth / 2),
            top: startCenter.y - (startOuterHeight / 2),
            bottom: startCenter.y + (startOuterHeight / 2)
        };
        const minBorder = block.type === 'image' ? (Math.max(0, Number(block.borderWidth) || 0) * 2) : 0;
        const minOuterWidth = Math.max(48 + minBorder, 48);
        const minOuterHeight = Math.max(48 + minBorder, 48);
        let didResize = false;
        let nextPatch = null;
        let nextPosition = {
            xPct: block.xPct,
            yPct: block.yPct
        };

        const updatePreview = (outerWidth, outerHeight, centerX, centerY) => {
            const previewBlock = {
                ...block,
                ...nextPatch,
                ...nextPosition
            };
            const layout = this.getCanvasBlockLayout(previewBlock);
            blockElement.style.left = `${previewBlock.xPct}%`;
            blockElement.style.top = `${previewBlock.yPct}%`;
            blockElement.style.width = `${layout.width}px`;
            blockElement.style.transform = this.getCanvasBlockTransform(previewBlock.rotation);
            blockElement.innerHTML = this.renderCanvasBlockInner(previewBlock);
            this.syncInspectorBlockControls(root, nextPatch);
            this.applyCanvasLayout(root);
        };

        const onPointerMove = moveEvent => {
            const deltaX = (moveEvent.clientX - event.clientX) / zoom;
            const deltaY = (moveEvent.clientY - event.clientY) / zoom;

            if (!didResize && Math.hypot(deltaX, deltaY) >= 2) {
                didResize = true;
                blockElement.classList.add('is-resizing');
            }

            if (!didResize) {
                return;
            }

            let nextLeft = startEdges.left;
            let nextRight = startEdges.right;
            let nextTop = startEdges.top;
            let nextBottom = startEdges.bottom;

            if (handle.includes('left')) {
                nextLeft = Math.min(startEdges.left + deltaX, startEdges.right - minOuterWidth);
            } else if (handle.includes('right')) {
                nextRight = Math.max(startEdges.right + deltaX, startEdges.left + minOuterWidth);
            }

            if (handle.includes('top')) {
                nextTop = Math.min(startEdges.top + deltaY, startEdges.bottom - minOuterHeight);
            } else if (handle.includes('bottom')) {
                nextBottom = Math.max(startEdges.bottom + deltaY, startEdges.top + minOuterHeight);
            }

            const outerWidth = Math.max(minOuterWidth, nextRight - nextLeft);
            const outerHeight = Math.max(minOuterHeight, nextBottom - nextTop);
            const centerX = nextLeft + (outerWidth / 2);
            const centerY = nextTop + (outerHeight / 2);
            const borderWidth = Math.max(0, Number(block.borderWidth) || 0);

            nextPatch = block.type === 'image'
                ? {
                    width: Math.max(48, Math.round(outerWidth - (borderWidth * 2))),
                    height: Math.max(48, Math.round(outerHeight - (borderWidth * 2)))
                }
                : {
                    width: Math.max(48, Math.round(outerWidth)),
                    height: Math.max(48, Math.round(outerHeight))
                };

            nextPosition = {
                xPct: Number(((centerX / metrics.viewportWidth) * 100).toFixed(4)),
                yPct: Number(((centerY / metrics.viewportHeight) * 100).toFixed(4))
            };

            updatePreview(outerWidth, outerHeight, centerX, centerY);
        };

        const finishResize = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            blockElement.classList.remove('is-resizing');

            if (!didResize || !nextPatch) {
                return;
            }

            this.updateBlock(block.id, {
                ...nextPatch,
                ...nextPosition
            });
            this.renderIntoRoot();
            this.clampUpdatedBlockToCanvas(this.getRoot(), this.getBlockById(block.id));
        };

        const onPointerUp = () => {
            finishResize();
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    },

    beginCanvasBlockRotate(root, handleElement, event) {
        if (event.button !== 0) {
            return;
        }

        const blockElement = handleElement.closest('[data-frame-editor-canvas-block]');
        const blockId = blockElement?.dataset.frameEditorCanvasBlock;
        const block = this.getBlockById(blockId);
        if (!blockElement || !block) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const surfaceElement = () => blockElement.querySelector('.frame-editor-text-block-surface, .frame-editor-qr-block-surface, .frame-editor-shape-block-surface, .frame-editor-image-block-surface') || blockElement;
        const getCenterPoint = () => {
            const rect = surfaceElement().getBoundingClientRect();
            return {
                x: rect.left + (rect.width / 2),
                y: rect.top + (rect.height / 2)
            };
        };
        const getPointerAngle = moveEvent => {
            const center = getCenterPoint();
            return Math.atan2(moveEvent.clientY - center.y, moveEvent.clientX - center.x) * (180 / Math.PI);
        };

        const startRotation = this.getBlockRotation(block);
        const startAngle = getPointerAngle(event);
        let nextRotation = startRotation;
        let didRotate = false;

        const onPointerMove = moveEvent => {
            const currentAngle = getPointerAngle(moveEvent);
            nextRotation = this.normalizeBlockRotation(startRotation + (currentAngle - startAngle));
            if (!didRotate && Math.abs(nextRotation - startRotation) >= 1) {
                didRotate = true;
                blockElement.classList.add('is-rotating');
            }

            blockElement.style.transform = this.getCanvasBlockTransform(nextRotation);
            this.syncInspectorBlockControls(root, {
                rotation: nextRotation
            });
        };

        const finishRotate = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            blockElement.classList.remove('is-rotating');

            if (!didRotate) {
                return;
            }

            this.updateBlock(block.id, {
                rotation: nextRotation
            });
            const updatedBlock = this.getBlockById(block.id);
            this.syncCanvasBlock(root, updatedBlock);
            this.clampUpdatedBlockToCanvas(root, updatedBlock);
        };

        const onPointerUp = () => {
            finishRotate();
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    },

    getTextBlockResizePreview(root, block, handle, deltaX, deltaY, canvasScroll) {
        const padding = this.getTextBlockPadding(block);
        const nextPadding = { ...padding };
        const nextPosition = {
            xPct: block.xPct,
            yPct: block.yPct
        };
        const rotationRadians = this.getBlockRotation(block) * (Math.PI / 180);
        const cosine = Math.cos(rotationRadians);
        const sine = Math.sin(rotationRadians);
        const localDeltaX = (deltaX * cosine) + (deltaY * sine);
        const localDeltaY = (-deltaX * sine) + (deltaY * cosine);
        const deltasBySide = {
            left: -localDeltaX,
            right: localDeltaX,
            top: -localDeltaY,
            bottom: localDeltaY
        };
        const affectedSides = handle.split('-').filter(Boolean);

        affectedSides.forEach(side => {
            const actualDelta = Number(deltasBySide[side]) || 0;
            const nextValue = this.clamp(padding[side] + actualDelta, 0, this.TEXT_BLOCK_PADDING_MAX);
            const appliedDelta = nextValue - padding[side];
            nextPadding[side] = nextValue;

            let localShiftX = 0;
            let localShiftY = 0;
            if (side === 'left') {
                localShiftX -= appliedDelta / 2;
            } else if (side === 'right') {
                localShiftX += appliedDelta / 2;
            } else if (side === 'top') {
                localShiftY -= appliedDelta / 2;
            } else if (side === 'bottom') {
                localShiftY += appliedDelta / 2;
            }

            const globalShiftX = (localShiftX * cosine) - (localShiftY * sine);
            const globalShiftY = (localShiftX * sine) + (localShiftY * cosine);
            nextPosition.xPct += (globalShiftX / Math.max(canvasScroll.clientWidth, 1)) * 100;
            nextPosition.yPct += (globalShiftY / Math.max(canvasScroll.clientHeight, 1)) * 100;
        });

        const patch = this.buildTextBlockPaddingPatch(nextPadding);
        const previewBlock = {
            ...block,
            ...patch,
            paddingLinked: false,
            ...nextPosition
        };

        return {
            patch: {
                paddingLinked: false,
                ...patch
            },
            position: this.clampCanvasBlockPosition(root, previewBlock, nextPosition)
        };
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

        if (setting === 'appearance') {
            this.updateBlock(block.id, this.getTextBlockAppearancePatch(control.value));
            const updatedAppearanceBlock = this.getBlockById(block.id);
            this.syncCanvasBlock(root, updatedAppearanceBlock);
            this.clampUpdatedBlockToCanvas(root, updatedAppearanceBlock);
            return;
        }

        const numericSettings = new Set(['fontSize', 'width', 'height', 'size', 'lineHeight', 'letterSpacing', 'paddingX', 'paddingY', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderWidth', 'borderRadius', 'rotation']);
        let nextValue;

        if (setting === 'backgroundColorRaw') {
            nextValue = control.value;
        } else if (control.type === 'checkbox') {
            nextValue = control.checked;
        } else {
            nextValue = numericSettings.has(setting)
                ? Number(control.value)
                : control.value;
        }

        if (setting === 'rotation') {
            nextValue = this.normalizeBlockRotation(nextValue);
        }

        const patch = setting === 'backgroundColorRaw'
            ? { backgroundColor: nextValue }
            : (this.getMirroredTextBlockPaddingPatch(block, setting, nextValue) || { [setting]: nextValue });

        this.updateBlock(block.id, patch);
        this.syncInspectorBlockControls(root, patch);
        const updatedBlock = this.getBlockById(block.id);
        this.syncCanvasBlock(root, updatedBlock);
        this.clampUpdatedBlockToCanvas(root, updatedBlock);
    },

    handleImageBlockUpload(root, input) {
        const block = this.getSelectedBlock();
        const file = input?.files?.[0];
        if (!block || block.type !== 'image' || !file || !String(file.type || '').startsWith('image/')) {
            return;
        }

        const blockId = block.id;
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const result = typeof reader.result === 'string' ? reader.result : '';
            if (!result) {
                return;
            }

            const previewImage = new Image();
            previewImage.addEventListener('load', () => {
                const nextSize = this.getImageUploadDimensions(previewImage.naturalWidth, previewImage.naturalHeight);
                this.updateBlock(blockId, {
                    src: result,
                    imageName: file.name,
                    width: nextSize.width,
                    height: nextSize.height
                });
                this.renderIntoRoot();
                this.clampUpdatedBlockToCanvas(this.getRoot(), this.getBlockById(blockId));
            });
            previewImage.addEventListener('error', () => {
                this.updateBlock(blockId, {
                    src: result,
                    imageName: file.name
                });
                this.renderIntoRoot();
                this.clampUpdatedBlockToCanvas(this.getRoot(), this.getBlockById(blockId));
            });
            previewImage.src = result;
        });
        reader.readAsDataURL(file);
    },

    getImageUploadDimensions(naturalWidth, naturalHeight) {
        if (!Number.isFinite(naturalWidth) || !Number.isFinite(naturalHeight) || naturalWidth <= 0 || naturalHeight <= 0) {
            return {
                width: 180,
                height: 180
            };
        }

        const longestSide = Math.max(naturalWidth, naturalHeight);
        const targetLongestSide = this.clamp(longestSide, 120, 240);
        const scale = targetLongestSide / longestSide;

        return {
            width: Math.max(24, Math.round(naturalWidth * scale)),
            height: Math.max(24, Math.round(naturalHeight * scale))
        };
    },

    syncInspectorBlockControls(root, patch = {}) {
        const patchEntries = Object.entries(patch);
        if (!root || !patchEntries.length) {
            return;
        }

        root.querySelectorAll('[data-block-setting]').forEach(control => {
            const setting = control.dataset.blockSetting;
            const matchingEntry = patchEntries.find(([key]) => key === setting);
            if (!matchingEntry) {
                return;
            }

            if (control === document.activeElement) {
                return;
            }

            const [, value] = matchingEntry;
            if (control.type === 'checkbox') {
                control.checked = Boolean(value);
                return;
            }

            control.value = String(value);
        });
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

        const resolvedWidth = this.getCanvasBlockLayout(block).width;
        blockElement.style.left = `${block.xPct}%`;
        blockElement.style.top = `${block.yPct}%`;
        blockElement.style.width = `${resolvedWidth}px`;
        blockElement.style.transform = this.getCanvasBlockTransform(block.rotation);
        blockElement.innerHTML = this.renderCanvasBlockInner(block);
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
        const normalizedZoom = Number(this.clamp(nextZoom, this.MIN_CANVAS_ZOOM, this.MAX_CANVAS_ZOOM).toFixed(2));
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

    fitCanvasToBlocks(root = this.getRoot()) {
        const metrics = this.getCanvasLayoutMetrics(root);
        const bounds = this.getCanvasBlockContentBounds(root);
        if (!metrics || !bounds) {
            this.resetCanvasView(root);
            return;
        }

        const horizontalPadding = Math.min(Math.max(metrics.viewportWidth * 0.08, 32), 96);
        const verticalPadding = Math.min(Math.max(metrics.viewportHeight * 0.08, 32), 96);
        const availableWidth = Math.max(metrics.viewportWidth - (horizontalPadding * 2), 1);
        const availableHeight = Math.max(metrics.viewportHeight - (verticalPadding * 2), 1);
        const contentWidth = Math.max(bounds.right - bounds.left, 1);
        const contentHeight = Math.max(bounds.bottom - bounds.top, 1);
        const nextZoom = Number(this.clamp(
            Math.min(availableWidth / contentWidth, availableHeight / contentHeight),
            this.MIN_CANVAS_ZOOM,
            this.MAX_CANVAS_ZOOM
        ).toFixed(2));
        const centerX = bounds.left + (contentWidth / 2);
        const centerY = bounds.top + (contentHeight / 2);

        this.queueCanvasScrollCompensation(root);
        this.state = {
            ...this.state,
            canvasZoom: nextZoom,
            canvasPanX: (metrics.viewportWidth / 2) - (centerX * nextZoom),
            canvasPanY: (metrics.viewportHeight / 2) - (centerY * nextZoom)
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
        this.clampAllBlocksToCanvas(root);
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
        const defaultYPct = blockType === 'text'
            ? 28
            : (blockType === 'shape' ? 40 : 52);
        const yPct = Number.isFinite(basePosition.yPct) ? basePosition.yPct : defaultYPct;

        if (blockType === 'text') {
            return {
                id: this.getNextBlockId(),
                type: 'text',
                text: I18n.translateString('This is a text block'),
                xPct,
                yPct,
                width: 0,
                fontSize: 32,
                fontSizePreset: 'm',
                fontWeight: 400,
                fontStyle: 'normal',
                color: this.getTextBlockDefaultColor(),
                backgroundColor: 'transparent',
                paddingTop: 0,
                paddingRight: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingX: 0,
                paddingY: 0,
                paddingLinked: true,
                borderWidth: 0,
                borderRadius: 0,
                borderColor: this.getTextBlockDefaultColor(),
                rotation: 0,
                lineHeight: 1.5,
                letterSpacing: 0,
                textDecoration: 'none',
                textTransform: 'none',
                dropCap: false,
                textAlign: 'left'
            };
        }

        if (blockType === 'shape') {
            return {
                id: this.getNextBlockId(),
                type: 'shape',
                shapeType: 'rectangle',
                xPct,
                yPct,
                width: 160,
                height: 160,
                color: this.getTextBlockDefaultColor(),
                borderRadius: 18,
                rotation: 0
            };
        }

        if (blockType === 'image') {
            return {
                id: this.getNextBlockId(),
                type: 'image',
                xPct,
                yPct,
                src: '',
                imageName: '',
                width: 180,
                height: 180,
                objectFit: 'contain',
                backgroundColor: 'transparent',
                borderWidth: 0,
                borderRadius: 0,
                borderColor: this.getTextBlockDefaultColor(),
                rotation: 0
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
            colorLight: 'transparent',
            backgroundColor: 'transparent',
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingX: 0,
            paddingY: 0,
            paddingLinked: true,
            borderWidth: 0,
            borderRadius: 0,
            borderColor: this.getTextBlockDefaultColor(),
            rotation: 0
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

    getCanvasBlockContentBounds(root = this.getRoot()) {
        const metrics = this.getCanvasLayoutMetrics(root);
        if (!metrics || !this.state.canvasBlocks?.length) {
            return null;
        }

        let bounds = null;
        this.state.canvasBlocks.forEach(block => {
            const footprint = this.getCanvasBlockFootprint(block);
            if (!footprint.width || !footprint.height) {
                return;
            }

            const centerX = (block.xPct / 100) * metrics.viewportWidth;
            const centerY = (block.yPct / 100) * metrics.viewportHeight;
            const left = centerX - (footprint.width / 2);
            const top = centerY - (footprint.height / 2);
            const right = centerX + (footprint.width / 2);
            const bottom = centerY + (footprint.height / 2);

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

    getCanvasBlockFootprint(block, blockElement = null) {
        if (blockElement) {
            const measuredElement = blockElement.querySelector('.frame-editor-text-block-surface, .frame-editor-qr-block-surface, .frame-editor-shape-block-surface, .frame-editor-image-block-surface') || blockElement;
            const blockRect = measuredElement.getBoundingClientRect();
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

        const layout = this.getCanvasBlockLayout(block);
        return this.getRotatedFootprint(layout.width, layout.height, block.rotation);
    },

    clampCanvasBlockPosition(root, block, position, blockElement = null) {
        const nextXPct = Number(position?.xPct);
        const nextYPct = Number(position?.yPct);
        const fallbackXPct = Number(block?.xPct);
        const fallbackYPct = Number(block?.yPct);
        return {
            xPct: Number.isFinite(nextXPct)
                ? Number(nextXPct.toFixed(4))
                : (Number.isFinite(fallbackXPct) ? fallbackXPct : 50),
            yPct: Number.isFinite(nextYPct)
                ? Number(nextYPct.toFixed(4))
                : (Number.isFinite(fallbackYPct) ? fallbackYPct : 50)
        };
    },

    clampAllBlocksToCanvas(root = this.getRoot()) {
        if (!root || !this.state.canvasBlocks?.length) {
            return;
        }

        this.state.canvasBlocks.forEach(block => {
            const blockElement = root.querySelector(`[data-frame-editor-canvas-block="${block.id}"]`);
            const clamped = this.clampCanvasBlockPosition(root, block, { xPct: block.xPct, yPct: block.yPct }, blockElement || undefined);
            if (Math.abs(clamped.xPct - block.xPct) > 0.01 || Math.abs(clamped.yPct - block.yPct) > 0.01) {
                this.updateBlock(block.id, clamped);
                if (blockElement) {
                    blockElement.style.left = `${clamped.xPct}%`;
                    blockElement.style.top = `${clamped.yPct}%`;
                }
            }
        });
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

    getBlockTogglePatch(block, setting, value) {
        if (block.type === 'text') {
            if (setting === 'fontSizePreset') {
                return this.getTextBlockFontSizePatch(value);
            }
        }

        if (setting === 'backgroundColor') {
            return {
                backgroundColor: value === 'transparent' ? 'transparent' : value
            };
        }

        if (setting === 'paddingLinked') {
            return this.getLinkedTextBlockPaddingTogglePatch(block, value);
        }

        return {
            [setting]: value
        };
    },

    getTextBlockDefaultColor() {
        return this.isLightColor(this.state.canvasBackgroundColor) ? '#000000' : '#ffffff';
    },

    isLightColor(hexColor) {
        const normalized = String(hexColor || '').replace('#', '').trim();
        if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
            return false;
        }

        const red = Number.parseInt(normalized.slice(0, 2), 16);
        const green = Number.parseInt(normalized.slice(2, 4), 16);
        const blue = Number.parseInt(normalized.slice(4, 6), 16);
        return (0.299 * red + 0.587 * green + 0.114 * blue) > 186;
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

    getJsonViewMetadata(jsonText) {
        const text = String(jsonText || '');
        const byteLength = this.getUtf8ByteLength(text);

        return {
            lineCount: text ? text.split(/\r?\n/).length : 0,
            byteLength,
            sizeLabel: this.formatJsonByteSize(byteLength)
        };
    },

    getUtf8ByteLength(text) {
        const value = String(text || '');

        if (typeof TextEncoder !== 'undefined') {
            return new TextEncoder().encode(value).length;
        }

        if (typeof Blob === 'function') {
            return new Blob([value]).size;
        }

        return value.length;
    },

    formatJsonByteSize(byteLength) {
        const normalized = Number.isFinite(byteLength) && byteLength > 0 ? byteLength : 0;
        if (normalized < 1024) {
            return `${normalized.toLocaleString()} B`;
        }

        const units = ['KB', 'MB', 'GB'];
        let size = normalized / 1024;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex += 1;
        }

        const rounded = size >= 10 || Number.isInteger(size)
            ? size.toFixed(0)
            : size.toFixed(1);
        return `${rounded} ${units[unitIndex]} (${normalized.toLocaleString()} B)`;
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
