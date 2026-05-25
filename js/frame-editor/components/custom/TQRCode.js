"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TQRCode',
    unitName: 'FrameEditor.Custom',
    inheritsFrom: 'TStyledControl',
    renderType: 'qr',
    name: 'TQRCode',
    description: 'Custom QR code component for the current generator content.',
    icon: 'bi-qr-code',
    defaults(context = {}) {
        const defaultColor = context.getDefaultColor ? context.getDefaultColor() : '#111111';
        return {
            size: 180,
            width: 180,
            height: 180,
            colorDark: '#111111',
            colorLight: 'transparent',
            backgroundColor: 'transparent',
            borderColor: defaultColor,
            borderRadius: 0,
            borderWidth: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingX: 0,
            paddingY: 0,
            paddingLinked: true,
            qrRotation: 0
        };
    },
    properties: [
        { setting: 'backgroundColorRaw', valueKey: 'backgroundColor', label: 'Background', propertyName: 'Background', type: 'color', allowTransparent: true, introducedBy: 'TQRCode' },
        { setting: 'borderColor', label: 'BorderColor', propertyName: 'BorderColor', type: 'color', introducedBy: 'TQRCode' },
        { setting: 'borderRadius', label: 'BorderRadius', propertyName: 'BorderRadius', type: 'number', min: 0, max: 48, step: 1, unit: 'px', introducedBy: 'TQRCode' },
        { setting: 'borderWidth', label: 'BorderWidth', propertyName: 'BorderWidth', type: 'number', min: 0, max: 20, step: 1, unit: 'px', introducedBy: 'TQRCode' },
        { setting: 'colorDark', label: 'QRColorDark', propertyName: 'QRColorDark', type: 'color', introducedBy: 'TQRCode' },
        { setting: 'colorLight', label: 'QRColorLight', propertyName: 'QRColorLight', type: 'color', introducedBy: 'TQRCode' },
        { setting: 'paddingBottom', label: 'Padding.Bottom', propertyName: 'Padding.Bottom', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TQRCode' },
        { setting: 'paddingLeft', label: 'Padding.Left', propertyName: 'Padding.Left', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TQRCode' },
        { setting: 'paddingLinked', label: 'Padding.Linked', propertyName: 'Padding.Linked', type: 'checkbox', introducedBy: 'TQRCode' },
        { setting: 'paddingRight', label: 'Padding.Right', propertyName: 'Padding.Right', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TQRCode' },
        { setting: 'paddingTop', label: 'Padding.Top', propertyName: 'Padding.Top', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TQRCode' },
        { setting: 'qrRotation', label: 'QRRotation', propertyName: 'QRRotation', type: 'number', min: -180, max: 180, step: 1, unit: 'deg', introducedBy: 'TQRCode' },
        { setting: 'size', label: 'QRSize', propertyName: 'QRSize', type: 'number', min: 80, max: 20000, step: 4, unit: 'px', introducedBy: 'TQRCode' }
    ]
});