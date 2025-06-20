"use client";
import posthog from "posthog-js";

import { useState, useCallback, useEffect } from "react";
import { GeminiComputerRenderer } from "@/components/dynamic-ui-renderer";
import { RateLimitBanner } from "@/components/rate-limit-banner";
import { FeedbackModal, FeedbackData } from "@/components/feedback-modal";
import { ModelSelector, AVAILABLE_MODELS } from "@/components/model-selector";
import { DebugPanel } from "@/components/debug-panel";
import {
  ANALYTICS_EVENTS,
  EVENT_PROPERTIES,
  WARNING_ISSUES,
  isRateLimitError,
} from "@/lib/analytics-constants";

// Initial desktop content - Beautiful and modern design
const INITIAL_DESKTOP_CONTENT = `<div style="flex: 1; display: flex; flex-direction: column; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative; overflow: hidden;">
  
  <!-- Background Pattern -->
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.1; background-image: radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px); background-size: 50px 50px;"></div>
  
  <!-- Main Content Area -->
  <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; position: relative; z-index: 1;">
    
    <!-- App Grid Container -->
    <div style="background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 600px; width: 100%;">
      <!-- App Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 25px;">
        
        <!-- Desktop -->
        <div data-interaction-id="open_desktop" style="cursor: pointer; text-align: center; padding: 20px 15px; border-radius: 16px; transition: all 0.3s ease; background: #f8f9fa;" onmouseover="this.style.backgroundColor='#e9ecef'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 14px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">🖥️</div>
          <div style="font-size: 13px; color: #495057; font-weight: 500;">Desktop</div>
        </div>
        
        <!-- Documents -->
        <div data-interaction-id="open_documents" style="cursor: pointer; text-align: center; padding: 20px 15px; border-radius: 16px; transition: all 0.3s ease; background: #f8f9fa;" onmouseover="this.style.backgroundColor='#e9ecef'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #ffecd2, #fcb69f); border-radius: 14px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; box-shadow: 0 4px 15px rgba(252, 182, 159, 0.3);">📁</div>
          <div style="font-size: 13px; color: #495057; font-weight: 500;">Documents</div>
        </div>
        
        <!-- Notepad -->
        <div data-interaction-id="open_notepad" style="cursor: pointer; text-align: center; padding: 20px 15px; border-radius: 16px; transition: all 0.3s ease; background: #f8f9fa;" onmouseover="this.style.backgroundColor='#e9ecef'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #a8edea, #fed6e3); border-radius: 14px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; box-shadow: 0 4px 15px rgba(168, 237, 234, 0.3);">📝</div>
          <div style="font-size: 13px; color: #495057; font-weight: 500;">Notepad</div>
        </div>
        
        <!-- Settings -->
        <div data-interaction-id="open_settings" style="cursor: pointer; text-align: center; padding: 20px 15px; border-radius: 16px; transition: all 0.3s ease; background: #f8f9fa;" onmouseover="this.style.backgroundColor='#e9ecef'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #d299c2, #fef9d7); border-radius: 14px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; box-shadow: 0 4px 15px rgba(210, 153, 194, 0.3);">⚙️</div>
          <div style="font-size: 13px; color: #495057; font-weight: 500;">Settings</div>
        </div>
        
        <!-- Web -->
        <div data-interaction-id="open_web" style="cursor: pointer; text-align: center; padding: 20px 15px; border-radius: 16px; transition: all 0.3s ease; background: #f8f9fa;" onmouseover="this.style.backgroundColor='#e9ecef'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #89f7fe, #66a6ff); border-radius: 14px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; box-shadow: 0 4px 15px rgba(137, 247, 254, 0.3);">🌐</div>
          <div style="font-size: 13px; color: #495057; font-weight: 500;">Web</div>
        </div>
        
        <!-- Calculator -->
        <div data-interaction-id="open_calculator" style="cursor: pointer; text-align: center; padding: 20px 15px; border-radius: 16px; transition: all 0.3s ease; background: #f8f9fa;" onmouseover="this.style.backgroundColor='#e9ecef'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #fa709a, #fee140); border-radius: 14px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; box-shadow: 0 4px 15px rgba(250, 112, 154, 0.3);">🔢</div>
          <div style="font-size: 13px; color: #495057; font-weight: 500;">Calculator</div>
        </div>
        
        <!-- Travel -->
        <div data-interaction-id="open_travel" style="cursor: pointer; text-align: center; padding: 20px 15px; border-radius: 16px; transition: all 0.3s ease; background: #f8f9fa;" onmouseover="this.style.backgroundColor='#e9ecef'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #a1c4fd, #c2e9fb); border-radius: 14px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; box-shadow: 0 4px 15px rgba(161, 196, 253, 0.3);">✈️</div>
          <div style="font-size: 13px; color: #495057; font-weight: 500;">Travel</div>
        </div>
        
        <!-- Shopping -->
        <div data-interaction-id="open_shopping" style="cursor: pointer; text-align: center; padding: 20px 15px; border-radius: 16px; transition: all 0.3s ease; background: #f8f9fa;" onmouseover="this.style.backgroundColor='#e9ecef'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #ff9a9e, #fecfef); border-radius: 14px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; box-shadow: 0 4px 15px rgba(255, 154, 158, 0.3);">🛒</div>
          <div style="font-size: 13px; color: #495057; font-weight: 500;">Shopping</div>
        </div>
        
        <!-- Games -->
        <div data-interaction-id="open_games" style="cursor: pointer; text-align: center; padding: 20px 15px; border-radius: 16px; transition: all 0.3s ease; background: #f8f9fa;" onmouseover="this.style.backgroundColor='#e9ecef'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 14px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">🎮</div>
          <div style="font-size: 13px; color: #495057; font-weight: 500;">Games</div>
        </div>
        
        <!-- Trash -->
        <div data-interaction-id="open_trash" style="cursor: pointer; text-align: center; padding: 20px 15px; border-radius: 16px; transition: all 0.3s ease; background: #f8f9fa;" onmouseover="this.style.backgroundColor='#e9ecef'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #868f96, #596164); border-radius: 14px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; box-shadow: 0 4px 15px rgba(134, 143, 150, 0.3);">🗑️</div>
          <div style="font-size: 13px; color: #495057; font-weight: 500;">Trash</div>
        </div>
        
      </div>
    </div>
    
  </div>
  
  <!-- Footer -->
  <div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.8); font-size: 14px; position: relative; z-index: 1;">
    <p style="margin: 0;">Powered by AI • Every interaction creates something unique</p>
  </div>
  
</div>`;

export default function GeminiComputerPage() {
  const [currentContent, setCurrentContent] = useState(INITIAL_DESKTOP_CONTENT);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [showRateLimitBanner, setShowRateLimitBanner] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() => {
    // Load saved model from localStorage or use default
    if (typeof window !== "undefined") {
      const savedModel = localStorage.getItem("gemini_computer_selected_model");
      if (savedModel && AVAILABLE_MODELS.some((m) => m.id === savedModel)) {
        return savedModel;
      }
    }
    return (
      AVAILABLE_MODELS.find((m) => m.isDefault)?.id || AVAILABLE_MODELS[0].id
    );
  });

  const [windowTitle, setWindowTitle] = useState("Gemini Computer");
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);

  // Function to parse AI SDK data stream chunks
  const parseDataStreamChunk = (chunk: string): string => {
    const lines = chunk.split("\n");
    let htmlContent = "";

    for (const line of lines) {
      // Look for data chunks that start with '0:'
      if (line.startsWith("0:")) {
        try {
          // Parse the JSON after '0:'
          const jsonStr = line.substring(2);
          const parsed = JSON.parse(jsonStr);
          htmlContent += parsed;
        } catch (e) {
          // If JSON parsing fails, continue to next line
          continue;
        }
      }
    }

    return htmlContent;
  };

  // Function to clean up markdown code blocks from content
  const cleanupContent = (content: string): string => {
    if (!content) return content;

    // Remove markdown code block syntax
    let cleaned = content;

    // Remove ```html or ``` at the beginning
    cleaned = cleaned.replace(/^```html\s*/i, "");
    cleaned = cleaned.replace(/^```\s*/, "");

    // Remove ``` at the end
    cleaned = cleaned.replace(/\s*```\s*$/, "");

    // Trim any extra whitespace
    cleaned = cleaned.trim();

    return cleaned;
  };

  // Rate limit banner handlers
  const handleCloseBanner = useCallback(() => {
    setShowRateLimitBanner(false);
  }, []);

  // Feedback modal handlers
  const handleFeedbackSubmit = useCallback(
    async (feedback: FeedbackData) => {
      // Track feedback submission
      posthog.capture(ANALYTICS_EVENTS.FEEDBACK_SUBMITTED, {
        [EVENT_PROPERTIES.FEEDBACK_REASON]: feedback.reason,
        [EVENT_PROPERTIES.FEEDBACK_RATING]: feedback.rating,
        [EVENT_PROPERTIES.FEEDBACK_COMMENTS]: feedback.comments,
        [EVENT_PROPERTIES.FEEDBACK_IMPROVEMENTS]: feedback.improvements,
        [EVENT_PROPERTIES.INTERACTION_COUNT]: interactionCount,
        [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
      });

      // Mark feedback as shown for this session
      localStorage.setItem("gemini_computer_feedback_shown", "true");
      setFeedbackShown(true);
      setShowFeedbackModal(false);
    },
    [interactionCount]
  );

  const handleFeedbackClose = useCallback(() => {
    // Track feedback dismissal
    posthog.capture(ANALYTICS_EVENTS.FEEDBACK_DISMISSED, {
      [EVENT_PROPERTIES.INTERACTION_COUNT]: interactionCount,
      [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
    });

    // Mark feedback as shown for this session (even if dismissed)
    localStorage.setItem("gemini_computer_feedback_shown", "true");
    setFeedbackShown(true);
    setShowFeedbackModal(false);
  }, [interactionCount]);

  // Model change handler
  const handleModelChange = useCallback(
    (newModelId: string) => {
      const previousModel = selectedModel;
      setSelectedModel(newModelId);

      // Save model preference to localStorage
      localStorage.setItem("gemini_computer_selected_model", newModelId);

      // Track model change
      const newModelData = AVAILABLE_MODELS.find((m) => m.id === newModelId);
      posthog.capture(ANALYTICS_EVENTS.MODEL_CHANGED, {
        [EVENT_PROPERTIES.MODEL_ID]: newModelId,
        [EVENT_PROPERTIES.MODEL_NAME]: newModelData?.name || newModelId,
        [EVENT_PROPERTIES.PREVIOUS_MODEL]: previousModel,
        [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
      });
    },
    [selectedModel]
  );

  // Helper function to reset model preference (for future use in settings)
  const resetModelPreference = useCallback(() => {
    localStorage.removeItem("gemini_computer_selected_model");
    setSelectedModel(AVAILABLE_MODELS[0].id);
  }, []);

  // Footer link analytics handlers
  const handleFooterLinkClick = useCallback(
    (linkType: string, linkDestination: string) => {
      posthog.capture(ANALYTICS_EVENTS.FOOTER_LINK_CLICKED, {
        [EVENT_PROPERTIES.LINK_TYPE]: linkType,
        [EVENT_PROPERTIES.LINK_DESTINATION]: linkDestination,
        [EVENT_PROPERTIES.INTERACTION_COUNT]: interactionCount,
        [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
      });
    },
    [interactionCount]
  );

  const handleInteraction = useCallback(
    async (interactionId: string) => {
      if (isStreaming) return;

      console.log("🚀 Starting interaction:", interactionId);
      setIsStreaming(true);
      setStreamingContent(""); // Reset streaming content

      // Increment interaction count
      const newCount = interactionCount + 1;
      setInteractionCount(newCount);

      // Track interaction start with PostHog
      const selectedModelData = AVAILABLE_MODELS.find(
        (m) => m.id === selectedModel
      );
      posthog.capture(ANALYTICS_EVENTS.UI_INTERACTION_STARTED, {
        [EVENT_PROPERTIES.INTERACTION_ID]: interactionId,
        [EVENT_PROPERTIES.INTERACTION_COUNT]: newCount,
        [EVENT_PROPERTIES.MODEL_ID]: selectedModel,
        [EVENT_PROPERTIES.MODEL_NAME]: selectedModelData?.name || selectedModel,
        [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
      });

      // Show feedback modal after 3-4 interactions (randomly between them)
      if (!feedbackShown && newCount >= 3 && newCount <= 4) {
        const shouldShow = Math.random() > 0.5; // 50% chance on 3rd interaction, 100% on 4th
        if (shouldShow || newCount === 4) {
          setTimeout(() => {
            setShowFeedbackModal(true);
            posthog.capture(ANALYTICS_EVENTS.FEEDBACK_MODAL_SHOWN, {
              [EVENT_PROPERTIES.INTERACTION_COUNT]: newCount,
              [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
            });
          }, 1500); // Show after a short delay
        }
      }

      // Update window title based on interaction
      if (
        interactionId.includes("_desktop") ||
        interactionId === "back_to_desktop"
      ) {
        setWindowTitle("Gemini Computer");
      } else if (interactionId.includes("documents")) {
        setWindowTitle("Gemini Computer - Documents");
      } else if (interactionId.includes("notepad")) {
        setWindowTitle("Gemini Computer - Notepad");
      } else if (interactionId.includes("settings")) {
        setWindowTitle("Gemini Computer - Settings");
      } else if (interactionId.includes("travel")) {
        setWindowTitle("Gemini Computer - Travel");
      } else if (interactionId.includes("calculator")) {
        setWindowTitle("Gemini Computer - Calculator");
      } else if (interactionId.includes("web")) {
        setWindowTitle("Gemini Computer - Web Browser");
      } else if (interactionId.includes("shopping")) {
        setWindowTitle("Gemini Computer - Shopping");
      } else if (interactionId.includes("games")) {
        setWindowTitle("Gemini Computer - Games");
      }

      try {
        // Use streaming API
        console.log("📡 Making fetch request...");
        const response = await fetch("/api/generate-screen", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentContent,
            interactionId,
            timestamp: Date.now(),
            modelId: selectedModel,
          }),
        });

        console.log(
          "📡 Response status:",
          response.status,
          response.statusText
        );
        console.log(
          "📡 Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (!response.ok) {
          // Try to get error details from response
          let errorDetails = `${response.status} ${response.statusText}`;
          try {
            const errorText = await response.text();
            console.error("❌ Error response body:", errorText);
            errorDetails += ` - ${errorText}`;
          } catch (parseError) {
            console.error("❌ Could not parse error response:", parseError);
          }

          throw new Error(`Failed to generate screen: ${errorDetails}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          console.error("❌ No reader available from response body");
          throw new Error("No reader available");
        }

        console.log("📖 Starting to read stream...");
        console.log("📖 Stream reader created successfully");
        let accumulatedContent = "";
        let chunkCount = 0;
        const decoder = new TextDecoder();
        console.log("📖 Text decoder created");

        while (true) {
          try {
            const { done, value } = await reader.read();

            if (done) {
              console.log("✅ Stream finished. Total chunks:", chunkCount);
              break;
            }

            chunkCount++;
            console.log(
              `📦 Reading chunk ${chunkCount}, size:`,
              value?.length || 0,
              "bytes"
            );

            const chunk = decoder.decode(value, { stream: true });
            console.log(
              `📦 Chunk ${chunkCount} decoded:`,
              chunk.substring(0, 100) + (chunk.length > 100 ? "..." : "")
            );

            const contentChunk = parseDataStreamChunk(chunk);
            console.log(
              `🔧 Parsed content chunk (${contentChunk.length} chars):`,
              contentChunk.substring(0, 50) +
                (contentChunk.length > 50 ? "..." : "")
            );

            if (contentChunk) {
              accumulatedContent += contentChunk;
              console.log(
                "📝 Accumulated content length:",
                accumulatedContent.length
              );
              // Clean up and set streaming content
              const cleanedStreamingContent =
                cleanupContent(accumulatedContent);
              setStreamingContent(cleanedStreamingContent);
            }
          } catch (streamError) {
            console.error("❌ Error reading stream chunk:", streamError);
            console.error("❌ Stream error at chunk:", chunkCount);
            throw streamError;
          }
        }

        console.log("💾 Final content length:", accumulatedContent.length);
        // Set the final content once streaming is complete
        if (accumulatedContent.trim()) {
          const cleanedFinalContent = cleanupContent(accumulatedContent);
          setCurrentContent(cleanedFinalContent);
          console.log("✅ Set final content");

          // Track successful generation completion
          posthog.capture(ANALYTICS_EVENTS.UI_GENERATION_SUCCESS, {
            [EVENT_PROPERTIES.INTERACTION_ID]: interactionId,
            [EVENT_PROPERTIES.CONTENT_LENGTH]: accumulatedContent.length,
            [EVENT_PROPERTIES.MODEL_ID]: selectedModel,
            [EVENT_PROPERTIES.MODEL_NAME]:
              selectedModelData?.name || selectedModel,
            [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
          });
        } else {
          console.warn("⚠️ No content received");

          // Track empty content as a warning (might be due to rate limiting)
          posthog.capture(ANALYTICS_EVENTS.UI_GENERATION_WARNING, {
            [EVENT_PROPERTIES.INTERACTION_ID]: interactionId,
            [EVENT_PROPERTIES.ISSUE]: WARNING_ISSUES.EMPTY_CONTENT,
            [EVENT_PROPERTIES.MODEL_ID]: selectedModel,
            [EVENT_PROPERTIES.MODEL_NAME]:
              selectedModelData?.name || selectedModel,
            [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
          });

          // Show rate limit banner for empty content warnings
          setShowRateLimitBanner(true);
        }
        setStreamingContent("");
      } catch (error) {
        console.error("❌ Error handling interaction:", error);

        // Check if this is a rate limit error
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        const isRateLimit = isRateLimitError(errorMessage);

        // Track error with PostHog
        posthog.capture(ANALYTICS_EVENTS.UI_GENERATION_ERROR, {
          [EVENT_PROPERTIES.INTERACTION_ID]: interactionId,
          [EVENT_PROPERTIES.ERROR]: errorMessage,
          [EVENT_PROPERTIES.MODEL_ID]: selectedModel,
          [EVENT_PROPERTIES.MODEL_NAME]:
            selectedModelData?.name || selectedModel,
          [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
          [EVENT_PROPERTIES.ISSUE]: isRateLimit
            ? WARNING_ISSUES.RATE_LIMITED
            : WARNING_ISSUES.API_ERROR,
        });

        // Show rate limit banner if applicable
        if (isRateLimit) {
          setShowRateLimitBanner(true);
        }

        // Fallback to current content if error occurs
        setStreamingContent("");
      } finally {
        console.log("🏁 Finished interaction");
        setIsStreaming(false);
      }
    },
    [
      currentContent,
      isStreaming,
      interactionCount,
      feedbackShown,
      selectedModel,
    ]
  );

  const handleTestSystem = useCallback(async () => {
    // Close the banner and try a simple interaction
    setShowRateLimitBanner(false);

    // Test with the desktop interaction
    await handleInteraction("open_desktop");
  }, [handleInteraction]);

  const handleChangeModel = useCallback(() => {
    // Close the rate limit banner and open the model selector
    setShowRateLimitBanner(false);
    setModelSelectorOpen(true);
  }, []);

  // Debug panel handlers
  const handleToggleRateLimitBanner = useCallback(() => {
    setShowRateLimitBanner((prev) => !prev);
  }, []);

  const handleToggleFeedbackModal = useCallback(() => {
    setShowFeedbackModal((prev) => !prev);
  }, []);

  const handleToggleModelSelector = useCallback(() => {
    setModelSelectorOpen((prev) => !prev);
  }, []);

  const handleToggleStreaming = useCallback(() => {
    setIsStreaming((prev) => !prev);
  }, []);

  const handleSetInteractionCount = useCallback((count: number) => {
    setInteractionCount(count);
  }, []);

  const handleResetFeedbackShown = useCallback(() => {
    localStorage.removeItem("gemini_computer_feedback_shown");
    setFeedbackShown(false);
  }, []);

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: "2025-05-24",
    });

    // Check if feedback was already shown in this session
    const feedbackAlreadyShown = localStorage.getItem(
      "gemini_computer_feedback_shown"
    );
    if (feedbackAlreadyShown === "true") {
      setFeedbackShown(true);
    }

    // Track if a model was loaded from saved preference
    const savedModel = localStorage.getItem("gemini_computer_selected_model");
    if (savedModel && savedModel !== AVAILABLE_MODELS[0].id) {
      const modelData = AVAILABLE_MODELS.find((m) => m.id === savedModel);
      posthog.capture(ANALYTICS_EVENTS.MODEL_LOADED_FROM_PREFERENCE, {
        [EVENT_PROPERTIES.MODEL_ID]: savedModel,
        [EVENT_PROPERTIES.MODEL_NAME]: modelData?.name || savedModel,
        [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
      });
    }
  }, []);
  // Use streaming content if available, otherwise use current content
  const displayContent = streamingContent || currentContent;

  return (
    <div className="w-full h-screen overflow-hidden bg-[#f0f2f5] flex flex-col">
      <RateLimitBanner
        isVisible={showRateLimitBanner}
        onClose={handleCloseBanner}
        onTest={handleTestSystem}
        onChangeModel={handleChangeModel}
      />

      <FeedbackModal
        isVisible={showFeedbackModal}
        onClose={handleFeedbackClose}
        onSubmit={handleFeedbackSubmit}
      />

      {isStreaming && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          Generating interface...
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center">
        {/* Static Window Frame */}
        <div className="w-[90%] max-w-[1000px] h-[600px] overflow-hidden bg-white rounded-lg shadow-lg flex flex-col">
          {/* Window Header - Static */}
          <div className="bg-[#202124] text-white px-5 py-3 rounded-t-lg flex items-center justify-between">
            <h1 className="m-0 text-lg font-medium">{windowTitle}</h1>
            <div className="flex items-center gap-3">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
                disabled={isStreaming}
                isOpen={modelSelectorOpen}
                onOpenChange={setModelSelectorOpen}
              />
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-[#34a853] rounded-full"></div>
                <div className="w-3 h-3 bg-[#fbbc04] rounded-full"></div>
                <div className="w-3 h-3 bg-[#ea4335] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <GeminiComputerRenderer
            html={displayContent}
            onInteraction={handleInteraction}
          />
        </div>
      </div>

      {/* Footer with Buy me a coffee button and socials */}
      <footer className="w-full py-4 bg-white border-t border-gray-200">
        <div className="text-center space-y-3">
          {/* Buy me a coffee button */}
          <div>
            <a
              href="https://coff.ee/shubhamvsc5"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                handleFooterLinkClick("donation", "https://coff.ee/shubhamvsc5")
              }
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg shadow-orange-400/30"
            >
              ☕ Buy me a coffee
            </a>
          </div>

          {/* Social media links */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/shubhamvscode"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                handleFooterLinkClick(
                  "social",
                  "https://github.com/shubhamvscode"
                )
              }
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            <a
              href="https://twitter.com/shubhamvscode"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                handleFooterLinkClick(
                  "social",
                  "https://twitter.com/shubhamvscode"
                )
              }
              className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          </div>

          <div className="text-xs text-gray-500">Made by Shubham</div>
        </div>
      </footer>

      {/* Debug Panel - Only visible in development */}
      <DebugPanel
        showRateLimitBanner={showRateLimitBanner}
        onToggleRateLimitBanner={handleToggleRateLimitBanner}
        showFeedbackModal={showFeedbackModal}
        onToggleFeedbackModal={handleToggleFeedbackModal}
        modelSelectorOpen={modelSelectorOpen}
        onToggleModelSelector={handleToggleModelSelector}
        isStreaming={isStreaming}
        onToggleStreaming={handleToggleStreaming}
        interactionCount={interactionCount}
        onSetInteractionCount={handleSetInteractionCount}
        onResetFeedbackShown={handleResetFeedbackShown}
      />
    </div>
  );
}
