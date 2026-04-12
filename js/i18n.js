const I18n = {
    STORAGE_KEY: 'qr-language',
    DEFAULT_LANGUAGE: 'en',
    languages: {},
    currentLanguage: 'en',

    registerLanguage(code, definition) {
        if (!code || !definition) {
            return;
        }

        this.languages[code] = {
            code,
            name: definition.name || code,
            nativeName: definition.nativeName || definition.name || code,
            strings: definition.strings || {}
        };
    },

    init() {
        const storedLanguage = this.getStoredLanguage();
        this.currentLanguage = this.languages[storedLanguage] ? storedLanguage : this.DEFAULT_LANGUAGE;
        document.documentElement.lang = this.currentLanguage;
        document.addEventListener('app:route-rendered', () => {
            this.apply(document.body);
        });
        this.apply(document.body);
    },

    getStoredLanguage() {
        try {
            return localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_LANGUAGE;
        } catch (error) {
            return this.DEFAULT_LANGUAGE;
        }
    },

    getLanguages() {
        return Object.values(this.languages);
    },

    getLanguage() {
        return this.currentLanguage;
    },

    setLanguage(code, { rerender = false } = {}) {
        if (!this.languages[code]) {
            code = this.DEFAULT_LANGUAGE;
        }

        this.currentLanguage = code;
        document.documentElement.lang = code;

        try {
            localStorage.setItem(this.STORAGE_KEY, code);
        } catch (error) {
            console.error('Failed to persist language preference:', error);
        }

        if (rerender && typeof router !== 'undefined') {
            router.handleRoute();
            return;
        }

        this.apply(document.body);
    },

    translateString(text) {
        if (!text) {
            return text;
        }

        const activeLanguage = this.languages[this.currentLanguage];
        return activeLanguage?.strings?.[text] || text;
    },

    translate(text, replacements = {}) {
        let translatedText = this.translateString(text);

        Object.entries(replacements).forEach(([key, value]) => {
            translatedText = translatedText.replaceAll(`{${key}}`, String(value));
        });

        return translatedText;
    },

    apply(root = document.body) {
        if (!root) {
            return;
        }

        this.translateTextNodes(root);
        this.translateAttributes(root, ['placeholder', 'title', 'aria-label']);
        document.title = this.translateString('QR Code Generator');
    },

    translateTextNodes(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: node => {
                    const parent = node.parentElement;
                    if (!parent || ['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const originalText = node.textContent;
            const trimmedText = originalText.trim();
            const translatedText = this.translateString(trimmedText);

            if (!trimmedText || translatedText === trimmedText) {
                continue;
            }

            const leadingWhitespace = originalText.match(/^\s*/)?.[0] || '';
            const trailingWhitespace = originalText.match(/\s*$/)?.[0] || '';
            node.textContent = `${leadingWhitespace}${translatedText}${trailingWhitespace}`;
        }
    },

    translateAttributes(root, attributeNames) {
        const selector = attributeNames.map(attributeName => `[${attributeName}]`).join(',');
        root.querySelectorAll(selector).forEach(element => {
            attributeNames.forEach(attributeName => {
                const value = element.getAttribute(attributeName);
                if (!value) {
                    return;
                }

                const translatedValue = this.translateString(value);
                if (translatedValue !== value) {
                    element.setAttribute(attributeName, translatedValue);
                }
            });
        });
    }
};