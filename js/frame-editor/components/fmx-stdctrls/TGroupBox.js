"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TGroupBox',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedTextControl',
    name: 'TGroupBox',
    description: 'Captioned container for grouped components.',
    icon: 'bi-box',
    isContainer: true,
    defaults: {
        text: 'GroupBox',
        width: 260,
        height: 180,
        textAlign: 'left',
        backgroundColor: 'transparent',
        borderColor: '#66c0f4',
        borderWidth: 1,
        borderRadius: 8,
        paddingTop: 28,
        paddingRight: 12,
        paddingBottom: 12,
        paddingLeft: 12,
        childAlignment: 'left',
        childGap: 10
    }
});