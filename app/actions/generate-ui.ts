"use server";

import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { AISDKExporter } from "langsmith/vercel";
import {
  SYSTEM_PROMPT,
  LEGACY_SYSTEM_PROMPT,
  createUserPrompt,
} from "@/lib/prompt-constants";
import { isRateLimitError } from "@/lib/analytics-constants";

interface InteractionContext {
  currentContent: string;
  interactionId: string;
  timestamp: number;
  modelId?: string;
}

// Function to clean up markdown code blocks from generated content
function cleanupGeneratedContent(content: string): string {
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
}

export async function generateNextScreenStream(context: InteractionContext) {
  const modelId = context.modelId || "gemini-2.5-flash-lite-preview-06-17";

  console.log("🎯 generateNextScreenStream called with:", {
    interactionId: context.interactionId,
    contentLength: context.currentContent?.length || 0,
    modelId,
  });

  try {
    console.log(`🤖 Calling streamText with ${modelId}...`);
    const result = await streamText({
      model: google(modelId),
      system: SYSTEM_PROMPT,
      prompt: createUserPrompt(
        context.currentContent,
        context.interactionId,
        context.timestamp
      ),
      experimental_telemetry: AISDKExporter.getSettings({
        runName: `generate-ui-${context.interactionId}`,
        metadata: {
          interactionId: context.interactionId,
          timestamp: context.timestamp,
          contentLength: context.currentContent?.length || 0,
          modelId,
          modelName: modelId
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        },
      }),
    });

    console.log(
      "✅ streamText result created, calling toDataStreamResponse..."
    );
    const response = result.toDataStreamResponse();
    console.log("📡 toDataStreamResponse completed");
    return response;
  } catch (error) {
    console.error("❌ Error generating next screen:", error);
    console.error(
      "❌ Error details:",
      error instanceof Error ? error.message : "Unknown error",
      error instanceof Error ? error.stack : undefined
    );

    // Check if this is a rate limit error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const isRateLimit = isRateLimitError(errorMessage);

    console.log("🔍 Error analysis:", {
      errorMessage,
      isRateLimit,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });

    // If it's a rate limit error, throw it so the client can handle it
    if (isRateLimit) {
      console.log("🚫 Rate limit error detected - propagating to client");
      throw error;
    }

    // For non-rate-limit errors, return fallback response
    const fallbackContent = getDesktopContent();
    const cleanedFallback = cleanupGeneratedContent(fallbackContent);
    console.log("🔄 Returning fallback content for non-rate-limit error");
    return new Response(cleanedFallback, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

function getDesktopContent(): string {
  return `<div style="flex: 1; display: flex; flex-direction: column; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative; overflow: hidden;">
  
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
}

// Keep the old function for backward compatibility
export async function generateNextScreen(context: InteractionContext) {
  const modelId = context.modelId || "gemini-2.5-flash-lite-preview-06-17";

  try {
    const result = await streamText({
      model: google(modelId),
      system: LEGACY_SYSTEM_PROMPT,
      prompt: createUserPrompt(
        context.currentContent,
        context.interactionId,
        context.timestamp
      ),
      experimental_telemetry: AISDKExporter.getSettings({
        runName: `generate-ui-legacy-${context.interactionId}`,
        metadata: {
          interactionId: context.interactionId,
          timestamp: context.timestamp,
          contentLength: context.currentContent?.length || 0,
          modelId,
          modelName: modelId
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          function: "generateNextScreen",
        },
      }),
    });

    // Convert to text for backward compatibility
    const fullText = await result.text;
    const cleanedText = cleanupGeneratedContent(fullText);
    return { content: cleanedText, success: true };
  } catch (error) {
    console.error("❌ Error generating next screen:", error);

    return {
      content: cleanupGeneratedContent(getDesktopContent()),
      success: false,
    };
  }
}
