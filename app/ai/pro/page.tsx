"use client";
import React, { useState, useEffect } from "react";
import { BiTransfer } from "react-icons/bi";
import Link from "next/link";
import styles from "@/styles/chatAi/Gemini.module.css";
import { CommentEditor } from "@/components/assembly/comment-editor/index";
import { post } from "@/utils/api";
import { GeminiSVG } from "@/components/utils/icons";
import { ChatMessage } from "@/components/Ai/chatAi/ChatTypes";
import ChatList from "@/components/Ai/chatAi/ChatList";

export default function PostPage() {
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const [initPrompt, setInitPrompt] = useState<ChatMessage>({
    role: "user",
    parts: [{ text: "" }],
  });
  const [isLoading, setLoading] = useState<boolean>(false);

  const addItem = (role: string, text: string) => {
    setChatList((prev: ChatMessage[]) => [
      ...prev,
      { role, parts: [{ text }] },
    ]);
  };

  const handleCallback = async (prompt: string, file: any) => {
    setLoading(true);
    let newChatList = [
      ...chatList,
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];
    addItem("user", prompt);
    const responseText = await getGenerate([initPrompt, ...newChatList]);
    addItem("model", responseText);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://eegfenfqcrjipcekjgni.supabase.co/storage/v1/object/public/deepcosmo_file/chartAi/prompt.txt"
        );
        const data = await response.text();

        setInitPrompt({
          role: "user",
          parts: [{ text: data }],
        });

        setLoading(true);
        const newChatList = [
          {
            role: "user",
            parts: [{ text: data }],
          },
        ];
        const responseText = await getGenerate(newChatList);
        addItem("model", responseText);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching text data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  const getGenerate = async (messages: ChatMessage[]) => {
    try {
      const response = await post(`/ai/generateChat`, { messages });

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      return response.data.message;
    } catch (error) {
      console.error("生成文本时发生错误:", error);
      // 提供用户友好的提示
      return "抱歉，无法生成文本。请尝试使用不同的提示或稍后再试。";
    }
  };

  const scrollToBottom = () => {
    let elementHeight: number = 400;

    window.scrollTo({
      top: document.documentElement.scrollHeight + elementHeight,
      behavior: "smooth", // 使用 smooth 滚动效果
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.title}>
          <GeminiSVG width={45} height={45} />
          <h1>
            Gemini Pro <span className={styles.ideasText}>ProfSynapse</span>{" "}
            <Link href="/ai" className="d_c_c">
              <BiTransfer />
            </Link>
          </h1>
          <p>
            Based on Gemini Pro API from <Link href="/">DeepCosmo</Link>
          </p>
        </div>
        <ChatList isLoading={isLoading} chatList={chatList} />

        <div className={styles["editor"]}>
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
}
