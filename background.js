// Service worker for Cantina Chatbot Explorer
// Handles side panel behavior and header modification for iframe embedding

// Debug flag - set to false for production
const DEBUG = false;
const log = DEBUG ? console.log.bind(console) : () => {};
const error = DEBUG ? console.error.bind(console) : () => {};

// When the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Configure the side panel to open when the extension icon is clicked
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((err) => error('Failed to set panel behavior:', err));
  }
  
  log('Cantina Chatbot Explorer installed/updated successfully');
});

// Handle runtime messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Validate sender (should be from our extension)
  if (sender.id !== chrome.runtime.id) {
    sendResponse({ success: false, error: 'Unknown sender' });
    return false;
  }
  
  if (request.action === 'checkStatus') {
    sendResponse({ status: 'active' });
    return true;
  }
  
  return false;
});