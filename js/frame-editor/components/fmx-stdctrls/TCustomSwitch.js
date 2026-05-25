"use strict";

FrameEditorComponentCatalog.registerClass({
    className: 'TCustomSwitch',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedControl',
    abstract: true,
    description: 'Represents a two-way on/off switch for use in applications.',
    defaults: {
        width: 64,
        height: 34,
        isChecked: true,
        backgroundColor: 'transparent'
    },
    properties: [
        { setting: 'isChecked', label: 'IsChecked', propertyName: 'IsChecked', type: 'checkbox', introducedBy: 'TCustomSwitch' }
    ]
});