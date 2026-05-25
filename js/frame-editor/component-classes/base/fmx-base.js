"use strict";

(function registerFrameEditorBaseComponentClasses(catalog) {
    const boolProperty = (setting, label, defaultValue = true, introducedBy = 'TControl') => ({
        setting,
        label,
        propertyName: label,
        type: 'checkbox',
        defaultValue,
        introducedBy
    });

    catalog.registerClass({
        className: 'TObject',
        unitName: 'System',
        abstract: true,
        defaults: {
            name: ''
        },
        properties: [
            { setting: 'className', label: 'ClassName', propertyName: 'ClassName', type: 'readonly', introducedBy: 'TObject' }
        ]
    });

    catalog.registerClass({
        className: 'TPersistent',
        unitName: 'System.Classes',
        inheritsFrom: 'TObject',
        abstract: true,
        description: 'Base class for persistent objects.'
    });

    catalog.registerClass({
        className: 'TComponent',
        unitName: 'System.Classes',
        inheritsFrom: 'TPersistent',
        abstract: true,
        properties: [
            { setting: 'name', label: 'Name', propertyName: 'Name', type: 'text', introducedBy: 'TComponent' },
            { setting: 'tag', label: 'Tag', propertyName: 'Tag', type: 'number', min: 0, max: 2147483647, step: 1, introducedBy: 'TComponent' }
        ],
        defaults: {
            tag: 0
        }
    });

    catalog.registerClass({
        className: 'TAniCalculations',
        unitName: 'FMX.InertialMovement',
        inheritsFrom: 'TPersistent',
        abstract: true,
        description: 'Base inertial movement calculations class.'
    });

    catalog.registerClass({
        className: 'TFixedMultiResBitmap',
        unitName: 'FMX.MultiResBitmap',
        inheritsFrom: 'TPersistent',
        abstract: true,
        description: 'Base fixed multi-resolution bitmap class.'
    });

    catalog.registerClass({
        className: 'TFmxObject',
        unitName: 'FMX.Types',
        inheritsFrom: 'TComponent',
        abstract: true,
        properties: [
            { setting: 'parentId', label: 'Parent', propertyName: 'Parent', type: 'readonly', introducedBy: 'TFmxObject' }
        ],
        defaults: {
            parentId: ''
        }
    });

    catalog.registerClass({
        className: 'TControl',
        unitName: 'FMX.Controls',
        inheritsFrom: 'TFmxObject',
        abstract: true,
        defaults: {
            align: 'none',
            anchors: 'left,top',
            enabled: true,
            hitTest: true,
            locked: false,
            opacity: 1,
            visible: true,
            width: 160,
            height: 44,
            xPct: 50,
            yPct: 52,
            rotation: 0,
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingLinked: true
        },
        properties: [
            { setting: 'align', label: 'Align', propertyName: 'Align', type: 'select', options: catalog.ALIGN_OPTIONS, introducedBy: 'TControl' },
            { setting: 'anchors', label: 'Anchors', propertyName: 'Anchors', type: 'text', introducedBy: 'TControl' },
            boolProperty('enabled', 'Enabled'),
            { setting: 'height', label: 'Height', propertyName: 'Height', type: 'number', min: 1, max: 20000, step: 1, unit: 'px', introducedBy: 'TControl' },
            boolProperty('hitTest', 'HitTest'),
            boolProperty('locked', 'Locked', false),
            { setting: 'marginBottom', label: 'Margins.Bottom', propertyName: 'Margins.Bottom', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TControl' },
            { setting: 'marginLeft', label: 'Margins.Left', propertyName: 'Margins.Left', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TControl' },
            { setting: 'marginRight', label: 'Margins.Right', propertyName: 'Margins.Right', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TControl' },
            { setting: 'marginTop', label: 'Margins.Top', propertyName: 'Margins.Top', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TControl' },
            { setting: 'opacity', label: 'Opacity', propertyName: 'Opacity', type: 'number', min: 0, max: 1, step: 0.01, introducedBy: 'TControl' },
            { setting: 'paddingBottom', label: 'Padding.Bottom', propertyName: 'Padding.Bottom', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TControl' },
            { setting: 'paddingLeft', label: 'Padding.Left', propertyName: 'Padding.Left', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TControl' },
            { setting: 'paddingRight', label: 'Padding.Right', propertyName: 'Padding.Right', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TControl' },
            { setting: 'paddingTop', label: 'Padding.Top', propertyName: 'Padding.Top', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TControl' },
            { setting: 'xPct', label: 'Position.X', propertyName: 'Position.X', type: 'number', min: 0, max: 100, step: 0.1, unit: '%', introducedBy: 'TControl' },
            { setting: 'yPct', label: 'Position.Y', propertyName: 'Position.Y', type: 'number', min: 0, max: 100, step: 0.1, unit: '%', introducedBy: 'TControl' },
            { setting: 'rotation', label: 'RotationAngle', propertyName: 'RotationAngle', type: 'number', min: -180, max: 180, step: 1, unit: 'deg', introducedBy: 'TControl' },
            boolProperty('visible', 'Visible'),
            { setting: 'width', label: 'Width', propertyName: 'Width', type: 'number', min: 1, max: 20000, step: 1, unit: 'px', introducedBy: 'TControl' }
        ]
    });

    catalog.registerClass({
        className: 'TStyledControl',
        unitName: 'FMX.Controls',
        inheritsFrom: 'TControl',
        abstract: true,
        defaults: {
            backgroundColor: 'transparent',
            borderColor: '#ffffff',
            borderRadius: 8,
            borderWidth: 0
        },
        properties: [
            { setting: 'backgroundColorRaw', valueKey: 'backgroundColor', label: 'Background', propertyName: 'Background', type: 'color', introducedBy: 'TStyledControl' },
            { setting: 'borderColor', label: 'BorderColor', propertyName: 'BorderColor', type: 'color', introducedBy: 'TStyledControl' },
            { setting: 'borderRadius', label: 'BorderRadius', propertyName: 'BorderRadius', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TStyledControl' },
            { setting: 'borderWidth', label: 'BorderWidth', propertyName: 'BorderWidth', type: 'number', min: 0, max: 2000, step: 1, unit: 'px', introducedBy: 'TStyledControl' }
        ]
    });

    catalog.registerClass({
        className: 'TContent',
        unitName: 'FMX.Controls',
        inheritsFrom: 'TControl',
        abstract: true,
        description: 'Base class for content controls.',
        defaults: {
            width: 160,
            height: 120
        }
    });

    catalog.registerClass({
        className: 'TPresentedControl',
        unitName: 'FMX.Controls.Presentation',
        inheritsFrom: 'TStyledControl',
        abstract: true,
        defaults: {
            styledSettings: 'Family,Size,Style,FontColor'
        },
        properties: [
            { setting: 'styledSettings', label: 'StyledSettings', propertyName: 'StyledSettings', type: 'text', introducedBy: 'TPresentedControl' }
        ]
    });

    catalog.registerClass({
        className: 'TTextControl',
        unitName: 'FMX.StdCtrls',
        inheritsFrom: 'TStyledControl',
        abstract: true,
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
            { setting: 'color', label: 'FontColor', propertyName: 'FontColor', type: 'color', introducedBy: 'TTextControl' },
            { setting: 'fontSize', label: 'Font.Size', propertyName: 'Font.Size', type: 'number', min: 8, max: 240, step: 1, unit: 'px', introducedBy: 'TTextControl' },
            { setting: 'fontStyle', label: 'Font.Style', propertyName: 'Font.Style', type: 'select', options: [{ id: 'normal', label: 'Normal' }, { id: 'italic', label: 'Italic' }], introducedBy: 'TTextControl' },
            { setting: 'fontWeight', label: 'Font.Weight', propertyName: 'Font.Weight', type: 'number', min: 100, max: 900, step: 100, introducedBy: 'TTextControl' },
            { setting: 'textAlign', label: 'TextSettings.HorzAlign', propertyName: 'TextSettings.HorzAlign', type: 'select', options: [{ id: 'left', label: 'Leading' }, { id: 'center', label: 'Center' }, { id: 'right', label: 'Trailing' }], introducedBy: 'TTextControl' },
            { setting: 'text', label: 'Text', propertyName: 'Text', type: 'textarea', introducedBy: 'TTextControl' }
        ]
    });
})(FrameEditorComponentCatalog);