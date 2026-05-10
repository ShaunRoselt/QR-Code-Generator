"use strict";

const ComparePage = {
    meta: {
        title: 'QR Code Generator Compare | Neutral Feature Table',
        description: 'Compare QR Code Generator with QR Code Generator by Bitly, QRCode Monkey, Canva, Adobe Express, and Flowcode in a neutral, source-backed table.',
        keywords: 'QR code generator comparison, QR code software compare, QRCode Monkey vs Flowcode vs Canva, QR code generator features table',
        ogTitle: 'QR Code Generator Compare | Neutral Feature Table',
        ogDescription: 'A source-backed comparison table for popular QR code generators, focused on public offers, customization, exports, analytics, and signup requirements.',
        ogUrl: 'https://qrcode.apps.shaunroselt.com/index.html?page=compare',
        twitterTitle: 'QR Code Generator Compare | Neutral Feature Table',
        twitterDescription: 'See a neutral feature table comparing popular QR code generators using public product pages.'
    },

    providers: [
        {
            key: 'shaun',
            name: 'QR Code Generator',
            shortName: 'This app',
            sourceLabel: 'This app overview',
            sourceUrl: '?page=public'
        },
        {
            key: 'qrcg',
            name: 'QR Code Generator by Bitly',
            shortName: 'QRCG by Bitly',
            sourceLabel: 'qr-code-generator.com',
            sourceUrl: 'https://www.qr-code-generator.com/'
        },
        {
            key: 'monkey',
            name: 'QRCode Monkey',
            shortName: 'QRCode Monkey',
            sourceLabel: 'qrcode-monkey.com',
            sourceUrl: 'https://www.qrcode-monkey.com/'
        },
        {
            key: 'canva',
            name: 'Canva QR Code Generator',
            shortName: 'Canva',
            sourceLabel: 'canva.com/qr-code-generator',
            sourceUrl: 'https://www.canva.com/qr-code-generator/'
        },
        {
            key: 'adobe',
            name: 'Adobe Express QR Code Generator',
            shortName: 'Adobe Express',
            sourceLabel: 'adobe.com/express',
            sourceUrl: 'https://www.adobe.com/express/feature/image/qr-code-generator'
        },
        {
            key: 'flowcode',
            name: 'Flowcode Free QR Code Generator',
            shortName: 'Flowcode',
            sourceLabel: 'flowcode.com',
            sourceUrl: 'https://app.flowcode.com/free-qr-code-generator'
        }
    ],

    comparisonRows: [
        {
            label: 'Public offer',
            cells: {
                shaun: {
                    primary: 'Free browser-based generator',
                    note: 'Positioned as free to use now, with no signup wall on the public page.'
                },
                qrcg: {
                    primary: 'Free static QR creation plus paid platform upsell',
                    note: 'Public pages emphasize free static QR codes and a 14-day trial for broader PRO features.'
                },
                monkey: {
                    primary: '100% free static generator',
                    note: 'Public page stresses free use, unlimited scans, and commercial usage for generated static codes.'
                },
                canva: {
                    primary: 'Free QR generation inside Canva',
                    note: 'Presented as a free QR tool tied to Canva’s broader design workflow.'
                },
                adobe: {
                    primary: 'Free QR generator',
                    note: 'Framed as a free Adobe Express quick action for browser and mobile.'
                },
                flowcode: {
                    primary: 'Free generator with business upsell',
                    note: 'Free entry point, but the page also pushes analytics, API, demos, and business adoption.'
                }
            }
        },
        {
            label: 'How it is delivered',
            cells: {
                shaun: {
                    primary: 'Runs locally in the browser',
                    note: 'Public page states generation happens client-side with no backend processing.'
                },
                qrcg: {
                    primary: 'Hosted generator and account platform',
                    note: 'Public pages connect free generation with sign-up driven management features.'
                },
                monkey: {
                    primary: 'Hosted generator with static-first workflow',
                    note: 'FAQ says it does not save or reuse user data, with QR image files cached for 24 hours.'
                },
                canva: {
                    primary: 'Part of Canva’s editor platform',
                    note: 'The public flow sends users into Canva’s QR app inside a design workflow.'
                },
                adobe: {
                    primary: 'Web-based Adobe Express tool',
                    note: 'Public page says you can use it from browser or mobile without special software.'
                },
                flowcode: {
                    primary: 'Hosted generator tied to account and business products',
                    note: 'The generator page also promotes enterprise pricing, API access, and demos.'
                }
            }
        },
        {
            label: 'QR content types highlighted',
            cells: {
                shaun: {
                    primary: '12 built-in types',
                    note: 'URL, text, email, phone, SMS, WhatsApp, WiFi, location, event, app store, social, and vCard.'
                },
                qrcg: {
                    primary: 'Multiple static and marketing-oriented types',
                    note: 'Public pages mention URL, vCard, text, email, SMS, WiFi, Twitter, Bitcoin, PDF, app store, and more.'
                },
                monkey: {
                    primary: 'Many static content types',
                    note: 'URL, text, email, phone, SMS, vCard, MeCard, location, social, WiFi, event, Bitcoin, and more.'
                },
                canva: {
                    primary: 'URL-focused on the QR page',
                    note: 'The public Canva page mainly describes making QR codes for links inside designs.'
                },
                adobe: {
                    primary: 'URL-first, with other content mentioned in copy',
                    note: 'The generator is shown as link-based, while marketing copy also references contact info and text.'
                },
                flowcode: {
                    primary: 'A smaller visible starter set',
                    note: 'URL, file, SMS, email, Instagram, Facebook, YouTube, and Google Doc are listed directly on the page.'
                }
            }
        },
        {
            label: 'Customization highlighted',
            cells: {
                shaun: {
                    primary: 'Colors, frames, theme options, and export sizing',
                    note: 'Public page emphasizes polished output, QR types, and PNG/SVG export rather than account-based brand management.'
                },
                qrcg: {
                    primary: 'Colors, frames, logos, and editable dynamic options',
                    note: 'Public page says standard black and white is free, while more branding tools unlock with sign-up.'
                },
                monkey: {
                    primary: 'Strong static design controls',
                    note: 'Colors, gradients, custom body and corner shapes, logo upload, and templates are highlighted.'
                },
                canva: {
                    primary: 'Design-platform level customization',
                    note: 'Public copy mentions colors, margin size, text, font size, graphics, and logo or icon placement.'
                },
                adobe: {
                    primary: 'Brand styling with templates',
                    note: 'Public copy mentions color, style, frames, logo upload, and Adobe Express templates.'
                },
                flowcode: {
                    primary: 'Marketing-oriented customization',
                    note: 'Public page highlights color, shape, frame with CTA, and logo upload.'
                }
            }
        },
        {
            label: 'Download formats mentioned',
            cells: {
                shaun: {
                    primary: 'PNG and SVG',
                    note: 'Public page also highlights export sizes up to 8K.'
                },
                qrcg: {
                    primary: 'Free JPG, with PNG/SVG/EPS behind sign-up',
                    note: 'The FAQ explicitly separates the free JPG download from other formats that require an account.'
                },
                monkey: {
                    primary: 'PNG, SVG, PDF, and EPS',
                    note: 'Public page notes full design settings work best with PNG and SVG.'
                },
                canva: {
                    primary: 'PNG, JPEG, SVG, and PDF',
                    note: 'The page describes QR export as part of a broader design download workflow.'
                },
                adobe: {
                    primary: 'PNG, JPEG, and PDF',
                    note: 'The page describes choosing a preferred file type before sharing or editing further.'
                },
                flowcode: {
                    primary: 'PNG, JPG, and SVG',
                    note: 'The download section lists these after account creation.'
                }
            }
        },
        {
            label: 'Dynamic or editable QR support on public pages',
            cells: {
                shaun: {
                    primary: 'Not positioned as a dynamic QR management platform',
                    note: 'The public site focuses on immediate generation and export.'
                },
                qrcg: {
                    primary: 'Yes, strongly highlighted',
                    note: 'Dynamic QR codes, editing after print, and replaceable links are core PRO messaging.'
                },
                monkey: {
                    primary: 'Static by default, dynamic via linked platform',
                    note: 'The main site stresses static QR generation and upsells dynamic/editable management elsewhere.'
                },
                canva: {
                    primary: 'Not a central claim on the QR landing page',
                    note: 'The public page discusses QR creation in Canva designs more than dynamic destination management.'
                },
                adobe: {
                    primary: 'Not highlighted',
                    note: 'The page stresses free QR creation and non-expiring codes, not post-print editing controls.'
                },
                flowcode: {
                    primary: 'Yes, business positioning implies ongoing management',
                    note: 'The page promotes analytics, API, CRM use cases, and campaign measurement alongside generation.'
                }
            }
        },
        {
            label: 'Analytics or scan tracking mention',
            cells: {
                shaun: {
                    primary: 'No public analytics layer',
                    note: 'The public positioning is privacy-first and local rather than scan-tracking.'
                },
                qrcg: {
                    primary: 'Yes, for PRO or dynamic usage',
                    note: 'Public FAQs mention scan counts, location, time, and device-level campaign insights.'
                },
                monkey: {
                    primary: 'Yes, only in the management upsell',
                    note: 'The core free generator stays static, with statistics promoted in the separate management platform.'
                },
                canva: {
                    primary: 'Not highlighted on this QR page',
                    note: 'The page leans toward design, collaboration, and export rather than QR analytics.'
                },
                adobe: {
                    primary: 'Not highlighted on this QR page',
                    note: 'The public page focuses on asset creation and template editing.'
                },
                flowcode: {
                    primary: 'Yes, heavily marketed',
                    note: 'The page mentions advanced analytics, first-party data, ROI measurement, and API access.'
                }
            }
        },
        {
            label: 'Signup or download friction visible on public page',
            cells: {
                shaun: {
                    primary: 'No signup mentioned',
                    note: 'You can open the app directly from the public page.'
                },
                qrcg: {
                    primary: 'Mixed',
                    note: 'Free static creation is public, but richer exports and PRO features explicitly require account signup.'
                },
                monkey: {
                    primary: 'Low for static generation',
                    note: 'The public tool exposes creation and download directly, while dynamic features sit behind a linked platform.'
                },
                canva: {
                    primary: 'Editor workflow implied',
                    note: 'Public instructions send users into Canva’s QR app and design editor.'
                },
                adobe: {
                    primary: 'Low from public copy',
                    note: 'The page emphasizes quick browser use without special software; account friction is not foregrounded in the copied text.'
                },
                flowcode: {
                    primary: 'Higher',
                    note: 'The public instructions say to create an account before downloading the generated code.'
                }
            }
        }
    ],

    sourceCards: [
        {
            title: 'QR Code Generator by Bitly',
            summary: 'Broad hosted platform with static free creation and a clear upgrade path into dynamic QR editing, scan tracking, team features, API, and higher-format downloads.',
            bullets: [
                'Static QR codes are free, but dynamic editing and analytics are tied to sign-up or PRO messaging.',
                'Free download language centers on JPG, while PNG, SVG, and EPS are called out as sign-up gated.',
                'The site is positioned as a marketing platform rather than just a quick one-off generator.'
            ],
            href: 'https://www.qr-code-generator.com/'
        },
        {
            title: 'QRCode Monkey',
            summary: 'Strong static-first option for people who care about logo insertion, vector export, and print quality without immediately moving into a paid account workflow.',
            bullets: [
                'Claims 100% free generation, unlimited scans, and commercial usage for the static generator.',
                'Offers PNG, SVG, PDF, and EPS, with deep control over shapes, colors, and gradients.',
                'Dynamic editing and analytics are presented separately through the linked management platform.'
            ],
            href: 'https://www.qrcode-monkey.com/'
        },
        {
            title: 'Canva',
            summary: 'Best understood as a QR feature inside a larger design suite, with strong layout, collaboration, and asset-export workflows rather than QR-specific analytics messaging.',
            bullets: [
                'Public page focuses on link-based QR creation placed into Canva designs.',
                'Customization language includes colors, text, font size, graphics, and logos.',
                'Exports are presented in the context of downloadable Canva designs, including PNG, JPEG, SVG, and PDF.'
            ],
            href: 'https://www.canva.com/qr-code-generator/'
        },
        {
            title: 'Adobe Express',
            summary: 'A brand-friendly quick action that leans into file export, templates, and editing inside Adobe Express rather than QR campaign management.',
            bullets: [
                'Public page emphasizes free creation, non-expiring codes, and browser/mobile use.',
                'Customization messaging centers on style, color, frames, logos, and template integration.',
                'Download formats called out publicly are PNG, JPEG, and PDF.'
            ],
            href: 'https://www.adobe.com/express/feature/image/qr-code-generator'
        },
        {
            title: 'Flowcode',
            summary: 'A more business-forward hosted tool that combines QR generation with analytics, marketing attribution, and account-based workflows.',
            bullets: [
                'Public page highlights analytics, first-party data, CRM integrations, and bulk or API use cases.',
                'Customization includes color, shape, CTA frames, and logo uploads.',
                'The public instructions explicitly say to sign up before downloading the code.'
            ],
            href: 'https://app.flowcode.com/free-qr-code-generator'
        }
    ],

    renderCell(cell) {
        return `
            <td>
                <strong>${cell.primary}</strong>
                <span class="compare-cell-note">${cell.note}</span>
            </td>
        `;
    },

    renderComparisonTable() {
        return `
            <div class="compare-table-shell">
                <table class="compare-table">
                    <thead>
                        <tr>
                            <th>Criteria</th>
                            ${this.providers.map(provider => `<th>${provider.shortName}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${this.comparisonRows.map(row => `
                            <tr>
                                <th scope="row">${row.label}</th>
                                ${this.providers.map(provider => this.renderCell(row.cells[provider.key])).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderSourceCard(card) {
        return `
            <article class="compare-source-card">
                <h3>${card.title}</h3>
                <p>${card.summary}</p>
                <ul>
                    ${card.bullets.map(bullet => `<li><i class="bi bi-dot"></i><span>${bullet}</span></li>`).join('')}
                </ul>
                <a class="compare-source-link" href="${card.href}" target="_blank" rel="noopener noreferrer">Open source page</a>
            </article>
        `;
    },

    render() {
        return `
            <div class="public-page compare-page">
                <div class="public-shell">
                    <header class="marketing-topbar">
                        <a class="brand-mark" href="?page=public" data-route="/public" aria-label="QR Code Generator home">
                            <span class="brand-icon"><img class="brand-logo" src="assets/favicon.svg" alt="" width="48" height="48"></span>
                            <span class="brand-copy">
                                <strong>QR Code Generator</strong>
                                <span>Neutral comparison view</span>
                            </span>
                        </a>

                        <div class="topbar-actions">
                            <a class="btn btn-secondary" href="?page=public" data-route="/public">Overview</a>
                            <a class="btn btn-secondary" href="?page=pricing" data-route="/pricing">Pricing</a>
                            <button class="theme-switch" id="compareThemeToggle" type="button" aria-label="Toggle theme">
                                <i class="bi bi-moon-stars-fill theme-switch-icon" aria-hidden="true"></i>
                                <span class="theme-switch-label">Dark</span>
                            </button>
                            <a class="btn btn-primary" href="?page=home" data-route="/home">Open app</a>
                        </div>
                    </header>

                    <main>
                        <section class="compare-hero">
                            <div class="compare-hero-copy">
                                <p class="eyebrow">Compare</p>
                                <h1>One table, six QR generators, only public claims.</h1>
                                <p class="compare-intro">This page compares this app with QR Code Generator by Bitly and four other widely used QR tools: QRCode Monkey, Canva, Adobe Express, and Flowcode. The goal is neutral product context, not a winner badge.</p>

                                <div class="compare-actions">
                                    <a class="btn btn-primary" href="#compareTable">View table</a>
                                    <a class="btn btn-secondary" href="?page=home" data-route="/home">Try this app</a>
                                </div>

                                <ul class="compare-points" aria-label="Comparison guardrails">
                                    <li><i class="bi bi-check2-circle"></i><span>Only public product-page claims are included.</span></li>
                                    <li><i class="bi bi-check2-circle"></i><span>Rows focus on offer, export, customization, analytics, and friction.</span></li>
                                    <li><i class="bi bi-check2-circle"></i><span>No private pricing tiers or hidden workflows are assumed.</span></li>
                                    <li><i class="bi bi-check2-circle"></i><span>Reviewed against public pages in May 2026.</span></li>
                                </ul>
                            </div>

                            <aside class="compare-method-card">
                                <div>
                                    <p class="eyebrow">Method</p>
                                    <h2>Compare what a user can actually see before signup.</h2>
                                    <p>This is intentionally narrower than a full buyer’s guide. It uses visible landing-page and FAQ language to compare practical things a user can understand before spending time or money.</p>
                                </div>

                                <ul class="compare-method-list">
                                    <li><i class="bi bi-dot"></i><span>Offer type: free tool, static-only, or account-led platform.</span></li>
                                    <li><i class="bi bi-dot"></i><span>Feature signals: exports, customization, analytics, editing, and QR content types.</span></li>
                                    <li><i class="bi bi-dot"></i><span>Friction signals: whether the public flow suggests signup or gated downloads.</span></li>
                                </ul>
                            </aside>
                        </section>

                        <section class="compare-section">
                            <div class="compare-section-heading">
                                <div>
                                    <p class="eyebrow">Feature matrix</p>
                                    <h2>Source-backed table view.</h2>
                                    <p>Use this as a quick orientation layer. It does not score quality, it just maps what the public pages say each tool does.</p>
                                </div>
                            </div>

                            <div id="compareTable">
                                ${this.renderComparisonTable()}
                            </div>
                        </section>

                        <section class="compare-section">
                            <div class="compare-section-heading">
                                <div>
                                    <p class="eyebrow">Takeaways</p>
                                    <h2>What separates the tools at a glance.</h2>
                                </div>
                            </div>

                            <div class="compare-summary-grid">
                                <article class="compare-summary-card">
                                    <h3>Browser-first and low-friction</h3>
                                    <p>This app, Adobe Express, and QRCode Monkey are the clearest low-friction entry points if you mainly want to generate something quickly from a visible tool surface.</p>
                                </article>
                                <article class="compare-summary-card">
                                    <h3>Hosted platform workflows</h3>
                                    <p>QRCG by Bitly and Flowcode are more explicit about ongoing campaign management, analytics, and team or API use cases than the design-first tools.</p>
                                </article>
                                <article class="compare-summary-card">
                                    <h3>Design-suite overlap</h3>
                                    <p>Canva and Adobe Express sit closer to creative tooling, so the QR feature is part of a larger editing and document-export workflow.</p>
                                </article>
                            </div>
                        </section>

                        <section class="compare-section">
                            <div class="compare-section-heading">
                                <div>
                                    <p class="eyebrow">Sources</p>
                                    <h2>Short notes on each comparison source.</h2>
                                    <p>These summaries are derived from the public pages reviewed for the table.</p>
                                </div>
                            </div>

                            <div class="compare-sources-grid">
                                ${this.sourceCards.map(card => this.renderSourceCard(card)).join('')}
                            </div>
                        </section>

                        <section class="compare-section">
                            <div class="compare-closing">
                                <div>
                                    <p class="eyebrow">Use the tool</p>
                                    <h2>Need a simple local generator instead of a managed platform?</h2>
                                    <p>If your priority is immediate creation, local processing, and clean PNG or SVG export without a sign-up flow, open this app directly and start generating.</p>
                                </div>
                                <div class="compare-closing-actions">
                                    <a class="btn btn-primary" href="?page=home" data-route="/home">Open the generator</a>
                                    <a class="btn btn-secondary" href="?page=pricing" data-route="/pricing">View pricing page</a>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        `;
    },

    init() {
        const themeToggle = document.getElementById('compareThemeToggle');
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

        document.querySelectorAll('.compare-page [data-route]').forEach(link => {
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