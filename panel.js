// Panel JavaScript for Cantina Chatbot Explorer
// Handles iframe loading, navigation, and URL tracking

(function() {
    'use strict';

    // Configuration
    const CANTINA_BASE_URL = 'https://cantina.com';
    const CANTINA_EXPLORE_URL = `${CANTINA_BASE_URL}/explore`;
    const CANTINA_FEED_URL = `${CANTINA_BASE_URL}/homefeed`;
    const CANTINA_HOME_URL = CANTINA_BASE_URL;
    const LOAD_TIMEOUT = 15000; // 15 seconds timeout

    // DOM Elements
    const elements = {
        loadingContainer: null,
        mainContainer: null,
        errorContainer: null,
        iframe: null,
        refreshBtn: null,
        retryBtn: null,
        exploreBtn: null,
        feedBtn: null,
        homeBtn: null,
        currentUrlDisplay: null,
        copyUrlBtn: null,
        incognitoBtn: null
    };

    // State
    let loadTimer = null;
    let isLoaded = false;
    let currentUrl = CANTINA_EXPLORE_URL;
    let navigationHistory = [CANTINA_EXPLORE_URL];
    let historyIndex = 0;

    /**
     * Initialize the panel
     */
    function init() {
        // Cache DOM elements
        elements.loadingContainer = document.getElementById('loading-container');
        elements.mainContainer = document.getElementById('main-container');
        elements.errorContainer = document.getElementById('error-container');
        elements.iframe = document.getElementById('cantina-frame');
        elements.refreshBtn = document.getElementById('refresh-btn');
        elements.retryBtn = document.getElementById('retry-btn');
        elements.exploreBtn = document.getElementById('explore-btn');
        elements.feedBtn = document.getElementById('feed-btn');
        elements.homeBtn = document.getElementById('home-btn');
        elements.currentUrlDisplay = document.getElementById('current-url');
        elements.copyUrlBtn = document.getElementById('copy-url-btn');
        elements.incognitoBtn = document.getElementById('incognito-btn');

        // Set up event listeners
        setupEventListeners();

        // Start loading
        loadCantina(CANTINA_EXPLORE_URL);
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Iframe load events
        if (elements.iframe) {
            elements.iframe.addEventListener('load', handleIframeLoad);
            elements.iframe.addEventListener('error', handleIframeError);
        }

        // Navigation buttons
        if (elements.exploreBtn) {
            elements.exploreBtn.addEventListener('click', handleExplore);
        }

        if (elements.feedBtn) {
            elements.feedBtn.addEventListener('click', handleFeed);
        }

        if (elements.homeBtn) {
            elements.homeBtn.addEventListener('click', handleHome);
        }

        if (elements.refreshBtn) {
            elements.refreshBtn.addEventListener('click', handleRefresh);
        }

        if (elements.retryBtn) {
            elements.retryBtn.addEventListener('click', handleRetry);
        }

        if (elements.copyUrlBtn) {
            elements.copyUrlBtn.addEventListener('click', handleCopyUrl);
        }

        // Incognito button
        if (elements.incognitoBtn) {
            elements.incognitoBtn.addEventListener('click', handleIncognitoClick);
        }

        // Handle messages from iframe (if the site supports it)
        window.addEventListener('message', handleMessage);

        // Try to detect navigation within iframe (limited by cross-origin policy)
        setupNavigationDetection();
    }

    /**
     * Set up navigation detection for the iframe
     */
    function setupNavigationDetection() {
        // Monitor for navigation changes
        // Note: Due to cross-origin restrictions, we can't directly access iframe.contentWindow.location
        // We'll track navigation through our own controls

        if (elements.iframe) {
            // Listen for iframe load events to detect navigation
            let lastSrc = elements.iframe.src;
            
            // Check periodically if the iframe has navigated (workaround for cross-origin)
            setInterval(() => {
                try {
                    // This will fail for cross-origin, but we can still try
                    const currentSrc = elements.iframe.src;
                    if (currentSrc !== lastSrc) {
                        lastSrc = currentSrc;
                        handleNavigationChange(currentSrc);
                    }
                } catch (e) {
                    // Expected for cross-origin
                }
            }, 1000);
        }
    }

    /**
     * Load a URL in the iframe
     */
    function loadCantina(url) {
        showLoading();
        isLoaded = false;

        // Clear previous timeout
        if (loadTimer) {
            clearTimeout(loadTimer);
        }

        // Set a timeout for loading
        loadTimer = setTimeout(() => {
            if (!isLoaded) {
                handleLoadTimeout();
            }
        }, LOAD_TIMEOUT);

        // Load the URL
        if (elements.iframe) {
            elements.iframe.src = url;
            currentUrl = url;
            updateUrlDisplay(url);
        }
    }

    /**
     * Handle successful iframe load
     */
    function handleIframeLoad() {
        clearTimeout(loadTimer);
        isLoaded = true;

        // Try to get the actual URL (may fail due to cross-origin)
        try {
            const iframeUrl = elements.iframe.contentWindow.location.href;
            if (iframeUrl && iframeUrl !== currentUrl) {
                handleNavigationChange(iframeUrl);
            }
        } catch (e) {
            // Cross-origin access denied - this is expected
            console.log('Iframe loaded (cross-origin restrictions apply)');
        }

        showMain();
    }

    /**
     * Handle navigation change within iframe
     */
    function handleNavigationChange(newUrl) {
        // Only track Cantina URLs
        if (newUrl.startsWith(CANTINA_BASE_URL)) {
            currentUrl = newUrl;
            updateUrlDisplay(newUrl);

            // Update history
            if (historyIndex < navigationHistory.length - 1) {
                // Remove forward history if navigating from middle of history
                navigationHistory = navigationHistory.slice(0, historyIndex + 1);
            }

            // Add to history if it's different from the last entry
            if (navigationHistory[navigationHistory.length - 1] !== newUrl) {
                navigationHistory.push(newUrl);
                historyIndex = navigationHistory.length - 1;
            }
        }
    }

    /**
     * Update URL display
     */
    function updateUrlDisplay(url) {
        if (elements.currentUrlDisplay) {
            // Remove protocol and show just the path
            const displayUrl = url.replace('https://', '').replace('http://', '');
            elements.currentUrlDisplay.textContent = displayUrl;
        }
    }


    /**
     * Handle explore navigation
     */
    function handleExplore(event) {
        event.preventDefault();
        console.log('Navigating to Explore page');
        loadCantina(CANTINA_EXPLORE_URL);
    }

    /**
     * Handle feed navigation
     */
    function handleFeed(event) {
        event.preventDefault();
        console.log('Navigating to Feed page');
        loadCantina(CANTINA_FEED_URL);
    }

    /**
     * Handle home navigation
     */
    function handleHome(event) {
        event.preventDefault();
        console.log('Navigating to Home page');
        loadCantina(CANTINA_HOME_URL);
    }

    /**
     * Handle refresh button click
     */
    function handleRefresh(event) {
        event.preventDefault();
        
        // Add rotation animation
        elements.refreshBtn.style.animation = 'spin 0.5s ease-in-out';
        setTimeout(() => {
            elements.refreshBtn.style.animation = '';
        }, 500);

        // Reload current URL
        loadCantina(currentUrl);
    }

    /**
     * Handle retry button click
     */
    function handleRetry(event) {
        event.preventDefault();
        loadCantina(currentUrl);
    }

    /**
     * Handle copy URL button click
     */
    function handleCopyUrl(event) {
        event.preventDefault();
        
        navigator.clipboard.writeText(currentUrl).then(() => {
            // Show success feedback
            elements.copyUrlBtn.classList.add('copied');
            
            // Remove the class after animation
            setTimeout(() => {
                elements.copyUrlBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy URL:', err);
        });
    }

    /**
     * Handle incognito button click
     */
    function handleIncognitoClick(event) {
        event.preventDefault();
        
        // Open current URL in incognito window
        chrome.runtime.sendMessage({
            action: 'openIncognito',
            url: currentUrl
        }, (response) => {
            if (response && response.success) {
                console.log('Opened in incognito window');
                // Show a notification or feedback
                showIncognitoNotification();
            } else {
                console.error('Failed to open in incognito:', response?.error);
                alert('Failed to open in incognito mode. Please make sure incognito mode is enabled in Chrome.');
            }
        });
    }

    /**
     * Show incognito notification
     */
    function showIncognitoNotification() {
        // Create a temporary notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-size: 14px;
        `;
        notification.textContent = 'Opened in incognito window';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Handle iframe load error
     */
    function handleIframeError(error) {
        clearTimeout(loadTimer);
        console.error('Failed to load Cantina:', error);
        showError('Failed to load Cantina. The site may be temporarily unavailable.');
    }

    /**
     * Handle load timeout
     */
    function handleLoadTimeout() {
        console.warn('Loading Cantina timed out');
        
        // Check if we're online
        if (!navigator.onLine) {
            showError('No internet connection. Please check your network and try again.');
        } else {
            showError('Loading took too long. The site may be slow or unavailable.');
        }
    }

    /**
     * Handle messages from iframe (for future enhancements)
     */
    function handleMessage(event) {
        // Only accept messages from Cantina domain
        if (!event.origin.startsWith(CANTINA_BASE_URL)) {
            return;
        }

        // Handle navigation messages if the site implements them
        if (event.data && event.data.type === 'navigation') {
            if (event.data.url) {
                handleNavigationChange(event.data.url);
            }
        }
    }

    /**
     * Show loading state
     */
    function showLoading() {
        elements.loadingContainer.classList.remove('hidden');
        elements.mainContainer.classList.add('hidden');
        elements.errorContainer.classList.add('hidden');
    }

    /**
     * Show main content
     */
    function showMain() {
        elements.loadingContainer.classList.add('hidden');
        elements.mainContainer.classList.remove('hidden');
        elements.errorContainer.classList.add('hidden');
    }

    /**
     * Show error state
     */
    function showError(message) {
        elements.loadingContainer.classList.add('hidden');
        elements.mainContainer.classList.add('hidden');
        elements.errorContainer.classList.remove('hidden');

        // Update error message if provided
        if (message) {
            const errorMessageEl = document.querySelector('.error-message');
            if (errorMessageEl) {
                errorMessageEl.textContent = message;
            }
        }
    }

    /**
     * Handle visibility change (when panel is shown/hidden)
     */
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible' && !isLoaded) {
            // Reload if the panel becomes visible and content isn't loaded
            loadCantina(currentUrl);
        }
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();