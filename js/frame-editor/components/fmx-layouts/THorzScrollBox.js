"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'THorzScrollBox',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TCustomScrollBox',
    name: 'THorzScrollBox',
    description: 'TScrollBox restricted to horizontal scrolling.',
    icon: 'bi-arrows-expand',
    isContainer: true,
    defaults: {
        touchTracking: 'horizontal',
        height: 140
    }
});