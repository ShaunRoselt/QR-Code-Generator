"use strict";

const QRCodeFrameControls = {
    qrCodeWrapped: false,
    activeFrameRefreshRequests: new WeakMap(),
    framePreviewRefreshRequests: new WeakMap(),

    updateStylingVisibility(root = document, frameType = this.getActiveFrameType(root)) {
        if (!window.QRFrames) {
            return;
        }

        const showTextSettings = window.QRFrames.supportsFrameText(frameType);
        root.querySelectorAll('[data-frame-setting="textColor"]').forEach(section => {
            section.hidden = !showTextSettings;
        });

        const stageText = root.querySelector('#customFrameStageText');
        if (stageText) {
            stageText.hidden = !showTextSettings;
            stageText.contentEditable = showTextSettings ? 'true' : 'false';
            stageText.dataset.placeholder = showTextSettings
                ? I18n.translateString('Edit frame text')
                : '';
        }

        this.syncStageTextEditor(root, frameType);
    },

    normalizeInlineFrameText(value) {
        return String(value || '')
            .replace(/\r\n?/g, '\n')
            .replace(/\u00a0/g, ' ')
            .slice(0, 160);
    },

    setStageTextContent(stageText, value) {
        if (!stageText) {
            return;
        }

        const normalizedValue = this.normalizeInlineFrameText(value);
        if (stageText.textContent !== normalizedValue) {
            stageText.textContent = normalizedValue;
        }
    },

    syncStageTextEditor(root = document, frameType = this.getActiveFrameType(root), stageMetrics = null) {
        if (!window.QRFrames) {
            return;
        }

        const stage = root.querySelector('#customFrameStage');
        const stageText = root.querySelector('#customFrameStageText');
        const moveHandle = root.querySelector('#customFrameStageTextMoveHandle');
        if (!stage || !stageText) {
            return;
        }

        if (!frameType || !window.QRFrames.supportsFrameText(frameType)) {
            stageText.hidden = true;
            if (moveHandle) {
                moveHandle.hidden = true;
            }
            return;
        }

        const metrics = stageMetrics || this.getCustomFrameStageMetrics(stage);
        const textLayout = metrics ? window.QRFrames.getFrameTextLayout(frameType, metrics.width) : null;
        if (!metrics || !textLayout) {
            stageText.hidden = true;
            if (moveHandle) {
                moveHandle.hidden = true;
            }
            return;
        }

        stageText.hidden = false;
        stageText.style.left = `${textLayout.left}px`;
        stageText.style.top = `${textLayout.top}px`;
        stageText.style.width = `${textLayout.width}px`;
        stageText.style.height = `${textLayout.height}px`;
        stageText.style.fontSize = `${textLayout.fontSize}px`;
        stageText.style.lineHeight = `${textLayout.fontSize * 1.15}px`;
        stageText.style.fontWeight = textLayout.fontWeight;
        stageText.style.fontFamily = textLayout.fontFamily;
        stageText.style.textAlign = textLayout.align || 'center';
        stageText.style.color = textLayout.color;
        stageText.style.transform = textLayout.rotation ? `rotate(${textLayout.rotation}deg)` : 'none';
        if (moveHandle) {
            moveHandle.hidden = false;
            moveHandle.style.left = `${textLayout.left - 14}px`;
            moveHandle.style.top = `${textLayout.top - 14}px`;
        }
    },

    autoSizeStageTextEditor(root = document, frameType = this.getActiveFrameType(root)) {
        if (!window.QRFrames?.supportsFrameText(frameType)) {
            return;
        }

        const stage = root.querySelector('#customFrameStage');
        const stageText = root.querySelector('#customFrameStageText');
        if (!stage || !stageText) {
            return;
        }

        const stageMetrics = this.getCustomFrameStageMetrics(stage);
        if (!stageMetrics) {
            return;
        }

        const currentRect = window.QRFrames.getFrameTextRect(frameType, stageMetrics.width);
        if (!currentRect) {
            return;
        }

        const measuredHeight = Math.max(currentRect.height, stageText.scrollHeight + 4);
        const measuredWidth = Math.max(currentRect.width, Math.min(stageMetrics.width * 0.92, stageText.scrollWidth + 12));
        const nextRect = window.QRFrames.setFrameTextRect(frameType, {
            width: measuredWidth,
            height: measuredHeight
        }, stageMetrics.width);
        if (!nextRect) {
            return;
        }

        this.syncStageTextEditor(root, frameType, stageMetrics);
    },

    notifyFrameEditorChange(root = document) {
        this.applySettings(root);
        this.autoSizeStageTextEditor(root);
        this.syncStageTextEditor(root);
        this.scheduleFramePreviewSampleRefresh(root);
        this.scheduleActiveFrameRefresh(root);
        window.QRFrames.updateDeveloperJsonViewer?.();
    },

    getStageRotationFromPointer(interactionRect, stageMetrics, event) {
        const rectLeft = interactionRect.xPct * stageMetrics.width;
        const rectTop = interactionRect.yPct * stageMetrics.height;
        const rectWidth = interactionRect.widthPct * stageMetrics.width;
        const rectHeight = interactionRect.heightPct * stageMetrics.height;
        const centerX = rectLeft + (rectWidth / 2);
        const centerY = rectTop + (rectHeight / 2);
        const pointerX = event.clientX - stageMetrics.left;
        const pointerY = event.clientY - stageMetrics.top;
        const angle = (Math.atan2(pointerY - centerY, pointerX - centerX) * 180 / Math.PI) + 90;
        return window.QRFrames.normalizeQRRotation(angle);
    },

    init(root = document) {
        if (!window.QRFrames) {
            return;
        }

        const stageText = root.querySelector('#customFrameStageText');
        const frameForegroundColorControl = FrameColorControl.getControl(root, 'frameForegroundColor');
        const frameBackgroundColorControl = FrameColorControl.getControl(root, 'frameBackgroundColor');
        const frameTextColorControl = FrameColorControl.getControl(root, 'frameTextColor');

        if (!stageText || !frameForegroundColorControl || !frameBackgroundColorControl || !frameTextColorControl) {
            return;
        }

        if (stageText.dataset.frameControlsInitialized !== 'true') {
            stageText.addEventListener('input', () => {
                const normalizedValue = this.normalizeInlineFrameText(stageText.textContent);
                if (stageText.textContent !== normalizedValue) {
                    stageText.textContent = normalizedValue;
                }
                this.notifyFrameEditorChange(root);
            });

            FrameColorControl.bindControl(frameForegroundColorControl, () => this.notifyFrameEditorChange(root));
            FrameColorControl.bindControl(frameBackgroundColorControl, () => this.notifyFrameEditorChange(root));
            FrameColorControl.bindControl(frameTextColorControl, () => this.notifyFrameEditorChange(root), { markUserModified: true });

            const frameSelector = root.querySelector('#frameSelector');
            const frameSearchInput = root.querySelector('#framePresetSearchInput');
            const frameSearchEmpty = root.querySelector('#framePresetSearchEmpty');
            if (frameSelector && frameSelector.dataset.frameSyncBound !== 'true') {
                frameSelector.addEventListener('click', (event) => {
                    const deleteAction = event.target.closest('[data-frame-delete="true"]');
                    if (deleteAction?.dataset.customFrameId) {
                        event.preventDefault();
                        event.stopPropagation();
                        const removedFrameId = deleteAction.dataset.customFrameId;
                        const wasActiveFrame = window.QRFrames.activeCustomFrameId === removedFrameId;
                        const removed = window.QRFrames.deleteCustomFrame(removedFrameId);
                        if (!removed) {
                            return;
                        }
                        const shell = deleteAction.closest('.frame-card-shell-custom');
                        shell?.remove();
                        if (wasActiveFrame) {
                            if (window.QRFrames.hasCustomFrame()) {
                                this.activateFrameByType(root, 'custom');
                            } else {
                                this.activateFrameByType(root, 'none');
                            }
                        }
                        this.updatePositionPanelVisibility(root, this.getActiveFrameType(root));
                        this.applyFrameSearch(root, frameSearchInput, frameSearchEmpty);
                        return;
                    }

                    const card = event.target.closest('.frame-card');
                    if (!card || !card.dataset.frame) {
                        return;
                    }
                    const previousActiveCard = frameSelector.querySelector('.frame-card.active');
                    const previousFrameType = previousActiveCard?.dataset.frame || this.getActiveFrameType(root);
                    if (previousActiveCard && previousActiveCard !== card) {
                        previousActiveCard.classList.remove('active');
                        window.QRFrames.resetFramePreviewCard(previousActiveCard);
                    }
                    card.classList.add('active');
                    this.applySettings(root, previousFrameType);
                    if (card.dataset.frame === 'custom' && card.dataset.customFrameId) {
                        window.QRFrames.setActiveCustomFrame(card.dataset.customFrameId);
                    }
                    window.QRFrames.applyFrameCustomization(card.dataset.frame);
                    this.syncControlValues(root, card.dataset.frame);
                    this.updateStylingVisibility(root, card.dataset.frame);
                    this.updatePositionPanelVisibility(root, card.dataset.frame);
                    this.scheduleFramePreviewSampleRefresh(root);
                    this.scheduleActiveFrameRefresh(root);
                    window.QRFrames.updateDeveloperJsonViewer?.();
                }, true);
                frameSelector.dataset.frameSyncBound = 'true';
            }

            if (frameSearchInput && frameSearchInput.dataset.frameSearchBound !== 'true') {
                frameSearchInput.addEventListener('input', () => {
                    this.applyFrameSearch(root, frameSearchInput, frameSearchEmpty);
                });
                frameSearchInput.dataset.frameSearchBound = 'true';
            }

            this.initCustomFrameControls(root);
            this.applyFrameSearch(root, frameSearchInput, frameSearchEmpty);

            stageText.dataset.frameControlsInitialized = 'true';
        }

        const activeFrameType = this.getActiveFrameType(root);
        window.QRFrames.applyFrameCustomization(activeFrameType);
        this.syncControlValues(root, activeFrameType);
        this.updateStylingVisibility(root, activeFrameType);
        this.applySettings(root);
        this.updatePositionPanelVisibility(root, activeFrameType);
    },

    updatePositionPanelVisibility(root = document, frameType = this.getActiveFrameType(root)) {
        const panel = root.querySelector('#customFramePositionPanel');
        if (!panel) {
            return;
        }
        const shouldShow = Boolean(frameType) && (frameType !== 'custom' || window.QRFrames.hasCustomFrame());
        panel.hidden = !shouldShow;
        if (shouldShow) {
            this.updateCustomFrameStage(root, frameType);
        }
    },

    initCustomFrameControls(root = document) {
        const fileInput = root.querySelector('#customFrameInput');
        const selector = root.querySelector('#frameSelector');
        if (!fileInput || !selector) {
            return;
        }

        // Upload action delegated through frame selector clicks
        if (selector.dataset.customUploadBound !== 'true') {
            selector.addEventListener('click', (event) => {
                const action = event.target.closest('[data-frame-action="upload-custom"]');
                if (!action) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                fileInput.click();
            });
            selector.addEventListener('keydown', (event) => {
                const action = event.target.closest('[data-frame-action="upload-custom"]');
                if (!action) {
                    return;
                }
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    fileInput.click();
                }
            });
            selector.dataset.customUploadBound = 'true';
        }

        if (fileInput.dataset.customFrameInitialized !== 'true') {
            fileInput.addEventListener('change', async (event) => {
                const [file] = event.target.files || [];
                if (!file) {
                    return;
                }
                const loaded = await window.QRFrames.loadCustomFrameFile(file);
                fileInput.value = '';
                if (!loaded) {
                    return;
                }
                this.installCustomFrameCard(root);
                this.activateFrameByType(root, 'custom');
                this.updatePositionPanelVisibility(root, 'custom');
                this.updateCustomFrameStage(root);
            });
            fileInput.dataset.customFrameInitialized = 'true';
        }

        this.bindPositionStage(root);

        const centerBtn = root.querySelector('#customFrameCenterButton');
        if (centerBtn && centerBtn.dataset.customFrameCenterBound !== 'true') {
            centerBtn.addEventListener('click', () => {
                const frameType = this.getActiveFrameType(root);
                const rect = window.QRFrames.getFrameQRRect(frameType);
                const range = window.QRFrames.getFrameQRRectRange(frameType, rect);
                const centeredX = 0.5 - (rect.widthPct / 2);
                const centeredY = 0.5 - (rect.heightPct / 2);
                this.updateFramePlacementFromControls(root, {
                    xPct: Math.min(range.maxXPct, Math.max(range.minXPct, centeredX)),
                    yPct: Math.min(range.maxYPct, Math.max(range.minYPct, centeredY))
                });
            });
            centerBtn.dataset.customFrameCenterBound = 'true';
        }

        const resetBtn = root.querySelector('#customFrameResetButton');
        if (resetBtn && resetBtn.dataset.customFrameResetBound !== 'true') {
            resetBtn.addEventListener('click', () => {
                const frameType = this.getActiveFrameType(root);
                window.QRFrames.resetFrameToDefaults(frameType);
                window.QRFrames.resetFrameQRRect(frameType);
                window.QRFrames.resetFrameTextRect(frameType);
                this.syncControlValues(root, frameType);
                this.syncCustomFrameStageBox(root);
                this.updateCustomFrameStage(root, frameType);
                this.updateFramePreviewSamples();
                this.triggerActiveFrameRefresh(root);
                window.QRFrames.updateDeveloperJsonViewer?.();
            });
            resetBtn.dataset.customFrameResetBound = 'true';
        }

        // Apply visibility on initial render
        this.updatePositionPanelVisibility(root, this.getActiveFrameType(root));
    },

    installCustomFrameCard(root = document) {
        const grid = root.querySelector('#frameSelector');
        if (!grid) {
            return;
        }
        grid.querySelectorAll('.frame-card[data-custom-frame="true"]').forEach(card => card.closest('.frame-card-shell-custom')?.remove());
        const uploadTile = grid.querySelector('[data-frame-action="upload-custom"]');
        let insertAfter = uploadTile;
        window.QRFrames.customFrames.forEach(frame => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = window.QRFrames.getCustomFrameCardMarkup(frame).trim();
            const card = wrapper.firstElementChild;
            if (!card) {
                return;
            }
            if (insertAfter?.nextSibling) {
                grid.insertBefore(card, insertAfter.nextSibling);
            } else if (uploadTile) {
                grid.appendChild(card);
            } else {
                grid.appendChild(card);
            }
            insertAfter = card;
        });
        this.applyFrameSearch(root, root.querySelector('#framePresetSearchInput'), root.querySelector('#framePresetSearchEmpty'));
    },

    updateCustomFrameStage(root = document, frameType = this.getActiveFrameType(root)) {
        const stage = root.querySelector('#customFrameStage');
        const img = root.querySelector('#customFrameStageImage');
        if (!stage || !img || !frameType) {
            return;
        }
        const dataUrl = window.QRFrames.getPlacementStageImageDataUrl(frameType, 300, { omitText: true });
        if (!dataUrl) {
            return;
        }
        img.src = dataUrl;
        img.alt = frameType === 'custom'
            ? I18n.translateString('Custom frame placement preview')
            : I18n.translateString('Frame placement preview');
        if (img.complete) {
            this.syncCustomFrameStageBox(root, frameType);
        } else {
            img.addEventListener('load', () => this.syncCustomFrameStageBox(root, frameType), { once: true });
        }
    },

    getCustomFrameStageMetrics(stage) {
        if (!stage) {
            return null;
        }

        const stageRect = stage.getBoundingClientRect();
        const width = stage.clientWidth;
        const height = stage.clientHeight;

        if (!width || !height) {
            return null;
        }

        return {
            width,
            height,
            left: stageRect.left + stage.clientLeft,
            top: stageRect.top + stage.clientTop
        };
    },

    syncCustomFrameStageBox(root = document, frameType = this.getActiveFrameType(root), remainingRetries = 2) {
        const stage = root.querySelector('#customFrameStage');
        const box = root.querySelector('#customFrameQRBox');
        const boxChrome = root.querySelector('#customFrameQRBoxChrome');
        if (!stage || !box || !frameType) {
            return;
        }
        const stageMetrics = this.getCustomFrameStageMetrics(stage);
        if (!stageMetrics) {
            if (remainingRetries > 0) {
                window.requestAnimationFrame(() => this.syncCustomFrameStageBox(root, frameType, remainingRetries - 1));
            }
            return;
        }
        const qrRect = window.QRFrames.getFrameQRRect(frameType);
        const widthPx = qrRect.widthPct * stageMetrics.width;
        const heightPx = qrRect.heightPct * stageMetrics.height;
        const leftPx = qrRect.xPct * stageMetrics.width;
        const topPx = qrRect.yPct * stageMetrics.height;
        box.style.width = `${widthPx}px`;
        box.style.height = `${heightPx}px`;
        box.style.left = `${leftPx}px`;
        box.style.top = `${topPx}px`;
        if (boxChrome) {
            const qrRotation = window.QRFrames.getFrameCustomization(frameType).qrRotation || 0;
            boxChrome.style.transform = qrRotation ? `rotate(${qrRotation}deg)` : 'none';
        }

        this.syncStageTextEditor(root, frameType, stageMetrics);
    },

    updateFramePlacementFromControls(root = document, partial = {}) {
        const frameType = this.getActiveFrameType(root);
        if (!frameType) {
            return;
        }
        window.QRFrames.setFrameQRRect(frameType, partial);
        this.syncCustomFrameStageBox(root);
        this.scheduleFramePreviewSampleRefresh(root);
        this.scheduleActiveFrameRefresh(root);
    },

    scheduleActiveFrameRefresh(root = document) {
        if (this.activeFrameRefreshRequests.has(root)) {
            return;
        }

        const refreshRequest = window.requestAnimationFrame(() => {
            this.activeFrameRefreshRequests.delete(root);
            this.triggerActiveFrameRefresh(root);
        });

        this.activeFrameRefreshRequests.set(root, refreshRequest);
    },

    scheduleFramePreviewSampleRefresh(root = document) {
        if (this.framePreviewRefreshRequests.has(root)) {
            return;
        }

        const refreshRequest = window.requestAnimationFrame(() => {
            this.framePreviewRefreshRequests.delete(root);
            this.updateFramePreviewSamples(root);
        });

        this.framePreviewRefreshRequests.set(root, refreshRequest);
    },

    bindPositionStage(root = document) {
        const stage = root.querySelector('#customFrameStage');
        const box = root.querySelector('#customFrameQRBox');
        const stageTextMoveHandle = root.querySelector('#customFrameStageTextMoveHandle');
        if (!stage || !box || stage.dataset.customStageBound === 'true') {
            return;
        }
        stage.dataset.customStageBound = 'true';

        let interactionMode = '';
        let pointerId = null;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let resizeHandle = '';
        let interactionRect = null;
        let rotationOffset = 0;
        let textDragOffsetX = 0;
        let textDragOffsetY = 0;
        let textInteractionRect = null;

        const onPointerDown = (event) => {
            const frameType = this.getActiveFrameType(root);
            if (!frameType) {
                return;
            }
            const textMoveHandleElement = event.target.closest('#customFrameStageTextMoveHandle');
            const rotateHandleElement = event.target.closest('[data-placement-rotate-handle]');
            const resizeHandleElement = event.target.closest('[data-placement-resize-handle]');
            resizeHandle = resizeHandleElement?.dataset.placementResizeHandle || '';
            interactionRect = window.QRFrames.getFrameQRRect(frameType);
            pointerId = event.pointerId;

            if (textMoveHandleElement) {
                const stageMetrics = this.getCustomFrameStageMetrics(stage);
                if (!stageMetrics) {
                    return;
                }
                interactionMode = 'move-text';
                textInteractionRect = window.QRFrames.getFrameTextRect(frameType, stageMetrics.width);
                const handleRect = textMoveHandleElement.getBoundingClientRect();
                textDragOffsetX = event.clientX - handleRect.left + 14;
                textDragOffsetY = event.clientY - handleRect.top + 14;
                stage.setPointerCapture(pointerId);
                event.preventDefault();
                return;
            }

            if (rotateHandleElement) {
                const stageMetrics = this.getCustomFrameStageMetrics(stage);
                if (!stageMetrics) {
                    return;
                }
                interactionMode = 'rotate';
                const currentRotation = window.QRFrames.getFrameCustomization(frameType).qrRotation || 0;
                rotationOffset = currentRotation - this.getStageRotationFromPointer(interactionRect, stageMetrics, event);
                box.setPointerCapture(pointerId);
                event.preventDefault();
                return;
            }

            interactionMode = resizeHandle ? 'resize' : 'move';
            const boxRect = box.getBoundingClientRect();
            dragOffsetX = event.clientX - boxRect.left;
            dragOffsetY = event.clientY - boxRect.top;
            box.setPointerCapture(pointerId);
            event.preventDefault();
        };

        const onPointerMove = (event) => {
            if (!interactionMode) {
                return;
            }
            const stageMetrics = this.getCustomFrameStageMetrics(stage);
            if (!stageMetrics) {
                return;
            }
            const frameType = this.getActiveFrameType(root);
            if (interactionMode === 'move-text') {
                if (!textInteractionRect) {
                    return;
                }
                const nextRect = window.QRFrames.setFrameTextRect(frameType, {
                    x: event.clientX - stageMetrics.left - textDragOffsetX,
                    y: event.clientY - stageMetrics.top - textDragOffsetY
                }, stageMetrics.width);
                if (!nextRect) {
                    return;
                }
                this.syncStageTextEditor(root, frameType, stageMetrics);
                this.scheduleFramePreviewSampleRefresh(root);
                this.scheduleActiveFrameRefresh(root);
                return;
            }
            if (interactionMode === 'rotate') {
                if (!interactionRect) {
                    return;
                }
                const nextRotation = this.getStageRotationFromPointer(interactionRect, stageMetrics, event) + rotationOffset;
                window.QRFrames.setFrameCustomization(frameType, {
                    qrRotation: nextRotation
                });
                this.syncCustomFrameStageBox(root);
                this.scheduleFramePreviewSampleRefresh(root);
                this.scheduleActiveFrameRefresh(root);
                return;
            }
            if (interactionMode === 'resize') {
                if (!interactionRect) {
                    return;
                }
                const minSidePx = 16;
                const pointerX = event.clientX - stageMetrics.left;
                const pointerY = event.clientY - stageMetrics.top;
                const startLeft = interactionRect.xPct * stageMetrics.width;
                const startTop = interactionRect.yPct * stageMetrics.height;
                const startWidth = interactionRect.widthPct * stageMetrics.width;
                const startHeight = interactionRect.heightPct * stageMetrics.height;
                const startRight = startLeft + startWidth;
                const startBottom = startTop + startHeight;
                let nextLeft = startLeft;
                let nextTop = startTop;
                let nextWidthPx = startWidth;
                let nextHeightPx = startHeight;

                if (resizeHandle === 'top-left') {
                    nextLeft = Math.min(startRight - minSidePx, pointerX);
                    nextTop = Math.min(startBottom - minSidePx, pointerY);
                    nextWidthPx = startRight - nextLeft;
                    nextHeightPx = startBottom - nextTop;
                } else if (resizeHandle === 'top-right') {
                    nextTop = Math.min(startBottom - minSidePx, pointerY);
                    nextWidthPx = Math.max(minSidePx, pointerX - startLeft);
                    nextHeightPx = startBottom - nextTop;
                } else if (resizeHandle === 'bottom-left') {
                    nextLeft = Math.min(startRight - minSidePx, pointerX);
                    nextWidthPx = startRight - nextLeft;
                    nextHeightPx = Math.max(minSidePx, pointerY - startTop);
                } else if (resizeHandle === 'bottom-right') {
                    nextWidthPx = Math.max(minSidePx, pointerX - startLeft);
                    nextHeightPx = Math.max(minSidePx, pointerY - startTop);
                } else if (resizeHandle === 'top') {
                    nextTop = Math.min(startBottom - minSidePx, pointerY);
                    nextHeightPx = startBottom - nextTop;
                } else if (resizeHandle === 'right') {
                    nextWidthPx = Math.max(minSidePx, pointerX - startLeft);
                } else if (resizeHandle === 'bottom') {
                    nextHeightPx = Math.max(minSidePx, pointerY - startTop);
                } else if (resizeHandle === 'left') {
                    nextLeft = Math.min(startRight - minSidePx, pointerX);
                    nextWidthPx = startRight - nextLeft;
                } else {
                    nextWidthPx = Math.max(minSidePx, pointerX - startLeft);
                    nextHeightPx = Math.max(minSidePx, pointerY - startTop);
                }

                window.QRFrames.setFrameQRRect(frameType, {
                    xPct: nextLeft / stageMetrics.width,
                    yPct: nextTop / stageMetrics.height,
                    widthPct: nextWidthPx / stageMetrics.width,
                    heightPct: nextHeightPx / stageMetrics.height
                });
                this.syncCustomFrameStageBox(root);
                this.scheduleFramePreviewSampleRefresh(root);
                this.scheduleActiveFrameRefresh(root);
                return;
            }
            const newLeft = event.clientX - stageMetrics.left - dragOffsetX;
            const newTop = event.clientY - stageMetrics.top - dragOffsetY;
            const xPct = newLeft / stageMetrics.width;
            const yPct = newTop / stageMetrics.height;
            window.QRFrames.setFrameQRRect(frameType, { xPct, yPct });
            this.syncCustomFrameStageBox(root);
            this.scheduleFramePreviewSampleRefresh(root);
            this.scheduleActiveFrameRefresh(root);
        };

        const onPointerUp = (event) => {
            if (!interactionMode) {
                return;
            }
            const activePointerId = pointerId;
            const completedMode = interactionMode;
            interactionMode = '';
            resizeHandle = '';
            interactionRect = null;
            rotationOffset = 0;
            textInteractionRect = null;
            try {
                if (activePointerId !== null) {
                    if (completedMode === 'move-text') {
                        stage.releasePointerCapture(activePointerId);
                    } else {
                        box.releasePointerCapture(activePointerId);
                    }
                }
            } catch (_) { /* ignore */ }
            pointerId = null;
            this.triggerActiveFrameRefresh(root);
        };

        box.addEventListener('keydown', (event) => {
            const frameType = this.getActiveFrameType(root);
            if (!frameType) {
                return;
            }
            const step = event.shiftKey ? 0.05 : 0.01;
            const rect = window.QRFrames.getFrameQRRect(frameType);
            const updates = {
                ArrowLeft: { xPct: rect.xPct - step },
                ArrowRight: { xPct: rect.xPct + step },
                ArrowUp: { yPct: rect.yPct - step },
                ArrowDown: { yPct: rect.yPct + step }
            };
            if (!updates[event.key]) {
                return;
            }
            event.preventDefault();
            this.updateFramePlacementFromControls(root, updates[event.key]);
        });

        const rotateHandle = root.querySelector('#customFrameQRRotateHandle');
        if (rotateHandle && rotateHandle.dataset.rotateKeyBound !== 'true') {
            rotateHandle.addEventListener('keydown', (event) => {
                const frameType = this.getActiveFrameType(root);
                if (!frameType) {
                    return;
                }

                const step = event.shiftKey ? 15 : 1;
                let delta = 0;
                if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                    delta = -step;
                } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                    delta = step;
                }

                if (!delta) {
                    return;
                }

                event.preventDefault();
                const currentRotation = window.QRFrames.getFrameCustomization(frameType).qrRotation || 0;
                window.QRFrames.setFrameCustomization(frameType, {
                    qrRotation: currentRotation + delta
                });
                this.syncCustomFrameStageBox(root);
                this.scheduleFramePreviewSampleRefresh(root);
                this.scheduleActiveFrameRefresh(root);
            });
            rotateHandle.dataset.rotateKeyBound = 'true';
        }

        box.addEventListener('pointerdown', onPointerDown);
        box.addEventListener('pointermove', onPointerMove);
        box.addEventListener('pointerup', onPointerUp);
        box.addEventListener('pointercancel', onPointerUp);
        if (stageTextMoveHandle) {
            stageTextMoveHandle.addEventListener('pointerdown', onPointerDown);
            stage.addEventListener('pointermove', onPointerMove);
            stage.addEventListener('pointerup', onPointerUp);
            stage.addEventListener('pointercancel', onPointerUp);
        }
    },

    activateFrameByType(root = document, frameType) {
        const grid = root.querySelector('#frameSelector');
        if (!grid) {
            return;
        }
        const target = grid.querySelector(`.frame-card[data-frame="${frameType}"]`);
        if (!target) {
            return;
        }
        target.click();
    },

    syncControlValues(root = document, frameType = this.getActiveFrameType(root)) {
        if (!window.QRFrames) {
            return;
        }

        const stageText = root.querySelector('#customFrameStageText');
        const frameForegroundColorControl = FrameColorControl.getControl(root, 'frameForegroundColor');
        const frameBackgroundColorControl = FrameColorControl.getControl(root, 'frameBackgroundColor');
        const frameTextColorControl = FrameColorControl.getControl(root, 'frameTextColor');

        if (!stageText || !frameForegroundColorControl || !frameBackgroundColorControl || !frameTextColorControl) {
            return;
        }

        const customization = window.QRFrames.getFrameCustomization(frameType);

        this.setStageTextContent(stageText, customization.frameText);
        FrameColorControl.setValue(frameForegroundColorControl, customization.frameColor);
        FrameColorControl.setValue(frameBackgroundColorControl, customization.backgroundColor);
        frameTextColorControl.picker.dataset.userModified = customization.textColor ? 'true' : 'false';
        FrameColorControl.setValue(
            frameTextColorControl,
            customization.textColor || window.QRFrames.getDefaultTextColor(frameType, customization.frameColor)
        );
        this.syncStageTextEditor(root, frameType);
    },

    applySettings(root = document, frameType = this.getActiveFrameType(root)) {
        if (!window.QRFrames) {
            return;
        }

        const stageText = root.querySelector('#customFrameStageText');
        const frameForegroundColorControl = FrameColorControl.getControl(root, 'frameForegroundColor');
        const frameBackgroundColorControl = FrameColorControl.getControl(root, 'frameBackgroundColor');
        const frameTextColorControl = FrameColorControl.getControl(root, 'frameTextColor');

        if (!stageText || !frameForegroundColorControl || !frameBackgroundColorControl || !frameTextColorControl) {
            return;
        }

        window.QRFrames.setFrameCustomization(frameType, {
            frameText: this.normalizeInlineFrameText(stageText.textContent),
            frameColor: FrameColorControl.getValue(frameForegroundColorControl),
            backgroundColor: FrameColorControl.getValue(frameBackgroundColorControl),
            textColor: frameTextColorControl.picker.dataset.userModified === 'true' ? FrameColorControl.getValue(frameTextColorControl) : null
        });
    },

    async updateFramePreviewSamples(root = document) {
        if (!window.QRFrames) {
            return;
        }

        const qrContainer = root.querySelector('#qrcode');
        const liveCanvas = qrContainer?.querySelector('canvas');
        if (liveCanvas instanceof HTMLCanvasElement) {
            window.QRFrames.updateFramePreviews(liveCanvas);
            return;
        }

        const previewState = typeof QRCodePreviewRenderer !== 'undefined'
            ? QRCodePreviewRenderer.getPreviewStateForContainer(qrContainer)
            : null;

        if (previewState?.qrCanvas instanceof HTMLCanvasElement) {
            window.QRFrames.updateFramePreviews(previewState.qrCanvas);
            return;
        }

        if (
            previewState?.qrText
            && previewState?.qrOptions
            && typeof buildNativeQRCodeSVG === 'function'
            && typeof QRCodePreviewRenderer?.svgMarkupToCanvas === 'function'
        ) {
            try {
                const qrSVG = buildNativeQRCodeSVG({
                    text: previewState.qrText,
                    size: 100,
                    qrOptions: previewState.qrOptions
                });
                const qrCanvas = await QRCodePreviewRenderer.svgMarkupToCanvas(qrSVG, 100);
                window.QRFrames.updateFramePreviews(qrCanvas);
                return;
            } catch (error) {
                console.error('Unable to refresh frame thumbnails from the current QR preview.', error);
            }
        }

        const frameCards = root.querySelectorAll('.frame-card');
        frameCards.forEach(card => {
            if (!card.dataset.frame) {
                return;
            }
            const preview = card.querySelector('.frame-preview');
            if (!preview) {
                return;
            }

            const previewMarkup = window.QRFrames.getFramePreviewMarkup(card.dataset.frame, card.dataset.customFrameId || '');
            preview.innerHTML = previewMarkup;
        });
    },

    applyFrameSearch(root = document, frameSearchInput = root.querySelector('#framePresetSearchInput'), frameSearchEmpty = root.querySelector('#framePresetSearchEmpty')) {
        if (!frameSearchInput) {
            return;
        }

        const searchTerm = frameSearchInput.value.trim().toLowerCase();
        const cards = root.querySelectorAll('#frameSelector .frame-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const searchText = card.dataset.frameName || '';
            const isVisible = !searchTerm || searchText.includes(searchTerm);
            card.hidden = !isVisible;
            card.classList.toggle('is-filtered-out', !isVisible);
            const shell = card.closest('.frame-card-shell-custom');
            if (shell) {
                shell.hidden = !isVisible;
            }
            if (isVisible) {
                visibleCount += 1;
            }
        });

        if (frameSearchEmpty) {
            frameSearchEmpty.hidden = visibleCount > 0;
        }
    },

    triggerActiveFrameRefresh(root = document) {
        const qrContainer = root.querySelector('#qrcode');
        const activeFrameType = this.getActiveFrameType(root);
        const refreshed = typeof QRCodePreviewRenderer !== 'undefined'
            ? QRCodePreviewRenderer.refreshContainerPreview(qrContainer, activeFrameType)
            : false;

        if (refreshed) {
            return;
        }

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

        const activeFrameType = window.QRFrames?.getActiveFrameType?.(document);
        if (activeFrameType === window.QRFrames?.FRAME_TYPES?.NONE) {
            return {
                colorDark: '#000000',
                colorLight: window.QRFrames.QR_BACKGROUND_COLOR
            };
        }

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
        const logoMinimumTypeNumber = QRCodeLogoControls.getRecommendedMinTypeNumber();
        const requestedTypeNumber = Number(options.typeNumber);
        const hasExplicitTypeNumber = Number.isInteger(requestedTypeNumber) && requestedTypeNumber > 0;
        const requestedMinTypeNumber = Number(options.minTypeNumber);
        const normalizedRequestedMinTypeNumber = Number.isInteger(requestedMinTypeNumber) && requestedMinTypeNumber > 0
            ? requestedMinTypeNumber
            : QR_CODE_VERSION_AUTOMATIC;

        return {
            ...options,
            minTypeNumber: hasExplicitTypeNumber
                ? normalizedRequestedMinTypeNumber
                : Math.max(normalizedRequestedMinTypeNumber, logoMinimumTypeNumber),
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
            const decoratedOptions = controls.decorateQRCodeOptions(options);
            const instance = new OriginalQRCode(element, decoratedOptions);
            QRCodeLogoControls.applyLogoToContainer(element, instance, decoratedOptions);
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

window.QRCodeFrameControls = QRCodeFrameControls;
