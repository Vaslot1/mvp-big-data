/**
 * Google Apps Script Web App endpoint for A/B Test Event Logger
 * Handles POST requests and logs to Google Sheets with enhanced A/B test tracking
 * 
 * Deployment notes:
 * - Deploy as "Execute as Me" 
 * - Who has access: Anyone
 * - Use the latest /exec URL in the client
 */

/**
 * Handle incoming POST requests from the A/B test landing pages
 * @param {Object} e - Apps Script event object
 * @returns {Object} JSON response with success status
 */
function doPost(e) {
    try {
        // Parse request data
        let data = {};
        
        // Handle x-www-form-urlencoded (recommended for CORS-simple requests)
        if (e.parameter) {
            data = {
                event: e.parameter.event,
                variant: e.parameter.variant,
                userId: e.parameter.userId,
                ts: e.parameter.ts,
                meta: e.parameter.meta
            };
        }
        
        // Fallback to JSON if present
        if (e.postData && e.postData.contents) {
            try {
                const jsonData = JSON.parse(e.postData.contents);
                data = { ...data, ...jsonData };
            } catch {
                // JSON parsing failed, stick with URL-encoded data
            }
        }
        
        // Validate required fields
        if (!data.event || !data.userId || !data.ts) {
            return ContentService.createTextOutput(
                JSON.stringify({ ok: false, error: 'Missing required fields' })
            ).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Get or create the logs sheet with enhanced columns for A/B testing
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = ss.getSheetByName('ab_test_logs');
        
        if (!sheet) {
            sheet = ss.insertSheet('ab_test_logs');
            // Set up enhanced headers for A/B test analysis
            sheet.getRange('A1:J1').setValues([[
                'ts_iso',
                'ts_unix',
                'event', 
                'variant',
                'userId',
                'revenue',
                'pricing_regular',
                'pricing_current',
                'discount_percent',
                'meta'
            ]]).setFontWeight('bold');
            
            // Set column widths for better readability
            sheet.setColumnWidths([200, 150, 120, 80, 250, 100, 100, 100, 120, 300]);
        }
        
        // Parse metadata for additional A/B test data
        let metadata = {};
        let revenue = 0;
        let pricingRegular = 0;
        let pricingCurrent = 0;
        let discountPercent = 0;
        
        if (data.meta) {
            try {
                metadata = JSON.parse(data.meta);
                
                // Extract pricing information if available
                if (metadata.pricing) {
                    pricingRegular = metadata.pricing.regular || 0;
                    pricingCurrent = metadata.pricing.current || 0;
                    discountPercent = metadata.pricing.discountPercent || 0;
                }
                
                // Extract revenue for conversion events
                if (data.event === 'conversion' && metadata.revenue) {
                    revenue = metadata.revenue;
                }
            } catch (metaError) {
                console.error('Error parsing metadata:', metaError.toString());
                metadata = { raw: data.meta };
            }
        }
        
        // Append the enhanced log row
        sheet.appendRow([
            new Date(parseInt(data.ts)).toISOString(),
            parseInt(data.ts),
            data.event,
            data.variant || '',
            data.userId,
            revenue,
            pricingRegular,
            pricingCurrent,
            discountPercent,
            data.meta || ''
        ]);
        
        // Return success response
        return ContentService.createTextOutput(
            JSON.stringify({ ok: true })
        ).setMimeType(ContentService.MimeType.JSON);
        
    } catch (error) {
        // Log error for debugging
        console.error('Error in doPost:', error.toString());
        
        return ContentService.createTextOutput(
            JSON.stringify({ ok: false, error: 'Server error' })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Generate A/B test summary report
 * @returns {Object} Summary statistics for the A/B test
 */
function generateABTestReport() {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName('ab_test_logs');
        
        if (!sheet) {
            return { error: 'No data found' };
        }
        
        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();
        const headers = values[0];
        
        // Find column indices
        const eventCol = headers.indexOf('event');
        const variantCol = headers.indexOf('variant');
        const revenueCol = headers.indexOf('revenue');
        const userIdCol = headers.indexOf('userId');
        
        // Skip header row
        const data = values.slice(1);
        
        // Calculate metrics
        const metrics = {
            A: { pageViews: 0, ctaClicks: 0, conversions: 0, revenue: 0, uniqueUsers: new Set() },
            B: { pageViews: 0, ctaClicks: 0, conversions: 0, revenue: 0, uniqueUsers: new Set() }
        };
        
        data.forEach(row => {
            const event = row[eventCol];
            const variant = row[variantCol];
            const revenue = parseFloat(row[revenueCol]) || 0;
            const userId = row[userIdCol];
            
            if (variant && metrics[variant]) {
                if (event === 'page_view') {
                    metrics[variant].pageViews++;
                    metrics[variant].uniqueUsers.add(userId);
                } else if (event === 'cta_click') {
                    metrics[variant].ctaClicks++;
                } else if (event === 'conversion') {
                    metrics[variant].conversions++;
                    metrics[variant].revenue += revenue;
                }
            }
        });
        
        // Convert Sets to counts
        ['A', 'B'].forEach(variant => {
            metrics[variant].uniqueUsers = metrics[variant].uniqueUsers.size;
            metrics[variant].conversionRate = metrics[variant].pageViews > 0 
                ? (metrics[variant].conversions / metrics[variant].pageViews * 100).toFixed(2) + '%'
                : '0%';
            metrics[variant].ctr = metrics[variant].pageViews > 0
                ? (metrics[variant].ctaClicks / metrics[variant].pageViews * 100).toFixed(2) + '%'
                : '0%';
        });
        
        return { ok: true, metrics: JSON.parse(JSON.stringify(metrics)) };
        
    } catch (error) {
        console.error('Error generating report:', error.toString());
        return { ok: false, error: 'Report generation failed' };
    }
}