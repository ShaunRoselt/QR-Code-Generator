"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TProgressBar',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedControl',
    name: 'TProgressBar',
    description: 'Progress value indicator.',
    icon: 'bi-percent',
    defaults: {
        width: 220,
        height: 24,
        min: 0,
        max: 100,
        value: 55,
        backgroundColor: '#1f2937',
        borderRadius: 999
    },
    properties: [
        { setting: 'max', label: 'Max', propertyName: 'Max', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TProgressBar' },
        { setting: 'min', label: 'Min', propertyName: 'Min', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TProgressBar' },
        { setting: 'value', label: 'Value', propertyName: 'Value', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TProgressBar' }
    ]
});