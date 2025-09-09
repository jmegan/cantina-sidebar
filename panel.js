// Panel JavaScript for Cantina Chatbot Explorer
// Handles iframe loading, navigation, and URL tracking

(function() {
    'use strict';

    // Debug flag - set to false for production
    const DEBUG = false;
    const log = DEBUG ? console.log.bind(console) : () => {};
    const error = DEBUG ? console.error.bind(console) : () => {};
    const warn = DEBUG ? console.warn.bind(console) : () => {};

    // Configuration
    const CANTINA_BASE_URL = 'https://cantina.com';
    const CANTINA_EXPLORE_URL = `${CANTINA_BASE_URL}/explore`;
    const CANTINA_FEED_URL = `${CANTINA_BASE_URL}/homefeed`;
    const CANTINA_HOME_URL = CANTINA_BASE_URL;
    const LOAD_TIMEOUT = 15000; // 15 seconds timeout
    const POLL_INTERVAL = 1000; // 1 second polling interval
    const ALLOWED_DOMAINS = ['cantina.com', 'www.cantina.com'];
    const MAX_RETRY_ATTEMPTS = 3;
    const RETRY_DELAY_BASE = 1000; // Base delay for exponential backoff
    
    // Zoom Configuration
    const ZOOM_MIN = 0.5; // 50%
    const ZOOM_MAX = 2.0; // 200%
    const ZOOM_STEP = 0.1; // 10% increments
    const ZOOM_DEFAULT = 1.0; // 100%
    const ZOOM_STORAGE_KEY = 'cantina_zoom_level';

    // DOM Elements
    const elements = {
        loadingContainer: null,
        mainContainer: null,
        errorContainer: null,
        iframe: null,
        iframeWrapper: null,
        refreshBtn: null,
        retryBtn: null,
        exploreBtn: null,
        feedBtn: null,
        homeBtn: null,
        currentUrlDisplay: null,
        copyUrlBtn: null,
        zoomInBtn: null,
        zoomOutBtn: null,
        zoomResetBtn: null,
        zoomLevelDisplay: null
    };

    // State
    let loadTimer = null;
    let isLoaded = false;
    let currentUrl = CANTINA_EXPLORE_URL;
    let navigationHistory = [CANTINA_EXPLORE_URL];
    let historyIndex = 0;
    let pollIntervalId = null;
    let retryAttempts = 0;
    let pendingNavigation = false;
    let currentZoom = ZOOM_DEFAULT;

    /**
     * URL validation helper
     */
    function isValidCantinaUrl(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            return ALLOWED_DOMAINS.some(domain => 
                hostname === domain || hostname.endsWith('.' + domain)
            );
        } catch (e) {
            error('Invalid URL:', e);
            return false;
        }
    }

    /**
     * Sanitize URL for display
     */
    function sanitizeUrlForDisplay(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname + urlObj.pathname + urlObj.search;
        } catch (e) {
            return 'cantina.com';
        }
    }

    /**
     * HTML escape helper
     */
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Initialize the panel
     */
    function init() {
        // Cache DOM elements
        elements.loadingContainer = document.getElementById('loading-container');
        elements.mainContainer = document.getElementById('main-container');
        elements.errorContainer = document.getElementById('error-container');
        elements.iframe = document.getElementById('cantina-frame');
        elements.iframeWrapper = document.getElementById('iframe-wrapper');
        elements.refreshBtn = document.getElementById('refresh-btn');
        elements.retryBtn = document.getElementById('retry-btn');
        elements.exploreBtn = document.getElementById('explore-btn');
        elements.feedBtn = document.getElementById('feed-btn');
        elements.homeBtn = document.getElementById('home-btn');
        elements.currentUrlDisplay = document.getElementById('current-url');
        elements.copyUrlBtn = document.getElementById('copy-url-btn');
        elements.zoomInBtn = document.getElementById('zoom-in-btn');
        elements.zoomOutBtn = document.getElementById('zoom-out-btn');
        elements.zoomResetBtn = document.getElementById('zoom-reset-btn');
        elements.zoomLevelDisplay = document.querySelector('.zoom-level');

        // Set up event listeners
        setupEventListeners();
        
        // Load saved zoom level
        loadZoomLevel();

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
        
        // Zoom controls
        if (elements.zoomInBtn) {
            elements.zoomInBtn.addEventListener('click', handleZoomIn);
        }
        
        if (elements.zoomOutBtn) {
            elements.zoomOutBtn.addEventListener('click', handleZoomOut);
        }
        
        if (elements.zoomResetBtn) {
            elements.zoomResetBtn.addEventListener('click', handleZoomReset);
        }

        // Handle messages from iframe (if the site supports it)
        window.addEventListener('message', handleMessage);
        
        // Handle keyboard shortcuts for zoom
        document.addEventListener('keydown', handleKeyboardShortcuts);

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
            
            // Clear any existing interval
            if (pollIntervalId) {
                clearInterval(pollIntervalId);
                pollIntervalId = null;
            }
            
            // Check periodically if the iframe has navigated (workaround for cross-origin)
            pollIntervalId = setInterval(() => {
                try {
                    // This will fail for cross-origin, but we can still try
                    const currentSrc = elements.iframe.src;
                    if (currentSrc !== lastSrc) {
                        lastSrc = currentSrc;
                        if (isValidCantinaUrl(currentSrc)) {
                            handleNavigationChange(currentSrc);
                        }
                    }
                } catch (e) {
                    // Expected for cross-origin
                }
            }, POLL_INTERVAL);
        }
    }

    /**
     * Load a URL in the iframe
     */
    function loadCantina(url) {
        // Validate URL before loading
        if (!isValidCantinaUrl(url)) {
            error('Invalid Cantina URL:', url);
            showError('Invalid URL. Only Cantina URLs are allowed.');
            return;
        }

        // Prevent concurrent navigations
        if (pendingNavigation) {
            log('Navigation already in progress');
            return;
        }

        pendingNavigation = true;
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
        pendingNavigation = false;
        retryAttempts = 0; // Reset retry counter on successful load

        // Try to get the actual URL (may fail due to cross-origin)
        try {
            const iframeUrl = elements.iframe.contentWindow.location.href;
            if (iframeUrl && iframeUrl !== currentUrl && isValidCantinaUrl(iframeUrl)) {
                handleNavigationChange(iframeUrl);
            }
        } catch (e) {
            // Cross-origin access denied - this is expected
            log('Iframe loaded (cross-origin restrictions apply)');
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
            // Sanitize and display URL safely
            const displayUrl = sanitizeUrlForDisplay(url);
            elements.currentUrlDisplay.textContent = displayUrl;
        }
    }


    /**
     * Handle explore navigation
     */
    function handleExplore(event) {
        event.preventDefault();
        log('Navigating to Explore page');
        loadCantina(CANTINA_EXPLORE_URL);
    }

    /**
     * Handle feed navigation
     */
    function handleFeed(event) {
        event.preventDefault();
        log('Navigating to Feed page');
        loadCantina(CANTINA_FEED_URL);
    }

    /**
     * Handle home navigation
     */
    function handleHome(event) {
        event.preventDefault();
        log('Navigating to Home page');
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
     * Zoom control functions
     */
    function handleZoomIn(event) {
        event.preventDefault();
        const newZoom = Math.min(currentZoom + ZOOM_STEP, ZOOM_MAX);
        setZoomLevel(newZoom);
    }
    
    function handleZoomOut(event) {
        event.preventDefault();
        const newZoom = Math.max(currentZoom - ZOOM_STEP, ZOOM_MIN);
        setZoomLevel(newZoom);
    }
    
    function handleZoomReset(event) {
        event.preventDefault();
        setZoomLevel(ZOOM_DEFAULT);
    }
    
    function setZoomLevel(zoomLevel) {
        currentZoom = zoomLevel;
        
        // Apply zoom to iframe wrapper
        if (elements.iframeWrapper) {
            elements.iframeWrapper.style.setProperty('--zoom-scale', zoomLevel);
            
            // Set data attribute for CSS adjustments
            if (zoomLevel !== 1) {
                elements.iframeWrapper.setAttribute('data-zoom', 'true');
            } else {
                elements.iframeWrapper.removeAttribute('data-zoom');
            }
        }
        
        // Update zoom display
        if (elements.zoomLevelDisplay) {
            const percentage = Math.round(zoomLevel * 100);
            elements.zoomLevelDisplay.textContent = `${percentage}%`;
        }
        
        // Save zoom level
        saveZoomLevel(zoomLevel);
        
        // Update button states
        updateZoomButtonStates();
    }
    
    function updateZoomButtonStates() {
        // Disable zoom out at minimum
        if (elements.zoomOutBtn) {
            elements.zoomOutBtn.disabled = currentZoom <= ZOOM_MIN;
        }
        
        // Disable zoom in at maximum
        if (elements.zoomInBtn) {
            elements.zoomInBtn.disabled = currentZoom >= ZOOM_MAX;
        }
        
        // Show reset button as active when not at default
        if (elements.zoomResetBtn) {
            if (currentZoom !== ZOOM_DEFAULT) {
                elements.zoomResetBtn.classList.add('active');
            } else {
                elements.zoomResetBtn.classList.remove('active');
            }
        }
    }
    
    function saveZoomLevel(zoomLevel) {
        try {
            localStorage.setItem(ZOOM_STORAGE_KEY, zoomLevel.toString());
        } catch (e) {
            error('Failed to save zoom level:', e);
        }
    }
    
    function loadZoomLevel() {
        try {
            const savedZoom = localStorage.getItem(ZOOM_STORAGE_KEY);
            if (savedZoom) {
                const zoomLevel = parseFloat(savedZoom);
                if (!isNaN(zoomLevel) && zoomLevel >= ZOOM_MIN && zoomLevel <= ZOOM_MAX) {
                    setZoomLevel(zoomLevel);
                    return;
                }
            }
        } catch (e) {
            error('Failed to load zoom level:', e);
        }
        
        // Set default zoom if no saved value
        setZoomLevel(ZOOM_DEFAULT);
    }
    
    function handleKeyboardShortcuts(event) {
        // Check for Ctrl/Cmd + Plus/Minus/0
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case '+':
                case '=': // Plus key without shift
                    event.preventDefault();
                    handleZoomIn(event);
                    break;
                case '-':
                    event.preventDefault();
                    handleZoomOut(event);
                    break;
                case '0':
                    event.preventDefault();
                    handleZoomReset(event);
                    break;
            }
        }
    }

    /**
     * Handle copy URL button click
     */
    function handleCopyUrl(event) {
        event.preventDefault();
        
        // Only copy valid Cantina URLs
        if (!isValidCantinaUrl(currentUrl)) {
            error('Cannot copy invalid URL');
            return;
        }
        
        // Check if clipboard API is available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(currentUrl).then(() => {
                // Show success feedback
                elements.copyUrlBtn.classList.add('copied');
                
                // Remove the class after animation
                setTimeout(() => {
                    elements.copyUrlBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                error('Failed to copy URL:', err);
                // Fallback to older method
                fallbackCopyToClipboard(currentUrl);
            });
        } else {
            // Use fallback method for older browsers
            fallbackCopyToClipboard(currentUrl);
        }
    }
    
    /**
     * Fallback copy to clipboard for older browsers
     */
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            elements.copyUrlBtn.classList.add('copied');
            setTimeout(() => {
                elements.copyUrlBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            error('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
    }


    /**
     * Handle iframe load error
     */
    function handleIframeError(err) {
        clearTimeout(loadTimer);
        error('Failed to load Cantina:', err);
        showError('Failed to load Cantina. The site may be temporarily unavailable.');
    }

    /**
     * Handle load timeout
     */
    function handleLoadTimeout() {
        warn('Loading Cantina timed out');
        pendingNavigation = false;
        
        // Check if we're online
        if (!navigator.onLine) {
            showError('No internet connection. Please check your network and try again.');
        } else if (retryAttempts < MAX_RETRY_ATTEMPTS) {
            // Implement exponential backoff retry
            retryAttempts++;
            const retryDelay = RETRY_DELAY_BASE * Math.pow(2, retryAttempts - 1);
            log(`Retrying in ${retryDelay}ms (attempt ${retryAttempts}/${MAX_RETRY_ATTEMPTS})`);
            
            setTimeout(() => {
                loadCantina(currentUrl);
            }, retryDelay);
        } else {
            showError('Loading took too long. The site may be slow or unavailable.');
            retryAttempts = 0; // Reset for next attempt
        }
    }

    /**
     * Handle messages from iframe (for future enhancements)
     */
    function handleMessage(event) {
        // Validate origin
        try {
            const origin = new URL(event.origin);
            if (!ALLOWED_DOMAINS.includes(origin.hostname)) {
                warn('Rejected message from untrusted origin:', event.origin);
                return;
            }
        } catch (e) {
            error('Invalid origin:', event.origin);
            return;
        }

        // Validate message data
        if (!event.data || typeof event.data !== 'object') {
            return;
        }

        // Handle navigation messages if the site implements them
        if (event.data.type === 'navigation' && event.data.url) {
            if (isValidCantinaUrl(event.data.url)) {
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

    /**
     * Clean up resources
     */
    function cleanup() {
        // Clear timers
        if (loadTimer) {
            clearTimeout(loadTimer);
            loadTimer = null;
        }
        
        if (pollIntervalId) {
            clearInterval(pollIntervalId);
            pollIntervalId = null;
        }
        
        // Remove event listeners
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('message', handleMessage);
        document.removeEventListener('keydown', handleKeyboardShortcuts);
        
        // Clean up iframe listeners
        if (elements.iframe) {
            elements.iframe.removeEventListener('load', handleIframeLoad);
            elements.iframe.removeEventListener('error', handleIframeError);
        }
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up on unload
    window.addEventListener('unload', cleanup);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();