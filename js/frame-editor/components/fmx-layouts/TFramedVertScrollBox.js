"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TFramedVertScrollBox',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TVertScrollBox',
    name: 'TFramedVertScrollBox',
    description: 'Vertical scroll box with framed scroll box styling.',
    icon: 'bi-layout-sidebar-inset',
    isContainer: true,
    defaults: {
        backgroundColor: 'rgba(255,255,255,.04)',
        borderColor: 'rgba(255,255,255,.36)',
        borderWidth: 1
    }
});