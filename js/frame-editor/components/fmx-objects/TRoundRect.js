"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TRoundRect',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TShape',
    renderType: 'shape',
    name: 'TRoundRect',
    description: '2D rectangle with rounded corners.',
    icon: 'bi-app',
    defaults: {
        shapeType: 'rectangle',
        corners: 'TopLeft,TopRight,BottomLeft,BottomRight',
        borderRadius: 18
    },
    properties: [
        { setting: 'corners', label: 'Corners', propertyName: 'Corners', type: 'text', introducedBy: 'TRoundRect' }
    ]
});