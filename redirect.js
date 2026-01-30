/**
 * Redirect logic for A/B test traffic splitting
 * Randomly assigns users to Variant A or B and redirects appropriately
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
 * Get or assign A/B test variant with localStorage consistency
 * @returns {string} 'a' or 'b' - the assigned test variant
 */
function getAssignedVariant() {
    const VARIANT_KEY = 'ab_test_variant';
    
    // Check if already assigned
    let variant = localStorage.getItem(VARIANT_KEY);
    
    if (!variant) {
        // 50/50 random split
        variant = Math.random() < 0.5 ? 'a' : 'b';
        localStorage.setItem(VARIANT_KEY, variant);
    }
    
    return variant;
}

/**
 * Log A/B test assignment to Google Apps Script
 * @param {string} variant - The assigned variant ('a' or 'b')
 * @param {string} userId - User identifier
 */
async function logAssignment(variant, userId) {
    const gasUrl = localStorage.getItem('gas_url');
    
    if (!gasUrl) {
        console.log('No GAS URL configured, skipping assignment logging');
        return;
    }
    
    try {
        const params = new URLSearchParams({
            event: 'ab_assignment',
            variant: variant.toUpperCase(),
            userId: userId,
            ts: Date.now().toString(),
            meta: JSON.stringify({
                page: location.pathname,
                ua: navigator.userAgent,
                test_type: 'pricing_discount'
            })
        });
        
        await fetch(gasUrl, {
            method: 'POST',
            body: params
        });
    } catch (error) {
        console.log('Failed to log assignment:', error.message);
    }
}

/**
 * Set up Google Apps Script URL with predefined endpoint
 */
function setupGASUrl() {
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbzqkrN677A0HNvsOLDJ4DNijANV7GWldx_6QMhs0mkH23hMCD8GD0tdDFRGbtLutxlk/exec';
    localStorage.setItem('gas_url', GAS_URL);
    console.log('GAS URL configured:', GAS_URL);
}

/**
 * Perform redirect to assigned variant
 */
async function performRedirect() {
    // Set up GAS URL
    setupGASUrl();
    
    // Add small delay for user experience (shows loading animation)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const variant = getAssignedVariant();
    const userId = getUserId();
    
    // Log the assignment
    await logAssignment(variant, userId);
    
    // Redirect to the appropriate test page
    window.location.href = `test-${variant}.html`;
}

// Initialize redirect when page loads
document.addEventListener('DOMContentLoaded', performRedirect);