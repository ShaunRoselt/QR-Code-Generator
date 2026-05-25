"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TSelection',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TControl',
    name: 'TSelection',
    description: '2D rectangle object that can be moved and resized.',
    icon: 'bi-bounding-box',
    defaults: {
        width: 160,
        height: 100,
        color: '#66c0f4',
        gripSize: 6,
        hideSelection: false,
        hotHandle: '',
        minSize: '16,16',
        parentBounds: false,
        proportional: false,
        showHandles: true,
        backgroundColor: 'transparent',
        borderColor: '#66c0f4',
        borderWidth: 1
    },
    properties: [
        { setting: 'color', label: 'Color', propertyName: 'Color', type: 'color', introducedBy: 'TSelection' },
        { setting: 'gripSize', label: 'GripSize', propertyName: 'GripSize', type: 'number', min: 1, max: 200, step: 1, unit: 'px', introducedBy: 'TSelection' },
        { setting: 'hideSelection', label: 'HideSelection', propertyName: 'HideSelection', type: 'checkbox', introducedBy: 'TSelection' },
        { setting: 'hotHandle', label: 'HotHandle', propertyName: 'HotHandle', type: 'readonly', introducedBy: 'TSelection' },
        { setting: 'minSize', label: 'MinSize', propertyName: 'MinSize', type: 'text', introducedBy: 'TSelection' },
        { setting: 'parentBounds', label: 'ParentBounds', propertyName: 'ParentBounds', type: 'checkbox', introducedBy: 'TSelection' },
        { setting: 'proportional', label: 'Proportional', propertyName: 'Proportional', type: 'checkbox', introducedBy: 'TSelection' },
        { setting: 'showHandles', label: 'ShowHandles', propertyName: 'ShowHandles', type: 'checkbox', introducedBy: 'TSelection' }
    ]
});