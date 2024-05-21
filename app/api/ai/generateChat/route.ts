import { handleGenerateContent } from "@/components/Ai/chatAi/GeminiAI";

export async function POST(request: Request) {
  const requestBody = await request.json();
  try {

    const { history, prompt } = requestBody;
    const response = await handleGenerateContent(history, prompt);
    console.log("handleGenerateContent-response:", response);
    
    return new Response(JSON.stringify({
      data: true,
      message: response
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    console.log("handleGenerateContent-error:", error);
    return new Response(JSON.stringify({
      data: false,
      message:error.message,
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}