/**
 * Landing page logic for A/B test variants
 * Handles event tracking and user interactions for Telegram emoji pack sales
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
 * Get the current test variant from page path
 * @returns {string} 'A' or 'B' - the current test variant
 */
function getCurrentVariant() {
    const pathname = window.location.pathname;
    return pathname.includes('test-a') ? 'A' : 'B';
}

/**
 * Get pricing information based on current variant
 * @returns {Object} Pricing details for the current variant
 */
function getPricingInfo() {
    const variant = getCurrentVariant();
    
    if (variant === 'A') {
        return {
            regular: 14.99,
            current: 14.99,
            currency: 'USD',
            hasDiscount: false,
            discountPercent: 0
        };
    } else {
        return {
            regular: 14.99,
            current: 12.74,
            currency: 'USD',
            hasDiscount: true,
            discountPercent: 15
        };
    }
}

/**
 * Display a status message with appropriate styling
 * @param {string} message - The status message to display
 * @param {boolean} isError - Whether this is an error message
 */
function showStatus(message, isError = false) {
    // Remove existing status if present
    const existingStatus = document.querySelector('.status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // Create new status element
    const statusEl = document.createElement('div');
    statusEl.className = `status ${isError ? 'error' : 'success'}`;
    statusEl.textContent = message;
    
    // Add to page
    document.body.appendChild(statusEl);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (statusEl.parentNode) {
            statusEl.remove();
        }
    }, 3000);
}

/**
 * Send event data to Google Apps Script using CORS-simple request
 * @param {Object} payload - Event data to send
 * @param {string} payload.event - Event type (e.g., 'page_view', 'cta_click')
 * @param {string} payload.variant - Variant identifier ('A' or 'B')
 * @param {string} payload.userId - User identifier
 * @param {number} payload.ts - Unix timestamp in milliseconds
 * @param {Object} payload.meta - Additional metadata object
 */
async function sendLogSimple(payload) {
    const gasUrl = localStorage.getItem('gas_url');
    
    if (!gasUrl) {
        console.log('No GAS URL configured, skipping event logging');
        return false;
    }
    
    try {
        const params = new URLSearchParams({
            event: payload.event,
            variant: payload.variant,
            userId: payload.userId,
            ts: payload.ts.toString(),
            meta: JSON.stringify(payload.meta)
        });
        
        const response = await fetch(gasUrl, {
            method: 'POST',
            body: params
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('Failed to log event:', error.message);
        return false;
    }
}

/**
 * Track page view event
 */
async function trackPageView() {
    const userId = getUserId();
    const variant = getCurrentVariant();
    
    await sendLogSimple({
        event: 'page_view',
        variant,
        userId,
        ts: Date.now(),
        meta: {
            page: location.pathname,
            ua: navigator.userAgent,
            referrer: document.referrer || 'direct',
            pricing: getPricingInfo()
        }
    });
}

/**
 * Track pricing section view (when scrolled into view)
 */
async function trackPricingView() {
    const userId = getUserId();
    const variant = getCurrentVariant();
    
    await sendLogSimple({
        event: 'view_pricing',
        variant,
        userId,
        ts: Date.now(),
        meta: {
            pricing: getPricingInfo(),
            scroll_depth: Math.round(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100)
        }
    });
}

/**
 * Track CTA click event
 */
async function trackCTAClick() {
    const userId = getUserId();
    const variant = getCurrentVariant();
    
    const success = await sendLogSimple({
        event: 'cta_click',
        variant,
        userId,
        ts: Date.now(),
        meta: {
            pricing: getPricingInfo(),
            button_text: document.getElementById('purchaseButton').textContent
        }
    });
    
    if (success) {
        showStatus('Processing your order...');
        simulatePurchase();
    } else {
        showStatus('Unable to process request. Please try again.', true);
    }
}

/**
 * Simulate purchase process for demonstration
 * In real app, this would integrate with payment processor
 */
async function simulatePurchase() {
    const button = document.getElementById('purchaseButton');
    const originalText = button.textContent;
    
    // Show loading state
    button.classList.add('loading');
    button.textContent = 'Processing...';
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Track conversion
    const userId = getUserId();
    const variant = getCurrentVariant();
    const pricing = getPricingInfo();
    
    await sendLogSimple({
        event: 'conversion',
        variant,
        userId,
        ts: Date.now(),
        meta: {
            pricing: pricing,
            revenue: pricing.current,
            payment_method: 'simulated'
        }
    });
    
    // Show success
    button.classList.remove('loading');
    showStatus('🎉 Order successful! Check your Telegram for delivery details.');
    
    // Reset button after delay
    setTimeout(() => {
        button.textContent = 'Get Another Pack';
    }, 3000);
}

/**
 * Setup intersection observer for tracking pricing section views
 */
function setupScrollTracking() {
    const pricingSection = document.querySelector('.pricing');
    
    if (!pricingSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.tracked) {
                trackPricingView();
                entry.target.dataset.tracked = 'true';
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(pricingSection);
}

/**
 * Initialize the landing page
 */
function initializeLanding() {
    // Track initial page view
    trackPageView();
    
    // Setup scroll tracking
    setupScrollTracking();
    
    // Wire up purchase button
    const purchaseButton = document.getElementById('purchaseButton');
    if (purchaseButton) {
        purchaseButton.addEventListener('click', trackCTAClick);
    }
    
    // Track emoji interactions (engagement metric)
    const emojiItems = document.querySelectorAll('.emoji-item');
    emojiItems.forEach(item => {
        item.addEventListener('click', () => {
            const emoji = item.querySelector('.emoji').textContent;
            const label = item.querySelector('.label').textContent;
            
            sendLogSimple({
                event: 'emoji_interaction',
                variant: getCurrentVariant(),
                userId: getUserId(),
                ts: Date.now(),
                meta: {
                    emoji: emoji,
                    category: label,
                    action: 'click'
                }
            });
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeLanding);