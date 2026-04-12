# QR Code Generator - App-Style UI

## Overview
The QR Code Generator has been completely redesigned with a modern, app-style interface inspired by professional developer tools. The application features a clean, dark-themed UI with a sidebar navigation system and modular single-page architecture.

## UI Design

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  Top Bar (50px)                                             │
│  [☰] QR Code Generator                               [●]    │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│ Sidebar  │  Main Content Area                               │
│ (280px)  │                                                   │
│          │  ┌─────────────────────────────────────────────┐ │
│ ● Home   │  │  Content Header                             │ │
│          │  │  Title + Subtitle                           │ │
│ QR Modes │  └─────────────────────────────────────────────┘ │
│ ├ URL    │                                                   │
│ ├ Text   │  ┌─────────────────────────────────────────────┐ │
│ ├ Email  │  │  Dynamic Content                            │ │
│ ├ Phone  │  │  (Home/Settings/QR Mode pages)              │ │
│ └ ...    │  │                                             │ │
│          │  └─────────────────────────────────────────────┘ │
│ ● Settings                                                   │
└──────────┴──────────────────────────────────────────────────┘
```

### Color Scheme (Dark Theme)
- **Primary Background**: `#1e1e1e` - Main app background
- **Secondary Background**: `#252526` - Top bar, sidebar, cards
- **Tertiary Background**: `#2d2d30` - Hover states, inputs
- **Text Primary**: `#cccccc` - Main text color
- **Text Secondary**: `#969696` - Subtitles, labels
- **Text Muted**: `#6e6e6e` - Hints, placeholders
- **Border Color**: `#3e3e42` - Dividers, borders
- **Accent Primary**: `#007acc` - Active states, links
- **Accent Secondary**: `#f48771` - Theme indicator (dark mode)

### Color Scheme (Light Theme)
- **Primary Background**: `#ffffff`
- **Secondary Background**: `#f3f3f3`
- **Text Primary**: `#333333`
- **Accent Primary**: `#007acc`

## Key Features

### 1. Navigation
- **Top Bar**: Fixed header with menu toggle, app branding, and theme indicator
- **Sidebar**: Collapsible navigation with categorized QR modes
- **Active State**: Visual indicator for current page
- **Mobile Responsive**: Hamburger menu for small screens

### 2. Pages

#### Home Page
- Grid layout of QR mode cards (280px min width, responsive)
- Search functionality to filter tools
- Card hover effects with subtle animation
- Icon-based visual hierarchy

#### Settings Page
- Theme selection (Dark/Light toggle)
- Clean settings layout with icons
- Grouped setting sections

#### QR Mode Pages
- Two-column layout: Form (left) + Preview (right)
- Sticky preview section on scroll
- Form groups with labels and hints
- Export size selector (1080p, 1440p, 4K, 8K)
- Download buttons for PNG and SVG

### 3. Components

#### Form Elements
- Text inputs, textareas, selects with consistent styling
- Focus states with accent color border
- Form hints for user guidance
- Accessible labels

#### Buttons
- Primary button (accent color background)
- Secondary button (subtle background with border)
- Block button (full width)
- Icon + text combinations

#### Cards
- Rounded corners (8px border-radius)
- Subtle border
- Hover effects (transform + background change)
- Shadow on hover

## File Structure

```
/
├── index.html                  # Main app shell
├── css/
│   └── app.css                 # Complete styling with themes
├── js/
│   ├── app.js                  # App initialization & routing setup
│   ├── router.js               # SPA router implementation
│   ├── theme.js                # Theme manager (dark/light)
│   └── qr-utils.js             # QR code generation utilities
└── modules/
    ├── home.js                 # Home page module
    ├── settings.js             # Settings page module
    └── qr-modes/               # Individual QR mode modules
        ├── url.js
        ├── text.js
        ├── email.js
        ├── phone.js
        ├── sms.js
        ├── whatsapp.js
        ├── wifi.js
        ├── location.js
        ├── event.js
        ├── appstore.js
        ├── social.js
        └── vcard.js
```

## Technical Implementation

### Single Page Application (SPA)
- Hash-based routing (`#/url`, `#/settings`, etc.)
- Dynamic content loading without page refreshes
- Navigation state management
- Route-based active state updates

### Module System
- Each QR mode is a separate JavaScript module
- Consistent interface: `render()` and `init()` methods
- Lazy-loaded content via router
- Modular and maintainable code structure

### Theme System
- CSS custom properties for theming
- localStorage persistence
- Instant theme switching
- Theme indicator visual feedback

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (mobile), 1024px (tablet)
- Sidebar transforms to slide-out menu on mobile
- Grid layouts adapt to screen size
- Touch-friendly target sizes (44-48px minimum)

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses standard CSS Grid and Flexbox
- No build process required
- Progressive enhancement approach

## Accessibility
- Semantic HTML structure
- ARIA-compliant navigation
- Keyboard navigation support
- Focus indicators
- Sufficient color contrast
- Readable font sizes (min 14px)

## Performance
- Minimal dependencies (only Bootstrap Icons and QRCode.js)
- CSS-only animations
- Efficient DOM updates
- No framework overhead
- Fast page transitions

## Future Enhancements
- Add smooth page transitions
- Implement QR code preview in real-time
- Add keyboard shortcuts
- Include tooltips for better UX
- Add more theme options
- Implement settings persistence
- Add export history
