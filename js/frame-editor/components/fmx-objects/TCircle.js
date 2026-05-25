"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TCircle',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TEllipse',
    renderType: 'shape',
    name: 'TCircle',
    description: '2D circle primitive.',
    icon: 'bi-circle',
    defaults: {
        width: 120,
        height: 120,
        shapeType: 'circle',
        borderRadius: 999
    }
});