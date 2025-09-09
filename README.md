# Cantina.com Side Panel - Chrome Extension

A Chrome extension that embeds Cantina's AI chatbot directory in Chrome's side panel for seamless browsing while you work.

![Version](https://img.shields.io/badge/version-0.7.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome](https://img.shields.io/badge/Chrome-114%2B-orange)
![Manifest](https://img.shields.io/badge/Manifest-V3-purple)

## ✨ Features

### Core Functionality
- **Side Panel Integration**: Access Cantina.com instantly through Chrome's side panel without leaving your current page
- **Editable URL Navigation**: Edit the path directly in the URL bar to navigate to any Cantina.com page
- **Quick Navigation Buttons**: Jump to Explore, Feed, or Home with one click
- **Zoom Controls**: Adjust iframe zoom from 50% to 200% with keyboard shortcuts (Ctrl/Cmd +/-/0)
- **URL Copy**: One-click URL copying with visual confirmation
- **Refresh Control**: Manual refresh with smooth animation

### Modern UI/UX
- **Clean Branding**: Features the official Cantina wordmark
- **Responsive Design**: Optimized for side panel width
- **Dark Mode Support**: Automatically matches your browser's theme
- **Loading States**: Smooth animations during page loads
- **Error Handling**: Graceful fallbacks with helpful guidance
- **Persistent Settings**: Zoom level saved between sessions

### Privacy & Security
- **No Data Collection**: Zero tracking, analytics, or personal data storage
- **Minimal Permissions**: Only essential permissions for functionality
- **Local Operation**: All functionality runs locally in your browser
- **Open Source**: Full transparency with public source code

## 🚀 Installation

### Load as Unpacked Extension

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

## 📖 Usage

### Opening the Side Panel
Click the Cantina extension icon in your Chrome toolbar to open the side panel.

### Navigation
- **URL Bar**: Type any path after `cantina.com/` and press Enter to navigate
- **Explore Button**: Go to the chatbot explore page
- **Feed Button**: View your personalized feed
- **Home Button**: Return to Cantina homepage
- **Refresh**: Reload the current page

### Zoom Controls
- **Zoom In**: Click + button or press Ctrl/Cmd + Plus
- **Zoom Out**: Click - button or press Ctrl/Cmd + Minus  
- **Reset Zoom**: Click percentage display or press Ctrl/Cmd + 0
- Zoom range: 50% to 200% in 10% increments

## 🛠️ Technical Details

### Architecture

```
cantina-sidebar/
├── manifest.json          # Manifest V3 configuration
├── background.js          # Service worker
├── panel.html            # Side panel structure
├── panel.css             # Styling with CSS variables
├── panel.js              # Panel functionality
├── rules.json            # Header modification rules
├── icons/                # Extension icons
│   ├── cantinawordmark.svg
│   └── [various icon sizes]
├── package.sh            # Build script
└── README.md
```

### Key Technologies
- **Manifest V3**: Latest Chrome extension architecture
- **Service Workers**: Background script handling
- **Declarative Net Request**: Header modification for iframe embedding
- **Chrome Side Panel API**: Native side panel integration
- **CSS Transform**: Smooth zoom functionality

### Permissions

| Permission | Purpose |
|------------|---------|
| `sidePanel` | Enable side panel functionality |
| `declarativeNetRequest` | Modify headers for iframe embedding |
| `host_permissions` | Access to cantina.com |

### Browser Requirements
- Chrome version 114 or higher
- JavaScript enabled

## 🔧 Development

### Building
```bash
./package.sh
```
Creates a ZIP file ready for Chrome Web Store submission.

### Local Development
1. Make changes to source files
2. Go to `chrome://extensions/`
3. Click refresh icon on the extension card
4. Test changes in the side panel

## 🐛 Troubleshooting

### Panel Won't Open
- Ensure Chrome version 114+
- Check extension is enabled
- Try disabling/re-enabling

### Cantina Won't Load
- Check internet connection
- Click refresh button
- Try "Open in New Tab" fallback

### Navigation Issues
- Some links may open in new tabs (by design)
- Use navigation buttons or edit URL path directly

## 📊 Version History

### v0.7.0 (Current)
- Added editable URL path navigation
- Users can navigate by editing the path directly

### v0.6.0
- Added zoom controls (50%-200%)
- Keyboard shortcuts for zoom
- Replaced emoji with Cantina wordmark
- Rebranded to "Cantina.com Side Panel"

### v0.5.0
- Initial public release
- Core navigation features
- Modern UI design

## 📄 License

This project is provided as-is for educational and productivity purposes.

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/jmegan/cantina-sidebar/issues)
- **Cantina Support**: Visit [cantina.com](https://cantina.com)

---

<div align="center">
Made with ❤️ for the AI community

⭐ Star this repo if you find it helpful!
</div>