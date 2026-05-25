"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TScrollBar',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TStyledControl',
    name: 'TScrollBar',
    description: 'Represents a standard scroll bar that is used to scroll the contents of a window, form, or a control.',
    icon: 'bi-scroll',
    defaults: {
        width: 220,
        height: 18,
        min: 0,
        max: 100,
        orientation: 'horizontal',
        value: 20
    },
    properties: [
        { setting: 'max', label: 'Max', propertyName: 'Max', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TScrollBar' },
        { setting: 'min', label: 'Min', propertyName: 'Min', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TScrollBar' },
        { setting: 'orientation', label: 'Orientation', propertyName: 'Orientation', type: 'select', options: [{ id: 'horizontal', label: 'Horizontal' }, { id: 'vertical', label: 'Vertical' }], introducedBy: 'TScrollBar' },
        { setting: 'value', label: 'Value', propertyName: 'Value', type: 'number', min: -100000, max: 100000, step: 1, introducedBy: 'TScrollBar' }
    ]
});