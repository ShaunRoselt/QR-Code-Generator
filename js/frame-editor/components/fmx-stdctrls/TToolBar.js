"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TToolBar',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedControl',
    name: 'TToolBar',
    description: 'Horizontal container for tool controls.',
    icon: 'bi-layout-three-columns',
    isContainer: true,
    defaults: {
        width: 420,
        height: 52,
        align: 'top',
        backgroundColor: '#111827',
        borderWidth: 1,
        borderRadius: 0,
        childAlignment: 'left',
        childGap: 8,
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 8
    }
});