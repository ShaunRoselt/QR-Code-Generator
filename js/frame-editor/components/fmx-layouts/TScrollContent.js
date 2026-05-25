"use strict";

FrameEditorComponentCatalog.registerClass({
    className: 'TScrollContent',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TContent',
    abstract: true,
    description: 'Object that can hold scrollable content.',
    properties: [
        { setting: 'scrollBox', label: 'ScrollBox', propertyName: 'ScrollBox', type: 'readonly', introducedBy: 'TScrollContent' }
    ]
});