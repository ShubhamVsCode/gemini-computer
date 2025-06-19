// PostHog Analytics Event Constants
// Using normal English naming for better readability in analytics dashboards

export const ANALYTICS_EVENTS = {
    // User Interaction Events
    UI_INTERACTION_STARTED: "UI Interaction Started",

    // Generation Events
    UI_GENERATION_SUCCESS: "UI Generation Success",
    UI_GENERATION_WARNING: "UI Generation Warning",
    UI_GENERATION_ERROR: "UI Generation Error",

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
} as const; 