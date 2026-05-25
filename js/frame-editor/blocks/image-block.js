"use strict";

FrameEditorBlockCatalog.register({
    type: 'image',
    name: 'Image Block',
    description: 'Upload and place custom images on the canvas.',
    icon: 'bi-image',
    properties: [
        { setting: 'backgroundColorRaw', valueKey: 'backgroundColor', label: 'Background', type: 'color', allowTransparent: true },
        { setting: 'borderColor', label: 'Border color', type: 'color' },
        { setting: 'borderRadius', label: 'Border radius', type: 'number', min: 0, max: 120, step: 1, unit: 'px' },
        { setting: 'borderWidth', label: 'Border width', type: 'number', min: 0, max: 20, step: 1, unit: 'px' },
        { setting: 'height', label: 'Height', type: 'number', min: 48, max: 20000, step: 4, unit: 'px' },
        { setting: 'imageUpload', valueKey: 'imageName', label: 'Image', type: 'imageUpload' },
        { setting: 'imageName', label: 'Selected file', type: 'readonly' },
        { setting: 'objectFit', label: 'Image fit', type: 'select', options: [{ id: 'contain', label: 'Contain' }, { id: 'cover', label: 'Cover' }, { id: 'fill', label: 'Fill' }] },
        { setting: 'width', label: 'Width', type: 'number', min: 48, max: 20000, step: 4, unit: 'px' }
    ],
    createBlock(context) {
        const defaultColor = context.getDefaultColor ? context.getDefaultColor() : '#111111';
        return {
            id: context.id,
            type: 'image',
            xPct: context.xPct,
            yPct: context.yPct,
            src: '',
            imageName: '',
            width: 180,
            height: 180,
            objectFit: 'contain',
            backgroundColor: 'transparent',
            borderWidth: 0,
            borderRadius: 0,
            borderColor: defaultColor,
            rotation: 0,
            parentId: context.parentId,
            childOrder: context.childOrder,
            columnIndex: context.columnIndex
        };
    }
});