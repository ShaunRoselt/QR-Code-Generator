"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TGridLayout',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TControl',
    name: 'TGridLayout',
    description: 'Arranges child controls in a grid of equally sized cells.',
    icon: 'bi-grid-3x3-gap',
    isContainer: true,
    defaults: {
        width: 340,
        height: 240,
        itemHeight: 64,
        itemWidth: 96,
        orientation: 'horizontal',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.22)',
        borderWidth: 1
    },
    properties: [
        { setting: 'itemHeight', label: 'ItemHeight', propertyName: 'ItemHeight', type: 'number', min: 1, max: 20000, step: 1, unit: 'px', introducedBy: 'TGridLayout' },
        { setting: 'itemWidth', label: 'ItemWidth', propertyName: 'ItemWidth', type: 'number', min: 1, max: 20000, step: 1, unit: 'px', introducedBy: 'TGridLayout' },
        { setting: 'orientation', label: 'Orientation', propertyName: 'Orientation', type: 'select', options: [{ id: 'horizontal', label: 'Horizontal' }, { id: 'vertical', label: 'Vertical' }], introducedBy: 'TGridLayout' }
    ]
});