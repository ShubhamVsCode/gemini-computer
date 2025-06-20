// PostHog Analytics Event Constants
// Using normal English naming for better readability in analytics dashboards

export const ANALYTICS_EVENTS = {
  // User Interaction Events
  UI_INTERACTION_STARTED: "UI Interaction Started",

  // Generation Events
  UI_GENERATION_SUCCESS: "UI Generation Success",
  UI_GENERATION_WARNING: "UI Generation Warning",
  UI_GENERATION_ERROR: "UI Generation Error",

  // Model Events
  MODEL_CHANGED: "Model Changed",
  MODEL_LOADED_FROM_PREFERENCE: "Model Loaded From Preference",

  // Feedback Events
  FEEDBACK_MODAL_SHOWN: "Feedback Modal Shown",
  FEEDBACK_SUBMITTED: "Feedback Submitted",
  FEEDBACK_DISMISSED: "Feedback Dismissed",

  // App-specific Events (for future use)
  APP_OPENED: "App Opened",
  DESKTOP_RETURNED: "Desktop Returned",
  SETTINGS_ACCESSED: "Settings Accessed",
  DOCUMENT_FOLDER_OPENED: "Document Folder Opened",

  // Footer Events
  FOOTER_LINK_CLICKED: "Footer Link Clicked",
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
  // Model properties
  MODEL_ID: "modelId",
  MODEL_NAME: "modelName",
  PREVIOUS_MODEL: "previousModel",
  // Footer properties
  LINK_TYPE: "linkType",
  LINK_DESTINATION: "linkDestination",
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
  const errorMessage = typeof error === "string" ? error : error.message;
  const lowerMessage = errorMessage.toLowerCase();

  const rateLimitIndicators = [
    // Standard rate limit messages
    "rate limit",
    "rate_limit",
    "ratelimit",
    "rate limited",
    "rate-limited",

    // HTTP status codes
    "429",
    "too many requests",

    // Quota related
    "quota exceeded",
    "quota_exceeded",
    "quotaexceeded",
    "quota limit",
    "quota exhausted",
    "api quota",

    // Resource exhaustion
    "resource exhausted",
    "resource_exhausted",
    "resourceexhausted",

    // Throttling
    "throttled",
    "throttling",
    "throttle limit",

    // API specific messages
    "requests per minute",
    "requests per second",
    "rpm exceeded",
    "rps exceeded",

    // Google/Gemini specific
    "gemini api quota",
    "google api quota",
    "vertexai quota",

    // General overload messages
    "service overloaded",
    "api overloaded",
    "temporary unavailable due to quota",
  ];

  return rateLimitIndicators.some((indicator) =>
    lowerMessage.includes(indicator)
  );
}
