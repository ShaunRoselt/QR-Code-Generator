"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TRadioButton',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedTextControl',
    name: 'TRadioButton',
    description: 'Single-choice radio control with text.',
    icon: 'bi-record-circle',
    defaults: {
        text: 'RadioButton',
        width: 180,
        height: 36,
        textAlign: 'left',
        isChecked: false,
        groupName: '',
        backgroundColor: 'transparent'
    },
    properties: [
        { setting: 'groupName', label: 'GroupName', propertyName: 'GroupName', type: 'text', introducedBy: 'TRadioButton' },
        { setting: 'isChecked', label: 'IsChecked', propertyName: 'IsChecked', type: 'checkbox', introducedBy: 'TRadioButton' }
    ]
});