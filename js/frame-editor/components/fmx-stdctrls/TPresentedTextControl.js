"use strict";

FrameEditorComponentCatalog.registerClass({
    className: 'TPresentedTextControl',
    unitName: 'FMX.StdCtrls',
    inheritsFrom: 'TPresentedControl',
    abstract: true,
    description: 'Base class for all presented text controls such as TLabel.',
    defaults: {
        text: 'Text',
        color: '#ffffff',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 400,
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: 0,
        textDecoration: 'none',
        textTransform: 'none'
    },
    properties: [
        { setting: 'color', label: 'FontColor', propertyName: 'FontColor', type: 'color', introducedBy: 'TPresentedTextControl' },
        { setting: 'fontSize', label: 'Font.Size', propertyName: 'Font.Size', type: 'number', min: 8, max: 240, step: 1, unit: 'px', introducedBy: 'TPresentedTextControl' },
        { setting: 'fontStyle', label: 'Font.Style', propertyName: 'Font.Style', type: 'select', options: [{ id: 'normal', label: 'Normal' }, { id: 'italic', label: 'Italic' }], introducedBy: 'TPresentedTextControl' },
        { setting: 'fontWeight', label: 'Font.Weight', propertyName: 'Font.Weight', type: 'number', min: 100, max: 900, step: 100, introducedBy: 'TPresentedTextControl' },
        { setting: 'textAlign', label: 'TextSettings.HorzAlign', propertyName: 'TextSettings.HorzAlign', type: 'select', options: [{ id: 'left', label: 'Leading' }, { id: 'center', label: 'Center' }, { id: 'right', label: 'Trailing' }], introducedBy: 'TPresentedTextControl' },
        { setting: 'text', label: 'Text', propertyName: 'Text', type: 'textarea', introducedBy: 'TPresentedTextControl' }
    ]
});