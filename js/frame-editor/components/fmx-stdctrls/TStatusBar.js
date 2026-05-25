"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TStatusBar',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedControl',
    name: 'TStatusBar',
    description: 'Bottom status container.',
    icon: 'bi-window-dock',
    isContainer: true,
    defaults: {
        width: 420,
        height: 38,
        align: 'bottom',
        backgroundColor: '#111827',
        borderWidth: 1,
        borderRadius: 0,
        childAlignment: 'left',
        childGap: 8,
        paddingTop: 6,
        paddingRight: 8,
        paddingBottom: 6,
        paddingLeft: 8
    }
});