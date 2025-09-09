# Chrome Web Store Permission Justifications

## sidePanel Permission
**Justification:**
This permission is essential for displaying the Cantina chatbot directory in Chrome's side panel. Our extension's core functionality is to provide quick access to Cantina.com through the side panel interface, allowing users to browse AI chatbots while continuing their regular web browsing. Without this permission, the extension cannot open in the side panel, which is its primary user interface.

## declarativeNetRequest Permission
**Justification:**
This permission is required to modify HTTP response headers from cantina.com to enable iframe embedding. Cantina.com sets X-Frame-Options: DENY headers to prevent clickjacking attacks. Our extension needs to remove these headers specifically for cantina.com content loaded in our side panel iframe, allowing users to browse the Cantina chatbot directory seamlessly within the extension. This modification only applies to cantina.com resources loaded as sub_frames within our extension, preserving user sessions and login states.

## Host Permission (https://cantina.com/*)
**Justification:**
Host permission for cantina.com is necessary to apply header modifications that allow the website to be embedded in our side panel iframe. This permission works in conjunction with declarativeNetRequest to remove X-Frame-Options headers only for cantina.com content loaded within our extension. This ensures users can access their personalized Cantina experience, including maintaining their login session, directly from the Chrome side panel. The permission is limited to cantina.com only and is essential for the extension's single purpose of providing convenient access to the Cantina chatbot directory.

## Are you using remote code?
**Answer:** No, I am not using Remote code

All JavaScript code is bundled within the extension package. The extension does not:
- Load any external JavaScript files
- Use eval() or similar dynamic code execution
- Fetch and execute code from remote sources
- Include <script> tags pointing to external resources

The iframe loads cantina.com content for display purposes only, but does not execute any remote JavaScript within the extension's context.