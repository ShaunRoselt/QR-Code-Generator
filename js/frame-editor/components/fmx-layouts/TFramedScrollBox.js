"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TFramedScrollBox',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TCustomScrollBox',
    name: 'TFramedScrollBox',
    description: 'Framed scroll box declaring published scroll area properties.',
    icon: 'bi-window',
    isContainer: true,
    defaults: {
        backgroundColor: 'rgba(255,255,255,.04)',
        borderColor: 'rgba(255,255,255,.36)',
        borderWidth: 1
    }
});