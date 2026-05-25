"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TScaledLayout',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TControl',
    name: 'TScaledLayout',
    description: 'Layer that scales its content according to the physical dimensions of the layout.',
    icon: 'bi-aspect-ratio',
    isContainer: true,
    defaults: {
        width: 320,
        height: 220,
        originalHeight: 220,
        originalWidth: 320,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.22)',
        borderWidth: 1
    },
    properties: [
        { setting: 'originalHeight', label: 'OriginalHeight', propertyName: 'OriginalHeight', type: 'number', min: 1, max: 20000, step: 1, unit: 'px', introducedBy: 'TScaledLayout' },
        { setting: 'originalWidth', label: 'OriginalWidth', propertyName: 'OriginalWidth', type: 'number', min: 1, max: 20000, step: 1, unit: 'px', introducedBy: 'TScaledLayout' }
    ]
});