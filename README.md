# 🤖 Cantina.com Side Panel - Chrome Extension

A powerful Chrome extension that brings Cantina's AI chatbot directory directly to your browser's side panel, enabling seamless browsing and exploration of AI assistants while you work.

![Version](https://img.shields.io/badge/version-0.7.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome](https://img.shields.io/badge/Chrome-114%2B-orange)
![Manifest](https://img.shields.io/badge/Manifest-V3-purple)

## ✨ Features

### 🎯 Core Functionality
- **Side Panel Integration**: Access Cantina Explorer instantly through Chrome's side panel without leaving your current page
- **Full Navigation**: Browse any page on Cantina.com within the side panel
- **Smart History**: Back/Forward navigation with intelligent history tracking
- **URL Display**: Always see which Cantina page you're viewing
- **Quick Actions**: Home button for instant return to the explore page

### 🔐 Privacy & Security
- **Incognito Mode Toggle**: Open any Cantina page in a private incognito window with one click
- **No Data Collection**: Zero tracking, analytics, or personal data storage
- **Minimal Permissions**: Only requests essential permissions for functionality
- **CSP Header Management**: Intelligently handles content security policies for seamless embedding

### 🎨 Modern UI/UX
- **Responsive Design**: Adapts perfectly to side panel width
- **Dark Mode Support**: Automatically matches your browser's theme preference
- **Loading States**: Smooth animations and clear feedback during page loads
- **Error Handling**: Graceful fallbacks with helpful user guidance
- **Copy URL**: One-click URL copying with visual confirmation
- **Refresh Control**: Manual refresh with rotation animation

## 📸 Screenshots

<details>
<summary>Click to view screenshots</summary>

### Main Interface
The clean, modern interface with navigation controls and URL display

### Incognito Toggle
Privacy-focused browsing with the incognito mode toggle

### Error States
Helpful error messages with clear action buttons

</details>

## 🚀 Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/jmegan/cantina-sidebar.git
   cd cantina-sidebar
   ```

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" toggle (top right)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the `cantina-sidebar` folder
   - The extension icon will appear in your toolbar

### Method 2: Direct Download

1. Download the latest release from [GitHub Releases](https://github.com/jmegan/cantina-sidebar/releases)
2. Extract the ZIP file
3. Follow steps 2-3 from Method 1

## 📖 Usage Guide

### Basic Usage

1. **Open the Side Panel**
   - Click the Cantina extension icon in your Chrome toolbar
   - The side panel opens on the right side of your browser

2. **Navigate Cantina**
   - Browse chatbots and AI assistants
   - Click on any chatbot to view details
   - Use the search functionality on Cantina's site

3. **Navigation Controls**
   - **← Back**: Return to the previous page
   - **→ Forward**: Go forward in history
   - **🏠 Home**: Return to Cantina Explorer homepage
   - **🔄 Refresh**: Reload the current page

### Advanced Features

#### 🔐 Incognito Mode
- Toggle the incognito switch in the URL bar
- Opens the current page in a new incognito window
- Perfect for private browsing sessions

#### 📋 Copy Current URL
- Click the copy icon next to the URL
- Visual confirmation when copied
- Paste anywhere with Ctrl/Cmd+V

#### ⚙️ Enable in Incognito
1. Go to `chrome://extensions/`
2. Find "Cantina Chatbot Explorer"
3. Click "Details"
4. Toggle "Allow in Incognito"

## 🛠️ Technical Details

### Architecture

```
cantina-sidebar/
├── manifest.json          # Manifest V3 configuration
├── background.js          # Service worker for extension logic
├── panel.html            # Side panel HTML structure
├── panel.css             # Modern styling with CSS variables
├── panel.js              # Panel functionality and navigation
├── rules.json            # Declarative net request rules
├── icons/                # Extension icons
│   ├── favicon-32x32.png # Main extension icon
│   ├── icon-16.png       # Toolbar icon (16x16)
│   ├── icon-48.png       # Extension icon (48x48)
│   └── icon-128.png      # Store icon (128x128)
└── README.md             # Documentation

```

### Key Technologies

- **Manifest V3**: Latest Chrome extension architecture
- **Service Workers**: Background script handling
- **Declarative Net Request**: Header modification for iframe embedding
- **Chrome Side Panel API**: Native side panel integration
- **Modern JavaScript**: ES6+ with IIFE pattern
- **CSS3**: Custom properties, animations, and responsive design

### Permissions

| Permission | Purpose |
|------------|---------|
| `sidePanel` | Enable side panel functionality |
| `declarativeNetRequest` | Modify headers for iframe embedding |
| `tabs` | Handle incognito window creation |

### Browser Requirements

- **Chrome Version**: 114 or higher
- **Side Panel API**: Required for core functionality
- **JavaScript**: Enabled (required)

## 🔧 Development

### Prerequisites

- Chrome browser (version 114+)
- Git for version control
- Text editor or IDE

### Local Development

1. **Make changes** to the source files
2. **Reload extension** in Chrome:
   - Go to `chrome://extensions/`
   - Click refresh icon on the extension card
3. **Test changes** by opening the side panel

### Building from Source

No build process required! This extension uses vanilla JavaScript and can be loaded directly.

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

#### Panel Won't Open
- ✅ Ensure Chrome version 114 or higher
- ✅ Check extension is enabled in `chrome://extensions/`
- ✅ Try disabling and re-enabling the extension

#### Cantina Site Won't Load
- ✅ Check your internet connection
- ✅ Click the refresh button in the panel
- ✅ Try the "Open in New Tab" fallback option
- ✅ Ensure the extension has proper permissions

#### Incognito Not Working
- ✅ Enable "Allow in Incognito" in extension settings
- ✅ Check if Chrome allows incognito mode
- ✅ Ensure you have permission to create new windows

#### Navigation Issues
- ✅ Some links may open in new tabs (by design)
- ✅ Cross-origin restrictions may limit some features
- ✅ Use the home button to reset navigation

### Debug Mode

1. Open Chrome DevTools while the panel is open
2. Check the Console for any error messages
3. Review Network tab for failed requests

## 🔐 Privacy & Security

### Data Handling
- **No Data Collection**: This extension does not collect, store, or transmit any user data
- **No Analytics**: No tracking or analytics libraries included
- **No External Requests**: Only connects to cantina.com
- **Local Operation**: All functionality runs locally in your browser

### Security Features
- **Content Security Policy**: Properly configured CSP headers
- **Minimal Permissions**: Only essential permissions requested
- **No Remote Code**: All code is bundled with the extension
- **Open Source**: Full transparency with public source code

## 📄 License

This project is provided as-is for educational and productivity purposes. See the [LICENSE](LICENSE) file for details.

## 🤝 Support

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/jmegan/cantina-sidebar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jmegan/cantina-sidebar/discussions)
- **Cantina Support**: For Cantina-specific issues, visit [cantina.com](https://cantina.com)

### Reporting Bugs

Please include:
1. Chrome version
2. Extension version
3. Steps to reproduce
4. Expected vs actual behavior
5. Any error messages from the console

## 🎯 Roadmap

### Planned Features
- [ ] Bookmark favorite chatbots
- [ ] Quick search within the panel
- [ ] Keyboard shortcuts
- [ ] Export chat history
- [ ] Multi-tab support
- [ ] Custom themes

### Under Consideration
- Chrome Web Store publication
- Firefox add-on version
- Edge browser support
- Offline caching capabilities

## 📊 Version History

### v1.2.0 (Current)
- ✨ Added incognito mode toggle
- 🎨 Improved UI with toggle switch
- 🔧 Enhanced navigation controls
- 📝 Comprehensive documentation

### v1.1.0
- 🔓 Fixed iframe embedding with CSP header removal
- 🔧 Added declarativeNetRequest implementation
- 🐛 Resolved frame-ancestors restrictions

### v1.0.0
- 🎉 Initial release
- 📱 Side panel integration
- 🧭 Basic navigation features
- 🎨 Modern UI design

## 👥 Contributors

- Created with 🤖 [Claude Code](https://claude.ai/code)
- Maintained by [@jmegan](https://github.com/jmegan)

## 🙏 Acknowledgments

- [Cantina](https://cantina.com) for the amazing chatbot platform
- Chrome Extensions team for the Side Panel API
- All contributors and users of this extension

---

<div align="center">
Made with ❤️ for the AI community

⭐ Star this repo if you find it helpful!
</div>