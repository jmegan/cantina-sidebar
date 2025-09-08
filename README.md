# Cantina Chatbot Explorer - Chrome Extension

A Chrome extension that provides quick access to Cantina's chatbot directory through a convenient side panel, allowing you to browse and search for chatbots while working on other pages.

## Features

- **Side Panel Access**: Opens Cantina Explorer in Chrome's side panel with a single click
- **Modern UI**: Clean, responsive design with smooth animations and transitions
- **Error Handling**: Graceful fallback if the site cannot be embedded
- **Dark Mode Support**: Automatically adapts to your browser's theme
- **Copy & Paste**: Standard browser copy functionality to transfer content
- **No Data Collection**: Privacy-focused with no tracking or storage

## Installation

### Load as Unpacked Extension (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" toggle in the top right
3. Click "Load unpacked" button
4. Select the `cantina-sidebar` folder
5. The extension icon will appear in your toolbar

### Using the Extension

1. Click the extension icon in your toolbar to open the side panel
2. The Cantina Explorer will load in the panel on the right
3. Browse and search for chatbots within the panel
4. Copy any text or images using standard browser commands (Ctrl/Cmd+C)
5. Paste the content into your current page or application
6. Click the refresh button to reload the Cantina site if needed

## File Structure

```
cantina-sidebar/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for panel behavior
├── panel.html            # Side panel HTML structure
├── panel.css             # Modern styling
├── panel.js              # Panel functionality
├── icons/                # Extension icons
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md             # This file
```

## Technical Details

- **Manifest Version**: V3
- **Required Permissions**: `sidePanel` only
- **Chrome Version**: 114+ (Side Panel API requirement)
- **Content Security**: Compliant with Chrome Web Store policies

## Troubleshooting

### Panel Won't Open
- Ensure Chrome is version 114 or higher
- Check that the extension is enabled in `chrome://extensions/`

### Cantina Site Won't Load
- Check your internet connection
- Try clicking the refresh button in the panel header
- If embedding is blocked, use the "Open in New Tab" fallback option

### Copy/Paste Issues
- Standard browser copy (Ctrl/Cmd+C) should work normally
- Some sites may restrict clipboard access for security

## Privacy

This extension:
- Does not collect any user data
- Does not use analytics or tracking
- Does not store any information locally
- Only requires minimal permissions for side panel functionality

## Development

To modify the extension:

1. Edit the source files as needed
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Support

For issues or questions about:
- The extension itself: Check this README or the source code
- Cantina's website: Visit https://cantina.com/explore

## License

This extension is provided as-is for educational and productivity purposes.

## Version History

- **1.0.0** - Initial release with core side panel functionality