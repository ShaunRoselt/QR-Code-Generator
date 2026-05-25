"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TImageControl',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TStyledControl',
    name: 'TImageControl',
    description: 'Represents a graphical control used to display images on a FireMonkey form.',
    icon: 'bi-image',
    defaults: {
        width: 180,
        height: 140,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderRadius: 8,
        imageName: '',
        src: '',
        objectFit: 'contain'
    },
    properties: [
        { setting: 'imageUpload', valueKey: 'imageName', label: 'Bitmap', propertyName: 'Bitmap', type: 'imageUpload', introducedBy: 'TImageControl' },
        { setting: 'objectFit', label: 'WrapMode', propertyName: 'WrapMode', type: 'select', options: [{ id: 'contain', label: 'Fit' }, { id: 'cover', label: 'Stretch' }, { id: 'fill', label: 'Tile' }], introducedBy: 'TImageControl' }
    ]
});