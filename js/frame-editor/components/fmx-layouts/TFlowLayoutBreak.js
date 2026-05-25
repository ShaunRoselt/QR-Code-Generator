"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TFlowLayoutBreak',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TControl',
    name: 'TFlowLayoutBreak',
    description: 'Dummy control that inserts a new line in a TFlowLayout.',
    icon: 'bi-arrow-return-left',
    defaults: {
        width: 48,
        height: 24,
        changesRules: false,
        flowDirection: 'leftToRight',
        horizontalGap: 8,
        justify: 'left',
        justifyLastLine: 'left',
        verticalGap: 8,
        backgroundColor: 'rgba(102,192,244,.12)',
        borderColor: 'rgba(102,192,244,.55)',
        borderWidth: 1
    },
    properties: [
        { setting: 'changesRules', label: 'ChangesRules', propertyName: 'ChangesRules', type: 'checkbox', introducedBy: 'TFlowLayoutBreak' },
        { setting: 'flowDirection', label: 'FlowDirection', propertyName: 'FlowDirection', type: 'select', options: [{ id: 'leftToRight', label: 'LeftToRight' }, { id: 'rightToLeft', label: 'RightToLeft' }], introducedBy: 'TFlowLayoutBreak' },
        { setting: 'horizontalGap', label: 'HorizontalGap', propertyName: 'HorizontalGap', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TFlowLayoutBreak' },
        { setting: 'justify', label: 'Justify', propertyName: 'Justify', type: 'select', options: [{ id: 'left', label: 'Left' }, { id: 'right', label: 'Right' }, { id: 'center', label: 'Center' }, { id: 'justify', label: 'Justify' }], introducedBy: 'TFlowLayoutBreak' },
        { setting: 'justifyLastLine', label: 'JustifyLastLine', propertyName: 'JustifyLastLine', type: 'select', options: [{ id: 'left', label: 'Left' }, { id: 'right', label: 'Right' }, { id: 'center', label: 'Center' }, { id: 'justify', label: 'Justify' }], introducedBy: 'TFlowLayoutBreak' },
        { setting: 'verticalGap', label: 'VerticalGap', propertyName: 'VerticalGap', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TFlowLayoutBreak' }
    ]
});