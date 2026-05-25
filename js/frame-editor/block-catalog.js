"use strict";

(function registerFrameEditorBlockCatalog(global) {
    const ALIGN_OPTIONS = Object.freeze([
        { id: 'none', label: 'None' },
        { id: 'top', label: 'Top' },
        { id: 'left', label: 'Left' },
        { id: 'right', label: 'Right' },
        { id: 'bottom', label: 'Bottom' },
        { id: 'mostTop', label: 'MostTop' },
        { id: 'mostBottom', label: 'MostBottom' },
        { id: 'mostLeft', label: 'MostLeft' },
        { id: 'mostRight', label: 'MostRight' },
        { id: 'client', label: 'Client' },
        { id: 'contents', label: 'Contents' },
        { id: 'center', label: 'Center' },
        { id: 'vertCenter', label: 'VertCenter' },
        { id: 'horzCenter', label: 'HorzCenter' },
        { id: 'horizontal', label: 'Horizontal' },
        { id: 'vertical', label: 'Vertical' },
        { id: 'scale', label: 'Scale' },
        { id: 'fit', label: 'Fit' },
        { id: 'fitLeft', label: 'FitLeft' },
        { id: 'fitRight', label: 'FitRight' }
    ]);

    const ALIGN_VALUE_SET = new Set(ALIGN_OPTIONS.map(option => option.id));
    const definitions = [];
    const definitionMap = new Map();

    const COMMON_POSITION_PROPERTIES = Object.freeze([
        { setting: 'align', label: 'Align', type: 'select', options: ALIGN_OPTIONS },
        { setting: 'marginBottom', label: 'Margin bottom', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'marginLeft', label: 'Margin left', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'marginRight', label: 'Margin right', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'marginTop', label: 'Margin top', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'rotation', label: 'Rotation', type: 'number', min: -180, max: 180, step: 1, unit: 'deg' },
        { setting: 'xPct', label: 'X', type: 'number', min: 0, max: 100, step: 0.1, unit: '%' },
        { setting: 'yPct', label: 'Y', type: 'number', min: 0, max: 100, step: 0.1, unit: '%' }
    ]);

    const BASE_BLOCK_DEFAULTS = Object.freeze({
        align: 'none',
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0
    });

    function normalizeAlign(value) {
        const normalized = String(value || '').trim();
        return ALIGN_VALUE_SET.has(normalized) ? normalized : 'none';
    }

    function getCommonPositionProperties() {
        return COMMON_POSITION_PROPERTIES.map(property => ({ ...property }));
    }

    function register(definition) {
        if (!definition || !definition.type) {
            return null;
        }

        const normalizedDefinition = {
            ...definition,
            properties: Array.isArray(definition.properties) ? definition.properties : []
        };
        definitionMap.set(normalizedDefinition.type, normalizedDefinition);
        const existingIndex = definitions.findIndex(candidate => candidate.type === normalizedDefinition.type);
        if (existingIndex >= 0) {
            definitions.splice(existingIndex, 1, normalizedDefinition);
        } else {
            definitions.push(normalizedDefinition);
        }
        return normalizedDefinition;
    }

    function getDefinition(type) {
        return definitionMap.get(type) || null;
    }

    function getDefinitions() {
        return definitions.slice();
    }

    function getLibrary() {
        return definitions.map(definition => ({
            type: definition.type,
            name: definition.name,
            description: definition.description,
            icon: definition.icon
        }));
    }

    function createBlock(type, context) {
        const definition = getDefinition(type);
        if (!definition || typeof definition.createBlock !== 'function') {
            return null;
        }

        const block = definition.createBlock(context || {});
        return normalizeBlock(block);
    }

    function normalizeBlock(block) {
        if (!block || typeof block !== 'object') {
            return null;
        }

        return {
            ...BASE_BLOCK_DEFAULTS,
            ...block,
            align: normalizeAlign(block.align)
        };
    }

    function getProperties(type) {
        const definition = getDefinition(type);
        if (!definition) {
            return [];
        }

        return [
            ...definition.properties.map(property => ({ ...property })),
            ...getCommonPositionProperties()
        ];
    }

    global.FrameEditorBlockCatalog = {
        ALIGN_OPTIONS,
        getCommonPositionProperties,
        register,
        getDefinition,
        getDefinitions,
        getLibrary,
        createBlock,
        normalizeAlign,
        normalizeBlock,
        getProperties,
        isSupportedType(type) {
            return definitionMap.has(type);
        }
    };
})(window);