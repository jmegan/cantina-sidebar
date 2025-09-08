// Service worker for Cantina Chatbot Explorer
// Handles side panel behavior and extension lifecycle

// When the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Configure the side panel to open when the extension icon is clicked
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error('Failed to set panel behavior:', error));
  
  console.log('Cantina Chatbot Explorer installed/updated successfully');
});

// Optional: Handle any runtime messages if needed in the future
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkStatus') {
    sendResponse({ status: 'active' });
  }
});