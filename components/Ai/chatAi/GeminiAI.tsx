import { ChatMessage } from "./ChatTypes";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API as string;
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(API_KEY || "");
export const handleGenerateContent = async (
  message: ChatMessage[],
  newPrompt: string
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: message,
      generationConfig: {
        maxOutputTokens: 20000,
      },
    });
    console.log("handleGenerateContent-model:", model);
    console.log("handleGenerateContent-genAI:", genAI);

    const result = await chat.sendMessage(newPrompt);
    const response = await result.response;
    console.log("handleGenerateContent-response:", response);

    const text = await response.text(); // 注意这里要用 await
    console.log("text:", text);
    return text;
  } catch (error) {
    console.error("Error generating content:", error);

    // 进一步捕获并输出更多的错误信息
    if (error instanceof TypeError) {
      console.error("TypeError occurred:", error.message);
      console.error("TypeError stack trace:", error.stack);
    } else {
      console.error("Unexpected error occurred:", error);
    }

    return "An error occurred while generating content.";
  }
};

export const startChatAndSendMessageStream = async (
  history: ChatMessage[],
  newMessage: string
) => {
  const geminiAI = new GoogleGenerativeAI(API_KEY);

  const model = geminiAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role,
      parts: msg.parts, // Join parts into a single string
    })),
    generationConfig: {
      maxOutputTokens: 8000,
    },
  });

  // Use sendMessageStream for streaming responses
  const result = await chat.sendMessageStream(newMessage);
  return result.stream;
};
