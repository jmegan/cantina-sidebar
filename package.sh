#!/bin/bash

# Package script for Cantina.com Side Panel Chrome Extension
# This script creates a ZIP file ready for Chrome Web Store submission

EXTENSION_NAME="cantina-side-panel"
VERSION=$(grep '"version"' manifest.json | cut -d'"' -f4)
OUTPUT_FILE="${EXTENSION_NAME}-v${VERSION}.zip"

echo "Packaging Cantina.com Side Panel v${VERSION}..."

# Remove any existing package
rm -f *.zip

# Create the package, excluding development files
zip -r "$OUTPUT_FILE" . \
    -x "*.git*" \
    -x "*.DS_Store" \
    -x "README.md" \
    -x "prd.md" \
    -x "STORE_LISTING.md" \
    -x "PERMISSION_JUSTIFICATIONS.md" \
    -x "package.sh" \
    -x "*.zip" \
    -x "_metadata/*"

echo "✓ Package created: $OUTPUT_FILE"
echo ""
echo "Package contents:"
unzip -l "$OUTPUT_FILE" | tail -n +4 | head -n -2

echo ""
echo "Ready for Chrome Web Store submission!"
echo "Upload $OUTPUT_FILE at: https://chrome.google.com/webstore/devconsole"