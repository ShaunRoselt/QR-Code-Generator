"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TRectangle',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TShape',
    renderType: 'shape',
    name: 'TRectangle',
    description: '2D rectangle with customized corners.',
    icon: 'bi-square',
    defaults: {
        shapeType: 'rectangle',
        corners: 'TopLeft,TopRight,BottomLeft,BottomRight',
        cornerType: 'round',
        sides: 'Top,Left,Bottom,Right',
        xRadius: 0,
        yRadius: 0,
        borderRadius: 0
    },
    properties: [
        { setting: 'corners', label: 'Corners', propertyName: 'Corners', type: 'text', introducedBy: 'TRectangle' },
        { setting: 'cornerType', label: 'CornerType', propertyName: 'CornerType', type: 'select', options: [{ id: 'round', label: 'Round' }, { id: 'bevel', label: 'Bevel' }, { id: 'innerRound', label: 'InnerRound' }, { id: 'innerLine', label: 'InnerLine' }], introducedBy: 'TRectangle' },
        { setting: 'sides', label: 'Sides', propertyName: 'Sides', type: 'text', introducedBy: 'TRectangle' },
        { setting: 'xRadius', label: 'XRadius', propertyName: 'XRadius', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TRectangle' },
        { setting: 'yRadius', label: 'YRadius', propertyName: 'YRadius', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TRectangle' }
    ]
});