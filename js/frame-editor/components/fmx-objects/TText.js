"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TText',
    unitName: 'FMX.Objects',
    inheritsFrom: 'TControl',
    renderType: 'text',
    name: 'TText',
    description: '2D text object.',
    icon: 'bi-fonts',
    defaults: {
        text: 'Text',
        width: 140,
        height: 38,
        autoSize: false,
        color: '#ffffff',
        font: '',
        fontSize: 18,
        textAlign: 'center',
        prefixStyle: 'hidePrefix',
        stretch: false,
        textSettings: '',
        trimming: 'none',
        vertTextAlign: 'center',
        wordWrap: false,
        backgroundColor: 'transparent'
    },
    properties: [
        { setting: 'autoSize', label: 'AutoSize', propertyName: 'AutoSize', type: 'checkbox', introducedBy: 'TText' },
        { setting: 'color', label: 'Color', propertyName: 'Color', type: 'color', introducedBy: 'TText' },
        { setting: 'font', label: 'Font', propertyName: 'Font', type: 'text', introducedBy: 'TText' },
        { setting: 'textAlign', label: 'HorzTextAlign', propertyName: 'HorzTextAlign', type: 'select', options: [{ id: 'left', label: 'Leading' }, { id: 'center', label: 'Center' }, { id: 'right', label: 'Trailing' }], introducedBy: 'TText' },
        { setting: 'prefixStyle', label: 'PrefixStyle', propertyName: 'PrefixStyle', type: 'select', options: [{ id: 'hidePrefix', label: 'HidePrefix' }, { id: 'showPrefix', label: 'ShowPrefix' }, { id: 'noPrefix', label: 'NoPrefix' }], introducedBy: 'TText' },
        { setting: 'stretch', label: 'Stretch', propertyName: 'Stretch', type: 'checkbox', introducedBy: 'TText' },
        { setting: 'text', label: 'Text', propertyName: 'Text', type: 'textarea', introducedBy: 'TText' },
        { setting: 'textSettings', label: 'TextSettings', propertyName: 'TextSettings', type: 'text', introducedBy: 'TText' },
        { setting: 'trimming', label: 'Trimming', propertyName: 'Trimming', type: 'select', options: [{ id: 'none', label: 'None' }, { id: 'character', label: 'Character' }, { id: 'word', label: 'Word' }], introducedBy: 'TText' },
        { setting: 'vertTextAlign', label: 'VertTextAlign', propertyName: 'VertTextAlign', type: 'select', options: [{ id: 'leading', label: 'Leading' }, { id: 'center', label: 'Center' }, { id: 'trailing', label: 'Trailing' }], introducedBy: 'TText' },
        { setting: 'wordWrap', label: 'WordWrap', propertyName: 'WordWrap', type: 'checkbox', introducedBy: 'TText' }
    ]
});