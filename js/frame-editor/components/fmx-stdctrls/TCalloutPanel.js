"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TCalloutPanel',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPanel',
    name: 'TCalloutPanel',
    description: 'A container for extra information relevant to another item, with a visual indicator pointing to that item.',
    icon: 'bi-chat-square',
    isContainer: true,
    defaults: {
        width: 260,
        height: 160,
        calloutPosition: 'bottom',
        calloutLength: 18,
        calloutWidth: 28,
        backgroundColor: '#111827',
        borderWidth: 1,
        borderRadius: 10
    },
    properties: [
        { setting: 'calloutLength', label: 'CalloutLength', propertyName: 'CalloutLength', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TCalloutPanel' },
        { setting: 'calloutPosition', label: 'CalloutPosition', propertyName: 'CalloutPosition', type: 'select', options: [{ id: 'top', label: 'Top' }, { id: 'right', label: 'Right' }, { id: 'bottom', label: 'Bottom' }, { id: 'left', label: 'Left' }], introducedBy: 'TCalloutPanel' },
        { setting: 'calloutWidth', label: 'CalloutWidth', propertyName: 'CalloutWidth', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TCalloutPanel' }
    ]
});