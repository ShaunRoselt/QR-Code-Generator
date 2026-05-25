"use strict";

FrameEditorComponentCatalog.registerClass({
    className: 'TCustomCornerButton',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TCustomButton',
    abstract: true,
    description: 'Represents a TCustomButton control with customizable corners.',
    defaults: {
        cornerType: 'round',
        corners: 'TopLeft,TopRight,BottomLeft,BottomRight'
    },
    properties: [
        { setting: 'corners', label: 'Corners', propertyName: 'Corners', type: 'text', introducedBy: 'TCustomCornerButton' },
        { setting: 'cornerType', label: 'CornerType', propertyName: 'CornerType', type: 'select', options: [{ id: 'round', label: 'Round' }, { id: 'bevel', label: 'Bevel' }, { id: 'innerRound', label: 'InnerRound' }, { id: 'innerLine', label: 'InnerLine' }], introducedBy: 'TCustomCornerButton' }
    ]
});