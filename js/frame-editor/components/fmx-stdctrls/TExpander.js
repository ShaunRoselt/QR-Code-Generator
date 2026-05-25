"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TExpander',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TTextControl',
    name: 'TExpander',
    description: 'Represents a graphical control used to hold multiple graphical controls with the possibility to expand or contract its display area.',
    icon: 'bi-chevron-bar-down',
    isContainer: true,
    defaults: {
        text: 'Expander',
        width: 280,
        height: 180,
        isExpanded: true,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderRadius: 8,
        paddingTop: 34,
        paddingRight: 12,
        paddingBottom: 12,
        paddingLeft: 12,
        childAlignment: 'left',
        childGap: 10
    },
    properties: [
        { setting: 'isExpanded', label: 'IsExpanded', propertyName: 'IsExpanded', type: 'checkbox', introducedBy: 'TExpander' }
    ]
});