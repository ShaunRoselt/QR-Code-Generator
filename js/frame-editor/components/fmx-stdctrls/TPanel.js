"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TPanel',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedControl',
    renderType: 'section',
    name: 'TPanel',
    description: 'Container surface for child components.',
    icon: 'bi-layout-text-window',
    isContainer: true,
    defaults: {
        width: 320,
        height: 220,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderRadius: 18,
        childAlignment: 'left',
        childGap: 12,
        paddingTop: 18,
        paddingRight: 18,
        paddingBottom: 18,
        paddingLeft: 18,
        paddingX: 18,
        paddingY: 18
    },
    properties: [
        { setting: 'childAlignment', label: 'ChildAlignment', propertyName: 'ChildAlignment', type: 'select', options: [{ id: 'left', label: 'Left' }, { id: 'center', label: 'Center' }, { id: 'right', label: 'Right' }], introducedBy: 'TPanel' },
        { setting: 'childGap', label: 'ChildGap', propertyName: 'ChildGap', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TPanel' }
    ]
});