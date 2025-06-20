import { generateNextScreenStream } from "@/app/actions/generate-ui";

export async function POST(request: Request) {
    console.log('🔥 API Route: POST /api/generate-screen called');

    try {
        const body = await request.json();
        const { currentContent, interactionId, timestamp, modelId } = body;

        console.log('📝 Request data:', {
            interactionId,
            contentLength: currentContent?.length || 0,
            timestamp: new Date(timestamp).toISOString(),
            modelId: modelId || 'gemini-2.5-flash-lite-preview-06-17'
        });

        // Validate input
        if (!currentContent || !interactionId) {
            console.error('❌ Missing required fields:', { currentContent: !!currentContent, interactionId: !!interactionId });
            return new Response("Missing required fields", { status: 400 });
        }

        console.log('🤖 Calling generateNextScreenStream...');
        // Generate and stream the response
        const response = await generateNextScreenStream({
            currentContent,
            interactionId,
            timestamp,
            modelId,
        });

        console.log('✅ Generated response:', response);
        return response;
    } catch (error) {
        console.error("❌ Error in generate-screen API:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
} 