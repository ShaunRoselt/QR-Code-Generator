"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TLine',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TShape',
    renderType: 'line',
    name: 'TLine',
    description: '2D line primitive.',
    icon: 'bi-slash-lg',
    defaults: {
        width: 220,
        height: 6,
        color: '#66c0f4',
        borderColor: 'transparent',
        borderWidth: 0,
        lineLocation: 'boundary',
        lineType: 'top',
        shortenLine: false,
        lineStyle: 'solid',
        thickness: 6
    },
    properties: [
        { setting: 'lineLocation', label: 'LineLocation', propertyName: 'LineLocation', type: 'select', options: [{ id: 'boundary', label: 'Boundary' }, { id: 'inner', label: 'Inner' }, { id: 'center', label: 'Center' }], introducedBy: 'TLine' },
        { setting: 'lineType', label: 'LineType', propertyName: 'LineType', type: 'select', options: [{ id: 'top', label: 'Top' }, { id: 'left', label: 'Left' }, { id: 'bottom', label: 'Bottom' }, { id: 'right', label: 'Right' }, { id: 'diagonal', label: 'Diagonal' }], introducedBy: 'TLine' },
        { setting: 'shortenLine', label: 'ShortenLine', propertyName: 'ShortenLine', type: 'checkbox', introducedBy: 'TLine' }
    ]
});