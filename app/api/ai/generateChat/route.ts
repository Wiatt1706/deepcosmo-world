import { getGenerateChat } from "@/components/Ai/chatAi/GeminiAI";

export async function POST(request: Request) {
  const requestBody = await request.json();
  try {

    console.log("prompt-google:", requestBody);
    
    const messages = requestBody.messages;

    if (
      !messages ||
      messages.length === 0 ||
      messages[messages.length - 1].role !== "user"
    ) {
      return new Response(JSON.stringify({
        data: false,
        message:
          "Invalid message history: The last message must be from user role.",
      }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    const history = messages.slice(0, -1); // All messages except the last one
    const newMessage = messages[messages.length - 1].parts;

    return new Response(JSON.stringify({
      data: false,
      message: await getGenerateChat(history, newMessage)
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    
    return new Response(JSON.stringify({
      data: false,
      message:error.message,
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}


// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     res.status(405).end(); // 不允许除 DELETE 请求之外的其他请求方法
//     return;
//   }
//   // 从请求参数中获取目标文章的ID
//   const { prompt } = req.body;
//   console.log("prompt-google:", prompt);
  
//   try {
//     res.status(200).json({ data: false, message: getGenerate(prompt) });
//   } catch (error) {
//     console.error("Error pages/api/ai/generate:", error);
//     res.status(500).json({ data: false, message: "服务器错误" });
//   }
// }
