# Gemini Computer - Non-Deterministic OS Prototype

A functional, interactive web-based prototype of a conceptual operating system where every UI screen is generated in real-time by AI.

## Key Features

- **Non-Deterministic Interface**: Each interaction can produce different results, making the OS unpredictable and creative
- **Real-Time AI Generation**: Every screen is generated instantly by Google's Gemini 2.5 Flash-Lite model with streaming
- **Streaming UI Generation**: Watch interfaces build in real-time as the AI generates HTML progressively
- **Operating System Simulation**: Desktop with apps like Documents, Settings, Travel, Calculator, and more
- **Dynamic Content**: File explorers, settings panels, and applications with content that changes each time

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set up Environment Variables**
   - Get your Google AI API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Get your LangSmith API key from [LangSmith](https://smith.langchain.com/)
   - Create a `.env.local` file in the project root
   - Add your API keys:
     ```
     GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
     LANGSMITH_TRACING=true
     LANGSMITH_API_KEY=your_langsmith_api_key_here
     ```

3. **Run the Development Server**
   ```bash
   pnpm dev
   ```

4. **Open the Application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Click on any app icon to experience the non-deterministic OS

## How It Works

1. **Initial Desktop**: Shows a grid of 10 application icons
2. **AI State Management**: Each click sends the current HTML and interaction ID to the AI
3. **Real-Time Generation**: The AI generates completely new HTML for the next screen
4. **Non-Deterministic Behavior**: Repeated actions produce different but plausible results

## Example Interactions

- **Documents Folder**: Each visit shows different files and folders
- **Travel App**: Might show a map search, trip planner, flight tracker, or weather app
- **Settings**: Access different system settings with generated content
- **All Apps**: Each launch can be slightly different while maintaining core functionality

## Technical Architecture

- **Frontend**: Next.js with React
- **AI Model**: Google Gemini 2.5 Flash-Lite with streaming support
- **State Management**: HTML-based state transitions with real-time streaming
- **Interaction System**: data-interaction-id attributes for click handling
- **Streaming**: Progressive HTML rendering for immediate feedback
- **Design System**: Clean, minimalist interface with consistent styling
- **Observability**: LangSmith tracing for AI operations monitoring and debugging

## LangSmith Tracing

This project includes LangSmith tracing to monitor and debug AI operations:

- **Automatic Tracing**: All AI SDK calls are automatically traced
- **Run Metadata**: Each trace includes interaction ID, timestamp, and content length
- **Debugging**: View AI model inputs, outputs, and performance metrics
- **Custom Run Names**: Traces are named based on the interaction type for easy identification

To view traces:
1. Set up your LangSmith API key in `.env.local`
2. Run the application and interact with the UI
3. Visit your [LangSmith dashboard](https://smith.langchain.com/) to view traces

## Non-Deterministic Examples

The same action can produce different results:

**Documents Folder Visit 1:**
- Report_Final.docx
- Meeting_Notes_2023.txt
- Photos (folder)
- Budget_Q4.xlsx

**Documents Folder Visit 2:**
- Vacation_Photos_July.zip
- Projects (folder)
- Notes_Meeting_08_15.txt
- Archive (folder)

This creates a unique, ever-changing computing experience that feels alive and creative. 