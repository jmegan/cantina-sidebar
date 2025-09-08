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
  // Clear existing dynamic rules
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    const ruleIds = rules.map(rule => rule.id);
    if (ruleIds.length > 0) {
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
      });
    }
  });

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

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules
    });
    console.log('Dynamic rules for header modification added successfully');
  } catch (error) {
    console.error('Failed to add dynamic rules:', error);
  }
}

// Optional: Handle any runtime messages if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkStatus') {
    sendResponse({ status: 'active' });
  }
  
  // Handle navigation requests from the panel
  if (request.action === 'navigate' && request.url) {
    // This could be used for future enhancements
    console.log('Navigation requested to:', request.url);
  }
  
  return true; // Keep message channel open for async response
});