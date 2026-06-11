"use strict";

const PricingPage = {
    meta: {
        title: 'QR Code Generator Pricing | Free App and Team Planning',
        description: 'Start with the free browser QR Code Generator, then compare the managed QR features teams typically need as campaigns grow.',
        keywords: 'QR code generator pricing, QR plans, dynamic QR pricing, enterprise QR pricing',
        ogTitle: 'QR Code Generator Pricing | Free App and Team Planning',
        ogDescription: 'Start free in the browser, then compare managed QR campaign capacity when your team needs dynamic codes, API access, or rollout support.',
        ogUrl: 'https://qrcode.apps.shaunroselt.com/index.html?page=pricing',
        twitterTitle: 'QR Code Generator Pricing | Free App and Team Planning',
        twitterDescription: 'Compare QR Code Generator usage paths, from the free browser app to managed QR campaign features.'
    },

    plans: [
        {
            key: 'starter',
            name: 'Starter',
            tagline: 'For solo work and light campaigns',
            monthlyPrice: '$9.99',
            annualEquivalentPrice: '$9.99',
            annualCharge: '$119.88',
            monthlyAvailable: true,
            savingsNote: 'A useful benchmark for individuals who are moving from one-off exports into a small managed QR workflow.',
            limits: ['2 dynamic QR codes', '10,000 scans', '2 users', 'Entry-level collaboration']
        },
        {
            key: 'advanced',
            name: 'Advanced',
            tagline: 'For growing teams and repeat publishing',
            annualEquivalentPrice: '$15.99',
            annualCharge: '$191.88',
            badge: 'Most popular',
            featured: true,
            savingsNote: 'A benchmark tier for teams that need repeat publishing, larger batches, and enough automation to support regular campaigns.',
            limits: ['50 dynamic QR codes', 'Unlimited scans', '100 bulk creations', '3,000 API requests', '2 users']
        },
        {
            key: 'professional',
            name: 'Professional',
            tagline: 'For multi-channel campaigns and heavier ops',
            annualEquivalentPrice: '$46.99',
            annualCharge: '$563.88',
            savingsNote: 'A benchmark tier for teams running more channels, more assets, and heavier operational support needs.',
            limits: ['250 dynamic QR codes', 'Unlimited scans', '500 bulk creations', '10,000 API requests', '5 users', 'Premium support']
        },
        {
            key: 'enterprise',
            name: 'Enterprise',
            tagline: 'For custom rollout, branding, and scale',
            contactOnly: true,
            savingsNote: 'Custom planning for organizations that need more QR codes, white-labeling, API add-ons, and tailored support.',
            limits: ['Custom QR code volume', 'Custom user allocation', 'White-label options', 'Expanded API access', 'Dedicated commercial support']
        }
    ],

    comparisonRows: [
        { label: 'Dynamic QR codes', starter: '2', advanced: '50', professional: '250', enterprise: 'Custom' },
        { label: 'Scans', starter: '10,000', advanced: 'Unlimited', professional: 'Unlimited', enterprise: 'Custom' },
        { label: 'Bulk creation', starter: 'Not listed', advanced: '100', professional: '500', enterprise: 'Custom' },
        { label: 'API requests', starter: 'Not listed', advanced: '3,000', professional: '10,000', enterprise: 'Custom' },
        { label: 'Users', starter: '2', advanced: '2', professional: '5', enterprise: 'Custom' }
    ],

    renderPlanCard(plan) {
        const priceMarkup = plan.contactOnly
            ? `
                <div class="pricing-price-stack">
                    <div class="pricing-price"><strong>Contact us</strong></div>
                    <span class="pricing-badge-note">Custom rollout design, commercial terms, and support planning.</span>
                </div>
            `
            : `
                <div class="pricing-price-stack">
                    <div class="pricing-price"><strong>${plan.annualEquivalentPrice}</strong><span>/ month</span></div>
                    <span>Reference annual total: ${plan.annualCharge}</span>
                    ${plan.monthlyAvailable ? `<span>Monthly reference: ${plan.monthlyPrice} / month.</span>` : ''}
                </div>
            `;

        return `
            <article class="pricing-card ${plan.featured ? 'featured' : ''} ${plan.contactOnly ? 'enterprise' : ''}">
                <div class="pricing-card-header">
                    <div class="pricing-card-copy">
                        <h3>${plan.name}</h3>
                        <p>${plan.tagline}</p>
                    </div>
                    ${plan.badge ? `<span class="pricing-pill">${plan.badge}</span>` : '<span class="pricing-subpill">Plan</span>'}
                </div>

                ${priceMarkup}

                <div class="pricing-badge-note">${plan.savingsNote}</div>

                <ul>
                    ${plan.limits.map(item => `<li><i class="bi bi-check2-circle"></i><span>${item}</span></li>`).join('')}
                </ul>

                <div class="pricing-card-actions">
                    <a class="btn btn-primary" href="?page=home" data-route="/home">Open app</a>
                    ${plan.contactOnly
                        ? '<a class="btn btn-secondary" href="mailto:hello@qrcode.apps.shaunroselt.com">Contact sales</a>'
                        : '<a class="btn btn-secondary" href="?page=url" data-route="/url">Try a QR flow</a>'}
                </div>
            </article>
        `;
    },

    renderComparisonTable() {
        return `
            <div class="pricing-comparison">
                <table class="pricing-comparison-table">
                    <thead>
                        <tr>
                            <th>Included</th>
                            <th>Starter</th>
                            <th>Advanced</th>
                            <th>Professional</th>
                            <th>Enterprise</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.comparisonRows.map(row => `
                            <tr>
                                <td>${row.label}</td>
                                <td>${row.starter}</td>
                                <td>${row.advanced}</td>
                                <td>${row.professional}</td>
                                <td>${row.enterprise}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    render() {
        return `
            <div class="public-page public-website pricing-page">
                    <header class="marketing-topbar">
                        <div class="public-shell nav-shell">
                            <a class="brand-mark" href="?page=public" data-route="/public" aria-label="QR Code Generator home">
                                <span class="brand-icon"><img class="brand-logo" src="assets/favicon.svg" alt="" width="40" height="40"></span>
                                <span class="brand-copy">
                                    <strong>QR Code Generator</strong>
                                    <span>Free app and growth paths</span>
                                </span>
                            </a>

                            <nav class="topbar-links" aria-label="Website navigation">
                                <a href="?page=public" data-route="/public">Overview</a>
                                <a href="?page=release-notes" data-route="/release-notes">Release notes</a>
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
                        <section class="pricing-hero">
                            <div class="public-shell pricing-hero-shell">
                                <div class="pricing-hero-copy">
                                <p class="eyebrow">Pricing</p>
                                <h1>Start free. Add managed QR infrastructure only when you need it.</h1>
                                <p class="pricing-intro">QR Code Generator is free to use in the browser for local creation and export. The tiers below are planning benchmarks for teams comparing dynamic QR capacity, scans, bulk creation, API access, and commercial support.</p>

                                <div class="pricing-actions">
                                    <a class="btn btn-primary" href="?page=home" data-route="/home">Use the free app</a>
                                    <a class="btn btn-secondary" href="#planGrid">Compare plans</a>
                                </div>

                                <ul class="pricing-hero-points" aria-label="Pricing summary highlights">
                                    <li><i class="bi bi-check2-circle"></i><span>Use the browser app with no signup for static QR creation.</span></li>
                                    <li><i class="bi bi-check2-circle"></i><span>Move up only when dynamic campaign management matters.</span></li>
                                    <li><i class="bi bi-check2-circle"></i><span>Compare plans by QR volume, scans, users, API, and support.</span></li>
                                    <li><i class="bi bi-check2-circle"></i><span>Enterprise rollout stays custom-scoped for real operational needs.</span></li>
                                </ul>
                            </div>

                                <aside class="pricing-highlight-card">
                                <div>
                                    <p class="eyebrow">Best starting point</p>
                                    <h2>Most QR jobs should begin in the free generator.</h2>
                                    <p>Create the code locally, export a clean file, and only consider paid managed infrastructure when you need editable destinations, analytics, API automation, or team controls.</p>
                                </div>

                                <div class="pricing-highlight-grid">
                                    <div class="pricing-highlight-stat">
                                        <strong>Free</strong>
                                        <span>Browser app for static QR creation</span>
                                    </div>
                                    <div class="pricing-highlight-stat">
                                        <strong>$15.99</strong>
                                        <span>Advanced benchmark for managed teams</span>
                                    </div>
                                    <div class="pricing-highlight-stat">
                                        <strong>$46.99</strong>
                                        <span>Professional benchmark for heavier ops</span>
                                    </div>
                                    <div class="pricing-highlight-stat">
                                        <strong>Custom</strong>
                                        <span>Custom commercial rollout planning</span>
                                    </div>
                                </div>
                            </aside>
                            </div>
                        </section>

                        <section class="pricing-section">
                            <div class="public-shell">
                                <div class="pricing-section-heading">
                                    <div>
                                        <p class="eyebrow">Plans</p>
                                        <h2>Managed QR benchmarks at a glance.</h2>
                                        <p>Use this grid to decide whether your project still belongs in the free generator or needs hosted campaign features.</p>
                                    </div>
                                </div>

                                <div class="pricing-plan-grid" id="planGrid">
                                    ${this.plans.map(plan => this.renderPlanCard(plan)).join('')}
                                </div>
                            </div>
                        </section>

                        <section class="pricing-section">
                            <div class="public-shell">
                                <div class="pricing-section-heading">
                                    <div>
                                        <p class="eyebrow">Feature comparison</p>
                                        <h2>Capacity increases around dynamic QR volume, scans, and automation.</h2>
                                        <p>The free app is ideal for immediate static exports. Managed tiers become relevant when scan tracking, editable destinations, APIs, or team administration drive the project.</p>
                                    </div>
                                </div>

                                ${this.renderComparisonTable()}
                            </div>
                        </section>

                        <section class="pricing-section">
                            <div class="public-shell">
                                <div class="pricing-section-heading">
                                    <div>
                                        <p class="eyebrow">Common questions</p>
                                        <h2>How to think about free generation versus managed QR tools.</h2>
                                    </div>
                                </div>

                                <div class="pricing-faq-grid">
                                    <article class="pricing-faq-card">
                                        <h3>Can I generate a code without paying?</h3>
                                        <p>Yes. The browser app is built for immediate static QR creation and export without a signup step.</p>
                                    </article>
                                    <article class="pricing-faq-card">
                                        <h3>When should I consider a managed plan?</h3>
                                        <p>Consider hosted QR infrastructure when you need editable destinations, scan analytics, larger batches, API access, or team permissions.</p>
                                    </article>
                                    <article class="pricing-faq-card">
                                        <h3>Are static QR codes enough?</h3>
                                        <p>For posters, menus, labels, contact cards, and many one-off campaigns, a static exported PNG or SVG is usually the simplest path.</p>
                                    </article>
                                    <article class="pricing-faq-card">
                                        <h3>What should teams compare?</h3>
                                        <p>Look at QR code volume, scan allowances, user seats, batch creation, API limits, export quality, and support expectations.</p>
                                    </article>
                                </div>
                            </div>
                        </section>

                        <section class="pricing-section">
                            <div class="public-shell">
                                <div class="pricing-closing">
                                    <div>
                                        <p class="eyebrow">Build first</p>
                                        <h2>Need a QR code right now?</h2>
                                        <p>This app is already usable in-browser. If you need a clean QR asset, open the tool and start there.</p>
                                    </div>
                                    <div class="pricing-closing-actions">
                                        <a class="btn btn-primary" href="?page=home" data-route="/home">Open the generator</a>
                                        <a class="btn btn-secondary" href="?page=compare" data-route="/compare">Compare tools</a>
                                        <a class="btn btn-secondary" href="?page=public" data-route="/public">Back to overview</a>
                                    </div>
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

        document.querySelectorAll('.pricing-page [data-route]').forEach(link => {
            link.addEventListener('click', event => {
                const route = link.getAttribute('data-route');
                if (!route) {
                    return;
                }

                event.preventDefault();
                router.navigate(route);
            });
        });
    }
};
