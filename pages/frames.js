"use strict";

// Frame Editor Module
const FramesMode = {
    frameLibraryCache: null,
    framePreviewCache: new Map(),
    qrMarkupCache: new Map(),
    lineBlockFillStyleCache: new Map(),
    blockIdCounter: 0,
    blockClipboard: null,
    structureDragBlockId: '',
    structureCollapsedBlockIds: new Set(),
    frameEditorContextMenuState: null,
    STRUCTURE_ROOT_ID: 'frame-editor-canvas-root',
    PREVIEW_QR_TEXT: 'https://qrcode.apps.shaunroselt.com/',
    PREVIEW_QR_OPTIONS: Object.freeze({
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: 'Q',
        margin: 4
    }),
    COMPONENT_LIBRARY: Object.freeze(window.FrameEditorComponentCatalog?.getLibrary?.() || []),
    CONTAINER_ALIGNMENT_OPTIONS: Object.freeze([
        { id: 'left', label: 'Left' },
        { id: 'center', label: 'Center' },
        { id: 'right', label: 'Right' }
    ]),
    PARENT_POSITION_OPTIONS: Object.freeze([
        { id: 'top-left', label: 'Top left' },
        { id: 'top-center', label: 'Top center' },
        { id: 'top-right', label: 'Top right' },
        { id: 'center-left', label: 'Left' },
        { id: 'center', label: 'Center' },
        { id: 'center-right', label: 'Right' },
        { id: 'bottom-left', label: 'Bottom left' },
        { id: 'bottom-center', label: 'Bottom' },
        { id: 'bottom-right', label: 'Bottom right' },
        { id: 'custom', label: 'Custom' }
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
    LINE_BLOCK_STYLE_OPTIONS: Object.freeze([
        { id: 'solid', label: 'Solid', preview: '────────' },
        { id: 'dashed', label: 'Dashed', preview: '┄┄┄┄┄┄┄┄' },
        { id: 'dotted', label: 'Dotted', preview: '········' },
        { id: 'double', label: 'Double', preview: '═══════≡' },
        { id: 'striped', label: 'Striped', preview: '▰▱▰▱▰▱▰▱' },
        { id: 'gradient', label: 'Gradient', preview: '▁▂▃▄▅▆▇█' },
        { id: 'wave', label: 'Wave', preview: '∿∿∿∿∿∿∿∿' },
        { id: 'triangle', label: 'Triangle', preview: '/\\/\\/\\/\\' },
        { id: 'sawtooth', label: 'Sawtooth', preview: '/|/|/|/|' },
        { id: 'square-wave', label: 'Square Wave', preview: '_|-|_|-' },
        { id: 'pulse', label: 'Pulse', preview: '__/\\__/\\' }
    ]),
    LINE_BLOCK_SVG_STYLE_CONFIGS: Object.freeze({
        wave: Object.freeze({ type: 'wave', wavelengthFactor: 4, amplitudeRatio: 0.34, strokeRatio: 0.28 }),
        triangle: Object.freeze({ type: 'triangle', wavelengthFactor: 3.1, amplitudeRatio: 0.38, strokeRatio: 0.25 }),
        sawtooth: Object.freeze({ type: 'sawtooth', wavelengthFactor: 2.8, amplitudeRatio: 0.38, strokeRatio: 0.24 }),
        'square-wave': Object.freeze({ type: 'square', wavelengthFactor: 3.4, amplitudeRatio: 0.38, strokeRatio: 0.22 }),
        pulse: Object.freeze({ type: 'pulse', wavelengthFactor: 3.8, amplitudeRatio: 0.42, strokeRatio: 0.24 })
    }),
    LINE_BLOCK_LEGACY_STYLE_ALIASES: Object.freeze({
        'soft-wave': 'wave',
        'tight-wave': 'triangle',
        'bold-wave': 'triangle',
        ripple: 'pulse'
    }),
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
    TEXT_BLOCK_APPEARANCE_TOGGLE_OPTIONS: Object.freeze([
        { id: 'bold', label: 'Bold' },
        { id: 'italic', label: 'Italic' },
        { id: 'underline', label: 'Underline' },
        { id: 'line-through', label: 'Line-through' }
    ]),
    TEXT_BLOCK_POSITION_X_OPTIONS: Object.freeze([
        { id: 'left', label: 'Left' },
        { id: 'center', label: 'Center' },
        { id: 'right', label: 'Right' }
    ]),
    TEXT_BLOCK_POSITION_Y_OPTIONS: Object.freeze([
        { id: 'top', label: 'Top' },
        { id: 'center', label: 'Center' },
        { id: 'bottom', label: 'Bottom' }
    ]),
    DEFAULT_BLOCK_MEASUREMENT_MAX: 20000,
    MIN_CANVAS_ZOOM: 0.01,
    MAX_CANVAS_ZOOM: 10,

    state: {
        activeTab: 'frames',
        searchTerm: '',
        rightSidebarTab: 'properties',
        rightSidebarSearchTerm: '',
        isLoadJsonDialogOpen: false,
        loadJsonDialogError: '',
        selectedFrameKey: '',
        selectedBlockId: '',
        workspaceView: 'grid',
        leftPanelMode: 'library',
        isSidebarCollapsed: false,
        preferLeftSidebarExpanded: false,
        isRightSidebarCollapsed: false,
        autoCollapseLeftSidebar: false,
        selectedCanvas: false,
        selectedQrBlockId: '',
        selectedTextBlockId: '',
        canvasZoom: 1,
        canvasPanX: 0,
        canvasPanY: 0,
        canvasBackgroundColor: '#2d2d2d',
        canvasGridColor: '#66c0f4',
        canvasGridOpacity: 0.08,
        canvasGridBaseSize: 32,
        // Persisted widths for current session only (not saved to localStorage)
        leftSidebarWidth: 340,
        rightSidebarWidth: 320,
        isLoading: true,
        errorMessage: '',
        canvasBlocks: []
    },

    loadJsonDialogDraftText: '',


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
            : I18n.translateString('Search components');
        const leftSidebarCollapsed = this.isLeftSidebarCollapsed();
        const isStructureMode = (this.state.leftPanelMode || 'library') === 'overview';
        const isSidebarLibraryMode = !isStructureMode;
        const sidebarToggleLabel = !leftSidebarCollapsed && isSidebarLibraryMode
            ? I18n.translateString('Collapse sidebar')
            : I18n.translateString('Expand sidebar');
        const structureToggleLabel = !leftSidebarCollapsed && isStructureMode
            ? I18n.translateString('Collapse Structure')
            : I18n.translateString('Expand Structure');
        const leftPanelAriaLabel = isStructureMode
            ? I18n.translateString('Structure')
            : I18n.translateString('Frame Editor sidebar');
        const rightSidebarToggleLabel = this.state.isRightSidebarCollapsed
            ? I18n.translateString('Expand Component Inspector')
            : I18n.translateString('Collapse Component Inspector');
        const isDeveloperMode = this.isDeveloperMode();

        return `
            <div class="qr-mode-page frame-editor-page">
                <div class="content-header">
                    <h1 class="content-title">${I18n.translateString('Frame Editor')}</h1>
                </div>

                <div class="frame-editor-header-bar">
                    <button
                        type="button"
                        class="frame-editor-sidebar-toggle${!leftSidebarCollapsed && isSidebarLibraryMode ? ' active' : ''}"
                        data-frame-editor-toggle-sidebar
                        aria-expanded="${!leftSidebarCollapsed && isSidebarLibraryMode ? 'true' : 'false'}"
                        aria-controls="frameEditorSidebarPanel"
                        title="${this.escapeHTML(sidebarToggleLabel)}"
                    >
                        <i class="bi ${leftSidebarCollapsed ? 'bi-layout-sidebar-inset-reverse' : 'bi-layout-sidebar-inset'}" aria-hidden="true"></i>
                        <span class="frame-editor-button-label">${I18n.translateString('Sidebar')}</span>
                    </button>
                    <button
                        type="button"
                        class="frame-editor-sidebar-toggle${!leftSidebarCollapsed && isStructureMode ? ' active' : ''}"
                        data-frame-editor-toggle-overview
                        aria-expanded="${!leftSidebarCollapsed && isStructureMode ? 'true' : 'false'}"
                        aria-controls="frameEditorSidebarPanel"
                        title="${this.escapeHTML(structureToggleLabel)}"
                    >
                        <i class="bi bi-list-ul" aria-hidden="true"></i>
                        <span class="frame-editor-button-label">${I18n.translateString('Structure')}</span>
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
                            data-frame-editor-load-json
                            title="${this.escapeHTML(I18n.translateString('Load frame from JSON'))}"
                        >
                            <i class="bi bi-folder2-open" aria-hidden="true"></i>
                            <span class="frame-editor-button-label">${I18n.translateString('Load JSON')}</span>
                        </button>
                        <button
                            type="button"
                            class="frame-editor-sidebar-toggle"
                            data-canvas-action="fit-blocks"
                            title="${this.escapeHTML(I18n.translateString('Fit components in view'))}"
                            aria-label="${this.escapeHTML(I18n.translateString('Fit components in view'))}"
                        >
                            <i class="bi bi-arrows-angle-expand" aria-hidden="true"></i>
                            <span class="frame-editor-button-label">${I18n.translateString('Fit components')}</span>
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
                                        value="${this.escapeHTML(this.formatCanvasZoomPercent())}"
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
                            <span class="frame-editor-button-label">${I18n.translateString('Component Inspector')}</span>
                        </button>
                    </div>
                </div>

                <div class="frame-editor-layout-scroll">
                    <div class="frame-editor-layout${leftSidebarCollapsed ? ' frame-editor-layout-sidebar-collapsed' : ''}${this.state.isRightSidebarCollapsed ? ' frame-editor-layout-right-sidebar-collapsed' : ''}" style="${(leftSidebarCollapsed ? '' : `--left-sidebar-width: ${this.escapeHTML(String(Number(this.state.leftSidebarWidth || 340)))}px;`) + ' ' + (this.state.isRightSidebarCollapsed ? '' : `--right-sidebar-width: ${this.escapeHTML(String(Number(this.state.rightSidebarWidth || 320)))}px;`)}">
                        <aside
                            id="frameEditorSidebarPanel"
                            class="frame-editor-sidebar-panel"
                            aria-label="${leftPanelAriaLabel}"
                            aria-hidden="${leftSidebarCollapsed ? 'true' : 'false'}"
                        >
                            ${isStructureMode
                ? `
                                    <div class="frame-editor-sidebar-body frame-editor-sidebar-body-overview">
                                        ${this.renderStructureSidebar()}
                                    </div>
                                `
                : `
                                    <div class="frame-editor-tabs" role="tablist" aria-label="${I18n.translateString('Frame Editor panels')}">
                                        ${this.renderTabButton('frames', 'Frames', 'bi-collection')}
                                        ${this.renderTabButton('blocks', 'Components', 'bi-grid-3x3-gap')}
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
                                `}
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
                            aria-label="${I18n.translateString('Component Inspector')}"
                            aria-hidden="${this.state.isRightSidebarCollapsed ? 'true' : 'false'}"
                        >
                            ${this.renderRightSidebar(selectedBlock)}
                        </aside>
                    </div>
                </div>
                ${this.renderFrameEditorContextMenu()}
                ${this.renderFrameEditorLoadJsonDialog()}
            </div>
        `;
    },

    renderFrameEditorContextMenu() {
        return `
            <div
                class="frame-editor-context-menu"
                data-frame-editor-context-menu
                hidden
                role="menu"
                aria-label="${this.escapeHTML(I18n.translateString('Frame editor context menu'))}"
            ></div>
        `;
    },

    renderFrameEditorLoadJsonDialog() {
        const isOpen = Boolean(this.state.isLoadJsonDialogOpen);
        const dialogError = String(this.state.loadJsonDialogError || '').trim();
        const draftText = this.escapeHTML(this.loadJsonDialogDraftText || '');

        return `
            <div class="frame-editor-json-load-dialog" data-frame-editor-load-json-dialog ${isOpen ? '' : 'hidden'} aria-hidden="${isOpen ? 'false' : 'true'}">
                <div class="frame-editor-json-load-dialog-backdrop" data-frame-editor-load-json-close="true" aria-hidden="true"></div>
                <div class="frame-editor-json-load-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="frameEditorLoadJsonTitle" aria-describedby="frameEditorLoadJsonDescription">
                    <div class="frame-editor-json-load-dialog-header">
                        <div class="frame-editor-json-load-dialog-copy">
                            <span class="frame-editor-json-load-dialog-kicker">${I18n.translateString('Frame Editor')}</span>
                            <h2 class="frame-editor-json-load-dialog-title" id="frameEditorLoadJsonTitle">${I18n.translateString('Load JSON')}</h2>
                            <p class="frame-editor-json-load-dialog-description" id="frameEditorLoadJsonDescription">${I18n.translateString('Paste a frame JSON export or choose a .json file to restore the frame, canvas settings, and components.')}</p>
                        </div>
                        <button type="button" class="frame-editor-json-load-dialog-close" data-frame-editor-load-json-close="true" aria-label="${this.escapeHTML(I18n.translateString('Close load dialog'))}">
                            <i class="bi bi-x-lg" aria-hidden="true"></i>
                        </button>
                    </div>
                    <form class="frame-editor-json-load-dialog-form" data-frame-editor-load-json-form>
                        <label class="frame-editor-field frame-editor-field-wide frame-editor-json-load-textarea-field">
                            <span>${I18n.translateString('Paste JSON')}</span>
                            <textarea
                                class="frame-editor-json-load-textarea"
                                data-frame-editor-load-json-input
                                rows="16"
                                spellcheck="false"
                                placeholder="${this.escapeHTML(I18n.translateString('Paste the exported frame JSON here.'))}"
                            >${draftText}</textarea>
                        </label>
                        <label class="frame-editor-field frame-editor-field-wide frame-editor-json-load-file-field">
                            <span>${I18n.translateString('Load from file')}</span>
                            <input type="file" accept=".json,application/json,text/json" data-frame-editor-load-json-file>
                        </label>
                        ${dialogError ? `<div class="frame-editor-json-load-error" role="alert">${this.escapeHTML(dialogError)}</div>` : ''}
                        <div class="frame-editor-json-load-actions">
                            <button type="button" class="frame-editor-action-button" data-frame-editor-load-json-close="true">${I18n.translateString('Cancel')}</button>
                            <button type="submit" class="frame-editor-action-button primary">${I18n.translateString('Load JSON')}</button>
                        </div>
                    </form>
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
        const totalBlocks = this.COMPONENT_LIBRARY.length;

        if (!filteredBlocks.length) {
            return `
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString('Components')}</span>
                    <span class="frame-editor-sidebar-count">${I18n.translate('{count} available', { count: String(totalBlocks) })}</span>
                </div>
                <div class="frame-editor-empty-state">
                    <i class="bi bi-search" aria-hidden="true"></i>
                    <div class="frame-editor-empty-title">${I18n.translateString('No matching components')}</div>
                    <p>${I18n.translateString('Try a different keyword or clear the search to see all available components.')}</p>
                </div>
            `;
        }

        return `
            <div class="frame-editor-sidebar-summary">
                <span class="frame-editor-sidebar-title">${I18n.translateString('Components')}</span>
                <span class="frame-editor-sidebar-count">${I18n.translate('{count} available', { count: String(filteredBlocks.length) })}</span>
            </div>
            <div class="frame-editor-library-list" role="list">
                ${filteredBlocks.map(block => this.renderBlockLibraryItem(block)).join('')}
            </div>
        `;
    },

    renderStructureSidebar() {
        const blockEntries = this.getStructureEntries();
        const canvasEntryCount = blockEntries.length + 1;
        const isCanvasCollapsed = this.isStructureBlockCollapsed(this.STRUCTURE_ROOT_ID);
        const visibleBlockEntries = isCanvasCollapsed
            ? []
            : blockEntries.map(entry => ({
                ...entry,
                depth: entry.depth + 1
            }));

        return `
            <div class="frame-editor-sidebar-summary">
                <span class="frame-editor-sidebar-title">${I18n.translateString('Structure')}</span>
                <span class="frame-editor-sidebar-count">${I18n.translate('{count} items', { count: String(canvasEntryCount) })}</span>
            </div>
            <div class="frame-editor-overview-list" role="listbox" aria-label="${this.escapeHTML(I18n.translateString('Structure'))}" data-frame-editor-overview-list>
                ${this.renderStructureCanvasItem(blockEntries.length)}
                ${visibleBlockEntries.map(({ block, depth }, index) => this.renderStructureItem(block, index + 1, depth)).join('')}
                ${blockEntries.length && !isCanvasCollapsed
                ? `
                        <div class="frame-editor-overview-root-dropzone" data-frame-editor-overview-root-drop="end" role="note">
                            ${this.escapeHTML(I18n.translateString('Drop here to move a component back to the canvas'))}
                        </div>
                    `
                : ''}
            </div>
        `;
    },

    getStructureEntries(blocks = this.state.canvasBlocks) {
        const entries = [];
        const visit = (block, depth = 0) => {
            if (!block) {
                return;
            }

            entries.push({ block, depth });
            if (this.isStructureBlockCollapsed(block.id)) {
                return;
            }

            this.getChildBlocks(block.id, blocks).forEach(childBlock => visit(childBlock, depth + 1));
        };

        this.getRootCanvasBlocks(blocks).forEach(rootBlock => visit(rootBlock, 0));
        return entries;
    },

    renderStructureCanvasItem(childCount = 0) {
        const isActive = this.isCanvasSelected();
        // Render the canvas entry with no left-indent so it starts flush-left.
        return `
            <div class="frame-editor-overview-item-shell${isActive ? ' is-active' : ''}" style="--frame-editor-overview-depth: 0; grid-template-columns: 0px minmax(0, 1fr); gap: 0.15rem;">
                <span class="frame-editor-overview-item-toggle-spacer" aria-hidden="true"></span>
                <button
                    type="button"
                    class="frame-editor-overview-item"
                    data-frame-editor-overview-canvas="true"
                    role="option"
                    aria-selected="${isActive ? 'true' : 'false'}"
                    title="${this.escapeHTML(I18n.translateString('Canvas'))}"
                >
                    <span class="frame-editor-overview-item-icon" aria-hidden="true">
                        <i class="bi bi-grid-1x2"></i>
                    </span>
                    <span class="frame-editor-overview-item-title">${this.escapeHTML(I18n.translateString('Canvas'))}</span>
                </button>
            </div>
        `;
    },


    renderStructureItem(block, index, depth = 0) {
        const isActive = this.state.selectedBlockId === block.id;
        const icon = this.getBlockIcon(block.type);
        const label = this.getStructureDisplayLabel(block);
        const hasChildren = this.getChildBlocks(block.id).length > 0;
        const isCollapsed = hasChildren && this.isStructureBlockCollapsed(block.id);
        const itemNumber = index + 1;

        return `
            <div class="frame-editor-overview-item-shell${isActive ? ' is-active' : ''}" style="--frame-editor-overview-depth: ${this.escapeHTML(String(depth))};">
                ${hasChildren
                ? `
                        <button
                            type="button"
                            class="frame-editor-overview-item-toggle"
                            data-frame-editor-overview-toggle="${block.id}"
                            aria-label="${this.escapeHTML(isCollapsed ? I18n.translateString('Expand component children') : I18n.translateString('Collapse component children'))}"
                            aria-expanded="${isCollapsed ? 'false' : 'true'}"
                        >
                            <i class="bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-down'}" aria-hidden="true"></i>
                        </button>
                    `
                : '<span class="frame-editor-overview-item-toggle-spacer" aria-hidden="true"></span>'}
                <button
                    type="button"
                    class="frame-editor-overview-item"
                    data-frame-editor-overview-block="${block.id}"
                    data-frame-editor-overview-nested="${depth > 0 ? 'true' : 'false'}"
                    draggable="true"
                    role="option"
                    aria-selected="${isActive ? 'true' : 'false'}"
                    title="${this.escapeHTML(label)}"
                >
                    <span class="frame-editor-overview-item-icon" aria-hidden="true">
                        <i class="bi ${icon}"></i>
                    </span>
                    <span class="frame-editor-overview-item-title">${this.escapeHTML(label)}</span>
                </button>
            </div>
        `;
    },

    isStructureBlockCollapsed(blockId) {
        return this.structureCollapsedBlockIds.has(blockId);
    },

    toggleStructureBlockCollapsed(blockId) {
        if (!blockId) {
            return;
        }

        if (this.structureCollapsedBlockIds.has(blockId)) {
            this.structureCollapsedBlockIds.delete(blockId);
        } else {
            this.structureCollapsedBlockIds.add(blockId);
        }

        this.renderIntoRoot();
    },

    getStructureDisplayLabel(block) {
        const componentDefinition = this.getComponentDefinition(block);
        if (componentDefinition && !['text', 'line', 'shape', 'columns', 'section', 'image', 'qr'].includes(block?.type)) {
            return this.getStructurePreviewText(block.text, componentDefinition.name || componentDefinition.className);
        }

        if (block?.type === 'text') {
            return this.getStructurePreviewText(block.text, I18n.translateString('TLabel'));
        }

        if (block?.type === 'line') {
            return I18n.translateString('Separator');
        }

        if (block?.type === 'shape') {
            const shapeLabel = this.SHAPE_BLOCK_OPTIONS.find(option => option.id === (block.shapeType || 'rectangle'))?.label || 'Shape';
            return I18n.translateString(shapeLabel);
        }

        if (block?.type === 'columns') {
            return I18n.translateString('Columns');
        }

        if (block?.type === 'section') {
            return I18n.translateString('TPanel');
        }

        if (block?.type === 'image') {
            return block.imageName
                ? this.getStructurePreviewText(block.imageName, I18n.translateString('Image'))
                : I18n.translateString('Image');
        }

        return I18n.translateString(componentDefinition?.name || 'TQRCode');
    },

    getStructureItemSummary(block) {
        const componentDefinition = this.getComponentDefinition(block);
        if (componentDefinition && !['text', 'line', 'shape', 'columns', 'section', 'image', 'qr'].includes(block?.type)) {
            return componentDefinition.unitName || componentDefinition.className || 'Component';
        }

        if (block?.type === 'text') {
            return this.getStructurePreviewText(block.text, I18n.translateString('Empty text'));
        }

        if (block?.type === 'shape') {
            const shapeLabel = this.SHAPE_BLOCK_OPTIONS.find(option => option.id === (block.shapeType || 'rectangle'))?.label || 'Shape';
            return I18n.translateString(shapeLabel);
        }

        if (block?.type === 'section') {
            return I18n.translate('{count} child components', { count: String(this.getChildBlocks(block.id).length) });
        }

        if (block?.type === 'columns') {
            return I18n.translate('{count} columns', { count: String(this.getResolvedColumnsBlockCount(block)) });
        }

        if (block?.type === 'image') {
            return block.src
                ? I18n.translateString('Image uploaded')
                : I18n.translateString('No image selected');
        }

        if (block?.type === 'line') {
            const normalizedStyle = this.getNormalizedLineBlockStyleId(block.lineStyle);
            const lineStyleLabel = this.LINE_BLOCK_STYLE_OPTIONS.find(option => option.id === normalizedStyle)?.label || 'Solid';
            return I18n.translate('{style} line', { style: I18n.translateString(lineStyleLabel) });
        }

        return I18n.translateString('Uses current QR content');
    },

    getStructurePreviewText(value, fallback = '') {
        const normalized = String(value || fallback || '').replace(/\s+/g, ' ').trim();
        if (!normalized) {
            return '';
        }

        return normalized.length > 44
            ? `${normalized.slice(0, 43)}…`
            : normalized;
    },

    getCurrentQrPreviewText(root = document) {
        const qrContainer = root?.querySelector?.('#qrcode');
        const previewState = qrContainer && typeof QRCodePreviewRenderer !== 'undefined'
            ? QRCodePreviewRenderer.getPreviewStateForContainer(qrContainer)
            : null;
        const previewText = String(previewState?.qrText || qrContainer?.title || '').trim();
        return previewText || this.PREVIEW_QR_TEXT;
    },

    getComponentClassName(blockOrType) {
        if (typeof blockOrType === 'string') {
            return window.FrameEditorComponentCatalog?.resolveClassName?.(blockOrType) || blockOrType;
        }
        return blockOrType?.className
            || window.FrameEditorComponentCatalog?.resolveClassName?.(blockOrType?.type)
            || blockOrType?.type
            || '';
    },

    getComponentDefinition(blockOrType) {
        const key = typeof blockOrType === 'string'
            ? blockOrType
            : (blockOrType?.className || blockOrType?.type || '');
        return window.FrameEditorComponentCatalog?.getDefinition?.(key) || null;
    },

    getBlockIcon(blockType) {
        const className = this.getComponentClassName(blockType);
        return this.COMPONENT_LIBRARY.find(component => component.type === blockType || component.className === className)?.icon || 'bi-square';
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
                
            </button>
        `;
    },

    renderRightSidebar(selectedBlock) {
        const isCanvasSelected = this.isCanvasSelected();
        const activeRightSidebarTab = this.state.rightSidebarTab === 'events' ? 'events' : 'properties';
        const sidebarPropertiesContent = isCanvasSelected
            ? this.renderRightSidebarCanvasContent()
            : this.renderRightSidebarBlockContent(selectedBlock);
        const sidebarEventsContent = this.renderRightSidebarEventsContent(selectedBlock);
        const inspectorSubtitle = isCanvasSelected
            ? I18n.translateString('Workspace surface')
            : selectedBlock
                ? I18n.translateString(this.getBlockLabel(selectedBlock))
                : I18n.translateString('No selection');
        const rightSidebarSearchLabel = I18n.translateString('Search properties and events');
        const rightSidebarEmptyTitle = I18n.translateString('No matching items');
        const rightSidebarEmptyCopy = I18n.translateString('Try a broader search term or switch tabs.');

        return `
            <div class="frame-editor-right-sidebar-shell">
                <div class="frame-editor-right-sidebar-topbar">
                    <div class="frame-editor-right-sidebar-selection">
                        <span class="frame-editor-right-sidebar-selection-name">${this.escapeHTML(I18n.translateString('Component Inspector'))}</span>
                        <span class="frame-editor-right-sidebar-selection-kind">${this.escapeHTML(inspectorSubtitle)}</span>
                    </div>
                </div>
                <div class="frame-editor-right-sidebar-search search-field">
                    <i class="bi bi-search search-icon" aria-hidden="true"></i>
                    <input
                        type="search"
                        class="search-input"
                        id="frameEditorRightSidebarSearchInput"
                        value="${this.escapeHTML(this.state.rightSidebarSearchTerm || '')}"
                        placeholder="${this.escapeHTML(rightSidebarSearchLabel)}"
                        aria-label="${this.escapeHTML(rightSidebarSearchLabel)}"
                    >
                </div>
                <div class="frame-editor-right-sidebar-tabs" role="tablist" aria-label="${this.escapeHTML(I18n.translateString('Component Inspector tabs'))}">
                    <button type="button" id="frameEditorRightSidebarTabProperties" class="frame-editor-right-sidebar-tab${activeRightSidebarTab === 'properties' ? ' active' : ''}" data-frame-editor-right-sidebar-tab="properties" role="tab" aria-selected="${activeRightSidebarTab === 'properties' ? 'true' : 'false'}" aria-controls="frameEditorRightSidebarPropertiesPanel" tabindex="${activeRightSidebarTab === 'properties' ? '0' : '-1'}">
                        ${this.escapeHTML(I18n.translateString('Properties'))}
                    </button>
                    <button type="button" id="frameEditorRightSidebarTabEvents" class="frame-editor-right-sidebar-tab${activeRightSidebarTab === 'events' ? ' active' : ''}" data-frame-editor-right-sidebar-tab="events" role="tab" aria-selected="${activeRightSidebarTab === 'events' ? 'true' : 'false'}" aria-controls="frameEditorRightSidebarEventsPanel" tabindex="${activeRightSidebarTab === 'events' ? '0' : '-1'}">
                        ${this.escapeHTML(I18n.translateString('Events'))}
                    </button>
                </div>
                <div class="frame-editor-right-sidebar-body">
                    <div id="frameEditorRightSidebarPropertiesPanel" class="frame-editor-right-sidebar-content${activeRightSidebarTab === 'properties' ? ' active' : ''}" data-frame-editor-right-sidebar-panel="properties" data-frame-editor-right-sidebar-search-state="${isCanvasSelected || selectedBlock ? 'searchable' : 'selection-required'}" role="tabpanel" aria-labelledby="frameEditorRightSidebarTabProperties" ${activeRightSidebarTab === 'properties' ? '' : 'hidden'}>
                        ${sidebarPropertiesContent}
                    </div>
                    <div id="frameEditorRightSidebarEventsPanel" class="frame-editor-right-sidebar-content${activeRightSidebarTab === 'events' ? ' active' : ''}" data-frame-editor-right-sidebar-panel="events" data-frame-editor-right-sidebar-search-state="${isCanvasSelected || selectedBlock ? 'future-empty' : 'selection-required'}" role="tabpanel" aria-labelledby="frameEditorRightSidebarTabEvents" ${activeRightSidebarTab === 'events' ? '' : 'hidden'}>
                        ${sidebarEventsContent}
                    </div>
                    <div class="frame-editor-empty-state frame-editor-empty-state-compact frame-editor-right-sidebar-search-empty" data-frame-editor-right-sidebar-empty="filtered" hidden>
                        <i class="bi bi-search" aria-hidden="true"></i>
                        <div class="frame-editor-empty-title">${this.escapeHTML(rightSidebarEmptyTitle)}</div>
                        <p>${this.escapeHTML(rightSidebarEmptyCopy)}</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderRightSidebarEventsContent(selectedBlock) {
        if (!selectedBlock && !this.isCanvasSelected()) {
            return `
                <div class="frame-editor-empty-state frame-editor-empty-state-compact">
                    <i class="bi bi-lightning-charge" aria-hidden="true"></i>
                    <div class="frame-editor-empty-title">${I18n.translateString('Nothing selected')}</div>
                    <p>${I18n.translateString('Select a component or the canvas to inspect future events here.')}</p>
                </div>
            `;
        }

        return `
            <div class="frame-editor-sidebar-panel-section frame-editor-right-sidebar-events-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString('Events')}</span>
                </div>
                <div class="frame-editor-sidebar-form">
                    <div class="frame-editor-empty-state frame-editor-empty-state-compact frame-editor-right-sidebar-events-empty">
                        <i class="bi bi-lightning-charge" aria-hidden="true"></i>
                        <div class="frame-editor-empty-title">${I18n.translateString('No events yet')}</div>
                        <p>${I18n.translateString('Event triggers for this selection will appear here when they are added.')}</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderRightSidebarBlockContent(selectedBlock) {
        if (!selectedBlock) {
            return `
                <div class="frame-editor-empty-state frame-editor-empty-state-compact">
                    <i class="bi bi-cursor" aria-hidden="true"></i>
                    <div class="frame-editor-empty-title">${I18n.translateString('Nothing selected')}</div>
                    <p>${I18n.translateString('Select a component or the canvas to edit its properties here.')}</p>
                </div>
            `;
        }

        return this.renderObjectInspectorBlockContent(selectedBlock);

        if (selectedBlock.type === 'text') {
            return `
                <div class="frame-editor-sidebar-panel-section">
                    <div class="frame-editor-sidebar-summary">
                        <span class="frame-editor-sidebar-title">${I18n.translateString('TLabel')}</span>
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
                                    ${this.renderTextAppearanceDropdown(selectedBlock)}
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
                                <label class="frame-editor-field">
                                    <span>${I18n.translateString('Text align')}</span>
                                    <select class="frame-editor-select" data-block-setting="textAlignCombined">
                                        <option value="top-left" ${this.getCombinedTextAlignSelected(selectedBlock) === 'top-left' ? 'selected' : ''}>${this.escapeHTML(I18n.translateString('Top left'))}</option>
                                        <option value="top-center" ${this.getCombinedTextAlignSelected(selectedBlock) === 'top-center' ? 'selected' : ''}>${this.escapeHTML(I18n.translateString('Top center'))}</option>
                                        <option value="top-right" ${this.getCombinedTextAlignSelected(selectedBlock) === 'top-right' ? 'selected' : ''}>${this.escapeHTML(I18n.translateString('Top right'))}</option>
                                        <option value="center-left" ${this.getCombinedTextAlignSelected(selectedBlock) === 'center-left' ? 'selected' : ''}>${this.escapeHTML(I18n.translateString('Center left'))}</option>
                                        <option value="center" ${this.getCombinedTextAlignSelected(selectedBlock) === 'center' ? 'selected' : ''}>${this.escapeHTML(I18n.translateString('Center'))}</option>
                                        <option value="center-right" ${this.getCombinedTextAlignSelected(selectedBlock) === 'center-right' ? 'selected' : ''}>${this.escapeHTML(I18n.translateString('Center right'))}</option>
                                        <option value="bottom-left" ${this.getCombinedTextAlignSelected(selectedBlock) === 'bottom-left' ? 'selected' : ''}>${this.escapeHTML(I18n.translateString('Bottom left'))}</option>
                                        <option value="bottom-center" ${this.getCombinedTextAlignSelected(selectedBlock) === 'bottom-center' ? 'selected' : ''}>${this.escapeHTML(I18n.translateString('Bottom center'))}</option>
                                        <option value="bottom-right" ${this.getCombinedTextAlignSelected(selectedBlock) === 'bottom-right' ? 'selected' : ''}>${this.escapeHTML(I18n.translateString('Bottom right'))}</option>
                                        <option value="custom" ${this.getCombinedTextAlignSelected(selectedBlock) === 'custom' ? 'selected' : ''}>${this.escapeHTML(I18n.translateString('Custom'))}</option>
                                    </select>
                                </label>
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
                        ${this.canSelectTextInnerBlock(selectedBlock)
                    ? `
                                <div class="frame-editor-inspector-actions">
                                    <button type="button" class="frame-editor-action-button" data-block-action="${this.isTextInnerSelected(selectedBlock) ? 'deselect-text' : 'select-text'}">
                                        <i class="bi ${this.isTextInnerSelected(selectedBlock) ? 'bi-x-circle' : 'bi-cursor-text'}" aria-hidden="true"></i>
                                        <span>${I18n.translateString(this.isTextInnerSelected(selectedBlock) ? 'Deselect text' : 'Select text')}</span>
                                    </button>
                                </div>
                            `
                    : ''
                }
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

        if (selectedBlock.type === 'line') {
            return this.renderLineBlockInspector(selectedBlock);
        }

        if (selectedBlock.type === 'section') {
            return this.renderSectionBlockInspector(selectedBlock);
        }

        if (selectedBlock.type === 'columns') {
            return this.renderColumnsBlockInspector(selectedBlock);
        }

        return `
            <div class="frame-editor-sidebar-panel-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString('TQRCode')}</span>
                </div>
                <div class="frame-editor-sidebar-form">
                    <div class="form-hint">${this.escapeHTML(I18n.translateString('Uses the current QR content from the generator.'))}</div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Colour')}
                        <div class="frame-editor-text-color-list">
                            ${this.renderTextColorControl('Foreground', 'colorDark', selectedBlock.colorDark || '#111111', false, false, 'bi-brush')}
                            ${this.renderTextColorControl('Background', 'backgroundColorRaw', this.getTextBlockColorInputValue(selectedBlock.backgroundColor), true, this.isTransparentTextBlockBackground(selectedBlock), 'bi-square-fill')}
                        </div>
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('QR Code')}
                        ${this.renderTextMeasurementField('QR size', 'size', selectedBlock.size ?? 180, 80, this.getCanvasMeasurementMax('size'), 4)}
                    </div>
                    ${this.canSelectQrInnerBlock(selectedBlock)
                ? `
                            <div class="frame-editor-inspector-actions">
                                <button type="button" class="frame-editor-action-button" data-block-action="${this.isQrInnerSelected(selectedBlock) ? 'deselect-qr-code' : 'select-qr-code'}">
                                    <i class="bi ${this.isQrInnerSelected(selectedBlock) ? 'bi-x-circle' : 'bi-bullseye'}" aria-hidden="true"></i>
                                    <span>${I18n.translateString(this.isQrInnerSelected(selectedBlock) ? 'Deselect QR code' : 'Select QR code')}</span>
                                </button>
                            </div>
                        `
                : ''
            }
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPaddingControls(selectedBlock, 'Container padding')}
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

    renderObjectInspectorBlockContent(selectedBlock) {
        const blockDefinition = this.getComponentDefinition(selectedBlock);
        const blockTitle = blockDefinition?.name || blockDefinition?.className || this.getBlockLabel(selectedBlock);
        const className = this.getComponentClassName(selectedBlock);
        const unitName = selectedBlock.unitName || blockDefinition?.unitName || '';
        return `
            <div class="frame-editor-sidebar-panel-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${this.escapeHTML(I18n.translateString(blockTitle))}</span>
                    <span class="frame-editor-sidebar-count">${this.escapeHTML(unitName ? `${className} · ${unitName}` : className)}</span>
                </div>
                <div class="frame-editor-sidebar-form frame-editor-object-inspector-form">
                    ${this.renderBlockPropertyGrid(selectedBlock)}
                    ${this.renderBlockSpecialActions(selectedBlock)}
                    ${this.renderBlockActionButtons()}
                </div>
            </div>
        `;
    },

    renderBlockPropertyGrid(block) {
        const properties = this.getSortedBlockProperties(block);
        if (!properties.length) {
            return '';
        }

        return `
            <div class="frame-editor-object-inspector" role="group" aria-label="${this.escapeHTML(I18n.translateString('Object Inspector Properties'))}">
                ${properties.map(property => this.renderBlockPropertyRow(block, property)).join('')}
            </div>
        `;
    },

    getSortedBlockProperties(block) {
        const key = block?.className || block?.type;
        return (window.FrameEditorComponentCatalog?.getProperties?.(key) || [])
            .filter(property => this.isBlockPropertyVisible(block, property))
            .sort((left, right) => {
                const leftLabel = I18n.translateString(left.label || left.setting || '').toLocaleLowerCase();
                const rightLabel = I18n.translateString(right.label || right.setting || '').toLocaleLowerCase();
                return leftLabel.localeCompare(rightLabel);
            });
    },

    isBlockPropertyVisible(block, property) {
        if (!block || !property) {
            return false;
        }
        if (typeof property.visible === 'function') {
            return Boolean(property.visible(block));
        }
        return true;
    },

    renderBlockPropertyRow(block, property) {
        const label = this.escapeHTML(I18n.translateString(property.label || property.setting || ''));
        return `
            <div class="frame-editor-object-inspector-row${property.type === 'textarea' ? ' is-tall' : ''}">
                <span class="frame-editor-object-inspector-name">${label}</span>
                <span class="frame-editor-object-inspector-value">
                    ${this.renderBlockPropertyControl(block, property)}
                </span>
            </div>
        `;
    },

    renderBlockPropertyControl(block, property) {
        const setting = property.setting;
        const value = this.getBlockPropertyValue(block, property);
        const escapedSetting = this.escapeHTML(setting);

        if (property.type === 'select') {
            const options = Array.isArray(property.options) ? property.options : [];
            return `
                <select class="frame-editor-object-inspector-input frame-editor-select" data-block-setting="${escapedSetting}">
                    ${options.map(option => `
                        <option value="${this.escapeHTML(String(option.id))}" ${String(value) === String(option.id) ? 'selected' : ''}>${this.escapeHTML(I18n.translateString(option.label || option.id))}</option>
                    `).join('')}
                </select>
            `;
        }

        if (property.type === 'checkbox') {
            return `<input class="frame-editor-object-inspector-checkbox" type="checkbox" data-block-setting="${escapedSetting}" ${value ? 'checked' : ''}>`;
        }

        if (property.type === 'textarea') {
            return `<textarea class="frame-editor-object-inspector-input" rows="3" data-block-setting="${escapedSetting}">${this.escapeHTML(String(value ?? ''))}</textarea>`;
        }

        if (property.type === 'color') {
            const colorValue = this.getTextBlockColorInputValue(value, property.fallback || this.getTextBlockDefaultColor());
            return `<input class="frame-editor-object-inspector-input" type="color" value="${this.escapeHTML(colorValue)}" data-block-setting="${escapedSetting}">`;
        }

        if (property.type === 'imageUpload') {
            return `
                <label class="frame-editor-object-inspector-upload frame-editor-action-button">
                    <i class="bi bi-upload" aria-hidden="true"></i>
                    <span>${this.escapeHTML(I18n.translateString(block.src ? 'Replace image' : 'Upload image'))}</span>
                    <input class="frame-editor-visually-hidden" type="file" accept="image/*" data-block-image-upload>
                </label>
            `;
        }

        if (property.type === 'readonly') {
            const readonlyValue = String(value || I18n.translateString('None'));
            return `<input class="frame-editor-object-inspector-input" type="text" value="${this.escapeHTML(readonlyValue)}" readonly>`;
        }

        if (property.type === 'number') {
            const numericValue = Number.isFinite(Number(value)) ? Number(value) : 0;
            const min = Number.isFinite(Number(property.min)) ? Number(property.min) : '';
            const max = Number.isFinite(Number(property.max)) ? Math.max(Number(property.max), numericValue) : '';
            const step = Number.isFinite(Number(property.step)) ? Number(property.step) : 1;
            return `
                <span class="frame-editor-object-inspector-number">
                    <input class="frame-editor-object-inspector-input" type="number" ${min !== '' ? `min="${min}"` : ''} ${max !== '' ? `max="${max}"` : ''} step="${step}" value="${this.escapeHTML(String(numericValue))}" data-block-setting="${escapedSetting}">
                    ${property.unit ? `<span>${this.escapeHTML(property.unit)}</span>` : ''}
                </span>
            `;
        }

        return `<input class="frame-editor-object-inspector-input" type="text" value="${this.escapeHTML(String(value ?? ''))}" data-block-setting="${escapedSetting}">`;
    },

    getBlockPropertyValue(block, property) {
        if (!block || !property) {
            return '';
        }
        if (typeof property.value === 'function') {
            return property.value(block);
        }
        if (property.setting === 'align') {
            return window.FrameEditorComponentCatalog?.normalizeAlign?.(block.align) || 'none';
        }
        if (['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].includes(property.setting)) {
            return Math.max(0, Number(block[property.setting]) || 0);
        }
        const key = property.valueKey || property.setting;
        return block[key];
    },

    renderBlockSpecialActions(block) {
        if (this.canSelectTextInnerBlock(block) || this.canSelectQrInnerBlock(block)) {
            const textAction = this.canSelectTextInnerBlock(block)
                ? `
                    <button type="button" class="frame-editor-action-button" data-block-action="${this.isTextInnerSelected(block) ? 'deselect-text' : 'select-text'}">
                        <i class="bi ${this.isTextInnerSelected(block) ? 'bi-x-circle' : 'bi-cursor-text'}" aria-hidden="true"></i>
                        <span>${I18n.translateString(this.isTextInnerSelected(block) ? 'Deselect text' : 'Select text')}</span>
                    </button>
                `
                : '';
            const qrAction = this.canSelectQrInnerBlock(block)
                ? `
                    <button type="button" class="frame-editor-action-button" data-block-action="${this.isQrInnerSelected(block) ? 'deselect-qr-code' : 'select-qr-code'}">
                        <i class="bi ${this.isQrInnerSelected(block) ? 'bi-x-circle' : 'bi-bullseye'}" aria-hidden="true"></i>
                        <span>${I18n.translateString(this.isQrInnerSelected(block) ? 'Deselect QR code' : 'Select QR code')}</span>
                    </button>
                `
                : '';

            return `<div class="frame-editor-inspector-actions">${textAction}${qrAction}</div>`;
        }

        return '';
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
        const title = this.getComponentDefinition(selectedBlock)?.name || 'TRectangle';
        const selectedShapeType = selectedBlock.shapeType || 'rectangle';
        return `
            <div class="frame-editor-sidebar-panel-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString(title)}</span>
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
                        ${this.renderTextMeasurementField('Width', 'width', selectedBlock.width ?? 160, 48, this.getCanvasMeasurementMax('width'), 4)}
                        ${this.renderTextMeasurementField('Height', 'height', selectedBlock.height ?? 160, 48, this.getCanvasMeasurementMax('height'), 4)}
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
        const title = this.getComponentDefinition(selectedBlock)?.name || 'TImage';
        const hasImage = Boolean(selectedBlock.src);
        const fileLabel = selectedBlock.imageName || I18n.translateString('No image selected');
        const uploadLabel = hasImage ? 'Replace image' : 'Upload image';

        return `
            <div class="frame-editor-sidebar-panel-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString(title)}</span>
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
                        ${this.renderTextMeasurementField('Width', 'width', selectedBlock.width ?? 180, 48, this.getCanvasMeasurementMax('width'), 4)}
                        ${this.renderTextMeasurementField('Height', 'height', selectedBlock.height ?? 180, 48, this.getCanvasMeasurementMax('height'), 4)}
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

    renderLineBlockInspector(selectedBlock) {
        const title = this.getComponentDefinition(selectedBlock)?.name || 'TLine';
        const selectedLineStyle = this.getNormalizedLineBlockStyleId(selectedBlock.lineStyle || 'solid');

        return `
            <div class="frame-editor-sidebar-panel-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString(title)}</span>
                </div>
                <div class="frame-editor-sidebar-form">
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Appearance')}
                        <div class="frame-editor-text-color-list">
                        ${this.renderTextColorControl('Fill', 'color', selectedBlock.color || this.getTextBlockDefaultColor())}
                        </div>
                        <label class="frame-editor-field frame-editor-field-wide">
                            <span>${I18n.translateString('Style')}</span>
                            ${this.renderLineStylePicker(selectedLineStyle)}
                        </label>
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Dimensions')}
                        ${this.renderTextMeasurementField('Length', 'width', selectedBlock.width ?? 180, 24, this.getCanvasMeasurementMax('width'), 4)}
                        ${this.renderTextMeasurementField('Thickness', 'height', selectedBlock.height ?? 8, 2, this.getCanvasMeasurementMax('height'), 1)}
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderTextPropertyGroupHeading('Border')}
                        <label class="frame-editor-field frame-editor-field-wide">
                            <span>${I18n.translateString('Border color')}</span>
                            <input type="color" value="${this.escapeHTML(this.getTextBlockColorInputValue(selectedBlock.borderColor, this.getTextBlockDefaultColor()))}" data-block-setting="borderColor">
                        </label>
                        ${this.renderTextMeasurementField('Border width', 'borderWidth', selectedBlock.borderWidth ?? 0, 0, 20, 1)}
                        ${this.renderTextMeasurementField('Radius', 'borderRadius', selectedBlock.borderRadius ?? 999, 0, 999, 1)}
                    </div>
                    <div class="frame-editor-text-property-group">
                        ${this.renderBlockTransformControls(selectedBlock)}
                    </div>
                    ${this.renderBlockActionButtons()}
                </div>
            </div>
        `;
    },

    renderSectionBlockInspector(selectedBlock) {
        return `
            <div class="frame-editor-sidebar-panel-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString('TPanel')}</span>
                </div>
                <div class="frame-editor-sidebar-form">
                    ${this.renderContainerBlockInspectorGroups(selectedBlock)}
                    ${this.renderBlockActionButtons()}
                </div>
            </div>
        `;
    },

    renderColumnsBlockInspector(selectedBlock) {
        const title = this.getComponentDefinition(selectedBlock)?.name || 'TGridPanelLayout';
        return `
            <div class="frame-editor-sidebar-panel-section">
                <div class="frame-editor-sidebar-summary">
                    <span class="frame-editor-sidebar-title">${I18n.translateString(title)}</span>
                </div>
                <div class="frame-editor-sidebar-form">
                    ${this.renderContainerBlockInspectorGroups(selectedBlock, `
                        <div class="frame-editor-text-property-group">
                            ${this.renderTextPropertyGroupHeading('Columns')}
                            ${this.renderTextMeasurementField('Column count', 'columnCount', selectedBlock.columnCount ?? 2, 2, 6, 1)}
                            ${this.renderTextMeasurementField('Column gap', 'columnGap', selectedBlock.columnGap ?? 24, 0, 120, 1)}
                        </div>
                    `)}
                    ${this.renderBlockActionButtons()}
                </div>
            </div>
        `;
    },

    renderContainerBlockInspectorGroups(selectedBlock, extraMarkup = '') {
        return `
            <div class="frame-editor-text-property-group">
                ${this.renderTextPropertyGroupHeading('Appearance')}
                <div class="frame-editor-text-color-list">
                    ${this.renderTextColorControl('Background', 'backgroundColorRaw', this.getTextBlockColorInputValue(selectedBlock.backgroundColor), true, this.isTransparentTextBlockBackground(selectedBlock))}
                </div>
            </div>
            <div class="frame-editor-text-property-group">
                ${this.renderTextPropertyGroupHeading('Dimensions')}
                ${this.renderTextMeasurementField('Width', 'width', selectedBlock.width ?? (selectedBlock.type === 'columns' ? 420 : 320), 220, this.getCanvasMeasurementMax('width'), 4)}
                ${this.renderTextMeasurementField('Height', 'height', selectedBlock.height ?? (selectedBlock.type === 'columns' ? 240 : 220), 160, this.getCanvasMeasurementMax('height'), 4)}
            </div>
            <div class="frame-editor-text-property-group">
                ${this.renderTextPropertyGroupHeading('Children')}
                <label class="frame-editor-field frame-editor-field-wide">
                    <span>${I18n.translateString('Horizontal alignment')}</span>
                    <div class="frame-editor-inline-options">
                        ${this.CONTAINER_ALIGNMENT_OPTIONS.map(option => this.renderTextOptionButton(
            'childAlignment',
            option.id,
            option.label.charAt(0),
            (selectedBlock.childAlignment || 'left') === option.id
        )).join('')}
                    </div>
                </label>
                ${this.renderTextMeasurementField('Child gap', 'childGap', selectedBlock.childGap ?? 12, 4, 80, 1)}
            </div>
            <div class="frame-editor-text-property-group">
                ${this.renderTextPaddingControls(selectedBlock, 'Container padding')}
            </div>
            <div class="frame-editor-text-property-group">
                ${this.renderTextPropertyGroupHeading('Border')}
                <label class="frame-editor-field frame-editor-field-wide">
                    <span>${I18n.translateString('Border color')}</span>
                    <input type="color" value="${this.escapeHTML(this.getTextBlockColorInputValue(selectedBlock.borderColor, this.getTextBlockDefaultColor()))}" data-block-setting="borderColor">
                </label>
                ${this.renderTextMeasurementField('Border width', 'borderWidth', selectedBlock.borderWidth ?? 0, 0, 20, 1)}
                ${this.renderTextMeasurementField('Radius', 'borderRadius', selectedBlock.borderRadius ?? 18, 0, 120, 1)}
            </div>
            ${extraMarkup}
            <div class="frame-editor-text-property-group">
                ${this.renderBlockTransformControls(selectedBlock)}
            </div>
        `;
    },

    renderLineStylePicker(selectedLineStyle) {
        const selectedOption = this.LINE_BLOCK_STYLE_OPTIONS.find(option => option.id === selectedLineStyle) || this.LINE_BLOCK_STYLE_OPTIONS[0];
        const selectedLabel = I18n.translateString(selectedOption?.label || '');

        return `
            <details class="frame-editor-line-style-picker" data-line-style-picker>
                <summary class="frame-editor-line-style-picker-summary">
                    <span
                        class="frame-editor-line-style-picker-preview"
                        style="${this.escapeHTML(this.getLineStylePickerPreviewStyle(selectedOption.id))}"
                        aria-hidden="true"
                    ></span>
                    <span class="frame-editor-line-style-picker-label">${this.escapeHTML(selectedLabel)}</span>
                    <i class="bi bi-chevron-down" aria-hidden="true"></i>
                </summary>
                <div class="frame-editor-line-style-picker-menu" role="listbox" aria-label="${this.escapeHTML(I18n.translateString('Line style'))}">
                    ${this.LINE_BLOCK_STYLE_OPTIONS.map(option => {
            const isSelected = option.id === selectedLineStyle;
            return `
                            <button
                                type="button"
                                class="frame-editor-line-style-picker-option${isSelected ? ' active' : ''}"
                                data-line-style-option="${this.escapeHTML(option.id)}"
                                role="option"
                                aria-selected="${isSelected ? 'true' : 'false'}"
                            >
                                <span
                                    class="frame-editor-line-style-picker-option-preview"
                                    style="${this.escapeHTML(this.getLineStylePickerPreviewStyle(option.id))}"
                                    aria-hidden="true"
                                ></span>
                                <span class="frame-editor-line-style-picker-option-label">${this.escapeHTML(I18n.translateString(option.label))}</span>
                                ${isSelected ? '<i class="bi bi-check2 frame-editor-line-style-picker-option-status" aria-hidden="true"></i>' : ''}
                            </button>
                        `;
        }).join('')}
                </div>
            </details>
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

    getLineStylePickerPreviewStyle(lineStyle) {
        return [
            this.getLineBlockFillStyle({
                type: 'line',
                color: '#66c0f4',
                lineStyle: lineStyle || 'solid'
            }, {
                width: 112,
                height: 24
            })
        ].join('; ');
    },

    getNormalizedLineBlockStyleId(lineStyle) {
        const candidateStyle = this.LINE_BLOCK_LEGACY_STYLE_ALIASES[lineStyle] || lineStyle || 'solid';
        return this.LINE_BLOCK_STYLE_OPTIONS.some(option => option.id === candidateStyle)
            ? candidateStyle
            : 'solid';
    },

    getLineBlockFillInlineStyle(block, layout, innerInset = 0, borderRadius = 0) {
        return [
            `inset: ${innerInset}px`,
            `border-radius: ${Math.max(0, borderRadius - innerInset)}px`,
            this.getLineBlockFillStyle(block, {
                width: Math.max(0, (Number(layout?.width) || 0) - (innerInset * 2)),
                height: Math.max(0, (Number(layout?.height) || 0) - (innerInset * 2))
            })
        ].join('; ');
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

    renderTextColorControl(label, setting, value, supportsTransparent = false, isTransparent = false, icon = '') {
        const normalizedValue = this.escapeHTML(value || '#000000');
        // Show icon OR color chip. If transparent, prefer the chip so the "is-transparent" state is visible.
        const iconHtml = icon && !isTransparent ? `<i class="bi ${this.escapeHTML(icon)}" aria-hidden="true" style="margin-right:0.5rem; font-size:0.95rem; opacity:0.95; color: ${normalizedValue};"></i>` : '';
        const chipHtml = `<span class="frame-editor-color-chip${isTransparent ? ' is-transparent' : ''}" style="${isTransparent ? '' : `background-color: ${normalizedValue};`}"></span>`;
        return `
            <label class="frame-editor-text-color-row">
                <span class="frame-editor-text-color-label">
                    ${iconHtml}
                    ${chipHtml}
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
        const normalizedMax = Math.max(normalizedValue, max);
        return `
            <label class="frame-editor-field frame-editor-field-wide">
                <span>${this.escapeHTML(I18n.translateString(label))}</span>
                <div class="frame-editor-measurement-field">
                    <div class="frame-editor-unit-input">
                        <input type="number" min="${min}" max="${normalizedMax}" step="${step}" value="${this.escapeHTML(String(normalizedValue))}" data-block-setting="${setting}">
                        <span>px</span>
                    </div>
                    <input type="range" min="${min}" max="${normalizedMax}" step="${step}" value="${this.escapeHTML(String(normalizedValue))}" data-block-setting="${setting}">
                </div>
            </label>
        `;
    },

    renderBlockTransformControls(block) {
        return `
            ${this.renderTextPropertyGroupHeading('Transform')}
            ${this.canUseParentPositionControl(block)
                ? `
                    <label class="frame-editor-field frame-editor-field-wide">
                        <span>${this.escapeHTML(I18n.translateString('Position in parent'))}</span>
                        <select class="frame-editor-select" data-block-setting="parentPositionCombined">
                            ${this.PARENT_POSITION_OPTIONS.map(option => `
                                <option value="${this.escapeHTML(option.id)}" ${this.getCombinedParentPositionSelected(block) === option.id ? 'selected' : ''}>${this.escapeHTML(I18n.translateString(option.label))}</option>
                            `).join('')}
                        </select>
                    </label>
                `
                : ''}
            ${this.renderTextMeasurementField('Rotation', 'rotation', block.rotation ?? 0, -180, 180, 1)}
        `;
    },

    getCanvasMeasurementMax(setting = 'size', root = this.getRoot()) {
        const metrics = this.getCanvasLayoutMetrics(root);
        const minimumZoom = Math.max(this.MIN_CANVAS_ZOOM, 0.001);
        if (!metrics) {
            return this.DEFAULT_BLOCK_MEASUREMENT_MAX;
        }

        if (setting === 'width') {
            return Math.max(48, Math.ceil(Math.max(this.DEFAULT_BLOCK_MEASUREMENT_MAX, metrics.viewportWidth / minimumZoom)));
        }
        if (setting === 'height') {
            return Math.max(48, Math.ceil(Math.max(this.DEFAULT_BLOCK_MEASUREMENT_MAX, metrics.viewportHeight / minimumZoom)));
        }

        return Math.max(80, Math.ceil(Math.max(
            this.DEFAULT_BLOCK_MEASUREMENT_MAX,
            Math.min(metrics.viewportWidth, metrics.viewportHeight) / minimumZoom
        )));
    },

    getTextBlockPaddingLimits(root, block, padding = this.getTextBlockPadding(block)) {
        const currentPadding = this.getTextBlockPadding(block);
        const currentLayout = this.getCanvasBlockLayout(block);
        const borderWidth = Math.max(0, Number(currentLayout?.borderWidth) || 0);
        const currentHorizontalTotal = currentPadding.left + currentPadding.right;
        const currentVerticalTotal = currentPadding.top + currentPadding.bottom;
        const contentWidth = Math.max(0, currentLayout.width - currentPadding.left - currentPadding.right - (borderWidth * 2));
        const contentHeight = Math.max(0, currentLayout.height - currentPadding.top - currentPadding.bottom - (borderWidth * 2));
        const maxHorizontalTotal = Math.max(
            currentHorizontalTotal + this.DEFAULT_BLOCK_MEASUREMENT_MAX,
            this.getCanvasMeasurementMax('width', root) - contentWidth - (borderWidth * 2)
        );
        const maxVerticalTotal = Math.max(
            currentVerticalTotal + this.DEFAULT_BLOCK_MEASUREMENT_MAX,
            this.getCanvasMeasurementMax('height', root) - contentHeight - (borderWidth * 2)
        );

        return {
            left: Math.max(0, maxHorizontalTotal - padding.right),
            right: Math.max(0, maxHorizontalTotal - padding.left),
            top: Math.max(0, maxVerticalTotal - padding.bottom),
            bottom: Math.max(0, maxVerticalTotal - padding.top),
            paddingX: Math.max(0, Math.floor(maxHorizontalTotal / 2)),
            paddingY: Math.max(0, Math.floor(maxVerticalTotal / 2))
        };
    },

    renderTextPaddingControls(block, label = 'Padding') {
        const padding = this.getTextBlockPadding(block);
        const paddingLimits = this.getTextBlockPaddingLimits(this.getRoot(), block, padding);
        const isLinked = block?.paddingLinked !== false;
        const nextLinkedValue = isLinked ? 'false' : 'true';
        const linkLabel = isLinked ? 'Unlink sides' : 'Link sides';
        const linkedPaddingX = Math.max(padding.left, padding.right);
        const linkedPaddingY = Math.max(padding.top, padding.bottom);

        return `
            ${this.renderTextPropertyGroupHeading(label, `
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
                        ${this.renderTextPaddingField('Horizontal', 'paddingX', linkedPaddingX, 'bi-arrow-left-right', paddingLimits.paddingX)}
                        ${this.renderTextPaddingField('Vertical', 'paddingY', linkedPaddingY, 'bi-arrow-down-up', paddingLimits.paddingY)}
                    `
                : `
                        ${this.renderTextPaddingField('Top', 'paddingTop', padding.top, 'bi-arrow-up', paddingLimits.top)}
                        ${this.renderTextPaddingField('Right', 'paddingRight', padding.right, 'bi-arrow-right', paddingLimits.right)}
                        ${this.renderTextPaddingField('Bottom', 'paddingBottom', padding.bottom, 'bi-arrow-down', paddingLimits.bottom)}
                        ${this.renderTextPaddingField('Left', 'paddingLeft', padding.left, 'bi-arrow-left', paddingLimits.left)}
                    `}
            </div>
        `;
    },

    renderTextPaddingField(label, setting, value, icon, maxValue = this.DEFAULT_BLOCK_MEASUREMENT_MAX) {
        const normalizedValue = Number.isFinite(Number(value)) ? Number(value) : 0;
        const normalizedMax = Math.max(normalizedValue, Math.ceil(Number.isFinite(Number(maxValue)) ? Number(maxValue) : this.DEFAULT_BLOCK_MEASUREMENT_MAX));
        return `
            <label class="frame-editor-field frame-editor-field-wide frame-editor-padding-field">
                <span class="frame-editor-padding-field-label">
                    <i class="bi ${icon}" aria-hidden="true"></i>
                    <span>${this.escapeHTML(I18n.translateString(label))}</span>
                </span>
                <div class="frame-editor-measurement-field">
                    <div class="frame-editor-unit-input">
                        <input type="number" min="0" max="${normalizedMax}" step="1" value="${this.escapeHTML(String(normalizedValue))}" data-block-setting="${setting}">
                        <span>px</span>
                    </div>
                    <input type="range" min="0" max="${normalizedMax}" step="1" value="${this.escapeHTML(String(normalizedValue))}" data-block-setting="${setting}">
                </div>
            </label>
        `;
    },

    renderTextAppearanceDropdown(block) {
        const selectedTokens = this.getTextBlockAppearanceTokens(block);
        const summaryLabel = this.getTextBlockAppearanceLabel(selectedTokens.join('+'));
        return `
            <details class="frame-editor-dropdown frame-editor-appearance-dropdown">
                <summary
                    class="frame-editor-dropdown-summary"
                    aria-label="${this.escapeHTML(I18n.translateString('Appearance'))}"
                >
                    <span class="frame-editor-dropdown-value" data-frame-editor-appearance-label>${this.escapeHTML(summaryLabel)}</span>
                    <i class="bi bi-caret-down-fill" aria-hidden="true"></i>
                </summary>
                <div class="frame-editor-dropdown-menu">
                    ${this.TEXT_BLOCK_APPEARANCE_TOGGLE_OPTIONS.map(option => `
                        <label class="frame-editor-checkbox-row">
                            <input
                                type="checkbox"
                                data-block-setting="appearanceOption"
                                data-block-value="${option.id}"
                                ${selectedTokens.includes(option.id) ? 'checked' : ''}
                            >
                            <span>${this.escapeHTML(I18n.translateString(option.label))}</span>
                        </label>
                    `).join('')}
                </div>
            </details>
        `;
    },

    getTextBlockAppearanceTokens(block) {
        const tokens = [];
        if (Number(block?.fontWeight) >= 700) {
            tokens.push('bold');
        }
        if (String(block?.fontStyle || '').trim().toLowerCase() === 'italic') {
            tokens.push('italic');
        }

        const decorations = String(block?.textDecoration || 'none').split(/\s+/).filter(Boolean);
        if (decorations.includes('underline')) {
            tokens.push('underline');
        }
        if (decorations.includes('line-through')) {
            tokens.push('line-through');
        }

        return tokens;
    },

    getTextBlockAppearance(block) {
        const fontWeight = Number(block?.fontWeight) >= 700 ? 700 : 400;
        const fontStyle = block?.fontStyle === 'italic' ? 'italic' : 'normal';
        const match = this.TEXT_BLOCK_APPEARANCE_OPTIONS.find(option => option.fontWeight !== undefined && option.fontWeight === fontWeight && option.fontStyle === fontStyle);
        return match?.id || 'default';
    },

    getTextBlockAppearancePatch(appearanceId) {
        const appearance = this.TEXT_BLOCK_APPEARANCE_OPTIONS.find(option => option.id === appearanceId) || this.TEXT_BLOCK_APPEARANCE_OPTIONS[0];
        const patch = {};
        if (appearance.fontWeight !== undefined) {
            patch.fontWeight = appearance.fontWeight;
        }
        if (appearance.fontStyle !== undefined) {
            patch.fontStyle = appearance.fontStyle;
        }
        return patch;
    },

    getTextBlockAppearancePatchFromTokens(tokens = []) {
        const normalizedTokens = Array.isArray(tokens)
            ? tokens.map(token => String(token).trim().toLowerCase()).filter(Boolean)
            : [];
        const decorations = [];
        if (normalizedTokens.includes('underline')) {
            decorations.push('underline');
        }
        if (normalizedTokens.includes('line-through')) {
            decorations.push('line-through');
        }

        return {
            fontWeight: normalizedTokens.includes('bold') ? 700 : 400,
            fontStyle: normalizedTokens.includes('italic') ? 'italic' : 'normal',
            textDecoration: decorations.length ? decorations.join(' ') : 'none'
        };
    },

    getTextBlockAppearanceLabel(appearanceId) {
        if (!appearanceId) {
            return I18n.translateString('Default');
        }
        const tokens = String(appearanceId).split('+').map(t => t.trim()).filter(Boolean);
        const labels = tokens.map(token => {
            const option = this.TEXT_BLOCK_APPEARANCE_TOGGLE_OPTIONS.find(o => o.id === token)
                || this.TEXT_BLOCK_APPEARANCE_OPTIONS.find(o => o.id === token);
            if (option) {
                return I18n.translateString(option.label);
            }
            return String(token).split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        });
        return labels.join(' + ');
    },

    getTextBlockAxisPositionValue(startPadding, endPadding, startValue, centerValue, endValue) {
        const start = Math.max(0, Number(startPadding) || 0);
        const end = Math.max(0, Number(endPadding) || 0);
        const total = start + end;
        const snapTolerance = 1;
        if (total <= snapTolerance) {
            return startValue;
        }

        if (start <= snapTolerance && end >= total - snapTolerance) {
            return startValue;
        }

        if (end <= snapTolerance && start >= total - snapTolerance) {
            return endValue;
        }

        if (Math.abs(start - end) <= snapTolerance) {
            return centerValue;
        }

        return 'custom';
    },

    getTextBlockPositionPatchFromPadding(padding) {
        return {
            textPositionX: this.getTextBlockAxisPositionValue(padding?.left, padding?.right, 'left', 'center', 'right'),
            textPositionY: this.getTextBlockAxisPositionValue(padding?.top, padding?.bottom, 'top', 'center', 'bottom')
        };
    },

    getTextBlockPositionX(block) {
        const explicitValue = String(block?.textPositionX || '').trim().toLowerCase();
        if (explicitValue === 'left' || explicitValue === 'center' || explicitValue === 'right' || explicitValue === 'custom') {
            return explicitValue;
        }

        return this.getTextBlockPositionPatchFromPadding(this.getTextBlockPadding(block)).textPositionX;
    },

    getTextBlockPositionY(block) {
        const explicitValue = String(block?.textPositionY || '').trim().toLowerCase();
        if (explicitValue === 'top' || explicitValue === 'center' || explicitValue === 'bottom' || explicitValue === 'custom') {
            return explicitValue;
        }

        return this.getTextBlockPositionPatchFromPadding(this.getTextBlockPadding(block)).textPositionY;
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

    buildBlockPaddingPatch(block, padding) {
        const paddingPatch = this.buildTextBlockPaddingPatch(padding);
        if (block?.type !== 'text') {
            return paddingPatch;
        }

        return {
            ...paddingPatch,
            ...this.getTextBlockPositionPatchFromPadding(padding)
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

    getMirroredTextBlockPaddingPatch(block, setting, value, root = this.getRoot()) {
        const side = this.getTextBlockPaddingSideFromSetting(setting);
        const padding = this.getTextBlockPadding(block);
        const paddingLimits = this.getTextBlockPaddingLimits(root, block, padding);

        if (setting === 'paddingX') {
            const normalizedValue = this.clamp(Number(value) || 0, 0, paddingLimits.paddingX);
            padding.left = normalizedValue;
            padding.right = normalizedValue;
            return this.buildBlockPaddingPatch(block, padding);
        }

        if (setting === 'paddingY') {
            const normalizedValue = this.clamp(Number(value) || 0, 0, paddingLimits.paddingY);
            padding.top = normalizedValue;
            padding.bottom = normalizedValue;
            return this.buildBlockPaddingPatch(block, padding);
        }

        if (!side) {
            return null;
        }

        if (block?.paddingLinked === false) {
            const normalizedValue = this.clamp(Number(value) || 0, 0, paddingLimits[side]);
            padding[side] = normalizedValue;
            return this.buildBlockPaddingPatch(block, padding);
        }

        const normalizedValue = this.clamp(
            Number(value) || 0,
            0,
            (side === 'left' || side === 'right') ? paddingLimits.paddingX : paddingLimits.paddingY
        );
        if (side === 'left' || side === 'right') {
            padding.left = normalizedValue;
            padding.right = normalizedValue;
        } else {
            padding.top = normalizedValue;
            padding.bottom = normalizedValue;
        }

        return this.buildBlockPaddingPatch(block, padding);
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
            ...this.buildBlockPaddingPatch(block, {
                top: Math.max(padding.top, padding.bottom),
                right: Math.max(padding.left, padding.right),
                bottom: Math.max(padding.top, padding.bottom),
                left: Math.max(padding.left, padding.right)
            })
        };
    },

    getTextBlockInnerAlignmentPatch(block, setting, value) {
        if (block?.type !== 'text') {
            return {};
        }

        const padding = this.getTextBlockPadding(block);
        if (setting === 'textPositionX') {
            const totalHorizontalPadding = padding.left + padding.right;
            if (value === 'right') {
                padding.left = totalHorizontalPadding;
                padding.right = 0;
            } else if (value === 'center') {
                padding.left = Number((totalHorizontalPadding / 2).toFixed(2));
                padding.right = Math.max(0, Number((totalHorizontalPadding - padding.left).toFixed(2)));
            } else {
                padding.left = 0;
                padding.right = totalHorizontalPadding;
            }
        } else if (setting === 'textPositionY') {
            const totalVerticalPadding = padding.top + padding.bottom;
            if (value === 'bottom') {
                padding.top = totalVerticalPadding;
                padding.bottom = 0;
            } else if (value === 'center') {
                padding.top = Number((totalVerticalPadding / 2).toFixed(2));
                padding.bottom = Math.max(0, Number((totalVerticalPadding - padding.top).toFixed(2)));
            } else {
                padding.top = 0;
                padding.bottom = totalVerticalPadding;
            }
        }

        return {
            paddingLinked: false,
            ...this.buildBlockPaddingPatch(block, padding)
        };
    },

    getBlockMargins(block) {
        return {
            top: Math.max(0, Number(block?.marginTop) || 0),
            right: Math.max(0, Number(block?.marginRight) || 0),
            bottom: Math.max(0, Number(block?.marginBottom) || 0),
            left: Math.max(0, Number(block?.marginLeft) || 0)
        };
    },

    hasLayoutAlign(block) {
        const align = window.FrameEditorComponentCatalog?.normalizeAlign?.(block?.align) || 'none';
        return align !== 'none';
    },

    getBlockParentAlignFrame(block, root = this.getRoot()) {
        const parentBlock = this.getParentBlock(block);
        if (parentBlock) {
            return this.getContainerBlockInnerFrame(parentBlock, this.getCanvasBlockLayout(parentBlock));
        }

        const metrics = this.getCanvasLayoutMetrics(root);
        if (!metrics) {
            return null;
        }

        return {
            left: 0,
            top: 0,
            width: metrics.viewportWidth,
            height: metrics.viewportHeight
        };
    },

    getBlockAlignPatch(block, alignValue, root = this.getRoot()) {
        const align = window.FrameEditorComponentCatalog?.normalizeAlign?.(alignValue) || 'none';
        const patch = { align };
        if (!block || align === 'none') {
            return patch;
        }

        const frame = this.getBlockParentAlignFrame(block, root);
        if (!frame || frame.width <= 0 || frame.height <= 0) {
            return patch;
        }

        const layout = this.getCanvasBlockLayout(block);
        const margins = this.getBlockMargins(block);
        const currentCenter = block.parentId
            ? {
                x: frame.left + (frame.width * ((Number(block.xPct) || 50) / 100)),
                y: frame.top + (frame.height * ((Number(block.yPct) || 50) / 100))
            }
            : {
                x: frame.left + (frame.width * ((Number(block.xPct) || 50) / 100)),
                y: frame.top + (frame.height * ((Number(block.yPct) || 50) / 100))
            };
        const rect = this.resolveAlignLayoutRect(align, frame, layout, margins, currentCenter);
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);

        patch.xPct = Number((((centerX - frame.left) / Math.max(frame.width, 1)) * 100).toFixed(4));
        patch.yPct = Number((((centerY - frame.top) / Math.max(frame.height, 1)) * 100).toFixed(4));
        if (block.parentId) {
            patch.nestedPositionMode = 'manual';
        }

        return {
            ...patch,
            ...this.getAlignedBlockSizePatch(block, rect)
        };
    },

    resolveAlignLayoutRect(align, frame, layout, margins = this.getBlockMargins(), currentCenter = null) {
        const left = frame.left + margins.left;
        const top = frame.top + margins.top;
        const width = Math.max(1, frame.width - margins.left - margins.right);
        const height = Math.max(1, frame.height - margins.top - margins.bottom);
        const naturalWidth = Math.max(1, Number(layout?.width) || 1);
        const naturalHeight = Math.max(1, Number(layout?.height) || 1);
        const centered = {
            left: left + ((width - naturalWidth) / 2),
            top: top + ((height - naturalHeight) / 2),
            width: naturalWidth,
            height: naturalHeight
        };

        if (align === 'client' || align === 'contents') {
            return { left, top, width, height };
        }
        if (align === 'top' || align === 'mostTop') {
            return { left, top, width, height: naturalHeight };
        }
        if (align === 'bottom' || align === 'mostBottom') {
            return { left, top: top + height - naturalHeight, width, height: naturalHeight };
        }
        if (align === 'left' || align === 'mostLeft') {
            return { left, top, width: naturalWidth, height };
        }
        if (align === 'right' || align === 'mostRight') {
            return { left: left + width - naturalWidth, top, width: naturalWidth, height };
        }
        if (align === 'horizontal') {
            return { left, top: centered.top, width, height: naturalHeight };
        }
        if (align === 'vertical') {
            return { left: centered.left, top, width: naturalWidth, height };
        }
        if (align === 'horzCenter') {
            const centerY = currentCenter?.y ?? (top + (height / 2));
            return { left: centered.left, top: centerY - (naturalHeight / 2), width: naturalWidth, height: naturalHeight };
        }
        if (align === 'vertCenter') {
            const centerX = currentCenter?.x ?? (left + (width / 2));
            return { left: centerX - (naturalWidth / 2), top: centered.top, width: naturalWidth, height: naturalHeight };
        }
        if (align === 'fit' || align === 'fitLeft' || align === 'fitRight' || align === 'scale') {
            const scale = Math.min(width / naturalWidth, height / naturalHeight);
            const fitWidth = Math.max(1, naturalWidth * scale);
            const fitHeight = Math.max(1, naturalHeight * scale);
            const fitLeft = align === 'fitLeft'
                ? left
                : (align === 'fitRight' ? left + width - fitWidth : left + ((width - fitWidth) / 2));
            return {
                left: fitLeft,
                top: top + ((height - fitHeight) / 2),
                width: fitWidth,
                height: fitHeight
            };
        }

        return centered;
    },

    getAlignedBlockSizePatch(block, rect) {
        const width = Math.max(1, Math.round(Number(rect?.width) || 1));
        const height = Math.max(1, Math.round(Number(rect?.height) || 1));
        if (block?.type === 'qr') {
            return { size: Math.max(80, Math.min(width, height)) };
        }
        if (['shape', 'line', 'section', 'columns', 'image'].includes(block?.type)) {
            return { width, height };
        }
        if (block?.type === 'text' && Number(block.width) > 0) {
            return { width };
        }
        return {};
    },

    applyAlignedChildPlacements(parentBlock, layout, childBlocks, fallbackPlacements) {
        const fallbackById = new Map((fallbackPlacements || []).map(placement => [placement.childBlock.id, placement]));
        const frame = this.getContainerBlockInnerFrame(parentBlock, layout);
        const client = { ...frame };

        return childBlocks.map(childBlock => {
            const align = window.FrameEditorComponentCatalog?.normalizeAlign?.(childBlock?.align) || 'none';
            if (align === 'none') {
                return fallbackById.get(childBlock.id) || {
                    childBlock,
                    centerX: frame.left + (frame.width / 2),
                    centerY: frame.top + (frame.height / 2)
                };
            }

            const rect = this.resolveAlignLayoutRect(align, client, this.getCanvasBlockLayout(childBlock), this.getBlockMargins(childBlock), null);
            if (align === 'top') {
                client.top = rect.top + rect.height + this.getBlockMargins(childBlock).bottom;
                client.height = Math.max(0, (frame.top + frame.height) - client.top);
            } else if (align === 'bottom') {
                client.height = Math.max(0, rect.top - client.top - this.getBlockMargins(childBlock).top);
            } else if (align === 'left') {
                client.left = rect.left + rect.width + this.getBlockMargins(childBlock).right;
                client.width = Math.max(0, (frame.left + frame.width) - client.left);
            } else if (align === 'right') {
                client.width = Math.max(0, rect.left - client.left - this.getBlockMargins(childBlock).left);
            } else if (align === 'client' || align === 'contents') {
                client.width = 0;
                client.height = 0;
            }

            return {
                childBlock,
                centerX: rect.left + (rect.width / 2),
                centerY: rect.top + (rect.height / 2)
            };
        });
    },

    getBlockRotation(block) {
        return this.normalizeBlockRotation(block?.rotation || 0);
    },

    canUseParentPositionControl(block, parentBlock = this.getParentBlock(block)) {
        return Boolean(block?.parentId && parentBlock && (!this.isContainerBlock(parentBlock) || this.usesFreePositionedChildren(parentBlock)));
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

    getNestedBlockPositionAnchors(parentBlock, block, parentLayout = this.getCanvasBlockLayout(parentBlock), footprintOverride = null) {
        const frame = this.getContainerBlockInnerFrame(parentBlock, parentLayout);
        const footprint = footprintOverride || this.getCanvasBlockFootprint(block);
        const halfWidthPct = frame.width > 0 ? (((Number(footprint?.width) || 0) / 2 / frame.width) * 100) : 50;
        const halfHeightPct = frame.height > 0 ? (((Number(footprint?.height) || 0) / 2 / frame.height) * 100) : 50;

        return {
            minXPct: halfWidthPct >= 50 ? 50 : halfWidthPct,
            maxXPct: halfWidthPct >= 50 ? 50 : (100 - halfWidthPct),
            minYPct: halfHeightPct >= 50 ? 50 : halfHeightPct,
            maxYPct: halfHeightPct >= 50 ? 50 : (100 - halfHeightPct)
        };
    },

    getNestedBlockAxisPositionValue(positionPct, startPct, centerPct, endPct, startValue, centerValue, endValue) {
        const normalizedPosition = Number.isFinite(Number(positionPct)) ? Number(positionPct) : centerPct;
        const tolerance = 1.5;

        if (Math.abs(normalizedPosition - startPct) <= tolerance) {
            return startValue;
        }

        if (Math.abs(normalizedPosition - endPct) <= tolerance) {
            return endValue;
        }

        if (Math.abs(normalizedPosition - centerPct) <= tolerance) {
            return centerValue;
        }

        return 'custom';
    },

    getCombinedParentPositionSelected(block) {
        const parentBlock = this.getParentBlock(block);
        if (!this.canUseParentPositionControl(block, parentBlock)) {
            return 'center';
        }

        const parentLayout = this.getCanvasBlockLayout(parentBlock);
        const position = this.getResolvedNestedBlockPosition(parentBlock, block, parentLayout);
        const anchors = this.getNestedBlockPositionAnchors(parentBlock, block, parentLayout);
        const x = this.getNestedBlockAxisPositionValue(position.xPct, anchors.minXPct, 50, anchors.maxXPct, 'left', 'center', 'right');
        const y = this.getNestedBlockAxisPositionValue(position.yPct, anchors.minYPct, 50, anchors.maxYPct, 'top', 'center', 'bottom');

        if (x === 'custom' || y === 'custom') {
            return 'custom';
        }

        if (x === 'center' && y === 'center') {
            return 'center';
        }

        return `${y}-${x}`;
    },

    getParentPositionPatch(block, combinedValue) {
        const parentBlock = this.getParentBlock(block);
        if (!this.canUseParentPositionControl(block, parentBlock)) {
            return {};
        }

        const normalizedValue = String(combinedValue || '').trim().toLowerCase();
        if (normalizedValue === 'custom') {
            return {
                nestedPositionMode: 'manual'
            };
        }

        let x = 'center';
        let y = 'center';
        if (normalizedValue === 'center') {
            x = 'center';
            y = 'center';
        } else {
            const [vertical, horizontal] = normalizedValue.split('-');
            y = ['top', 'center', 'bottom'].includes(vertical) ? vertical : 'center';
            x = ['left', 'center', 'right'].includes(horizontal) ? horizontal : 'center';
        }

        const parentLayout = this.getCanvasBlockLayout(parentBlock);
        const anchors = this.getNestedBlockPositionAnchors(parentBlock, block, parentLayout);
        return {
            nestedPositionMode: 'manual',
            xPct: x === 'left' ? anchors.minXPct : (x === 'right' ? anchors.maxXPct : 50),
            yPct: y === 'top' ? anchors.minYPct : (y === 'bottom' ? anchors.maxYPct : 50)
        };
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
                        class="frame-editor-canvas-stage${this.isCanvasSelected() ? ' is-selected' : ''}"
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
                                    style="transform: scale(${this.state.canvasZoom}); --frame-editor-handle-scale: ${this.getCanvasHandleScale()};"
                                >
                                    <div class="frame-editor-canvas-block-layer">
                                        ${this.getRootCanvasBlocks().map((block, index) => this.renderCanvasBlock(block, index)).join('')}
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

    renderCanvasBlock(block, index = -1) {
        const isActive = this.state.selectedBlockId === block.id;
        const width = this.getCanvasBlockLayout(block).width;
        const style = [
            `left: ${block.xPct}%`,
            `top: ${block.yPct}%`,
            `width: ${width}px`,
            `z-index: ${this.getCanvasBlockZIndex(block, index)}`,
            `transform: ${this.getCanvasBlockTransform(block.rotation)}`,
            ...this.getCanvasBlockVisualStyleEntries(block)
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
        const componentDefinition = this.getComponentDefinition(block);
        if (componentDefinition?.name) {
            return componentDefinition.name;
        }

        if (block?.type === 'text') {
            return 'TLabel';
        }
        if (block?.type === 'shape') {
            return 'TRectangle';
        }
        if (block?.type === 'section') {
            return 'TPanel';
        }
        if (block?.type === 'columns') {
            return 'TGridPanelLayout';
        }
        if (block?.type === 'image') {
            return 'TImage';
        }
        if (block?.type === 'line') {
            return 'TLine';
        }
        return 'TQRCode';
    },

    isContainerBlock(blockOrType) {
        const blockType = typeof blockOrType === 'string'
            ? blockOrType
            : blockOrType?.type;
        const componentDefinition = this.getComponentDefinition(blockOrType);
        return blockType === 'section' || blockType === 'columns' || Boolean(componentDefinition?.isContainer);
    },

    usesFreePositionedChildren(blockOrType) {
        const blockType = typeof blockOrType === 'string'
            ? blockOrType
            : blockOrType?.type;
        const className = this.getComponentClassName(blockOrType);
        const componentDefinition = this.getComponentDefinition(blockOrType);
        if (blockType === 'columns') {
            return false;
        }
        if (componentDefinition?.isContainer) {
            return true;
        }
        return !this.isContainerBlock(blockOrType);
    },

    usesManualNestedBlockPosition(parentBlock, childBlock) {
        if (!parentBlock || (this.isContainerBlock(parentBlock) && !this.usesFreePositionedChildren(parentBlock))) {
            return false;
        }

        return String(childBlock?.nestedPositionMode || '').trim().toLowerCase() === 'manual';
    },

    getCanvasBlockSceneRotation(block, blocks = this.state.canvasBlocks) {
        if (!block) {
            return 0;
        }

        const parentBlock = block.parentId && Array.isArray(blocks)
            ? blocks.find(candidate => candidate?.id === block.parentId)
            : null;
        const parentRotation = parentBlock
            ? this.getCanvasBlockSceneRotation(parentBlock, blocks)
            : 0;

        return this.normalizeBlockRotation(parentRotation + this.getBlockRotation(block));
    },

    getParentBlock(block) {
        return block?.parentId
            ? this.getBlockById(block.parentId)
            : null;
    },

    getRootCanvasBlocks(blocks = this.state.canvasBlocks) {
        return Array.isArray(blocks)
            ? blocks.filter(block => !block?.parentId)
            : [];
    },

    getChildBlocks(parentId, blocks = this.state.canvasBlocks) {
        if (!parentId || !Array.isArray(blocks)) {
            return [];
        }

        return blocks
            .filter(block => block?.parentId === parentId)
            .sort((left, right) => {
                const orderDifference = (Number(left?.childOrder) || 0) - (Number(right?.childOrder) || 0);
                if (orderDifference !== 0) {
                    return orderDifference;
                }

                return blocks.findIndex(candidate => candidate?.id === left?.id)
                    - blocks.findIndex(candidate => candidate?.id === right?.id);
            });
    },

    getNextChildOrder(parentId, blocks = this.state.canvasBlocks) {
        return this.getChildBlocks(parentId, blocks).reduce((maxOrder, child) => {
            return Math.max(maxOrder, Number(child?.childOrder) || 0);
        }, -1) + 1;
    },

    getQrBlockRotation(block) {
        return this.normalizeBlockRotation(block?.qrRotation || 0);
    },

    canSelectQrInnerBlock(block) {
        if (block?.type !== 'qr') {
            return false;
        }

        if (block?.parentId) {
            return false;
        }

        if (this.getChildBlocks(block.id).length) {
            return false;
        }

        const padding = this.getTextBlockPadding(block);
        const borderWidth = Math.max(0, Number(block?.borderWidth) || 0);
        const hasInsets = borderWidth > 0
            || padding.top > 0
            || padding.right > 0
            || padding.bottom > 0
            || padding.left > 0;

        return hasInsets || this.getQrBlockRotation(block) !== 0;
    },

    isQrInnerSelected(block) {
        return this.canSelectQrInnerBlock(block)
            && this.state.selectedBlockId === block.id
            && this.state.selectedQrBlockId === block.id;
    },

    canSelectTextInnerBlock(block) {
        if (block?.type !== 'text') {
            return false;
        }

        if (block?.parentId) {
            return false;
        }

        if (this.getChildBlocks(block.id).length) {
            return false;
        }

        const padding = this.getTextBlockPadding(block);
        return (padding.left + padding.right + padding.top + padding.bottom) > 0;
    },

    isTextInnerSelected(block) {
        return this.canSelectTextInnerBlock(block)
            && this.state.selectedBlockId === block.id
            && this.state.selectedTextBlockId === block.id;
    },

    getCanvasBlockZIndex(block, index = -1) {
        const renderIndex = index >= 0
            ? index
            : this.state.canvasBlocks.findIndex(candidate => candidate.id === block?.id);
        let zIndex = Math.max(renderIndex, 0) + 1;
        if (block?.alwaysOnTop) {
            zIndex += 1000;
        }
        if (this.state.selectedBlockId === block?.id) {
            zIndex += 2000;
        }
        return zIndex;
    },

    renderCanvasBlockInner(block) {
        if (block.type === 'text') {
            const layout = this.getTextBlockLayout(block);
            const padding = this.getTextBlockPadding(block);
            const childLayer = this.renderCanvasBlockChildLayer(block, layout);
            const isTextInnerSelected = this.isTextInnerSelected(block);
            const surfaceStyle = [
                ...(this.usesExplicitComponentBounds(block) ? [`width: ${layout.width}px`, `height: ${layout.height}px`, 'box-sizing: border-box'] : []),
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
                <div class="frame-editor-text-block-surface" style="${surfaceStyle}"><div class="frame-editor-text-block-content${isTextInnerSelected ? ' is-selected' : ''}" data-frame-editor-text-content="true" style="${inlineStyle}" spellcheck="false">${this.renderTextBlockContentMarkup(block)}</div></div>
                ${childLayer}
                ${this.state.selectedBlockId === block.id && !isTextInnerSelected ? this.renderCanvasBlockHandles(block) : ''}
            `;
        }

        if (block.type === 'shape') {
            const layout = this.getShapeBlockLayout(block);
            const childLayer = this.renderCanvasBlockChildLayer(block, layout);
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
                ${childLayer}
                ${this.state.selectedBlockId === block.id ? this.renderCanvasBlockHandles(block) : ''}
            `;
        }

        if (block.type === 'line') {
            const layout = this.getLineBlockLayout(block);
            const childLayer = this.renderCanvasBlockChildLayer(block, layout);
            const borderWidth = Math.max(0, Number(block.borderWidth) || 0);
            const borderColor = borderWidth > 0 ? (block.borderColor || this.getTextBlockDefaultColor()) : 'transparent';
            const borderRadius = this.getLineBlockBorderRadius(block, layout);
            const innerInset = borderWidth > 0 ? Math.min(borderWidth, Math.floor(Math.min(layout.width, layout.height) / 2)) : 0;
            const fillStyle = this.getLineBlockFillInlineStyle(block, layout, innerInset, borderRadius);

            return `
                <div class="frame-editor-line-block-surface" style="width: ${layout.width}px; height: ${layout.height}px; background-color: ${borderColor}; border-radius: ${borderRadius}px;">
                    <div class="frame-editor-line-block-fill" style="${this.escapeHTML(fillStyle)}"></div>
                </div>
                ${childLayer}
                ${this.state.selectedBlockId === block.id ? this.renderCanvasBlockHandles(block) : ''}
            `;
        }

        if (block.type === 'section' || block.type === 'columns') {
            return this.renderContainerCanvasBlock(block);
        }

        if (block.type === 'image') {
            const layout = this.getImageBlockLayout(block);
            const childLayer = this.renderCanvasBlockChildLayer(block, layout);
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
                ${childLayer}
                ${this.state.selectedBlockId === block.id ? this.renderCanvasBlockHandles(block) : ''}
            `;
        }

        if (this.isGenericComponentBlock(block)) {
            return this.renderGenericComponentBlockInner(block);
        }

        const layout = this.getQrBlockLayout(block);
        const padding = this.getQrBlockPadding(block);
        const isQrInnerSelected = this.isQrInnerSelected(block);
        const shouldShowQrHandleLayer = isQrInnerSelected;
        const qrRotation = this.getQrBlockRotation(block);
        const childLayer = this.renderCanvasBlockChildLayer(block, layout);
        const qrSurfaceStyle = [
            `padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
            `border-width: ${layout.borderWidth}px`,
            'border-style: solid',
            `border-color: ${(Number(block.borderWidth) || 0) > 0 ? (block.borderColor || block.colorDark || this.getTextBlockDefaultColor()) : 'transparent'}`,
            `border-radius: ${Math.max(0, Number(block.borderRadius) || 0)}px`,
            `background-color: ${this.isTransparentTextBlockBackground(block) ? 'transparent' : block.backgroundColor}`
        ].join('; ');

        const qrMarkup = this.getCanvasQrMarkup(block);

        return `
            <div class="frame-editor-qr-block-surface" style="${qrSurfaceStyle}">
                <div class="frame-editor-qr-block-content${isQrInnerSelected ? ' is-selected' : ''}" data-frame-editor-qr-content="true" style="width: ${this.getQrBlockSize(block)}px; height: ${this.getQrBlockSize(block)}px; transform: rotate(${qrRotation}deg);">
                    ${qrMarkup}
                </div>
            </div>
            ${childLayer}
            ${shouldShowQrHandleLayer
                ? this.renderQrBlockInteractionLayer(block)
                : (this.state.selectedBlockId === block.id ? this.renderCanvasBlockHandles(block) : '')}
        `;
    },

    renderContainerCanvasBlock(block) {
        const layout = this.getCanvasBlockLayout(block);
        const padding = this.getTextBlockPadding(block);
        const className = this.getComponentClassName(block);
        const suppressedPlaceholderClasses = ['TGroupBox', 'TPanel', 'TVertScrollBox', 'TFramedVertScrollBox', 'TScaledLayout', 'THorzScrollBox', 'TLayout', 'TScrollBox', 'TFramedScrollBox', 'TGridPanelLayout', 'TFlowLayout', 'TGridLayout', 'TExpander', 'TCalloutPanel', 'TToolBar', 'TStatusBar'];
        const emptyLabel = block.type === 'columns'
            ? I18n.translateString('Add components into this columns container')
            : (suppressedPlaceholderClasses.includes(className) ? '' : I18n.translateString('Add components into this section'));
        const childLayer = this.renderCanvasBlockChildLayer(block, layout, {
            childBlocks: this.getChildBlocks(block.id),
            showPlaceholder: true,
            emptyLabel
        });
        const surfaceStyle = [
            `width: ${layout.width}px`,
            `height: ${layout.height}px`,
            `border-width: ${layout.borderWidth}px`,
            'border-style: solid',
            `border-color: ${(Number(block.borderWidth) || 0) > 0 ? (block.borderColor || this.getTextBlockDefaultColor()) : 'transparent'}`,
            `border-radius: ${Math.max(0, Number(block.borderRadius) || 0)}px`,
            `background-color: ${this.isTransparentTextBlockBackground(block) ? 'transparent' : block.backgroundColor}`,
            `--frame-editor-container-padding-top: ${padding.top}px`,
            `--frame-editor-container-padding-right: ${padding.right}px`,
            `--frame-editor-container-padding-bottom: ${padding.bottom}px`,
            `--frame-editor-container-padding-left: ${padding.left}px`,
            `--frame-editor-container-column-count: ${block.type === 'columns' ? this.getResolvedColumnsBlockCount(block) : 1}`,
            `--frame-editor-container-column-gap: ${block.type === 'columns' ? this.getResolvedColumnsBlockGap(block) : 0}px`
        ].join('; ');

        return `
            <div class="frame-editor-container-block-surface frame-editor-container-block-surface-${block.type}" style="${surfaceStyle}">
            </div>
            ${childLayer}
            ${this.state.selectedBlockId === block.id ? this.renderCanvasBlockHandles(block) : ''}
        `;
    },

    isGenericComponentBlock(block) {
        if (!block) {
            return false;
        }
        if (['qr', 'text', 'shape', 'line', 'section', 'columns', 'image'].includes(block.type)) {
            return false;
        }
        return Boolean(this.getComponentDefinition(block));
    },

    getGenericComponentLayout(block) {
        const borderWidth = Math.max(0, Number(block?.borderWidth) || 0);
        return {
            width: Math.max(1, Number(block?.width) || 160),
            height: Math.max(1, Number(block?.height) || 44),
            borderWidth
        };
    },

    renderGenericComponentBlockInner(block) {
        const layout = this.getGenericComponentLayout(block);
        const padding = this.getTextBlockPadding(block);
        const className = this.getComponentClassName(block);
        const suppressedPlaceholderClasses = ['TGroupBox', 'TPanel', 'TVertScrollBox', 'TFramedVertScrollBox', 'TScaledLayout', 'THorzScrollBox', 'TLayout', 'TScrollBox', 'TFramedScrollBox', 'TGridPanelLayout', 'TFlowLayout', 'TGridLayout', 'TExpander', 'TCalloutPanel', 'TToolBar', 'TStatusBar'];
        const childLayer = this.isContainerBlock(block)
            ? this.renderCanvasBlockChildLayer(block, layout, {
                childBlocks: this.getChildBlocks(block.id),
                showPlaceholder: true,
                emptyLabel: suppressedPlaceholderClasses.includes(className)
                    ? ''
                    : I18n.translate('Add components into this {name} container', { name: className })
            })
            : this.renderCanvasBlockChildLayer(block, layout);
        const surfaceStyle = [
            `width: ${layout.width}px`,
            `height: ${layout.height}px`,
            `box-sizing: border-box`,
            'position: relative',
            `padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
            `border-width: ${layout.borderWidth}px`,
            'border-style: solid',
            `border-color: ${layout.borderWidth > 0 ? (block.borderColor || this.getTextBlockDefaultColor()) : 'transparent'}`,
            `border-radius: ${Math.max(0, Number(block.borderRadius) || 0)}px`,
            `background-color: ${this.isTransparentTextBlockBackground(block) ? 'transparent' : (block.backgroundColor || 'transparent')}`,
            `color: ${block.color || this.getTextBlockDefaultColor()}`,
            `font-size: ${Math.max(8, Number(block.fontSize) || 16)}px`,
            `font-weight: ${Number(block.fontWeight) || 400}`,
            `font-style: ${block.fontStyle || 'normal'}`,
            `text-align: ${block.textAlign || 'center'}`,
            `line-height: ${this.getTextBlockLineHeight(block)}`,
            `letter-spacing: ${Number(block.letterSpacing) || 0}px`,
            `text-decoration: ${block.textDecoration || 'none'}`,
            `text-transform: ${block.textTransform || 'none'}`
        ].join('; ');
        const contentMarkup = this.renderGenericComponentContent(block, className);

        return `
            <div class="frame-editor-generic-component-surface frame-editor-generic-component-${this.escapeHTML(className)}" style="${surfaceStyle}">
                ${contentMarkup}
            </div>
            ${childLayer}
            ${this.state.selectedBlockId === block.id ? this.renderCanvasBlockHandles(block) : ''}
        `;
    },

    renderGenericComponentContent(block, className = this.getComponentClassName(block)) {
        const text = this.escapeHTML(this.getDisplayTextForBlock(block) || className);
        const value = this.getNormalizedRangeValue(block);

        if (['TLayout', 'TFlowLayout', 'TGridLayout', 'TGridPanelLayout', 'TScaledLayout', 'TScrollBox', 'THorzScrollBox', 'TVertScrollBox', 'TFramedScrollBox', 'TFramedVertScrollBox'].includes(className)) {
            if (className === 'TGridLayout' || className === 'TGridPanelLayout') {
                return `<div style="position: absolute; inset: 0; pointer-events: none; opacity: .28; background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px); background-size: 48px 48px;"></div>`;
            }
            if (className === 'TFlowLayout') {
                return `<div style="position: absolute; inset: 12px; display: flex; flex-wrap: wrap; align-content: flex-start; gap: ${Math.max(0, Number(block.verticalGap) || 8)}px ${Math.max(0, Number(block.horizontalGap) || 8)}px; opacity: .35; pointer-events: none;"><span style="width: 40px; height: 18px; border-radius: 4px; background: currentColor;"></span><span style="width: 72px; height: 18px; border-radius: 4px; background: currentColor;"></span><span style="width: 52px; height: 18px; border-radius: 4px; background: currentColor;"></span></div>`;
            }
            return '';
        }

        if (className === 'TCalloutRectangle') {
            const position = ['top', 'left', 'right', 'bottom'].includes(block.calloutPosition) ? block.calloutPosition : 'bottom';
            const width = Math.max(0, Number(block.calloutWidth) || 36);
            const length = Math.max(0, Number(block.calloutLength) || 24);
            const offset = Number(block.calloutOffset) || 0;
            const color = this.escapeHTML(block.backgroundColor || block.color || '#66c0f4');
            const triangleStyle = {
                top: `left: calc(50% + ${offset}px - ${width / 2}px); top: -${length}px; border-left: ${width / 2}px solid transparent; border-right: ${width / 2}px solid transparent; border-bottom: ${length}px solid ${color};`,
                bottom: `left: calc(50% + ${offset}px - ${width / 2}px); bottom: -${length}px; border-left: ${width / 2}px solid transparent; border-right: ${width / 2}px solid transparent; border-top: ${length}px solid ${color};`,
                left: `top: calc(50% + ${offset}px - ${width / 2}px); left: -${length}px; border-top: ${width / 2}px solid transparent; border-bottom: ${width / 2}px solid transparent; border-right: ${length}px solid ${color};`,
                right: `top: calc(50% + ${offset}px - ${width / 2}px); right: -${length}px; border-top: ${width / 2}px solid transparent; border-bottom: ${width / 2}px solid transparent; border-left: ${length}px solid ${color};`
            }[position];
            return `<span style="position: absolute; width: 0; height: 0; ${triangleStyle}"></span>`;
        }

        if (className === 'TArc' || className === 'TPie') {
            const startAngle = Number.isFinite(Number(block.startAngle)) ? Number(block.startAngle) : 0;
            const endAngle = Number.isFinite(Number(block.endAngle)) ? Number(block.endAngle) : 270;
            const sweep = Math.max(0, Math.min(360, Math.abs(endAngle - startAngle) || 0));
            const color = this.escapeHTML(block.color || block.borderColor || '#66c0f4');
            const mask = className === 'TArc' ? 'mask: radial-gradient(circle, transparent 52%, #000 54%); -webkit-mask: radial-gradient(circle, transparent 52%, #000 54%);' : '';
            return `<div style="position: absolute; inset: 0; border-radius: 999px; background: conic-gradient(from ${startAngle}deg, ${color} 0deg ${sweep}deg, transparent ${sweep}deg 360deg); ${mask}"></div>`;
        }

        if (className === 'TPath') {
            const pathData = this.escapeHTML(block.data || 'M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80');
            const stroke = this.escapeHTML(block.borderColor || block.color || '#66c0f4');
            const fill = this.escapeHTML(block.backgroundColor === 'transparent' ? 'none' : (block.backgroundColor || 'none'));
            return `<svg viewBox="0 0 200 160" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true"><path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(1, Number(block.borderWidth) || 3)}" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
        }

        if (className === 'TPaintBox') {
            return `<div style="position: absolute; inset: 0; display: grid; place-items: center; color: currentColor; background-image: linear-gradient(135deg, transparent 0 46%, currentColor 46% 47%, transparent 47% 100%); opacity: .55;"><i class="bi bi-brush" aria-hidden="true" style="font-size: min(32px, 50%);"></i></div>`;
        }

        if (className === 'TSelection') {
            const gripSize = Math.max(3, Number(block.gripSize) || 6);
            const handle = position => `<span style="position: absolute; ${position}; width: ${gripSize * 2}px; height: ${gripSize * 2}px; margin: -${gripSize}px; border-radius: 999px; background: currentColor;"></span>`;
            return `${handle('left: 0; top: 0')}${handle('right: 0; top: 0')}${handle('left: 0; bottom: 0')}${handle('right: 0; bottom: 0')}`;
        }

        if (className === 'TSelectionPoint') {
            return '';
        }

        if (className === 'TImageControl') {
            return block.src
                ? `<img src="${this.escapeHTML(block.src)}" alt="" draggable="false" style="width: 100%; height: 100%; object-fit: ${this.escapeHTML(block.objectFit || 'contain')}; display: block;">`
                : `<div style="width: 100%; height: 100%; display: grid; place-items: center; color: currentColor;"><i class="bi bi-image" aria-hidden="true" style="font-size: min(36px, 60%);"></i></div>`;
        }

        if (className === 'TArcDial') {
            const angle = -135 + (value * 2.7);
            return `
                <div style="position: relative; width: 100%; height: 100%; border-radius: 999px; border: 3px solid rgba(255,255,255,.28); box-sizing: border-box; display: grid; place-items: center;">
                    <span style="position: absolute; width: 4px; height: 38%; top: 12%; left: calc(50% - 2px); border-radius: 999px; background: currentColor; transform-origin: 50% 100%; transform: rotate(${angle}deg);"></span>
                    <span style="width: 24%; height: 24%; border-radius: 999px; background: currentColor;"></span>
                </div>
            `;
        }

        if (['TTrackBar', 'TBitmapTrackBar', 'TTrack', 'TScrollBar', 'TSmallScrollBar'].includes(className)) {
            const isVertical = block.orientation === 'vertical';
            const trackStyle = isVertical
                ? 'width: 6px; height: 100%;'
                : 'width: 100%; height: 6px;';
            const thumbStyle = isVertical
                ? `bottom: ${value}%; left: 50%; margin-left: -9px; margin-bottom: -9px;`
                : `left: ${value}%; top: 50%; margin-left: -9px; margin-top: -9px;`;
            return `
                <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <span style="display: block; ${trackStyle} border-radius: 999px; background: rgba(255,255,255,.28);"></span>
                    <span style="position: absolute; ${thumbStyle} width: 18px; height: 18px; border-radius: 999px; background: currentColor; box-shadow: 0 0 0 3px rgba(0,0,0,.16);"></span>
                </div>
            `;
        }

        if (className === 'TSizeGrip') {
            return `
                <div style="width: 100%; height: 100%; position: relative; opacity: .9;">
                    <span style="position: absolute; right: 4px; bottom: 4px; width: 18px; height: 18px; background: repeating-linear-gradient(135deg, transparent 0 4px, currentColor 4px 6px, transparent 6px 9px);"></span>
                </div>
            `;
        }

        if (className === 'TCheckBox' || className === 'TRadioButton') {
            const isRadio = className === 'TRadioButton';
            return `
                <div style="display: flex; align-items: center; gap: 10px; width: 100%; height: 100%;">
                    <span style="width: 18px; height: 18px; border: 2px solid currentColor; border-radius: ${isRadio ? '999px' : '4px'}; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; flex: 0 0 auto;">
                        ${block.isChecked ? `<span style="width: ${isRadio ? 8 : 10}px; height: ${isRadio ? 8 : 10}px; border-radius: ${isRadio ? '999px' : '2px'}; background: currentColor; display: block;"></span>` : ''}
                    </span>
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${text}</span>
                </div>
            `;
        }

        if (className === 'TSwitch') {
            const isChecked = block.isChecked !== false;
            return `
                <div style="width: 100%; height: 100%; border-radius: 999px; background: ${isChecked ? '#22c55e' : '#4b5563'}; padding: 3px; box-sizing: border-box;">
                    <span style="display: block; width: calc(50% - 1px); height: 100%; border-radius: 999px; background: #fff; transform: translateX(${isChecked ? 'calc(100% + 2px)' : '0'});"></span>
                </div>
            `;
        }

        if (className === 'TProgressBar') {
            return `
                <div style="width: 100%; height: 100%; border-radius: inherit; overflow: hidden; background: rgba(255,255,255,.16);">
                    <span style="display: block; width: ${value}%; height: 100%; background: #66c0f4; border-radius: inherit;"></span>
                </div>
            `;
        }

        if (className === 'TSplitter') {
            return `<div style="width: 100%; height: 100%; border-radius: inherit; background: currentColor; opacity: .85;"></div>`;
        }

        if (className === 'TAniIndicator') {
            return `<div style="width: 100%; height: 100%; display: grid; place-items: center;"><i class="bi bi-arrow-repeat" aria-hidden="true" style="font-size: min(32px, 80%);"></i></div>`;
        }

        if (className === 'TGroupBox') {
            return `<span style="position: absolute; top: -11px; left: 10px; padding: 0 6px; background: ${this.escapeHTML(block.backgroundColor || '#2d2d2d')}; color: currentColor;">${text}</span>`;
        }

        return `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${text}</div>`;
    },

    getNormalizedRangeValue(block) {
        const min = Number.isFinite(Number(block?.min)) ? Number(block.min) : 0;
        const max = Number.isFinite(Number(block?.max)) ? Number(block.max) : 100;
        const value = Number.isFinite(Number(block?.value)) ? Number(block.value) : min;
        if (max <= min) {
            return 0;
        }
        return this.clamp(((value - min) / (max - min)) * 100, 0, 100);
    },

    getCanvasBlockVisualStyleEntries(block) {
        const entries = [];
        if (block?.visible === false) {
            entries.push('display: none');
        }
        if (Number.isFinite(Number(block?.opacity))) {
            entries.push(`opacity: ${this.clamp(Number(block.opacity), 0, 1)}`);
        }
        if (block?.enabled === false || block?.hitTest === false) {
            entries.push('pointer-events: none');
        }
        return entries;
    },

    renderCanvasBlockChildLayer(block, layout = this.getCanvasBlockLayout(block), options = {}) {
        const childBlocks = Array.isArray(options.childBlocks)
            ? options.childBlocks
            : this.getChildBlocks(block?.id);
        const showPlaceholder = Boolean(options.showPlaceholder);
        const emptyLabel = options.emptyLabel || '';
        if (!childBlocks.length && !showPlaceholder) {
            return '';
        }

        const childMarkup = block?.type === 'columns'
            ? this.renderColumnsContainerChildren(block, layout, childBlocks)
            : (this.usesFreePositionedChildren(block)
                ? this.renderFreePositionedContainerChildren(block, layout, childBlocks)
                : this.renderSectionContainerChildren(block, layout, childBlocks));

        return `
            ${block?.type === 'columns' ? this.renderColumnsContainerGuides(block, layout) : ''}
            <div class="frame-editor-container-block-child-layer">
                ${childMarkup || (showPlaceholder && emptyLabel ? `<div class="frame-editor-container-block-placeholder">${this.escapeHTML(emptyLabel)}</div>` : '')}
            </div>
        `;
    },

    renderSectionContainerChildren(block, layout, childBlocks = this.getChildBlocks(block.id)) {
        const placements = this.getSectionContainerChildPlacements(block, layout, childBlocks);
        return placements.map(({ childBlock, centerX, centerY }, index) => {
            return this.renderNestedCanvasBlock(childBlock, centerX, centerY, index);
        }).join('');
    },

    renderColumnsContainerChildren(block, layout, childBlocks = this.getChildBlocks(block.id)) {
        const placements = this.getColumnsContainerChildPlacements(block, layout, childBlocks);
        return placements.map(({ childBlock, centerX, centerY }, index) => {
            return this.renderNestedCanvasBlock(childBlock, centerX, centerY, index);
        }).join('');
    },

    renderFreePositionedContainerChildren(block, layout, childBlocks = this.getChildBlocks(block.id)) {
        const placements = this.getFreePositionedContainerChildPlacements(block, layout, childBlocks);
        return placements.map(({ childBlock, centerX, centerY }, index) => {
            return this.renderNestedCanvasBlock(childBlock, centerX, centerY, index);
        }).join('');
    },

    renderColumnsContainerGuides(block, layout) {
        const frame = this.getContainerBlockInnerFrame(block, layout);
        const columnCount = this.getResolvedColumnsBlockCount(block);
        const columnGap = this.getResolvedColumnsBlockGap(block);
        if (columnCount <= 1 || frame.width <= 0) {
            return '';
        }

        const guides = [];
        const columnWidth = (frame.width - (columnGap * (columnCount - 1))) / columnCount;
        for (let columnIndex = 1; columnIndex < columnCount; columnIndex += 1) {
            const left = frame.left + (columnIndex * columnWidth) + ((columnIndex - 0.5) * columnGap);
            guides.push(`<span class="frame-editor-container-block-column-guide" style="left: ${left}px; top: ${frame.top}px; height: ${frame.height}px;"></span>`);
        }

        return `<div class="frame-editor-container-block-column-guides">${guides.join('')}</div>`;
    },

    renderNestedCanvasBlock(block, centerX, centerY, index = 0) {
        const isActive = this.state.selectedBlockId === block.id;
        const width = this.getCanvasBlockLayout(block).width;
        const style = [
            `left: ${centerX}px`,
            `top: ${centerY}px`,
            `width: ${width}px`,
            `z-index: ${isActive ? 2000 : (index + 1)}`,
            `transform: ${this.getCanvasBlockTransform(block.rotation)}`,
            ...this.getCanvasBlockVisualStyleEntries(block)
        ].join('; ');

        return `
            <div
                class="frame-editor-canvas-block frame-editor-canvas-block-${block.type} frame-editor-canvas-block-nested${isActive ? ' active' : ''}"
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

    getContainerBlockInnerFrame(block, layout = this.getCanvasBlockLayout(block)) {
        const padding = this.getTextBlockPadding(block);
        const borderWidth = Math.max(0, Number(layout?.borderWidth) || Number(block?.borderWidth) || 0);
        const width = Math.max(0, Number(layout?.width) || 0);
        const height = Math.max(0, Number(layout?.height) || 0);

        return {
            left: borderWidth + padding.left,
            top: borderWidth + padding.top,
            width: Math.max(0, width - (borderWidth * 2) - padding.left - padding.right),
            height: Math.max(0, height - (borderWidth * 2) - padding.top - padding.bottom)
        };
    },

    getSectionContainerChildPlacements(block, layout = this.getCanvasBlockLayout(block), childBlocks = this.getChildBlocks(block.id)) {
        const frame = this.getContainerBlockInnerFrame(block, layout);
        const childGap = this.getResolvedContainerChildGap(block);
        const childAlignment = block?.childAlignment || 'left';
        let nextTop = frame.top;

        const fallbackPlacements = childBlocks.map(childBlock => {
            const childFootprint = this.getCanvasBlockFootprint(childBlock);
            const childWidth = childFootprint.width;
            const childHeight = childFootprint.height;
            const centerX = this.getResolvedContainerChildCenterX(childAlignment, frame.left, frame.width, childWidth);
            const centerY = nextTop + (childHeight / 2);
            nextTop += childHeight + childGap;

            return {
                childBlock,
                centerX,
                centerY
            };
        });

        return childBlocks.some(childBlock => this.hasLayoutAlign(childBlock))
            ? this.applyAlignedChildPlacements(block, layout, childBlocks, fallbackPlacements)
            : fallbackPlacements;
    },

    getColumnsContainerChildPlacements(block, layout = this.getCanvasBlockLayout(block), childBlocks = this.getChildBlocks(block.id)) {
        const frame = this.getContainerBlockInnerFrame(block, layout);
        const childGap = this.getResolvedContainerChildGap(block);
        const childAlignment = block?.childAlignment || 'left';
        const columnCount = this.getResolvedColumnsBlockCount(block);
        const columnGap = this.getResolvedColumnsBlockGap(block);
        const columnWidth = columnCount > 0
            ? Math.max(0, (frame.width - (columnGap * (columnCount - 1))) / columnCount)
            : frame.width;
        const columnOffsets = Array.from({ length: Math.max(columnCount, 1) }, () => frame.top);

        const fallbackPlacements = childBlocks.map((childBlock, index) => {
            const requestedColumnIndex = Number.isFinite(Number(childBlock?.columnIndex))
                ? Number(childBlock.columnIndex)
                : index;
            const columnIndex = this.clamp(Math.round(requestedColumnIndex), 0, Math.max(columnCount - 1, 0));
            const childFootprint = this.getCanvasBlockFootprint(childBlock);
            const columnLeft = frame.left + (columnIndex * (columnWidth + columnGap));
            const centerX = this.getResolvedContainerChildCenterX(childAlignment, columnLeft, columnWidth, childFootprint.width);
            const centerY = columnOffsets[columnIndex] + (childFootprint.height / 2);
            columnOffsets[columnIndex] += childFootprint.height + childGap;

            return {
                childBlock,
                centerX,
                centerY
            };
        });

        return childBlocks.some(childBlock => this.hasLayoutAlign(childBlock))
            ? this.applyAlignedChildPlacements(block, layout, childBlocks, fallbackPlacements)
            : fallbackPlacements;
    },

    getFreePositionedContainerChildPlacements(block, layout = this.getCanvasBlockLayout(block), childBlocks = this.getChildBlocks(block.id)) {
        const frame = this.getContainerBlockInnerFrame(block, layout);
        const flowChildren = childBlocks.filter(childBlock => !this.usesManualNestedBlockPosition(block, childBlock));
        const flowPlacementMap = new Map(
            this.getSectionContainerChildPlacements(block, layout, flowChildren)
                .map(placement => [placement.childBlock.id, placement])
        );

        const fallbackPlacements = childBlocks.map(childBlock => {
            if (this.usesManualNestedBlockPosition(block, childBlock)) {
                const position = this.clampNestedBlockPosition(block, childBlock, {
                    xPct: childBlock?.xPct,
                    yPct: childBlock?.yPct
                }, layout);

                return {
                    childBlock,
                    centerX: frame.left + (frame.width * (position.xPct / 100)),
                    centerY: frame.top + (frame.height * (position.yPct / 100))
                };
            }

            const flowPlacement = flowPlacementMap.get(childBlock.id);
            if (flowPlacement) {
                return flowPlacement;
            }

            return {
                childBlock,
                centerX: frame.left + (frame.width / 2),
                centerY: frame.top + (frame.height / 2)
            };
        });

        return childBlocks.some(childBlock => this.hasLayoutAlign(childBlock))
            ? this.applyAlignedChildPlacements(block, layout, childBlocks, fallbackPlacements)
            : fallbackPlacements;
    },

    getResolvedNestedBlockPosition(parentBlock, childBlock, parentLayout = this.getCanvasBlockLayout(parentBlock), childBlocks = this.getChildBlocks(parentBlock?.id)) {
        const frame = this.getContainerBlockInnerFrame(parentBlock, parentLayout);
        if (frame.width <= 0 || frame.height <= 0) {
            return {
                xPct: 50,
                yPct: 50
            };
        }

        const placements = this.getContainerChildPlacements(parentBlock, parentLayout, childBlocks);
        const placement = placements.find(candidate => candidate.childBlock.id === childBlock?.id);
        if (!placement) {
            return {
                xPct: 50,
                yPct: 50
            };
        }

        return {
            xPct: Number((((placement.centerX - frame.left) / frame.width) * 100).toFixed(4)),
            yPct: Number((((placement.centerY - frame.top) / frame.height) * 100).toFixed(4))
        };
    },

    getContainerChildPlacements(parentBlock, parentLayout = this.getCanvasBlockLayout(parentBlock), childBlocks = this.getChildBlocks(parentBlock?.id)) {
        if (parentBlock?.type === 'columns') {
            return this.getColumnsContainerChildPlacements(parentBlock, parentLayout, childBlocks);
        }
        if (this.usesFreePositionedChildren(parentBlock)) {
            return this.getFreePositionedContainerChildPlacements(parentBlock, parentLayout, childBlocks);
        }
        return this.getSectionContainerChildPlacements(parentBlock, parentLayout, childBlocks);
    },

    getResolvedContainerChildCenterX(alignment, left, width, childWidth) {
        if (alignment === 'right') {
            return left + Math.max(childWidth / 2, width - (childWidth / 2));
        }
        if (alignment === 'center') {
            return left + (width / 2);
        }
        return left + (childWidth / 2);
    },

    getResolvedContainerChildGap(block) {
        return Math.max(4, Number(block?.childGap) || 12);
    },

    getResolvedColumnsBlockCount(block) {
        return this.clamp(Math.round(Number(block?.columnCount) || 2), 2, 6);
    },

    getResolvedColumnsBlockGap(block) {
        return Math.max(0, Number(block?.columnGap) || 24);
    },

    getCanvasQrMarkupCacheKey(block, size = this.getQrBlockSize(block)) {
        return JSON.stringify({
            text: this.getCurrentQrPreviewText(),
            size,
            colorDark: block?.colorDark || this.PREVIEW_QR_OPTIONS.colorDark,
            colorLight: block?.colorLight || 'transparent'
        });
    },

    getCanvasQrMarkup(block, size = this.getQrBlockSize(block)) {
        const cacheKey = this.getCanvasQrMarkupCacheKey(block, size);
        const cachedMarkup = this.qrMarkupCache.get(cacheKey);
        if (cachedMarkup) {
            return cachedMarkup;
        }

        const colorLight = String(block?.colorLight || 'transparent').trim() || 'transparent';
        const qrMarkup = buildNativeQRCodeSVG({
            text: this.getCurrentQrPreviewText(),
            size,
            qrOptions: {
                ...this.PREVIEW_QR_OPTIONS,
                margin: 0,
                colorDark: block.colorDark,
                colorLight,
                transparentBackground: colorLight === 'transparent',
                correctLevel: QRCode.CorrectLevel[this.PREVIEW_QR_OPTIONS.correctLevel]
            },
            includeLogo: false
        });

        this.qrMarkupCache.set(cacheKey, qrMarkup);
        if (this.qrMarkupCache.size > 128) {
            const oldestCacheKey = this.qrMarkupCache.keys().next().value;
            this.qrMarkupCache.delete(oldestCacheKey);
        }

        return qrMarkup;
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

        if (block.parentId) {
            const parentBlock = this.getParentBlock(block);
            if (!parentBlock || (this.isContainerBlock(parentBlock) && !this.usesFreePositionedChildren(parentBlock))) {
                return '';
            }
        }

        if (block.type === 'qr' && this.isQrInnerSelected(block)) {
            return '';
        }

        if (block.type === 'text' && this.isTextInnerSelected(block)) {
            return '';
        }

        if (block.type === 'qr' && this.canUseParentPositionControl(block)) {
            return `
                ${this.renderBlockRotateHandle()}
                ${this.renderShapeImageResizeHandles()}
            `;
        }

        if (this.usesVisualComponentResizeHandles(block)) {
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

    usesExplicitComponentBounds(block) {
        if (!block) {
            return false;
        }
        if (this.isGenericComponentBlock(block)) {
            return true;
        }
        if (block.type === 'text' && this.getComponentDefinition(block)) {
            return true;
        }
        return false;
    },

    usesVisualComponentResizeHandles(block) {
        if (!block) {
            return false;
        }
        if (block.type === 'shape' || block.type === 'image' || block.type === 'line' || block.type === 'section' || block.type === 'columns') {
            return true;
        }
        return this.usesExplicitComponentBounds(block);
    },

    canUseVisualResize(block) {
        return block?.type === 'qr' || this.usesVisualComponentResizeHandles(block);
    },

    getVisualResizeMinimumSize(block, borderWidth = Math.max(0, Number(block?.borderWidth) || 0), qrPadding = null) {
        if (block?.type === 'line') {
            return { width: 24, height: 2 };
        }
        if (block?.type === 'qr') {
            return {
                width: Math.max(80 + (borderWidth * 2) + (qrPadding?.left || 0) + (qrPadding?.right || 0), 80),
                height: Math.max(80 + (borderWidth * 2) + (qrPadding?.top || 0) + (qrPadding?.bottom || 0), 80)
            };
        }
        if (block?.type === 'section') {
            return { width: 220, height: 160 };
        }
        if (block?.type === 'columns') {
            return { width: 280, height: 180 };
        }
        if (this.usesExplicitComponentBounds(block)) {
            return { width: 16, height: 16 };
        }
        const minBorder = block?.type === 'image' ? (borderWidth * 2) : 0;
        return {
            width: Math.max(48 + minBorder, 48),
            height: Math.max(48 + minBorder, 48)
        };
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

    getCanvasHandleScale(zoom = this.state.canvasZoom) {
        const normalizedZoom = Math.max(Number(zoom) || 0, 0.0001);
        return Number(Math.max(1 / normalizedZoom, 0.2).toFixed(4));
    },

    getQrBlockHandleLayout(block) {
        const padding = this.getTextBlockPadding(block);
        const borderWidth = Math.max(0, Number(block?.borderWidth) || 0);
        const size = this.getQrBlockSize(block);
        const qrRotation = this.getQrBlockRotation(block);
        const handleScale = this.getCanvasHandleScale();
        const cornerSize = 18 * handleScale;
        const sideLength = 42 * handleScale;
        const sideThickness = 14 * handleScale;
        const sideOffset = 7 * handleScale;
        const cornerOffset = 9 * handleScale;

        return {
            layerLeft: borderWidth + padding.left,
            layerTop: borderWidth + padding.top,
            size,
            rotation: qrRotation,
            rotate: {
                left: size / 2,
                top: -40 * handleScale
            },
            resize: [
                ['top', size / 2 - (sideLength / 2), -sideOffset, sideLength, sideThickness, 'ns-resize'],
                ['right', size - sideOffset, size / 2 - (sideLength / 2), sideThickness, sideLength, 'ew-resize'],
                ['bottom', size / 2 - (sideLength / 2), size - sideOffset, sideLength, sideThickness, 'ns-resize'],
                ['left', -sideOffset, size / 2 - (sideLength / 2), sideThickness, sideLength, 'ew-resize'],
                ['top-left', -cornerOffset, -cornerOffset, cornerSize, cornerSize, 'nwse-resize'],
                ['top-right', size - cornerOffset, -cornerOffset, cornerSize, cornerSize, 'nesw-resize'],
                ['bottom-right', size - cornerOffset, size - cornerOffset, cornerSize, cornerSize, 'nwse-resize'],
                ['bottom-left', -cornerOffset, size - cornerOffset, cornerSize, cornerSize, 'nesw-resize']
            ]
        };
    },

    renderQrBlockInteractionLayer(block) {
        const handleLayout = this.getQrBlockHandleLayout(block);

        return `
            <div
                class="frame-editor-qr-block-handle-layer"
                data-frame-editor-qr-handle-layer
                style="left: ${handleLayout.layerLeft}px; top: ${handleLayout.layerTop}px; width: ${handleLayout.size}px; height: ${handleLayout.size}px; transform: rotate(${handleLayout.rotation}deg);"
            >
                ${this.renderQrBlockRotateHandle(handleLayout)}
                ${this.renderQrBlockResizeHandles(handleLayout)}
            </div>
        `;
    },

    renderQrBlockRotateHandle(handleLayout) {
        const rotateHandle = handleLayout.rotate;

        return `
            <button
                type="button"
                class="frame-editor-block-rotate-handle frame-editor-qr-block-rotate-handle"
                data-frame-editor-qr-rotate-handle
                tabindex="-1"
                aria-hidden="true"
                style="left: ${rotateHandle.left}px; top: ${rotateHandle.top}px;"
            ></button>
        `;
    },

    renderQrBlockResizeHandles(handleLayout) {
        const handles = handleLayout.resize;

        return handles.map(([side, left, top, width, height, cursor]) => `
            <button
                type="button"
                class="frame-editor-block-resize-handle frame-editor-qr-block-resize-handle"
                data-frame-editor-qr-resize-handle="${side}"
                tabindex="-1"
                aria-hidden="true"
                style="left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px; cursor: ${cursor};"
            ></button>
        `).join('');
    },

    syncQrBlockPreview(blockElement, block) {
        if (!blockElement || block?.type !== 'qr') {
            return false;
        }

        const surface = blockElement.querySelector('.frame-editor-qr-block-surface');
        const qrContent = blockElement.querySelector('[data-frame-editor-qr-content]');
        if (!surface || !qrContent) {
            return false;
        }

        const padding = this.getQrBlockPadding(block);
        const layout = this.getQrBlockLayout(block);
        const qrRotation = this.getQrBlockRotation(block);
        const isQrInnerSelected = this.isQrInnerSelected(block);
        surface.style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
        surface.style.borderWidth = `${layout.borderWidth}px`;
        surface.style.borderStyle = 'solid';
        surface.style.borderColor = (Number(block.borderWidth) || 0) > 0
            ? (block.borderColor || block.colorDark || this.getTextBlockDefaultColor())
            : 'transparent';
        surface.style.borderRadius = `${Math.max(0, Number(block.borderRadius) || 0)}px`;
        surface.style.backgroundColor = this.isTransparentTextBlockBackground(block)
            ? 'transparent'
            : block.backgroundColor;

        qrContent.classList.toggle('is-selected', isQrInnerSelected);
        qrContent.style.width = `${this.getQrBlockSize(block)}px`;
        qrContent.style.height = `${this.getQrBlockSize(block)}px`;
        qrContent.style.transform = `rotate(${qrRotation}deg)`;

        const handleLayout = this.getQrBlockHandleLayout(block);
        const handleLayer = blockElement.querySelector('[data-frame-editor-qr-handle-layer]');
        if (handleLayer) {
            handleLayer.style.left = `${handleLayout.layerLeft}px`;
            handleLayer.style.top = `${handleLayout.layerTop}px`;
            handleLayer.style.width = `${handleLayout.size}px`;
            handleLayer.style.height = `${handleLayout.size}px`;
            handleLayer.style.transform = `rotate(${handleLayout.rotation}deg)`;
        }

        const rotateHandle = blockElement.querySelector('[data-frame-editor-qr-rotate-handle]');
        if (rotateHandle) {
            rotateHandle.style.left = `${handleLayout.rotate.left}px`;
            rotateHandle.style.top = `${handleLayout.rotate.top}px`;
        }

        handleLayout.resize.forEach(([side, left, top, width, height, cursor]) => {
            const handleElement = blockElement.querySelector(`[data-frame-editor-qr-resize-handle="${side}"]`);
            if (!handleElement) {
                return;
            }

            handleElement.style.left = `${left}px`;
            handleElement.style.top = `${top}px`;
            handleElement.style.width = `${width}px`;
            handleElement.style.height = `${height}px`;
            handleElement.style.cursor = cursor;
        });

        return true;
    },

    syncTextBlockPreview(blockElement, block) {
        if (!blockElement || block?.type !== 'text') {
            return false;
        }

        const surface = blockElement.querySelector('.frame-editor-text-block-surface');
        const content = blockElement.querySelector('.frame-editor-text-block-content');
        if (!surface || !content) {
            return false;
        }

        const layout = this.getTextBlockLayout(block);
        const padding = this.getTextBlockPadding(block);
        surface.style.width = `${layout.width}px`;
        surface.style.height = `${layout.height}px`;
        surface.style.boxSizing = 'border-box';
        surface.style.backgroundColor = this.isTransparentTextBlockBackground(block)
            ? 'transparent'
            : block.backgroundColor;
        surface.style.borderColor = (Number(block.borderWidth) || 0) > 0
            ? (block.borderColor || block.color || this.getTextBlockDefaultColor())
            : 'transparent';
        surface.style.borderStyle = 'solid';
        surface.style.borderWidth = `${layout.borderWidth}px`;
        surface.style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
        surface.style.borderRadius = `${Math.max(0, Number(block.borderRadius) || 0)}px`;

        content.style.fontSize = `${block.fontSize}px`;
        content.style.fontWeight = String(block.fontWeight);
        content.style.fontStyle = block.fontStyle;
        content.style.color = block.color;
        content.style.textAlign = block.textAlign || 'left';
        content.style.lineHeight = String(this.getTextBlockLineHeight(block));
        content.style.letterSpacing = `${(Number(block.letterSpacing) || 0)}px`;
        content.style.textDecoration = block.textDecoration || 'none';
        content.style.textTransform = block.textTransform || 'none';
        content.classList.toggle('is-selected', this.isTextInnerSelected(block));
        return true;
    },

    syncGenericComponentPreview(blockElement, block) {
        if (!blockElement || !this.isGenericComponentBlock(block)) {
            return false;
        }

        const surface = blockElement.querySelector('.frame-editor-generic-component-surface');
        if (!surface) {
            return false;
        }

        const layout = this.getGenericComponentLayout(block);
        const padding = this.getTextBlockPadding(block);
        surface.style.width = `${layout.width}px`;
        surface.style.height = `${layout.height}px`;
        surface.style.boxSizing = 'border-box';
        surface.style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
        surface.style.borderWidth = `${layout.borderWidth}px`;
        surface.style.borderStyle = 'solid';
        surface.style.borderColor = layout.borderWidth > 0
            ? (block.borderColor || this.getTextBlockDefaultColor())
            : 'transparent';
        surface.style.borderRadius = `${Math.max(0, Number(block.borderRadius) || 0)}px`;
        surface.style.backgroundColor = this.isTransparentTextBlockBackground(block)
            ? 'transparent'
            : (block.backgroundColor || 'transparent');
        surface.style.color = block.color || this.getTextBlockDefaultColor();
        surface.style.fontSize = `${Math.max(8, Number(block.fontSize) || 16)}px`;
        surface.style.fontWeight = String(Number(block.fontWeight) || 400);
        surface.style.fontStyle = block.fontStyle || 'normal';
        surface.style.textAlign = block.textAlign || 'center';
        surface.style.lineHeight = String(this.getTextBlockLineHeight(block));
        surface.style.letterSpacing = `${Number(block.letterSpacing) || 0}px`;
        surface.style.textDecoration = block.textDecoration || 'none';
        surface.style.textTransform = block.textTransform || 'none';
        return true;
    },

    syncShapeImageBlockPreview(blockElement, block) {
        if (!blockElement || (block?.type !== 'shape' && block?.type !== 'image' && block?.type !== 'line' && block?.type !== 'section' && block?.type !== 'columns')) {
            return false;
        }

        if (block.type === 'section' || block.type === 'columns') {
            const surface = blockElement.querySelector('.frame-editor-container-block-surface');
            if (!surface) {
                return false;
            }

            const layout = this.getCanvasBlockLayout(block);
            const padding = this.getTextBlockPadding(block);
            surface.style.width = `${layout.width}px`;
            surface.style.height = `${layout.height}px`;
            surface.style.borderWidth = `${layout.borderWidth}px`;
            surface.style.borderStyle = 'solid';
            surface.style.borderColor = (Number(block.borderWidth) || 0) > 0
                ? (block.borderColor || this.getTextBlockDefaultColor())
                : 'transparent';
            surface.style.borderRadius = `${Math.max(0, Number(block.borderRadius) || 0)}px`;
            surface.style.backgroundColor = this.isTransparentTextBlockBackground(block)
                ? 'transparent'
                : block.backgroundColor;
            surface.style.setProperty('--frame-editor-container-padding-top', `${padding.top}px`);
            surface.style.setProperty('--frame-editor-container-padding-right', `${padding.right}px`);
            surface.style.setProperty('--frame-editor-container-padding-bottom', `${padding.bottom}px`);
            surface.style.setProperty('--frame-editor-container-padding-left', `${padding.left}px`);
            surface.style.setProperty('--frame-editor-container-column-count', String(block.type === 'columns' ? this.getResolvedColumnsBlockCount(block) : 1));
            surface.style.setProperty('--frame-editor-container-column-gap', `${block.type === 'columns' ? this.getResolvedColumnsBlockGap(block) : 0}px`);
            return true;
        }

        if (block.type === 'shape') {
            const surface = blockElement.querySelector('.frame-editor-shape-block-surface');
            if (!surface) {
                return false;
            }

            const layout = this.getShapeBlockLayout(block);
            const borderWidth = Math.max(0, Number(block.borderWidth) || 0);
            const borderColor = borderWidth > 0 ? (block.borderColor || this.getTextBlockDefaultColor()) : 'transparent';
            const fillColor = block.color || this.getTextBlockDefaultColor();
            const innerInset = borderWidth > 0 ? Math.min(borderWidth, Math.floor(Math.min(layout.width, layout.height) / 2)) : 0;
            const fill = blockElement.querySelector('.frame-editor-shape-block-fill');

            surface.style.width = `${layout.width}px`;
            surface.style.height = `${layout.height}px`;
            surface.style.backgroundColor = borderWidth > 0 ? borderColor : fillColor;
            surface.style.overflow = 'hidden';
            const borderRadiusStyle = this.getShapeBorderRadiusStyle(block);
            const clipPathStyle = this.getShapeClipPathStyle(block);
            if (borderRadiusStyle) {
                const [, value] = borderRadiusStyle.split(':');
                surface.style.borderRadius = value.trim();
            } else {
                surface.style.removeProperty('border-radius');
            }
            if (clipPathStyle) {
                const [, value] = clipPathStyle.split(':');
                surface.style.clipPath = value.trim();
            } else {
                surface.style.removeProperty('clip-path');
            }

            if (fill) {
                fill.style.inset = `${innerInset}px`;
                fill.style.backgroundColor = fillColor;
                if (borderRadiusStyle) {
                    const [, value] = borderRadiusStyle.split(':');
                    fill.style.borderRadius = value.trim();
                } else {
                    fill.style.removeProperty('border-radius');
                }
                if (clipPathStyle) {
                    const [, value] = clipPathStyle.split(':');
                    fill.style.clipPath = value.trim();
                } else {
                    fill.style.removeProperty('clip-path');
                }
            }
            return true;
        }

        if (block.type === 'line') {
            const surface = blockElement.querySelector('.frame-editor-line-block-surface');
            const fill = blockElement.querySelector('.frame-editor-line-block-fill');
            if (!surface) {
                return false;
            }

            const layout = this.getLineBlockLayout(block);
            const borderWidth = Math.max(0, Number(block.borderWidth) || 0);
            const borderColor = borderWidth > 0 ? (block.borderColor || this.getTextBlockDefaultColor()) : 'transparent';
            const borderRadius = this.getLineBlockBorderRadius(block, layout);
            const innerInset = borderWidth > 0 ? Math.min(borderWidth, Math.floor(Math.min(layout.width, layout.height) / 2)) : 0;
            surface.style.width = `${layout.width}px`;
            surface.style.height = `${layout.height}px`;
            surface.style.backgroundColor = borderColor;
            surface.style.borderRadius = `${borderRadius}px`;
            if (fill) {
                const fillStyle = this.getLineBlockFillInlineStyle(block, layout, innerInset, borderRadius);
                if (fill.dataset.lineFillStyle !== fillStyle) {
                    fill.dataset.lineFillStyle = fillStyle;
                    fill.style.cssText = fillStyle;
                }
            }
            return true;
        }

        const surface = blockElement.querySelector('.frame-editor-image-block-surface');
        const content = blockElement.querySelector('.frame-editor-image-block-content');
        if (!surface || !content) {
            return false;
        }

        const layout = this.getImageBlockLayout(block);
        surface.style.borderWidth = `${layout.borderWidth}px`;
        surface.style.borderStyle = 'solid';
        surface.style.borderColor = (Number(block.borderWidth) || 0) > 0
            ? (block.borderColor || this.getTextBlockDefaultColor())
            : 'transparent';
        surface.style.borderRadius = `${Math.max(0, Number(block.borderRadius) || 0)}px`;
        surface.style.backgroundColor = this.isTransparentTextBlockBackground(block)
            ? 'transparent'
            : block.backgroundColor;
        content.style.width = `${layout.imageWidth}px`;
        content.style.height = `${layout.imageHeight}px`;
        return true;
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
        const naturalWidth = Math.ceil(contentWidth + padding.left + padding.right + (borderWidth * 2));
        const naturalHeight = Math.ceil(contentHeight + padding.top + padding.bottom + (borderWidth * 2));

        if (this.usesExplicitComponentBounds(block)) {
            return {
                width: Math.max(1, Number(block?.width) || naturalWidth),
                height: Math.max(1, Number(block?.height) || naturalHeight),
                paddingTop: padding.top,
                paddingRight: padding.right,
                paddingBottom: padding.bottom,
                paddingLeft: padding.left,
                borderWidth
            };
        }

        return {
            width: naturalWidth,
            height: naturalHeight,
            paddingTop: padding.top,
            paddingRight: padding.right,
            paddingBottom: padding.bottom,
            paddingLeft: padding.left,
            borderWidth
        };
    },

    getQrBlockPadding(block) {
        if (this.canUseParentPositionControl(block)) {
            return {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };
        }

        return this.getTextBlockPadding(block);
    },

    getQrBlockLayout(block) {
        const padding = this.getQrBlockPadding(block);
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

    getSectionBlockLayout(block) {
        const borderWidth = Math.max(0, Number(block?.borderWidth) || 0);
        return {
            width: Math.max(220, Number(block?.width) || 320),
            height: Math.max(160, Number(block?.height) || 220),
            borderWidth
        };
    },

    getColumnsBlockLayout(block) {
        const borderWidth = Math.max(0, Number(block?.borderWidth) || 0);
        return {
            width: Math.max(280, Number(block?.width) || 420),
            height: Math.max(180, Number(block?.height) || 240),
            borderWidth
        };
    },

    getLineBlockLayout(block) {
        const normalized = this.getNormalizedLineBlockDimensions(block);
        return {
            width: normalized.width,
            height: normalized.height
        };
    },

    getLineBlockMinimumWidth(height = 8) {
        const thickness = Math.max(2, Number(height) || 8);
        const straightBodyLength = Math.max(24, thickness * 0.5);
        return Math.ceil(thickness + straightBodyLength);
    },

    getNormalizedLineBlockDimensions(block) {
        const height = Math.max(2, Number(block?.height) || 8);
        const requestedWidth = Math.max(24, Number(block?.width) || 180);

        return {
            width: Math.max(requestedWidth, this.getLineBlockMinimumWidth(height)),
            height
        };
    },

    normalizeLineBlockPatch(block, patch = {}) {
        const normalizedPatch = Object.prototype.hasOwnProperty.call(patch, 'lineStyle')
            ? {
                ...patch,
                lineStyle: this.getNormalizedLineBlockStyleId(patch.lineStyle)
            }
            : patch;

        if (!block || block.type !== 'line') {
            return normalizedPatch;
        }

        if (!Object.prototype.hasOwnProperty.call(normalizedPatch, 'width')
            && !Object.prototype.hasOwnProperty.call(normalizedPatch, 'height')) {
            return normalizedPatch;
        }

        const normalized = this.getNormalizedLineBlockDimensions({
            ...block,
            ...normalizedPatch
        });

        return {
            ...normalizedPatch,
            width: Math.round(normalized.width),
            height: Math.round(normalized.height)
        };
    },

    getLineBlockBorderRadius(block, layout = this.getLineBlockLayout(block)) {
        const requestedRadius = Math.max(0, Number(block?.borderRadius ?? 999) || 0);
        return Math.min(requestedRadius, Math.floor(Math.min(layout.width, layout.height) / 2));
    },

    svgMarkupToDataUrl(svgMarkup) {
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(String(svgMarkup || '').replace(/\s{2,}/g, ' ').trim())}`;
    },

    getLineBlockSvgFillStyle(color, height, lineStyle, config) {
        if (!config) {
            return '';
        }

        const normalizedHeight = Math.max(8, Math.round(height));
        const cacheKey = `${lineStyle || 'wave'}:${String(color || '').toLowerCase()}:${normalizedHeight}`;
        const cachedFillStyle = this.lineBlockFillStyleCache.get(cacheKey);
        if (cachedFillStyle) {
            return cachedFillStyle;
        }

        const strokeWidth = Math.max(2, Math.round(normalizedHeight * config.strokeRatio));
        const maxAmplitude = Math.max(1, Math.floor((normalizedHeight - strokeWidth) / 2));
        const amplitude = Math.min(
            maxAmplitude,
            Math.max(1, Math.round(normalizedHeight * config.amplitudeRatio))
        );
        const wavelength = Math.max(18, Math.round(normalizedHeight * config.wavelengthFactor));
        const midY = normalizedHeight / 2;
        const topY = Math.max(strokeWidth / 2, midY - amplitude);
        const bottomY = Math.min(normalizedHeight - (strokeWidth / 2), midY + amplitude);
        const halfWave = wavelength / 2;
        const quarterWave = wavelength / 4;
        const threeQuarterWave = wavelength * 0.75;
        const waveRiseX = halfWave * 0.22;
        const wavePeakX = halfWave * 0.78;
        let pathData = '';

        if (config.type === 'triangle') {
            pathData = `M 0 ${midY} L ${quarterWave} ${topY} L ${halfWave} ${midY} L ${threeQuarterWave} ${bottomY} L ${wavelength} ${midY}`;
        } else if (config.type === 'sawtooth') {
            pathData = `M 0 ${bottomY} L ${wavelength * 0.82} ${topY} L ${wavelength} ${bottomY}`;
        } else if (config.type === 'square') {
            pathData = `M 0 ${bottomY} L ${quarterWave} ${bottomY} L ${quarterWave} ${topY} L ${threeQuarterWave} ${topY} L ${threeQuarterWave} ${bottomY} L ${wavelength} ${bottomY}`;
        } else if (config.type === 'pulse') {
            pathData = `M 0 ${midY} L ${wavelength * 0.18} ${midY} L ${wavelength * 0.32} ${topY} L ${wavelength * 0.46} ${midY} L ${wavelength * 0.56} ${midY} L ${wavelength * 0.7} ${bottomY} L ${wavelength * 0.84} ${midY} L ${wavelength} ${midY}`;
        } else {
            pathData = `M 0 ${midY} C ${waveRiseX} ${topY}, ${wavePeakX} ${topY}, ${halfWave} ${midY} C ${halfWave + waveRiseX} ${bottomY}, ${wavelength - waveRiseX} ${bottomY}, ${wavelength} ${midY}`;
        }

        const svgMarkup = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wavelength} ${normalizedHeight}">
                <path
                    d="${pathData}"
                    fill="none"
                    stroke="${color}"
                    stroke-width="${strokeWidth}"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        `;

        const fillStyle = [
            `background-image: url('${this.svgMarkupToDataUrl(svgMarkup)}')`,
            `background-size: ${wavelength}px 100%`,
            'background-position: center',
            'background-repeat: repeat-x',
            'background-color: transparent'
        ].join('; ');

        this.lineBlockFillStyleCache.set(cacheKey, fillStyle);
        if (this.lineBlockFillStyleCache.size > 128) {
            const oldestCacheKey = this.lineBlockFillStyleCache.keys().next().value;
            this.lineBlockFillStyleCache.delete(oldestCacheKey);
        }

        return fillStyle;
    },

    getLineBlockFillStyle(block, layout = this.getLineBlockLayout(block)) {
        const width = Math.max(0, Number(layout?.width) || 0);
        const height = Math.max(0, Number(layout?.height) || 0);
        const color = block?.color || this.getTextBlockDefaultColor();
        const lineStyle = this.getNormalizedLineBlockStyleId(block?.lineStyle || 'solid');
        const dashLength = Math.max(8, Math.round(height * 1.8));
        const dashGap = Math.max(6, Math.round(height * 0.95));
        const dotSize = Math.max(4, Math.round(height * 0.72));
        const dotGap = Math.max(6, Math.round(height * 0.9));
        const doubleBand = Math.max(2, Math.round(height * 0.28));
        const stripeWidth = Math.max(6, Math.round(height * 0.75));

        if (lineStyle === 'dashed') {
            return [
                `background-image: repeating-linear-gradient(90deg, ${color} 0 ${dashLength}px, transparent ${dashLength}px ${dashLength + dashGap}px)`,
                'background-color: transparent',
                'background-repeat: repeat'
            ].join('; ');
        }

        if (lineStyle === 'dotted') {
            return [
                `background-image: radial-gradient(circle closest-side, ${color} 0 95%, transparent 100%)`,
                `background-size: ${dotSize}px ${dotSize}px`,
                `background-position: center`,
                `background-repeat: repeat-x`,
                'background-color: transparent'
            ].join('; ');
        }

        if (lineStyle === 'double') {
            return [
                `background-image: linear-gradient(to bottom, ${color} 0 ${doubleBand}px, transparent ${doubleBand}px calc(100% - ${doubleBand}px), ${color} calc(100% - ${doubleBand}px) 100%)`,
                'background-color: transparent',
                'background-repeat: no-repeat'
            ].join('; ');
        }

        if (lineStyle === 'striped') {
            return [
                `background-image: repeating-linear-gradient(135deg, ${color} 0 ${stripeWidth}px, ${this.hexToRgba(color, 0.22)} ${stripeWidth}px ${stripeWidth * 2}px)`,
                `background-color: ${this.hexToRgba(color, 0.14)}`,
                'background-repeat: repeat'
            ].join('; ');
        }

        if (lineStyle === 'gradient') {
            return [
                `background-image: linear-gradient(90deg, ${this.hexToRgba(color, 0.35)} 0%, ${color} 50%, ${this.hexToRgba(color, 0.65)} 100%)`,
                `background-color: ${color}`,
                'background-repeat: no-repeat'
            ].join('; ');
        }

        if (this.LINE_BLOCK_SVG_STYLE_CONFIGS[lineStyle]) {
            return this.getLineBlockSvgFillStyle(color, height, lineStyle, this.LINE_BLOCK_SVG_STYLE_CONFIGS[lineStyle]);
        }

        return [
            `background-color: ${color}`,
            width > 0 && height > 0 ? 'background-repeat: no-repeat' : ''
        ].filter(Boolean).join('; ');
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
        if (block.type === 'section') {
            return this.getSectionBlockLayout(block);
        }
        if (block.type === 'columns') {
            return this.getColumnsBlockLayout(block);
        }
        if (block.type === 'line') {
            return this.getLineBlockLayout(block);
        }
        if (block.type === 'image') {
            return this.getImageBlockLayout(block);
        }
        if (this.isGenericComponentBlock(block)) {
            return this.getGenericComponentLayout(block);
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
        this.applyRightSidebarFilter(root);
        this.restorePanelScrollState(root, scrollState);
        this.highlightJsonView(root);
        this.syncViewportLayout(root);
        this.restorePanelScrollState(root, scrollState);
    },

    applyRightSidebarFilter(root = this.getRoot()) {
        const activeRightSidebarTab = this.state.rightSidebarTab === 'events' ? 'events' : 'properties';
        const panels = Array.from(root?.querySelectorAll?.('[data-frame-editor-right-sidebar-panel]') || []);
        const activePanel = panels.find(panel => panel.dataset.frameEditorRightSidebarPanel === activeRightSidebarTab) || null;
        const filteredEmptyState = root?.querySelector?.('[data-frame-editor-right-sidebar-empty="filtered"]');
        const normalizedSearchTerm = String(this.state.rightSidebarSearchTerm || '').trim().toLowerCase();

        if (!panels.length) {
            if (filteredEmptyState) {
                filteredEmptyState.hidden = true;
            }
            return;
        }

        const filterPanel = panel => {
            let panelHasVisibleMatch = !normalizedSearchTerm;

            Array.from(panel.children).forEach(child => {
                if (child.classList?.contains('frame-editor-empty-state')) {
                    child.hidden = Boolean(normalizedSearchTerm);
                }
            });

            panel.querySelectorAll('.frame-editor-sidebar-panel-section').forEach(section => {
                const forms = Array.from(section.children).filter(child => child.classList?.contains('frame-editor-sidebar-form'));
                if (!forms.length) {
                    section.hidden = false;
                    return;
                }

                let sectionHasMatch = false;
                let sectionHasFilterableItems = false;

                forms.forEach(form => {
                    Array.from(form.children).forEach(child => {
                        if (child.classList?.contains('frame-editor-empty-state')) {
                            child.hidden = Boolean(normalizedSearchTerm);
                            if (!normalizedSearchTerm) {
                                sectionHasMatch = true;
                            }
                            return;
                        }

                        sectionHasFilterableItems = true;
                        const normalizedChildText = String(child.textContent || '').trim().toLowerCase();
                        const matches = !normalizedSearchTerm || normalizedChildText.includes(normalizedSearchTerm);
                        child.hidden = !matches;
                        if (matches) {
                            sectionHasMatch = true;
                        }
                    });
                });

                if (!sectionHasFilterableItems && !normalizedSearchTerm) {
                    sectionHasMatch = true;
                }

                section.hidden = !sectionHasMatch;
                if (sectionHasMatch) {
                    panelHasVisibleMatch = true;
                }
            });

            return panelHasVisibleMatch;
        };

        const panelMatchState = panels.map(panel => filterPanel(panel));
        const activePanelIndex = panels.findIndex(panel => panel.dataset.frameEditorRightSidebarPanel === activeRightSidebarTab);
        const activePanelHasMatch = activePanelIndex >= 0 ? panelMatchState[activePanelIndex] : panelMatchState.some(Boolean);

        if (filteredEmptyState) {
            const searchState = activePanel?.dataset.frameEditorRightSidebarSearchState || 'searchable';
            filteredEmptyState.hidden = !normalizedSearchTerm
                || activePanelHasMatch
                || searchState === 'selection-required';
        }
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
        if (!this.handleFrameEditorKeydown) {
            this.handleFrameEditorKeydown = event => {
                if (event.key === 'Escape' && this.shouldHandleCanvasParentEscapeShortcut(event)) {
                    const selectedBlock = this.getSelectedBlock();
                    const parentBlock = this.getParentBlock(selectedBlock);
                    if (parentBlock?.id) {
                        event.preventDefault();
                        this.selectBlock(parentBlock.id);
                    }
                    return;
                }

                if (this.isCanvasArrowNudgeKey(event.key) && this.shouldHandleCanvasArrowShortcut(event)) {
                    event.preventDefault();
                    this.nudgeCanvasBlockByKeyboard(this.state.selectedBlockId, event.key, event.shiftKey ? 2 : 1, this.getRoot());
                    return;
                }

                // Only treat the explicit Delete key as the canvas-block deletion shortcut.
                // Backspace should not delete a selected block (prevents accidental deletes).
                const isDeleteKey = event.key === 'Delete';
                if (!isDeleteKey || !this.shouldHandleCanvasDeleteShortcut(event)) {
                    const isModifierShortcut = (event.ctrlKey || event.metaKey) && !event.altKey;
                    if (!isModifierShortcut || !this.shouldHandleCanvasClipboardShortcut(event)) {
                        return;
                    }

                    const key = String(event.key || '').toLowerCase();
                    if (key === 'c' && this.state.selectedBlockId) {
                        event.preventDefault();
                        this.copyBlockToClipboard();
                        return;
                    }

                    if (key === 'x' && this.state.selectedBlockId) {
                        event.preventDefault();
                        this.cutBlockToClipboard();
                        return;
                    }

                    if (key === 'v' && this.hasBlockClipboard()) {
                        event.preventDefault();
                        const pastePosition = this.state.selectedBlockId
                            ? null
                            : this.getVisibleCanvasCenterPosition(this.getRoot());
                        this.pasteBlockFromClipboard(pastePosition, this.getRoot());
                    }
                    return;
                }

                event.preventDefault();
                this.removeSelectedBlock();
            };
            window.addEventListener('keydown', this.handleFrameEditorKeydown);
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
                const isOverviewMode = (this.state.leftPanelMode || 'library') === 'overview';
                const nextCollapsed = isOverviewMode ? false : !this.isLeftSidebarCollapsed();
                this.state = {
                    ...this.state,
                    leftPanelMode: 'library',
                    isSidebarCollapsed: nextCollapsed,
                    preferLeftSidebarExpanded: !nextCollapsed
                };
                this.renderIntoRoot();
            });
        });

        root.querySelectorAll('[data-frame-editor-toggle-overview]').forEach(button => {
            button.addEventListener('click', () => {
                const isOverviewMode = (this.state.leftPanelMode || 'library') === 'overview';
                const nextCollapsed = isOverviewMode ? !this.isLeftSidebarCollapsed() : false;
                this.state = {
                    ...this.state,
                    leftPanelMode: 'overview',
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

        root.querySelectorAll('[data-frame-editor-right-sidebar-tab]').forEach(button => {
            button.addEventListener('click', () => {
                const nextRightSidebarTab = button.dataset.frameEditorRightSidebarTab;
                if (!nextRightSidebarTab || nextRightSidebarTab === this.state.rightSidebarTab) {
                    return;
                }

                this.state = {
                    ...this.state,
                    rightSidebarTab: nextRightSidebarTab
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

        root.querySelectorAll('[data-frame-editor-save-json]').forEach(button => {
            button.addEventListener('click', () => {
                this.saveFrameAsJson(root);
            });
        });

        root.querySelectorAll('[data-frame-editor-load-json]').forEach(button => {
            button.addEventListener('click', () => {
                this.openLoadJsonDialog(root);
            });
        });

        root.querySelectorAll('[data-frame-editor-load-json-close]').forEach(button => {
            button.addEventListener('click', () => {
                this.closeLoadJsonDialog();
            });
        });

        const loadJsonForm = root.querySelector('[data-frame-editor-load-json-form]');
        if (loadJsonForm) {
            loadJsonForm.addEventListener('submit', event => {
                event.preventDefault();
                void this.loadFrameFromJsonInput(root);
            });
        }

        const loadJsonFileInput = root.querySelector('[data-frame-editor-load-json-file]');
        if (loadJsonFileInput) {
            loadJsonFileInput.addEventListener('change', event => {
                const file = event.target.files?.[0] || null;
                event.target.value = '';
                if (!file) {
                    return;
                }

                void this.loadFrameFromJsonFile(file, root);
            });
        }

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

        const rightSidebarSearchInput = root.querySelector('#frameEditorRightSidebarSearchInput');
        if (rightSidebarSearchInput) {
            rightSidebarSearchInput.addEventListener('input', event => {
                this.state = {
                    ...this.state,
                    rightSidebarSearchTerm: event.target.value
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
                if (!this.isSupportedComponentType(blockType)) {
                    return;
                }

                this.addComponent(blockType, null, root);
            });

            button.addEventListener('dragstart', event => {
                const blockType = button.dataset.frameEditorDragBlock;
                if (!this.isSupportedComponentType(blockType) || !event.dataTransfer) {
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

            stage.addEventListener('contextmenu', event => {
                if (event.target.closest('[data-frame-editor-canvas-block]')) {
                    return;
                }

                event.preventDefault();
                this.showGridContextMenu(
                    event.clientX,
                    event.clientY,
                    this.getCanvasPositionFromPointer(root, event.clientX, event.clientY),
                    root
                );
            });

            stage.addEventListener('click', event => {
                if (this.stagePanSuppressClick === true) {
                    this.stagePanSuppressClick = false;
                    return;
                }

                if (event.target.closest('[data-frame-editor-canvas-block]')) {
                    return;
                }

                this.selectCanvas({ focusInspector: false });
            });

            stage.addEventListener('dragover', event => {
                const blockType = this.getDraggedBlockType(event);
                const structureBlockId = this.getDraggedStructureBlockId(event) || this.structureDragBlockId;
                if (!blockType && !structureBlockId) {
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
                const structureBlockId = this.getDraggedStructureBlockId(event) || this.structureDragBlockId;
                stage.classList.remove('is-drop-target');
                if (!this.isSupportedComponentType(blockType) && !structureBlockId) {
                    return;
                }

                event.preventDefault();
                const dropPosition = this.getCanvasPositionFromPointer(root, event.clientX, event.clientY);
                if (this.isSupportedComponentType(blockType)) {
                    this.addComponent(blockType, dropPosition, root);
                    return;
                }

                this.moveStructureBlock(structureBlockId, '', 'after', root, dropPosition);
                this.clearStructureDropIndicators(root);
                this.structureDragBlockId = '';
            });

            stage.addEventListener('wheel', event => {
                event.preventDefault();
                const wheelDelta = this.normalizeWheelZoomDelta(event, root);
                const zoomFactor = Math.exp(-wheelDelta * 0.0015);
                this.scaleCanvasZoom(zoomFactor, {
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
                    this.scaleCanvasZoom(1.12, null, root);
                    return;
                }
                if (action === 'out') {
                    this.scaleCanvasZoom(1 / 1.12, null, root);
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
                    input.value = this.formatCanvasZoomPercent();
                    input.blur();
                    this.hideCanvasZoomContextMenu(root);
                }
            });

            input.addEventListener('change', commitZoom);
        });

        root.addEventListener('pointerdown', event => {
            const zoomMenu = root.querySelector('[data-frame-editor-zoom-menu]');
            const contextMenu = root.querySelector('[data-frame-editor-context-menu]');
            if (zoomMenu && !zoomMenu.hidden && !zoomMenu.contains(event.target)) {
                this.hideCanvasZoomContextMenu(root);
            }
            if (contextMenu && !contextMenu.hidden && !contextMenu.contains(event.target)) {
                this.hideFrameEditorContextMenu(root);
            }
        });

        root.addEventListener('pointerdown', event => {
            const qrRotateHandle = event.target.closest('[data-frame-editor-qr-rotate-handle]');
            if (qrRotateHandle && root.contains(qrRotateHandle)) {
                this.beginQrBlockRotate(root, qrRotateHandle, event);
                return;
            }

            const rotateHandle = event.target.closest('[data-frame-editor-rotate-handle]');
            if (rotateHandle && root.contains(rotateHandle)) {
                this.beginCanvasBlockRotate(root, rotateHandle, event);
                return;
            }

            const qrResizeHandle = event.target.closest('[data-frame-editor-qr-resize-handle]');
            if (qrResizeHandle && root.contains(qrResizeHandle)) {
                this.beginQrBlockResize(root, qrResizeHandle, event);
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
                if (this.state.isLoadJsonDialogOpen) {
                    event.preventDefault();
                    this.closeLoadJsonDialog();
                    return;
                }

                this.hideCanvasZoomContextMenu(root);
                this.hideFrameEditorContextMenu(root);
            }
        });

        root.querySelectorAll('[data-frame-editor-canvas-block]').forEach(blockElement => {
            blockElement.addEventListener('pointerdown', event => {
                const nearestBlockElement = event.target.closest('[data-frame-editor-canvas-block]');
                if (nearestBlockElement !== blockElement) {
                    return;
                }

                if (
                    event.target.closest('[data-frame-editor-padding-handle]')
                    || event.target.closest('[data-frame-editor-qr-rotate-handle]')
                    || event.target.closest('[data-frame-editor-qr-resize-handle]')
                    || event.target.closest('[data-frame-editor-resize-handle]')
                    || event.target.closest('[data-frame-editor-rotate-handle]')
                ) {
                    return;
                }

                const textContent = event.target.closest('[data-frame-editor-text-content]');
                const qrContent = event.target.closest('[data-frame-editor-qr-content]');
                const blockId = blockElement.dataset.frameEditorCanvasBlock;
                const block = this.getBlockById(blockId);
                const parentBlock = block ? this.getParentBlock(block) : null;
                const clickedTransparentNestedQrSurface = block?.type === 'qr'
                    && Boolean(block?.parentId)
                    && Boolean(parentBlock)
                    && Boolean(event.target.closest('.frame-editor-qr-block-surface'))
                    && !qrContent
                    && this.isTransparentTextBlockBackground(block)
                    && Math.max(0, Number(block.borderWidth) || 0) === 0;

                if (clickedTransparentNestedQrSurface) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.selectBlock(parentBlock.id);
                    return;
                }

                if (textContent && block?.type === 'text' && this.canSelectTextInnerBlock(block)) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (this.isTextInnerSelected(block)) {
                        this.beginTextBlockReposition(root, blockElement, event);
                    } else if (this.state.selectedBlockId === blockId) {
                        this.beginCanvasBlockDrag(root, blockElement, event, {
                            onClick: () => this.selectTextInnerBlock(blockId)
                        });
                    } else {
                        this.selectBlock(blockId);
                    }
                    return;
                }

                if (qrContent && block?.type === 'qr' && this.canSelectQrInnerBlock(block)) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (this.isQrInnerSelected(block)) {
                        this.beginQrBlockReposition(root, blockElement, event);
                    } else if (this.state.selectedBlockId === blockId) {
                        this.beginCanvasBlockDrag(root, blockElement, event, {
                            onClick: () => this.selectQrInnerBlock(blockId)
                        });
                    } else {
                        this.selectBlock(blockId);
                    }
                    return;
                }

                if (block?.type === 'text' && this.isTextInnerSelected(block)) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.deselectTextInnerBlock(blockId);
                    return;
                }

                if (block?.type === 'qr' && this.isQrInnerSelected(block)) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.deselectQrInnerBlock(blockId);
                    return;
                }

                if (block?.parentId && (!parentBlock || (this.isContainerBlock(parentBlock) && !this.usesFreePositionedChildren(parentBlock)))) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.selectBlock(blockId);
                    return;
                }

                this.beginCanvasBlockDrag(root, blockElement, event);
            });

            blockElement.addEventListener('contextmenu', event => {
                const nearestBlockElement = event.target.closest('[data-frame-editor-canvas-block]');
                if (nearestBlockElement !== blockElement) {
                    return;
                }

                const blockId = blockElement.dataset.frameEditorCanvasBlock;
                if (!blockId) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                this.showBlockContextMenu(blockId, event.clientX, event.clientY, root);
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

                const openedWithKeyboard = event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10');
                if (openedWithKeyboard) {
                    const bounds = blockElement.getBoundingClientRect();
                    event.preventDefault();
                    this.showBlockContextMenu(blockId, bounds.left + (bounds.width / 2), bounds.top + (bounds.height / 2), root);
                    return;
                }

                const block = this.getBlockById(blockId);
                if (!block) {
                    return;
                }

                if (!this.isCanvasArrowNudgeKey(event.key)) {
                    return;
                }

                event.preventDefault();
                this.nudgeCanvasBlockByKeyboard(blockId, event.key, event.shiftKey ? 2 : 1, root);
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
                    return;
                }
                if (action === 'select-qr-code') {
                    const block = this.getSelectedBlock();
                    if (this.canSelectQrInnerBlock(block)) {
                        this.selectQrInnerBlock(block.id);
                    }
                    return;
                }
                if (action === 'deselect-qr-code') {
                    this.deselectQrInnerBlock();
                    return;
                }
                if (action === 'select-text') {
                    const block = this.getSelectedBlock();
                    if (this.canSelectTextInnerBlock(block)) {
                        this.selectTextInnerBlock(block.id);
                    }
                    return;
                }
                if (action === 'deselect-text') {
                    this.deselectTextInnerBlock();
                }
            });
        });

        root.querySelectorAll('[data-block-image-upload]').forEach(input => {
            input.addEventListener('change', event => {
                this.handleImageBlockUpload(root, event.currentTarget);
            });
        });

        root.querySelectorAll('[data-line-style-option]').forEach(button => {
            button.addEventListener('click', () => {
                const block = this.getSelectedBlock();
                if (!block || block.type !== 'line') {
                    return;
                }

                const lineStyle = button.dataset.lineStyleOption;
                if (!lineStyle) {
                    return;
                }

                this.updateBlock(block.id, this.normalizeLineBlockPatch(block, { lineStyle }));
                this.renderIntoRoot();
            });
        });

        const structureList = root.querySelector('[data-frame-editor-overview-list]');
        const structureSidebarPanel = root.querySelector('#frameEditorSidebarPanel');
        const getStructureInteractiveTarget = target => target instanceof Element
            ? target.closest('[data-frame-editor-overview-block], [data-frame-editor-overview-toggle], [data-frame-editor-overview-canvas], [data-frame-editor-overview-root-drop]')
            : null;
        root.querySelectorAll('[data-frame-editor-overview-toggle]').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                this.toggleStructureBlockCollapsed(button.dataset.frameEditorOverviewToggle);
            });
        });

        root.querySelectorAll('[data-frame-editor-overview-block]').forEach(button => {
            button.addEventListener('click', () => {
                const blockId = button.dataset.frameEditorOverviewBlock;
                if (!blockId || !this.getBlockById(blockId)) {
                    return;
                }

                this.state = {
                    ...this.state,
                    selectedBlockId: blockId,
                    selectedCanvas: false,
                    selectedQrBlockId: '',
                    selectedTextBlockId: ''
                };
                this.renderIntoRoot();
            });

            button.addEventListener('dragstart', event => {
                const blockId = button.dataset.frameEditorOverviewBlock;
                if (!blockId || !event.dataTransfer) {
                    event.preventDefault();
                    return;
                }

                this.structureDragBlockId = blockId;
                structureList?.classList.add('is-dragging');
                button.classList.add('is-dragging');
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/frame-editor-overview-block', blockId);
            });

            button.addEventListener('dragover', event => {
                const sourceBlockId = this.getDraggedStructureBlockId(event) || this.structureDragBlockId;
                const targetBlockId = button.dataset.frameEditorOverviewBlock;
                if (!sourceBlockId || !targetBlockId) {
                    return;
                }

                const placement = this.getStructureDropPlacement(button, event.clientY);
                if (!this.canDropStructureBlock(sourceBlockId, targetBlockId, placement)) {
                    this.clearStructureDropIndicators(root);
                    structureList?.classList.add('is-dragging');
                    root.querySelector?.(`[data-frame-editor-overview-block="${sourceBlockId}"]`)?.classList?.add('is-dragging');
                    return;
                }

                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
                this.applyStructureDropIndicator(button, placement, root);
            });

            button.addEventListener('drop', event => {
                const sourceBlockId = this.getDraggedStructureBlockId(event) || this.structureDragBlockId;
                const targetBlockId = button.dataset.frameEditorOverviewBlock;
                if (!sourceBlockId || !targetBlockId) {
                    return;
                }

                const placement = this.getStructureDropPlacement(button, event.clientY);
                if (!this.canDropStructureBlock(sourceBlockId, targetBlockId, placement)) {
                    return;
                }

                event.preventDefault();
                this.moveStructureBlock(sourceBlockId, targetBlockId, placement, root);
                this.clearStructureDropIndicators(root);
                this.structureDragBlockId = '';
            });

            button.addEventListener('dragend', () => {
                this.clearStructureDropIndicators(root);
                this.structureDragBlockId = '';
            });
        });

        root.querySelectorAll('[data-frame-editor-overview-canvas]').forEach(button => {
            button.addEventListener('click', () => {
                this.selectCanvas({ focusInspector: false });
            });

            button.addEventListener('dragover', event => {
                this.handleStructureRootDropDragOver(event, root, button);
            });

            button.addEventListener('drop', event => {
                this.handleStructureRootDrop(event, root);
            });
        });

        structureList?.addEventListener('dragover', event => {
            if (event.defaultPrevented) {
                return;
            }

            const interactiveTarget = getStructureInteractiveTarget(event.target);
            if (interactiveTarget) {
                return;
            }

            this.handleStructureRootDropDragOver(event, root);
        });

        structureList?.addEventListener('drop', event => {
            if (event.defaultPrevented) {
                return;
            }

            const interactiveTarget = getStructureInteractiveTarget(event.target);
            if (interactiveTarget) {
                return;
            }

            this.handleStructureRootDrop(event, root);
        });

        structureSidebarPanel?.addEventListener('dragover', event => {
            if (event.defaultPrevented) {
                return;
            }

            const interactiveTarget = getStructureInteractiveTarget(event.target);
            if (interactiveTarget) {
                return;
            }

            this.handleStructureRootDropDragOver(event, root);
        });

        structureSidebarPanel?.addEventListener('drop', event => {
            if (event.defaultPrevented) {
                return;
            }

            const interactiveTarget = getStructureInteractiveTarget(event.target);
            if (interactiveTarget) {
                return;
            }

            this.handleStructureRootDrop(event, root);
        });

        root.querySelectorAll('[data-frame-editor-overview-root-drop]').forEach(dropZone => {
            dropZone.addEventListener('dragover', event => {
                this.handleStructureRootDropDragOver(event, root, dropZone);
            });

            dropZone.addEventListener('drop', event => {
                this.handleStructureRootDrop(event, root);
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

        this.bindPanelResizeHandles(root);
    },

    bindPanelResizeHandles(root) {
        const layout = root?.querySelector('.frame-editor-layout');
        const leftPanel = root?.querySelector('.frame-editor-sidebar-panel');
        const rightPanel = root?.querySelector('.frame-editor-right-sidebar-panel');
        const hitArea = 10;

        const updateHoverState = (panel, side, event) => {
            if (!panel) {
                return;
            }
            const rect = panel.getBoundingClientRect();
            const isNearEdge = side === 'left'
                ? event.clientX >= (rect.right - hitArea)
                : event.clientX <= (rect.left + hitArea);
            panel.classList.toggle('is-resize-hover', isNearEdge);
        };

        const bindHandle = (panel, side) => {
            if (!panel) {
                return;
            }

            panel.addEventListener('pointermove', event => {
                if ((side === 'left' && this.isLeftSidebarCollapsed()) || (side === 'right' && this.state.isRightSidebarCollapsed)) {
                    panel.classList.remove('is-resize-hover');
                    return;
                }
                updateHoverState(panel, side, event);
            });

            panel.addEventListener('pointerleave', () => {
                panel.classList.remove('is-resize-hover');
            });

            panel.addEventListener('pointerdown', event => {
                if (event.button !== 0 || !layout) {
                    return;
                }

                const rect = panel.getBoundingClientRect();
                const isNearEdge = side === 'left'
                    ? event.clientX >= (rect.right - hitArea)
                    : event.clientX <= (rect.left + hitArea);
                if (!isNearEdge) {
                    return;
                }

                this.beginPanelResize(root, layout, panel, side, event);
            });
        };

        bindHandle(leftPanel, 'left');
        bindHandle(rightPanel, 'right');
    },

    beginPanelResize(root, layout, panel, side, event) {
        if (!root || !layout || !panel) {
            return;
        }

        event.preventDefault();

        const isLeft = side === 'left';
        const layoutRect = layout.getBoundingClientRect();
        const layoutStyles = getComputedStyle(layout);
        const startLeft = parseFloat(layoutStyles.getPropertyValue('--left-sidebar-width'))
            || root.querySelector('.frame-editor-sidebar-panel')?.clientWidth
            || Number(this.state.leftSidebarWidth || 340);
        const startRight = parseFloat(layoutStyles.getPropertyValue('--right-sidebar-width'))
            || root.querySelector('.frame-editor-right-sidebar-panel')?.clientWidth
            || Number(this.state.rightSidebarWidth || 320);
        const minMainWidth = 220;
        const minSidebarWidth = 220;
        const startX = event.clientX;
        const bodyStyle = document.body.style;
        const previousCursor = bodyStyle.cursor;
        const previousUserSelect = bodyStyle.userSelect;

        panel.classList.add('is-resizing');
        bodyStyle.cursor = 'col-resize';
        bodyStyle.userSelect = 'none';

        const onPointerMove = moveEvent => {
            const deltaX = moveEvent.clientX - startX;
            if (isLeft) {
                const maxLeft = Math.max(minSidebarWidth, layoutRect.width - startRight - minMainWidth);
                const nextLeft = Math.round(this.clamp(startLeft + deltaX, minSidebarWidth, maxLeft));
                layout.style.setProperty('--left-sidebar-width', `${nextLeft}px`);
            } else {
                const maxRight = Math.max(minSidebarWidth, layoutRect.width - startLeft - minMainWidth);
                const nextRight = Math.round(this.clamp(startRight - deltaX, minSidebarWidth, maxRight));
                layout.style.setProperty('--right-sidebar-width', `${nextRight}px`);
            }
        };

        const finish = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', finish);
            window.removeEventListener('pointercancel', finish);
            panel.classList.remove('is-resizing');
            panel.classList.remove('is-resize-hover');
            bodyStyle.cursor = previousCursor;
            bodyStyle.userSelect = previousUserSelect;

            const finalStyles = getComputedStyle(layout);
            const finalLeft = parseFloat(finalStyles.getPropertyValue('--left-sidebar-width'))
                || root.querySelector('.frame-editor-sidebar-panel')?.clientWidth
                || Number(this.state.leftSidebarWidth || 340);
            const finalRight = parseFloat(finalStyles.getPropertyValue('--right-sidebar-width'))
                || root.querySelector('.frame-editor-right-sidebar-panel')?.clientWidth
                || Number(this.state.rightSidebarWidth || 320);

            this.state = {
                ...this.state,
                leftSidebarWidth: Math.round(finalLeft),
                rightSidebarWidth: Math.round(finalRight)
            };
            this.renderIntoRoot();
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', finish);
        window.addEventListener('pointercancel', finish);
    },

    beginCanvasBlockDrag(root, blockElement, event, options = {}) {
        if (event.button !== 0) {
            return;
        }

        const blockId = blockElement.dataset.frameEditorCanvasBlock;
        const block = this.getBlockById(blockId);
        const canvasScroll = root.querySelector('[data-frame-editor-canvas-scroll]');
        if (!block || !canvasScroll) {
            return;
        }

        const parentBlock = this.getParentBlock(block);
        const canDragWithinParent = parentBlock && (!this.isContainerBlock(parentBlock) || this.usesFreePositionedChildren(parentBlock));

        if (block.parentId && !canDragWithinParent) {
            event.preventDefault();
            this.selectBlock(blockId);
            if (typeof options.onClick === 'function') {
                options.onClick();
            }
            return;
        }

        event.preventDefault();

        const startPointer = {
            x: event.clientX,
            y: event.clientY
        };
        const startPosition = canDragWithinParent
            ? this.getResolvedNestedBlockPosition(parentBlock, block)
            : {
                xPct: block.xPct,
                yPct: block.yPct
            };
        let nextPosition = { ...startPosition };
        let didMove = false;
        const dragFootprint = this.getCanvasBlockFootprint(block, blockElement);
        const parentLayout = canDragWithinParent
            ? this.getCanvasBlockLayout(parentBlock)
            : null;
        const parentFrame = canDragWithinParent
            ? this.getContainerBlockInnerFrame(parentBlock, parentLayout)
            : null;
        const parentRotationRadians = canDragWithinParent
            ? ((this.getCanvasBlockSceneRotation(parentBlock) * Math.PI) / 180)
            : 0;

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

            if (canDragWithinParent && parentFrame) {
                const zoom = Math.max(this.state.canvasZoom, 0.01);
                const localDeltaX = ((deltaX / zoom) * Math.cos(parentRotationRadians))
                    + ((deltaY / zoom) * Math.sin(parentRotationRadians));
                const localDeltaY = (-(deltaX / zoom) * Math.sin(parentRotationRadians))
                    + ((deltaY / zoom) * Math.cos(parentRotationRadians));

                nextPosition = this.clampNestedBlockPosition(
                    parentBlock,
                    block,
                    {
                        xPct: startPosition.xPct + ((localDeltaX / Math.max(parentFrame.width, 1)) * 100),
                        yPct: startPosition.yPct + ((localDeltaY / Math.max(parentFrame.height, 1)) * 100)
                    },
                    parentLayout,
                    dragFootprint
                );
                blockElement.style.left = `${parentFrame.left + (parentFrame.width * (nextPosition.xPct / 100))}px`;
                blockElement.style.top = `${parentFrame.top + (parentFrame.height * (nextPosition.yPct / 100))}px`;
                return;
            }

            nextPosition = this.clampCanvasBlockPosition(
                root,
                block,
                {
                    xPct: startPosition.xPct + (((deltaX / this.state.canvasZoom) / Math.max(canvasScroll.clientWidth, 1)) * 100),
                    yPct: startPosition.yPct + (((deltaY / this.state.canvasZoom) / Math.max(canvasScroll.clientHeight, 1)) * 100)
                },
                null,
                dragFootprint
            );
            blockElement.style.left = `${nextPosition.xPct}%`;
            blockElement.style.top = `${nextPosition.yPct}%`;
        };

        const finishDrag = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            blockElement.classList.remove('dragging');

            if (didMove) {
                const patch = canDragWithinParent
                    ? {
                        ...nextPosition,
                        nestedPositionMode: 'manual'
                    }
                    : nextPosition;
                this.updateBlock(blockId, patch);
                this.syncInspectorBlockControls(root, patch);
                this.selectBlock(blockId);
                return;
            }

            if (typeof options.onClick === 'function') {
                options.onClick();
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
            if (previewBlock.type === 'qr') {
                this.syncQrBlockPreview(blockElement, previewBlock);
            } else {
                this.syncTextBlockPreview(blockElement, previewBlock);
            }
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
            const updatedBlock = this.getBlockById(block.id);
            this.syncCanvasBlock(root, updatedBlock);
            this.clampUpdatedBlockToCanvas(root, updatedBlock);
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
        if (!handle || !blockElement || !block || !canvasScroll || !metrics || !this.canUseVisualResize(block)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const zoom = Math.max(this.state.canvasZoom, 0.01);
        const parentBlock = this.getParentBlock(block);
        const canResizeWithinParent = parentBlock && this.canUseParentPositionControl(block, parentBlock);
        const parentLayout = canResizeWithinParent ? this.getCanvasBlockLayout(parentBlock) : null;
        const parentFrame = canResizeWithinParent ? this.getContainerBlockInnerFrame(parentBlock, parentLayout) : null;
        const surfaceElement = blockElement.querySelector('.frame-editor-text-block-surface, .frame-editor-generic-component-surface, .frame-editor-shape-block-surface, .frame-editor-image-block-surface, .frame-editor-line-block-surface, .frame-editor-container-block-surface, .frame-editor-qr-block-surface') || blockElement;
        const surfaceRect = surfaceElement.getBoundingClientRect();
        const startOuterWidth = surfaceRect.width / zoom;
        const startOuterHeight = surfaceRect.height / zoom;
        const qrPadding = block.type === 'qr'
            ? this.getQrBlockPadding(block)
            : null;
        const borderWidth = Math.max(0, Number(block.borderWidth) || 0);
        const startCenter = canResizeWithinParent && parentFrame
            ? {
                x: parentFrame.left + (parentFrame.width * ((Number(block.xPct) || 50) / 100)),
                y: parentFrame.top + (parentFrame.height * ((Number(block.yPct) || 50) / 100))
            }
            : {
                x: (block.xPct / 100) * metrics.viewportWidth,
                y: (block.yPct / 100) * metrics.viewportHeight
            };
        const startEdges = {
            left: startCenter.x - (startOuterWidth / 2),
            right: startCenter.x + (startOuterWidth / 2),
            top: startCenter.y - (startOuterHeight / 2),
            bottom: startCenter.y + (startOuterHeight / 2)
        };
        const minimumSize = this.getVisualResizeMinimumSize(block, borderWidth, qrPadding);
        const minOuterWidth = minimumSize.width;
        const minOuterHeight = minimumSize.height;
        let didResize = false;
        let nextPatch = null;
        let nextPosition = {
            xPct: block.xPct,
            yPct: block.yPct
        };
        let previewFrame = 0;
        let pendingPreviewBlock = null;

        const applyPreview = () => {
            previewFrame = 0;
            if (!pendingPreviewBlock) {
                return;
            }

            const previewBlock = pendingPreviewBlock;
            pendingPreviewBlock = null;
            const layout = this.getCanvasBlockLayout(previewBlock);
            if (canResizeWithinParent && parentFrame) {
                blockElement.style.left = `${parentFrame.left + (parentFrame.width * ((Number(previewBlock.xPct) || 50) / 100))}px`;
                blockElement.style.top = `${parentFrame.top + (parentFrame.height * ((Number(previewBlock.yPct) || 50) / 100))}px`;
            } else {
                blockElement.style.left = `${previewBlock.xPct}%`;
                blockElement.style.top = `${previewBlock.yPct}%`;
            }
            blockElement.style.width = `${layout.width}px`;
            blockElement.style.transform = this.getCanvasBlockTransform(previewBlock.rotation);
            if (previewBlock.type === 'qr') {
                this.syncQrBlockPreview(blockElement, previewBlock);
            } else if (previewBlock.type === 'text') {
                this.syncTextBlockPreview(blockElement, previewBlock);
            } else if (this.isGenericComponentBlock(previewBlock)) {
                this.syncGenericComponentPreview(blockElement, previewBlock);
            } else if (!this.syncShapeImageBlockPreview(blockElement, previewBlock)) {
                blockElement.innerHTML = this.renderCanvasBlockInner(previewBlock);
            }
            this.syncInspectorBlockControls(root, nextPatch);
        };

        const schedulePreview = previewBlock => {
            pendingPreviewBlock = previewBlock;
            if (previewFrame) {
                return;
            }
            previewFrame = window.requestAnimationFrame(applyPreview);
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

            nextPatch = block.type === 'image'
                ? {
                    width: Math.max(48, Math.round(outerWidth - (borderWidth * 2))),
                    height: Math.max(48, Math.round(outerHeight - (borderWidth * 2)))
                }
                : block.type === 'qr'
                    ? {
                        size: Math.max(
                            80,
                            Math.round(
                                (handle === 'left' || handle === 'right')
                                    ? (outerWidth - (borderWidth * 2) - (qrPadding?.left || 0) - (qrPadding?.right || 0))
                                    : ((handle === 'top' || handle === 'bottom')
                                        ? (outerHeight - (borderWidth * 2) - (qrPadding?.top || 0) - (qrPadding?.bottom || 0))
                                        : Math.min(
                                            outerWidth - (borderWidth * 2) - (qrPadding?.left || 0) - (qrPadding?.right || 0),
                                            outerHeight - (borderWidth * 2) - (qrPadding?.top || 0) - (qrPadding?.bottom || 0)
                                        ))
                            )
                        )
                    }
                    : block.type === 'line'
                        ? {
                            width: Math.max(24, Math.round(outerWidth)),
                            height: Math.max(2, Math.round(outerHeight))
                        }
                        : (block.type === 'section' || block.type === 'columns')
                            ? {
                                width: Math.max(minOuterWidth, Math.round(outerWidth)),
                                height: Math.max(minOuterHeight, Math.round(outerHeight))
                            }
                            : {
                                width: Math.max(48, Math.round(outerWidth)),
                                height: Math.max(48, Math.round(outerHeight))
                            };

            let resolvedOuterWidth = outerWidth;
            let resolvedOuterHeight = outerHeight;

            if (block.type === 'line' || block.type === 'qr') {
                nextPatch = this.normalizeLineBlockPatch(block, nextPatch);
                if (block.type === 'qr') {
                    resolvedOuterWidth = nextPatch.size + (borderWidth * 2) + (qrPadding?.left || 0) + (qrPadding?.right || 0);
                    resolvedOuterHeight = nextPatch.size + (borderWidth * 2) + (qrPadding?.top || 0) + (qrPadding?.bottom || 0);
                } else {
                    resolvedOuterWidth = nextPatch.width;
                    resolvedOuterHeight = nextPatch.height;
                }

                const provisionalCenterX = nextLeft + (outerWidth / 2);
                const provisionalCenterY = nextTop + (outerHeight / 2);

                if (handle.includes('left') && !handle.includes('right')) {
                    nextLeft = nextRight - resolvedOuterWidth;
                } else if (handle.includes('right') && !handle.includes('left')) {
                    nextRight = nextLeft + resolvedOuterWidth;
                } else {
                    nextLeft = provisionalCenterX - (resolvedOuterWidth / 2);
                    nextRight = provisionalCenterX + (resolvedOuterWidth / 2);
                }

                if (handle.includes('top') && !handle.includes('bottom')) {
                    nextTop = nextBottom - resolvedOuterHeight;
                } else if (handle.includes('bottom') && !handle.includes('top')) {
                    nextBottom = nextTop + resolvedOuterHeight;
                } else {
                    nextTop = provisionalCenterY - (resolvedOuterHeight / 2);
                    nextBottom = provisionalCenterY + (resolvedOuterHeight / 2);
                }
            }

            const centerX = nextLeft + (resolvedOuterWidth / 2);
            const centerY = nextTop + (resolvedOuterHeight / 2);

            nextPosition = canResizeWithinParent && parentFrame
                ? this.clampNestedBlockPosition(
                    parentBlock,
                    block,
                    {
                        xPct: Number((((centerX - parentFrame.left) / Math.max(parentFrame.width, 1)) * 100).toFixed(4)),
                        yPct: Number((((centerY - parentFrame.top) / Math.max(parentFrame.height, 1)) * 100).toFixed(4))
                    },
                    parentLayout,
                    { width: resolvedOuterWidth, height: resolvedOuterHeight }
                )
                : {
                    xPct: Number(((centerX / metrics.viewportWidth) * 100).toFixed(4)),
                    yPct: Number(((centerY / metrics.viewportHeight) * 100).toFixed(4))
                };

            schedulePreview({
                ...block,
                ...nextPatch,
                ...nextPosition
            });
        };

        const finishResize = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            blockElement.classList.remove('is-resizing');
            if (previewFrame) {
                window.cancelAnimationFrame(previewFrame);
                applyPreview();
            }

            if (!didResize || !nextPatch) {
                return;
            }

            this.updateBlock(block.id, {
                ...nextPatch,
                ...nextPosition,
                ...(canResizeWithinParent ? { nestedPositionMode: 'manual' } : {})
            });
            const updatedBlock = this.getBlockById(block.id);
            this.syncCanvasBlock(root, updatedBlock);
            this.clampUpdatedBlockToCanvas(root, updatedBlock);
        };

        const onPointerUp = () => {
            finishResize();
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    },

    beginQrBlockResize(root, handleElement, event) {
        if (event.button !== 0) {
            return;
        }

        const handle = handleElement.dataset.frameEditorQrResizeHandle;
        const blockElement = handleElement.closest('[data-frame-editor-canvas-block]');
        const blockId = blockElement?.dataset.frameEditorCanvasBlock;
        const block = this.getBlockById(blockId);
        if (!handle || !blockElement || !block || block.type !== 'qr') {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const zoom = Math.max(this.state.canvasZoom, 0.01);
        let didResize = false;
        let nextPatch = null;

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

            nextPatch = this.getQrBlockResizePatch(block, handle, deltaX, deltaY);
            const previewBlock = {
                ...block,
                ...nextPatch
            };

            if (!this.syncQrBlockPreview(blockElement, previewBlock)) {
                blockElement.innerHTML = this.renderCanvasBlockInner(previewBlock);
            }
            this.syncInspectorBlockControls(root, nextPatch);
        };

        const finishResize = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            blockElement.classList.remove('is-resizing');

            if (!didResize || !nextPatch) {
                return;
            }

            this.updateBlock(block.id, nextPatch);
            const updatedBlock = this.getBlockById(block.id);
            this.syncCanvasBlock(root, updatedBlock);
        };

        const onPointerUp = () => {
            finishResize();
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    },

    beginQrBlockReposition(root, blockElement, event) {
        if (event.button !== 0) {
            return;
        }

        const blockId = blockElement?.dataset.frameEditorCanvasBlock;
        const block = this.getBlockById(blockId);
        if (!blockElement || !this.isQrInnerSelected(block)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const startPointer = {
            x: event.clientX,
            y: event.clientY
        };
        let nextPatch = null;
        let didMove = false;

        const onPointerMove = moveEvent => {
            const deltaX = (moveEvent.clientX - startPointer.x) / Math.max(this.state.canvasZoom, 0.01);
            const deltaY = (moveEvent.clientY - startPointer.y) / Math.max(this.state.canvasZoom, 0.01);

            if (!didMove && Math.hypot(deltaX, deltaY) >= 4) {
                didMove = true;
                blockElement.classList.add('is-repositioning');
            }

            if (!didMove) {
                return;
            }

            nextPatch = this.getQrBlockRepositionPatch(block, deltaX, deltaY);
            const previewBlock = {
                ...block,
                ...nextPatch
            };

            this.syncQrBlockPreview(blockElement, previewBlock);
            this.syncInspectorBlockControls(root, nextPatch);
        };

        const finishReposition = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            blockElement.classList.remove('is-repositioning');

            if (!didMove || !nextPatch) {
                return;
            }

            this.updateBlock(block.id, nextPatch);
            const updatedBlock = this.getBlockById(block.id);
            this.syncCanvasBlock(root, updatedBlock);
        };

        const onPointerUp = () => {
            finishReposition();
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    },

    beginTextBlockReposition(root, blockElement, event) {
        if (event.button !== 0) {
            return;
        }

        const blockId = blockElement?.dataset.frameEditorCanvasBlock;
        const block = this.getBlockById(blockId);
        if (!blockElement || !this.isTextInnerSelected(block)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const startPointer = {
            x: event.clientX,
            y: event.clientY
        };
        let nextPatch = null;
        let didMove = false;

        const onPointerMove = moveEvent => {
            const deltaX = (moveEvent.clientX - startPointer.x) / Math.max(this.state.canvasZoom, 0.01);
            const deltaY = (moveEvent.clientY - startPointer.y) / Math.max(this.state.canvasZoom, 0.01);

            if (!didMove && Math.hypot(deltaX, deltaY) >= 4) {
                didMove = true;
                blockElement.classList.add('is-repositioning');
            }

            if (!didMove) {
                return;
            }

            nextPatch = this.getTextBlockRepositionPatch(block, deltaX, deltaY);
            nextPatch = {
                ...nextPatch,
                ...this.getTextBlockPositionPatchFromPadding(this.getTextBlockPadding({
                    ...block,
                    ...nextPatch
                }))
            };
            nextPatch.textAlign = nextPatch.textPositionX === 'custom'
                ? (block.textAlign || 'left')
                : (nextPatch.textPositionX === 'center'
                    ? 'center'
                    : (nextPatch.textPositionX === 'right' ? 'right' : 'left'));

            const previewBlock = {
                ...block,
                ...nextPatch
            };

            this.syncTextBlockPreview(blockElement, previewBlock);
            this.syncInspectorBlockControls(root, nextPatch);
        };

        const finishReposition = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            blockElement.classList.remove('is-repositioning');

            if (!didMove || !nextPatch) {
                return;
            }

            this.updateBlock(block.id, nextPatch);
            const updatedBlock = this.getBlockById(block.id);
            this.syncCanvasBlock(root, updatedBlock);
        };

        const onPointerUp = () => {
            finishReposition();
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    },

    beginQrBlockRotate(root, handleElement, event) {
        if (event.button !== 0) {
            return;
        }

        const blockElement = handleElement.closest('[data-frame-editor-canvas-block]');
        const blockId = blockElement?.dataset.frameEditorCanvasBlock;
        const block = this.getBlockById(blockId);
        if (!blockElement || !block || block.type !== 'qr') {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const qrContentElement = () => blockElement.querySelector('[data-frame-editor-qr-content]') || blockElement;
        const getCenterPoint = () => {
            const rect = qrContentElement().getBoundingClientRect();
            return {
                x: rect.left + (rect.width / 2),
                y: rect.top + (rect.height / 2)
            };
        };
        const getPointerAngle = moveEvent => {
            const center = getCenterPoint();
            return Math.atan2(moveEvent.clientY - center.y, moveEvent.clientX - center.x) * (180 / Math.PI);
        };

        const startRotation = this.getQrBlockRotation(block);
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

            const qrContent = qrContentElement();
            if (qrContent) {
                qrContent.style.transform = `rotate(${nextRotation}deg)`;
            }
            this.syncInspectorBlockControls(root, {
                qrRotation: nextRotation
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
                qrRotation: nextRotation
            });
            this.renderIntoRoot();
            this.selectQrInnerBlock(block.id);
        };

        const onPointerUp = () => {
            finishRotate();
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

        const surfaceElement = () => blockElement.querySelector('.frame-editor-text-block-surface, .frame-editor-generic-component-surface, .frame-editor-qr-block-surface, .frame-editor-shape-block-surface, .frame-editor-image-block-surface, .frame-editor-line-block-surface') || blockElement;
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
        let previewFrame = 0;

        const applyRotationPreview = () => {
            previewFrame = 0;
            blockElement.style.transform = this.getCanvasBlockTransform(nextRotation);
            this.syncInspectorBlockControls(root, {
                rotation: nextRotation
            });
        };

        const scheduleRotationPreview = () => {
            if (previewFrame) {
                return;
            }
            previewFrame = window.requestAnimationFrame(applyRotationPreview);
        };

        const onPointerMove = moveEvent => {
            const currentAngle = getPointerAngle(moveEvent);
            nextRotation = this.normalizeBlockRotation(startRotation + (currentAngle - startAngle));
            if (!didRotate && Math.abs(nextRotation - startRotation) >= 1) {
                didRotate = true;
                blockElement.classList.add('is-rotating');
            }

            scheduleRotationPreview();
        };

        const finishRotate = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
            blockElement.classList.remove('is-rotating');
            if (previewFrame) {
                window.cancelAnimationFrame(previewFrame);
                applyRotationPreview();
            }

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
            const sideLimits = this.getTextBlockPaddingLimits(root, block, nextPadding);
            const nextValue = this.clamp(padding[side] + actualDelta, 0, sideLimits[side]);
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

        const patch = this.buildBlockPaddingPatch(block, nextPadding);
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

    getInnerBlockRepositionPadding(block, deltaX, deltaY) {
        const padding = this.getTextBlockPadding(block);
        const rotationRadians = this.getBlockRotation(block) * (Math.PI / 180);
        const cosine = Math.cos(rotationRadians);
        const sine = Math.sin(rotationRadians);
        const localDeltaX = (deltaX * cosine) + (deltaY * sine);
        const localDeltaY = (-deltaX * sine) + (deltaY * cosine);
        const totalHorizontalPadding = padding.left + padding.right;
        const totalVerticalPadding = padding.top + padding.bottom;

        const nextPadding = {
            left: this.clamp(padding.left + localDeltaX, 0, totalHorizontalPadding),
            right: 0,
            top: this.clamp(padding.top + localDeltaY, 0, totalVerticalPadding),
            bottom: 0
        };
        nextPadding.right = Math.max(0, totalHorizontalPadding - nextPadding.left);
        nextPadding.bottom = Math.max(0, totalVerticalPadding - nextPadding.top);
        return nextPadding;
    },

    getTextBlockRepositionPatch(block, deltaX, deltaY) {
        const nextPadding = this.getInnerBlockRepositionPadding(block, deltaX, deltaY);
        return {
            paddingLinked: false,
            ...this.buildBlockPaddingPatch(block, nextPadding)
        };
    },

    getQrBlockRepositionPatch(block, deltaX, deltaY) {
        const nextPadding = this.getInnerBlockRepositionPadding(block, deltaX, deltaY);
        return {
            paddingLinked: false,
            ...this.buildTextBlockPaddingPatch(nextPadding)
        };
    },

    getQrBlockResizePatch(block, handle, deltaX, deltaY) {
        const padding = this.getTextBlockPadding(block);
        const size = this.getQrBlockSize(block);
        const rotationRadians = this.getBlockRotation(block) * (Math.PI / 180);
        const cosine = Math.cos(rotationRadians);
        const sine = Math.sin(rotationRadians);
        const localDeltaX = (deltaX * cosine) + (deltaY * sine);
        const localDeltaY = (-deltaX * sine) + (deltaY * cosine);
        const rawSizeDelta = this.getQrBlockRawResizeDelta(handle, localDeltaX, localDeltaY);
        const limits = this.getQrBlockResizeLimits(padding, handle, size);
        const sizeDelta = this.clamp(
            rawSizeDelta,
            -limits.maxShrink,
            limits.maxGrow
        );
        const nextPadding = this.getQrBlockResizePadding(padding, handle, sizeDelta);

        return {
            size: Number((size + sizeDelta).toFixed(2)),
            paddingLinked: false,
            ...this.buildTextBlockPaddingPatch(nextPadding)
        };
    },

    getQrBlockRawResizeDelta(handle, localDeltaX, localDeltaY) {
        const sizeDeltas = {
            left: -localDeltaX,
            right: localDeltaX,
            top: -localDeltaY,
            bottom: localDeltaY,
            'top-left': -Math.max(localDeltaX, localDeltaY),
            'top-right': Math.max(localDeltaX, -localDeltaY),
            'bottom-right': Math.max(localDeltaX, localDeltaY),
            'bottom-left': Math.max(-localDeltaX, localDeltaY)
        };

        return Number(sizeDeltas[handle]) || 0;
    },

    getQrBlockResizeLimits(padding, handle, size) {
        const minSize = 80;
        const shrinkLimit = Math.max(0, size - minSize);

        if (handle === 'left' || handle === 'right') {
            const side = handle;
            return {
                maxGrow: Math.max(0, padding[side]),
                maxShrink: shrinkLimit
            };
        }

        if (handle === 'top' || handle === 'bottom') {
            const side = handle;
            return {
                maxGrow: Math.max(0, padding[side]),
                maxShrink: shrinkLimit
            };
        }

        const [verticalSide, horizontalSide] = handle.split('-');
        return {
            maxGrow: Math.max(0, Math.min(padding[verticalSide], padding[horizontalSide])),
            maxShrink: shrinkLimit
        };
    },

    getQrBlockResizePadding(padding, handle, sizeDelta) {
        const nextPadding = { ...padding };

        if (handle === 'left' || handle === 'right') {
            nextPadding[handle] = padding[handle] - sizeDelta;
        } else if (handle === 'top' || handle === 'bottom') {
            nextPadding[handle] = padding[handle] - sizeDelta;
        } else {
            const [verticalSide, horizontalSide] = handle.split('-');
            nextPadding[verticalSide] = padding[verticalSide] - sizeDelta;
            nextPadding[horizontalSide] = padding[horizontalSide] - sizeDelta;
        }

        return {
            top: Number(Math.max(0, nextPadding.top).toFixed(2)),
            right: Number(Math.max(0, nextPadding.right).toFixed(2)),
            bottom: Number(Math.max(0, nextPadding.bottom).toFixed(2)),
            left: Number(Math.max(0, nextPadding.left).toFixed(2))
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

        if (setting === 'appearanceOption') {
            const optionControls = Array.from(root.querySelectorAll('[data-block-setting="appearanceOption"]'));
            const selectedTokens = optionControls.filter(c => Boolean(c.checked)).map(c => String(c.dataset.blockValue || '').trim()).filter(Boolean);
            const patch = this.getTextBlockAppearancePatchFromTokens(selectedTokens);
            this.updateBlock(block.id, patch);
            this.syncInspectorBlockControls(root, patch);
            const updatedBlock = this.getBlockById(block.id);
            this.syncCanvasBlock(root, updatedBlock);
            this.clampUpdatedBlockToCanvas(root, updatedBlock);
            return;
        }

        if (setting === 'textPositionX' || setting === 'textPositionY') {
            const patch = this.getTextBlockInnerAlignmentPatch(block, setting, control.value);
            this.updateBlock(block.id, patch);
            this.syncInspectorBlockControls(root, patch);
            const updatedPositionBlock = this.getBlockById(block.id);
            this.syncCanvasBlock(root, updatedPositionBlock);
            this.clampUpdatedBlockToCanvas(root, updatedPositionBlock);
            return;
        }

        if (setting === 'textAlignCombined') {
            const value = String(control.value || '').trim().toLowerCase();
            if (value === 'custom') {
                const patch = { textPositionX: 'custom', textPositionY: 'custom' };
                this.updateBlock(block.id, patch);
                this.syncInspectorBlockControls(root, patch);
                const updatedBlock = this.getBlockById(block.id);
                this.syncCanvasBlock(root, updatedBlock);
                this.clampUpdatedBlockToCanvas(root, updatedBlock);
                return;
            }

            let [y, x] = value.split('-');
            if (!x) {
                if (['left', 'center', 'right'].includes(y)) {
                    x = y;
                    y = this.getTextBlockPositionY(block) || 'center';
                } else if (['top', 'center', 'bottom'].includes(y)) {
                    x = this.getTextBlockPositionX(block) || 'center';
                } else {
                    x = this.getTextBlockPositionX(block) || 'center';
                    y = this.getTextBlockPositionY(block) || 'center';
                }
            }

            x = ['left', 'center', 'right'].includes(x) ? x : 'center';
            y = ['top', 'center', 'bottom'].includes(y) ? y : 'center';

            const patchX = this.getTextBlockInnerAlignmentPatch(block, 'textPositionX', x);
            const blockAfterX = {
                ...block,
                ...patchX
            };
            const patchY = this.getTextBlockInnerAlignmentPatch(blockAfterX, 'textPositionY', y);
            const patch = {
                ...patchX,
                ...patchY,
                textAlign: x === 'center'
                    ? 'center'
                    : (x === 'right' ? 'right' : 'left')
            };

            this.updateBlock(block.id, patch);
            this.syncInspectorBlockControls(root, patch);
            const updatedBlock = this.getBlockById(block.id);
            this.syncCanvasBlock(root, updatedBlock);
            this.clampUpdatedBlockToCanvas(root, updatedBlock);
            return;
        }

        if (setting === 'parentPositionCombined') {
            const patch = this.getParentPositionPatch(block, control.value);
            this.updateBlock(block.id, patch);
            this.syncInspectorBlockControls(root, patch);
            const updatedBlock = this.getBlockById(block.id);
            this.syncCanvasBlock(root, updatedBlock);
            this.clampUpdatedBlockToCanvas(root, updatedBlock);
            return;
        }

        if (setting === 'align') {
            const patch = this.getBlockAlignPatch(block, control.value, root);
            this.updateBlock(block.id, patch);
            this.syncInspectorBlockControls(root, patch);
            this.renderIntoRoot();
            this.clampUpdatedBlockToCanvas(this.getRoot(), this.getBlockById(block.id));
            return;
        }

        const numericSettings = new Set(['fontSize', 'fontWeight', 'width', 'height', 'size', 'lineHeight', 'letterSpacing', 'paddingX', 'paddingY', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderWidth', 'borderRadius', 'rotation', 'qrRotation', 'childGap', 'columnCount', 'columnGap', 'xPct', 'yPct', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'opacity', 'min', 'max', 'value', 'tag', 'calloutLength', 'calloutWidth']);
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

        if (setting === 'rotation' || setting === 'qrRotation') {
            nextValue = this.normalizeBlockRotation(nextValue);
        } else if (setting === 'xPct' || setting === 'yPct') {
            nextValue = this.clamp(nextValue, 0, 100);
        } else if (setting === 'width') {
            nextValue = this.clamp(
                nextValue,
                block.type === 'line'
                    ? 24
                    : (block.type === 'section'
                        ? 220
                        : (block.type === 'columns' ? 280 : 48)),
                this.getCanvasMeasurementMax('width', root)
            );
        } else if (setting === 'height') {
            nextValue = this.clamp(
                nextValue,
                block.type === 'line'
                    ? 2
                    : (block.type === 'section'
                        ? 160
                        : (block.type === 'columns' ? 180 : 48)),
                this.getCanvasMeasurementMax('height', root)
            );
        } else if (setting === 'size') {
            nextValue = this.clamp(nextValue, 80, this.getCanvasMeasurementMax('size', root));
        } else if (setting === 'opacity') {
            nextValue = this.clamp(nextValue, 0, 1);
        } else if (setting === 'tag') {
            nextValue = Math.max(0, Math.round(nextValue));
        } else if (setting === 'childGap') {
            nextValue = this.clamp(nextValue, 0, 2000);
        } else if (setting === 'columnCount') {
            nextValue = this.clamp(Math.round(nextValue), 2, 6);
        } else if (setting === 'columnGap') {
            nextValue = this.clamp(nextValue, 0, 2000);
        } else if (['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].includes(setting)) {
            nextValue = this.clamp(nextValue, 0, 2000);
        } else if (['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'paddingX', 'paddingY'].includes(setting)) {
            nextValue = this.clamp(nextValue, 0, 2000);
        }

        let patch = setting === 'backgroundColorRaw'
            ? { backgroundColor: nextValue }
            : (this.getMirroredTextBlockPaddingPatch(block, setting, nextValue, root) || { [setting]: nextValue });

        if (block.type === 'line') {
            patch = this.normalizeLineBlockPatch(block, patch);
        }

        if ((setting === 'xPct' || setting === 'yPct') && this.hasLayoutAlign(block)) {
            patch.align = 'none';
        } else if (this.hasLayoutAlign(block) && ['width', 'height', 'size', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft'].includes(setting)) {
            const alignedBlock = {
                ...block,
                ...patch
            };
            patch = {
                ...patch,
                ...this.getBlockAlignPatch(alignedBlock, alignedBlock.align, root)
            };
        }

        this.updateBlock(block.id, patch);
        this.syncInspectorBlockControls(root, patch);
        const updatedBlock = this.getBlockById(block.id);
        this.syncCanvasBlock(root, updatedBlock);
        this.clampUpdatedBlockToCanvas(root, updatedBlock);
    },

    getCombinedTextAlignSelected(block) {
        if (!block) {
            return 'center';
        }

        const explicitX = String(block?.textPositionX || '').trim().toLowerCase();
        const explicitY = String(block?.textPositionY || '').trim().toLowerCase();
        if (explicitX === 'custom' || explicitY === 'custom') {
            return 'custom';
        }

        const x = this.getTextBlockPositionX(block) || 'center';
        const y = this.getTextBlockPositionY(block) || 'center';
        if (x === 'custom' || y === 'custom') {
            return 'custom';
        }
        return `${y}-${x}`;
    },

    handleImageBlockUpload(root, input) {
        const block = this.getSelectedBlock();
        const file = input?.files?.[0];
        if (!block || (block.type !== 'image' && this.getComponentClassName(block) !== 'TImageControl') || !file || !String(file.type || '').startsWith('image/')) {
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
                const nextSize = this.getImageUploadDimensions(previewImage.naturalWidth, previewImage.naturalHeight, this.getRoot());
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

    getImageUploadDimensions(naturalWidth, naturalHeight, root = this.getRoot()) {
        if (!Number.isFinite(naturalWidth) || !Number.isFinite(naturalHeight) || naturalWidth <= 0 || naturalHeight <= 0) {
            return {
                width: 180,
                height: 180
            };
        }

        const longestSide = Math.max(naturalWidth, naturalHeight);
        const targetLongestSide = this.clamp(longestSide, 120, this.getCanvasMeasurementMax('size', root));
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

        const selectedBlock = this.getSelectedBlock();
        patchEntries.forEach(([setting, value]) => {
            root.querySelectorAll(`[data-block-setting="${setting}"]`).forEach(control => {
                if (control === document.activeElement) {
                    return;
                }

                if (control.type === 'checkbox') {
                    control.checked = Boolean(value);
                    return;
                }

                control.value = String(value);
            });
        });

        if (selectedBlock) {
            const mergedBlock = {
                ...selectedBlock,
                ...patch
            };

            root.querySelectorAll('[data-block-setting="parentPositionCombined"]').forEach(control => {
                if (control === document.activeElement) {
                    return;
                }

                control.value = this.getCombinedParentPositionSelected(mergedBlock);
            });
        }

        if (selectedBlock?.type === 'text') {
            const mergedBlock = {
                ...selectedBlock,
                ...patch
            };
            const combinedValue = this.getCombinedTextAlignSelected(mergedBlock);
            root.querySelectorAll('[data-block-setting="textAlignCombined"]').forEach(control => {
                if (control === document.activeElement) {
                    return;
                }

                control.value = combinedValue;
            });

            const appearanceTokens = this.getTextBlockAppearanceTokens(mergedBlock);
            const appearanceLabel = this.getTextBlockAppearanceLabel(appearanceTokens.join('+'));

            root.querySelectorAll('[data-frame-editor-appearance-label]').forEach(control => {
                control.textContent = appearanceLabel;
            });

            root.querySelectorAll('[data-block-setting="appearanceOption"]').forEach(control => {
                if (control === document.activeElement) return;
                const token = String(control.dataset.blockValue || '').trim();
                control.checked = appearanceTokens.includes(token);
            });
        }
    },

    syncCanvasBlock(root, block) {
        if (!block) {
            return;
        }

        if (block.parentId) {
            const blockElement = root.querySelector(`[data-frame-editor-canvas-block="${block.id}"]`);
            if (blockElement && this.syncNestedCanvasBlock(root, blockElement, block)) {
                return;
            }

            this.renderIntoRoot();
            return;
        }

        if (this.isContainerBlock(block) || this.getChildBlocks(block.id).length) {
            this.renderIntoRoot();
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
        blockElement.style.zIndex = String(this.getCanvasBlockZIndex(block));
        blockElement.style.transform = this.getCanvasBlockTransform(block.rotation);
        blockElement.style.display = block.visible === false ? 'none' : '';
        blockElement.style.opacity = Number.isFinite(Number(block.opacity)) ? String(this.clamp(Number(block.opacity), 0, 1)) : '';
        blockElement.style.pointerEvents = block.enabled === false || block.hitTest === false ? 'none' : '';
        blockElement.innerHTML = this.renderCanvasBlockInner(block);
        this.applyCanvasLayout(root);
    },

    syncNestedCanvasBlock(root, blockElement, block) {
        const parentBlock = this.getParentBlock(block);
        if (!blockElement || !parentBlock) {
            return false;
        }

        const parentLayout = this.getCanvasBlockLayout(parentBlock);
        const childBlocks = this.getChildBlocks(parentBlock.id);
        const childIndex = childBlocks.findIndex(childBlock => childBlock.id === block.id);
        const placement = this.getContainerChildPlacements(parentBlock, parentLayout, childBlocks)
            .find(candidate => candidate.childBlock.id === block.id);
        if (!placement) {
            return false;
        }

        const layout = this.getCanvasBlockLayout(block);
        blockElement.style.left = `${placement.centerX}px`;
        blockElement.style.top = `${placement.centerY}px`;
        blockElement.style.width = `${layout.width}px`;
        blockElement.style.zIndex = this.state.selectedBlockId === block.id ? '2000' : String(childIndex + 1);
        blockElement.style.transform = this.getCanvasBlockTransform(block.rotation);
        blockElement.style.display = block.visible === false ? 'none' : '';
        blockElement.style.opacity = Number.isFinite(Number(block.opacity)) ? String(this.clamp(Number(block.opacity), 0, 1)) : '';
        blockElement.style.pointerEvents = block.enabled === false || block.hitTest === false ? 'none' : '';

        if (block.type === 'qr') {
            this.syncQrBlockPreview(blockElement, block);
        } else if (block.type === 'text') {
            this.syncTextBlockPreview(blockElement, block);
        } else if (this.isGenericComponentBlock(block)) {
            this.syncGenericComponentPreview(blockElement, block);
        } else if (!this.syncShapeImageBlockPreview(blockElement, block)) {
            blockElement.innerHTML = this.renderCanvasBlockInner(block);
        }

        this.applyCanvasLayout(root);
        return true;
    },

    clampUpdatedBlockToCanvas(root, block) {
        if (!block) {
            return;
        }

        if (block.parentId) {
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
            control.value = this.formatCanvasZoomPercent();
            return;
        }

        const nextZoom = parsedValue / 100;
        this.setCanvasZoom(nextZoom, null, root);
    },

    setCanvasZoom(nextZoom, anchorPoint = null, root = this.getRoot()) {
        const scroll = root?.querySelector?.('[data-frame-editor-canvas-scroll]');
        const metrics = this.getCanvasLayoutMetrics(root);
        const oldZoom = this.state.canvasZoom;
        const normalizedZoom = Number(this.clamp(nextZoom, this.MIN_CANVAS_ZOOM, this.MAX_CANVAS_ZOOM).toFixed(4));
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
        this.syncCanvasViewportTransforms(root);
        this.applyCanvasLayout(root);
    },

    adjustCanvasZoom(delta, anchorPoint = null, root = this.getRoot()) {
        this.setCanvasZoom(this.state.canvasZoom + delta, anchorPoint, root);
    },

    scaleCanvasZoom(factor, anchorPoint = null, root = this.getRoot()) {
        const normalizedFactor = Number(factor);
        if (!Number.isFinite(normalizedFactor) || normalizedFactor <= 0) {
            return;
        }
        this.setCanvasZoom(this.state.canvasZoom * normalizedFactor, anchorPoint, root);
    },

    resetCanvasView(root = this.getRoot()) {
        this.queueCanvasScrollCompensation(root);
        this.state = {
            ...this.state,
            canvasZoom: 1,
            canvasPanX: 0,
            canvasPanY: 0
        };
        this.syncCanvasViewportTransforms(root);
        this.applyCanvasLayout(root);
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
        ).toFixed(4));
        const centerX = bounds.left + (contentWidth / 2);
        const centerY = bounds.top + (contentHeight / 2);

        this.queueCanvasScrollCompensation(root);
        this.state = {
            ...this.state,
            canvasZoom: nextZoom,
            canvasPanX: (metrics.viewportWidth / 2) - (centerX * nextZoom),
            canvasPanY: (metrics.viewportHeight / 2) - (centerY * nextZoom)
        };
        this.syncCanvasViewportTransforms(root);
        this.applyCanvasLayout(root);
        this.hideCanvasZoomContextMenu(root);
    },

    renderFrameEditorContextMenuItems(items = []) {
        return items.filter(Boolean).map(item => {
            if (item.type === 'separator') {
                return '<div class="frame-editor-context-menu-separator" role="separator" aria-hidden="true"></div>';
            }

            const itemClasses = [
                'frame-editor-context-menu-item',
                item.danger ? 'is-danger' : '',
                item.active ? 'active' : ''
            ].filter(Boolean).join(' ');

            return `
                <button
                    type="button"
                    class="${itemClasses}"
                    data-frame-editor-context-action="${this.escapeHTML(item.action)}"
                    role="menuitem"
                    ${item.disabled ? 'disabled' : ''}
                >
                    <i class="bi ${this.escapeHTML(item.icon || 'bi-dot')}" aria-hidden="true"></i>
                    <span>${this.escapeHTML(I18n.translateString(item.label))}</span>
                    ${item.active ? '<i class="bi bi-check2 frame-editor-context-menu-item-status" aria-hidden="true"></i>' : ''}
                </button>
            `;
        }).join('');
    },

    getFrameEditorContextMenuItems(scope, options = {}) {
        if (scope === 'block') {
            const block = this.getBlockById(options.blockId);
            if (!block) {
                return [];
            }

            const isQrInnerSelected = this.isQrInnerSelected(block);
            const qrSelectionItem = this.canSelectQrInnerBlock(block)
                ? {
                    action: isQrInnerSelected ? 'deselect-qr-code' : 'select-qr-code',
                    label: isQrInnerSelected ? 'Deselect QR code' : 'Select QR code',
                    icon: isQrInnerSelected ? 'bi-x-circle' : 'bi-bullseye'
                }
                : null;
            const isTextInnerSelected = this.isTextInnerSelected(block);
            const textSelectionItem = this.canSelectTextInnerBlock(block)
                ? {
                    action: isTextInnerSelected ? 'deselect-text' : 'select-text',
                    label: isTextInnerSelected ? 'Deselect text' : 'Select text',
                    icon: isTextInnerSelected ? 'bi-x-circle' : 'bi-cursor-text'
                }
                : null;

            return [
                { action: 'edit-block', label: 'Edit', icon: 'bi-pencil-square' },
                qrSelectionItem,
                textSelectionItem,
                { action: 'duplicate-block', label: 'Duplicate', icon: 'bi-files' },
                { action: 'copy-block', label: 'Copy', icon: 'bi-clipboard' },
                { action: 'cut-block', label: 'Cut', icon: 'bi-scissors' },
                { type: 'separator' },
                { action: 'bring-to-front', label: 'Bring to front', icon: 'bi-chevron-bar-up' },
                { action: 'send-to-back', label: 'Send to back', icon: 'bi-chevron-bar-down' },
                {
                    action: 'toggle-stay-on-top',
                    label: block.alwaysOnTop ? 'Disable stay on top' : 'Stay on top',
                    icon: block.alwaysOnTop ? 'bi-pin-angle-fill' : 'bi-pin-angle',
                    active: Boolean(block.alwaysOnTop)
                },
                { type: 'separator' },
                { action: 'delete-block', label: 'Delete', icon: 'bi-trash3', danger: true }
            ];
        }

        return [
            { action: 'paste-block', label: 'Paste here', icon: 'bi-clipboard-plus', disabled: !this.hasBlockClipboard() },
            { type: 'separator' },
            { action: 'add-component:TQRCode', label: 'Add TQRCode', icon: 'bi-qr-code' },
            { action: 'add-component:TLabel', label: 'Add TLabel', icon: 'bi-type-h2' },
            { action: 'add-component:TRectangle', label: 'Add TRectangle', icon: 'bi-square' },
            { action: 'add-component:TLine', label: 'Add TLine', icon: 'bi-slash-lg' },
            { action: 'add-component:TPanel', label: 'Add TPanel', icon: 'bi-layout-text-window' },
            { action: 'add-component:TGridPanelLayout', label: 'Add TGridPanelLayout', icon: 'bi-columns-gap' },
            { action: 'add-component:TImage', label: 'Add TImage', icon: 'bi-image' },
            { type: 'separator' },
            { action: 'edit-selected-block', label: 'Edit selected component', icon: 'bi-pencil-square', disabled: !this.state.selectedBlockId },
            { action: 'open-canvas-settings', label: 'Canvas settings', icon: 'bi-sliders' },
            { action: 'clear-selection', label: 'Clear selection', icon: 'bi-x-circle', disabled: !this.state.selectedBlockId && !this.isCanvasSelected() },
            { type: 'separator' },
            { action: 'fit-blocks', label: 'Fit components', icon: 'bi-arrows-angle-expand', disabled: !this.state.canvasBlocks.length },
            { action: 'reset-view', label: 'Reset view', icon: 'bi-arrow-counterclockwise' }
        ];
    },

    showFrameEditorContextMenu(scope, clientX, clientY, options = {}, root = this.getRoot()) {
        const menu = root?.querySelector?.('[data-frame-editor-context-menu]');
        if (!menu) {
            return;
        }

        const items = this.getFrameEditorContextMenuItems(scope, options);
        if (!items.length) {
            this.hideFrameEditorContextMenu(root);
            return;
        }

        this.hideCanvasZoomContextMenu(root);
        this.frameEditorContextMenuState = {
            scope,
            blockId: options.blockId || '',
            position: options.position || null
        };

        menu.innerHTML = this.renderFrameEditorContextMenuItems(items);
        menu.hidden = false;
        menu.style.left = '0px';
        menu.style.top = '0px';

        menu.querySelectorAll('[data-frame-editor-context-action]').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                this.handleFrameEditorContextMenuAction(button.dataset.frameEditorContextAction, root);
            });
        });

        const menuRect = menu.getBoundingClientRect();
        const padding = 12;
        const left = Math.min(Math.max(padding, clientX), Math.max(padding, window.innerWidth - menuRect.width - padding));
        const top = Math.min(Math.max(padding, clientY), Math.max(padding, window.innerHeight - menuRect.height - padding));

        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
    },

    showBlockContextMenu(blockId, clientX, clientY, root = this.getRoot()) {
        const block = this.getBlockById(blockId);
        if (!blockId || !block) {
            return;
        }

        this.hideFrameEditorContextMenu(root);
        if (this.state.selectedBlockId !== blockId) {
            this.state = {
                ...this.state,
                selectedBlockId: blockId,
                selectedCanvas: false,
                selectedQrBlockId: blockId === this.state.selectedQrBlockId ? blockId : '',
                selectedTextBlockId: blockId === this.state.selectedTextBlockId ? blockId : ''
            };
            this.renderIntoRoot();
            root = this.getRoot();
        }

        this.showFrameEditorContextMenu('block', clientX, clientY, { blockId }, root);
    },

    showGridContextMenu(clientX, clientY, position = null, root = this.getRoot()) {
        this.showFrameEditorContextMenu('grid', clientX, clientY, { position }, root);
    },

    hideFrameEditorContextMenu(root = this.getRoot()) {
        const menu = root?.querySelector?.('[data-frame-editor-context-menu]');
        this.frameEditorContextMenuState = null;
        if (!menu) {
            return;
        }

        menu.hidden = true;
        menu.innerHTML = '';
    },

    handleFrameEditorContextMenuAction(action, root = this.getRoot()) {
        const context = this.frameEditorContextMenuState || {};
        const blockId = context.blockId || this.state.selectedBlockId;
        const position = context.position || null;
        this.hideFrameEditorContextMenu(root);

        if (action === 'edit-block' || action === 'edit-selected-block') {
            this.openBlockInspector(blockId);
            return;
        }
        if (action === 'select-qr-code') {
            this.selectQrInnerBlock(blockId);
            return;
        }
        if (action === 'deselect-qr-code') {
            this.deselectQrInnerBlock(blockId);
            return;
        }
        if (action === 'select-text') {
            this.selectTextInnerBlock(blockId);
            return;
        }
        if (action === 'deselect-text') {
            this.deselectTextInnerBlock(blockId);
            return;
        }
        if (action === 'duplicate-block') {
            this.duplicateBlockById(blockId);
            return;
        }
        if (action === 'copy-block') {
            this.copyBlockToClipboard(blockId);
            return;
        }
        if (action === 'cut-block') {
            this.cutBlockToClipboard(blockId);
            return;
        }
        if (action === 'delete-block') {
            this.removeBlockById(blockId);
            return;
        }
        if (action === 'bring-to-front') {
            this.moveBlockToLayerEdge(blockId, 'front');
            return;
        }
        if (action === 'send-to-back') {
            this.moveBlockToLayerEdge(blockId, 'back');
            return;
        }
        if (action === 'toggle-stay-on-top') {
            const block = this.getBlockById(blockId);
            if (!block) {
                return;
            }
            this.setBlockAlwaysOnTop(blockId, !block.alwaysOnTop);
            return;
        }
        if (action === 'paste-block') {
            this.pasteBlockFromClipboard(position, root);
            return;
        }
        if (action.startsWith('add-component:')) {
            this.addComponent(action.slice('add-component:'.length), position, root);
            return;
        }
        if (action === 'open-canvas-settings') {
            this.openCanvasInspector();
            return;
        }
        if (action === 'clear-selection') {
            this.clearSelectedBlock();
            return;
        }
        if (action === 'fit-blocks') {
            this.fitCanvasToBlocks(root);
            return;
        }
        if (action === 'reset-view') {
            this.resetCanvasView(root);
        }
    },

    showCanvasZoomContextMenu(clientX, clientY, root = this.getRoot()) {
        const menu = root?.querySelector?.('[data-frame-editor-zoom-menu]');
        if (!menu) {
            return;
        }

        this.hideFrameEditorContextMenu(root);
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

    formatCanvasZoomPercent(zoom = this.state.canvasZoom) {
        const percent = Math.max(0, Number(zoom) || 0) * 100;
        if (percent >= 100) {
            return percent.toFixed(0);
        }
        if (percent >= 10) {
            return percent.toFixed(1).replace(/\.0$/, '');
        }
        return percent.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
    },

    syncCanvasZoomControls(root = this.getRoot()) {
        if (!root) {
            return;
        }

        const formattedZoom = this.formatCanvasZoomPercent();
        root.querySelectorAll('[data-canvas-zoom-input]').forEach(input => {
            if (input === document.activeElement) {
                return;
            }
            input.value = formattedZoom;
        });
    },

    syncCanvasViewportTransforms(root = this.getRoot()) {
        if (!root) {
            return;
        }

        const camera = root.querySelector('[data-frame-editor-camera]');
        const scene = root.querySelector('[data-frame-editor-scene]');
        if (camera) {
            camera.style.transform = `translate(${this.state.canvasPanX}px, ${this.state.canvasPanY}px)`;
        }
        if (scene) {
            scene.style.transform = `scale(${this.state.canvasZoom})`;
            scene.style.setProperty('--frame-editor-handle-scale', String(this.getCanvasHandleScale()));
        }
        root.querySelectorAll('[data-frame-editor-qr-handle-layer]').forEach(handleLayer => {
            const blockElement = handleLayer.closest('[data-frame-editor-canvas-block]');
            const blockId = blockElement?.dataset.frameEditorCanvasBlock;
            const block = this.getBlockById(blockId);
            if (blockElement && block?.type === 'qr') {
                this.syncQrBlockPreview(blockElement, block);
            }
        });
        this.syncCanvasZoomControls(root);
    },

    normalizeWheelZoomDelta(event, root = this.getRoot()) {
        const referenceHeight = root?.querySelector?.('[data-frame-editor-canvas-scroll]')?.clientHeight || window.innerHeight || 800;
        if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
            return event.deltaY * 16;
        }
        if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
            return event.deltaY * referenceHeight;
        }
        return event.deltaY;
    },

    cloneBlockData(block) {
        return this.normalizeFrameEditorBlockData(block ? JSON.parse(JSON.stringify(block)) : null);
    },

    normalizeFrameEditorBlockData(block) {
        if (!block || typeof block !== 'object') {
            return null;
        }

        const normalizedBlock = window.FrameEditorComponentCatalog?.normalizeComponent?.(block) || block;
        return {
            ...normalizedBlock,
            marginTop: Math.max(0, Number(normalizedBlock.marginTop) || 0),
            marginRight: Math.max(0, Number(normalizedBlock.marginRight) || 0),
            marginBottom: Math.max(0, Number(normalizedBlock.marginBottom) || 0),
            marginLeft: Math.max(0, Number(normalizedBlock.marginLeft) || 0)
        };
    },

    getBlockSubtreeBlocks(blockId, blocks = this.state.canvasBlocks) {
        const rootBlock = Array.isArray(blocks)
            ? blocks.find(block => block?.id === blockId)
            : null;
        if (!rootBlock) {
            return [];
        }

        const subtree = [rootBlock];
        const visit = parentId => {
            this.getChildBlocks(parentId, blocks).forEach(childBlock => {
                subtree.push(childBlock);
                visit(childBlock.id);
            });
        };
        visit(blockId);
        return subtree;
    },

    getBlockSubtreeSnapshot(blockId, blocks = this.state.canvasBlocks) {
        const subtreeBlocks = this.getBlockSubtreeBlocks(blockId, blocks).map(block => this.cloneBlockData(block));
        if (!subtreeBlocks.length) {
            return null;
        }

        return {
            rootId: blockId,
            blocks: subtreeBlocks
        };
    },

    mergeBlockSubtreeIntoCanvas(existingBlocks, instantiatedBlocks) {
        if (!Array.isArray(instantiatedBlocks) || !instantiatedBlocks.length) {
            return existingBlocks;
        }

        const [rootBlock, ...descendants] = instantiatedBlocks;
        let nextBlocks = [...existingBlocks];
        if (rootBlock.parentId) {
            nextBlocks.push(rootBlock);
        } else {
            nextBlocks = this.insertCanvasBlockByLayer(nextBlocks, rootBlock);
        }

        if (descendants.length) {
            nextBlocks.push(...descendants);
        }
        return nextBlocks;
    },

    instantiateBlockSubtree(snapshot, options = {}) {
        const sourceBlocks = Array.isArray(snapshot?.blocks)
            ? snapshot.blocks.map(block => this.cloneBlockData(block))
            : [];
        const sourceRoot = sourceBlocks.find(block => block?.id === snapshot?.rootId) || sourceBlocks[0] || null;
        if (!sourceRoot) {
            return null;
        }

        // Respect an explicitly-provided `targetContainer` option (even if it's `null`).
        // If `targetContainer` is omitted entirely, fall back to the source's original parent
        // when available (preserves previous behaviour). This lets callers explicitly request
        // "paste to canvas root" by passing `targetContainer: null`.
        const hasTargetContainerOption = Object.prototype.hasOwnProperty.call(options, 'targetContainer');
        const targetContainer = options.targetContainer !== undefined ? options.targetContainer : null;
        const fallbackParentId = sourceRoot.parentId && this.getBlockById(sourceRoot.parentId)
            ? sourceRoot.parentId
            : '';
        let targetParentId;
        if (hasTargetContainerOption) {
            // Caller explicitly specified a targetContainer (may be null to indicate canvas root).
            targetParentId = (targetContainer && targetContainer.id) ? targetContainer.id : (options.targetParentId || '');
        } else {
            // No explicit targetContainer provided — preserve original parent if present.
            targetParentId = options.targetParentId || fallbackParentId || '';
        }
        const idMap = new Map(sourceBlocks.map(block => [block.id, this.getNextBlockId()]));
        const rootPosition = options.position && Number.isFinite(options.position.xPct) && Number.isFinite(options.position.yPct)
            ? options.position
            : {
                xPct: (Number(sourceRoot.xPct) || 50) + 4,
                yPct: (Number(sourceRoot.yPct) || 50) + 4
            };
        const targetChildOrder = targetParentId
            ? this.getNextChildOrder(targetParentId)
            : 0;
        const targetParentBlock = targetParentId
            ? this.getBlockById(targetParentId)
            : null;
        const instantiatedBlocks = sourceBlocks.map(sourceBlock => {
            const isRootBlock = sourceBlock.id === sourceRoot.id;
            const nextBlock = this.cloneBlockData(sourceBlock);
            nextBlock.id = idMap.get(sourceBlock.id);

            if (isRootBlock) {
                nextBlock.parentId = targetParentId;
                if (targetParentId) {
                    nextBlock.childOrder = targetChildOrder;
                    nextBlock.columnIndex = targetParentBlock?.type === 'columns'
                        ? targetChildOrder % this.getResolvedColumnsBlockCount(targetParentBlock)
                        : 0;
                } else {
                    nextBlock.xPct = Number((rootPosition.xPct ?? 50).toFixed(4));
                    nextBlock.yPct = Number((rootPosition.yPct ?? 50).toFixed(4));
                }
                return nextBlock;
            }

            nextBlock.parentId = idMap.get(sourceBlock.parentId) || sourceBlock.parentId || '';
            return nextBlock;
        });

        return {
            rootBlock: instantiatedBlocks.find(block => block.id === idMap.get(sourceRoot.id)) || null,
            blocks: instantiatedBlocks
        };
    },

    hasBlockClipboard() {
        return Boolean(this.blockClipboard);
    },

    getFirstPinnedCanvasBlockIndex(blocks = this.state.canvasBlocks) {
        const firstPinnedIndex = blocks.findIndex(block => block?.alwaysOnTop);
        return firstPinnedIndex === -1 ? blocks.length : firstPinnedIndex;
    },

    insertCanvasBlockByLayer(blocks, block, position = 'end') {
        const nextBlocks = [...blocks];
        const insertIndex = block?.alwaysOnTop
            ? (position === 'start' ? this.getFirstPinnedCanvasBlockIndex(nextBlocks) : nextBlocks.length)
            : (position === 'start' ? 0 : this.getFirstPinnedCanvasBlockIndex(nextBlocks));
        nextBlocks.splice(insertIndex, 0, block);
        return nextBlocks;
    },

    focusInspectorControl(selector) {
        window.requestAnimationFrame(() => {
            const control = this.getRoot()?.querySelector?.(selector);
            if (control && typeof control.focus === 'function') {
                control.focus();
            }
        });
    },

    openBlockInspector(blockId) {
        if (!blockId || !this.getBlockById(blockId)) {
            return;
        }

        this.state = {
            ...this.state,
            selectedBlockId: blockId,
            selectedCanvas: false,
            isRightSidebarCollapsed: false,
            selectedQrBlockId: this.state.selectedQrBlockId === blockId ? blockId : '',
            selectedTextBlockId: this.state.selectedTextBlockId === blockId ? blockId : ''
        };
        this.renderIntoRoot();
        this.focusInspectorControl('.frame-editor-right-sidebar-body [data-block-setting]');
    },

    selectQrInnerBlock(blockId) {
        const block = this.getBlockById(blockId);
        if (!this.canSelectQrInnerBlock(block)) {
            return;
        }

        this.state = {
            ...this.state,
            selectedBlockId: blockId,
            selectedCanvas: false,
            selectedQrBlockId: blockId,
            selectedTextBlockId: ''
        };
        this.renderIntoRoot();
    },

    deselectQrInnerBlock(blockId = this.state.selectedQrBlockId) {
        if (!blockId || this.state.selectedQrBlockId !== blockId) {
            return;
        }

        this.state = {
            ...this.state,
            selectedQrBlockId: ''
        };
        this.renderIntoRoot();
    },

    selectTextInnerBlock(blockId) {
        const block = this.getBlockById(blockId);
        if (!this.canSelectTextInnerBlock(block)) {
            return;
        }

        this.state = {
            ...this.state,
            selectedBlockId: blockId,
            selectedCanvas: false,
            selectedQrBlockId: '',
            selectedTextBlockId: blockId
        };
        this.renderIntoRoot();
    },

    deselectTextInnerBlock(blockId = this.state.selectedTextBlockId) {
        if (!blockId || this.state.selectedTextBlockId !== blockId) {
            return;
        }

        this.state = {
            ...this.state,
            selectedTextBlockId: ''
        };
        this.renderIntoRoot();
    },

    isCanvasSelected() {
        return Boolean(this.state.selectedCanvas);
    },

    selectCanvas(options = {}) {
        const focusInspector = options.focusInspector !== false;
        this.state = {
            ...this.state,
            selectedCanvas: true,
            selectedBlockId: '',
            selectedQrBlockId: '',
            selectedTextBlockId: '',
            isRightSidebarCollapsed: false
        };
        this.renderIntoRoot();
        if (focusInspector) {
            this.focusInspectorControl('.frame-editor-right-sidebar-body [data-canvas-setting]');
        }
    },

    openCanvasInspector() {
        this.selectCanvas();
    },

    clearSelectedBlock() {
        if (!this.state.selectedBlockId && !this.isCanvasSelected()) {
            return;
        }

        this.state = {
            ...this.state,
            selectedCanvas: false,
            selectedBlockId: '',
            selectedQrBlockId: '',
            selectedTextBlockId: ''
        };
        this.renderIntoRoot();
    },

    copyBlockToClipboard(blockId = this.state.selectedBlockId) {
        const snapshot = this.getBlockSubtreeSnapshot(blockId);
        if (!snapshot) {
            return;
        }

        this.blockClipboard = snapshot;
    },

    cutBlockToClipboard(blockId = this.state.selectedBlockId) {
        const snapshot = this.getBlockSubtreeSnapshot(blockId);
        if (!snapshot) {
            return;
        }

        this.blockClipboard = snapshot;
        this.removeBlockById(blockId);
    },

    pasteBlockFromClipboard(position = null, root = this.getRoot()) {
        const instantiatedSubtree = this.instantiateBlockSubtree(this.blockClipboard, {
            position,
            targetContainer: this.getSelectedContainerTarget()
        });
        if (!instantiatedSubtree?.rootBlock) {
            return;
        }

        this.state = {
            ...this.state,
            selectedBlockId: instantiatedSubtree.rootBlock.id,
            selectedCanvas: false,
            selectedQrBlockId: '',
            selectedTextBlockId: '',
            canvasBlocks: this.mergeBlockSubtreeIntoCanvas(this.state.canvasBlocks, instantiatedSubtree.blocks)
        };
        this.renderIntoRoot();
        if (!instantiatedSubtree.rootBlock.parentId) {
            this.clampUpdatedBlockToCanvas(this.getRoot(), this.getBlockById(instantiatedSubtree.rootBlock.id));
        }
    },

    moveStructureBlock(sourceBlockId, targetBlockId = '', placement = 'after', root = this.getRoot(), rootPosition = null) {
        if (!sourceBlockId) {
            return false;
        }

        const nextBlocks = this.state.canvasBlocks.map(block => this.cloneBlockData(block));
        const blockMap = new Map(nextBlocks.map(block => [block.id, block]));
        const sourceBlock = blockMap.get(sourceBlockId);
        const targetBlock = targetBlockId ? blockMap.get(targetBlockId) : null;
        if (!sourceBlock || (targetBlockId && !targetBlock)) {
            return false;
        }

        let nextParentId = '';
        if (placement === 'inside') {
            if (!targetBlock) {
                return false;
            }
            nextParentId = targetBlock.id;
        } else if (targetBlock) {
            nextParentId = targetBlock.parentId || '';
        }

        if (!this.canMoveBlockToParent(sourceBlockId, nextParentId, nextBlocks)) {
            return false;
        }

        const previousParentId = sourceBlock.parentId || '';
        const previousCenterPosition = previousParentId
            ? this.getCanvasBlockCenterPositionPx(sourceBlock, nextBlocks, root)
            : null;
        const rootOrderIds = this.getRootCanvasBlocks(nextBlocks)
            .map(block => block.id)
            .filter(blockId => blockId !== sourceBlockId);

        sourceBlock.parentId = nextParentId;

        if (nextParentId) {
            const parentBlock = blockMap.get(nextParentId);
            const siblingIds = this.getChildBlocks(nextParentId, nextBlocks)
                .map(block => block.id)
                .filter(blockId => blockId !== sourceBlockId);
            let insertIndex = siblingIds.length;
            if (placement !== 'inside' && targetBlock) {
                const targetIndex = siblingIds.indexOf(targetBlock.id);
                if (targetIndex !== -1) {
                    insertIndex = placement === 'before' ? targetIndex : (targetIndex + 1);
                }
            }

            siblingIds.splice(insertIndex, 0, sourceBlockId);
            const columnCount = parentBlock?.type === 'columns'
                ? this.getResolvedColumnsBlockCount(parentBlock)
                : 0;
            const sourceColumnIndex = parentBlock?.type === 'columns'
                ? (placement === 'inside'
                    ? (insertIndex % Math.max(columnCount, 1))
                    : this.clamp(
                        Number.isFinite(Number(targetBlock?.columnIndex)) ? Number(targetBlock.columnIndex) : insertIndex,
                        0,
                        Math.max(columnCount - 1, 0)
                    ))
                : 0;

            siblingIds.forEach((blockId, index) => {
                const siblingBlock = blockMap.get(blockId);
                if (!siblingBlock) {
                    return;
                }

                siblingBlock.parentId = nextParentId;
                siblingBlock.childOrder = index;
                if (blockId === sourceBlockId) {
                    siblingBlock.columnIndex = sourceColumnIndex;
                } else if (parentBlock?.type !== 'columns') {
                    siblingBlock.columnIndex = 0;
                }
            });
        } else {
            let insertIndex = rootOrderIds.length;
            if (targetBlock) {
                const targetIndex = rootOrderIds.indexOf(targetBlock.id);
                if (targetIndex !== -1) {
                    insertIndex = placement === 'before' ? targetIndex : (targetIndex + 1);
                }
            }
            rootOrderIds.splice(insertIndex, 0, sourceBlockId);

            if (rootPosition && Number.isFinite(Number(rootPosition.xPct)) && Number.isFinite(Number(rootPosition.yPct))) {
                sourceBlock.xPct = Number(rootPosition.xPct);
                sourceBlock.yPct = Number(rootPosition.yPct);
            } else if (previousCenterPosition) {
                const nextPosition = this.getCanvasPercentPositionFromCenterPx(previousCenterPosition, root);
                if (nextPosition) {
                    sourceBlock.xPct = nextPosition.xPct;
                    sourceBlock.yPct = nextPosition.yPct;
                }
            }
            sourceBlock.columnIndex = 0;
        }

        if (previousParentId && previousParentId !== nextParentId) {
            const previousParentBlock = blockMap.get(previousParentId);
            this.getChildBlocks(previousParentId, nextBlocks)
                .map(block => block.id)
                .filter(blockId => blockId !== sourceBlockId)
                .forEach((blockId, index) => {
                    const siblingBlock = blockMap.get(blockId);
                    if (!siblingBlock) {
                        return;
                    }

                    siblingBlock.childOrder = index;
                    if (previousParentBlock?.type !== 'columns') {
                        siblingBlock.columnIndex = 0;
                    }
                });
        }

        const rebuiltBlocks = this.rebuildCanvasBlocksFromHierarchy(rootOrderIds, blockMap);
        this.state = {
            ...this.state,
            canvasBlocks: rebuiltBlocks,
            selectedBlockId: sourceBlockId,
            selectedCanvas: false,
            selectedQrBlockId: '',
            selectedTextBlockId: ''
        };
        this.renderIntoRoot();

        const movedBlock = this.getBlockById(sourceBlockId);
        if (movedBlock && !movedBlock.parentId) {
            this.clampUpdatedBlockToCanvas(this.getRoot(), movedBlock);
        }

        return true;
    },

    moveBlockToLayerEdge(blockId, direction = 'front') {
        const blockIndex = this.state.canvasBlocks.findIndex(block => block.id === blockId);
        if (blockIndex === -1) {
            return;
        }

        if (this.getBlockById(blockId)?.parentId) {
            return;
        }

        const nextBlocks = [...this.state.canvasBlocks];
        const [block] = nextBlocks.splice(blockIndex, 1);
        const reorderedBlocks = this.insertCanvasBlockByLayer(nextBlocks, block, direction === 'back' ? 'start' : 'end');

        this.state = {
            ...this.state,
            canvasBlocks: reorderedBlocks,
            selectedBlockId: blockId,
            selectedCanvas: false
        };
        this.renderIntoRoot();
    },

    setBlockAlwaysOnTop(blockId, shouldStayOnTop) {
        const blockIndex = this.state.canvasBlocks.findIndex(block => block.id === blockId);
        if (blockIndex === -1) {
            return;
        }

        if (this.getBlockById(blockId)?.parentId) {
            return;
        }

        const nextBlocks = [...this.state.canvasBlocks];
        const [block] = nextBlocks.splice(blockIndex, 1);
        const updatedBlock = {
            ...block,
            alwaysOnTop: shouldStayOnTop
        };
        const reorderedBlocks = this.insertCanvasBlockByLayer(nextBlocks, updatedBlock, 'end');

        this.state = {
            ...this.state,
            canvasBlocks: reorderedBlocks,
            selectedBlockId: blockId,
            selectedCanvas: false
        };
        this.renderIntoRoot();
    },

    getSelectedContainerTarget() {
        return this.getSelectedBlock() || null;
    },

    addComponent(blockType, position = null, root = this.getRoot()) {
        if (!this.isSupportedComponentType(blockType)) {
            return;
        }

        const targetContainer = this.getSelectedContainerTarget();
        const nextBlock = this.createComponent(
            blockType,
            targetContainer && this.usesFreePositionedChildren(targetContainer)
                ? { xPct: 50, yPct: 50 }
                : (position || this.getVisibleCanvasCenterPosition(root)),
            targetContainer
                ? {
                    parentId: targetContainer.id,
                    childOrder: this.getNextChildOrder(targetContainer.id),
                    columnIndex: targetContainer.type === 'columns'
                        ? this.getNextChildOrder(targetContainer.id) % this.getResolvedColumnsBlockCount(targetContainer)
                        : 0,
                    nestedPositionMode: this.usesFreePositionedChildren(targetContainer) ? 'manual' : ''
                }
                : null
        );
        if (!nextBlock) {
            return;
        }
        this.state = {
            ...this.state,
            selectedBlockId: nextBlock.id,
            selectedCanvas: false,
            selectedQrBlockId: '',
            selectedTextBlockId: '',
            canvasBlocks: targetContainer
                ? [...this.state.canvasBlocks, nextBlock]
                : this.insertCanvasBlockByLayer(this.state.canvasBlocks, nextBlock)
        };
        this.renderIntoRoot();
        if (!targetContainer) {
            this.clampUpdatedBlockToCanvas(this.getRoot(), this.getBlockById(nextBlock.id));
        }
    },

    createComponent(blockType, position = null, nestedOptions = null) {
        const basePosition = position || {};
        const xPct = Number.isFinite(basePosition.xPct) ? basePosition.xPct : 50;
        const defaultYPct = blockType === 'text'
            ? 28
            : ((blockType === 'shape' || blockType === 'line') ? 40 : 52);
        const yPct = Number.isFinite(basePosition.yPct) ? basePosition.yPct : defaultYPct;
        const parentId = nestedOptions?.parentId || '';
        const childOrder = Number.isFinite(Number(nestedOptions?.childOrder)) ? Number(nestedOptions.childOrder) : 0;
        const columnIndex = Number.isFinite(Number(nestedOptions?.columnIndex)) ? Number(nestedOptions.columnIndex) : 0;
        const nestedPositionMode = String(nestedOptions?.nestedPositionMode || '').trim();

        const catalogBlock = window.FrameEditorComponentCatalog?.createComponent?.(blockType, {
            id: this.getNextBlockId(),
            xPct,
            yPct,
            parentId,
            childOrder,
            columnIndex,
            getDefaultColor: () => this.getTextBlockDefaultColor(),
            translate: text => I18n.translateString(text)
        });
        if (catalogBlock) {
            return nestedPositionMode
                ? { ...catalogBlock, nestedPositionMode }
                : catalogBlock;
        }
        return null;
    },

    updateBlock(blockId, patch) {
        let updatedBlock = null;
        const nextBlocks = this.state.canvasBlocks.map(block => {
            if (block.id !== blockId) {
                return block;
            }

            updatedBlock = { ...block, ...patch };
            return updatedBlock;
        });

        this.state = {
            ...this.state,
            canvasBlocks: nextBlocks,
            selectedQrBlockId: this.state.selectedQrBlockId === blockId && !this.canSelectQrInnerBlock(updatedBlock)
                ? ''
                : this.state.selectedQrBlockId,
            selectedTextBlockId: this.state.selectedTextBlockId === blockId && !this.canSelectTextInnerBlock(updatedBlock)
                ? ''
                : this.state.selectedTextBlockId
        };
    },

    isCanvasArrowNudgeKey(key) {
        return key === 'ArrowLeft'
            || key === 'ArrowRight'
            || key === 'ArrowUp'
            || key === 'ArrowDown';
    },

    nudgeCanvasBlockByKeyboard(blockId, key, step = 1, root = this.getRoot()) {
        const block = this.getBlockById(blockId);
        if (!block || !this.isCanvasArrowNudgeKey(key)) {
            return false;
        }

        const deltaByKey = {
            ArrowLeft: { xPct: -step, yPct: 0 },
            ArrowRight: { xPct: step, yPct: 0 },
            ArrowUp: { xPct: 0, yPct: -step },
            ArrowDown: { xPct: 0, yPct: step }
        };
        const delta = deltaByKey[key];
        const nextPosition = {
            xPct: (Number(block.xPct) || 50) + delta.xPct,
            yPct: (Number(block.yPct) || 50) + delta.yPct
        };

        const patch = block.parentId
            ? {
                ...this.clampNestedBlockPosition(this.getParentBlock(block), block, nextPosition),
                nestedPositionMode: 'manual'
            }
            : this.clampCanvasBlockPosition(root, block, nextPosition);

        this.updateBlock(blockId, patch);
        this.renderIntoRoot();
        return true;
    },

    getDescendantBlockIds(parentId, blocks = this.state.canvasBlocks) {
        const descendants = [];
        const visit = currentParentId => {
            this.getChildBlocks(currentParentId, blocks).forEach(childBlock => {
                descendants.push(childBlock.id);
                visit(childBlock.id);
            });
        };
        visit(parentId);
        return descendants;
    },

    removeBlockById(blockId) {
        if (!blockId) {
            return;
        }

        const block = this.getBlockById(blockId);
        const blockIndex = this.state.canvasBlocks.findIndex(candidate => candidate.id === blockId);
        if (blockIndex === -1) {
            return;
        }

        const idsToRemove = new Set([blockId, ...this.getDescendantBlockIds(blockId)]);
        const remainingBlocks = this.state.canvasBlocks.filter(candidate => !idsToRemove.has(candidate.id));
        const nextSelectedBlockId = idsToRemove.has(this.state.selectedBlockId)
            ? (block?.parentId && !idsToRemove.has(block.parentId)
                ? block.parentId
                : (remainingBlocks[Math.min(blockIndex, remainingBlocks.length - 1)]?.id || ''))
            : this.state.selectedBlockId;

        this.state = {
            ...this.state,
            canvasBlocks: remainingBlocks,
            selectedBlockId: nextSelectedBlockId,
            selectedCanvas: false,
            selectedQrBlockId: idsToRemove.has(this.state.selectedQrBlockId) ? '' : this.state.selectedQrBlockId,
            selectedTextBlockId: idsToRemove.has(this.state.selectedTextBlockId) ? '' : this.state.selectedTextBlockId
        };
        this.renderIntoRoot();
    },

    removeSelectedBlock() {
        this.removeBlockById(this.state.selectedBlockId);
    },

    duplicateBlockById(blockId) {
        const sourceBlock = this.getBlockById(blockId);
        const snapshot = this.getBlockSubtreeSnapshot(blockId);
        if (!sourceBlock || !snapshot) {
            return;
        }

        const instantiatedSubtree = this.instantiateBlockSubtree(snapshot);
        if (!instantiatedSubtree?.rootBlock) {
            return;
        }

        this.state = {
            ...this.state,
            selectedBlockId: instantiatedSubtree.rootBlock.id,
            selectedCanvas: false,
            selectedQrBlockId: '',
            selectedTextBlockId: '',
            canvasBlocks: this.mergeBlockSubtreeIntoCanvas(this.state.canvasBlocks, instantiatedSubtree.blocks)
        };
        this.renderIntoRoot();
        if (!instantiatedSubtree.rootBlock.parentId) {
            this.clampUpdatedBlockToCanvas(this.getRoot(), this.getBlockById(instantiatedSubtree.rootBlock.id));
        }
    },

    duplicateSelectedBlock() {
        this.duplicateBlockById(this.state.selectedBlockId);
    },

    selectBlock(blockId) {
        if (this.state.selectedBlockId === blockId) {
            return;
        }

        this.state = {
            ...this.state,
            selectedBlockId: blockId,
            selectedCanvas: false,
            selectedQrBlockId: blockId === this.state.selectedQrBlockId ? blockId : '',
            selectedTextBlockId: blockId === this.state.selectedTextBlockId ? blockId : ''
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

    getDraggedStructureBlockId(event) {
        return event.dataTransfer?.getData('text/frame-editor-overview-block') || '';
    },

    handleStructureRootDropDragOver(event, root = this.getRoot(), activeTarget = null) {
        const sourceBlockId = this.getDraggedStructureBlockId(event) || this.structureDragBlockId;
        if (!sourceBlockId) {
            return false;
        }

        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        this.clearStructureDropIndicators(root);

        const structureList = root?.querySelector?.('[data-frame-editor-overview-list]');
        structureList?.classList.add('is-dragging');
        root?.querySelector?.(`[data-frame-editor-overview-block="${sourceBlockId}"]`)?.classList?.add('is-dragging');
        activeTarget?.classList?.add('is-active');
        return true;
    },

    handleStructureRootDrop(event, root = this.getRoot()) {
        const sourceBlockId = this.getDraggedStructureBlockId(event) || this.structureDragBlockId;
        if (!sourceBlockId) {
            return false;
        }

        event.preventDefault();
        const moved = this.moveStructureBlock(sourceBlockId, '', 'after', root);
        this.clearStructureDropIndicators(root);
        this.structureDragBlockId = '';
        return moved;
    },

    getStructureDropPlacement(button, clientY) {
        const targetBlock = this.getBlockById(button?.dataset?.frameEditorOverviewBlock || '');
        const rect = button?.getBoundingClientRect?.();
        if (!targetBlock || !rect || rect.height <= 0) {
            return 'after';
        }

        const offsetY = clientY - rect.top;
        const ratio = offsetY / rect.height;
        if (ratio >= 0.28 && ratio <= 0.72) {
            return 'inside';
        }

        return ratio < 0.5 ? 'before' : 'after';
    },

    canMoveBlockToParent(sourceBlockId, nextParentId, blocks = this.state.canvasBlocks) {
        if (!sourceBlockId) {
            return false;
        }

        if (!nextParentId) {
            return true;
        }

        if (sourceBlockId === nextParentId) {
            return false;
        }

        return !this.getDescendantBlockIds(sourceBlockId, blocks).includes(nextParentId);
    },

    canDropStructureBlock(sourceBlockId, targetBlockId, placement, blocks = this.state.canvasBlocks) {
        if (!sourceBlockId || !targetBlockId || sourceBlockId === targetBlockId) {
            return false;
        }

        const targetBlock = Array.isArray(blocks)
            ? blocks.find(block => block?.id === targetBlockId)
            : null;
        if (!targetBlock) {
            return false;
        }

        const nextParentId = placement === 'inside'
            ? targetBlock.id
            : (targetBlock.parentId || '');
        return this.canMoveBlockToParent(sourceBlockId, nextParentId, blocks);
    },

    clearStructureDropIndicators(root = this.getRoot()) {
        const structureList = root?.querySelector?.('[data-frame-editor-overview-list]');
        structureList?.classList.remove('is-dragging');
        root?.querySelectorAll?.('[data-frame-editor-overview-block]').forEach(button => {
            button.classList.remove('is-dragging', 'is-drop-before', 'is-drop-after', 'is-drop-inside');
        });
        root?.querySelectorAll?.('[data-frame-editor-overview-root-drop]').forEach(dropZone => {
            dropZone.classList.remove('is-active');
        });
    },

    applyStructureDropIndicator(targetElement, placement, root = this.getRoot()) {
        this.clearStructureDropIndicators(root);
        const structureList = root?.querySelector?.('[data-frame-editor-overview-list]');
        structureList?.classList.add('is-dragging');
        if (!targetElement) {
            return;
        }

        if (this.structureDragBlockId) {
            root?.querySelector?.(`[data-frame-editor-overview-block="${this.structureDragBlockId}"]`)?.classList?.add('is-dragging');
        }

        if (placement === 'inside') {
            targetElement.classList.add('is-drop-inside');
            return;
        }

        targetElement.classList.add(placement === 'before' ? 'is-drop-before' : 'is-drop-after');
    },

    getCanvasBlockCenterPositionPx(block, blocks = this.state.canvasBlocks, root = this.getRoot()) {
        const metrics = this.getCanvasLayoutMetrics(root);
        if (!metrics || !block) {
            return null;
        }

        if (!block.parentId) {
            return {
                x: ((Number(block.xPct) || 50) / 100) * metrics.viewportWidth,
                y: ((Number(block.yPct) || 50) / 100) * metrics.viewportHeight
            };
        }

        const parentBlock = Array.isArray(blocks)
            ? blocks.find(candidate => candidate?.id === block.parentId)
            : null;
        if (!parentBlock) {
            return {
                x: ((Number(block.xPct) || 50) / 100) * metrics.viewportWidth,
                y: ((Number(block.yPct) || 50) / 100) * metrics.viewportHeight
            };
        }

        const parentCenter = this.getCanvasBlockCenterPositionPx(parentBlock, blocks, root);
        if (!parentCenter) {
            return null;
        }

        const parentLayout = this.getCanvasBlockLayout(parentBlock);
        const childBlocks = this.getChildBlocks(parentBlock.id, blocks);
        const placements = this.getContainerChildPlacements(parentBlock, parentLayout, childBlocks);
        const placement = placements.find(candidate => candidate.childBlock.id === block.id);
        if (!placement) {
            return parentCenter;
        }

        const localOffsetX = placement.centerX - (parentLayout.width / 2);
        const localOffsetY = placement.centerY - (parentLayout.height / 2);
        const rotationRadians = (this.getCanvasBlockSceneRotation(parentBlock, blocks) * Math.PI) / 180;
        const rotatedOffsetX = (localOffsetX * Math.cos(rotationRadians)) - (localOffsetY * Math.sin(rotationRadians));
        const rotatedOffsetY = (localOffsetX * Math.sin(rotationRadians)) + (localOffsetY * Math.cos(rotationRadians));

        return {
            x: parentCenter.x + rotatedOffsetX,
            y: parentCenter.y + rotatedOffsetY
        };
    },

    getCanvasPercentPositionFromCenterPx(centerPosition, root = this.getRoot()) {
        const metrics = this.getCanvasLayoutMetrics(root);
        if (!metrics || !centerPosition) {
            return null;
        }

        return {
            xPct: Number(((centerPosition.x / metrics.viewportWidth) * 100).toFixed(4)),
            yPct: Number(((centerPosition.y / metrics.viewportHeight) * 100).toFixed(4))
        };
    },

    rebuildCanvasBlocksFromHierarchy(rootOrderIds, blocks) {
        const blockMap = blocks instanceof Map
            ? blocks
            : new Map((Array.isArray(blocks) ? blocks : []).map(block => [block.id, block]));
        const flatBlocks = Array.from(blockMap.values());
        const nextBlocks = [];
        const visited = new Set();
        const visit = blockId => {
            if (!blockId || visited.has(blockId)) {
                return;
            }

            const block = blockMap.get(blockId);
            if (!block) {
                return;
            }

            visited.add(blockId);
            nextBlocks.push(block);
            this.getChildBlocks(blockId, flatBlocks).forEach(childBlock => {
                visit(childBlock.id);
            });
        };

        const normalizedRootOrderIds = Array.isArray(rootOrderIds) && rootOrderIds.length
            ? rootOrderIds
            : this.getRootCanvasBlocks(flatBlocks).map(block => block.id);
        normalizedRootOrderIds.forEach(visit);
        this.getRootCanvasBlocks(flatBlocks).forEach(block => visit(block.id));
        flatBlocks.forEach(block => visit(block.id));
        return nextBlocks;
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

    shouldHandleCanvasDeleteShortcut(event) {
        if (!this.state.selectedBlockId || !event?.target) {
            return false;
        }

        const target = event.target;
        if (target.closest?.('input, textarea, select, button, a, [contenteditable="true"]')) {
            return false;
        }

        return target === document.body || Boolean(target.closest?.('.frame-editor-layout, .frame-editor-workspace-panel, [data-frame-editor-stage]'));
    },

    shouldHandleCanvasArrowShortcut(event) {
        if (!this.state.selectedBlockId || !event?.target || event.altKey || event.ctrlKey || event.metaKey) {
            return false;
        }

        const target = event.target;
        if (target.closest?.('input, textarea, select, button, a, [contenteditable="true"]')) {
            return false;
        }

        return target === document.body || Boolean(target.closest?.('.frame-editor-layout, .frame-editor-workspace-panel, [data-frame-editor-stage]'));
    },

    shouldHandleCanvasParentEscapeShortcut(event) {
        const selectedBlock = this.getSelectedBlock();
        if (!selectedBlock?.parentId || !event?.target) {
            return false;
        }

        const target = event.target;
        if (target.closest?.('input, textarea, select, button, a, [contenteditable="true"]')) {
            return false;
        }

        return target === document.body || Boolean(target.closest?.('.frame-editor-layout, .frame-editor-workspace-panel, [data-frame-editor-stage]'));
    },

    shouldHandleCanvasClipboardShortcut(event) {
        if (!event?.target) {
            return false;
        }

        const target = event.target;
        if (target.closest?.('input, textarea, select, button, a, [contenteditable="true"]')) {
            return false;
        }

        return target === document.body || Boolean(target.closest?.('.frame-editor-layout, .frame-editor-workspace-panel, [data-frame-editor-stage]'));
    },

    getCanvasBlockContentBounds(root = this.getRoot()) {
        const metrics = this.getCanvasLayoutMetrics(root);
        const rootBlocks = this.getRootCanvasBlocks();
        if (!metrics || !rootBlocks.length) {
            return null;
        }

        let bounds = null;
        rootBlocks.forEach(block => {
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
        if (blockElement && typeof blockElement.getBoundingClientRect === 'function') {
            const measuredElement = blockElement.querySelector('.frame-editor-text-block-surface, .frame-editor-qr-block-surface, .frame-editor-shape-block-surface, .frame-editor-image-block-surface, .frame-editor-line-block-surface, .frame-editor-container-block-surface') || blockElement;
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

    clampNestedBlockPosition(parentBlock, block, position, parentLayout = this.getCanvasBlockLayout(parentBlock), footprintOverride = null) {
        const frame = this.getContainerBlockInnerFrame(parentBlock, parentLayout);
        if (frame.width <= 0 || frame.height <= 0) {
            return {
                xPct: 50,
                yPct: 50
            };
        }

        const footprint = footprintOverride || this.getCanvasBlockFootprint(block);
        const nextXPct = Number(position?.xPct);
        const nextYPct = Number(position?.yPct);
        const fallbackXPct = Number(block?.xPct);
        const fallbackYPct = Number(block?.yPct);
        const normalizedXPct = Number.isFinite(nextXPct)
            ? nextXPct
            : (Number.isFinite(fallbackXPct) ? fallbackXPct : 50);
        const normalizedYPct = Number.isFinite(nextYPct)
            ? nextYPct
            : (Number.isFinite(fallbackYPct) ? fallbackYPct : 50);
        const halfWidthPct = ((Number(footprint?.width) || 0) / 2 / frame.width) * 100;
        const halfHeightPct = ((Number(footprint?.height) || 0) / 2 / frame.height) * 100;
        const minXPct = halfWidthPct >= 50 ? 50 : halfWidthPct;
        const maxXPct = halfWidthPct >= 50 ? 50 : (100 - halfWidthPct);
        const minYPct = halfHeightPct >= 50 ? 50 : halfHeightPct;
        const maxYPct = halfHeightPct >= 50 ? 50 : (100 - halfHeightPct);

        return {
            xPct: Number(this.clamp(normalizedXPct, minXPct, maxXPct).toFixed(4)),
            yPct: Number(this.clamp(normalizedYPct, minYPct, maxYPct).toFixed(4))
        };
    },

    clampCanvasBlockPosition(root, block, position, blockElement = null, footprintOverride = null) {
        const nextXPct = Number(position?.xPct);
        const nextYPct = Number(position?.yPct);
        const fallbackXPct = Number(block?.xPct);
        const fallbackYPct = Number(block?.yPct);
        const normalizedXPct = Number.isFinite(nextXPct)
            ? nextXPct
            : (Number.isFinite(fallbackXPct) ? fallbackXPct : 50);
        const normalizedYPct = Number.isFinite(nextYPct)
            ? nextYPct
            : (Number.isFinite(fallbackYPct) ? fallbackYPct : 50);

        return {
            xPct: Number(normalizedXPct.toFixed(4)),
            yPct: Number(normalizedYPct.toFixed(4))
        };
    },

    clampAllBlocksToCanvas(root = this.getRoot()) {
        const rootBlocks = this.getRootCanvasBlocks();
        if (!root || !rootBlocks.length) {
            return;
        }

        rootBlocks.forEach(block => {
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

    isSupportedComponentType(blockType) {
        return window.FrameEditorComponentCatalog?.isSupportedType?.(blockType)
            || this.COMPONENT_LIBRARY.some(component => component.type === blockType || component.className === blockType);
    },

    getFilteredBlocks(searchTerm = this.state.searchTerm) {
        const normalizedSearchTerm = String(searchTerm || '').trim().toLowerCase();
        if (!normalizedSearchTerm) {
            return this.COMPONENT_LIBRARY;
        }

        return this.COMPONENT_LIBRARY.filter(component => {
            const haystack = `${component.name} ${component.description}`.toLowerCase();
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

    openLoadJsonDialog(root = this.getRoot()) {
        this.state = {
            ...this.state,
            isLoadJsonDialogOpen: true,
            loadJsonDialogError: ''
        };
        this.renderIntoRoot();
        window.requestAnimationFrame(() => {
            const dialogRoot = root || this.getRoot();
            const input = dialogRoot?.querySelector?.('[data-frame-editor-load-json-input]');
            if (input) {
                input.focus();
                if (typeof input.select === 'function' && !this.loadJsonDialogDraftText) {
                    input.select();
                }
            }
        });
    },

    closeLoadJsonDialog() {
        if (!this.state.isLoadJsonDialogOpen && !this.state.loadJsonDialogError) {
            return;
        }

        this.state = {
            ...this.state,
            isLoadJsonDialogOpen: false,
            loadJsonDialogError: ''
        };
        this.renderIntoRoot();
    },

    async loadFrameFromJsonInput(root = this.getRoot()) {
        const textarea = root?.querySelector?.('[data-frame-editor-load-json-input]');
        const jsonText = String(textarea?.value || '');
        this.loadJsonDialogDraftText = jsonText;
        try {
            await this.loadFrameFromJsonText(jsonText);
        } catch (error) {
            this.handleLoadJsonError(error, root);
        }
    },

    async loadFrameFromJsonFile(file, root = this.getRoot()) {
        if (!file) {
            return;
        }

        try {
            const jsonText = await this.readFileAsText(file);
            this.loadJsonDialogDraftText = jsonText;
            await this.loadFrameFromJsonText(jsonText);
        } catch (error) {
            this.handleLoadJsonError(error, root);
        }
    },

    async loadFrameFromJsonText(jsonText) {
        const rawText = String(jsonText || '').trim();
        if (!rawText) {
            throw new Error(I18n.translateString('Paste JSON or choose a file.'));
        }

        let document;
        try {
            document = JSON.parse(rawText);
        } catch (error) {
            throw new Error(I18n.translateString('The JSON could not be parsed.'));
        }

        if (!document || typeof document !== 'object' || Array.isArray(document)) {
            throw new Error(I18n.translateString('The JSON must be an object exported from the frame editor.'));
        }

        const importedFrame = document.frame && typeof document.frame === 'object' ? document.frame : null;
        const importedCanvas = document.canvas && typeof document.canvas === 'object' ? document.canvas : null;
        const importedBlocks = Array.isArray(document.blocks)
            ? document.blocks.map(block => ({ ...block }))
            : null;

        if (!importedBlocks) {
            throw new Error(I18n.translateString('The JSON does not include any frame components.'));
        }

        let importedCustomFrameId = '';
        if (importedFrame?.frameType === QRFrames.FRAME_TYPES.CUSTOM) {
            if (document.customFrame?.dataUrl) {
                importedCustomFrameId = await this.restoreCustomFrameFromJson(document.customFrame, importedFrame);
            } else if (importedFrame.customFrameId) {
                const existingCustomFrame = QRFrames.customFrames.find(frame => frame.id === importedFrame.customFrameId);
                if (existingCustomFrame) {
                    QRFrames.setActiveCustomFrame(existingCustomFrame.id);
                    importedCustomFrameId = existingCustomFrame.id;
                } else {
                    throw new Error(I18n.translateString('The JSON is missing the custom frame image data.'));
                }
            } else {
                throw new Error(I18n.translateString('The JSON is missing the custom frame image data.'));
            }
        } else if (importedFrame?.customFrameId) {
            const existingCustomFrame = QRFrames.customFrames.find(frame => frame.id === importedFrame.customFrameId);
            if (existingCustomFrame) {
                QRFrames.setActiveCustomFrame(existingCustomFrame.id);
                importedCustomFrameId = existingCustomFrame.id;
            }
        }

        this.framePreviewCache.clear();
        this.frameLibraryCache = null;

        const allFrames = this.getAllFrames(false);
        const selectedFrameKey = this.resolveImportedFrameKey(importedFrame, importedCustomFrameId, allFrames);
        const nextCanvasBlocks = importedBlocks.map(block => this.cloneBlockData(block)).filter(Boolean);

        this.applyImportedFrameDesign(importedFrame, document.frameCustomization, document.frameQRRect);
        this.blockIdCounter = this.getImportedBlockCounter(nextCanvasBlocks);

        this.state = {
            ...this.state,
            canvasBackgroundColor: this.normalizeLoadedColor(importedCanvas?.backgroundColor, this.state.canvasBackgroundColor),
            canvasGridColor: this.normalizeLoadedColor(importedCanvas?.gridColor, this.state.canvasGridColor),
            canvasGridOpacity: this.normalizeLoadedNumber(importedCanvas?.gridOpacity, this.state.canvasGridOpacity, 0, 0.3),
            canvasGridBaseSize: this.normalizeLoadedNumber(importedCanvas?.gridBaseSize, this.state.canvasGridBaseSize, 16, 64),
            canvasBlocks: nextCanvasBlocks,
            selectedFrameKey,
            selectedBlockId: '',
            selectedCanvas: false,
            selectedQrBlockId: '',
            selectedTextBlockId: '',
            loadJsonDialogError: '',
            isLoadJsonDialogOpen: false
        };
        this.loadJsonDialogDraftText = '';
        this.renderIntoRoot();
        window.requestAnimationFrame(() => {
            const root = this.getRoot();
            if (nextCanvasBlocks.length) {
                this.fitCanvasToBlocks(root);
                return;
            }

            this.resetCanvasView(root);
        });
        this.showToast(I18n.translateString('Frame JSON loaded.'));
    },

    applyImportedFrameDesign(importedFrame, frameCustomization, frameQRRect) {
        const frameType = typeof importedFrame?.frameType === 'string'
            ? importedFrame.frameType
            : '';
        if (!frameType) {
            return;
        }

        if (frameCustomization && typeof frameCustomization === 'object' && !Array.isArray(frameCustomization)) {
            QRFrames.setFrameCustomization(frameType, frameCustomization);
        } else {
            QRFrames.resetFrameToDefaults(frameType);
        }

        if (frameQRRect && typeof frameQRRect === 'object' && !Array.isArray(frameQRRect)) {
            QRFrames.setFrameQRRect(frameType, frameQRRect);
            return;
        }

        QRFrames.resetFrameQRRect(frameType);
    },

    handleLoadJsonError(error, root = this.getRoot()) {
        const message = error instanceof Error
            ? error.message
            : I18n.translateString('Failed to load frame JSON.');

        this.state = {
            ...this.state,
            isLoadJsonDialogOpen: true,
            loadJsonDialogError: message
        };
        this.renderIntoRoot();
        window.requestAnimationFrame(() => {
            const dialogRoot = root || this.getRoot();
            const input = dialogRoot?.querySelector?.('[data-frame-editor-load-json-input]');
            if (input) {
                input.focus();
            }
        });
        this.showToast(message, 'error');
    },

    async restoreCustomFrameFromJson(customFrame, importedFrame) {
        if (!customFrame || typeof customFrame !== 'object' || !customFrame.dataUrl) {
            throw new Error(I18n.translateString('The JSON is missing the custom frame image data.'));
        }

        const frameName = String(customFrame.name || importedFrame?.name || I18n.translateString('Custom'));
        const loadedCustomFrame = await QRFrames.loadCustomFrameFromDataUrl(customFrame.dataUrl, { name: frameName });
        if (!loadedCustomFrame) {
            throw new Error(I18n.translateString('The custom frame image could not be loaded.'));
        }

        const importedCustomFrameId = String(customFrame.id || loadedCustomFrame.id);
        QRFrames.customFrames = QRFrames.customFrames.filter(frame => frame.id !== loadedCustomFrame.id && frame.id !== importedCustomFrameId);
        loadedCustomFrame.id = importedCustomFrameId;

        if (customFrame.qrRect) {
            const nextQrRect = { ...customFrame.qrRect };
            loadedCustomFrame.qrRect = typeof QRFrames.clampFrameQRRect === 'function'
                ? QRFrames.clampFrameQRRect(nextQrRect, loadedCustomFrame.naturalHeight / loadedCustomFrame.naturalWidth || 1)
                : nextQrRect;
        }

        QRFrames.customFrames.unshift(loadedCustomFrame);
        QRFrames.setActiveCustomFrame(loadedCustomFrame.id);
        return loadedCustomFrame.id;
    },

    resolveImportedFrameKey(importedFrame, importedCustomFrameId, allFrames = this.getAllFrames(false)) {
        if (!Array.isArray(allFrames) || !allFrames.length) {
            return '';
        }

        const customFrameId = importedCustomFrameId || importedFrame?.customFrameId || '';
        if (importedFrame?.frameType === QRFrames.FRAME_TYPES.CUSTOM && customFrameId) {
            const customFrameKey = `custom:${customFrameId}`;
            if (allFrames.some(frame => frame.key === customFrameKey)) {
                return customFrameKey;
            }
        }

        if (importedFrame?.key && allFrames.some(frame => frame.key === importedFrame.key)) {
            return importedFrame.key;
        }

        if (importedFrame?.frameType) {
            const matchingFrame = allFrames.find(frame => frame.frameType === importedFrame.frameType && (!customFrameId || frame.customFrameId === customFrameId));
            if (matchingFrame) {
                return matchingFrame.key;
            }
        }

        return this.resolveSelectedFrameKey(allFrames);
    },

    getImportedBlockCounter(blocks = []) {
        return blocks.reduce((maxValue, block) => {
            const match = String(block?.id || '').match(/^block-(\d+)$/);
            if (!match) {
                return maxValue;
            }

            const parsed = Number.parseInt(match[1], 10);
            return Number.isFinite(parsed) ? Math.max(maxValue, parsed) : maxValue;
        }, 0);
    },

    normalizeLoadedColor(value, fallback) {
        const normalized = String(value || '').trim();
        return /^#[0-9a-f]{6}$/i.test(normalized) || /^#[0-9a-f]{3}$/i.test(normalized)
            ? normalized
            : fallback;
    },

    normalizeLoadedNumber(value, fallback, min, max) {
        const parsed = Number.parseFloat(value);
        if (!Number.isFinite(parsed)) {
            return fallback;
        }

        return this.clamp(parsed, min, max);
    },

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(reader.error || new Error('Unable to read file.'));
            reader.readAsText(file);
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
