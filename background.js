// Service worker for Cantina Chatbot Explorer
// Handles side panel behavior and header modification for iframe embedding

// Configuration
const ALLOWED_DOMAINS = ['cantina.com', 'www.cantina.com'];
const ALLOWED_PATHS = ['/explore', '/homefeed', '/'];

// Helper function to validate Cantina URLs
function isValidCantinaUrl(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        const isValidDomain = ALLOWED_DOMAINS.some(domain => 
            hostname === domain || hostname.endsWith('.' + domain)
        );
        
        // Optional: Check if path is allowed
        // const isValidPath = ALLOWED_PATHS.some(path => 
        //     urlObj.pathname === path || urlObj.pathname.startsWith(path)
        // );
        
        return isValidDomain;
    } catch (e) {
        console.error('Invalid URL:', e);
        return false;
    }
}

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

    // Add new dynamic rules for Cantina domain with more restrictive conditions
    const rules = [
      {
        id: 1001,
        priority: 1,
        action: {
          type: "modifyHeaders",
          responseHeaders: [
            { header: "x-frame-options", operation: "remove" },
            { header: "X-Frame-Options", operation: "remove" }
            // Note: Removing CSP is a security risk, only do if absolutely necessary
            // Consider using a more specific CSP instead
          ]
        },
        condition: {
          // More specific URL patterns for better security
          urlFilter: "||cantina.com/explore*",
          resourceTypes: ["sub_frame"]
        }
      },
      {
        id: 1002,
        priority: 1,
        action: {
          type: "modifyHeaders",
          responseHeaders: [
            { header: "x-frame-options", operation: "remove" },
            { header: "X-Frame-Options", operation: "remove" }
          ]
        },
        condition: {
          urlFilter: "||cantina.com/homefeed*",
          resourceTypes: ["sub_frame"]
        }
      },
      {
        id: 1003,
        priority: 1,
        action: {
          type: "modifyHeaders",
          responseHeaders: [
            { header: "x-frame-options", operation: "remove" },
            { header: "X-Frame-Options", operation: "remove" }
          ]
        },
        condition: {
          urlFilter: "||cantina.com/",
          resourceTypes: ["sub_frame"]
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
  // Validate sender (should be from our extension)
  if (sender.id !== chrome.runtime.id) {
    console.warn('Message from unknown sender:', sender);
    sendResponse({ success: false, error: 'Unknown sender' });
    return false;
  }
  
  if (request.action === 'checkStatus') {
    sendResponse({ status: 'active' });
    return true;
  }
  
  // Handle navigation requests from the panel
  if (request.action === 'navigate' && request.url) {
    // Validate URL before processing
    if (!isValidCantinaUrl(request.url)) {
      console.error('Invalid navigation URL:', request.url);
      sendResponse({ success: false, error: 'Invalid URL' });
      return false;
    }
    console.log('Navigation requested to:', request.url);
    sendResponse({ success: true });
    return true;
  }
  
  // Handle incognito window creation
  if (request.action === 'openIncognito' && request.url) {
    // Validate URL before opening
    if (!isValidCantinaUrl(request.url)) {
      console.error('Invalid incognito URL:', request.url);
      sendResponse({ success: false, error: 'Invalid URL' });
      return false;
    }
    
    // Check if incognito is allowed
    chrome.extension.isAllowedIncognitoAccess((isAllowed) => {
      if (!isAllowed) {
        sendResponse({ success: false, error: 'Incognito access not allowed' });
        return;
      }
      
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
    });
    return true; // Keep message channel open for async response
  }
  
  return false;
});