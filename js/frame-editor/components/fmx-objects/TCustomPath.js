"use strict";

FrameEditorComponentCatalog.registerClass({
    className: 'TCustomPath',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TShape',
    abstract: true,
    description: 'Base class for all 2D path-type shapes.',
    defaults: {
        data: 'M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80',
        wrapMode: 'fit'
    },
    properties: [
        { setting: 'data', label: 'Data', propertyName: 'Data', type: 'textarea', introducedBy: 'TCustomPath' },
        { setting: 'wrapMode', label: 'WrapMode', propertyName: 'WrapMode', type: 'select', options: [{ id: 'original', label: 'Original' }, { id: 'fit', label: 'Fit' }, { id: 'stretch', label: 'Stretch' }, { id: 'tile', label: 'Tile' }], introducedBy: 'TCustomPath' }
    ]
});