# QR Code Generator

A professional, feature-rich QR code generator web application that allows users to create custom QR codes for various purposes. Built with HTML, CSS, JavaScript, Bootstrap 5, and Bootstrap Icons.

## 🚀 Features

- **Multiple QR Code Types (10 Types):**
  - URL/Website links
  - Plain text
  - Email (with subject and body)
  - Phone numbers
  - SMS messages
  - WhatsApp messages
  - WiFi credentials
  - GPS Location/Maps
  - Calendar events
  - vCard (contact information)

- **Customization Options:**
  - Adjustable display size (128px - 1024px)
  - Custom foreground and background colors
  - Error correction levels (Low, Medium, Quartile, High)

- **User-Friendly Interface:**
  - Modern, responsive design
  - Mobile-friendly
  - Intuitive form switching
  - Real-time QR code generation

- **Export Options:**
  - Download as PNG (up to 8K resolution - 7680x7680)
  - Download as SVG (scalable to any size)
  - Multiple export sizes: 1080p Full HD (1920px), 1440p Quad HD (2560px), 4K Ultra HD (3840px), 8K Ultra HD (7680px)
  - High-quality output perfect for printing and large displays

- **Privacy-First:**
  - All processing happens in your browser
  - No data sent to external servers
  - Completely offline-capable

## 🌐 Live Demo

Visit the live demo: [QR Code Generator](https://shaunroselt.github.io/QR-Code-Generator/)

## 📋 How to Use

1. **Select QR Code Type:** Choose from URL, Text, Email, Phone, SMS, WiFi, or vCard
2. **Enter Information:** Fill in the required fields for your selected type
3. **Customize (Optional):** Adjust size, colors, and error correction level
4. **Generate:** Click the "Generate QR Code" button
5. **Download:** Save your QR code as PNG or SVG

## 🛠️ Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Bootstrap 5.3.2** - Responsive framework
- **Bootstrap Icons 1.11.3** - Icon library
- **QRCode.js** - QR code generation library

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