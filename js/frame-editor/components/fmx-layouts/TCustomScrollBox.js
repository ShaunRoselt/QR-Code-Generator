"use strict";

FrameEditorComponentCatalog.registerClass({
    className: 'TCustomScrollBox',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TStyledControl',
    abstract: true,
    description: 'Base class for controls representing a scrolling area.',
    defaults: {
        width: 320,
        height: 220,
        aniCalculations: '',
        autoHide: true,
        bounces: true,
        contentBounds: '',
        disableMouseWheel: false,
        scrollAnimation: true,
        showScrollBars: true,
        showSizeGrip: false,
        touchTracking: 'horizontal,vertical',
        viewportPosition: '0,0',
        viewportRect: '',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.22)',
        borderWidth: 1
    },
    properties: [
        { setting: 'aniCalculations', label: 'AniCalculations', propertyName: 'AniCalculations', type: 'text', introducedBy: 'TCustomScrollBox' },
        { setting: 'autoHide', label: 'AutoHide', propertyName: 'AutoHide', type: 'checkbox', introducedBy: 'TCustomScrollBox' },
        { setting: 'bounces', label: 'Bounces', propertyName: 'Bounces', type: 'checkbox', introducedBy: 'TCustomScrollBox' },
        { setting: 'contentBounds', label: 'ContentBounds', propertyName: 'ContentBounds', type: 'readonly', introducedBy: 'TCustomScrollBox' },
        { setting: 'disableMouseWheel', label: 'DisableMouseWheel', propertyName: 'DisableMouseWheel', type: 'checkbox', introducedBy: 'TCustomScrollBox' },
        { setting: 'scrollAnimation', label: 'ScrollAnimation', propertyName: 'ScrollAnimation', type: 'checkbox', introducedBy: 'TCustomScrollBox' },
        { setting: 'showScrollBars', label: 'ShowScrollBars', propertyName: 'ShowScrollBars', type: 'checkbox', introducedBy: 'TCustomScrollBox' },
        { setting: 'showSizeGrip', label: 'ShowSizeGrip', propertyName: 'ShowSizeGrip', type: 'checkbox', introducedBy: 'TCustomScrollBox' },
        { setting: 'touchTracking', label: 'TouchTracking', propertyName: 'TouchTracking', type: 'text', introducedBy: 'TCustomScrollBox' },
        { setting: 'viewportPosition', label: 'ViewportPosition', propertyName: 'ViewportPosition', type: 'text', introducedBy: 'TCustomScrollBox' },
        { setting: 'viewportRect', label: 'ViewportRect', propertyName: 'ViewportRect', type: 'readonly', introducedBy: 'TCustomScrollBox' }
    ]
});