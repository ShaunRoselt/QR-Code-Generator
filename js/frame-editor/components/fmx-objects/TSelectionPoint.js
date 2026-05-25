"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TSelectionPoint',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TStyledControl',
    name: 'TSelectionPoint',
    description: '2D point object that can be moved.',
    icon: 'bi-record-circle',
    defaults: {
        width: 24,
        height: 24,
        gripCenter: '0,0',
        gripSize: 8,
        parentBounds: false,
        backgroundColor: '#ffffff',
        borderColor: '#66c0f4',
        borderWidth: 2,
        borderRadius: 999
    },
    properties: [
        { setting: 'gripCenter', label: 'GripCenter', propertyName: 'GripCenter', type: 'text', introducedBy: 'TSelectionPoint' },
        { setting: 'gripSize', label: 'GripSize', propertyName: 'GripSize', type: 'number', min: 1, max: 200, step: 1, unit: 'px', introducedBy: 'TSelectionPoint' },
        { setting: 'parentBounds', label: 'ParentBounds', propertyName: 'ParentBounds', type: 'checkbox', introducedBy: 'TSelectionPoint' }
    ]
});