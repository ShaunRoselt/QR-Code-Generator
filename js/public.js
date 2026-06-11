"use strict";

const PublicPage = {
    heroQrUrl: 'https://qrcode.apps.shaunroselt.com/',
    meta: {
        title: 'QR Code Generator | Professional Browser QR Code Maker',
        description: 'Create polished, print-ready QR codes in your browser for links, WiFi, contact cards, events, social profiles, and more. No signup required.',
        keywords: 'free QR code generator, QR code creator, QR code maker, browser QR code generator, WiFi QR code, vCard QR code',
        ogTitle: 'QR Code Generator | Professional Browser QR Code Maker',
        ogDescription: 'Generate polished QR codes locally in your browser, then export PNG or SVG files for screen and print.',
        ogUrl: 'https://qrcode.apps.shaunroselt.com/index.html?page=public',
        twitterTitle: 'QR Code Generator | Professional Browser QR Code Maker',
        twitterDescription: 'Create QR codes for websites, WiFi, events, contact cards, social links, and more.'
    },

    qrTypes: [
        { route: '/url', icon: 'bi-link-45deg', label: 'Website' },
        { route: '/wifi', icon: 'bi-wifi', label: 'WiFi' },
        { route: '/vcard', icon: 'bi-person-vcard', label: 'vCard' },
        { route: '/event', icon: 'bi-calendar-event', label: 'Event' },
        { route: '/social', icon: 'bi-share', label: 'Social' },
        { route: '/location', icon: 'bi-geo-alt', label: 'Location' },
        { route: '/email', icon: 'bi-envelope', label: 'Email' },
        { route: '/sms', icon: 'bi-chat-dots', label: 'SMS' },
        { route: '/appstore', icon: 'bi-shop', label: 'App Store' },
        { route: '/text', icon: 'bi-fonts', label: 'Text' },
        { route: '/phone', icon: 'bi-telephone', label: 'Phone' },
        { route: '/whatsapp', icon: 'bi-whatsapp', label: 'WhatsApp' }
    ],

    renderQrTypeLinks() {
        return this.qrTypes.map(type => `
            <a class="qr-type-link" href="?page=${type.route.slice(1)}" data-route="${type.route}">
                <i class="bi ${type.icon}" aria-hidden="true"></i>
                <span>${type.label}</span>
            </a>
        `).join('');
    },

    render() {
        const resolvedTheme = (typeof themeManager !== 'undefined' && typeof themeManager.getResolvedTheme === 'function')
            ? themeManager.getResolvedTheme()
            : (document.documentElement.getAttribute('data-theme') || 'dark');
        const iframeSrc = `index.html?page=home${resolvedTheme ? '&theme=' + encodeURIComponent(resolvedTheme) : ''}`;
        const editorIframeSrc = `index.html?page=url${resolvedTheme ? '&theme=' + encodeURIComponent(resolvedTheme) : ''}`;
        return `
            <div class="public-page public-website">
                <header class="marketing-topbar">
                    <div class="public-shell nav-shell">
                        <a class="brand-mark" href="?page=public" data-route="/public" aria-label="QR Code Generator home">
                            <span class="brand-icon"><img class="brand-logo" src="assets/favicon.svg" alt="" width="40" height="40"></span>
                            <span class="brand-copy">
                                <strong>QR Code Generator</strong>
                                <span>Local, print-ready codes</span>
                            </span>
                        </a>

                        <nav class="topbar-links" aria-label="Website navigation">
                            <a href="#features">Features</a>
                            <a href="#types">QR types</a>
                            <a href="?page=pricing" data-route="/pricing">Pricing</a>
                            <a href="?page=compare" data-route="/compare">Compare</a>
                        </nav>

                        <div class="topbar-actions">
                            <button class="theme-switch" id="themeToggle" type="button" aria-label="Toggle theme">
                                <i class="bi bi-moon-stars-fill theme-switch-icon" aria-hidden="true"></i>
                                <span class="theme-switch-label">Dark</span>
                            </button>
                            <a class="btn btn-primary" href="?page=home" data-route="/home">
                                <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
                                <span>Open app</span>
                            </a>
                        </div>
                    </div>
                </header>

                <main>
                    <section class="site-hero">
                        <div class="public-shell hero-shell">
                            <div class="hero-copy">
                                <p class="section-kicker">Professional QR code generator</p>
                                <h1>Create polished QR codes without handing over your data.</h1>
                                <p class="site-lead">Build QR codes for websites, WiFi, contact cards, events, locations, and social profiles. Everything runs in your browser, with clean PNG and SVG exports ready for screen, print, and client work.</p>

                                <div class="hero-actions">
                                    <a class="btn btn-primary" href="?page=home" data-route="/home">
                                        <i class="bi bi-qr-code" aria-hidden="true"></i>
                                        <span>Start generating</span>
                                    </a>
                                    <a class="btn btn-secondary" href="?page=url" data-route="/url">
                                        <i class="bi bi-link-45deg" aria-hidden="true"></i>
                                        <span>Create URL code</span>
                                    </a>
                                </div>

                                <dl class="trust-strip" aria-label="Product highlights">
                                    <div>
                                        <dt>12</dt>
                                        <dd>QR types</dd>
                                    </div>
                                    <div>
                                        <dt>8K</dt>
                                        <dd>Max PNG export</dd>
                                    </div>
                                    <div>
                                        <dt>0</dt>
                                        <dd>Signup steps</dd>
                                    </div>
                                </dl>
                            </div>

                            <div class="hero-product" aria-label="QR Code Generator preview">
                                <div class="product-window">
                                    <div class="window-bar">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <iframe class="product-iframe" src="${iframeSrc}" title="QR Code Generator home preview" loading="eager" sandbox="allow-scripts allow-same-origin" data-preview-zoom="0.74" aria-hidden="true" tabindex="-1"></iframe>
                                    <div class="product-overlay" aria-hidden="true"></div>
                                </div>

                                <aside class="live-qr-panel">
                                    <div class="live-qr-copy">
                                        <span>Live QR preview</span>
                                        <strong>Scan the product site</strong>
                                    </div>
                                    <a class="preview-qr-link" href="${this.heroQrUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open qrcode.apps.shaunroselt.com">
                                        <div class="preview-grid preview-grid-live" id="publicHeroQr"></div>
                                    </a>
                                </aside>
                            </div>
                        </div>
                    </section>

                    <section class="proof-band" aria-label="Common use cases">
                        <div class="public-shell proof-grid">
                            <article>
                                <i class="bi bi-printer" aria-hidden="true"></i>
                                <strong>Print-ready output</strong>
                                <span>Flyers, labels, posters, menus, packaging, and signage.</span>
                            </article>
                            <article>
                                <i class="bi bi-person-lines-fill" aria-hidden="true"></i>
                                <strong>Business-ready sharing</strong>
                                <span>vCards, phone numbers, email, WhatsApp, profiles, and events.</span>
                            </article>
                            <article>
                                <i class="bi bi-shield-check" aria-hidden="true"></i>
                                <strong>Private by default</strong>
                                <span>Payloads stay local while you create, style, and export.</span>
                            </article>
                        </div>
                    </section>

                    <section class="site-section" id="features">
                        <div class="public-shell split-section">
                            <div class="section-heading">
                                <p class="section-kicker">Built for real output</p>
                                <h2>A focused QR design tool for everyday production.</h2>
                                <p>Fast form entry, live previews, high-resolution downloads, and sensible defaults keep the workflow focused from first draft to finished asset.</p>
                            </div>

                            <div class="feature-list">
                                <article>
                                    <span class="feature-icon"><i class="bi bi-lightning-charge" aria-hidden="true"></i></span>
                                    <div>
                                        <h3>Instant preview</h3>
                                        <p>Update the payload and see the QR code respond immediately before exporting.</p>
                                    </div>
                                </article>
                                <article>
                                    <span class="feature-icon"><i class="bi bi-filetype-svg" aria-hidden="true"></i></span>
                                    <div>
                                        <h3>PNG and SVG export</h3>
                                        <p>Use raster downloads for quick sharing or SVG files when you need sharp print artwork.</p>
                                    </div>
                                </article>
                                <article>
                                    <span class="feature-icon"><i class="bi bi-palette" aria-hidden="true"></i></span>
                                    <div>
                                        <h3>Brand-friendly styling</h3>
                                        <p>Adjust colors, logos, and frames while keeping the QR code readable and polished.</p>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section class="editor-showcase">
                        <div class="public-shell showcase-shell">
                            <div class="showcase-image product-window" aria-label="URL QR code editor preview">
                                <div class="window-bar">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <iframe class="product-iframe" src="${editorIframeSrc}" title="QR Code Generator URL editor preview" loading="lazy" sandbox="allow-scripts allow-same-origin" data-preview-zoom="0.68" aria-hidden="true" tabindex="-1"></iframe>
                                <div class="product-overlay" aria-hidden="true"></div>
                            </div>
                            <div class="showcase-copy">
                                <p class="section-kicker">From URL to download</p>
                                <h2>Open the app, choose a type, export the file.</h2>
                                <p>The interface is made for the decisions that matter: what the QR code contains, how it should look, and which file format you need.</p>
                                <ul class="check-list">
                                    <li><i class="bi bi-check2" aria-hidden="true"></i><span>Common QR payloads are separated into clear tools.</span></li>
                                    <li><i class="bi bi-check2" aria-hidden="true"></i><span>Large exports work for posters, signs, and print layouts.</span></li>
                                    <li><i class="bi bi-check2" aria-hidden="true"></i><span>No account gate blocks basic generation or download.</span></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section class="site-section" id="types">
                        <div class="public-shell">
                            <div class="section-heading compact-heading">
                                <p class="section-kicker">QR code types</p>
                                <h2>Pick the format that matches the job.</h2>
                                <p>Jump straight into the generator you need.</p>
                            </div>

                            <div class="qr-type-grid">
                                ${this.renderQrTypeLinks()}
                            </div>
                        </div>
                    </section>

                    <section class="site-section workflow-band">
                        <div class="public-shell workflow-grid">
                            <article>
                                <span>01</span>
                                <h3>Choose a tool</h3>
                                <p>Start with URL, WiFi, vCard, event, social, and more.</p>
                            </article>
                            <article>
                                <span>02</span>
                                <h3>Review the preview</h3>
                                <p>Check the live QR code and adjust styling before download.</p>
                            </article>
                            <article>
                                <span>03</span>
                                <h3>Export for use</h3>
                                <p>Download a PNG or SVG and place it wherever people scan.</p>
                            </article>
                        </div>
                    </section>

                    <section class="final-cta">
                        <div class="public-shell final-shell">
                            <div>
                                <p class="section-kicker">Ready when you are</p>
                                <h2>Create your next QR code now.</h2>
                                <p>Use the full generator in your browser and export a clean asset when it is ready.</p>
                            </div>
                            <div class="closing-actions">
                                <a class="btn btn-primary" href="?page=home" data-route="/home">
                                    <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
                                    <span>Open app</span>
                                </a>
                                <!-- vCard CTA removed per design request -->
                            </div>
                        </div>
                    </section>
                </main>

                <footer class="marketing-footer">
                    <div class="public-shell footer-shell">
                        <p>QR Code Generator is a client-side web app for high-resolution QR code creation.</p>
                        <div class="footer-links">
                            <a href="?page=pricing" data-route="/pricing">Pricing</a>
                            <a href="?page=compare" data-route="/compare">Compare</a>
                            <a href="?page=release-notes" data-route="/release-notes">Release notes</a>
                            <a href="https://github.com/ShaunRoselt/QR-Code-Generator">GitHub</a>
                        </div>
                    </div>
                </footer>
            </div>
        `;
    },

    init() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle?.querySelector('.theme-switch-icon');
        const themeLabel = themeToggle?.querySelector('.theme-switch-label');
        const heroQrContainer = document.getElementById('publicHeroQr');

        if (heroQrContainer && typeof QRCode === 'function') {
            heroQrContainer.innerHTML = '';
            new QRCode(heroQrContainer, {
                text: this.heroQrUrl,
                width: 220,
                height: 220,
                colorDark: '#111111',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        }

        const syncThemeToggle = () => {
            const theme = themeManager.getTheme();
            const resolvedTheme = themeManager.getResolvedTheme();
            const isDark = resolvedTheme === 'dark';

            if (themeIcon) {
                themeIcon.className = isDark
                    ? 'bi bi-moon-stars-fill theme-switch-icon'
                    : 'bi bi-sun-fill theme-switch-icon';
            }

            if (themeLabel) {
                if (theme === 'system') {
                    themeLabel.textContent = I18n.translate('System ({mode})', {
                        mode: I18n.translateString(isDark ? 'Dark' : 'Light')
                    });
                } else {
                    themeLabel.textContent = I18n.translateString(isDark ? 'Dark' : 'Light');
                }
            }

            if (themeToggle) {
                themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
            }
        };

        syncThemeToggle();
        document.addEventListener('app:theme-changed', syncThemeToggle);

        themeToggle?.addEventListener('click', () => {
            themeManager.toggleTheme();
        });

        // Keep the embedded preview in sync when the public page theme changes.
        const updateIframeTheme = (resolvedTheme) => {
            document.querySelectorAll('.product-iframe').forEach(iframe => {
                try {
                    const url = new URL(iframe.getAttribute('src'), window.location.href);
                    const themeToSet = resolvedTheme
                        || ((typeof themeManager !== 'undefined' && typeof themeManager.getResolvedTheme === 'function')
                            ? themeManager.getResolvedTheme()
                            : (document.documentElement.getAttribute('data-theme') || 'dark'));
                    url.searchParams.set('theme', themeToSet);
                    // replace src only if different to avoid unnecessary reloads
                    if (iframe.getAttribute('src') !== url.toString()) {
                        iframe.setAttribute('src', url.toString());
                    }
                } catch (e) {
                    const src = iframe.getAttribute('src') || 'index.html?page=home';
                    const base = src.split('?')[0];
                    const page = iframe.getAttribute('src')?.includes('page=url') ? 'url' : 'home';
                    iframe.setAttribute('src', `${base}?page=${page}&theme=${encodeURIComponent(resolvedTheme || (typeof themeManager !== 'undefined' ? themeManager.getResolvedTheme() : 'dark'))}`);
                }
            });
        };

        const applyPreviewZoom = (iframe) => {
            const previewZoom = Number.parseFloat(iframe?.dataset.previewZoom || '1');
            if (!iframe || !Number.isFinite(previewZoom) || previewZoom === 1) {
                return;
            }

            try {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
                if (!iframeDocument?.documentElement || !iframeDocument.body) {
                    return;
                }

                iframeDocument.documentElement.style.zoom = String(previewZoom);
                iframeDocument.documentElement.style.transformOrigin = 'top left';
                iframeDocument.body.style.minWidth = `${Math.round(100 / previewZoom)}%`;
                iframeDocument.body.style.minHeight = `${Math.round(100 / previewZoom)}%`;
            } catch (error) {
                // The preview is same-origin in normal use. If a browser blocks access, keep the iframe unscaled.
            }
        };

        document.addEventListener('app:theme-changed', (ev) => {
            const resolved = ev?.detail?.resolvedTheme || (typeof themeManager !== 'undefined' ? themeManager.getResolvedTheme() : null);
            updateIframeTheme(resolved);
        });

        document.querySelectorAll('.product-iframe').forEach(iframe => {
            iframe.addEventListener('load', () => applyPreviewZoom(iframe));
        });
        // Ensure initial sync in case theme changed after render.
        updateIframeTheme();
        document.querySelectorAll('.product-iframe').forEach(applyPreviewZoom);

        document.querySelectorAll('.public-page [data-route]').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                router.navigate(link.getAttribute('data-route'));
            });
        });
    }
};
