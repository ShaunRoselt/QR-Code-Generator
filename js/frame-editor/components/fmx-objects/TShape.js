"use strict";

FrameEditorComponentCatalog.registerClass({
    className: 'TShape',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TControl',
    abstract: true,
    description: 'Base class for 2D graphic primitives.',
    defaults: {
        width: 160,
        height: 100,
        color: '#66c0f4',
        backgroundColor: '#66c0f4',
        borderColor: '#ffffff',
        borderWidth: 2,
        shapeRect: '',
        strokeThickness: 2
    },
    properties: [
        { setting: 'color', label: 'Fill', propertyName: 'Fill', type: 'color', introducedBy: 'TShape' },
        { setting: 'shapeRect', label: 'ShapeRect', propertyName: 'ShapeRect', type: 'readonly', introducedBy: 'TShape' },
        { setting: 'borderColor', label: 'Stroke', propertyName: 'Stroke', type: 'color', introducedBy: 'TShape' },
        { setting: 'borderWidth', label: 'Stroke.Thickness', propertyName: 'Stroke.Thickness', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TShape' }
    ]
});