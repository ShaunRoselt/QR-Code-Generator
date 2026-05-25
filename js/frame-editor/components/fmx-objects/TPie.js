"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TPie',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TEllipse',
    name: 'TPie',
    description: '2D pie primitive drawn as part of an ellipse.',
    icon: 'bi-pie-chart',
    defaults: {
        width: 140,
        height: 140,
        startAngle: 0,
        endAngle: 270,
        backgroundColor: '#66c0f4',
        borderColor: '#ffffff',
        borderWidth: 0,
        color: '#66c0f4'
    },
    properties: [
        { setting: 'endAngle', label: 'EndAngle', propertyName: 'EndAngle', type: 'number', min: -360, max: 720, step: 1, unit: 'deg', introducedBy: 'TPie' },
        { setting: 'startAngle', label: 'StartAngle', propertyName: 'StartAngle', type: 'number', min: -360, max: 720, step: 1, unit: 'deg', introducedBy: 'TPie' }
    ]
});