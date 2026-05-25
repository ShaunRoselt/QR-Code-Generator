"use strict";

FrameEditorBlockCatalog.register({
    type: 'qr',
    name: 'QR Code Block',
    description: 'Drop a QR code anywhere on the canvas.',
    icon: 'bi-qr-code',
    properties: [
        { setting: 'backgroundColorRaw', valueKey: 'backgroundColor', label: 'Background', type: 'color', allowTransparent: true },
        { setting: 'borderColor', label: 'Border color', type: 'color' },
        { setting: 'borderRadius', label: 'Border radius', type: 'number', min: 0, max: 48, step: 1, unit: 'px' },
        { setting: 'borderWidth', label: 'Border width', type: 'number', min: 0, max: 20, step: 1, unit: 'px' },
        { setting: 'colorDark', label: 'Foreground', type: 'color' },
        { setting: 'paddingBottom', label: 'Padding bottom', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'paddingLeft', label: 'Padding left', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'paddingLinked', label: 'Padding linked', type: 'checkbox' },
        { setting: 'paddingRight', label: 'Padding right', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'paddingTop', label: 'Padding top', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'qrRotation', label: 'QR rotation', type: 'number', min: -180, max: 180, step: 1, unit: 'deg' },
        { setting: 'size', label: 'QR size', type: 'number', min: 80, max: 20000, step: 4, unit: 'px' }
    ],
    createBlock(context) {
        const defaultColor = context.getDefaultColor ? context.getDefaultColor() : '#111111';
        return {
            id: context.id,
            type: 'qr',
            xPct: context.xPct,
            yPct: context.yPct,
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
            borderColor: defaultColor,
            rotation: 0,
            qrRotation: 0,
            parentId: context.parentId,
            childOrder: context.childOrder,
            columnIndex: context.columnIndex
        };
    }
});