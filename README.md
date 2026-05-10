# QR Code Generator

QR Code Generator is a client-side web app for creating high-resolution QR codes in the browser. It supports 12 QR code types, multiple frame styles, dark and light themes, and PNG or SVG export up to 8K resolution.

## Highlights

- 12 QR code types: URL, text, email, phone, SMS, WhatsApp, WiFi, location, event, app store, social media, and vCard
- Multiple frame styles for branded or presentation-ready QR codes
- PNG and SVG export support
- Export sizes from 1080p to 8K
- Real-time preview while editing content
- Dark and light themes
- Responsive app-style interface for desktop and mobile
- Client-side only processing with no tracking or server dependency

## Quick Start

This project does not require a build step.

1. Clone the repository.
2. Open `index.html?page=public` for the public marketing page or `index.html?page=home` for the app home.

You can also host the project with any simple static file server if you prefer working from `http://localhost` during development.

## Supported QR Code Types

- URL / Website
- Plain Text
- Email
- Phone
- SMS
- WhatsApp
- WiFi
- Location
- Calendar Event
- App Store
- Social Media
- vCard

## Export Options

- Formats: PNG, SVG
- Sizes: 1080p, 1440p, 4K, 8K
- Error correction levels: Low, Medium, Quartile, High

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- QRCode.js
- Bootstrap Icons

## Project Structure

```text
.
├── public.html
├── index.html
├── css/
│   ├── app.css
│   └── public.css
├── js/
│   ├── app.js
│   ├── public.js
│   ├── qr-frames.js
│   ├── qr-utils.js
│   ├── router.js
│   └── theme.js
├── pages/
│   ├── home.js
│   ├── release-notes.js
│   ├── settings.js
│   └── qr-types/
└── README.md
```

`public.html` is kept as a compatibility redirect to `index.html?page=public`.

## Privacy

All QR code generation happens locally in the browser. The app does not require a backend and does not send QR payload data to a remote server.


## Links

- Homepage: https://qrcode.apps.shaunroselt.com
- Repository: https://github.com/ShaunRoselt/QR-Code-Generator