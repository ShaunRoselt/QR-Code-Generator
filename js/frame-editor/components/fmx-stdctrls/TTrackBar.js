"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TTrackBar',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TCustomTrack',
    name: 'TTrackBar',
    description: 'Continuous value slider.',
    icon: 'bi-sliders',
    defaults: {
        width: 220,
        height: 32,
        min: 0,
        max: 100,
        value: 50,
        backgroundColor: 'transparent'
    }
});