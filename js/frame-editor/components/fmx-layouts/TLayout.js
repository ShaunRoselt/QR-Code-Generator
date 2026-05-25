"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TLayout',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TControl',
    name: 'TLayout',
    description: 'Container for other graphical objects.',
    icon: 'bi-layout-text-sidebar',
    isContainer: true,
    defaults: {
        width: 320,
        height: 220,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0
    }
});