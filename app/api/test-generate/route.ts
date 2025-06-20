import { generateNextScreen } from "@/app/actions/generate-ui";

export async function POST(request: Request) {
    console.log('🧪 TEST API Route: POST /api/test-generate called');

    try {
        const body = await request.json();
        const { currentContent, interactionId, timestamp, modelId } = body;

        console.log('📝 Test request data:', {
            interactionId,
            contentLength: currentContent?.length || 0,
            modelId: modelId || 'gemini-2.5-flash-lite-preview-06-17'
        });

        // Validate input
        if (!currentContent || !interactionId) {
            console.error('❌ Missing required fields');
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log('🤖 Calling generateNextScreen (non-streaming)...');
        // Generate without streaming
        const result = await generateNextScreen({
            currentContent,
            interactionId,
            timestamp,
            modelId,
        });

        console.log('✅ Non-streaming result:', {
            success: result.success,
            contentLength: result.content?.length || 0
        });

        return Response.json(result);
    } catch (error) {
        console.error("❌ Error in test-generate API:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 