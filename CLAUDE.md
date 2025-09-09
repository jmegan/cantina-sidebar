# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome browser extension (Manifest V3) that embeds the Cantina.com chatbot directory in Chrome's side panel. The extension allows users to browse AI assistants while working in their browser.

### Product Goals
- One-click access to Cantina's chatbot directory via Chrome side panel
- Browse and search chatbots without leaving current page
- Copy text/images from Cantina to paste into current work
- No data collection, storage, or analytics
- Minimal permissions and compliant with Chrome Web Store policies

## Key Commands

### Build and Package
```bash
# Create Chrome Web Store submission package
./package.sh
```

### Testing
- Load unpacked extension in Chrome via `chrome://extensions/`
- Enable Developer mode
- Click "Load unpacked" and select this directory

## Architecture

### Core Components

1. **Service Worker** (`background.js:1-35`)
   - Handles side panel configuration
   - Validates runtime messages from extension components

2. **Side Panel UI** (`panel.html:1-144`, `panel.js:1-500+`)
   - Embeds cantina.com in iframe
   - Navigation controls (Explore/Feed buttons, refresh)
   - URL display and copy functionality
   - Error handling with retry mechanism

3. **CSP Header Modification** (`rules.json:1-23`)
   - Removes X-Frame-Options headers to allow iframe embedding
   - Uses declarativeNetRequest API

### Navigation Flow
- Default URL: `https://cantina.com/explore`
- Navigation buttons redirect to `/explore` and `/homefeed` endpoints
- All cantina.com pages accessible within iframe
- URL validation ensures only cantina.com domains are loaded

### Key Features
- Side panel opens on extension icon click
- Loading states with 15-second timeout
- Exponential backoff retry (3 attempts max)
- Dark mode support via CSS variables
- Responsive design optimized for side panel width

## Extension Permissions

- `sidePanel`: Chrome side panel API access
- `declarativeNetRequest`: Modify response headers for iframe
- `host_permissions`: Access to cantina.com/*

## Chrome Requirements
- Minimum version: 114 (for Side Panel API support)