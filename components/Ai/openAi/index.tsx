"use client";
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Link from "next/link";
import styles from "@/styles/chatAi/Gemini.module.css";
import { CommentEditor } from "@/components/assembly/comment-editor/index";
import { GeminiSVG } from "@/components/utils/icons";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import OpenAI from "openai";

const key = process.env.NEXT_PUBLIC_OPENAI_KEY;
const genAI = new GoogleGenerativeAI(key!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const openai = new OpenAI({
    organization: "org-zUCEVvY5fWaAs1r2hYGDToT6",
    project: "proj_aHUt6XgXDrWxE54nZJB7tlBV",
});

type Message = {
    role: "user" | "model";
    parts: { text: string }[];
};

const handleOpenAi = async()=>{
    const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Say this is a test" }],
        stream: true,
    });
    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
}
export default function AiComponent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const latestMessagesRef = useRef<Message[]>([]);

    useEffect(() => {
        latestMessagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (text: string, files: File[]) => {
        if (!text.trim()) return;

        const userMessage: Message = { role: "user", parts: [{ text }] };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const chat = model.startChat({
                history: latestMessagesRef.current,
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const result = await chat.sendMessageStream(text);
            let fullResponse = "";
            const modelMessage: Message = { role: "model", parts: [{ text: "" }] };

            setMessages((prev) => [...prev, modelMessage]);

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullResponse += chunkText;
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].parts[0].text = fullResponse;
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setMessages((prev) => [
                ...prev,
                { role: "model", parts: [{ text: "抱歉，发生了一个错误。" }] },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessageContent = (message: Message) => {
        return (
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        const codeContent = String(children).replace(/\n$/, "");

                        return inline ? (
                            <code>{children}</code>
                        ) : (
                            <div className="relative">
                                <SyntaxHighlighter
                                    style={okaidia}
                                    language={match ? match[1] : ""}
                                >
                                    {codeContent}
                                </SyntaxHighlighter>
                                <CopyToClipboard text={codeContent}>
                                    <button
                                        className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white bg-gray-700 rounded hover:bg-gray-600"
                                        onClick={() => alert("代码已复制！")}
                                    >
                                        复制
                                    </button>
                                </CopyToClipboard>
                            </div>
                        );
                    },
                }}
            >
                {message.parts[0].text}
            </ReactMarkdown>
        );
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.box}>
                    <div className={styles.title}>
                        <GeminiSVG width={45} height={45} />
                        <h1>
                            Gemini Pro <span className={styles.ideasText}>Chat</span>
                            <Link href="/ai" className="d_c_c">
                                🧙🏾‍♂️
                            </Link>
                        </h1>
                        <p>
                            Based on Gemini Pro API from <Link href="/">DeepCosmo</Link>
                        </p>
                    </div>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"
                                }`}
                        >
                            <div
                                className={`inline-block p-2 rounded-lg overflow-hidden max-w-full ${message.role === "user"
                                        ? "bg-[#18181b] text-primary-foreground"
                                        : "bg-[#f4f4f5] text-[#18181b] text-sm space-y-4 break-words space-x-2"
                                    }`}
                            >
                                {renderMessageContent(message)}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className={styles.editor}>
                <CommentEditor
                    onCallback={handleSend}
                    placeholder="在这里输入你的问题"
                    isLoading={isLoading}
                    uploadImgSeting={{ allowMultiple: true, maxFileCount: 4 }}
                />
            </div>
        </>
    );
}
