const PublicPage = {
    heroQrUrl: 'https://qrcode.shaunroselt.com',
    meta: {
        title: 'QR Code Generator | The Best Free QR Code Generator',
        description: 'The best free QR Code Generator for creating high-resolution QR codes in your browser. Generate QR codes for websites, WiFi, contact cards, events, social links, and more.',
        keywords: 'free QR code generator, QR code creator, QR code maker, browser QR code generator, WiFi QR code, vCard QR code',
        ogTitle: 'QR Code Generator | The Best Free QR Code Generator',
        ogDescription: 'Create high-resolution QR codes in your browser with no signup, no backend, and no tracking.',
        ogUrl: 'https://qrcode.shaunroselt.com/index.html?page=public',
        twitterTitle: 'QR Code Generator | The Best Free QR Code Generator',
        twitterDescription: 'Create QR codes for websites, WiFi, events, contact cards, and more. Free to use in your browser.'
    },

    render() {
        return `
            <div class="public-page">
                <div class="public-shell">
                    <header class="marketing-topbar">
                        <a class="brand-mark" href="?page=public" data-route="/public" aria-label="QR Code Generator home">
                            <span class="brand-icon"><i class="bi bi-qr-code-scan"></i></span>
                            <span class="brand-copy">
                                <strong>QR Code Generator</strong>
                                <span>Free browser-based QR creation</span>
                            </span>
                        </a>

                        <div class="topbar-actions">
                            <button class="theme-switch" id="themeToggle" type="button" aria-label="Toggle theme">
                                <i class="bi bi-moon-stars-fill theme-switch-icon" aria-hidden="true"></i>
                                <span class="theme-switch-label">Dark</span>
                            </button>
                            <a class="btn btn-secondary" href="?page=home" data-route="/home">Open app</a>
                        </div>
                    </header>

                    <main>
                        <section class="hero-section">
                            <div class="hero-copy">
                                <p class="eyebrow">Best free QR Code Generator</p>
                                <h1>Create polished QR codes in seconds, right in your browser.</h1>
                                <p class="hero-text">Generate high-resolution QR codes for websites, WiFi, contact cards, events, social profiles, and more. No backend. No tracking. No waiting around for uploads.</p>

                                <div class="hero-actions">
                                    <a class="btn btn-primary" href="?page=home" data-route="/home">Use it free now</a>
                                    <a class="btn btn-secondary" href="?page=url" data-route="/url">Create a website QR code</a>
                                </div>

                                <ul class="hero-points" aria-label="Product highlights">
                                    <li><i class="bi bi-check2-circle"></i>12 QR code types</li>
                                    <li><i class="bi bi-check2-circle"></i>PNG and SVG export</li>
                                    <li><i class="bi bi-check2-circle"></i>Up to 8K output</li>
                                    <li><i class="bi bi-check2-circle"></i>Dark and light themes</li>
                                </ul>
                            </div>

                            <div class="hero-visual" aria-hidden="true">
                                <div class="preview-card preview-card-primary">
                                    <div class="preview-header">
                                        <span class="preview-pill">Live preview</span>
                                        <span class="preview-meta">Free today</span>
                                    </div>
                                    <div class="preview-qr">
                                        <a class="preview-qr-link" href="${this.heroQrUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open qrcode.shaunroselt.com">
                                            <div class="preview-grid preview-grid-live" id="publicHeroQr"></div>
                                        </a>
                                        <div class="preview-frame">Scan me</div>
                                    </div>
                                    <div class="preview-footer">
                                        <div>
                                            <strong>Designed for real use</strong>
                                            <span>Business cards, posters, packaging, tables, flyers</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="preview-card preview-card-floating">
                                    <div class="mini-stat">
                                        <strong>Private by design</strong>
                                        <span>Everything happens locally in your browser.</span>
                                    </div>
                                    <div class="mini-stat">
                                        <strong>Ready for export</strong>
                                        <span>Download PNG or SVG at 1080p, 1440p, 4K, or 8K.</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="metrics-section" aria-label="Key product metrics">
                            <article class="metric-card">
                                <strong>12</strong>
                                <span>Supported QR code types</span>
                            </article>
                            <article class="metric-card">
                                <strong>8K</strong>
                                <span>Maximum export resolution</span>
                            </article>
                            <article class="metric-card">
                                <strong>2</strong>
                                <span>Download formats: PNG and SVG</span>
                            </article>
                            <article class="metric-card">
                                <strong>0</strong>
                                <span>Servers, tracking scripts, or sign-up walls</span>
                            </article>
                        </section>

                        <section class="section-block">
                            <div class="section-heading">
                                <p class="eyebrow">Why people use it</p>
                                <h2>Built for fast creation, clean exports, and zero friction.</h2>
                                <p>Whether you need a single QR code for a flyer or a polished export for client work, the app stays quick and focused.</p>
                            </div>

                            <div class="feature-grid">
                                <article class="feature-card">
                                    <i class="bi bi-lightning-charge"></i>
                                    <h3>Create instantly</h3>
                                    <p>Update content and see the result in real time while you refine the payload and presentation.</p>
                                </article>
                                <article class="feature-card">
                                    <i class="bi bi-badge-hd"></i>
                                    <h3>Export for production</h3>
                                    <p>Download crisp PNG or SVG files at sizes ranging from 1080p to 8K for screen or print use.</p>
                                </article>
                                <article class="feature-card">
                                    <i class="bi bi-shield-lock"></i>
                                    <h3>Keep data local</h3>
                                    <p>QR payloads are generated client-side in the browser, with no remote processing required.</p>
                                </article>
                            </div>
                        </section>

                        <section class="section-block section-contrast">
                            <div class="section-heading">
                                <p class="eyebrow">Supported use cases</p>
                                <h2>One app for the QR codes people actually need.</h2>
                                <p>Open the generator and switch between common formats without jumping between tools.</p>
                            </div>

                            <div class="type-grid">
                                <a class="type-chip" href="?page=url" data-route="/url"><i class="bi bi-link-45deg"></i><span>URL / Website</span></a>
                                <a class="type-chip" href="?page=text" data-route="/text"><i class="bi bi-fonts"></i><span>Plain Text</span></a>
                                <a class="type-chip" href="?page=email" data-route="/email"><i class="bi bi-envelope"></i><span>Email</span></a>
                                <a class="type-chip" href="?page=phone" data-route="/phone"><i class="bi bi-telephone"></i><span>Phone</span></a>
                                <a class="type-chip" href="?page=sms" data-route="/sms"><i class="bi bi-chat-dots"></i><span>SMS</span></a>
                                <a class="type-chip" href="?page=whatsapp" data-route="/whatsapp"><i class="bi bi-whatsapp"></i><span>WhatsApp</span></a>
                                <a class="type-chip" href="?page=wifi" data-route="/wifi"><i class="bi bi-wifi"></i><span>WiFi</span></a>
                                <a class="type-chip" href="?page=location" data-route="/location"><i class="bi bi-geo-alt"></i><span>Location</span></a>
                                <a class="type-chip" href="?page=event" data-route="/event"><i class="bi bi-calendar-event"></i><span>Calendar Event</span></a>
                                <a class="type-chip" href="?page=appstore" data-route="/appstore"><i class="bi bi-shop"></i><span>App Store</span></a>
                                <a class="type-chip" href="?page=social" data-route="/social"><i class="bi bi-share"></i><span>Social Media</span></a>
                                <a class="type-chip" href="?page=vcard" data-route="/vcard"><i class="bi bi-person-vcard"></i><span>vCard</span></a>
                            </div>
                        </section>

                        <section class="section-block workflow-section">
                            <div class="section-heading">
                                <p class="eyebrow">How it works</p>
                                <h2>Open, generate, export.</h2>
                                <p>The workflow stays simple so you can go from idea to downloadable QR code without setup overhead.</p>
                            </div>

                            <div class="workflow-grid">
                                <article class="workflow-step">
                                    <span>01</span>
                                    <h3>Choose a QR code type</h3>
                                    <p>Pick the format that matches your use case, from websites and WiFi to vCards and event invites.</p>
                                </article>
                                <article class="workflow-step">
                                    <span>02</span>
                                    <h3>Fill in the details</h3>
                                    <p>Enter your content and see the QR code update immediately while you review the result.</p>
                                </article>
                                <article class="workflow-step">
                                    <span>03</span>
                                    <h3>Export at the size you need</h3>
                                    <p>Download a PNG or SVG in resolutions that work for mobile, desktop, print, and signage.</p>
                                </article>
                            </div>
                        </section>

                        <section class="section-block faq-section">
                            <div class="section-heading">
                                <p class="eyebrow">Trust and clarity</p>
                                <h2>Simple answers to the things people usually want to know.</h2>
                            </div>

                            <div class="faq-grid">
                                <article class="faq-card">
                                    <h3>Is it really free?</h3>
                                    <p>Yes. Right now the app is free to use, and this page reflects the current product offering.</p>
                                </article>
                                <article class="faq-card">
                                    <h3>Does it upload my data?</h3>
                                    <p>No. QR code generation happens locally in the browser, so payload data is not sent to a backend.</p>
                                </article>
                                <article class="faq-card">
                                    <h3>What can I create?</h3>
                                    <p>Website links, text, email, phone, SMS, WhatsApp, WiFi, location, event, app store, social media, and vCard QR codes.</p>
                                </article>
                                <article class="faq-card">
                                    <h3>Can I use it for print?</h3>
                                    <p>Yes. Export options include PNG and SVG, with sizes available up to 8K for higher-resolution output.</p>
                                </article>
                            </div>
                        </section>

                        <section class="closing-cta">
                            <div>
                                <p class="eyebrow">Start now</p>
                                <h2>Open the app and generate your first QR code for free.</h2>
                                <p>Use the full generator in your browser and export the result when you are ready.</p>
                            </div>
                            <div class="closing-actions">
                                <a class="btn btn-primary" href="?page=home" data-route="/home">Use it free now</a>
                                <a class="btn btn-secondary" href="?page=vcard" data-route="/vcard">Try a vCard QR code</a>
                            </div>
                        </section>
                    </main>

                    <footer class="marketing-footer">
                        <p>QR Code Generator is a client-side web app for high-resolution QR code creation.</p>
                        <div class="footer-links">
                            <a href="?page=home" data-route="/home">Open app</a>
                            <a href="?page=release-notes" data-route="/release-notes">Release notes</a>
                            <a href="https://github.com/ShaunRoselt/QR-Code-Generator">GitHub</a>
                        </div>
                        <p class="footer-meta">Free to use today. Built for fast, local, browser-based QR generation.</p>
                    </footer>
                </div>
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
                width: 260,
                height: 260,
                colorDark: '#111111',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        }

        const syncThemeToggle = () => {
            const theme = themeManager.getTheme();
            const isDark = theme === 'dark';

            if (themeIcon) {
                themeIcon.className = isDark
                    ? 'bi bi-moon-stars-fill theme-switch-icon'
                    : 'bi bi-sun-fill theme-switch-icon';
            }

            if (themeLabel) {
                themeLabel.textContent = isDark ? 'Dark' : 'Light';
            }

            if (themeToggle) {
                themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
            }
        };

        syncThemeToggle();

        themeToggle?.addEventListener('click', () => {
            themeManager.toggleTheme();
            syncThemeToggle();
        });

        document.querySelectorAll('.public-page [data-route]').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                router.navigate(link.getAttribute('data-route'));
            });
        });
    }
};