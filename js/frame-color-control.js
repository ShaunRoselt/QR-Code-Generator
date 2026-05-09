"use strict";

const FrameColorControl = {
    render({ id, label, value = '#000000' }) {
        const colorState = this.parseColorValue(value, '#000000');

        return `
            <div class="form-group frame-color-group">
                <label class="form-label" for="${id}">${this.translate(label)}</label>
                <div class="frame-color-control">
                    <input type="color" class="frame-color-input" id="${id}" value="${colorState.hex}">
                    <div class="frame-alpha-control">
                        <label class="frame-alpha-label" for="${id}Alpha">${this.translate('Opacity')}</label>
                        <input type="range" class="frame-alpha-input" id="${id}Alpha" min="0" max="100" step="1" value="${colorState.alphaPercent}">
                        <span class="frame-alpha-value" id="${id}AlphaValue">${colorState.alphaPercent}%</span>
                    </div>
                </div>
            </div>
        `;
    },

    getControl(root, id) {
        const picker = root.querySelector(`#${id}`);
        const alpha = root.querySelector(`#${id}Alpha`);
        const alphaValue = root.querySelector(`#${id}AlphaValue`);

        if (!picker || !alpha || !alphaValue) {
            return null;
        }

        return { picker, alpha, alphaValue };
    },

    bindControl(control, onInput, { markUserModified = false } = {}) {
        if (!control) {
            return;
        }

        let refreshRequest = null;

        const handleInput = () => {
            if (markUserModified) {
                control.picker.dataset.userModified = 'true';
            }

            this.updateAlphaValueLabel(control);

            if (refreshRequest !== null) {
                return;
            }

            refreshRequest = window.requestAnimationFrame(() => {
                refreshRequest = null;
                onInput?.(control);
            });
        };

        control.picker.addEventListener('input', handleInput);
        control.alpha.addEventListener('input', handleInput);
    },

    updateAlphaValueLabel(control) {
        if (!control) {
            return;
        }

        const newText = `${control.alpha.value}%`;
        if (control.alphaValue.textContent !== newText) {
            control.alphaValue.textContent = newText;
        }
    },

    setValue(control, colorValue) {
        if (!control) {
            return;
        }

        const colorState = this.parseColorValue(colorValue, control.picker.value || '#000000');
        control.picker.value = colorState.hex;
        control.alpha.value = String(colorState.alphaPercent);
        this.updateAlphaValueLabel(control);
    },

    getValue(control) {
        if (!control) {
            return '#000000';
        }

        return this.composeColorValue(control.picker.value, control.alpha.value);
    },

    normalizeColorValue(value, fallback) {
        return this.parseColorValue(value, fallback).css;
    },

    parseColorValue(value, fallback = '#000000') {
        const fallbackState = this.parseColorString(fallback) || {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1
        };
        const parsedValue = this.parseColorString(value) || fallbackState;

        return this.createColorState(parsedValue);
    },

    composeColorValue(hexColor, alphaPercent = 100) {
        const colorState = this.parseColorValue(hexColor, '#000000');
        const normalizedAlphaPercent = Math.max(0, Math.min(100, Number(alphaPercent) || 0));

        return this.createColorState({
            red: colorState.red,
            green: colorState.green,
            blue: colorState.blue,
            alpha: normalizedAlphaPercent / 100
        }).css;
    },

    parseColorString(value) {
        if (typeof value !== 'string') {
            return null;
        }

        const normalizedValue = value.trim();
        if (!normalizedValue) {
            return null;
        }

        if (/^transparent$/i.test(normalizedValue)) {
            return {
                red: 255,
                green: 255,
                blue: 255,
                alpha: 0
            };
        }

        const hexMatch = normalizedValue.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
        if (hexMatch) {
            const hexValue = hexMatch[1];
            const expandedHex = hexValue.length <= 4
                ? hexValue.split('').map(char => char + char).join('')
                : hexValue;

            const hasAlpha = expandedHex.length === 8;
            const red = Number.parseInt(expandedHex.slice(0, 2), 16);
            const green = Number.parseInt(expandedHex.slice(2, 4), 16);
            const blue = Number.parseInt(expandedHex.slice(4, 6), 16);
            const alpha = hasAlpha
                ? Number.parseInt(expandedHex.slice(6, 8), 16) / 255
                : 1;

            return { red, green, blue, alpha };
        }

        const rgbMatch = normalizedValue.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+|1\.0+)\s*)?\)$/i);
        if (rgbMatch) {
            return {
                red: this.clampColorChannel(Number.parseInt(rgbMatch[1], 10)),
                green: this.clampColorChannel(Number.parseInt(rgbMatch[2], 10)),
                blue: this.clampColorChannel(Number.parseInt(rgbMatch[3], 10)),
                alpha: rgbMatch[4] === undefined ? 1 : this.clampAlpha(Number.parseFloat(rgbMatch[4]))
            };
        }

        return null;
    },

    createColorState({ red, green, blue, alpha }) {
        const clampedRed = this.clampColorChannel(red);
        const clampedGreen = this.clampColorChannel(green);
        const clampedBlue = this.clampColorChannel(blue);
        const clampedAlpha = this.clampAlpha(alpha);
        const alphaPercent = Math.round(clampedAlpha * 100);
        const hex = `#${this.channelToHex(clampedRed)}${this.channelToHex(clampedGreen)}${this.channelToHex(clampedBlue)}`;

        return {
            red: clampedRed,
            green: clampedGreen,
            blue: clampedBlue,
            alpha: clampedAlpha,
            alphaPercent,
            hex,
            css: alphaPercent >= 100
                ? hex
                : `rgba(${clampedRed}, ${clampedGreen}, ${clampedBlue}, ${this.formatAlpha(clampedAlpha)})`
        };
    },

    clampColorChannel(value) {
        return Math.max(0, Math.min(255, Number.isFinite(value) ? value : 0));
    },

    clampAlpha(value) {
        return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 1));
    },

    channelToHex(value) {
        return Math.round(value).toString(16).padStart(2, '0');
    },

    formatAlpha(value) {
        return Number(value.toFixed(2)).toString();
    },

    translate(text) {
        return typeof I18n !== 'undefined' ? I18n.translateString(text) : text;
    }
};

window.FrameColorControl = FrameColorControl;