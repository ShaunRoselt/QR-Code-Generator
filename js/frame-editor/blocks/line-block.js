"use strict";

FrameEditorBlockCatalog.register({
    type: 'line',
    name: 'Line Block',
    description: 'Add divider and accent lines anywhere on the canvas.',
    icon: 'bi-slash-lg',
    properties: [
        { setting: 'borderColor', label: 'Border color', type: 'color' },
        { setting: 'borderRadius', label: 'Border radius', type: 'number', min: 0, max: 999, step: 1, unit: 'px' },
        { setting: 'borderWidth', label: 'Border width', type: 'number', min: 0, max: 20, step: 1, unit: 'px' },
        { setting: 'color', label: 'Fill', type: 'color' },
        { setting: 'height', label: 'Thickness', type: 'number', min: 2, max: 20000, step: 1, unit: 'px' },
        { setting: 'lineStyle', label: 'Style', type: 'select', options: [{ id: 'solid', label: 'Solid' }, { id: 'dashed', label: 'Dashed' }, { id: 'dotted', label: 'Dotted' }, { id: 'double', label: 'Double' }, { id: 'striped', label: 'Striped' }, { id: 'gradient', label: 'Gradient' }, { id: 'wave', label: 'Wave' }, { id: 'triangle', label: 'Triangle' }, { id: 'sawtooth', label: 'Sawtooth' }, { id: 'square-wave', label: 'Square Wave' }, { id: 'pulse', label: 'Pulse' }] },
        { setting: 'width', label: 'Length', type: 'number', min: 24, max: 20000, step: 4, unit: 'px' }
    ],
    createBlock(context) {
        const defaultColor = context.getDefaultColor ? context.getDefaultColor() : '#111111';
        return {
            id: context.id,
            type: 'line',
            xPct: context.xPct,
            yPct: context.yPct,
            width: 180,
            height: 8,
            color: defaultColor,
            lineStyle: 'solid',
            borderWidth: 0,
            borderRadius: 999,
            borderColor: defaultColor,
            rotation: 0,
            parentId: context.parentId,
            childOrder: context.childOrder,
            columnIndex: context.columnIndex
        };
    }
});