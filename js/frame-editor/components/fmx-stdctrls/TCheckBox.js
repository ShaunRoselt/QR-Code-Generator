"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TCheckBox',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedTextControl',
    name: 'TCheckBox',
    description: 'Boolean check control with text.',
    icon: 'bi-check-square',
    defaults: {
        text: 'CheckBox',
        width: 160,
        height: 36,
        textAlign: 'left',
        isChecked: false,
        backgroundColor: 'transparent'
    },
    properties: [
        { setting: 'isChecked', label: 'IsChecked', propertyName: 'IsChecked', type: 'checkbox', introducedBy: 'TCheckBox' }
    ]
});