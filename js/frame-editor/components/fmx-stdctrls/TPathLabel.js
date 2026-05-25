"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TPathLabel',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TStyledControl',
    name: 'TPathLabel',
    description: 'Represents a graphical control used to display information contained in TPathData within FireMonkey forms.',
    icon: 'bi-bezier2',
    defaults: {
        text: 'PathLabel',
        width: 160,
        height: 42,
        pathData: '',
        backgroundColor: 'transparent'
    },
    properties: [
        { setting: 'pathData', label: 'Data', propertyName: 'Data', type: 'textarea', introducedBy: 'TPathLabel' },
        { setting: 'text', label: 'Text', propertyName: 'Text', type: 'textarea', introducedBy: 'TPathLabel' }
    ]
});