/**
 * Event Logger MVP - Client-side logging application
 * Stores configuration in localStorage and sends events to Google Apps Script
 */

/**
 * Generate or retrieve a stable pseudo user ID from localStorage
 * @returns {string} A stable UUID-like identifier for the user
 */
function getUserId() {
    const STORAGE_KEY = 'uid';
    let uid = localStorage.getItem(STORAGE_KEY);
    
    if (!uid) {
        uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        localStorage.setItem(STORAGE_KEY, uid);
    }
    
    return uid;
}

/**
 * Display a status message with appropriate styling
 * @param {string} message - The status message to display
 * @param {boolean} isError - Whether this is an error message
 */
function showStatus(message, isError = false) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = isError ? 'error' : 'success';
    
    // Auto-clear after 3 seconds
    setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = '';
    }, 3000);
}

/**
 * Save the Google Apps Script URL to localStorage
 */
function saveUrl() {
    const urlInput = document.getElementById('gasUrl');
    const url = urlInput.value.trim();
    
    if (!url) {
        showStatus('Please enter a URL', true);
        return;
    }
    
    if (!url.endsWith('/exec')) {
        showStatus('URL must end with /exec', true);
        return;
    }
    
    try {
        new URL(url); // Validate URL format
        localStorage.setItem('gas_url', url);
        showStatus('URL saved successfully');
    } catch {
        showStatus('Invalid URL format', true);
    }
}

/**
 * Send event data to Google Apps Script using CORS-simple request
 * @param {Object} payload - Event data to send
 * @param {string} payload.event - Event type (e.g., 'cta_click', 'heartbeat')
 * @param {string} payload.variant - Variant identifier (e.g., 'A', 'B')
 * @param {string} payload.userId - User identifier
 * @param {number} payload.ts - Unix timestamp in milliseconds
 * @param {Object} payload.meta - Additional metadata object
 */
async function sendLogSimple(payload) {
    const gasUrl = localStorage.getItem('gas_url');
    
    if (!gasUrl) {
        showStatus('Missing Web App URL', true);
        return;
    }
    
    try {
        // Build URLSearchParams for x-www-form-urlencoded (CORS-simple request)
        const params = new URLSearchParams({
            event: payload.event,
            variant: payload.variant,
            userId: payload.userId,
            ts: payload.ts.toString(),
            meta: JSON.stringify(payload.meta)
        });
        
        const response = await fetch(gasUrl, {
            method: 'POST',
            body: params,
            // No headers to keep it a CORS-simple request
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        showStatus('Logged');
    } catch (error) {
        showStatus(error.message || 'Send failed', true);
    }
}

/**
 * Initialize the application on page load
 */
function initialize() {
    // Load saved GAS URL
    const savedUrl = localStorage.getItem('gas_url');
    if (savedUrl) {
        document.getElementById('gasUrl').value = savedUrl;
    }
    
    // Get user ID (generates if needed)
    const userId = getUserId();
    
    // Prepare common metadata
    const commonMeta = {
        page: location.pathname,
        ua: navigator.userAgent
    };
    
    // Wire up event handlers
    document.getElementById('saveUrl').addEventListener('click', saveUrl);
    
    document.getElementById('ctaA').addEventListener('click', () => {
        sendLogSimple({
            event: 'cta_click',
            variant: 'A',
            userId,
            ts: Date.now(),
            meta: commonMeta
        });
    });
    
    document.getElementById('ctaB').addEventListener('click', () => {
        sendLogSimple({
            event: 'cta_click',
            variant: 'B',
            userId,
            ts: Date.now(),
            meta: commonMeta
        });
    });
    
    document.getElementById('heartbeat').addEventListener('click', () => {
        sendLogSimple({
            event: 'heartbeat',
            variant: 'none',
            userId,
            ts: Date.now(),
            meta: commonMeta
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);