"use strict";

FrameEditorBlockCatalog.register({
    type: 'section',
    name: 'Section Block',
    description: 'Create a vertical container that holds and aligns child blocks.',
    icon: 'bi-layout-text-window',
    properties: [
        { setting: 'backgroundColorRaw', valueKey: 'backgroundColor', label: 'Background', type: 'color', allowTransparent: true },
        { setting: 'borderColor', label: 'Border color', type: 'color' },
        { setting: 'borderRadius', label: 'Border radius', type: 'number', min: 0, max: 120, step: 1, unit: 'px' },
        { setting: 'borderWidth', label: 'Border width', type: 'number', min: 0, max: 20, step: 1, unit: 'px' },
        { setting: 'childAlignment', label: 'Child alignment', type: 'select', options: [{ id: 'left', label: 'Left' }, { id: 'center', label: 'Center' }, { id: 'right', label: 'Right' }] },
        { setting: 'childGap', label: 'Child gap', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'height', label: 'Height', type: 'number', min: 160, max: 20000, step: 4, unit: 'px' },
        { setting: 'paddingBottom', label: 'Padding bottom', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'paddingLeft', label: 'Padding left', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'paddingLinked', label: 'Padding linked', type: 'checkbox' },
        { setting: 'paddingRight', label: 'Padding right', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'paddingTop', label: 'Padding top', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'width', label: 'Width', type: 'number', min: 220, max: 20000, step: 4, unit: 'px' }
    ],
    createBlock(context) {
        const defaultColor = context.getDefaultColor ? context.getDefaultColor() : '#111111';
        return {
            id: context.id,
            type: 'section',
            xPct: context.xPct,
            yPct: context.yPct,
            width: 320,
            height: 220,
            backgroundColor: 'transparent',
            paddingTop: 18,
            paddingRight: 18,
            paddingBottom: 18,
            paddingLeft: 18,
            paddingX: 18,
            paddingY: 18,
            paddingLinked: true,
            borderWidth: 1,
            borderRadius: 18,
            borderColor: defaultColor,
            rotation: 0,
            childAlignment: 'left',
            childGap: 12,
            parentId: context.parentId,
            childOrder: context.childOrder,
            columnIndex: context.columnIndex
        };
    }
});