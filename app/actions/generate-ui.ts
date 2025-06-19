"use server"

import { streamText } from "ai"
import { google } from "@ai-sdk/google"
import { AISDKExporter } from "langsmith/vercel"

interface InteractionContext {
  currentContent: string
  interactionId: string
  timestamp: number
}

// Function to clean up markdown code blocks from generated content
function cleanupGeneratedContent(content: string): string {
  if (!content) return content;

  // Remove markdown code block syntax
  let cleaned = content;

  // Remove ```html or ``` at the beginning
  cleaned = cleaned.replace(/^```html\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/, '');

  // Remove ``` at the end
  cleaned = cleaned.replace(/\s*```\s*$/, '');

  // Trim any extra whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

export async function generateNextScreenStream(context: InteractionContext) {
  console.log('🎯 generateNextScreenStream called with:', {
    interactionId: context.interactionId,
    contentLength: context.currentContent?.length || 0
  });

  try {
    console.log('🤖 Calling streamText with Gemini...');
    const result = await streamText({
      model: google("gemini-2.5-flash-lite-preview-06-17"),
      system: `You are the AI brain behind "Gemini Computer", a non-deterministic operating system. Your job is to generate the HTML content for the next screen based on the current content and the user's interaction.

IMPORTANT: You ONLY generate the content that goes INSIDE the window frame. Do NOT generate the full HTML document, window header, or outer structure. Just generate the inner content area.

CRITICAL PRINCIPLE - NON-DETERMINISM:
This OS is non-deterministic. When a user performs the same action (like opening Documents or launching Travel app), you should generate DIFFERENT content each time. Be creative and plausible, but make variations.

DESIGN SYSTEM:
- Content area styling: Use inline CSS styles
- Colors: 
  * Background areas: #ffffff (white) or #f8f9fa (light grey)
  * Text: #202124 (dark grey) or #5f6368 (medium grey)  
  * Action Buttons: #1a73e8 (blue) with white text
  * Hover states: #f8f9fa background
- Typography: Clean sans-serif (system-ui, -apple-system, sans-serif)
- Icons: Use emojis for simple, universal icons
- Spacing: Use appropriate padding and margins for clean layouts

CONTENT STRUCTURE REQUIREMENTS:
- ALWAYS include proper data-interaction-id attributes for clickable elements
- Use flex: 1 for main containers to fill the window
- Include padding for comfortable spacing
- Make content responsive and accessible
- Include "Back to Desktop" buttons when appropriate (except on desktop)

APPS AND BEHAVIORS:

1. DESKTOP:
   - Grid of 10 app icons with labels
   - Each icon should have unique data-interaction-id like "open_documents", "open_notepad", etc.

2. DOCUMENTS FOLDER (NON-DETERMINISTIC):
   - File explorer view with different files/folders each time
   - Generate plausible file names (.docx, .txt, .xlsx, folders)
   - Files should be clickable with data-interaction-id="open_file_[filename]"
   - Folders clickable with data-interaction-id="open_folder_[foldername]"

3. SETTINGS APP:
   - Grid of setting categories: Display, Sound, Network, Privacy, Wallpaper, About
   - Sound settings should show volume slider, device dropdowns, mute checkbox

4. TRAVEL APP (HIGHLY NON-DETERMINISTIC):
   - Version A: Map search with location input and preset city buttons
   - Version B: Travel planner with trip planning and booking views
   - Version C: Flight tracker with departure boards
   - Version D: Weather app for travel destinations
   - etc. - be creative with different travel-related interfaces

5. OTHER APPS:
   - Generate appropriate interfaces for Calculator, Web, Shopping, Games, etc.
   - Make each launch potentially different

INTERACTION HANDLING:
Based on the interaction ID, determine what the user clicked and generate the appropriate content. Common patterns:
- "open_[app]" → Launch that app content
- "back_to_desktop" → Return to main desktop content
- "open_file_[filename]" → Open file viewer content
- "open_folder_[foldername]" → Navigate into folder content
- "settings_[category]" → Open settings subcategory content

OUTPUT FORMAT:
Return ONLY the content HTML that goes inside the window frame. Start with a div that has flex: 1 and appropriate styling. No explanations, no markdown formatting, no code block syntax, just pure HTML content with inline styles.`,

      prompt: `Current content area:
${context.currentContent}

User interaction: ${context.interactionId}
    Timestamp: ${new Date(context.timestamp).toISOString()}

Generate the content HTML for the next screen.Remember to be non - deterministic - if this is a repeated action, create fresh, different content while maintaining the core functionality.

Focus on creating intuitive interfaces that feel like a real operating system.Include proper data - interaction - id attributes for all clickable elements.`,
      experimental_telemetry: AISDKExporter.getSettings({
        runName: `generate-ui-${context.interactionId}`,
        metadata: {
          interactionId: context.interactionId,
          timestamp: context.timestamp,
          contentLength: context.currentContent?.length || 0
        }
      }),
    });

    console.log('✅ streamText result created, calling toDataStreamResponse...');
    const response = result.toDataStreamResponse();
    console.log('📡 toDataStreamResponse completed');
    return response;
  } catch (error) {
    console.error("❌ Error generating next screen:", error);
    console.error("❌ Error details:", error instanceof Error ? error.message : 'Unknown error', error instanceof Error ? error.stack : undefined);

    // Return fallback response in case of error
    const fallbackContent = getDesktopContent();
    const cleanedFallback = cleanupGeneratedContent(fallbackContent);
    console.log('🔄 Returning fallback content');
    return new Response(cleanedFallback, {
      headers: {
        'Content-Type': 'text/plain'
      }
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
  try {
    const result = await streamText({
      model: google("gemini-2.5-flash-lite-preview-06-17"),
      system: `You are the AI brain behind "Gemini Computer", a non-deterministic operating system. Your job is to generate the HTML content for the next screen based on the current content and the user's interaction.

IMPORTANT: You ONLY generate the content that goes INSIDE the window frame. Do NOT generate the full HTML document, window header, or outer structure. Just generate the inner content area.

CRITICAL PRINCIPLE - NON-DETERMINISM:
This OS is non-deterministic. When a user performs the same action (like opening Documents or launching Travel app), you should generate DIFFERENT content each time. Be creative and plausible, but make variations.

OUTPUT FORMAT:
Return ONLY the content HTML that goes inside the window frame. Start with a div that has flex: 1 and appropriate styling. No explanations, no markdown formatting, no code block syntax, just pure HTML content with inline styles.`,

      prompt: `Current content area:
${context.currentContent}

User interaction: ${context.interactionId}
    Timestamp: ${new Date(context.timestamp).toISOString()}

Generate the content HTML for the next screen.Remember to be non - deterministic - if this is a repeated action, create fresh, different content while maintaining the core functionality.`,
      experimental_telemetry: AISDKExporter.getSettings({
        runName: `generate-ui-legacy-${context.interactionId}`,
        metadata: {
          interactionId: context.interactionId,
          timestamp: context.timestamp,
          contentLength: context.currentContent?.length || 0,
          function: "generateNextScreen"
        }
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
      success: false
    };
  }
}
