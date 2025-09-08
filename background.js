// Service worker for Cantina Chatbot Explorer
// Handles side panel behavior and header modification for iframe embedding

// When the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Configure the side panel to open when the extension icon is clicked
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error('Failed to set panel behavior:', error));
  
  console.log('Cantina Chatbot Explorer installed/updated successfully');
  
  // Set up dynamic rules as a fallback if static rules don't work
  setupDynamicRules();
});

// Set up dynamic header modification rules
async function setupDynamicRules() {
  try {
    // First, get existing dynamic rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);
    
    // Clear existing dynamic rules if any
    if (existingRuleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds
      });
      console.log('Cleared existing dynamic rules:', existingRuleIds);
    }

    // Add new dynamic rules for Cantina domain
    const rules = [
      {
        id: 1001,
        priority: 1,
        action: {
          type: "modifyHeaders",
          responseHeaders: [
            { header: "x-frame-options", operation: "remove" },
            { header: "content-security-policy", operation: "remove" },
            { header: "X-Frame-Options", operation: "remove" },
            { header: "Content-Security-Policy", operation: "remove" }
          ]
        },
        condition: {
          urlFilter: "*cantina.com*",
          resourceTypes: ["sub_frame", "main_frame", "xmlhttprequest", "other"]
        }
      }
    ];

    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules
    });
    
    console.log('Dynamic rules for header modification added successfully');
  } catch (error) {
    console.error('Failed to set up dynamic rules:', error);
  }
}

// Handle runtime messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkStatus') {
    sendResponse({ status: 'active' });
    return true;
  }
  
  // Handle navigation requests from the panel
  if (request.action === 'navigate' && request.url) {
    console.log('Navigation requested to:', request.url);
    return true;
  }
  
  // Handle incognito window creation
  if (request.action === 'openIncognito' && request.url) {
    chrome.windows.create({
      url: request.url,
      incognito: true
    }, (window) => {
      if (chrome.runtime.lastError) {
        console.error('Failed to create incognito window:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log('Incognito window created for:', request.url);
        sendResponse({ success: true, windowId: window.id });
      }
    });
    return true; // Keep message channel open for async response
  }
  
  return false;
});