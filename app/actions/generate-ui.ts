"use server"

import { streamText } from "ai"
import { google } from "@ai-sdk/google"

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
    });

    console.log('✅ streamText result created, calling toDataStreamResponse...');
    const response = result.toDataStreamResponse();
    console.log('📡 toDataStreamResponse completed');
    return response;
  } catch (error) {
    console.error("❌ Error generating next screen:", error);
    console.error("❌ Error details:", error?.message, error?.stack);

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
  return `< div style = "flex: 1; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center;" >
        <h2 style="margin: 0 0 30px 0; color: #202124; font-size: 24px;" > Desktop </h2>

          < !--App Grid-- >
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 30px; max-width: 500px;" >

              <!--Top Row-- >
                <div data - interaction - id="open_desktop" style = "cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover = "this.style.backgroundColor='#f8f9fa'" onmouseout = "this.style.backgroundColor='transparent'" >
                  <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;" >🖥️</div>
                    < div style = "font-size: 12px; color: #5f6368;" > Desktop </div>
                      </div>

                      < div data - interaction - id="open_documents" style = "cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover = "this.style.backgroundColor='#f8f9fa'" onmouseout = "this.style.backgroundColor='transparent'" >
                        <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;" >📁</div>
                          < div style = "font-size: 12px; color: #5f6368;" > Documents </div>
                            </div>

                            < div data - interaction - id="open_notepad" style = "cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover = "this.style.backgroundColor='#f8f9fa'" onmouseout = "this.style.backgroundColor='transparent'" >
                              <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;" >📝</div>
                                < div style = "font-size: 12px; color: #5f6368;" > Notepad </div>
                                  </div>

                                  < div data - interaction - id="open_settings" style = "cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover = "this.style.backgroundColor='#f8f9fa'" onmouseout = "this.style.backgroundColor='transparent'" >
                                    <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;" >⚙️</div>
                                      < div style = "font-size: 12px; color: #5f6368;" > Settings </div>
                                        </div>

                                        < div data - interaction - id="open_trash" style = "cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover = "this.style.backgroundColor='#f8f9fa'" onmouseout = "this.style.backgroundColor='transparent'" >
                                          <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;" >🗑️</div>
                                            < div style = "font-size: 12px; color: #5f6368;" > Trash </div>
                                              </div>

                                              < !--Bottom Row-- >
                                                <div data - interaction - id="open_web" style = "cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover = "this.style.backgroundColor='#f8f9fa'" onmouseout = "this.style.backgroundColor='transparent'" >
                                                  <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;" >🌐</div>
                                                    < div style = "font-size: 12px; color: #5f6368;" > Web </div>
                                                      </div>

                                                      < div data - interaction - id="open_calculator" style = "cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover = "this.style.backgroundColor='#f8f9fa'" onmouseout = "this.style.backgroundColor='transparent'" >
                                                        <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;" >🔢</div>
                                                          < div style = "font-size: 12px; color: #5f6368;" > Calculator </div>
                                                            </div>

                                                            < div data - interaction - id="open_travel" style = "cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover = "this.style.backgroundColor='#f8f9fa'" onmouseout = "this.style.backgroundColor='transparent'" >
                                                              <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;" >✈️</div>
                                                                < div style = "font-size: 12px; color: #5f6368;" > Travel </div>
                                                                  </div>

                                                                  < div data - interaction - id="open_shopping" style = "cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover = "this.style.backgroundColor='#f8f9fa'" onmouseout = "this.style.backgroundColor='transparent'" >
                                                                    <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;" >🛒</div>
                                                                      < div style = "font-size: 12px; color: #5f6368;" > Shopping </div>
                                                                        </div>

                                                                        < div data - interaction - id="open_games" style = "cursor: pointer; text-align: center; padding: 15px; border-radius: 8px; transition: background-color 0.2s;" onmouseover = "this.style.backgroundColor='#f8f9fa'" onmouseout = "this.style.backgroundColor='transparent'" >
                                                                          <div style="width: 48px; height: 48px; background-color: #1a73e8; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;" >🎮</div>
                                                                            < div style = "font-size: 12px; color: #5f6368;" > Games </div>
                                                                              </div>

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
