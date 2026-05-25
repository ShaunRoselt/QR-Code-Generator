"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TLabel',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedTextControl',
    renderType: 'text',
    name: 'TLabel',
    description: 'Displays text on the canvas.',
    icon: 'bi-type-h2',
    defaults: {
        text: 'Label',
        textAlign: 'left',
        width: 120,
        height: 34,
        yPct: 28,
        backgroundColor: 'transparent',
        borderRadius: 0
    }
});