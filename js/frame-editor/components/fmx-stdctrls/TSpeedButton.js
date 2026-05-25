"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TSpeedButton',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TCustomButton',
    name: 'TSpeedButton',
    description: 'Represents a push button that contains a text caption, for usage in various toolbars.',
    icon: 'bi-lightning',
    defaults: {
        text: 'SpeedButton',
        width: 150,
        height: 40,
        isPressed: false,
        groupName: ''
    },
    properties: [
        { setting: 'groupName', label: 'GroupName', propertyName: 'GroupName', type: 'text', introducedBy: 'TSpeedButton' },
        { setting: 'isPressed', label: 'IsPressed', propertyName: 'IsPressed', type: 'checkbox', introducedBy: 'TSpeedButton' }
    ]
});