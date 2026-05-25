"use strict";

FrameEditorBlockCatalog.register({
    type: 'columns',
    name: 'Columns Block',
    description: 'Create a multi-column container for nested blocks.',
    icon: 'bi-columns-gap',
    properties: [
        { setting: 'backgroundColorRaw', valueKey: 'backgroundColor', label: 'Background', type: 'color', allowTransparent: true },
        { setting: 'borderColor', label: 'Border color', type: 'color' },
        { setting: 'borderRadius', label: 'Border radius', type: 'number', min: 0, max: 120, step: 1, unit: 'px' },
        { setting: 'borderWidth', label: 'Border width', type: 'number', min: 0, max: 20, step: 1, unit: 'px' },
        { setting: 'childAlignment', label: 'Child alignment', type: 'select', options: [{ id: 'left', label: 'Left' }, { id: 'center', label: 'Center' }, { id: 'right', label: 'Right' }] },
        { setting: 'childGap', label: 'Child gap', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'columnCount', label: 'Column count', type: 'number', min: 2, max: 6, step: 1 },
        { setting: 'columnGap', label: 'Column gap', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'height', label: 'Height', type: 'number', min: 180, max: 20000, step: 4, unit: 'px' },
        { setting: 'paddingBottom', label: 'Padding bottom', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'paddingLeft', label: 'Padding left', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'paddingLinked', label: 'Padding linked', type: 'checkbox' },
        { setting: 'paddingRight', label: 'Padding right', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'paddingTop', label: 'Padding top', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
        { setting: 'width', label: 'Width', type: 'number', min: 280, max: 20000, step: 4, unit: 'px' }
    ],
    createBlock(context) {
        const defaultColor = context.getDefaultColor ? context.getDefaultColor() : '#111111';
        return {
            id: context.id,
            type: 'columns',
            xPct: context.xPct,
            yPct: context.yPct,
            width: 420,
            height: 240,
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
            columnCount: 2,
            columnGap: 24,
            parentId: context.parentId,
            childOrder: context.childOrder,
            columnIndex: context.columnIndex
        };
    }
});