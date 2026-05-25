"use strict";

FrameEditorBlockCatalog.register({
    type: 'shape',
    name: 'Shape Block',
    description: 'Add vector-style shapes anywhere on the canvas.',
    icon: 'bi-square',
    properties: [
        { setting: 'borderColor', label: 'Border color', type: 'color' },
        { setting: 'borderRadius', label: 'Border radius', type: 'number', min: 0, max: 120, step: 1, unit: 'px' },
        { setting: 'borderWidth', label: 'Border width', type: 'number', min: 0, max: 20, step: 1, unit: 'px' },
        { setting: 'color', label: 'Fill', type: 'color' },
        { setting: 'height', label: 'Height', type: 'number', min: 48, max: 20000, step: 4, unit: 'px' },
        { setting: 'shapeType', label: 'Shape type', type: 'select', options: [{ id: 'rectangle', label: 'Rectangle' }, { id: 'circle', label: 'Circle' }, { id: 'triangle', label: 'Triangle' }, { id: 'diamond', label: 'Diamond' }, { id: 'hexagon', label: 'Hexagon' }, { id: 'star', label: 'Star' }] },
        { setting: 'width', label: 'Width', type: 'number', min: 48, max: 20000, step: 4, unit: 'px' }
    ],
    createBlock(context) {
        const defaultColor = context.getDefaultColor ? context.getDefaultColor() : '#111111';
        return {
            id: context.id,
            type: 'shape',
            shapeType: 'rectangle',
            xPct: context.xPct,
            yPct: context.yPct,
            width: 160,
            height: 160,
            color: defaultColor,
            borderWidth: 0,
            borderColor: defaultColor,
            borderRadius: 18,
            rotation: 0,
            parentId: context.parentId,
            childOrder: context.childOrder,
            columnIndex: context.columnIndex
        };
    }
});