"use client";

import { useState, useCallback } from "react";
import { GeminiComputerRenderer } from "@/components/dynamic-ui-renderer";

// Initial desktop content (just the inner content, not full HTML)
const INITIAL_DESKTOP_CONTENT = `<div style="flex: 1; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
  <h2 style="margin: 0 0 30px 0; color: #202124; font-size: 24px;">Desktop</h2>
  
  <!-- App Grid -->
  <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 30px; max-width: 500px;">
    
    <!-- Top Row -->
    <div data-interaction-id="open_desktop" style="cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
      <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">🖥️</div>
      <div style="font-size: 12px; color: #5f6368;">Desktop</div>
    </div>
    
    <div data-interaction-id="open_documents" style="cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
      <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">📁</div>
      <div style="font-size: 12px; color: #5f6368;">Documents</div>
    </div>
    
    <div data-interaction-id="open_notepad" style="cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
      <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">📝</div>
      <div style="font-size: 12px; color: #5f6368;">Notepad</div>
    </div>
    
    <div data-interaction-id="open_settings" style="cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
      <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">⚙️</div>
      <div style="font-size: 12px; color: #5f6368;">Settings</div>
    </div>
    
    <div data-interaction-id="open_trash" style="cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
      <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">🗑️</div>
      <div style="font-size: 12px; color: #5f6368;">Trash</div>
    </div>
    
    <!-- Bottom Row -->
    <div data-interaction-id="open_web" style="cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
      <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">🌐</div>
      <div style="font-size: 12px; color: #5f6368;">Web</div>
    </div>
    
    <div data-interaction-id="open_calculator" style="cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
      <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">🔢</div>
      <div style="font-size: 12px; color: #5f6368;">Calculator</div>
    </div>
    
    <div data-interaction-id="open_travel" style="cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
      <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">✈️</div>
      <div style="font-size: 12px; color: #5f6368;">Travel</div>
    </div>
    
    <div data-interaction-id="open_shopping" style="cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
      <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">🛒</div>
      <div style="font-size: 12px; color: #5f6368;">Shopping</div>
    </div>
    
    <div data-interaction-id="open_games" style="cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
      <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">🎮</div>
      <div style="font-size: 12px; color: #5f6368;">Games</div>
    </div>
    
  </div>
</div>`;

export default function GeminiComputerPage() {
  const [currentContent, setCurrentContent] = useState(INITIAL_DESKTOP_CONTENT);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [useTestMode, setUseTestMode] = useState(false);
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

      console.log(
        "🚀 Starting interaction:",
        interactionId,
        "Test mode:",
        useTestMode
      );
      setIsStreaming(true);
      setStreamingContent(""); // Reset streaming content

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
        if (useTestMode) {
          // Use non-streaming test API
          console.log("🧪 Using test mode (non-streaming)");
          const response = await fetch("/api/test-generate", {
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

          console.log("📡 Test response status:", response.status);
          const result = await response.json();
          console.log("📄 Test result:", {
            success: result.success,
            contentLength: result.content?.length,
          });

          if (result.success && result.content) {
            const cleanedContent = cleanupContent(result.content);
            setCurrentContent(cleanedContent);
            console.log("✅ Set content from test mode");
          } else {
            console.error("❌ Test mode failed:", result);
          }
        } else {
          // Use streaming API (original code)
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
              const cleanedStreamingContent =
                cleanupContent(accumulatedContent);
              setStreamingContent(cleanedStreamingContent);
            }
          }

          console.log("💾 Final content length:", accumulatedContent.length);
          // Set the final content once streaming is complete
          if (accumulatedContent.trim()) {
            const cleanedFinalContent = cleanupContent(accumulatedContent);
            setCurrentContent(cleanedFinalContent);
            console.log("✅ Set final content");
          } else {
            console.warn("⚠️ No content received");
          }
          setStreamingContent("");
        }
      } catch (error) {
        console.error("❌ Error handling interaction:", error);
        // Fallback to current content if error occurs
        setStreamingContent("");
      } finally {
        console.log("🏁 Finished interaction");
        setIsStreaming(false);
      }
    },
    [currentContent, isStreaming, useTestMode]
  );

  // Use streaming content if available, otherwise use current content
  const displayContent = streamingContent || currentContent;

  return (
    <div className="w-full h-screen overflow-hidden bg-[#f0f2f5] flex items-center justify-center">
      {/* Debug toggle */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setUseTestMode(!useTestMode)}
          className={`px-3 py-1 rounded text-sm ${
            useTestMode ? "bg-green-600 text-white" : "bg-gray-600 text-white"
          }`}
        >
          {useTestMode ? "🧪 Test Mode" : "🌊 Stream Mode"}
        </button>
      </div>

      {isStreaming && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          {useTestMode ? "Testing generation..." : "Generating interface..."}
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
