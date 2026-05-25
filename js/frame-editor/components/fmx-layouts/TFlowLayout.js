"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TFlowLayout',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TControl',
    name: 'TFlowLayout',
    description: 'Arranges child controls as if they were words in a paragraph.',
    icon: 'bi-text-wrap',
    isContainer: true,
    defaults: {
        width: 340,
        height: 220,
        flowDirection: 'leftToRight',
        horizontalGap: 8,
        justify: 'left',
        justifyLastLine: 'left',
        verticalGap: 8,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.22)',
        borderWidth: 1
    },
    properties: [
        { setting: 'flowDirection', label: 'FlowDirection', propertyName: 'FlowDirection', type: 'select', options: [{ id: 'leftToRight', label: 'LeftToRight' }, { id: 'rightToLeft', label: 'RightToLeft' }], introducedBy: 'TFlowLayout' },
        { setting: 'horizontalGap', label: 'HorizontalGap', propertyName: 'HorizontalGap', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TFlowLayout' },
        { setting: 'justify', label: 'Justify', propertyName: 'Justify', type: 'select', options: [{ id: 'left', label: 'Left' }, { id: 'right', label: 'Right' }, { id: 'center', label: 'Center' }, { id: 'justify', label: 'Justify' }], introducedBy: 'TFlowLayout' },
        { setting: 'justifyLastLine', label: 'JustifyLastLine', propertyName: 'JustifyLastLine', type: 'select', options: [{ id: 'left', label: 'Left' }, { id: 'right', label: 'Right' }, { id: 'center', label: 'Center' }, { id: 'justify', label: 'Justify' }], introducedBy: 'TFlowLayout' },
        { setting: 'verticalGap', label: 'VerticalGap', propertyName: 'VerticalGap', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TFlowLayout' }
    ]
});