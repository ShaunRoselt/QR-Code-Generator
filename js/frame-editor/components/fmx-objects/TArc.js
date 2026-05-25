"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TArc',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TEllipse',
    name: 'TArc',
    description: '2D arc primitive drawn as part of an ellipse contour.',
    icon: 'bi-circle-half',
    defaults: {
        width: 140,
        height: 140,
        startAngle: 0,
        endAngle: 270,
        backgroundColor: 'transparent',
        borderColor: '#66c0f4',
        borderWidth: 0,
        color: '#66c0f4'
    },
    properties: [
        { setting: 'endAngle', label: 'EndAngle', propertyName: 'EndAngle', type: 'number', min: -360, max: 720, step: 1, unit: 'deg', introducedBy: 'TArc' },
        { setting: 'startAngle', label: 'StartAngle', propertyName: 'StartAngle', type: 'number', min: -360, max: 720, step: 1, unit: 'deg', introducedBy: 'TArc' }
    ]
});