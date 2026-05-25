"use strict";

(function registerFrameEditorComponentCatalog(global) {
    const ALIGN_OPTIONS = Object.freeze([
        { id: 'none', label: 'None' },
        { id: 'top', label: 'Top' },
        { id: 'left', label: 'Left' },
        { id: 'right', label: 'Right' },
        { id: 'bottom', label: 'Bottom' },
        { id: 'mostTop', label: 'MostTop' },
        { id: 'mostBottom', label: 'MostBottom' },
        { id: 'mostLeft', label: 'MostLeft' },
        { id: 'mostRight', label: 'MostRight' },
        { id: 'client', label: 'Client' },
        { id: 'contents', label: 'Contents' },
        { id: 'center', label: 'Center' },
        { id: 'vertCenter', label: 'VertCenter' },
        { id: 'horzCenter', label: 'HorzCenter' },
        { id: 'horizontal', label: 'Horizontal' },
        { id: 'vertical', label: 'Vertical' },
        { id: 'scale', label: 'Scale' },
        { id: 'fit', label: 'Fit' },
        { id: 'fitLeft', label: 'FitLeft' },
        { id: 'fitRight', label: 'FitRight' }
    ]);

    const ALIGN_VALUE_SET = new Set(ALIGN_OPTIONS.map(option => option.id));
    const classMap = new Map();
    const instanceCounters = new Map();

    const COMPONENT_TYPE_ALIASES = Object.freeze({
        text: 'TLabel',
        section: 'TPanel',
        columns: 'TGridPanelLayout',
        qr: 'TQRCode',
        shape: 'TRectangle',
        line: 'TLine',
        image: 'TImage'
    });

    function cloneProperty(property) {
        return {
            ...property,
            options: Array.isArray(property.options) ? property.options.map(option => ({ ...option })) : property.options
        };
    }

    function normalizeAlign(value) {
        const normalized = String(value || '').trim();
        return ALIGN_VALUE_SET.has(normalized) ? normalized : 'none';
    }

    function registerClass(definition) {
        if (!definition?.className) {
            return null;
        }

        const normalizedDefinition = {
            unitName: '',
            inheritsFrom: '',
            abstract: false,
            palette: false,
            properties: [],
            defaults: {},
            ...definition,
            properties: Array.isArray(definition.properties) ? definition.properties.map(cloneProperty) : []
        };
        classMap.set(normalizedDefinition.className, normalizedDefinition);
        return normalizedDefinition;
    }

    function registerComponent(definition) {
        return registerClass({
            palette: true,
            ...definition
        });
    }

    function resolveClassName(key) {
        if (!key) {
            return '';
        }
        if (classMap.has(key)) {
            return key;
        }
        return COMPONENT_TYPE_ALIASES[key] || '';
    }

    function getDefinition(key) {
        const className = resolveClassName(key);
        return className ? classMap.get(className) || null : null;
    }

    function getAncestorChain(className) {
        const chain = [];
        const visited = new Set();
        let currentClassName = resolveClassName(className);
        while (currentClassName && !visited.has(currentClassName)) {
            visited.add(currentClassName);
            const definition = classMap.get(currentClassName);
            if (!definition) {
                break;
            }
            chain.unshift(definition);
            currentClassName = definition.inheritsFrom || '';
        }
        return chain;
    }

    function getDefinitions() {
        return Array.from(classMap.values());
    }

    function getLibrary() {
        return getDefinitions()
            .filter(definition => definition.palette && !definition.abstract)
            .map(definition => ({
                type: definition.className,
                className: definition.className,
                unitName: definition.unitName,
                name: definition.name || definition.className,
                description: definition.description || definition.className,
                icon: definition.icon || 'bi-square'
            }));
    }

    function getDefaultsForClass(className, context = {}) {
        return getAncestorChain(className).reduce((defaults, definition) => {
            const nextDefaults = typeof definition.defaults === 'function'
                ? definition.defaults(context)
                : definition.defaults;
            return {
                ...defaults,
                ...(nextDefaults || {})
            };
        }, {});
    }

    function getProperties(key) {
        const propertiesByName = new Map();
        getAncestorChain(key).forEach(definition => {
            definition.properties.forEach(property => {
                const name = property.propertyName || property.label || property.setting;
                if (!name) {
                    return;
                }
                propertiesByName.set(name, {
                    ...cloneProperty(property),
                    propertyName: name,
                    introducedBy: property.introducedBy || definition.className,
                    unitName: property.unitName || definition.unitName
                });
            });
        });
        return Array.from(propertiesByName.values());
    }

    function getNextName(className) {
        const current = (instanceCounters.get(className) || 0) + 1;
        instanceCounters.set(className, current);
        return `${className.replace(/^T/, '')}${current}`;
    }

    function createComponent(key, context = {}) {
        const className = resolveClassName(key);
        const definition = getDefinition(className);
        if (!definition) {
            return null;
        }

        const inheritedDefaults = getDefaultsForClass(className, context);
        const component = typeof definition.createComponent === 'function'
            ? definition.createComponent(context, inheritedDefaults)
            : {};
        const defaultType = definition.renderType || className;
        return normalizeComponent({
            ...inheritedDefaults,
            ...component,
            id: context.id,
            type: component.type || defaultType,
            className,
            unitName: definition.unitName,
            name: component.name || inheritedDefaults.name || getNextName(className),
            xPct: Number.isFinite(context.xPct) ? context.xPct : inheritedDefaults.xPct,
            yPct: Number.isFinite(context.yPct) ? context.yPct : inheritedDefaults.yPct,
            parentId: context.parentId || '',
            childOrder: Number.isFinite(Number(context.childOrder)) ? Number(context.childOrder) : 0,
            columnIndex: Number.isFinite(Number(context.columnIndex)) ? Number(context.columnIndex) : 0
        });
    }

    function normalizeComponent(component) {
        if (!component || typeof component !== 'object') {
            return null;
        }
        const className = component.className || resolveClassName(component.type) || component.type || 'TControl';
        const definition = getDefinition(className);
        const inheritedDefaults = definition ? getDefaultsForClass(className) : {};
        return {
            ...inheritedDefaults,
            ...component,
            className,
            unitName: component.unitName || definition?.unitName || '',
            name: component.name || component.Name || component.id || '',
            align: normalizeAlign(component.align),
            marginTop: Math.max(0, Number(component.marginTop) || 0),
            marginRight: Math.max(0, Number(component.marginRight) || 0),
            marginBottom: Math.max(0, Number(component.marginBottom) || 0),
            marginLeft: Math.max(0, Number(component.marginLeft) || 0),
            opacity: Math.min(1, Math.max(0, Number(component.opacity ?? inheritedDefaults.opacity ?? 1)))
        };
    }

    global.FrameEditorComponentCatalog = {
        ALIGN_OPTIONS,
        COMPONENT_TYPE_ALIASES,
        registerClass,
        registerComponent,
        getDefinition,
        getDefinitions,
        getAncestorChain,
        getDefaultsForClass,
        getProperties,
        getLibrary,
        createComponent,
        normalizeAlign,
        normalizeComponent,
        resolveClassName,
        isSupportedType(key) {
            return Boolean(resolveClassName(key));
        }
    };
})(window);