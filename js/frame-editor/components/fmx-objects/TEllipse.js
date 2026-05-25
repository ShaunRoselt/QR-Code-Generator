"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TEllipse',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TShape',
    renderType: 'shape',
    name: 'TEllipse',
    description: '2D ellipse primitive.',
    icon: 'bi-circle',
    defaults: {
        width: 160,
        height: 110,
        shapeType: 'circle',
        borderRadius: 999
    }
});