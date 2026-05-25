"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TImage',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TControl',
    renderType: 'image',
    name: 'TImage',
    description: '2D image component.',
    icon: 'bi-image',
    defaults: {
        width: 180,
        height: 140,
        src: '',
        bitmapMargins: '0,0,0,0',
        disableInterpolation: false,
        marginWrapMode: 'stretch',
        multiResBitmap: '',
        wrapMode: 'fit',
        objectFit: 'contain',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.22)',
        borderWidth: 1
    },
    properties: [
        { setting: 'src', label: 'Bitmap', propertyName: 'Bitmap', type: 'imageUpload', introducedBy: 'TImage' },
        { setting: 'bitmapMargins', label: 'BitmapMargins', propertyName: 'BitmapMargins', type: 'text', introducedBy: 'TImage' },
        { setting: 'disableInterpolation', label: 'DisableInterpolation', propertyName: 'DisableInterpolation', type: 'checkbox', introducedBy: 'TImage' },
        { setting: 'marginWrapMode', label: 'MarginWrapMode', propertyName: 'MarginWrapMode', type: 'select', options: [{ id: 'original', label: 'Original' }, { id: 'fit', label: 'Fit' }, { id: 'stretch', label: 'Stretch' }, { id: 'tile', label: 'Tile' }], introducedBy: 'TImage' },
        { setting: 'multiResBitmap', label: 'MultiResBitmap', propertyName: 'MultiResBitmap', type: 'text', introducedBy: 'TImage' },
        { setting: 'wrapMode', label: 'WrapMode', propertyName: 'WrapMode', type: 'select', options: [{ id: 'original', label: 'Original' }, { id: 'fit', label: 'Fit' }, { id: 'stretch', label: 'Stretch' }, { id: 'tile', label: 'Tile' }], introducedBy: 'TImage' }
    ]
});