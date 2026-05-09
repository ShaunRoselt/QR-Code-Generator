"use strict";

// Home Page Module
const HomePage = {
    render() {
        return `
            <div class="content-header">
                <h1 class="content-title">Home</h1>
                <p class="content-subtitle">Select a QR code type to get started</p>
            </div>
            
            <div class="search-bar">
                <div class="search-field">
                    <i class="bi bi-search search-icon" aria-hidden="true"></i>
                    <input type="text" class="search-input" placeholder="Type to search for tools..." id="searchInput">
                </div>
            </div>
            
            <div class="tools-grid" id="toolsGrid">
                ${this.renderToolCards()}
            </div>
        `;
    },
    
    renderToolCards() {
        const tools = [
            { id: 'url', icon: 'bi-link-45deg', title: 'URL / Website', description: 'Create QR codes for website links' },
            { id: 'text', icon: 'bi-fonts', title: 'Plain Text', description: 'Generate QR codes with text content' },
            { id: 'email', icon: 'bi-envelope', title: 'Email', description: 'Pre-filled email with subject and message' },
            { id: 'phone', icon: 'bi-telephone', title: 'Phone Number', description: 'Click-to-call QR codes' },
            { id: 'sms', icon: 'bi-chat-dots', title: 'SMS', description: 'Pre-filled text message QR codes' },
            { id: 'whatsapp', icon: 'bi-whatsapp', title: 'WhatsApp', description: 'Direct WhatsApp message links' },
            { id: 'wifi', icon: 'bi-wifi', title: 'WiFi', description: 'Easy WiFi network connection' },
            { id: 'location', icon: 'bi-geo-alt', title: 'Location', description: 'GPS coordinates and maps' },
            { id: 'event', icon: 'bi-calendar-event', title: 'Calendar Event', description: 'Add events to calendar' },
            { id: 'appstore', icon: 'bi-shop', title: 'App Store', description: 'Link to app stores' },
            { id: 'social', icon: 'bi-share', title: 'Social Media', description: 'Social media profiles' },
            { id: 'vcard', icon: 'bi-person-vcard', title: 'vCard', description: 'Contact information cards' }
        ];
        
        return tools.map(tool => `
            <a href="?page=${tool.id}" class="tool-card" data-tool="${tool.id}" data-route="/${tool.id}">
                <div class="tool-icon">
                    <i class="bi ${tool.icon}"></i>
                </div>
                <div class="tool-title">${tool.title}</div>
                <div class="tool-description">${tool.description}</div>
            </a>
        `).join('');
    },
    
    init() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const toolCards = document.querySelectorAll('.tool-card');
                
                toolCards.forEach(card => {
                    const title = card.querySelector('.tool-title').textContent.toLowerCase();
                    const description = card.querySelector('.tool-description').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || description.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
        
        // Handle tool card clicks
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const route = card.getAttribute('data-route');
                router.navigate(route);
            });
        });
    }
};
