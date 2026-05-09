"use strict";

(function () {
    const catalog = window.QRFrameCatalog || {};

    catalog.version = 2;
    catalog.defaults = {
    "decorative": false,
    "supportsText": true,
    "defaultText": "Scan me!",
    "defaultTextColor": "frameColor",
    "defaultCustomization": {
        "frameColor": "#000000",
        "backgroundColor": "#ffffff",
        "textColor": null
    },
    "source": {
        "type": "builtin"
    }
};
    catalog.customFrameTemplate = {
    "name": "Custom",
    "decorative": false,
    "supportsText": false,
    "defaultText": "",
    "defaultTextColor": "frameColor",
    "defaultCustomization": {
        "frameColor": "#000000",
        "backgroundColor": "#ffffff",
        "textColor": null
    },
    "defaultQRRect": {
        "sizePct": 0.5
    },
    "source": {
        "type": "upload"
    }
};
    catalog.frameScriptPaths = [
    "js/frames/none.js",
    "js/frames/scanme.js",
    "js/frames/scanme-border.js",
    "js/frames/rounded-banner.js",
    "js/frames/outlined-label.js",
    "js/frames/footer-panel.js",
    "js/frames/center-badge.js",
    "js/frames/pointer-panel.js",
    "js/frames/bold-border.js",
    "js/frames/centered-qr.js",
    "js/frames/box-pointer.js",
    "js/frames/top-banner.js",
    "js/frames/sketch-border.js",
    "js/frames/script-card.js",
    "js/frames/video-panel.js",
    "js/frames/phone-screen.js",
    "js/frames/arrow-note.js",
    "js/frames/corner-accent.js",
    "js/frames/bag-tag.js",
    "js/frames/mailer.js",
    "js/frames/delivery-van.js",
    "js/frames/display-stand.js",
    "js/frames/sidebar-card.js",
    "js/frames/clipboard.js",
    "js/frames/notebook.js",
    "js/frames/folded-banner.js",
    "js/frames/ribbon.js",
    "js/frames/gift-bow.js"
];
    catalog.frames = Array.isArray(catalog.frames) ? catalog.frames : [];
    catalog.registerFrame = function registerFrame(frameDefinition) {
        if (!frameDefinition || !frameDefinition.id) {
            throw new Error("Frame definitions must include an id.");
        }

        const existingIndex = this.frames.findIndex(frame => frame.id === frameDefinition.id);
        if (existingIndex >= 0) {
            this.frames.splice(existingIndex, 1, frameDefinition);
            return frameDefinition;
        }

        this.frames.push(frameDefinition);
        return frameDefinition;
    };

    window.QRFrameCatalog = catalog;
})();
