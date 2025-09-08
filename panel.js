// Panel JavaScript for Cantina Chatbot Explorer
// Handles iframe loading, error states, and user interactions

(function() {
    'use strict';

    // Configuration
    const CANTINA_URL = 'https://cantina.com/explore';
    const LOAD_TIMEOUT = 15000; // 15 seconds timeout

    // DOM Elements
    const elements = {
        loadingContainer: null,
        mainContainer: null,
        errorContainer: null,
        iframe: null,
        refreshBtn: null,
        retryBtn: null
    };

    // State
    let loadTimer = null;
    let isLoaded = false;

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

        // Set up event listeners
        setupEventListeners();

        // Start loading
        loadCantina();
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

        // Button clicks
        if (elements.refreshBtn) {
            elements.refreshBtn.addEventListener('click', handleRefresh);
        }

        if (elements.retryBtn) {
            elements.retryBtn.addEventListener('click', handleRetry);
        }

        // Handle messages from iframe (if needed in future)
        window.addEventListener('message', handleMessage);
    }

    /**
     * Load Cantina in the iframe
     */
    function loadCantina() {
        showLoading();
        isLoaded = false;

        // Set a timeout for loading
        loadTimer = setTimeout(() => {
            if (!isLoaded) {
                handleLoadTimeout();
            }
        }, LOAD_TIMEOUT);

        // Set/reset the iframe source
        if (elements.iframe) {
            elements.iframe.src = CANTINA_URL;
        }
    }

    /**
     * Handle successful iframe load
     */
    function handleIframeLoad() {
        clearTimeout(loadTimer);
        isLoaded = true;

        // Check if the iframe actually loaded content
        try {
            // Try to access iframe content (will fail for cross-origin)
            // This is expected to fail, but we can still show the content
            const iframeDoc = elements.iframe.contentDocument || elements.iframe.contentWindow.document;
        } catch (e) {
            // Cross-origin access denied is expected
            console.log('Cantina loaded successfully (cross-origin)');
        }

        showMain();
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
     * Handle refresh button click
     */
    function handleRefresh(event) {
        event.preventDefault();
        
        // Add rotation animation
        elements.refreshBtn.style.animation = 'spin 0.5s ease-in-out';
        setTimeout(() => {
            elements.refreshBtn.style.animation = '';
        }, 500);

        loadCantina();
    }

    /**
     * Handle retry button click
     */
    function handleRetry(event) {
        event.preventDefault();
        loadCantina();
    }

    /**
     * Handle messages from iframe (for future enhancements)
     */
    function handleMessage(event) {
        // Verify origin if implementing message passing
        if (event.origin !== 'https://cantina.com') {
            return;
        }

        // Handle specific messages if needed
        console.log('Message from Cantina:', event.data);
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
     * Check for CSP or X-Frame-Options issues
     */
    function checkEmbeddingSupport() {
        // This is a heuristic check - actual embedding will be tested when iframe loads
        fetch(CANTINA_URL, { method: 'HEAD', mode: 'no-cors' })
            .then(() => {
                console.log('Cantina site is reachable');
            })
            .catch(error => {
                console.warn('Could not reach Cantina site:', error);
            });
    }

    /**
     * Handle visibility change (when panel is shown/hidden)
     */
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible' && !isLoaded) {
            // Reload if the panel becomes visible and content isn't loaded
            loadCantina();
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

    // Perform initial embedding support check
    checkEmbeddingSupport();

})();