"use client";
import posthog from "posthog-js";

import { useState, useCallback, useEffect } from "react";
import { GeminiComputerRenderer } from "@/components/dynamic-ui-renderer";
import { ANALYTICS_EVENTS, EVENT_PROPERTIES } from "@/lib/analytics-constants";

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

  const [windowTitle, setWindowTitle] = useState("Gemini Computer");

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

  const handleInteraction = useCallback(
    async (interactionId: string) => {
      if (isStreaming) return;

      console.log("🚀 Starting interaction:", interactionId);
      setIsStreaming(true);
      setStreamingContent(""); // Reset streaming content

      // Track interaction start with PostHog
      posthog.capture(ANALYTICS_EVENTS.UI_INTERACTION_STARTED, {
        [EVENT_PROPERTIES.INTERACTION_ID]: interactionId,
        [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
      });

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
          }),
        });

        console.log(
          "📡 Response status:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          throw new Error(
            `Failed to generate screen: ${response.status} ${response.statusText}`
          );
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        console.log("📖 Starting to read stream...");
        let accumulatedContent = "";
        let chunkCount = 0;
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("✅ Stream finished. Total chunks:", chunkCount);
            break;
          }

          chunkCount++;
          const chunk = decoder.decode(value, { stream: true });
          console.log(
            `📦 Chunk ${chunkCount}:`,
            chunk.substring(0, 100) + "..."
          );

          const contentChunk = parseDataStreamChunk(chunk);
          console.log(
            `🔧 Parsed content chunk (${contentChunk.length} chars):`,
            contentChunk.substring(0, 50) + "..."
          );

          if (contentChunk) {
            accumulatedContent += contentChunk;
            console.log(
              "📝 Accumulated content length:",
              accumulatedContent.length
            );
            // Clean up and set streaming content
            const cleanedStreamingContent = cleanupContent(accumulatedContent);
            setStreamingContent(cleanedStreamingContent);
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
            [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
          });
        } else {
          console.warn("⚠️ No content received");

          // Track empty content as a warning
          posthog.capture(ANALYTICS_EVENTS.UI_GENERATION_WARNING, {
            [EVENT_PROPERTIES.INTERACTION_ID]: interactionId,
            [EVENT_PROPERTIES.ISSUE]: "empty_content",
            [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
          });
        }
        setStreamingContent("");
      } catch (error) {
        console.error("❌ Error handling interaction:", error);

        // Track error with PostHog
        posthog.capture(ANALYTICS_EVENTS.UI_GENERATION_ERROR, {
          [EVENT_PROPERTIES.INTERACTION_ID]: interactionId,
          [EVENT_PROPERTIES.ERROR]:
            error instanceof Error ? error.message : "Unknown error",
          [EVENT_PROPERTIES.TIMESTAMP]: Date.now(),
        });

        // Fallback to current content if error occurs
        setStreamingContent("");
      } finally {
        console.log("🏁 Finished interaction");
        setIsStreaming(false);
      }
    },
    [currentContent, isStreaming]
  );

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: "2025-05-24",
    });
  }, []);
  // Use streaming content if available, otherwise use current content
  const displayContent = streamingContent || currentContent;

  return (
    <div className="w-full h-screen overflow-hidden bg-[#f0f2f5] flex items-center justify-center">
      {isStreaming && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          Generating interface...
        </div>
      )}

      {/* Static Window Frame */}
      <div className="w-[90%] max-w-[1000px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col">
        {/* Window Header - Static */}
        <div className="bg-[#202124] text-white px-5 py-3 rounded-t-lg flex items-center justify-between">
          <h1 className="m-0 text-lg font-medium">{windowTitle}</h1>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-[#34a853] rounded-full"></div>
            <div className="w-3 h-3 bg-[#fbbc04] rounded-full"></div>
            <div className="w-3 h-3 bg-[#ea4335] rounded-full"></div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <GeminiComputerRenderer
          html={displayContent}
          onInteraction={handleInteraction}
        />
      </div>
    </div>
  );
}
