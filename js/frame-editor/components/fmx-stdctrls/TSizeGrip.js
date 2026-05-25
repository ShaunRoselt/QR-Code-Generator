"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TSizeGrip',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TStyledControl',
    name: 'TSizeGrip',
    description: 'Represents a graphical control used to dynamically resize FireMonkey forms.',
    icon: 'bi-grip-horizontal',
    defaults: {
        width: 32,
        height: 32,
        backgroundColor: 'transparent'
    }
});