"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TArcDial',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedControl',
    name: 'TArcDial',
    description: 'Represents a general-purpose knob-style rotating button.',
    icon: 'bi-circle',
    defaults: {
        width: 72,
        height: 72,
        min: 0,
        max: 100,
        value: 35,
        backgroundColor: 'transparent'
    },
    properties: [
        { setting: 'max', label: 'Max', propertyName: 'Max', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TArcDial' },
        { setting: 'min', label: 'Min', propertyName: 'Min', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TArcDial' },
        { setting: 'value', label: 'Value', propertyName: 'Value', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TArcDial' }
    ]
});