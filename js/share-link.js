const QRShareLink = {
    STATE_PARAM: 'state',
    KIOSK_PARAM: 'kiosk',
    ROUTE_EVENT: 'app:route-rendered',
    SHARE_BUTTON_ID: 'shareLinkButton',
    EDITABLE_SHARE_BUTTON_ID: 'shareEditableLinkButton',
    TOAST_CONTAINER_ID: 'appToastContainer',
    RESTORING_CLASS: 'share-state-restoring',
    STATE_VERSION: 1,
    appliedStateToken: null,
    restoreTimeoutId: null,
    toastTimeoutId: null,

    init() {
        document.addEventListener(this.ROUTE_EVENT, () => {
            this.preparePage();
            this.beginStateRestore();
            this.restoreStateFromUrl();
            this.scheduleDeferredRestore();
        });
    },

    preparePage() {
        this.applyKioskMode();
        QRCodeExportControls.init(document);
        this.ensureToastContainer();
        this.injectShareButtons();
    },

    beginStateRestore() {
        const hasState = new URLSearchParams(window.location.search).has(this.STATE_PARAM);
        document.body.classList.toggle(this.RESTORING_CLASS, hasState);
    },

    completeStateRestore() {
        window.requestAnimationFrame(() => {
            document.body.classList.remove(this.RESTORING_CLASS);
        });
    },

    scheduleDeferredRestore() {
        const hasState = new URLSearchParams(window.location.search).has(this.STATE_PARAM);
        if (!hasState) {
            this.completeStateRestore();
            return;
        }

        window.clearTimeout(this.restoreTimeoutId);
        this.restoreTimeoutId = window.setTimeout(() => {
            this.appliedStateToken = null;
            this.preparePage();
            this.restoreStateFromUrl();
            this.completeStateRestore();
        }, 0);
    },

    isKioskMode() {
        const value = new URLSearchParams(window.location.search).get(this.KIOSK_PARAM);
        return value === '1' || value === 'true';
    },

    applyKioskMode() {
        document.body.classList.toggle('kiosk-mode', this.isKioskMode());
    },

    getCurrentPage() {
        return new URLSearchParams(window.location.search).get('page') || '';
    },

    getPageRoot() {
        return document.querySelector('.qr-mode-page');
    },

    injectShareButtons() {
        const downloadButtons = document.querySelector('#downloadOptions .download-buttons');
        if (!downloadButtons) {
            return;
        }

        if (!downloadButtons.querySelector(`#${this.SHARE_BUTTON_ID}`)) {
            downloadButtons.appendChild(this.createShareButton({
                id: this.SHARE_BUTTON_ID,
                label: I18n.translateString('Share Link'),
                icon: 'bi-link-45deg',
                kiosk: true,
                successMessage: I18n.translateString('Kiosk share link copied.')
            }));
        }

        if (!downloadButtons.querySelector(`#${this.EDITABLE_SHARE_BUTTON_ID}`)) {
            downloadButtons.appendChild(this.createShareButton({
                id: this.EDITABLE_SHARE_BUTTON_ID,
                label: I18n.translateString('Share Editable Link'),
                icon: 'bi-pencil-square',
                kiosk: false,
                successMessage: I18n.translateString('Editable share link copied.')
            }));
        }
    },

    createShareButton({ id, label, icon, kiosk, successMessage }) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-secondary btn-block';
        button.id = id;
        button.innerHTML = `
            <i class="bi ${icon}"></i>
            ${label}
        `;
        button.addEventListener('click', async () => {
            const shareUrl = this.buildShareUrl({ kiosk });
            if (!shareUrl) {
                this.showToast(I18n.translateString('Generate a QR code first to create a share link.'), 'error');
                return;
            }

            const copied = await this.copyToClipboard(shareUrl);
            if (copied) {
                this.showToast(successMessage);
                return;
            }

            window.prompt(I18n.translateString('Copy this share link'), shareUrl);
        });

        return button;
    },

    buildShareUrl({ kiosk = true } = {}) {
        const page = this.getCurrentPage();
        const pageRoot = this.getPageRoot();
        const downloadOptions = document.getElementById('downloadOptions');
        if (!page || !pageRoot || !downloadOptions || downloadOptions.classList.contains('d-none')) {
            return null;
        }

        const payload = this.collectState(pageRoot);
        payload.v = this.STATE_VERSION;
        payload.p = page;
        payload.a = 1;

        const shareUrl = new URL(window.location.href);
        shareUrl.search = '';
        shareUrl.searchParams.set('page', page);
        shareUrl.searchParams.set(this.STATE_PARAM, this.encodeState(payload));
        if (kiosk) {
            shareUrl.searchParams.set(this.KIOSK_PARAM, '1');
        }
        return shareUrl.toString();
    },

    collectState(pageRoot) {
        const controls = {};
        pageRoot.querySelectorAll('input[id], textarea[id], select[id]').forEach(control => {
            if (!this.shouldSerializeControl(control)) {
                return;
            }

            const value = this.getControlValue(control);
            const defaultValue = this.getDefaultControlValue(control);
            if (value === defaultValue) {
                return;
            }

            controls[control.id] = value;
        });

        const payload = {};
        if (Object.keys(controls).length > 0) {
            payload.c = controls;
        }

        const frameType = pageRoot.querySelector('.frame-card.active')?.dataset.frame;
        if (frameType && frameType !== 'none') {
            payload.f = frameType;
        }

        return payload;
    },

    shouldSerializeControl(control) {
        if (control.disabled || !control.id) {
            return false;
        }

        return !['button', 'submit', 'reset', 'file'].includes(control.type);
    },

    getControlValue(control) {
        if (control.type === 'checkbox' || control.type === 'radio') {
            return control.checked ? 1 : 0;
        }

        return control.value;
    },

    getDefaultControlValue(control) {
        if (control.type === 'checkbox' || control.type === 'radio') {
            return control.defaultChecked ? 1 : 0;
        }

        if (control.tagName === 'SELECT') {
            const defaultOption = Array.from(control.options).find(option => option.defaultSelected) || control.options[0];
            return defaultOption ? defaultOption.value : control.value;
        }

        return control.defaultValue;
    },

    encodeState(payload) {
        const json = JSON.stringify(payload);
        const bytes = new TextEncoder().encode(json);
        let binary = '';
        bytes.forEach(byte => {
            binary += String.fromCharCode(byte);
        });

        return btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');
    },

    decodeState(encodedState) {
        const base64 = encodedState
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        const binary = atob(paddedBase64);
        const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
    },

    restoreStateFromUrl() {
        const pageRoot = this.getPageRoot();
        const encodedState = new URLSearchParams(window.location.search).get(this.STATE_PARAM);
        if (!pageRoot || !encodedState) {
            this.appliedStateToken = null;
            this.completeStateRestore();
            return;
        }

        const page = this.getCurrentPage();
        const stateToken = `${page}:${encodedState}`;
        if (this.appliedStateToken === stateToken) {
            return;
        }

        let payload;
        try {
            payload = this.decodeState(encodedState);
        } catch (error) {
            console.error('Failed to decode QR share state.', error);
            this.appliedStateToken = stateToken;
            this.completeStateRestore();
            return;
        }

        if (payload.p && payload.p !== page) {
            this.appliedStateToken = stateToken;
            this.completeStateRestore();
            return;
        }

        Object.entries(payload.c || {}).forEach(([id, value]) => {
            const control = document.getElementById(id);
            if (!control || !this.shouldSerializeControl(control)) {
                return;
            }

            this.setControlValue(control, value);
        });

        const exportSizeSelect = document.getElementById('exportSize');
        if (exportSizeSelect && payload.c?.exportSize) {
            exportSizeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        this.appliedStateToken = stateToken;

        if (payload.f) {
            const frameCard = Array.from(pageRoot.querySelectorAll('.frame-card')).find(card => card.dataset.frame === payload.f);
            if (frameCard) {
                frameCard.click();
                return;
            }
        }

        if (payload.a) {
            this.triggerGeneration(pageRoot);
            return;
        }

        this.completeStateRestore();
    },

    setControlValue(control, value) {
        if (control.type === 'checkbox' || control.type === 'radio') {
            control.checked = value === 1 || value === true || value === '1' || value === 'true';
            return;
        }

        control.value = value;
    },

    triggerGeneration(pageRoot) {
        const firstControl = pageRoot.querySelector('.qr-form-section input[id], .qr-form-section textarea[id], .qr-form-section select[id]');
        if (!firstControl) {
            return;
        }

        const eventName = (firstControl.tagName === 'SELECT' || firstControl.type === 'checkbox' || firstControl.type === 'radio')
            ? 'change'
            : 'input';
        firstControl.dispatchEvent(new Event(eventName, { bubbles: true }));
    },

    async copyToClipboard(text) {
        if (!navigator.clipboard?.writeText) {
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            return false;
        }
    },

    ensureToastContainer() {
        if (document.getElementById(this.TOAST_CONTAINER_ID)) {
            return;
        }

        const container = document.createElement('div');
        container.id = this.TOAST_CONTAINER_ID;
        container.className = 'app-toast-container';
        document.body.appendChild(container);
    },

    showToast(message, tone = 'success') {
        this.ensureToastContainer();

        const container = document.getElementById(this.TOAST_CONTAINER_ID);
        if (!container) {
            return;
        }

        container.innerHTML = '';

        const toast = document.createElement('div');
        toast.className = `app-toast ${tone}`;
        toast.textContent = message;
        container.appendChild(toast);

        window.clearTimeout(this.toastTimeoutId);
        window.requestAnimationFrame(() => {
            toast.classList.add('visible');
        });

        this.toastTimeoutId = window.setTimeout(() => {
            toast.classList.remove('visible');
            window.setTimeout(() => {
                if (toast.parentElement === container) {
                    container.removeChild(toast);
                }
            }, 180);
        }, 2200);
    }
};

QRShareLink.init();