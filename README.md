# QR Code Generator

A professional, app-style QR code generator with a modern interface inspired by developer tools. Features a modular single-page application architecture with dark/light themes and 12 different QR code types.

## ✨ New UI - Version 2.0

The QR Code Generator has been completely redesigned with a professional app-style interface featuring:

- **Modern Dark Theme**: Professional color scheme optimized for extended use
- **Light Theme Option**: Clean, bright alternative theme
- **Sidebar Navigation**: Categorized QR modes for easy access
- **Single Page App**: Smooth navigation without page reloads
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modular Architecture**: Each QR mode in its own file for maintainability

## 🚀 Features

- **12 QR Code Types:**
  - URL/Website links
  - Plain text
  - Email (with subject and body)
  - Phone numbers
  - SMS messages
  - WhatsApp messages
  - WiFi credentials
  - GPS Location/Maps
  - Calendar events
  - App Store links (Google Play, Apple App Store, Microsoft Store, Steam, Amazon)
  - Social Media profiles (15+ platforms)
  - vCard (contact information)

- **Professional Interface:**
  - App-style layout with sidebar navigation
  - Dark theme (default) and Light theme
  - Theme persistence via localStorage
  - Searchable home page with all QR modes
  - Settings page for customization
  - Mobile-responsive with hamburger menu

- **High-Resolution Export:**
  - 1080p Full HD (1920x1920)
  - 1440p Quad HD (2560x2560)
  - 4K Ultra HD (3840x3840)
  - 8K Ultra HD (7680x7680)
  - PNG and SVG formats

- **Privacy-First:**
  - All processing happens in your browser
  - No data sent to external servers
  - Completely offline-capable

## 🌐 Live Demo

Visit the live demo: [QR Code Generator](https://shaunroselt.github.io/QR-Code-Generator/)

## 📋 How to Use

1. **Navigate**: Use the sidebar to select a QR code type or view all tools on the home page
2. **Configure**: Fill in the form with your content (URL, text, contact info, etc.)
3. **Customize**: Adjust size, colors, and error correction level
4. **Generate**: Click "Generate QR Code" to create your QR code
5. **Export**: Choose your preferred resolution and download as PNG or SVG

## 🎨 Themes

Switch between Dark and Light themes in the Settings page:
- **Dark Theme** (default): Professional dark color scheme optimized for extended use
- **Light Theme**: Clean, bright interface for daytime use

Theme preference is saved automatically in your browser.

## 📁 Project Structure

```
/
├── index.html           # Main app shell
├── css/
│   └── app.css          # Complete styling with dark/light themes
├── js/
│   ├── app.js          # Application initialization
│   ├── router.js       # SPA routing system
│   ├── theme.js        # Theme management
│   └── qr-utils.js     # QR code generation utilities
└── modules/
    ├── home.js         # Home page with tool cards
    ├── settings.js     # Settings page
    └── qr-modes/       # Individual QR mode modules
        ├── url.js      ├── text.js
        ├── email.js    ├── phone.js
        ├── sms.js      ├── whatsapp.js
        ├── wifi.js     ├── location.js
        ├── event.js    ├── appstore.js
        ├── social.js   └── vcard.js
```

## 🛠️ Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Modern styling with custom properties (CSS variables)
- **JavaScript (ES6+)** - Vanilla JS with modular architecture
- **Bootstrap Icons 1.11.3** - Icon library
- **QRCode.js** - QR code generation library
- **SPA Router** - Custom hash-based routing

## 📦 Installation

### GitHub Pages (Recommended)

This project is designed to work with GitHub Pages out of the box:

1. Fork this repository
2. Go to repository Settings
3. Navigate to Pages section
4. Select the branch (usually `main`) and root directory
5. Click Save
6. Your site will be published at `https://yourusername.github.io/QR-Code-Generator/`

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/ShaunRoselt/QR-Code-Generator.git
```

2. Navigate to the project directory:
```bash
cd QR-Code-Generator
```

3. Open `index.html` in your browser:
```bash
# Using Python (if installed)
python -m http.server 8000

# Or simply open the file
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

4. Visit `http://localhost:8000` in your browser

## 📱 QR Code Types Explained

### URL/Website
Generate QR codes that link to any website or webpage.

### Plain Text
Create QR codes containing any text information.

### Email
Generate QR codes that open email client with pre-filled recipient, subject, and message.

### Phone Number
Create QR codes that dial a phone number when scanned.

### SMS
Generate QR codes that open SMS app with pre-filled number and message.

### WhatsApp
Create QR codes that open WhatsApp chat with a specific number and optional pre-filled message.

### WiFi
Create QR codes for easy WiFi network connection. Supports:
- WPA/WPA2 encryption
- WEP encryption
- Open networks
- Hidden networks

### Location
Generate QR codes for GPS coordinates that open in mapping applications with optional location name.

### Calendar Event
Create QR codes for calendar events with:
- Event title
- Location
- Start and end date/time
- Description

### App Store Link
Generate QR codes that link directly to apps on various platforms:
- Google Play Store (Android)
- Apple App Store (iOS)
- Microsoft Store (Windows)
- Steam (PC Gaming)
- Amazon Appstore

### Social Media
Create QR codes for social media profiles on 15+ platforms:
- Facebook, Instagram, Twitter/X
- LinkedIn, TikTok, YouTube
- Snapchat, Pinterest, Reddit
- Discord, Telegram, Threads
- GitHub, Twitch, and more

### vCard
Generate QR codes containing contact information including:
- Name
- Organization
- Phone number
- Email address
- Website

## 🎨 Customization

You can customize the QR code appearance and export options:

- **Display Size:** Choose from 128px to 1024px for on-screen preview
- **Export Size:** Select export resolution:
  - 1080p Full HD (1920x1920) - Great for web and mobile
  - 1440p Quad HD (2560x2560) - Excellent for high-res displays
  - 4K Ultra HD (3840x3840) - Perfect for large prints and billboards
  - 8K Ultra HD (7680x7680) - Maximum quality for professional printing
- **Colors:** Set custom foreground and background colors
- **Error Correction:**
  - Low (7%): Smaller QR codes, less error recovery
  - Medium (15%): Balanced (default)
  - Quartile (25%): Better error recovery
  - High (30%): Maximum error recovery, larger codes

## 🔒 Privacy & Security

- No data collection
- No external API calls (except CDN resources)
- All QR code generation happens locally in your browser
- No cookies or tracking
- Open source and transparent

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - QR code generation library
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [Bootstrap Icons](https://icons.getbootstrap.com/) - Icon library

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

Made with ❤️ by the open source community