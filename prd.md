## Cantina Chatbot Explorer – Chrome Side Panel Extension (PRD)

### 1) Goal
Provide a one-click Chrome extension that opens a right-side panel rendering `https://cantina.com/explore` so users can browse/search the Cantina chatbot directory and open chatbot profile pages inside the panel, then copy text/images into the page they’re currently viewing. No caching, databases, or persistent storage.

### 2) Non‑Goals
- No data collection, analytics, or user accounts
- No backend, sync, or local database
- No scraping, rewriting, or API integrations beyond standard browser behavior

### 3) Users and Jobs-To-Be-Done
- As a content editor, I want quick access to Cantina’s chatbot directory while staying on my current site.
- As a researcher, I want to search Cantina, open profile pages in-panel, and copy details/images.
- As a developer, I want a minimal, compliant extension with the least moving parts.

### 4) Success Criteria / Acceptance
- Clicking the extension icon opens the Chrome Side Panel on the right.
- The panel loads `https://cantina.com/explore` and remains interactive (search, navigation).
- Internal navigation within the Cantina domain keeps content inside the panel (subject to the site’s link targets).
- User can select and copy text/images normally (standard browser clipboard behavior).
- No extension storage access; no background data retention.

### 5) Scope
- Manifest V3 extension using Chrome’s Side Panel API
- Minimal permissions: `sidePanel` only (no `storage`, no host permissions unless later required)
- A lightweight `panel.html` that embeds Cantina via an `<iframe>`
- A service worker that enables “open side panel on action click”

Out of scope (for initial version):
- Modifying site headers, proxying requests, or bypassing Content Security Policy (CSP)
- Programmatic copy automation; we rely on standard user copy (Cmd/Ctrl+C)
- UI controls beyond a basic panel with the embedded site

### 6) Key UX Flows
1) Install extension → toolbar icon appears
2) Click icon → side panel opens on right, loading Cantina Explore
3) Use Cantina’s search and links → navigate within panel to chatbot profiles
4) Select text/images → copy → paste into current page/context
5) Close the side panel when done (Chrome’s standard close control)

Notes:
- If Cantina links use `target="_blank"`, Chrome may open a new tab rather than navigating within the panel. This is acceptable for v1; we will not rewrite third‑party link targets.

### 7) Technical Approach (Minimum, Compliant)
- Manifest V3 with `side_panel.default_path` set to a local extension page (e.g., `panel.html`).
- Use `chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })` in the service worker so clicking the toolbar icon opens the panel.
- `panel.html` contains a full‑height `<iframe src="https://cantina.com/explore">`.
- No storage, no background timers, no content scripts.
- No host permissions are strictly required to view an external site in an iframe.

Permissions (initial):
- `sidePanel`

Files (initial):
- `manifest.json`
- `background.js` (service worker)
- `panel.html` (iframe wrapper)

### 8) Constraints and Risks
- Embedding policy: External sites can restrict embedding via headers like `X-Frame-Options` or CSP `frame-ancestors`. If enforced, the site won’t render in an iframe.
  - Current check of response headers for `https://cantina.com/explore` returned 200 with no `X-Frame-Options` or `Content-Security-Policy` headers at time of drafting, suggesting embedding may work. This can change at any time by the site owner.
- Chrome Web Store policies: Using rules or proxies to strip CSP/XFO to force embedding is not compliant. We will not do that.
- Link targets: Some links may deliberately open in new tabs. We won’t override third‑party UX.

Mitigations (if future embedding breaks):
- As a compliant fallback, the extension can show a lightweight help state in the side panel with a button to open Cantina in a new tab. This preserves policy compliance without header tampering. Not in v1 scope unless needed.

### 9) Security & Privacy
- No data collection, no storage, no telemetry
- No content script injection, no DOM scraping
- All interaction is user‑initiated, standard browser copy

### 10) Performance
- Iframe load is bounded by Cantina’s site performance
- No background work when panel closed

### 11) Minimal Implementation Notes

manifest.json (excerpt):

```json
{
  "manifest_version": 3,
  "name": "Cantina Chatbot Explorer",
  "version": "1.0.0",
  "description": "Open Cantina's chatbot directory in Chrome's side panel.",
  "permissions": ["sidePanel"],
  "background": { "service_worker": "background.js" },
  "side_panel": { "default_path": "panel.html" },
  "action": { "default_title": "Open Cantina Chatbot Explorer" }
}
```

background.js (excerpt):

```js
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
```

panel.html (excerpt):

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Cantina – Chatbot Explorer</title>
    <style>
      html, body { height: 100%; margin: 0; }
      iframe { width: 100%; height: 100%; border: 0; }
    </style>
  </head>
  <body>
    <iframe src="https://cantina.com/explore" allow="clipboard-write"></iframe>
  </body>
  </html>
```

### 12) Testing Checklist
- Side panel opens via toolbar icon
- Explore page loads and is interactive
- Search works; results pages open in‑panel when possible
- Links that open new tabs do not break current page state
- Copy text/images works via standard user actions

### 13) Rollout
- Load unpacked for internal use (Developer Mode)
- If publishing, package and submit to Chrome Web Store (no extra permissions requested)

### 14) References
- Chrome Extensions: Create a side panel – developer guide: [developer.chrome.com – Create a side panel](https://developer.chrome.com/docs/extensions/develop/ui/create-a-side-panel)
- Blog: Side Panel launch & UX guidance: [developer.chrome.com – Side Panel launch](https://developer.chrome.com/blog/extension-side-panel-launch)
- Chrome Extensions MV3 overview: [developer.chrome.com – Manifest V3](https://developer.chrome.com/docs/extensions)
- Target site: [Cantina Explore](https://cantina.com/explore)


