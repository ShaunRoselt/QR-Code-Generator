"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TCaretRectangle',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TRectangle',
    renderType: 'shape',
    name: 'TCaretRectangle',
    description: 'TRectangle descendant that can hold caret cursor information.',
    icon: 'bi-cursor-text',
    defaults: {
        width: 2,
        height: 48,
        caret: '',
        backgroundColor: '#ffffff',
        borderColor: 'transparent',
        borderWidth: 0
    },
    properties: [
        { setting: 'caret', label: 'Caret', propertyName: 'Caret', type: 'readonly', introducedBy: 'TCaretRectangle' }
    ]
});