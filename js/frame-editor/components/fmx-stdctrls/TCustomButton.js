"use strict";

FrameEditorComponentCatalog.registerClass({
    className: 'TCustomButton',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedTextControl',
    abstract: true,
    description: 'Represents the base class for all buttons.',
    defaults: {
        text: 'Button',
        width: 140,
        height: 44,
        backgroundColor: '#2f80ed',
        borderColor: '#66c0f4',
        borderWidth: 1,
        borderRadius: 8,
        color: '#ffffff',
        default: false,
        cancel: false
    },
    properties: [
        { setting: 'cancel', label: 'Cancel', propertyName: 'Cancel', type: 'checkbox', introducedBy: 'TCustomButton' },
        { setting: 'default', label: 'Default', propertyName: 'Default', type: 'checkbox', introducedBy: 'TCustomButton' }
    ]
});