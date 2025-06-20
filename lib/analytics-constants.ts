// PostHog Analytics Event Constants
// Using normal English naming for better readability in analytics dashboards

export const ANALYTICS_EVENTS = {
    // User Interaction Events
    UI_INTERACTION_STARTED: "UI Interaction Started",

    // Generation Events
    UI_GENERATION_SUCCESS: "UI Generation Success",
    UI_GENERATION_WARNING: "UI Generation Warning",
    UI_GENERATION_ERROR: "UI Generation Error",

    // Feedback Events
    FEEDBACK_MODAL_SHOWN: "Feedback Modal Shown",
    FEEDBACK_SUBMITTED: "Feedback Submitted",
    FEEDBACK_DISMISSED: "Feedback Dismissed",

    // App-specific Events (for future use)
    APP_OPENED: "App Opened",
    DESKTOP_RETURNED: "Desktop Returned",
    SETTINGS_ACCESSED: "Settings Accessed",
    DOCUMENT_FOLDER_OPENED: "Document Folder Opened",
} as const;

// Event property constants for consistency
export const EVENT_PROPERTIES = {
    INTERACTION_ID: "interactionId",
    TIMESTAMP: "timestamp",
    CONTENT_LENGTH: "contentLength",
    ERROR: "error",
    ISSUE: "issue",
    APP_NAME: "appName",
    SUCCESS: "success",
    // Feedback properties
    FEEDBACK_REASON: "reason",
    FEEDBACK_RATING: "rating",
    FEEDBACK_COMMENTS: "comments",
    FEEDBACK_IMPROVEMENTS: "improvements",
    INTERACTION_COUNT: "interactionCount",
} as const;

// Issue types for warnings
export const WARNING_ISSUES = {
    EMPTY_CONTENT: "empty_content",
    RATE_LIMITED: "rate_limited",
    API_ERROR: "api_error",
    TIMEOUT: "timeout",
} as const;

// Helper function to detect rate limiting
export function isRateLimitError(error: string | Error): boolean {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const rateLimitIndicators = [
        'rate limit',
        'rate_limit',
        'quota exceeded',
        'too many requests',
        '429',
        'resource exhausted',
        'quota_exceeded'
    ];

    return rateLimitIndicators.some(indicator =>
        errorMessage.toLowerCase().includes(indicator.toLowerCase())
    );
} 