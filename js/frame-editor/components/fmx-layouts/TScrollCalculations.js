"use strict";

FrameEditorComponentCatalog.registerClass({
    className: 'TScrollCalculations',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TAniCalculations',
    abstract: true,
    description: 'Methods for inertial scroll calculations.',
    properties: [
        { setting: 'scrollBox', label: 'ScrollBox', propertyName: 'ScrollBox', type: 'readonly', introducedBy: 'TScrollCalculations' }
    ]
});