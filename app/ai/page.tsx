"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "@/styles/chatAi/Gemini.module.css";
import { CommentEditor } from "@/components/assembly/comment-editor/index";
import { GeminiSVG } from "@/components/utils/icons";
import ChatList from "../../components/Ai/chatAi/ChatList";
import { ChatMessage } from "@/components/Ai/chatAi/ChatTypes";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { post } from "@/utils/api";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API;

const genAI = new GoogleGenerativeAI(API_KEY || "");

const fileToGenerativePart = (data: string, mimeType: string) => ({
  inlineData: {
    data: data,
    mimeType,
  },
});

const handleGenerateContent = async (
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

    const result = await chat.sendMessage(newPrompt);
    console.log("result:", result);
    const response = await result.response;
    const text = response.text();
    console.log("text:", text);

    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "An error occurred while generating content.";
  }
};

const handleGenerateImgContent = async (prompt: string, files: File[]) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  try {
    const imageParts = await Promise.all(
      files.map(async (file) => {
        const dataUrl = await readFileAsDataURL(file);
        const base64Data = dataUrl.split(",")[1];
        return fileToGenerativePart(base64Data, file.type);
      })
    );

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating image content:", error);
    return "An error occurred while generating image content.";
  }
};

const PostPage: React.FC = () => {
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const addItem = (role: string, text: string) => {
    setChatList((prev) => [...prev, { role, parts: [{ text }] }]);
  };

  const handleCallback = async (prompt: string, files: File[]) => {
    setLoading(true);

    addItem("user", prompt);

    const responseText = files.length
      ? await handleGenerateImgContent(prompt, files)
      : await getGenerate(chatList, prompt);

    addItem("model", responseText);
    setLoading(false);
  };

  const getGenerate = async (message: ChatMessage[], newPrompt: string) => {
    try {
      const response = await post(`/ai/generateChat`, {
        history: message,
        prompt: newPrompt,
      });

      console.log("response:", response);

      if (!response.data) {
        throw new Error(response.data.message);
      }
      return response.message;
    } catch (error) {
      console.error("生成文本时发生错误:", error);
      // 提供用户友好的提示
      return "抱歉，无法生成文本。请尝试使用不同的提示或稍后再试。";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.title}>
          <GeminiSVG width={45} height={45} />
          <h1>
            Gemini Pro <span className={styles.ideasText}>Chat</span>
            <Link href="/ai/pro" className="d_c_c">
              🧙🏾‍♂️
            </Link>
          </h1>
          <p>
            Based on Gemini Pro API from <Link href="/">DeepCosmo</Link>
          </p>
        </div>
        <ChatList isLoading={isLoading} chatList={chatList} />
        <div className={styles.editor}>
          <CommentEditor
            onCallback={handleCallback}
            placeholder="在这里输入你的问题"
            isLoading={isLoading}
            uploadImgSeting={{ allowMultiple: true, maxFileCount: 4 }}
          />
        </div>
      </div>
    </div>
  );
};

export default PostPage;
