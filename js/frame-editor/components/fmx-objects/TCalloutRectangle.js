"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TCalloutRectangle',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TRectangle',
    name: 'TCalloutRectangle',
    description: 'Rectangle with a triangular callout pointer.',
    icon: 'bi-chat-square',
    defaults: {
        width: 200,
        height: 120,
        calloutLength: 24,
        calloutOffset: 0,
        calloutPosition: 'bottom',
        calloutWidth: 36,
        backgroundColor: '#66c0f4',
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 10
    },
    properties: [
        { setting: 'calloutLength', label: 'CalloutLength', propertyName: 'CalloutLength', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TCalloutRectangle' },
        { setting: 'calloutOffset', label: 'CalloutOffset', propertyName: 'CalloutOffset', type: 'number', min: -2000, max: 2000, step: 1, unit: 'px', introducedBy: 'TCalloutRectangle' },
        { setting: 'calloutPosition', label: 'CalloutPosition', propertyName: 'CalloutPosition', type: 'select', options: [{ id: 'top', label: 'Top' }, { id: 'left', label: 'Left' }, { id: 'right', label: 'Right' }, { id: 'bottom', label: 'Bottom' }], introducedBy: 'TCalloutRectangle' },
        { setting: 'calloutWidth', label: 'CalloutWidth', propertyName: 'CalloutWidth', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TCalloutRectangle' }
    ]
});