"use strict";

FrameEditorComponentCatalog.registerClass({
    className: 'TCustomTrack',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedControl',
    abstract: true,
    description: 'Base class for all track bar components.',
    defaults: {
        width: 220,
        height: 32,
        min: 0,
        max: 100,
        value: 50,
        orientation: 'horizontal',
        backgroundColor: 'transparent'
    },
    properties: [
        { setting: 'max', label: 'Max', propertyName: 'Max', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TCustomTrack' },
        { setting: 'min', label: 'Min', propertyName: 'Min', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TCustomTrack' },
        { setting: 'orientation', label: 'Orientation', propertyName: 'Orientation', type: 'select', options: [{ id: 'horizontal', label: 'Horizontal' }, { id: 'vertical', label: 'Vertical' }], introducedBy: 'TCustomTrack' },
        { setting: 'value', label: 'Value', propertyName: 'Value', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TCustomTrack' }
    ]
});