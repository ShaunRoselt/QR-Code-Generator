"use strict";

const PricingPage = {
    meta: {
        title: 'QR Code Generator Pricing | Plans and Feature Comparison',
        description: 'Compare Starter, Advanced, Professional, and Enterprise pricing for QR Code Generator, with a clean breakdown of scans, users, bulk creation, and API access.',
        keywords: 'QR code generator pricing, QR plans, dynamic QR pricing, enterprise QR pricing',
        ogTitle: 'QR Code Generator Pricing | Plans and Feature Comparison',
        ogDescription: 'Review plan pricing and included capacity for QR Code Generator, from starter use to enterprise rollout.',
        ogUrl: 'https://qrcode.apps.shaunroselt.com/index.html?page=pricing',
        twitterTitle: 'QR Code Generator Pricing | Plans and Feature Comparison',
        twitterDescription: 'Compare QR Code Generator pricing plans, usage limits, and included features.'
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
            savingsNote: 'Monthly or annual billing available. Annual pricing reflects the reference annual total.',
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
            savingsNote: 'Annual billing in the reference pricing. Built for teams that need unlimited scan capacity.',
            limits: ['50 dynamic QR codes', 'Unlimited scans', '100 bulk creations', '3,000 API requests', '2 users']
        },
        {
            key: 'professional',
            name: 'Professional',
            tagline: 'For multi-channel campaigns and heavier ops',
            annualEquivalentPrice: '$46.99',
            annualCharge: '$563.88',
            savingsNote: 'Annual billing in the reference pricing, with more headroom for operations and support.',
            limits: ['250 dynamic QR codes', 'Unlimited scans', '500 bulk creations', '10,000 API requests', '5 users', 'Premium support']
        },
        {
            key: 'enterprise',
            name: 'Enterprise',
            tagline: 'For custom rollout, branding, and scale',
            contactOnly: true,
            savingsNote: 'Custom pricing for organizations that need more QR codes, white-labeling, API add-ons, and tailored support.',
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
                    <span class="pricing-badge-note">Custom plan design, commercial terms, and rollout support.</span>
                </div>
            `
            : `
                <div class="pricing-price-stack">
                    <div class="pricing-price"><strong>${plan.annualEquivalentPrice}</strong><span>/ month</span></div>
                    <span>Billed annually at ${plan.annualCharge}</span>
                    ${plan.monthlyAvailable ? `<span>Standalone monthly billing also listed at ${plan.monthlyPrice} / month.</span>` : ''}
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
            <div class="public-page pricing-page">
                <div class="public-shell">
                    <header class="marketing-topbar">
                        <a class="brand-mark" href="?page=public" data-route="/public" aria-label="QR Code Generator home">
                            <span class="brand-icon"><img class="brand-logo" src="assets/favicon.svg" alt="" width="48" height="48"></span>
                            <span class="brand-copy">
                                <strong>QR Code Generator</strong>
                                <span>Plans and product fit</span>
                            </span>
                        </a>

                        <div class="topbar-actions">
                            <a class="btn btn-secondary" href="?page=public" data-route="/public">Overview</a>
                            <a class="btn btn-secondary" href="?page=compare" data-route="/compare">Compare</a>
                            <button class="theme-switch" id="pricingThemeToggle" type="button" aria-label="Toggle theme">
                                <i class="bi bi-moon-stars-fill theme-switch-icon" aria-hidden="true"></i>
                                <span class="theme-switch-label">Dark</span>
                            </button>
                            <a class="btn btn-primary" href="?page=home" data-route="/home">Open app</a>
                        </div>
                    </header>

                    <main>
                        <section class="pricing-hero">
                            <div class="pricing-hero-copy">
                                <p class="eyebrow">Pricing</p>
                                <h1>Choose the QR plan that matches your campaign volume.</h1>
                                <p class="pricing-intro">This page uses the reference pricing amounts from qr-code-generator.com as a planning benchmark. It focuses on the numbers: what each tier costs, how it bills, and what scale of QR operations it appears to support.</p>

                                <div class="pricing-actions">
                                    <a class="btn btn-primary" href="?page=home" data-route="/home">Use the free app</a>
                                    <a class="btn btn-secondary" href="#planGrid">Compare plans</a>
                                </div>

                                <ul class="pricing-hero-points" aria-label="Pricing summary highlights">
                                    <li><i class="bi bi-check2-circle"></i><span>Starter lists both monthly and annual billing.</span></li>
                                    <li><i class="bi bi-check2-circle"></i><span>Advanced and Professional are annual in the reference pricing.</span></li>
                                    <li><i class="bi bi-check2-circle"></i><span>Enterprise is contact-based and custom-scoped.</span></li>
                                    <li><i class="bi bi-check2-circle"></i><span>A 14-day free trial is highlighted on the reference page.</span></li>
                                </ul>
                            </div>

                            <aside class="pricing-highlight-card">
                                <div>
                                    <p class="eyebrow">Reference snapshot</p>
                                    <h2>14 days free, then tiered capacity.</h2>
                                    <p>The reference pricing page positions the product around dynamic QR capacity, scan allowances, team seats, bulk creation, and API request volume.</p>
                                </div>

                                <div class="pricing-highlight-grid">
                                    <div class="pricing-highlight-stat">
                                        <strong>$9.99</strong>
                                        <span>Starter monthly reference price</span>
                                    </div>
                                    <div class="pricing-highlight-stat">
                                        <strong>$15.99</strong>
                                        <span>Advanced annual-equivalent monthly price</span>
                                    </div>
                                    <div class="pricing-highlight-stat">
                                        <strong>$46.99</strong>
                                        <span>Professional annual-equivalent monthly price</span>
                                    </div>
                                    <div class="pricing-highlight-stat">
                                        <strong>Custom</strong>
                                        <span>Enterprise commercial package</span>
                                    </div>
                                </div>
                            </aside>
                        </section>

                        <section class="pricing-section">
                            <div class="pricing-section-heading">
                                <div>
                                    <p class="eyebrow">Plans</p>
                                    <h2>Reference pricing tiers at a glance.</h2>
                                    <p>Amounts and plan shapes are based on the referenced pricing page, presented here in the style of this app.</p>
                                </div>
                            </div>

                            <div class="pricing-plan-grid" id="planGrid">
                                ${this.plans.map(plan => this.renderPlanCard(plan)).join('')}
                            </div>
                        </section>

                        <section class="pricing-section">
                            <div class="pricing-section-heading">
                                <div>
                                    <p class="eyebrow">Feature comparison</p>
                                    <h2>Capacity increases around dynamic QR volume, scans, and automation.</h2>
                                    <p>If you are choosing between tiers, the clearest differences are usage ceilings and operational tools rather than visual customization.</p>
                                </div>
                            </div>

                            ${this.renderComparisonTable()}
                        </section>

                        <section class="pricing-section">
                            <div class="pricing-section-heading">
                                <div>
                                    <p class="eyebrow">Common questions</p>
                                    <h2>The main commercial details from the reference page.</h2>
                                </div>
                            </div>

                            <div class="pricing-faq-grid">
                                <article class="pricing-faq-card">
                                    <h3>Is there a free trial?</h3>
                                    <p>The reference page advertises a 14-day free trial before moving into a paid subscription flow.</p>
                                </article>
                                <article class="pricing-faq-card">
                                    <h3>When does access start?</h3>
                                    <p>Immediately after plan selection and payment completion, according to the referenced FAQ.</p>
                                </article>
                                <article class="pricing-faq-card">
                                    <h3>How long is the term?</h3>
                                    <p>Starter supports monthly or annual billing in the reference. Advanced and Professional are shown as annual plans.</p>
                                </article>
                                <article class="pricing-faq-card">
                                    <h3>Can plans change later?</h3>
                                    <p>The reference FAQ says upgrades are available any time, while downgrades are limited until after the first contract period.</p>
                                </article>
                            </div>
                        </section>

                        <section class="pricing-section">
                            <div class="pricing-closing">
                                <div>
                                    <p class="eyebrow">Build first</p>
                                    <h2>Need a QR code right now?</h2>
                                    <p>This app is already usable in-browser. If you just need to generate and export a QR code, open the tool and start there.</p>
                                </div>
                                <div class="pricing-closing-actions">
                                    <a class="btn btn-primary" href="?page=home" data-route="/home">Open the generator</a>
                                    <a class="btn btn-secondary" href="?page=compare" data-route="/compare">Compare tools</a>
                                    <a class="btn btn-secondary" href="?page=public" data-route="/public">Back to overview</a>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        `;
    },

    init() {
        const themeToggle = document.getElementById('pricingThemeToggle');
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