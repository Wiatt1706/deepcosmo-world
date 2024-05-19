import { getGenerate } from "@/components/Ai/chatAi/GeminiAI";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).end(); // 不允许除 DELETE 请求之外的其他请求方法
    return;
  }
  // 从请求参数中获取目标文章的ID
  const { prompt } = req.body;
  console.log("prompt-google:", prompt);
  
  try {
    res.status(200).json({ data: false, message: getGenerate(prompt) });
  } catch (error) {
    console.error("Error pages/api/ai/generate:", error);
    res.status(500).json({ data: false, message: "服务器错误" });
  }
}
