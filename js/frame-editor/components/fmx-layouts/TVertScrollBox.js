"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TVertScrollBox',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TCustomScrollBox',
    name: 'TVertScrollBox',
    description: 'TScrollBox restricted to vertical scrolling.',
    icon: 'bi-arrows-vertical',
    isContainer: true,
    defaults: {
        touchTracking: 'vertical',
        width: 220,
        height: 320
    }
});