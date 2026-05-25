"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TSwitch',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TCustomSwitch',
    name: 'TSwitch',
    description: 'On/off switch control.',
    icon: 'bi-toggle-on',
    defaults: {
        width: 64,
        height: 34,
        isChecked: true,
        backgroundColor: 'transparent'
    }
});