"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TPaintBox',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TControl',
    name: 'TPaintBox',
    description: '2D image component providing a canvas for application rendering.',
    icon: 'bi-brush',
    defaults: {
        width: 180,
        height: 120,
        backgroundColor: 'rgba(255,255,255,.04)',
        borderColor: 'rgba(255,255,255,.22)',
        borderWidth: 1
    }
});