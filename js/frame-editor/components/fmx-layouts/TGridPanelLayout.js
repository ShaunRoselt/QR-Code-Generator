"use strict";

FrameEditorComponentCatalog.registerComponent({
    className: 'TGridPanelLayout',
    unitName: 'FMX.Layouts',
    inheritsFrom: 'TControl',
    name: 'TGridPanelLayout',
    description: 'Grid panel layout control that places components within grid cells.',
    icon: 'bi-table',
    isContainer: true,
    defaults: {
        width: 360,
        height: 240,
        cellCount: 4,
        cellRect: '',
        cellSize: '',
        columnCollection: '2 columns',
        columnSpanIndex: 0,
        controlCollection: '',
        expandStyle: 'addRows',
        rowCollection: '2 rows',
        rowSpanIndex: 0,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.22)',
        borderWidth: 1
    },
    properties: [
        { setting: 'cellCount', label: 'CellCount', propertyName: 'CellCount', type: 'readonly', introducedBy: 'TGridPanelLayout' },
        { setting: 'cellRect', label: 'CellRect', propertyName: 'CellRect', type: 'readonly', introducedBy: 'TGridPanelLayout' },
        { setting: 'cellSize', label: 'CellSize', propertyName: 'CellSize', type: 'readonly', introducedBy: 'TGridPanelLayout' },
        { setting: 'columnCollection', label: 'ColumnCollection', propertyName: 'ColumnCollection', type: 'text', introducedBy: 'TGridPanelLayout' },
        { setting: 'columnSpanIndex', label: 'ColumnSpanIndex', propertyName: 'ColumnSpanIndex', type: 'number', min: 0, max: 1000, step: 1, introducedBy: 'TGridPanelLayout' },
        { setting: 'controlCollection', label: 'ControlCollection', propertyName: 'ControlCollection', type: 'text', introducedBy: 'TGridPanelLayout' },
        { setting: 'expandStyle', label: 'ExpandStyle', propertyName: 'ExpandStyle', type: 'select', options: [{ id: 'addRows', label: 'AddRows' }, { id: 'addColumns', label: 'AddColumns' }, { id: 'fixedSize', label: 'FixedSize' }], introducedBy: 'TGridPanelLayout' },
        { setting: 'rowCollection', label: 'RowCollection', propertyName: 'RowCollection', type: 'text', introducedBy: 'TGridPanelLayout' },
        { setting: 'rowSpanIndex', label: 'RowSpanIndex', propertyName: 'RowSpanIndex', type: 'number', min: 0, max: 1000, step: 1, introducedBy: 'TGridPanelLayout' }
    ]
});