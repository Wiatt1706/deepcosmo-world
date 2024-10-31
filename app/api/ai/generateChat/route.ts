// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const key = process.env.NEXT_PUBLIC_GEMINI_API;
const genAI = new GoogleGenerativeAI(key!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: Request) {
  const { history, text } = await request.json();

  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  console.log('text：', text);

  const responseStream = new ReadableStream({
    async start(controller) {
      try {
        const result = await chat.sendMessageStream(text);
        for await (const chunk of result.stream) {
          controller.enqueue(new TextEncoder().encode(JSON.stringify(chunk.text())));
        }
      } catch (error) {
        console.error("Error calling Gemini API:", error);
        controller.enqueue(new TextEncoder().encode("抱歉，发生了一个错误"));
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(responseStream, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
